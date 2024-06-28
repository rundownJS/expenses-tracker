const Expenses = require("../model/expenses")

//create an expense/income
const createExpenseIncome = async (req, res) =>{

    const { type, typeofExpenseIncome, subtypeofExpenseIncome, amount } = req.body
    const createdBy = req.authorizedUser.userID

    if(!type || !typeofExpenseIncome || !subtypeofExpenseIncome || !amount || !createdBy){
        return res.status(400).json({ msg: "Cannot create an expense/ income" })
    }

    const requestObject = {
        type,
        typeofExpenseIncome,
        subtypeofExpenseIncome,
        amount,
        createdBy
    }

    if(req.body.recurring === true){
        requestObject.recurring = req.body.recurring
    }
    
    const create = await Expenses.create( requestObject )

    return res.status(201).json({ create })
}

//get all expenses/incomes matching the user id
const getAllUserCreated = async (req, res) =>{

    const createdBy = req.authorizedUser.userID

    if(!createdBy){
        return res.status(400).json({ msg: "No expense/ income creator provided" })
    }

    const data = await Expenses.find({ createdBy })

    if(!data.length){
        return res.status(404).json({ msg: "No expenses/ incomes found by user" })
    }

    return res.status(200).json({ data })
}

//get a single expense/income by its id
const getOneExpenseIncome = async (req, res) =>{
    
    const documentID = req.headers.documentid

    if(!documentID){
        return res.status(400).json({ msg: "Provide a valid expense/ income ID" })
    }

    const data = await Expenses.findById( documentID )

    if(!data){
        return res.status(404).json({ msg: `Did not find any data matching ID: ${documentID}` })
    }

    return res.status(200).json({ data })
}

//update a ceratin expense/ income by id
const updateExpenseIncome = async (req, res) =>{
    
    const { type, typeofExpenseIncome, subtypeofExpenseIncome, recurring, amount } = req.body
    const documentID = req.body.documentid

    const queryObject = {}

    if(!documentID){
        return res.status(400).json({ msg: "Provide a valid expense/ income ID" })
    }

    if(type){
        queryObject.type = type
    }
    if(typeofExpenseIncome){
        queryObject.typeofExpenseIncome = typeofExpenseIncome
    }
    if(subtypeofExpenseIncome){
        queryObject.subtypeofExpenseIncome = subtypeofExpenseIncome
    }
    if(typeof recurring === "boolean"){
        queryObject.recurring = recurring
    }
    if(amount){
        queryObject.amount = amount
    }

    const checkIfEmpty = (obj) =>{
        return Object.keys(obj).length === 0
    }

    if(checkIfEmpty(queryObject)){
        return res.status(400).json({ msg: "No data to update" })
    }

    //id, fields to update, options (VERY IMPORTANT) return the new, run validators
    const updateData = await Expenses.findByIdAndUpdate( documentID, queryObject, {new:true, runValidators: true} )

    if(!updateData){
        return res.status(400).json({ msg: `Could not update data with ID ${documentID}` })
    }

    return res.status(200).json({ updateData })
}

//delete by id
const deleteExpenseIncome = async (req, res) =>{
    
    const documentID = req.headers.documentid

    if(!documentID){
        return res.status(400).json({ msg: "Provide a valid expense/ income ID" })
    }

    const data = await Expenses.findByIdAndDelete( documentID )

    if(!data){
        return res.status(404).json({ msg: `Did not find any data matching ID: ${documentID}` })
    }

    return res.status(200).json({ success:true })

}

module.exports = {
    createExpenseIncome,
    getAllUserCreated,
    getOneExpenseIncome,
    updateExpenseIncome,
    deleteExpenseIncome
}