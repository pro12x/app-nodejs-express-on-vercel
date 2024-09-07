import AbstractView from "./AbstractView.js";
import {encodeBase64, showMessage} from "../utils.js";
import {navigateTo} from "../main.js";
import Dashboard from "./Dashboard.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Authentication")
    }

    async getHtml() {
        return `
            <div class="form">
                <form id="form">
                    <div class="form-header">
                        <h2>Sign In</h2>
                        <div id="error" style="height: 45px">&nbsp;</div>
                    </div>
                    <div class="form-group">
                        <label for="username">Email or username</label>
                        <input type="text" id="username" name="username" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" autocomplete="off">
                    </div>
                    <div class="form-check">
                        <input type="checkbox" id="visibility">
                        <span id="show">Show password</span>
                    </div>
                    <div class="form-group">
                        <button type="submit">Authenticate</button>
                    </div>
                </form>
            </div>
        `
    }

    login(credentials = {username: "", password: ""}) {
        const base64Credentials = encodeBase64(`${credentials.username}:${credentials.password}`)

        const headers = {
            "Authorization": `Basic ${base64Credentials}`,
            "Content-Type": "application/json"
        }

        fetch("https://learn.zone01dakar.sn/api/auth/signin", {
            method: "POST",
            headers: headers,
            type: "cors"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Invalid credentials")
                }
                return response.json()
            })
            .then(data => {
                let graph = new Dashboard()
                if (typeof(data) === "string") {
                    localStorage.setItem("token", data)
                    window.location.reload()
                    graph.graphData()
                    navigateTo("/dashboard")
                } else {
                    showMessage("Your credentials are incorrect")
                }
            })
            .catch(error => {
                console.error("Error during request:", error)
                alert("An error occurred while trying to log in")
            })
    }

    isAuthenticated() {
        return localStorage.getItem("token") !== null && (localStorage.getItem("token")).trim() !== ""
    }
}