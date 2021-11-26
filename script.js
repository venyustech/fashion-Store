let i = 0;
function selectModel(bottom) {
    const selectedBottom = document.querySelector(".model-wrapper .selected");
    selectRequest(selectedBottom, bottom);
}
function selectNeck(bottom) {
    const selectedBottom = document.querySelector(".neck-wrapper .selected");
    selectRequest(selectedBottom, bottom);
}
function selectMaterial(bottom) {
    const selectedBottom = document.querySelector(".material-wrapper .selected");
    selectRequest(selectedBottom, bottom);
}
function selectRequest(selectedBottom, bottom) {
    if (selectedBottom != null) {
        removeSelected(selectedBottom);
        i--;
    }
    addSelected(bottom.firstElementChild);
    i++;
    finishRequest();
}
function removeSelected(selected) {
    selected.classList.remove("selected");
}
function addSelected(selection) {
    selection.classList.add("selected");
}
function finishRequest() {
    const nRequestsTotal = 4;
    if (i == nRequestsTotal) {
        const requestFinished = document.querySelector('.finish-request');
        const request = document.querySelector('.finish-request');
        request.classList.add("background-blue")
    }
    console.log(i)
}



