const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols='~!@#$%^&*()_+=-[]{}\<>?`';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();

//set password length

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundColor=((passwordLength-min)*100/(max-min))+"% 100";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;

    //for shadow

   indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;

}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRndNumber(){
    return getRndInteger(0,9)
}

function generateRndLowercase(){
    return String.fromCharCode(getRndInteger(97,123))
}

function generateRndUppercase(){
    return String.fromCharCode(getRndInteger(65,91))
}

function generateRndSymbol(){
    const ranNum= getRndInteger(0,symbols.length);

    return symbols.charAt(ranNum);
}

function calcStrength(){
     let hasUpper=false;
     let hasLower=false;
     let hasNum=false;
     let hasSym=false;

     if(uppercaseCheck.checked) hasUpper=true;
     if(lowercaseCheck.checked) hasLower=true;
     if(numbersCheck.checked) hasNum=true;
     if(symbolsCheck.checked) hasSym=true;

     if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator('#0f0');
     }
     else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator('#ff0');
     }
     else{
        setIndicator('#f00');
     }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }

    //to make copied msg span visible
    copyMsg.classList.add("active")

    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);
}

function handleCheckboxClick(){
    checkCount=0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked)
            checkCount++
    });

    //special condition
    if(passwordLength<checkCount)
        passwordLength=checkCount;
        handleSlider();
}

function shufflePassword(array){

    //fisher yates algorithm

    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    let str = "";
    array.forEach((el)=>(str += el));

    return str;

}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxClick);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount==0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //start to find new password
    //remove old password
    password="";

    //lets put the stuff checked by checkbox
    // if(uppercaseCheck.checked){
    //     password+=generateRndUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateRndLowercase();
    // }
    // if(uppercaseCheck.checked){
    //     password+=generateRndNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateRndSymbol();
    // }


    let funarr=[];

    if(uppercaseCheck.checked)
        funarr.push(generateRndUppercase);

    if(lowercaseCheck.checked)
        funarr.push(generateRndLowercase);

    if(numbersCheck.checked)
        funarr.push(generateRndNumber);

    if(symbolsCheck.checked)
        funarr.push(generateRndSymbol);


    //compulsary addition
    for(let i=0;i<funarr.length;i++){
        password+=funarr[i]();
    }

    //remaining addition

    for(let i=0;i<passwordLength-funarr.length;i++){
        let randIndex=getRndInteger(0,funarr.length);
        password+=funarr[randIndex]();
    }

    //shuffle password

    password=shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;

    //calculate strength

    calcStrength();


})