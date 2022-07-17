// Cookie Settings
const cookieDays = 100;
const cookieName = "lobbyCode";

// Function to set a given cookieName with a given value
function setCookie(cookieName, cookieValue) {
    const d = new Date();
    d.setTime(d.getTime() + (cookieDays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();

    document.cookie = cookieName + "=" + cookieValue + ";" + expires;
}

// Function to read a given cookieName
function getCookie(cookieName) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}