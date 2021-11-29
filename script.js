let isRequestFinished = 0;
const nRequestsTotal = 3;

let userInput;
let idValue = 0
let imageValue = 0;
let modelValue = 0;
let neckValue = 0;
let materialValue = 0;
let ownerValue = 0;

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
    const imageLink = document.querySelector(".form-input")
    const imageValue = imageLink.value.trim()
    if (imageValue == '') {
        setErrorFor(imageLink, 'Não pode estar vazio');
        finishRequest();
        return false;
    }
    else if (!isLinkValid(imageValue)) {
        setErrorFor(imageLink, 'Link não é válido');
        finishRequest();
        return false;
    }
    else {
        setSuccessFor(imageLink);
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

        const neckSibling = document.querySelector('.neck-wrapper .selected');
        let pescoco = neckSibling.nextElementSibling.innerHTML;

        const materialSibling = document.querySelector('.material-wrapper .selected');
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

function sendObject(objMessage) {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/shirts-api/shirts", objMessage);
    promisse.then(handleSendSuccess);
    promisse.catch(handleSendError);

}
function handleSendError(error) {
    console.log(error.data);
}

function handleSendSuccess(answer) {
    alert("Seu pedido foi feito");
}
/*********************************
 *       Ultimos Pedidos:        *
 *********************************/
function lastOrders() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/shirts-api/shirts");
    promisse.then(lastOrdersLoaded);
    promisse.catch(loadingLastOrdersError);
}

function loadingLastOrdersError(error) {
    console.log(error.data)
}
function lastOrdersLoaded(answer) {
    printLastOrders(answer);
}
function printLastOrders(answer) {
    const card = answer.data;
    const cardLoading = document.querySelector(".last-orders-wrapper");
    cardLoading.innerHTML = "";
    for (let i = 0; i < card.length; i++) {
        cardLoading.innerHTML += `<div class="card-wrapper" onclick = "takeOrderOfOtherCreator(this)">
        <img class="orders-img" src="${card[i].image}" alt="imagem" >
        <p class="author"><span class="creator">Criador: </span>${card[i].owner}</p >
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
    idValue = spanWrapperSelected[0].innerText;
    imageValue = spanWrapperSelected[1].innerText;
    modelValue = spanWrapperSelected[2].innerText;
    neckValue = spanWrapperSelected[3].innerText;
    materialValue = spanWrapperSelected[4].innerText;
    ownerValue = spanWrapperSelected[5].innerText;
    showLastOrderCardToUser(idValue, imageValue, modelValue, neckValue, materialValue, ownerValue);
}

function showLastOrderCardToUser(idValue, imageValue, modelValue, neckValue, materialValue, ownerValue) {
    valuesENtoPT(modelValue, neckValue, materialValue);

    lastCardInformations(idValue, imageValue, modelValue, neckValue, materialValue, ownerValue);
}
function lastCardInformations(idValue, imageValue, modelValue, neckValue, materialValue, ownerValue) {
    valuesENtoPT(modelValue, neckValue, materialValue);
    const containerRequest = document.querySelector('.container')
    containerRequest.classList.add("hide");
    const lastOrderCardInformation = document.querySelector('.confirm-request-wrapper')
    lastOrderCardInformation.classList.remove("hide")

    const inputInformations = document.querySelector('.last-order');
    inputInformations.innerHTML = `
    <img class="last-order-image" src="${imageValue}" alt="imagem de login">
    <div class="informations-request">
    <p>Deseja encomendar o produto de <span>${ownerValue}</span>? </p>
    <p>Detalhes da encomenda:</p>
    <p>Id: <span>${idValue}</span></p>
    <p>Modelo: <span>${model}</span></p>
    <p>Tipo de gola: <span>${neck}</span></p>
    <p>Material: <span>${material}</span></p>
    </div>`
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
            console.log("error#07 erro na tradução")
        }

    }
}
function cancelLastOrderRequest() {
    hideLastOrderInformations();
}
function confirmLastOrderRequest() {
    valuesENtoPT(modelValue, neckValue, materialValue);
    createObject(imageValue, model, neck, material, ownerValue);
    hideLastOrderInformations();
}

function hideLastOrderInformations() {
    const containerRequest = document.querySelector('.container')
    containerRequest.classList.remove("hide");
    const lastOrderCardInformation = document.querySelector('.confirm-request-wrapper')
    lastOrderCardInformation.classList.add("hide")
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
            console.log("error#05 erro na tradução");
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
            console.log("error#06 erro na tradução")
        }

    }
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
            console.log("error#01 erro na tradução");
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
            console.log("error#02 erro na tradução")
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
            console.log("error#03 erro na tradução")
        }

    }
}
