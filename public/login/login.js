const allInputFields = document.querySelectorAll("input")
const allPlaceHolders = document.querySelectorAll(".field-placeholder")
const passwordStrengthElement = document.querySelector(".password-strength-wrapper")

const allErrorSpans = document.querySelectorAll(".error-span")
const CAPTCHA_CONTAINER = document.querySelector(".recaptcha-container")

for(let i = 0; i < allInputFields.length; i++){
    
    allInputFields[i].addEventListener("focus", ()=>{
        if(allInputFields[i].value.trim().length === 0){
            allPlaceHolders[i].style.top = 0
            allPlaceHolders[i].classList.add("small")
        }
    })
    allInputFields[i].addEventListener("blur", ()=>{
        if(allInputFields[i].value.trim().length === 0){
            allPlaceHolders[i].style.top = `50%`
            allPlaceHolders[i].classList.remove("small")
        }
    })
}

const eyeSVG = document.querySelector(".field-wrapper > .eye-svg")
eyeSVG.addEventListener("click", (e)=>{
    e.stopPropagation()

    if(allInputFields[1].type === "text"){
        allInputFields[1].type = "password"
        eyeSVG.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>`

    }else if(allInputFields[1].type === "password"){
        allInputFields[1].type = "text"
        eyeSVG.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>`
    }
})


//send a login request to the server
const sendLoginRequest = async ()=>{
    const { success, emailInput, passwordInput, reCAPTCHAClientResponse } = inputChecker()

    if(success){
        try{
            loginButton.classList.add("disableButton")

            const requestBody = {
                "email": emailInput,
                "password": passwordInput,
                "g-recaptcha-response": reCAPTCHAClientResponse
            } 
    
            const request = await fetch(`/expenses-tracker/api/v1/authUser/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            })
            const data = await request.json()
    
            if(data.user && data.token){
                //save the token in the storage and then redirect
                console.log(data)

                
                localStorage.setItem("token", data.token)

                setTimeout(() => {
                    window.location.pathname = "/dashboard"
                }, 1000);
                
            }else{
                //run second error handler
                //console.log(data)
                inputChecker(data)
                grecaptcha.reset()

                loginButton.classList.remove("disableButton")
            }
    
        }catch(error){
            console.log(error)
        }
    }
}

const inputChecker = (err) =>{

    let success = true

    const emailInput = allInputFields[0].value.trim()
    const passwordInput = allInputFields[1].value.trim()

    const reCAPTCHAClientResponse = grecaptcha.getResponse()

    //this would prevent a request
    if(emailInput.length === 0){
        success = false
        allErrorSpans[0].textContent = "Email fiend is required!"
        allInputFields[0].classList.add("invalid")
        allPlaceHolders[0].classList.add("invalid")

    }

    if(passwordInput.length === 0){
        success = false
        allErrorSpans[1].textContent = "Password field is required!"
        allInputFields[1].classList.add("invalid")
        allPlaceHolders[1].classList.add("invalid")
    }

    if(!reCAPTCHAClientResponse){
        success = false
        CAPTCHA_CONTAINER.classList.add("failed")
        CAPTCHA_CONTAINER.addEventListener("animationend", ()=>{
            CAPTCHA_CONTAINER.classList.remove("failed")
        })
    }

    if(err && err.msg === "Invalid email or password."){
        allInputFields[0].value = ""
        allInputFields[1].value = ""

        allInputFields[0].classList.add("invalid")
        allPlaceHolders[0].classList.add("invalid")
        allInputFields[1].classList.add("invalid")
        allPlaceHolders[1].classList.add("invalid")

        allPlaceHolders[0].style.top = `50%`
        allPlaceHolders[0].classList.remove("small")
        allPlaceHolders[1].style.top = `50%`
        allPlaceHolders[1].classList.remove("small")

        allErrorSpans[1].textContent = "Invalid email or password!"
    }

    return {success, emailInput, passwordInput, reCAPTCHAClientResponse}
}

const loginButton = document.querySelector(".submit-button")
loginButton.addEventListener("click", ()=>{
    if(loginButton.classList.contains("disableButton")){
        return 
    }

    sendLoginRequest()
})

allInputFields[0].addEventListener("input", ()=>{
    if(allInputFields[0].value.trim().length){
        allErrorSpans[0].textContent = ""
        allInputFields[0].classList.remove("invalid")
        allPlaceHolders[0].classList.remove("invalid")
    }
})
allInputFields[1].addEventListener("input", ()=>{
    if(allInputFields[1].value.trim().length){
        allErrorSpans[1].textContent = ""
        allInputFields[1].classList.remove("invalid")
        allPlaceHolders[1].classList.remove("invalid")
    }
})

window.addEventListener("pageshow", ()=>{
    for(let i = 0; i < allInputFields.length; i++){
        allInputFields[i].value = ""
        allPlaceHolders[i].style.top = "50%"
        allPlaceHolders[i].classList.remove("small")
        allErrorSpans[i].textContent = ""
        allPlaceHolders[i].classList.remove("invalid")
        allInputFields[i].classList.remove("invalid")
        grecaptcha.reset()
    }
})