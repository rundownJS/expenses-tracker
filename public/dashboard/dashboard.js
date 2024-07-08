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

    //creating new data
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

    //delete data with ID
    const deleteExpenseIncome = async (documentID) => {
        try{
            const request = await fetch(`/expenses-tracker/api/v1/expenses/delete-expense-income`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer= ${token}`,
                    "documentid": documentID
                }
            })

            const data = await request.json()

            return data

        }catch(err){
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

        const EXPENSES_WRAPPER = document.querySelector(".expenses-wrapper")
        const INCOME_WRAPPER = document.querySelector(".income-wrapper")

        const EXPENSES_WRAPPER_PARENT = document.querySelector(".this-month-expenses")
        const INCOME_WRAPPER_PARENT = document.querySelector(".this-month-income")
        
        const ADDITIONAL_ELEMENT = document.querySelector(".additional-element")

        //FULLY DONE
        const barChartSet = () =>{

            //more details about the chart
            const barMoreDetails = (incomeData, expenseData) =>{
                //reduce to only 2 months
                //this and previous
                const incomeThisMonth = incomeData.slice(-2).reverse()
                const expensesThisMonth = expenseData.slice(-2).reverse()

                document.body.style.overflow = "hidden"
                ADDITIONAL_ELEMENT.classList.add("show")
                ADDITIONAL_ELEMENT.innerHTML = `
                <div class="parent">
                    <div class="monthly-expenses-breakdown">
                        <span class="chart-title">Montly Expenses/Income</span>

                        <div class="bigger-bar-chart-wrapper">
                            <canvas id="barChartCanvas" role="image" aria-label="Bar chart displaying your monthly expenses/income"></canvas>
                        </div>

                        <span class="total-text">Your total <span class="big-ex">EXPENSES</span> this month are: <span class="big-ex">${Number(expensesThisMonth[0].total_amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        })}</span></span>

                        <span class="total-text">Your total <span class="big-in">INCOME</span> this month is: <span class="big-in">${Number(incomeThisMonth[0].total_amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        })}</span></span>

                        <span class="total-balance-text">TOTAL BALANCE: <span class="total-balance">${Number(incomeThisMonth[0].total_amount - expensesThisMonth[0].total_amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        })}</span></span>

                        <div class="close-bar">Close</div>
                    </div>
                </div>
                `
                //console.log(expensesThisMonth)

                const chartDataExpenses = expenseData.map(doc =>{
                    return doc.total_amount
                })
                const chartDataIncomes = incomeData.map(doc =>{
                    return doc.total_amount
                })
                const labels = () => expenseData.map(doc=> doc.date)

                const chartSettings = {
                    type: "bar",
                    data: {
                        labels: labels(),
                        datasets: [
                            {
                                data: chartDataExpenses,
                                backgroundColor: "#e80e1d",
                                categoryPercentage: 0.6,
                                barPercentage: 0.7,    
                            },
                            { 
                                data: chartDataIncomes,
                                backgroundColor: "#0ee82f",
                                categoryPercentage: 0.6,
                                barPercentage: 0.7,
                            }
                        ]
                    },
                    options: {
                        hover:{
                            mode: null
                        },
                        aspectRatio: 3/2,
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                max: Math.ceil(((Math.max(...[...chartDataExpenses, ...chartDataIncomes])) * 1.5) / 1000) * 1000,
                                beginAtZero: true,
                                ticks: {
                                    callback: function(v, i, vs){
                                        return Number(v).toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0
                                        })
                                    },
                                    font: {
                                        family: "Poppins",
                                        size: 12,
                                        lineHeight: 1,
                                    },
                                    color: "#555555",
                                    padding: 10,
                                },
                                grid: {
                                    drawTicks: false,
                                    color: "#D8D8D8",
                                },
                                border: {
                                    color: "#D8D8D8"
                                }
                            },
                            x: {
                                grid: {
                                    drawTicks: false,
                                    color: "#D8D8D8",                                },
                                ticks: {
                                    padding: 10,
                                    font: {
                                        family: "Poppins",
                                        size: 12,
                                        lineHeight: 1,
                                    },
                                    color: "#555555"
                                },
                                border: {
                                    color: "#D8D8D8"
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: false
                            },
                            tooltip: {
                                enabled: false
                            }
                        }
                    },
                    plugins: [] 
                }

                chartSettings.options.scales.y.ticks.stepSize = stepSize(0, chartSettings.options.scales.y.max)

                const chartCanvas = document.querySelector("#barChartCanvas").getContext("2d")
                const barChart = new Chart(chartCanvas, chartSettings)


                const totalBalance = document.querySelector(".total-balance")
                
                const dirtyAmount = totalBalance.textContent.replace(/[^0-9.-]/g, "")
                const numberAmount = parseFloat(dirtyAmount)

                if(numberAmount > 0){
                    totalBalance.classList.add("positive")
                }else if(numberAmount < 0){
                    totalBalance.classList.add("negative")
                }else{
                    totalBalance.classList.add("neutral")
                }

                const parent = document.querySelector(".parent")
                parent.classList.add("show")


                parent.addEventListener("click", (e)=>{
                    e.stopPropagation()
                })

                if(parent.clientHeight >= window.innerHeight - 40){
                    ADDITIONAL_ELEMENT.style.alignItems = "baseline"
                    ADDITIONAL_ELEMENT.style.overflowY = "auto"
                }else{
                    ADDITIONAL_ELEMENT.style.alignItems = "center"
                }

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

                        barChartSet()
                        donutsChartSet()
                    }
                })

                const closeButton = document.querySelector(".close-bar")
                closeButton.addEventListener("click", ()=>{
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

                        barChartSet()
                        donutsChartSet()
                    }
                }, {once:true})
            }

            //custom func to determine step size
            const stepSize = (min, max) =>{
                return (max - min) / 10 
            }

            if(expenseData.data){
                BAR_CHART_ELEMENT.style.paddingLeft = 0
                BAR_CHART_ELEMENT.classList.add("more-details")

                BAR_CHART_ELEMENT.innerHTML = `
                <canvas aria-label="Bar chart displaying your monthly expenses/income" role="image" id="bar-chart"></canvas>
                `
                
                //initial expenses and incomes
                const expensesArray = expenseData.data.filter(data =>{
                    return data.type === "expense"
                })
                const incomeArray = expenseData.data.filter(data =>{
                    return data.type === "income"
                })

                //reducer and filter
                const dataFilterReducer = (data) =>{
                    //console.log(data)

                    //compare the dates
                    const currentDate = new Date()
                    const currentMonth = currentDate.getMonth()
                    const currentYear = currentDate.getFullYear()

                    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

                    if(data.length === 0){
                        return [{ date: `${months[currentMonth]}, ${currentYear}`, total_amount: 0 }]
                    }

                    const startingDate = new Date(data[0].createdAt)
                    const startMonth = startingDate.getMonth()
                    const startYear = startingDate.getFullYear()

                    const monthly_total = {}

                    //if there is a month with no data fill it with 0
                    const fillMissingMonth = (startMonth, startYear, endMonth, endYear) =>{
                        let year = startYear
                        let month = startMonth

                        while(year < endYear || (year === endYear && month <= endMonth)){

                            const key = `${months[month]}, ${year}`

                            if(!monthly_total[key]){
                                monthly_total[key] = { date:key, total_amount:0 }
                            }

                            month++
                            if(month > 11){
                                month = 0
                                year++
                            }
                        }
                    }

                    fillMissingMonth(startMonth, startYear, currentMonth, currentYear)

                    //filtering
                    data.forEach(item => {
                        const creationDate = new Date(item.createdAt)
                        const creationMonth = creationDate.getMonth()
                        const creationYear = creationDate.getFullYear()

                        let year = creationYear
                        let month = creationMonth
                        
                        while (year < currentYear || (year === currentYear && month <= currentMonth)){
                            const key = `${months[month]}, ${year}`

                            if (!monthly_total[key]) {
                                monthly_total[key] = { date:key, total_amount:0 }
                            }

                            monthly_total[key].total_amount += item.amount

                            if(!item.recurring){
                                break
                            }

                            month++
                            if(month > 11){
                                month = 0
                                year++
                            }
                        }
                    })

                    const result = Object.values(monthly_total)
            
                    //finally return the last 6 months
                    return result.slice(-6)
                }
                //console.log(dataFilterReducer(expensesArray), dataFilterReducer(incomeArray))
                
                const reducedExpenses = dataFilterReducer(expensesArray)
                const reducedIncomes = dataFilterReducer(incomeArray)

                //chart data and labels
                const chartDataExpenses = reducedExpenses.map(doc =>{
                    return doc.total_amount
                })
                const chartDataIncomes = reducedIncomes.map(doc =>{
                    return doc.total_amount
                })
                //console.log(chartDataExpenses, chartDataIncomes)

                const labels = () => reducedExpenses.map(doc=> doc.date)
                //console.log(labels())
                
                const chartSettings = {
                    type: "bar",
                    data: {
                        labels: labels(),
                        datasets: [
                            {
                                data: chartDataExpenses,
                                backgroundColor: "#e80e1d",
                                categoryPercentage: 0.6,
                                barPercentage: 0.7,    
                            },
                            { 
                                data: chartDataIncomes,
                                backgroundColor: "#0ee82f",
                                categoryPercentage: 0.6,
                                barPercentage: 0.7,
                            }
                        ]
                    },
                    options: {
                        hover:{
                            mode: null
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                max: Math.ceil(((Math.max(...[...chartDataExpenses, ...chartDataIncomes])) * 1.5) / 1000) * 1000,
                                beginAtZero: true,
                                ticks: {
                                    callback: function(v, i, vs){
                                        return Number(v).toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0
                                        })
                                    },
                                    font: {
                                        family: "Poppins",
                                        size: 12,
                                        lineHeight: 1,
                                    },
                                    color: "#555555",
                                    padding: 10,
                                },
                                grid: {
                                    drawTicks: false,
                                    color: "#D8D8D8",
                                },
                                border: {
                                    color: "#D8D8D8"
                                }
                            },
                            x: {
                                grid: {
                                    drawTicks: false,
                                    color: "#D8D8D8",                                },
                                ticks: {
                                    padding: 10,
                                    font: {
                                        family: "Poppins",
                                        size: 12,
                                        lineHeight: 1,
                                    },
                                    color: "#555555"
                                },
                                border: {
                                    color: "#D8D8D8"
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: false
                            },
                            tooltip: {
                                enabled: false
                            }
                        }
                    },
                    plugins: [] 
                }

                chartSettings.options.scales.y.ticks.stepSize = stepSize(0, chartSettings.options.scales.y.max)
                //console.log(chartSettings.options.scales.y.max)

                const chartCanvas = document.querySelector("#bar-chart").getContext("2d") 
                const barChart = new Chart(chartCanvas, chartSettings)

                BAR_CHART_ELEMENT.addEventListener("click", (e)=>{
                    
                    if(BAR_CHART_ELEMENT.classList.contains("more-details")){
                        e.stopPropagation()

                        barMoreDetails(reducedIncomes, reducedExpenses)
                    }
                }, {once: true})
            }else{
                BAR_CHART_ELEMENT.style.paddingLeft = "15px"
                BAR_CHART_ELEMENT.innerHTML = `
                <span class="empty-bar">You don't track any expenses currently!</span>
                `
                BAR_CHART_ELEMENT.classList.remove("more-details")
            }
        }
        barChartSet()

        //FULLY DONE
        const donutsChartSet = () =>{
            //CANCEL BUTTON EVENT
            const creatingExpense = () =>{
                //FINAL USED IN REQUEST
                let FINAL_CATEGORY = ""
                let FINAL_EXPENSE = ""
                let RECURRING = false //initially
                let FINAL_AMOUNT_VALUE = 0

                document.body.style.overflow = "hidden"
                ADDITIONAL_ELEMENT.classList.add("show")

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
                                <span data-category="health_wellness" class="pick">Health & Wellness</span>
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
                ADDITIONAL_ELEMENT.style.alignItems = "center"

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

                        barChartSet()
                        setElementInitially()
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

                        barChartSet()
                        setElementInitially()
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
                            setElementInitially()
                            barChartSet()
                            expensesIncomeList()
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

                document.body.style.overflow = "hidden"
                ADDITIONAL_ELEMENT.classList.add("show")

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
                ADDITIONAL_ELEMENT.style.alignItems = "center"

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

                        barChartSet()
                        setElementInitially()
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

                        barChartSet()
                        setElementInitially()
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
                            setElementInitially()
                            barChartSet()
                            expensesIncomeList()
                        }else{
                            createButton.classList.remove("invalid")
                            console.log(sendCreateReq)
                        }
                    }
                })
            }  
            //USER CLICKS THE ELEMENT WITH DATA
            const createExpenseChart = (chartData) =>{
                //console.log("expense chart")
                document.body.style.overflow = "hidden"
                ADDITIONAL_ELEMENT.classList.add("show")

                ADDITIONAL_ELEMENT.innerHTML = `
                <div class="parent">
                    <div class="chart-breakdown-wrapper">
                        <span class="breakdown-title">In-Depth Expenses Breakdown</span>

                        <div class="bigger-chart-wrapper">
                            <canvas id="biggerExpense" role="image" aria-label="Donut chart displaying expenses you have this month"></canvas>
                        </div>

                        <div class="breakdown-addNew">
                            <div class="chart-breakdown"></div>
                            <div class="buttons-wrapper">
                                <div class="close">Close</div>
                                <div class="add-new-expense">
                                    <span>Add New</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
                const arrayDataReduce = chartData.reduce((acc, curr) =>{
                    if(acc[curr.typeofExpenseIncome]){
                        acc[curr.typeofExpenseIncome] += curr.amount
                    }else{
                        acc[curr.typeofExpenseIncome] = curr.amount
                    }

                    return acc
                }, {})
                const reducedDataObject = arrayDataReduce

                const labels = Object.keys(reducedDataObject)
                const dataAmount = Object.values(reducedDataObject)
                const chartSettings = {
                    type: "doughnut",
                    data: {
                        labels: labels,
                        datasets: [{
                            //THE CUSTOM DATA
                            data: dataAmount,
                            backgroundColor: getColorForLabel(labels)
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
                const chartCanvas = document.querySelector("#biggerExpense").getContext("2d")
                const expenseChart = new Chart(chartCanvas, chartSettings)

                const BREAKDOWN_WRAPPER = document.querySelector(".chart-breakdown")

                //console.log(chartData)
                //if there are repetitions of a certain expense add them together => housing => rent = all rent expenses, housing => mortgage
                //get the category amount % from the whole chart
                //get the certain expense amount % from the category 

                //the whole expense amount
                const total_amount = chartData.reduce((acc, curr) =>{
                    return acc + curr.amount
                }, 0)
                BREAKDOWN_WRAPPER.innerHTML = `<span class="total">Total Expenses This Month: ${Number(total_amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                })}</span>`
                
                //category breakdown
                const all_expenses_breakdown_OBJECT = chartData.reduce((acc, curr) =>{
                    const { typeofExpenseIncome, subtypeofExpenseIncome, amount } = curr

                    if(!acc[typeofExpenseIncome]){
                        acc[typeofExpenseIncome] = {}
                    }

                    if(!acc[typeofExpenseIncome][subtypeofExpenseIncome]){
                        acc[typeofExpenseIncome][subtypeofExpenseIncome] = 0
                    }

                    acc[typeofExpenseIncome][subtypeofExpenseIncome] += amount

                    return acc
                }, {})
                const all_expenses_breakdown_ARRAY = Object.entries(all_expenses_breakdown_OBJECT).map(([category, expenses]) =>{
                    const expenseEntries = Object.entries(expenses).map(([expense, amount]) => ({
                        expense,
                        amount 
                    }))

                    const totalAmount = expenseEntries.reduce((sum, { amount }) => sum + amount, 0)

                    return {
                        category,
                        expenses: expenseEntries,
                        totalAmount
                    }
                })
                //console.log(all_expenses_breakdown_ARRAY)


                //the categories straight from the db are not text ready
                //function will modify them
                const formatCategory = (str) =>{
                    const strSplit = str.split("_")

                    if(strSplit.length > 1){
                        if(strSplit[0] === "health" || strSplit[0] === "gifts"){
                            return strSplit.map(word =>{
                                return word.charAt(0).toUpperCase() + word.slice(1)
                            }).join(" & ")
                        }else{
                            return strSplit.map(word =>{
                                return word.charAt(0).toUpperCase() + word.slice(1)
                            }).join(" ")
                        }
                    }else{
                        return strSplit[0].charAt(0).toUpperCase() + strSplit[0].slice(1)
                    }
                }
                const formatExpense = (str) =>{
                    const words = str.split(/(\s+|\(|\)|\/|,)/)

                    //const wordCount = words.filter(word => /\w/.test(word)).length

                    for(let i = 0; i < words.length; i++){
                        if (/\w/.test(words[i])){
                            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
                        }
                    }
                    
                    return words.join("")
                }
                
                //use the array to loop and create elements
                for(let i = 0; i < all_expenses_breakdown_ARRAY.length; i++){

                    //create the catgory element
                    const mainCategoryBreakdown = document.createElement("div")
                    mainCategoryBreakdown.classList.add("category-breakdown-text")
                    BREAKDOWN_WRAPPER.appendChild(mainCategoryBreakdown)

                    const category = all_expenses_breakdown_ARRAY[i].category //category name
                    const categoryAmount = all_expenses_breakdown_ARRAY[i].totalAmount //category amount

                    //find the percentage
                    let categoryPercentage = Number((categoryAmount / total_amount) * 100).toFixed(2)
                    if(categoryPercentage === "0.00"){
                        categoryPercentage = "< 0.01"
                    }

                    mainCategoryBreakdown.innerHTML = `
                    <div style="background-color: ${CUSTOM_COLORS[category]}" class="color"></div>
                    <span>${formatCategory(category)}: ${Number(categoryAmount).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    })} (${categoryPercentage}%)</span>
                    `
                    //console.log(category)

                    //the expenses the category consists of
                    for(let j = 0; j < all_expenses_breakdown_ARRAY[i].expenses.length; j++){
                        const expense = all_expenses_breakdown_ARRAY[i].expenses[j].expense

                        const expenseAmount = all_expenses_breakdown_ARRAY[i].expenses[j].amount

                        const expenseBreakdown = document.createElement("span")
                        expenseBreakdown.classList.add("expense-breakdown-text")

                        let expensePercentage = Number((expenseAmount / categoryAmount) * 100).toFixed(2)
                        if(expensePercentage === "0.00"){
                            expensePercentage = "< 0.01"
                        }

                        expenseBreakdown.textContent = `${formatExpense(expense)}: ${Number(expenseAmount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        })}, (${expensePercentage}%)`

                        BREAKDOWN_WRAPPER.appendChild(expenseBreakdown)
                    }
                    //console.log(formatCategory(all_expenses_breakdown_ARRAY[i].category))
                }

                const parent = document.querySelector(".parent")
                parent.classList.add("show")

                parent.addEventListener("click", (e)=>{
                    e.stopPropagation()
                })

                if(parent.clientHeight >= window.innerHeight - 40){
                    ADDITIONAL_ELEMENT.style.alignItems = "baseline"
                    ADDITIONAL_ELEMENT.style.overflowY = "auto"
                }else{
                    ADDITIONAL_ELEMENT.style.alignItems = "center"
                }

                //WINDOW EVENT CLOSING EVERYTHING
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
                            ADDITIONAL_ELEMENT.style.overflowY = "hidden"
                        })

                        barChartSet()
                        setElementInitially()
                    }
                }, {once:true})

                const closeButton = document.querySelector(".close")
                closeButton.addEventListener("click", ()=>{
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

                        barChartSet()
                        setElementInitially()
                    }
                }, {once:true})

                const createNewButton = document.querySelector(".add-new-expense")
                createNewButton.addEventListener("click", ()=>{
                    creatingExpense()
                }, {once:true})
            }          
            const createIncomeChart = (chartData) =>{
                //console.log("income chart")
                document.body.style.overflow = "hidden"
                ADDITIONAL_ELEMENT.classList.add("show")

                ADDITIONAL_ELEMENT.innerHTML = `
                <div class="parent">
                    <div class="chart-breakdown-wrapper">
                        <span class="breakdown-title">In-Depth Income Breakdown</span>

                        <div class="bigger-chart-wrapper">
                            <canvas id="biggerIncome" role="image" aria-label="Donut chart displaying expenses you have this month"></canvas>
                        </div>

                        <div class="breakdown-addNew">
                            <div class="chart-breakdown"></div>
                            <div class="buttons-wrapper">
                                <div class="close">Close</div>
                                <div class="add-new-income">
                                    <span>Add New</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
                const arrayDataReduce = chartData.reduce((acc, curr) =>{
                    if(acc[curr.typeofExpenseIncome]){
                        acc[curr.typeofExpenseIncome] += curr.amount
                    }else{
                        acc[curr.typeofExpenseIncome] = curr.amount
                    }

                    return acc
                }, {})
                const reducedDataObject = arrayDataReduce

                const labels = Object.keys(reducedDataObject)
                const dataAmount = Object.values(reducedDataObject)
                const chartSettings = {
                    type: "doughnut",
                    data: {
                        labels: labels,
                        datasets: [{
                            //THE CUSTOM DATA
                            data: dataAmount,
                            backgroundColor: getColorForLabel(labels)
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
                const chartCanvas = document.querySelector("#biggerIncome").getContext("2d")
                const expenseChart = new Chart(chartCanvas, chartSettings)

                const BREAKDOWN_WRAPPER = document.querySelector(".chart-breakdown")

                //console.log(chartData)
                //if there are repetitions of a certain expense add them together => housing => rent = all rent expenses, housing => mortgage
                //get the category amount % from the whole chart
                //get the certain expense amount % from the category 

                //the whole expense amount
                const total_amount = chartData.reduce((acc, curr) =>{
                    return acc + curr.amount
                }, 0)
                BREAKDOWN_WRAPPER.innerHTML = `<span class="total">Total Income This Month: ${Number(total_amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                })}</span>`
                
                //category breakdown
                const all_incomes_breakdown_OBJECT = chartData.reduce((acc, curr) =>{
                    const { typeofExpenseIncome, subtypeofExpenseIncome, amount } = curr

                    if(!acc[typeofExpenseIncome]){
                        acc[typeofExpenseIncome] = {}
                    }

                    if(!acc[typeofExpenseIncome][subtypeofExpenseIncome]){
                        acc[typeofExpenseIncome][subtypeofExpenseIncome] = 0
                    }

                    acc[typeofExpenseIncome][subtypeofExpenseIncome] += amount

                    return acc
                }, {})
                const all_incomes_breakdown_ARRAY = Object.entries(all_incomes_breakdown_OBJECT).map(([category, incomes]) =>{
                    const incomesEntries = Object.entries(incomes).map(([income, amount]) => ({
                        income,
                        amount 
                    }))

                    const totalAmount = incomesEntries.reduce((sum, { amount }) => sum + amount, 0)

                    return {
                        category,
                        incomes: incomesEntries,
                        totalAmount
                    }
                })
                //console.log(all_expenses_breakdown_ARRAY)


                //the categories straight from the db are not text ready
                //function will modify them
                const formatCategory = (str) =>{
                    const strSplit = str.split("_")

                    if(strSplit.length > 1){
                        if(strSplit[0] === "health" || strSplit[0] === "gifts"){
                            return strSplit.map(word =>{
                                return word.charAt(0).toUpperCase() + word.slice(1)
                            }).join(" & ")
                        }else{
                            return strSplit.map(word =>{
                                return word.charAt(0).toUpperCase() + word.slice(1)
                            }).join(" ")
                        }
                    }else{
                        return strSplit[0].charAt(0).toUpperCase() + strSplit[0].slice(1)
                    }
                }
                const formatExpense = (str) =>{
                    const words = str.split(/(\s+|\(|\)|\/|,)/)

                    //const wordCount = words.filter(word => /\w/.test(word)).length

                    for(let i = 0; i < words.length; i++){
                        if (/\w/.test(words[i])){
                            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
                        }
                    }
                    
                    return words.join("")
                }
                
                //use the array to loop and create elements
                for(let i = 0; i < all_incomes_breakdown_ARRAY.length; i++){

                    //create the catgory element
                    const mainCategoryBreakdown = document.createElement("div")
                    mainCategoryBreakdown.classList.add("category-breakdown-text")
                    BREAKDOWN_WRAPPER.appendChild(mainCategoryBreakdown)

                    const category = all_incomes_breakdown_ARRAY[i].category //category name
                    const categoryAmount = all_incomes_breakdown_ARRAY[i].totalAmount //category amount

                    //find the percentage
                    let categoryPercentage = Number((categoryAmount / total_amount) * 100).toFixed(2)
                    if(categoryPercentage === "0.00"){
                        categoryPercentage = "< 0.01"
                    }

                    mainCategoryBreakdown.innerHTML = `
                    <div style="background-color: ${CUSTOM_COLORS[category]}" class="color"></div>
                    <span>${formatCategory(category)}: ${Number(categoryAmount).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    })} (${categoryPercentage}%)</span>
                    `
                    //console.log(category)

                    //the expenses the category consists of
                    for(let j = 0; j < all_incomes_breakdown_ARRAY[i].incomes.length; j++){
                        const income = all_incomes_breakdown_ARRAY[i].incomes[j].income

                        const incomeAmount = all_incomes_breakdown_ARRAY[i].incomes[j].amount

                        const incomeBreakdown = document.createElement("span")
                        incomeBreakdown.classList.add("income-breakdown-text")

                        let incomePercentage = Number((incomeAmount / categoryAmount) * 100).toFixed(2)
                        if(incomePercentage === "0.00"){
                            incomePercentage = "< 0.01"
                        }

                        incomeBreakdown.textContent = `${formatExpense(income)}: ${Number(incomeAmount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        })}, (${incomePercentage}%)`

                        BREAKDOWN_WRAPPER.appendChild(incomeBreakdown)
                    }
                    //console.log(formatCategory(all_expenses_breakdown_ARRAY[i].category))
                }

                const parent = document.querySelector(".parent")
                parent.classList.add("show")

                parent.addEventListener("click", (e)=>{
                    e.stopPropagation()
                })

                if(parent.clientHeight >= window.innerHeight - 40){
                    ADDITIONAL_ELEMENT.style.alignItems = "baseline"
                    ADDITIONAL_ELEMENT.style.overflowY = "auto"
                }else{
                    ADDITIONAL_ELEMENT.style.alignItems = "center"
                }
                //console.log(parent.clientHeight, window.innerHeight)

                //WINDOW EVENT CLOSING EVERYTHING
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
                            ADDITIONAL_ELEMENT.style.overflowY = "hidden"
                        })

                        barChartSet()
                        setElementInitially()
                    }
                }, {once:true})

                const closeButton = document.querySelector(".close")
                closeButton.addEventListener("click", ()=>{
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

                        barChartSet()
                        setElementInitially()
                    }
                }, {once:true})

                const createNewButton = document.querySelector(".add-new-income")
                createNewButton.addEventListener("click", ()=>{
                    creatingIncome()
                }, {once:true})
            }


            //CUSTOM COLORS
            const CUSTOM_COLORS = {
                housing: "#D32F2F",
                transportation: "#1E90FF",
                food: "#90EE90",
                utilities: "#FFFF00",
                health_wellness: "#FFA500",
                debt: "#800080",
                entertainment: "#00FFFF",
                clothing: "#FF00FF",
                personal_care: "#006400",
                education: "#FF7F50",
                gifts_donations: "#000080",
                miscellaneous: "#40E0D0",
                other: "#FFD700",

                salary: "#008080",
                business_income: "#DC143C",
                investments: "#4B0082",
                government_payments: "#808000",
                retirement_income: "#87CEEB",
                gifts_inheritance: "#FA8072",
                scholarship_grants: "#6A5ACD",
                other_income: "#FF8C00"
            }
            const getColorForLabel = (labels) =>{
                return labels.map(label => CUSTOM_COLORS[label])
            }

            //if there is in fact data restructure
            //STARTING CHARTS
            const setElementInitially = () =>{
                if(expenseData.data){
                    //SET THE DATA ARRAY USED FOR THE CHART
                    //CUSTOM DATA
                    const allUserData = expenseData.data
                    const todaysDate = new Date(Date.now())
    
                    const expensesArray = allUserData.filter((expense)=>{
                        
                        //filter data
                        //if data is from this month keep it
                        //if data is from a past month, but has recurring true keep it
                        //anything else will be removed
                        const dateOfCreation = new Date(expense.createdAt)
                        const recurring = expense.recurring
    
                        if(expense.type === "expense"){
                            if(dateOfCreation.getMonth() + 1 === todaysDate.getMonth() + 1 && dateOfCreation.getFullYear() === todaysDate.getFullYear()){
                                return expense
                            }else if(recurring === true){
                                return expense
                            }
                        }
                    })
    
                    const incomesArray = allUserData.filter((income)=>{
                        const dateOfCreation = new Date(income.createdAt)
                        const recurring = income.recurring
    
                        if(income.type === "income"){
                            if(dateOfCreation.getMonth() + 1 === todaysDate.getMonth() + 1 && dateOfCreation.getFullYear() === todaysDate.getFullYear()){
                                return income
                            }else if(recurring === true){
                                return income
                            }
                        }
                    })
                    //console.log(incomesArray, expensesArray)
    
                    const expenseChartSettings = {
                        type: "doughnut",
                        data: {
                            datasets: [{
                                //THE CUSTOM DATA
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
                    const incomeChartSettings = {
                        type: "doughnut",
                        data: {
                            datasets: [{
                                //THE CUSTOM DATA
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
    
                    //IF WE HAVE DATA FOR A CHART CREATE ONE
                    if(expensesArray.length){
                        //reducing the data, if many duplicates 
                        const arrayDataReduce = expensesArray.reduce((acc, curr) =>{
                            if(acc[curr.typeofExpenseIncome]){
                                acc[curr.typeofExpenseIncome] += curr.amount
                            }else{
                                acc[curr.typeofExpenseIncome] = curr.amount
                            }
    
                            return acc
                        }, {})
                        const reducedDataObject = arrayDataReduce
    
                        const labels = Object.keys(reducedDataObject)
                        const dataAmount = Object.values(reducedDataObject)
    
                        //console.log(labels, dataAmount)
    
                        //shallow copy of the settings
                        expenseChartSettings.data.datasets = [{
                            data: dataAmount,
                            backgroundColor: getColorForLabel(labels)
                        }]
                        expenseChartSettings.data.labels = labels
    
                        EXPENSES_DONUT_ELEMENT.innerHTML = `
                        <span class="expense absolute-chart-text">EXPENSES</span>
                        <div class="chart-wrapper">
                            <canvas aria-label="Donut chart displaying expenses you have this month" role="img"  id="expenseDonutChart"></canvas>
                        </div>
                        <span class="absolute-show-more">Show More</span>
                        `
    
                        const expenseCanvas = document.querySelector("#expenseDonutChart").getContext("2d")
                        //execution of the chart
                        const expenseChart = new Chart(expenseCanvas, expenseChartSettings)
    
                        EXPENSES_DONUT_ELEMENT.addEventListener("click", (e)=>{
                            e.stopPropagation()
    
                            createExpenseChart(expensesArray)
                        }, {once:true})
    
                    }else{
                        EXPENSES_DONUT_ELEMENT.innerHTML = `
                        <span class="empty-donut">You don't have any expenses!</span>
                        <div class="add-expense">
                            <span>Add One</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        </div>
                        `
                        EXPENSES_DONUT_ELEMENT.addEventListener("click", (e)=>{
                            e.stopPropagation()
        
        
                            creatingExpense()
                        }, {once:true})
                    }
    
                    if(incomesArray.length){
                        const arrayDataReduce = incomesArray.reduce((acc, curr) =>{
                            if(acc[curr.typeofExpenseIncome]){
                                acc[curr.typeofExpenseIncome] += curr.amount
                            }else{
                                acc[curr.typeofExpenseIncome] = curr.amount
                            }
    
                            return acc
                        }, {})
                        const reducedDataObject = arrayDataReduce
    
                        const labels = Object.keys(reducedDataObject)
                        const dataAmount = Object.values(reducedDataObject)
    
                        //console.log(labels, dataAmount)
    
                        incomeChartSettings.data.datasets = [{
                            data: dataAmount,
                            backgroundColor: getColorForLabel(labels)
                        }]
                        incomeChartSettings.data.labels = labels
                        
                        INCOME_DONUT_ELEMENT.innerHTML = `
                        <span class="income absolute-chart-text">INCOME</span>
                        <div class="chart-wrapper">
                            <canvas aria-label="Donut chart displaying incomes you have this month" role="img"  id="incomeDonutChart"></canvas>
                        </div>
                        <span class="absolute-show-more">Show More</span>
                        `
                        const incomeCanvas = document.querySelector("#incomeDonutChart").getContext("2d")
                        //execution of the chart
                        const incomeChart = new Chart(incomeCanvas, incomeChartSettings)
    
                        INCOME_DONUT_ELEMENT.addEventListener("click", (e)=>{
                            e.stopPropagation()
    
                            createIncomeChart(incomesArray)
                        }, {once: true})
    
                    }else{
                        INCOME_DONUT_ELEMENT.innerHTML = `
                        <span class="empty-donut">You don't have any income!</span>
                        <div class="add-income">
                            <span>Add One</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        </div>
                        `
                        INCOME_DONUT_ELEMENT.addEventListener("click", (e)=>{
                            e.stopPropagation()
    
    
                            creatingIncome()
                        }, {once:true})
                    }
                    
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
        
        
                        creatingExpense()
                        
                    }, {once:true})
                    INCOME_DONUT_ELEMENT.addEventListener("click", (e)=>{
                        e.stopPropagation()
        
        
                        creatingIncome()
                        
                    }, {once:true})
                }
            }
            setElementInitially()
        }
        donutsChartSet()

        //LAST SEGMENT
        const expensesIncomeList = () =>{

            if(expenseData.data){
                //format strings
                const formatCategory = (str) =>{
                    const strSplit = str.split("_")

                    if(strSplit.length > 1){
                        if(strSplit[0] === "health" || strSplit[0] === "gifts"){
                            return strSplit.map(word =>{
                                return word.charAt(0).toUpperCase() + word.slice(1)
                            }).join(" & ")
                        }else{
                            return strSplit.map(word =>{
                                return word.charAt(0).toUpperCase() + word.slice(1)
                            }).join(" ")
                        }
                    }else{
                        return strSplit[0].charAt(0).toUpperCase() + strSplit[0].slice(1)
                    }
                }
                const formatExpense = (str) =>{
                    const words = str.split(/(\s+|\(|\)|\/|,)/)

                    //const wordCount = words.filter(word => /\w/.test(word)).length

                    for(let i = 0; i < words.length; i++){
                        if (/\w/.test(words[i])){
                            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
                        }
                    }
                    
                    return words.join("")
                }

                //loop to create elements
                const showSomeData = (dataArray) =>{
                    let total_amount = 0
                    const elementWrapper = document.createElement("div")
                    elementWrapper.classList.add("expense-income-data-wrapper")

                    for(let i = 0; i < dataArray.length; i++){
                        const dataElement = document.createElement("div")
                        dataElement.classList.add("expense-income-data")

                        total_amount += dataArray[i].amount

                        dataElement.innerHTML = `
                        <div class="data-category">
                            <span>${formatCategory(dataArray[i].typeofExpenseIncome)}</span>
                            ,<span> ${formatExpense(dataArray[i].subtypeofExpenseIncome)}</span>
                        </div>

                        <div class="data-amount">
                            <span>${Number(dataArray[i].amount).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2
                            })}</span>
                            ,<span> ${dataArray[i].recurring === true ? "Recurring" : "One-time" }</span>
                        </div>
                        `
                        elementWrapper.appendChild(dataElement)
                    }

                    const totalElement = document.createElement("div")
                    totalElement.classList.add("expense-income-data-total")

                    if(total_amount > 1000000){
                        total_amount = "$" + (total_amount / 1000000).toFixed(0) + "M+"
                    }else{
                        total_amount = Number(total_amount).toLocaleString("en-US", {
                            currency: "USD",
                            style: "currency",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        })
                    }

                    totalElement.innerHTML = `<span>TOTAL: <span class="data-total">${total_amount}</span></span>`

                    if(dataArray[0].type === "expense"){
                        EXPENSES_WRAPPER.appendChild(elementWrapper)
                        EXPENSES_WRAPPER.appendChild(totalElement)
                        totalElement.classList.add("red")

                        if(dataArray.length > 6){
                            elementWrapper.classList.add("overflows")
                        }
                    }else{
                        INCOME_WRAPPER.appendChild(elementWrapper)
                        INCOME_WRAPPER.appendChild(totalElement)
                        totalElement.classList.add("green")

                        if(dataArray.length > 6){
                            elementWrapper.classList.add("overflows")
                        }
                    }

                    const allDataCategory = document.querySelectorAll(".data-category")
                    const allDataAmount = document.querySelectorAll(".data-amount")
                    for(let i = 0; i < allDataCategory.length; i++){
                        allDataCategory[i].style.width = `${elementWrapper.clientWidth - 42}px`
                        allDataAmount[i].style.width = `${elementWrapper.clientWidth - 42}px`
                    }
                    window.addEventListener("resize", ()=>{
                        if(allDataCategory.length){
                            for(let i = 0; i < allDataCategory.length; i++){
                                allDataCategory[i].style.width = `${elementWrapper.clientWidth - 42}px`
                                allDataAmount[i].style.width = `${elementWrapper.clientWidth - 42}px`
                                //console.log(elementWrapper.clientWidth - 42)
                            }
                        }
                    })
                }

                //loop to show all data and have edit and delete buttons
                const showAllDetailed = (data, type) =>{
                    document.body.style.overflow = "hidden"
                    ADDITIONAL_ELEMENT.classList.add("show")
                    ADDITIONAL_ELEMENT.innerHTML = `
                    <div class="parent">
                        <div class="detailed-data">
                            <span class="overview-title">${type==="expense" ? "Detailed Expenses" : "Detailed Income"}</span>

                            <div class="detailed-wrapper">

                            </div>
                        </div>
                    </div>
                    `

                    const wrapper = document.querySelector(".detailed-wrapper")
                    for(let i = 0; i < data.length; i++){
                        const element = document.createElement("div")
                        element.classList.add("detailed-income-expense")

                        element.innerHTML = `
                        <div class="details">
                            <div>
                                <span>${formatCategory(data[i].typeofExpenseIncome)}</span>
                                ,<span> ${formatExpense(data[i].subtypeofExpenseIncome)}</span>
                            </div>
                            <div>
                                <span>${Number(data[i].amount).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2
                            })}</span>
                            ,<span> ${data[i].recurring === true ? "Recurring" : "One-time" }</span>
                            </div>
                        </div>

                        <div class="action-buttons">
                            <div class="edit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg></div>
                            <div class="delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></div>
                       </div>
                        `
                        wrapper.appendChild(element)
                    }

                    const parent = document.querySelector(".parent")
                    parent.classList.add("show")

                    if(parent.clientHeight >= window.innerHeight - 40){
                        ADDITIONAL_ELEMENT.style.alignItems = "baseline"
                        ADDITIONAL_ELEMENT.style.overflowY = "auto"
                    }else{
                        ADDITIONAL_ELEMENT.style.alignItems = "center"
                    }

                    parent.addEventListener("click", (e)=>{
                        e.stopPropagation()
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

                            barChartSet()
                            donutsChartSet()
                            expensesIncomeList()
                        }
                    })

                    const deletingTaskQuestion = (id, type) =>{

                        const deleteElement = document.createElement("div")
                        deleteElement.classList.add("deleting-choice")
                        deleteElement.innerHTML = `
                        <div>
                            <span>Are you sure you want to delete this ${type}?</span>
                            <div>
                                <div class="cancel-del">Cancel</div>
                                <div class="delete-btn">Delete</div>
                            </div>
                        </div>
                        `
                        document.body.appendChild(deleteElement)

                        const deleteBody = document.querySelector(".deleting-choice > div")
                        deleteBody.addEventListener("click", (e)=> e.stopPropagation())

                        //button cancel
                        const cancel = document.querySelector(".cancel-del")
                        cancel.addEventListener("click", ()=>{
                            deleteElement.remove()
                        })

                        //delete req and close all
                        const deleteBtn = document.querySelector(".delete-btn")
                        deleteBtn.addEventListener("click", async ()=>{
                            if(deleteBtn.classList.contains("pending")){
                                return
                            }

                            deleteBtn.classList.add("pending")

                            const deleteRequest = await deleteExpenseIncome(id)

                            if(deleteRequest.success){
                                setTimeout(() => {
                                    deleteElement.remove()
    
                                    parent.classList.remove("show")
                                    parent.classList.add("hide")
                
                                    ADDITIONAL_ELEMENT.classList.remove("show")
                                    ADDITIONAL_ELEMENT.classList.add("hide")
                
                                    parent.addEventListener("animationend", ()=>{
                                        parent.classList.remove("hide")
                                        ADDITIONAL_ELEMENT.classList.remove("hide")
                                        document.body.style.overflow = "auto"
    
                                        ADDITIONAL_ELEMENT.innerHTML = ``
                                    })
                                }, 500);
                                
                                expenseData = await getAllUserCreated()
                                barChartSet()
                                donutsChartSet()
                                expensesIncomeList()
                            }else{
                                deleteElement.remove()
                            }

                        })

                        //close wrapper / window close
                        deleteElement.addEventListener("click", (e)=>{
                            e.stopPropagation()
                            deleteElement.remove()
                        })
                    }

                    //DELETING DATA
                    const delBtn = document.querySelectorAll(".delete")
                    for(let i = 0; i < delBtn.length; i++){
                        delBtn[i].addEventListener("click", ()=>{
                            deletingTaskQuestion(data[i]._id, type)
                        })
                    }

                    //EDIT DATA
                    
                }

                //filter the data like the donut chart
                //only show this month expense/income or recurring
                const allUserData = expenseData.data
                const todaysDate = new Date(Date.now())

                const expensesArray = allUserData.filter((expense)=>{
                    
                    const dateOfCreation = new Date(expense.createdAt)
                    const recurring = expense.recurring

                    if(expense.type === "expense"){
                        if(dateOfCreation.getMonth() + 1 === todaysDate.getMonth() + 1 && dateOfCreation.getFullYear() === todaysDate.getFullYear()){
                            return expense
                        }else if(recurring === true){
                            return expense
                        }
                    }
                })

                const incomesArray = allUserData.filter((income)=>{
                    const dateOfCreation = new Date(income.createdAt)
                    const recurring = income.recurring

                    if(income.type === "income"){
                        if(dateOfCreation.getMonth() + 1 === todaysDate.getMonth() + 1 && dateOfCreation.getFullYear() === todaysDate.getFullYear()){
                            return income
                        }else if(recurring === true){
                            return income
                        }
                    }
                })

                if(expensesArray.length){
                    EXPENSES_WRAPPER.innerHTML = ``
                    const sortedByAmountEXPENSES = expensesArray.toSorted((a, b) => b.amount - a.amount)

                    showSomeData(sortedByAmountEXPENSES)
                    EXPENSES_WRAPPER_PARENT.classList.add("show-expenses")
                    EXPENSES_WRAPPER.style.justifyContent = "space-between"

                    EXPENSES_WRAPPER_PARENT.addEventListener("click", (e)=>{
                        if(EXPENSES_WRAPPER_PARENT.classList.contains("show-expenses")){
                            e.stopPropagation()
                            showAllDetailed(sortedByAmountEXPENSES, "expense")
                        }
                    }, {once:true})
                }else{
                    EXPENSES_WRAPPER_PARENT.classList.remove("show-expenses")
                    EXPENSES_WRAPPER.innerHTML = `
                    <span class="no-data">You don't track any expenses currently!</span>
                    `
                    EXPENSES_WRAPPER.style.justifyContent = "center"
                }

                if(incomesArray.length){
                    INCOME_WRAPPER.innerHTML = ``
                    const sortedByAmountINCOME = incomesArray.toSorted((a, b) => b.amount - a.amount)

                    showSomeData(sortedByAmountINCOME)
                    INCOME_WRAPPER_PARENT.classList.add("show-expenses")
                    INCOME_WRAPPER.style.justifyContent = "space-between"

                    INCOME_WRAPPER_PARENT.addEventListener("click", (e)=>{
                        if(INCOME_WRAPPER_PARENT.classList.contains("show-expenses")){
                            e.stopPropagation()
                            showAllDetailed(sortedByAmountINCOME, "income")
                        }
                    }, {once:true})
                }else{
                    INCOME_WRAPPER_PARENT.classList.remove("show-expenses")
                    INCOME_WRAPPER.innerHTML = `
                    <span class="no-data">You don't track any income currently!</span>
                    `
                    INCOME_WRAPPER.style.justifyContent = "center"
                }

            }else{
                EXPENSES_WRAPPER.innerHTML = `
                <span class="no-data">You don't track any expenses currently!</span>
                `
                INCOME_WRAPPER.innerHTML = `
                <span class="no-data">You don't track any income currently!</span>
                ` 

                EXPENSES_WRAPPER.style.justifyContent = "center"
                INCOME_WRAPPER.style.justifyContent = "center"

                EXPENSES_WRAPPER_PARENT.classList.remove("show-expenses")
                INCOME_WRAPPER_PARENT.classList.remove("show-expenses")
            }
        }
        expensesIncomeList()
    }
    SET_ELEMENTS()

    PAGE_CONTENT.innerHTML = `
        <div class="dashboard">
            <span class="username">Welcome back, <span class="bolder">${data.data.name}</span>! </span>
            <div class="core-elements-wrapper">
                <div class="bar-donut-wrapper">
                    <div class="bar-chart-element"></div>

                    <div class="donuts-wrapper">
                        <div class="expense-donut"></div>
                        <div class="income-donut"></div>
                    </div>
                </div>

                <div class="expense-income-wrapper">
                    <div class="this-month-expenses">
                        <span class="expense-title">EXPENSES</span>
                        
                        <div class="expenses-wrapper"></div>
                    </div>

                    <div class="this-month-income">
                        <span class="income-title">INCOME</span>
                        
                        <div class="income-wrapper"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="additional-element"></div>
    `
}
