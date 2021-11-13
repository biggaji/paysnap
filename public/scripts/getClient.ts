async function getClientHeader() {
    let cut = document.cookie.split("=")[1];
    return cut;
};