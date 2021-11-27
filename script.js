let isRequestFinished = 0;
const nRequestsTotal = 3;
let userInput;
function signUser(errorHandled) {
    userInput = prompt("Escreva seu nome");
}
signUser();
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
        let model = modelSibling.nextElementSibling.innerHTML;

        const neckSibling = document.querySelector('.neck-wrapper .selected');//thumbnail
        let neck = neckSibling.nextElementSibling.innerHTML;

        const materialSibling = document.querySelector('.material-wrapper .selected');//thumbnail
        let material = materialSibling.nextElementSibling.innerHTML;

        createObject(image, model, neck, material);
    }
}
function createObject(image, modelo, pescoco, materials) {
    valuesPTtoEN(modelo, pescoco, materials);
    const objMessage = {
        model: model,
        neck: neck,
        material: material,
        image: image,
        owner: userInput,
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
            console.log(model);
            break;
        }
        case "Camiseta": {
            model = "top-tank";
            console.log(model);
            break;
        }
        case "Manga longa": {
            model = "long";
            console.log(model);
            break;
        }
        default: {
            console.log("error#05");
        }

    }
}
function portugueseToEnglishNeck(pescoco) {
    switch (pescoco) {
        case "Gola v": {
            neck = "v-neck";
            console.log(neck);
            break;
        }
        case "Gola redonda": {
            neck = "round";
            console.log(neck);
            break;
        }
        case "Gola polo": {
            neck = "polo";
            console.log(neck);
            break;
        }
        default: {
            console.log("error#06")
        }

    }
}
function portugueseToEnglishMaterials(materials) {
    switch (materials) {
        case "Seda": {
            material = "silk"
            console.log(material)
            break;
        }
        case "Algodão": {
            material = "cotton"
            console.log(material)
            break;
        }
        case "Poliéster": {
            material = "polyester"
            console.log(material)
            break;
        }
        default: {
            console.log("error#07")
        }

    }
}

function sendObject(objMessage) {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/shirts-api/shirts", objMessage);
    promisse.then(handleSendSuccess);
    promisse.catch(handleSendError);

}
function handleSendError(error) {
    console.log("#error08", error);
}

function handleSendSuccess(answer) {
    alert("Seu pedido foi feito");
    console.log("Pedido enviado", answer);
}


/*********************************
 *       Ultimos Pedidos:        *
 *********************************/

function lastOrders() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/shirts-api/shirts");
    promisse.then(lastOrdersLoaded);
    promisse.catch(loadingLastOrdersError);
}
lastOrders();
setInterval(lastOrders, 3000);
function loadingLastOrdersError(error) {
    console.log("#2 error")
}
function lastOrdersLoaded(answer) {
    printLastOrders(answer);
}
function printLastOrders(answer) {
    const card = answer.data;
    const cardLoading = document.querySelector(".last-orders-wrapper");
    cardLoading.innerHTML = "";
    for (let i = 0; i < card.length; i++) {
        cardLoading.innerHTML += `<div class="card-wrapper">
        <img class="orders-img" src="${card[i].image}" alt="imagem">
        <p class="author"><span class="creator">Criador:</span> ${card[i].owner}</p >
    </div >
            `
    }
}
