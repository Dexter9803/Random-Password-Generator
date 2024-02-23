const inputSlider = document.querySelector("#data-lengthSlider");
const lengthDisplay = document.querySelector("#data-lengthNumber");
const passwordDisplay = document.querySelector("#data-passwordDisplay");
const copyBtn = document.querySelector("#data-copy");
const copyMsg = document.querySelector("#data-copyMsg");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("#data-indicator");
const generateBtn = document.querySelector("#data-generatePass");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength indicator color to gray 
handleSlider();
//default white color
setIndicator("#ccc")


//----------------------- operations needed--------------------------
// 1) copy button
// 2)handle slider
// 3)generate password
// 4)set indicator
// 5)get random integer(min, max)
// 6)get random uppercase
// 7)get random lowercase
// 8)get random numbers
// 9)get symbols            



//sets password length deafault:10
function handleSlider()
{      
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;  

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)) + "% 100%" 
};

//set colour of indicator acc to received input
function setIndicator(color)
{   
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//generate random integer acc to received range
function getRndInteger(min, max)
{
    return Math.floor(Math.random() * (max-min)) + min;   
}

//generates random number
function generateRndNumber()
{
    return getRndInteger(0,9)
}

//generates random lowercase char
function generateLowercase()
{
    return String.fromCharCode(getRndInteger(97,123));      //a=97 z=122
}

//generates random uppercase char
function generateUppercase()
{
    return String.fromCharCode(getRndInteger(65,91));      //A=65 Z=90 
}

//generates random symbols from the string
function generateSymbol()
{
    //w'll make string of symbols and select from that string randomly
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

//calculating strength
function calcStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;


    // setting color wrt conditions
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
    {
        setIndicator('#0f0');
    }
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6)
    {
        setIndicator('#ff0');
    }
    else
    {
        setIndicator('#f00');
    };
}

//copies in clipboard
async function copyContent()
{
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "Copied!"
    }
    catch(e)
    {
        copyMsg.innerText = "failed"
    }

    //span visible
    copyMsg.classList.add("active")

    //hide after 2s
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
    
}

//if slider's value changed (coz of sliding) then it reflects value to the UI
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value
    handleSlider();
});

//if any passwrd is available then copy it to the clipboard on click event
copyBtn.addEventListener('click', ()=> {
    if(passwordDisplay.value)
        copyContent();
})

//shuffling password
function shufflePassword(array)
{
    //fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      let str = "";
      array.forEach((el) => (str += el));
      return str;

}


function handleCheckboxChange()
{
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)    
            checkCount++;
    })

    //special case (what if all checkboxes are checked and slider is at 1)
    if(passwordLength < checkCount)
        passwordLength = checkCount;
        handleSlider();
}

//whenever change occurs above function will come and count how many checked boxes are there?
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change' , handleCheckboxChange)
})



generateBtn.addEventListener('click', ()=> {
    //none of the checkbox are selected
    if(checkCount <= 0)
        return;

    if(passwordLength < checkCount) 
    {
        passwordLength = checkCount
        handleSlider();
    }


    //let's start the journey to find new password
    //remove old password
    password = "";

    
    let funcArr = [];

    if(uppercaseCheck.checked)
    {
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked)
    {
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked)
    {
        funcArr.push(generateRndNumber);
    }
    if(symbolsCheck.checked)
    {
        funcArr.push(generateSymbol);
    }

    //compulsory addition
    for(let i=0; i<funcArr.length; i++)
    {
        password += funcArr[i]();
    }
    
    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++)
    {
        let randomIndex = getRndInteger(0, funcArr.length)
        password += funcArr[randomIndex]();
    }

    //shuffling password
    password = shufflePassword(Array.from(password));
    
    //showing password in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
})




