import {navigateTo} from "../main.js";

export default class {
    constructor() {
        //
    }

    setTitle(title) {
        document.title = title
    }

    async getHtml() {
        return ""
    }

    removeToken() {
        localStorage.removeItem("token")
    }

    getToken() {
        return localStorage.getItem("token")
    }

    logout() {
        if (this.getToken()) {
            this.removeToken()
            navigateTo("/")
            window.location.reload()
        }
    }
}