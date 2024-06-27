const verifyJWT = async () =>{
    const jsonwebtoken = localStorage.getItem("token")

    if(!jsonwebtoken){
        setTimeout(() => {
            window.location.pathname = "/login"
        }, 1000);
    }else{
        try{
            const request = await fetch(`/expenses-tracker/api/v1/authUser/verifyJWT`, {
                headers: {
                    'token': `${jsonwebtoken}`,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            })
    
            const data = await request.json()

            if(data.success){
                //console.log(data)
                document.title = `Expenses Tracker: ${data.data.name}'s Dashboard`

                //call a specific function which will display all the elements
                setTimeout(() => {
                    CORE_FUNCTION(data, jsonwebtoken)
                }, 500);
            }else{
                setTimeout(() => {
                    window.location.pathname = "/login"
                }, 1000)
            }
        }catch(err){
            console.log(err)
        }
    }
}
verifyJWT()

//make the elements
//handle everyhting else
//making a new expense and whatever else i think of
const CORE_FUNCTION = (data, token) =>{
    const PAGE_CONTENT = document.querySelector(".content")

    //set the view for the user
    //let the user see all his tasks 
    //if none urge him to create one
    const getAllUserCreated = async () =>{
        try{
            const getReqeust = await fetch(`/expenses-tracker/api/v1/expenses/get-all-user-created`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer= ${token}`
                }
            })
    
            const data = await getReqeust.json()
    
            //call page set function with what we got
            //the function will handle an error
            return data
            
            //console.log(data)
            
        }catch(err){
            console.log(err)
        }
    }

    //to get a single one the function needs to be fed with an id leading to the document
    const getOneExpenseIncome = async () =>{
        try{
            const getReqeust = await fetch(`/expenses-tracker/api/v1/expenses/get-single-expense-income`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer= ${token}`
                }
            })

            const data = await getReqeust.json()
    
            console.log(data)
             
        }catch(err){
            console.log(err)
        }
    }

    const createNewExpenseIncome = async (reqBody) =>{
        try {
            const postRequest = await fetch(`/expenses-tracker/api/v1/expenses/create-expense-income`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer= ${token}`,
                    "Content-Type": "application/json"
                },
                body: reqBody
            })

            const data = await postRequest.json()

            return data

        } catch (err) {
            console.log(err)
        }
    }

    //display elements    
    //page load => core function => 
    //getAll function if there is data => 
    //set them this way || no data => set them that way
    const SET_ELEMENTS = async () =>{
        let expenseData = await getAllUserCreated()

        const BAR_CHART_ELEMENT = document.querySelector(".bar-chart-element")
        const EXPENSES_DONUT_ELEMENT = document.querySelector(".expense-donut")
        const INCOME_DONUT_ELEMENT = document.querySelector(".income-donut")
        
        const ADDITIONAL_ELEMENT = document.querySelector(".additional-element")

        const barChartSet = () =>{

            if(expenseData.data){
                console.log(true)
            }else{
                BAR_CHART_ELEMENT.innerHTML = `
                <span class="empty-bar">You don't track any expenses currently!</span>
                `
            }
        }
        barChartSet()

        const donutsChartSet = () =>{
            //CANCEL BUTTON EVENT
            const creatingExpense = () =>{
                //FINAL USED IN REQUEST
                let FINAL_CATEGORY = ""
                let FINAL_EXPENSE = ""
                let RECURRING = false //initially
                let FINAL_AMOUNT_VALUE = 0

                //WHEN CALLING THIS FUNCTION IT OPENS THE CREATE CARD
                ADDITIONAL_ELEMENT.innerHTML = `
                <div class="parent">
                    <div class="create-card">
                        <span class="create-title">Create New Expense</span>

                        <span class="small-text">Category</span>

                        <div class="category-dropdown-wrapper">
                            <div class="dropdown-parent">
                                <span>Choose Category</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                            </div>

                            <div class="dropdown-absolute">
                                <span data-category="housing" class="pick">Housing</span>
                                <span data-category="transportation" class="pick">Transportation</span>
                                <span data-category="food" class="pick">Food</span>
                                <span data-category="utilities" class="pick">Utilities</span>
                                <span data-category="health_wellness" class="pick">Health Wellness</span>
                                <span data-category="debt" class="pick">Debt</span>
                                <span data-category="entertainment" class="pick">Entertainment</span>
                                <span data-category="clothing" class="pick">Clothing</span>
                                <span data-category="personal_care" class="pick">Personal Care</span>
                                <span data-category="education" class="pick">Education</span>
                                <span data-category="gifts_donations" class="pick">Gifts & Donations</span>
                                <span data-category="miscellaneous" class="pick">Miscellaneous</span>
                                <span data-category="other" class="pick">Other</span>
                            </div>
                        </div>

                        <span class="small-text">Expense</span>

                        <div class="expense-dropdown-wrapper">
                            <div class="disabled dropdown-parent-second">
                                <span>Choose Category First</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                            </div>

                            <div class="dropdown-absolute-second"></div>
                        </div>


                        <div class="recurring-wrap">
                            <span>Is the expense Recurring?</span>
                            <span class="extra-info">?</span>

                            <span class="info-absolute">Will the expense occur every month, or is it a one-time expense?</span>
                        </div>

                        <div class="recurring-yes-no-wrap">
                            <span class="recurring-yes">Yes</span>
                            <span class="recurring-no selected">No</span>
                        </div>


                        <span class="small-text">Amount ($)</span>

                        <div class="input-wrapper">
                            <input min="1" max="9999999" id="expense-amount" type="number" placeholder="E.g. $1,000">

                            <span class="error-text number"></span>
                        </div>

                        <div class="buttons-wrapper">
                            <div class="cancel">Cancel</div>
                            <div class="create invalid">Create</div>
                        </div>

                        <div class="successful">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                            </div>
                            <span>Created</span>
                        </div>
                    </div>
                </div>
                `

                //ERROR SPANS
                const amount_error = document.querySelector(".error-text.number")

                //DROPDOWNS
                const dropdownParent = document.querySelector(".dropdown-parent")
                const dropdownAbsolute = document.querySelector(".dropdown-absolute")
                const categoryPicks = document.querySelectorAll(".pick")

                const categorySpan = document.querySelector(".dropdown-parent > span")

                //second dropdown
                const dropdownSECOND = document.querySelector(".dropdown-parent-second")
                const dropdownAbsoluteSECOND = document.querySelector(".dropdown-absolute-second")
                
                const expenseSpan = document.querySelector(".dropdown-parent-second > span")

                //DROPDOWN EVENT
                dropdownParent.addEventListener("click", (e)=>{
                    e.stopPropagation()
                    dropdownAbsolute.style.display = "flex"
                    dropdownAbsoluteSECOND.style.display = "none"
                    extraInfoText.style.display = "none"
                })

                for(let i = 0; i < categoryPicks.length; i++){
                    categoryPicks[i].addEventListener("click", ()=>{
                        //console.log(categoryPicks[i].dataset.category)
                        
                        categorySpan.dataset.category = categoryPicks[i].dataset.category
                        categorySpan.textContent = categoryPicks[i].textContent
                        
                        if(dropdownSECOND.classList.contains("disabled")){
                            dropdownSECOND.classList.remove("disabled")
                        }
                        expenseSpan.textContent = "Choose Expense"
                        FINAL_CATEGORY = categoryPicks[i].dataset.category
                        FINAL_EXPENSE = ""

                        eventHandlerExpense(i)
                        validRequestChecker()
                    })
                }

                //THE SECOND DROPDOWN EVENT HANDLER
                const eventHandlerExpense = (index) =>{
                    const allPossibleExpenses = [
                        ["rent", "mortgage", "property tax", "home insurance", "repairs & maintenance"],
                        ["car payment", "car insurance", "fuel", "public transport", "parking fees", "ride-sharing (uber, lyft)"],
                        ["groceries", "dining out", "delivery services", "coffee", "snacks"],
                        ["electricity", "water", "gas", "internet", "cable/satellite", "phone"],
                        ["doctor visits", "prescription medications", "over-the-counter medications", "gym membership", "therapy"],
                        ["credit card payment", "student loan payment", "personal loan payment", "other debt payments"],
                        ["movies", "concerts", "subscriptions (netflix, spotify)", "magazines", "hobbies"],
                        ["everyday clothing", "work attire", "shoes", "accessories", "dry cleaning"],
                        ["haircut/styling", "skin care products", "cosmetics", "toiletries"],
                        ["tuition", "books & supplies", "courses/classes", "online courses"],
                        ["gifts", "charity donations"],
                        ["pet care", "childcare", "home supplies", "legal fees", "travel"],
                        ["other"]
                    ]

                    const replaceCharacters = (str) =>{
                        const words = str.split(/(\s+|\(|\)|\/|,)/)

                        const wordCount = words.filter(word => /\w/.test(word)).length

                        for(let i = 0; i < words.length; i++){
                            if (/\w/.test(words[i])){
                                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
                            }
                        }
                        
                        return words.join("")
                    }

                    dropdownAbsoluteSECOND.style.minWidth = dropdownSECOND.clientWidth + "px"
                    dropdownAbsoluteSECOND.innerHTML = ``
                    for(let j = 0; j < allPossibleExpenses[index].length; j++){
                        //console.log(replaceCharacters(allPossibleExpenses[index][j]))

                        const expensePick = document.createElement("span")
                        expensePick.classList.add("expense-pick")

                        if(allPossibleExpenses[index].length <= 3){
                            expensePick.style.padding = "5px 8px"
                        }

                        expensePick.dataset.expense = allPossibleExpenses[index][j]
                        expensePick.textContent = replaceCharacters(allPossibleExpenses[index][j])

                        dropdownAbsoluteSECOND.appendChild(expensePick)

                        expensePick.addEventListener("click", ()=>{
                            expenseSpan.textContent = replaceCharacters(allPossibleExpenses[index][j])
                            FINAL_EXPENSE = allPossibleExpenses[index][j]

                            validRequestChecker()
                        })
                    }
                }

                dropdownSECOND.addEventListener("click", (e)=>{
                    if(!dropdownSECOND.classList.contains("disabled")){
                        e.stopPropagation()
                        dropdownAbsoluteSECOND.style.display = "flex"
                        dropdownAbsolute.style.display = "none"
                        extraInfoText.style.display = "none"
                    }
                })

                //CANCEL BUTTON FUNCTIONALITY
                //IF THERE ARE EXPENSES IT WILL CALL THE CHART
                const cancelButton = document.querySelector(".cancel")
                cancelButton.addEventListener("click", ()=>{
                    if(parent.classList.contains("show")){
                        parent.classList.remove("show")
                        parent.classList.add("hide")
    
                        ADDITIONAL_ELEMENT.classList.remove("show")
                        ADDITIONAL_ELEMENT.classList.add("hide")
    
                        parent.addEventListener("animationend", ()=>{
                            parent.classList.remove("hide")
                            ADDITIONAL_ELEMENT.classList.remove("hide")
                            document.body.style.overflow = "auto"

                            ADDITIONAL_ELEMENT.innerHTML =``
                        })
                    }
                })

                //RECURRING FUNCTIONALITY
                const recurringButtonYes = document.querySelector(".recurring-yes")
                const recurringButtonNo = document.querySelector(".recurring-no")
                const recurringExtraInfo = document.querySelector(".extra-info")

                recurringButtonNo.addEventListener("click", ()=>{
                    recurringButtonYes.classList.remove("selected")
                    recurringButtonNo.classList.add("selected")

                    RECURRING = false
                })
                recurringButtonYes.addEventListener("click", ()=>{
                    recurringButtonYes.classList.add("selected")
                    recurringButtonNo.classList.remove("selected")

                    RECURRING = true
                })

                //EXTRA INFO ON HOVER (CLICK ON A SMALLER SCREEN)
                const extraInfoText = document.querySelector(".info-absolute")
                recurringExtraInfo.addEventListener("click", (e)=>{
                    if(window.innerWidth < 600){
                        e.stopPropagation()
                        extraInfoText.style.display = "block"
                        dropdownAbsolute.style.display = "none"
                        dropdownAbsoluteSECOND.style.display = "none"
                    }
                })
                recurringExtraInfo.addEventListener("mouseover", ()=>{
                    if(window.innerWidth >= 600){
                        extraInfoText.style.display = "block"
                    }
                })
                recurringExtraInfo.addEventListener("mouseleave", ()=>{
                    if(window.innerWidth >= 600){
                        extraInfoText.style.display = "none"
                    }
                })

                //INPUT VALIDATING
                const amountNumberInput = document.querySelector("#expense-amount")
                amountNumberInput.addEventListener("keypress", (e)=>{
                    //based on the keycode only keep the numbers and decimal dot (".")
                    //console.log(e.keyCode)
                    const charCode = (e.which) ? e.which : e.keyCode
                    const number_amount = amountNumberInput.value
                    const dotIndex = number_amount.indexOf(".")

                    if(number_amount.startsWith("0")){
                        e.preventDefault()
                    }
                    if(number_amount.length === 0 && charCode === 46){
                        e.preventDefault()
                    }

                    if(charCode > 31 && (charCode !== 46 && (charCode < 48 || charCode > 57))){
                        e.preventDefault()
                    }else if(dotIndex !== -1 && number_amount.length - dotIndex > 2 && (charCode >= 48 && charCode <= 57)){
                        //prevent more than 2 after the decimal
                        e.preventDefault()
                    }

                })
                amountNumberInput.addEventListener("input", ()=>{
                    const inputAsNumber = Number(amountNumberInput.value)
                    
                    amountNumberInput.classList.remove("invalid")
                    amount_error.textContent = ""

                    if(amountNumberInput.value.length && inputAsNumber < 1){
                        
                        amountNumberInput.classList.add("invalid")
                        amount_error.textContent = "Amount should be at least $1!"
                    }else if(amountNumberInput.value.length && inputAsNumber > 9999999){
                        
                        amountNumberInput.classList.add("invalid")
                        amount_error.textContent = "Amount should be less than $9,999,999"
                    }

                    FINAL_AMOUNT_VALUE = inputAsNumber
                    validRequestChecker()
                })

                const parent = document.querySelector(".parent")
                parent.classList.add("show")

                parent.addEventListener("click", (e)=>{
                    e.stopPropagation()
                    dropdownAbsolute.style.display = "none"
                    dropdownAbsoluteSECOND.style.display = "none"
                    extraInfoText.style.display = "none"
                })

                //WINDOW EVENT CLOSING EVERYHTING
                window.addEventListener("click", ()=>{
                    if(parent.classList.contains("show")){
                        parent.classList.remove("show")
                        parent.classList.add("hide")
    
                        ADDITIONAL_ELEMENT.classList.remove("show")
                        ADDITIONAL_ELEMENT.classList.add("hide")
    
                        parent.addEventListener("animationend", ()=>{
                            parent.classList.remove("hide")
                            ADDITIONAL_ELEMENT.classList.remove("hide")
                            document.body.style.overflow = "auto"

                            ADDITIONAL_ELEMENT.innerHTML =``
                        })
                    }
                })


                //THE VALIDATORS TO ENABLE THE BUTTON
                const createButton = document.querySelector(".create")
                const validRequestChecker = () =>{
                    if(!FINAL_CATEGORY || !FINAL_EXPENSE || FINAL_AMOUNT_VALUE <= 0){
                        createButton.classList.add("invalid")
                        return 
                    }else if(FINAL_AMOUNT_VALUE > 9999999){
                        createButton.classList.add("invalid")
                        return 
                    }

                    createButton.classList.remove("invalid")
                    return true
                } 

                createButton.addEventListener("click", async ()=>{
                    if(validRequestChecker() === true && !createButton.classList.contains("invalid")){

                        const requestObject = {
                            "type": "expense",
                            "typeofExpenseIncome": FINAL_CATEGORY,
                            "subtypeofExpenseIncome": FINAL_EXPENSE,
                            "amount": FINAL_AMOUNT_VALUE,
                        }

                        if(RECURRING === true){
                            requestObject.recurring = true
                        }
                        
                        createButton.classList.add("invalid")
                        const sendCreateReq = await createNewExpenseIncome(JSON.stringify(requestObject))

                        if(sendCreateReq.create){
                            const successElement = document.querySelector(".successful")
                            successElement.style.display = "flex"
                            setTimeout(() => {
                                parent.classList.remove("show")
                                parent.classList.add("hide")
            
                                ADDITIONAL_ELEMENT.classList.remove("show")
                                ADDITIONAL_ELEMENT.classList.add("hide")
            
                                parent.addEventListener("animationend", ()=>{
                                    parent.classList.remove("hide")
                                    ADDITIONAL_ELEMENT.classList.remove("hide")
                                    document.body.style.overflow = "auto"

                                    ADDITIONAL_ELEMENT.innerHTML =``
                                })

                            }, 1000);
                            //MUST REMEMBER COME AND CALL THE SET FUNCTIONS
                            expenseData = await getAllUserCreated()
                            donutsChartSet()
                            barChartSet()
                        }else{
                            createButton.classList.remove("invalid")
                            console.log(sendCreateReq)
                        }
                    }
                }) 
            }
            const creatingIncome = () =>{
                //FINAL USED IN REQUEST
                let FINAL_CATEGORY = ""
                let FINAL_INCOME = ""
                let RECURRING = false //initially
                let FINAL_AMOUNT_VALUE = 0

                //WHEN CALLING THIS FUNCTION IT OPENS THE CREATE CARD
                ADDITIONAL_ELEMENT.innerHTML = `
                <div class="parent">
                    <div class="create-card">
                        <span class="create-title">Create New Income</span>

                        <span class="small-text">Category</span>

                        <div class="category-dropdown-wrapper">
                            <div class="dropdown-parent">
                                <span>Choose Category</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                            </div>

                            <div class="dropdown-absolute">
                                <span data-category="salary" class="pick">Salary</span>
                                <span data-category="business_income" class="pick">Business Income</span>
                                <span data-category="investments" class="pick">Investments</span>
                                <span data-category="government_payments" class="pick">Government Payments</span>
                                <span data-category="retirement_income" class="pick">Retirement Income</span>
                                <span data-category="gifts_inheritance" class="pick">Gifts & Inheritance</span>
                                <span data-category="scholarship_grants" class="pick">Scholarship Grants</span>
                                <span data-category="other_income" class="pick">Other Income</span>
                                <span data-category="other" class="pick">Other</span>
                                
                            </div>
                        </div>

                        <span class="small-text">Income</span>

                        <div class="income-dropdown-wrapper">
                            <div class="disabled dropdown-parent-second">
                                <span>Choose Category First</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                            </div>

                            <div class="dropdown-absolute-second"></div>
                        </div>


                        <div class="recurring-wrap">
                            <span>Is the income Recurring?</span>
                            <span class="extra-info">?</span>

                            <span class="info-absolute">Will the income occur every month, or is it a one-time income?</span>
                        </div>

                        <div class="recurring-yes-no-wrap">
                            <span class="recurring-yes">Yes</span>
                            <span class="recurring-no selected">No</span>
                        </div>


                        <span class="small-text">Amount ($)</span>

                        <div class="input-wrapper">
                            <input min="1" max="9999999" id="income-amount" type="number" placeholder="E.g. $1,000">

                            <span class="error-text number"></span>
                        </div>

                        <div class="buttons-wrapper">
                            <div class="cancel">Cancel</div>
                            <div class="create invalid">Create</div>
                        </div>

                        <div class="successful">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                            </div>
                            <span>Created</span>
                        </div>
                    </div>
                </div>
                `

                //ERROR SPANS
                const amount_error = document.querySelector(".error-text.number")

                //DROPDOWNS
                const dropdownParent = document.querySelector(".dropdown-parent")
                const dropdownAbsolute = document.querySelector(".dropdown-absolute")
                const categoryPicks = document.querySelectorAll(".pick")

                const categorySpan = document.querySelector(".dropdown-parent > span")

                //second dropdown
                const dropdownSECOND = document.querySelector(".dropdown-parent-second")
                const dropdownAbsoluteSECOND = document.querySelector(".dropdown-absolute-second")
                
                const incomeSpan = document.querySelector(".dropdown-parent-second > span")

                //DROPDOWN EVENT
                dropdownParent.addEventListener("click", (e)=>{
                    e.stopPropagation()
                    dropdownAbsolute.style.display = "flex"
                    dropdownAbsoluteSECOND.style.display = "none"
                    extraInfoText.style.display = "none"
                })

                for(let i = 0; i < categoryPicks.length; i++){
                    categoryPicks[i].addEventListener("click", ()=>{
                        //console.log(categoryPicks[i].dataset.category)
                        
                        categorySpan.dataset.category = categoryPicks[i].dataset.category
                        categorySpan.textContent = categoryPicks[i].textContent
                        
                        if(dropdownSECOND.classList.contains("disabled")){
                            dropdownSECOND.classList.remove("disabled")
                        }
                        incomeSpan.textContent = "Choose Income"
                        FINAL_CATEGORY = categoryPicks[i].dataset.category
                        FINAL_INCOME = ""

                        eventHandlerExpense(i)
                        validRequestChecker()
                    })
                }

                //THE SECOND DROPDOWN EVENT HANDLER
                const eventHandlerExpense = (index) =>{
                    const allPossibleIncome = [
                        ["regular salary/wage", "overtime pay", "bonuses", "commision"],
                        ["sales revenue", "service income", "freelance work", "consulting fees"],
                        ["dividents", "interest income", "capital gains", "rental income"],
                        ["social security benefits", "unemployed benefits", "disability benefits", "child support"],
                        ["pension", "annuities"],
                        ["cash gifts", "inheritances", "monetary awards"],
                        ["educational scholarship", "research grants", "fellowships"],
                        ["royalties", "alimony", "lottery winnings", "sale of assets", "side job/gig"],
                        ["other"]
                    ]

                    const replaceCharacters = (str) =>{
                        const words = str.split(/(\s+|\(|\)|\/|,)/)

                        const wordCount = words.filter(word => /\w/.test(word)).length

                        for(let i = 0; i < words.length; i++){
                            if (/\w/.test(words[i])){
                                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
                            }
                        }
                        
                        return words.join("")
                    }

                    dropdownAbsoluteSECOND.style.minWidth = dropdownSECOND.clientWidth + "px"
                    dropdownAbsoluteSECOND.innerHTML = ``
                    for(let j = 0; j < allPossibleIncome[index].length; j++){
                        //console.log(replaceCharacters(allPossibleExpenses[index][j]))

                        const incomePick = document.createElement("span")
                        incomePick.classList.add("income-pick")

                        if(allPossibleIncome[index].length <= 3){
                            incomePick.style.padding = "5px 8px"
                        }

                        incomePick.dataset.expense = allPossibleIncome[index][j]
                        incomePick.textContent = replaceCharacters(allPossibleIncome[index][j])

                        dropdownAbsoluteSECOND.appendChild(incomePick)

                        incomePick.addEventListener("click", ()=>{
                            incomeSpan.textContent = replaceCharacters(allPossibleIncome[index][j])
                            FINAL_INCOME = allPossibleIncome[index][j]

                            validRequestChecker()
                        })
                    }
                }

                dropdownSECOND.addEventListener("click", (e)=>{
                    if(!dropdownSECOND.classList.contains("disabled")){
                        e.stopPropagation()
                        dropdownAbsoluteSECOND.style.display = "flex"
                        dropdownAbsolute.style.display = "none"
                        extraInfoText.style.display = "none"
                    }
                })

                //CANCEL BUTTON FUNCTIONALITY
                //IF THERE ARE EXPENSES IT WILL CALL THE CHART
                const cancelButton = document.querySelector(".cancel")
                cancelButton.addEventListener("click", ()=>{
                    if(parent.classList.contains("show")){
                        parent.classList.remove("show")
                        parent.classList.add("hide")
    
                        ADDITIONAL_ELEMENT.classList.remove("show")
                        ADDITIONAL_ELEMENT.classList.add("hide")
    
                        parent.addEventListener("animationend", ()=>{
                            parent.classList.remove("hide")
                            ADDITIONAL_ELEMENT.classList.remove("hide")
                            document.body.style.overflow = "auto"

                            ADDITIONAL_ELEMENT.innerHTML =``
                        })
                    }
                })

                //RECURRING FUNCTIONALITY
                const recurringButtonYes = document.querySelector(".recurring-yes")
                const recurringButtonNo = document.querySelector(".recurring-no")
                const recurringExtraInfo = document.querySelector(".extra-info")

                recurringButtonNo.addEventListener("click", ()=>{
                    recurringButtonYes.classList.remove("selected")
                    recurringButtonNo.classList.add("selected")

                    RECURRING = false
                })
                recurringButtonYes.addEventListener("click", ()=>{
                    recurringButtonYes.classList.add("selected")
                    recurringButtonNo.classList.remove("selected")

                    RECURRING = true
                })

                //EXTRA INFO ON HOVER (CLICK ON A SMALLER SCREEN)
                const extraInfoText = document.querySelector(".info-absolute")
                recurringExtraInfo.addEventListener("click", (e)=>{
                    if(window.innerWidth < 600){
                        e.stopPropagation()
                        extraInfoText.style.display = "block"
                        dropdownAbsolute.style.display = "none"
                        dropdownAbsoluteSECOND.style.display = "none"
                    }
                })
                recurringExtraInfo.addEventListener("mouseover", ()=>{
                    if(window.innerWidth >= 600){
                        extraInfoText.style.display = "block"
                    }
                })
                recurringExtraInfo.addEventListener("mouseleave", ()=>{
                    if(window.innerWidth >= 600){
                        extraInfoText.style.display = "none"
                    }
                })

                //INPUT VALIDATING
                const amountNumberInput = document.querySelector("#income-amount")
                amountNumberInput.addEventListener("keypress", (e)=>{
                    //based on the keycode only keep the numbers and decimal dot (".")
                    //console.log(e.keyCode)
                    const charCode = (e.which) ? e.which : e.keyCode
                    const number_amount = amountNumberInput.value
                    const dotIndex = number_amount.indexOf(".")

                    if(number_amount.startsWith("0")){
                        e.preventDefault()
                    }
                    if(number_amount.length === 0 && charCode === 46){
                        e.preventDefault()
                    }

                    if(charCode > 31 && (charCode !== 46 && (charCode < 48 || charCode > 57))){
                        e.preventDefault()
                    }else if(dotIndex !== -1 && number_amount.length - dotIndex > 2 && (charCode >= 48 && charCode <= 57)){
                        //prevent more than 2 after the decimal
                        e.preventDefault()
                    }

                })
                amountNumberInput.addEventListener("input", ()=>{
                    const inputAsNumber = Number(amountNumberInput.value)
                    
                    amountNumberInput.classList.remove("invalid")
                    amount_error.textContent = ""

                    if(amountNumberInput.value.length && inputAsNumber < 1){
                        
                        amountNumberInput.classList.add("invalid")
                        amount_error.textContent = "Amount should be at least $1!"
                    }else if(amountNumberInput.value.length && inputAsNumber > 9999999){
                        
                        amountNumberInput.classList.add("invalid")
                        amount_error.textContent = "Amount should be less than $9,999,999"
                    }

                    FINAL_AMOUNT_VALUE = inputAsNumber
                    validRequestChecker()
                })

                const parent = document.querySelector(".parent")
                parent.classList.add("show")

                parent.addEventListener("click", (e)=>{
                    e.stopPropagation()
                    dropdownAbsolute.style.display = "none"
                    dropdownAbsoluteSECOND.style.display = "none"
                    extraInfoText.style.display = "none"
                })

                //WINDOW EVENT CLOSING EVERYHTING
                window.addEventListener("click", ()=>{
                    if(parent.classList.contains("show")){
                        parent.classList.remove("show")
                        parent.classList.add("hide")
    
                        ADDITIONAL_ELEMENT.classList.remove("show")
                        ADDITIONAL_ELEMENT.classList.add("hide")
    
                        parent.addEventListener("animationend", ()=>{
                            parent.classList.remove("hide")
                            ADDITIONAL_ELEMENT.classList.remove("hide")
                            document.body.style.overflow = "auto"

                            ADDITIONAL_ELEMENT.innerHTML =``
                        })
                    }
                })


                //THE VALIDATORS TO ENABLE THE BUTTON
                const createButton = document.querySelector(".create")
                const validRequestChecker = () =>{
                    if(!FINAL_CATEGORY || !FINAL_INCOME || FINAL_AMOUNT_VALUE <= 0){
                        createButton.classList.add("invalid")
                        return 
                    }else if(FINAL_AMOUNT_VALUE > 9999999){
                        createButton.classList.add("invalid")
                        return 
                    }

                    createButton.classList.remove("invalid")
                    return true
                } 

                createButton.addEventListener("click", async ()=>{
                    if(validRequestChecker() === true && !createButton.classList.contains("invalid")){

                        const requestObject = {
                            "type": "income",
                            "typeofExpenseIncome": FINAL_CATEGORY,
                            "subtypeofExpenseIncome": FINAL_INCOME,
                            "amount": FINAL_AMOUNT_VALUE,
                        }

                        if(RECURRING === true){
                            requestObject.recurring = true
                        }
                        
                        createButton.classList.add("invalid")
                        const sendCreateReq = await createNewExpenseIncome(JSON.stringify(requestObject))

                        if(sendCreateReq.create){
                            const successElement = document.querySelector(".successful")
                            successElement.style.display = "flex"
                            setTimeout(() => {
                                parent.classList.remove("show")
                                parent.classList.add("hide")
            
                                ADDITIONAL_ELEMENT.classList.remove("show")
                                ADDITIONAL_ELEMENT.classList.add("hide")
            
                                parent.addEventListener("animationend", ()=>{
                                    parent.classList.remove("hide")
                                    ADDITIONAL_ELEMENT.classList.remove("hide")
                                    document.body.style.overflow = "auto"

                                    ADDITIONAL_ELEMENT.innerHTML =``
                                })

                            }, 1000);
                            //MUST REMEMBER COME AND CALL THE SET FUNCTIONS
                            expenseData = await getAllUserCreated()
                            donutsChartSet()
                            barChartSet()
                        }else{
                            createButton.classList.remove("invalid")
                            console.log(sendCreateReq)
                        }
                    }
                })
            }  
            //USER CLICKS THE ELEMENT WITH DATA
            const createExpenseChart = () =>{

            }          
            const createIncomeChart = () =>{
                
            }

            //if there is in fact data restructure
            //STARTING CHARTS
            //GET FAMILIAR WITH CHARTJS ONCE AGAIN
            if(expenseData.data){
                //SET THE DATA ARRAY USED FOR THE CHART
                EXPENSES_DONUT_ELEMENT.innerHTML = `
                <div class="chart-wrapper">
                    <canvas aria-label="Donut chart displaying expenses you have this month" role="img"  id="expenseDonutChart"></canvas>
                </div>
                `
                //inital chart set
                //THIS IS TEST ONLY, THE REAL CHART WOULD USE A MODIFIED DATA
                const expenseCanvas = document.querySelector("#expenseDonutChart").getContext("2d")

                //CUSTOM DATA
                const allUserData = expenseData.data
                const expensesArray = allUserData.filter((expense)=>{
                    return expense.type === "expense"
                })
                const incomesArray = allUserData.filter((income)=>{
                    return income.type === "income"
                })
                //console.log(incomesArray, expensesArray)

                const chartSettings = {
                    type: "doughnut",
                    data: {
                        datasets: [{
                            //THE CUSTOM DATA
                            data: [100, 30, 80, 50, 40, 70, 10],
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "40%",
                        hover:{
                            mode: null
                        },
                        plugins:{
                            tooltip: {
                                enabled: false
                            },
                            legend: {
                                display: false,
                            }
                        },
                        layout:{
                            padding:{
                                left: 0,
                                right: 0,
                                top: 20,
                                bottom: 15
                            }
                        },
                    },
                    plugins: []
                }

                //execution of the chart
                const expenseChart = new Chart(expenseCanvas, chartSettings)
                
            }else{
                EXPENSES_DONUT_ELEMENT.innerHTML = `
                <span class="empty-donut">You don't have any expenses!</span>
                <div class="add-expense">
                    <span>Add One</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                </div>
                `
                INCOME_DONUT_ELEMENT.innerHTML = `
                <span class="empty-donut">You don't have any income!</span>
                <div class="add-income">
                    <span>Add One</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                </div>
                `

                EXPENSES_DONUT_ELEMENT.addEventListener("click", (e)=>{
                    e.stopPropagation()

                    document.body.style.overflow = "hidden"
                    ADDITIONAL_ELEMENT.classList.add("show")

                    creatingExpense()
                })
                INCOME_DONUT_ELEMENT.addEventListener("click", (e)=>{
                    e.stopPropagation()

                    document.body.style.overflow = "hidden"
                    ADDITIONAL_ELEMENT.classList.add("show")

                    creatingIncome()
                })
            }
        }
        donutsChartSet()
    }
    SET_ELEMENTS()

    PAGE_CONTENT.innerHTML = `
        <div class="dashboard">
            <span class="username">Welcome back, <span class="bolder">${data.data.name}!</span> </span>
            <div class="core-elements-wrapper">
                <div class="bar-donut-wrapper">
                    <div class="bar-chart-element"></div>

                    <div class="donuts-wrapper">
                        <div class="expense-donut"></div>
                        <div class="income-donut"></div>
                    </div>
                </div>

                <div class="expense-income-wrapper"></div>
            </div>
        </div>

        <div class="additional-element"></div>
    `
}