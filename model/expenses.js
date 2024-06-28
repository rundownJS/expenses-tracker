const mongoose = require("mongoose")
const { BadRequestError, NotFoundError } = require("../errors")
const _ = require("lodash")

//if the user wants to add an expense/income limit the options
const expenseIncomeOptions = {
    expense: {
        //and then have more options
        //expense => house => rent
        housing: ["rent", "mortgage", "property tax", "home insurance", "repairs & maintenance"],
        transportation: ["car payment", "car insurance", "fuel", "public transport", "parking fees", "ride-sharing (uber, lyft)"],
        food: ["groceries", "dining out", "delivery services", "coffee", "snacks"],
        utilities: ["electricity", "water", "gas", "internet", "cable/satellite", "phone"],
        health_wellness: ["doctor visits", "prescription medications", "over-the-counter medications", "gym membership", "therapy"],
        debt: ["credit card payment", "student loan payment", "personal loan payment", "other debt payments"],
        entertainment: ["movies", "concerts", "subscriptions (netflix, spotify)", "magazines", "hobbies"],
        clothing: ["everyday clothing", "work attire", "shoes", "accessories", "dry cleaning"],
        personal_care: ["haircut/styling", "skin care products", "cosmetics", "toiletries"],
        education: ["tuition", "books & supplies", "courses/classes", "online courses"],
        gifts_donations: ["gifts", "charity donations"],
        miscellaneous: ["pet care", "childcare", "home supplies", "legal fees", "travel"],
        other: ["other"]
    },
    income: {
        salary: ["regular salary/wage", "overtime pay", "bonuses", "commision"],
        business_income: ["sales revenue", "service income", "freelance work", "consulting fees"],
        investments: ["dividents", "interest income", "capital gains", "rental income"],
        government_payments: ["social security benefits", "unemployed benefits", "disability benefits", "child support"],
        retirement_income: ["pension", "annuities"],
        gifts_inheritance: ["cash gifts", "inheritances", "monetary awards"],
        scholarship_grants: ["educational scholarship", "research grants", "fellowships"],
        other_income: ["royalties", "alimony", "lottery winnings", "sale of assets", "side job/gig"],
        other: ["other"]
    }
}

const ExpensesSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["expense", "income"]
    },
    typeofExpenseIncome:{
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return this.type && expenseIncomeOptions[this.type] && expenseIncomeOptions[this.type][value]
            }
        }
    },
    subtypeofExpenseIncome: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return this.type && this.typeofExpenseIncome && expenseIncomeOptions[this.type][this.typeofExpenseIncome].includes(value)
            }
        }
    },
    recurring: {
        type: Boolean,
        default: false,
        validate: {
            validator: function(value){
                return typeof value === "boolean"
            }
        }
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: true,
        validate: {
            validator: function(value){
                return value > 0 && value <= 9999999
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        immutable: true
    },
    history: {
        changes: [mongoose.Schema.Types.Mixed]
    }

}, {timestamps: true})



//check validators again before updating
//this is done to prevent mistakes when updating data
//also change the history property 
ExpensesSchema.pre("findOneAndUpdate", async function(next){
    
    const update = this.getUpdate()
    const query = this.getQuery()

    const docToUpdate = await this.model.findOne(query).exec()
        
    if(!docToUpdate) {
        throw new NotFoundError("Document not found")
    }

    //capture the original before the update
    const originalDoc = docToUpdate.toObject()

    // Merge the update into the current document
    const mergedDoc = { ...originalDoc, ...update }

    // Validate the merged document
    if(!["expense", "income"].includes(mergedDoc.type)){
        throw new BadRequestError(`Invalid type: ${mergedDoc.type}`)
        
        //return res.status(400).json({ msg: `Invalid type: ${mergedDoc.type}` })
    }

    const type = mergedDoc.type;
    const typeofExpenseIncome = mergedDoc.typeofExpenseIncome;

    if(!expenseIncomeOptions[type] || !expenseIncomeOptions[type].hasOwnProperty(typeofExpenseIncome)){
        throw new BadRequestError(`Invalid typeofExpenseIncome: ${mergedDoc.typeofExpenseIncome} for ${mergedDoc.type}`)
        
        //return next(new Error(`Invalid typeofExpenseIncome: ${mergedDoc.typeofExpenseIncome} for ${mergedDoc.type}`))
    }

    if(!expenseIncomeOptions[type][typeofExpenseIncome].includes(mergedDoc.subtypeofExpenseIncome)){
        throw new BadRequestError(`Invalid subtypeofExpenseIncome: ${mergedDoc.subtypeofExpenseIncome} for ${typeofExpenseIncome}`)
        
        //return next(new Error(`Invalid subtypeofExpenseIncome: ${mergedDoc.subtypeofExpenseIncome} for ${typeofExpenseIncome}`))
    }

    if(typeof mergedDoc.recurring !== "boolean"){
        throw new BadRequestError("Recurring can only be 'true' or 'false'")
    }

    //see what changes are made
    const changes = {}
    Object.keys(update).forEach(key =>{
        if(this.schema.paths[key]){
            if(!_.isEqual(originalDoc[key], update[key])){
                changes[key] = {
                    old: originalDoc[key],
                    new: update[key]
                }
            }
        }
    })

    //update the history property
    docToUpdate.history.changes = []
    docToUpdate.history.changes.push(changes)

    await docToUpdate.save()

    next()
})

module.exports = mongoose.model("Expenses", ExpensesSchema)