export const encodeBase64 = (data) => {
    return btoa(data)
}

export const credentials = {
    username: "",
    password: ""
}

export const showMessage = (message) => {
    const item = document.getElementById("error")
    item.textContent = message
    item.style.display = "block"
    item.classList.add("error")

    setTimeout(() => {
        item.innerHTML = "&nbsp;"
        item.classList.remove("error")
    }, 3000)
}

export const checkForm = (credentials) => {
    return !(credentials.username.trim() === "" || credentials.password.trim() === "");
}

export const ConvertXpBar = (xp) => {
    // Convertit une valeur d'XP en une chaîne lisible avec des unités, avec une décimale
    if (xp < 1000) {
        return xp.toFixed(1).toString() + "B";
    } else if (xp < 1000000) {
        return ((xp * 0.001).toFixed(1)).toString() + "KB";
    } else {
        return (xp * 0.0001).toFixed(1).toString() + "MB";
    }
}

export const ConvertXp = (xp) => {
    // Convertit une valeur d'XP en une chaîne lisible avec des unités
    if (xp < 1000) {
        return (Math.round(xp)).toString() + "B";
    } else if (xp < 1000000) {
        return (Math.round(xp * 0.001)).toString() + "KB";
    } else {
        var temp = xp / 1000000
        return temp.toFixed(2).toString() + "MB";;
    }
}