import "./css/index.css"
 import Imask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");
const ccBg = document.querySelector(".cc")

function setCardType(type) {
  const colors = {
      "visa":       ["#d8523d", "#d8523d", "red"],
      "mastercard": ["#343838", "#343838", "#030506"],
      "nubank":     ["#500061", "#991999", "#500061"],
      "default":   [ "blue" ,"blue", "blue"],
      
  };
  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
  ccBg.style.backgroundColor = (colors[type][2])
  ccBg.style.borderRadius = "20px"
};
setCardType("default");
/* #030506 */

// securityCode
const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
  mask: "0000"

}
const securityCodeMasked = IMask (securityCode, securityCodePattern)

// nesta parte é definido a quantidade de numeros que irão conter na data de expiração para ano e mes
const expirationDate = document.querySelector("#expiration-date")

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {         
    YY: {
      mask: IMask.MaskedRange,
      from: String(  new Date().getFullYear()).slice(2)  ,
      to: String(  new Date().getFullYear() + 20).slice(2),
        //aqui é pegado o ano atual e somado + 20 2 separado só pelos 2 ultimos numeros
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// aqui se inicia a parte do numero dos cartoes
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/, //expressao regular
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(516220|516230|516292|523421|537678|550209|554865)\d{0,10}/, 
      cardtype: "nubank",
    }, 
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,     
      cardtype: "mastercard",
    },
 
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
    {
    mask: '0000 0000 0000 0000',
    regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
    cardtype: "maestro"
    },
  ],
  dispatch: function( appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g,"")
    const foundMask = dynamicMasked.compiledMasks.find(function(item)  {
    return number.match(item.regex)
    })
    console.log(foundMask)
    
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)
// Evento de alerta na tela ao adicionar o cartão
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
alert("Cartão adicionado")
})

document.querySelector("form").addEventListener("submit",(event) => {
  event.preventDefault()
})
// Const que muda o nome do cartão ao ser digitado
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {

  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length  === 0 ? "FULANO DA SILVA"  : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);

})

function updateSecurityCode(code) {

  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code 

}

cardNumberMasked.on("accept", () => {
  const cardtype = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardtype)
updateCardNumber(cardNumberMasked.value)

})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ?  "1234 5678 7654 3210" : number 
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)

})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}