let isRequestFinished = 0;
const nRequestsTotal = 3;
let userInput;

function checkLogin() {
    const username = document.querySelector(".login-input");
    const usernameValue = username.value.trim();
    if (usernameValue == '') {
        setErrorForLogin(username, "Vazio");
    }
    else {
        setSuccessForLogin(username);
        userOnline();
    }
}
function setErrorForLogin(input, message) {
    const formControl = input.parentNode;
    const small = formControl.querySelector('small');
    small.innerText = message;
    formControl.className = 'form-login error';
}
function setSuccessForLogin(input) {
    const formControl = input.parentNode;
    formControl.className = 'form-login success';
}

function userOnline() {
    const enterBottom = document.querySelector('.login-bottom');
    enterBottom.classList.add("background-blue");
}
function enterUser() {
    const username = document.querySelector(".login-input");
    const usernameValue = username.value.trim();
    if (usernameValue) {
        const loginLayout = document.querySelector('.login-wrapper');
        loginLayout.classList.add("hide");
        const mainLayout = document.querySelector('.container');
        mainLayout.classList.remove("hide");
        userInput = usernameValue;
        lastOrders();
        setInterval(lastOrders, 3000);
    }
}
// function signUser(errorHandled) {
//     userInput = prompt("Escreva seu nome");
// }
// signUser();

function selectModel(bottom) {
    const selectedBottom = document.querySelector(".model-wrapper .selected");
    selectedBottomCheck(selectedBottom, bottom);
}
function selectNeck(bottom) {
    const selectedBottom = document.querySelector(".neck-wrapper .selected");
    selectedBottomCheck(selectedBottom, bottom);
}
function selectMaterial(bottom) {
    const selectedBottom = document.querySelector(".material-wrapper .selected");
    selectedBottomCheck(selectedBottom, bottom);
}
function selectedBottomCheck(selectedBottom, bottom) {
    if (selectedBottom != null) {
        removeSelected(selectedBottom);
        isRequestFinished--;
    }
    addSelected(bottom.firstElementChild);
    isRequestFinished++;
    finishRequest();
}

function removeSelected(selected) {
    selected.classList.remove("selected");
}
function addSelected(selection) {
    selection.classList.add("selected");
}
function finishRequest() {
    const imageValue = document.querySelector(".form-input").value
    if (isRequestFinished == nRequestsTotal && isLinkValid(imageValue)) {
        const requestFinished = document.querySelector('.finish-request');
        const request = document.querySelector('.finish-request');
        request.classList.add("background-blue")
    }
}



function checkInput() {
    const image = document.querySelector(".form-input")
    const imageValue = image.value.trim()
    if (imageValue == '') {
        setErrorFor(image, 'Não pode estar vazio');
        finishRequest();
        return false;
    }
    else if (!isLinkValid(imageValue)) {
        setErrorFor(image, 'Link não é válido');
        finishRequest();
        return false;
    }
    else {
        setSuccessFor(image);
        finishRequest();
        return true;
    }
}

function setErrorFor(input, message) {
    const formControl = input.parentNode;
    const small = formControl.querySelector('small');
    small.innerText = message;
    formControl.className = 'form error';
}
function setSuccessFor(input) {
    const formControl = input.parentNode;
    formControl.className = 'form success';
}
function isLinkValid(param) {
    try {
        new URL(param);
    } catch (_) {
        return false;
    }
    return true;
}

function send() {
    let image = document.querySelector(".form-input").value;

    if ((isRequestFinished == nRequestsTotal) && isLinkValid(image)) {
        const modelSibling = document.querySelector('.model-wrapper .selected');//thumbnail
        let modelo = modelSibling.nextElementSibling.innerHTML;

        const neckSibling = document.querySelector('.neck-wrapper .selected');//thumbnail
        let pescoco = neckSibling.nextElementSibling.innerHTML;

        const materialSibling = document.querySelector('.material-wrapper .selected');//thumbnail
        let material = materialSibling.nextElementSibling.innerHTML;

        createObject(image, modelo, pescoco, material, userInput);
    }
}
function createObject(image, modelo, pescoco, materials, owner) {
    valuesPTtoEN(modelo, pescoco, materials);
    const objMessage = {
        model: model,
        neck: neck,
        material: material,
        image: image,
        owner: owner,
        author: userInput
    }
    sendObject(objMessage)
}
function valuesPTtoEN(modelo, neck, material) {
    portugueseToEnglishModel(modelo);
    portugueseToEnglishNeck(neck);
    portugueseToEnglishMaterials(material);
}

function portugueseToEnglishModel(modelo) {
    switch (modelo) {
        case "T-shirt": {
            model = "t-shirt";
            break;
        }
        case "Camiseta": {
            model = "top-tank";
            break;
        }
        case "Manga longa": {
            model = "long";
            break;
        }
        default: {
            console.log("error#01");
        }

    }
}
function portugueseToEnglishNeck(pescoco) {
    switch (pescoco) {
        case "Gola v": {
            neck = "v-neck";
            break;
        }
        case "Gola redonda": {
            neck = "round";
            break;
        }
        case "Gola polo": {
            neck = "polo";
            break;
        }
        default: {
            console.log("error#02")
        }

    }
}
function portugueseToEnglishMaterials(materials) {
    switch (materials) {
        case "Seda": {
            material = "silk"
            break;
        }
        case "Algodão": {
            material = "cotton"
            break;
        }
        case "Poliéster": {
            material = "polyester"
            break;
        }
        default: {
            console.log("error#03")
        }

    }
}

function sendObject(objMessage) {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/shirts-api/shirts", objMessage);
    promisse.then(handleSendSuccess);
    promisse.catch(handleSendError);

}
function handleSendError(error) {
    console.log("#error04", error);
}

function handleSendSuccess(answer) {
    alert("Seu pedido foi feito");
    console.log("Pedido enviado", answer);
}


/*********************************
 *       Ultimos Pedidos:        *
 *********************************/

function lastOrders() {
    console.log("entrei")
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/shirts-api/shirts");
    promisse.then(lastOrdersLoaded);
    promisse.catch(loadingLastOrdersError);
}

function loadingLastOrdersError(error) {
    console.log("#1 error")
}
function lastOrdersLoaded(answer) {
    printLastOrders(answer);
}
function printLastOrders(answer) {
    const card = answer.data;
    console.log(card)
    const cardLoading = document.querySelector(".last-orders-wrapper");
    cardLoading.innerHTML = "";
    for (let i = 0; i < card.length; i++) {
        cardLoading.innerHTML += `<div class="card-wrapper" onclick = "takeOrderOfOtherCreator(this)">
        <img class="orders-img" src="${card[i].image}" alt="imagem" >
        <p class="author"><span class="creator">Criador:</span> ${card[i].owner}</p >
        <span class = "hide"> 
            <span class = "idValue">${card[i].id}</span>
            <span class = "imageValue">${card[i].image}</span>
            <span class = "modelValue">${card[i].model}</span>
            <span class = "neckValue">${card[i].neck}</span>
            <span class = "materialValue">${card[i].material}</span>
            <span class = "ownerValue">${card[i].owner}</span>
        </span>
    </div >`
    }
}

function takeOrderOfOtherCreator(bottom) {

    const spanValues = bottom.lastElementChild.querySelectorAll("span");
    spanValueTreatment(spanValues);
}
function spanValueTreatment(spanWrapperSelected) {
    let idValue = spanWrapperSelected[0].innerText;
    let imageValue = spanWrapperSelected[1].innerText;
    let modelValue = spanWrapperSelected[2].innerText;
    let neckValue = spanWrapperSelected[3].innerText;
    let materialValue = spanWrapperSelected[4].innerText;
    let ownerValue = spanWrapperSelected[5].innerText;
    showLastOrderCardToUser(idValue, imageValue, modelValue, neckValue, materialValue, ownerValue);
}
function showLastOrderCardToUser(idValue, imageValue, modelValue, neckValue, materialValue, ownerValue) {
    valuesENtoPT(modelValue, neckValue, materialValue);
    let userReturn = confirm(`CDeseja encomendar o produto de ${ownerValue}?
    Detalhes da encomenda: 
    Id:${idValue}
    Modelo: ${model}
    Tipo de gola: ${neck}
    Material: ${material}
    `);
    if (userReturn == true)
        createObject(imageValue, model, neck, material, ownerValue);
}
function valuesENtoPT(modelValue, neckValue, materialValue) {
    englishToPortugueseModel(modelValue);
    englishToPortugueseNeck(neckValue);
    englishToPortugueseMaterial(materialValue);
}
function englishToPortugueseModel(modelValue) {
    switch (modelValue) {
        case "t-shirt": {
            model = "T-shirt";
            break;
        }
        case "top-tank": {
            model = "Camiseta";
            break;
        }
        case "long": {
            model = "Manga longa";
            break;
        }
        default: {
            console.log("error#05");
        }

    }
}
function englishToPortugueseNeck(neckValue) {
    switch (neckValue) {
        case "v-neck": {
            neck = "Gola v";
            break;
        }
        case "round": {
            neck = "Gola redonda";
            break;
        }
        case "polo": {
            neck = "Gola polo";
            break;
        }
        default: {
            console.log("error#06")
        }

    }
}
function englishToPortugueseMaterial(materialValue) {
    switch (materialValue) {
        case "silk": {
            material = "Seda"
            break;
        }
        case "cotton": {
            material = "Algodão"
            break;
        }
        case "polyester": {
            material = "Poliéster"
            break;
        }
        default: {
            console.log("error#07")
        }

    }
}
