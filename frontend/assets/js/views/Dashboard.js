import AbstractView from "./AbstractView.js"
import {changeToPourcent, drawBarChart, drawPieChart, userQuery} from "../graphql.js";
import {navigateTo} from "../main.js";
import {ConvertXp, ConvertXpBar} from "../utils.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Dashboard")
        this.token = this.getToken()
    }

    async getHtml() {
        return `
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark container d-flex justify-content-center">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link brand" href="javascript:void(0)">
                            <img src="assets/img/logo.png" width="32" height="32" alt="logo">
                            <span class="navbar-brand">GraphQL</span>
                        </a>
                    </li>
                </ul>
                <ul class="navbar-nav auth">
                    <li class="nav-item">
                        <span id="username"></span>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" id="logout">
                            <span class="material-icons">logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
    
            <div class="container content">
                <h1 class="mt-5">Welcome, <span id="firstname"></span>&nbsp;<span id="lastname"></span></h1>
    
                <div class="row mt-5">
                    <div class="col-lg-12 infos">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="text-center card-title">Level</h5>
                            </div>
                            <div class="card-body">
                                <div class="level">
                                    <span id="grade">1</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h5 class="text-center card-title">XP</h5>
                            </div>
                            <div class="card-body">
                                <div class="level">
                                    <span id="xpUser">1</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h5 class="text-center card-title">Audits ratio</h5>
                            </div>
                            <div class="card-body">
                                <div class="level">
                                    <span id="audit">1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-3">
                    <div class="col-lg-12 chart">
                        <div class="pie-chart">
                            <svg id="pie-chart" width="300" height="300"></svg>
                        </div>
                        <div class="bar-chart">
                            <svg id="bar-chart" width="400" height="300"></svg>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    graphData() {
        fetch("https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`
            },
            body: JSON.stringify({query: userQuery})
        })
            .then(response => response.json())
            .then(res => {
                let fails = []
                let passes = []

                res.data.fail.forEach(fa => {
                    if (fa.auditorId === res.data.user[0].id) {
                        fails.push(fa)
                    }
                })

                res.data.pass.forEach(pas => {
                    if (pas.auditorId === res.data.user[0].id) {
                        passes.push(pas)
                    }
                })

                let tab = changeToPourcent([fails.length, passes.length]);
                drawPieChart(tab, 150, 150, 100);

                let NameProject = [];
                let amount = [];

                res.data.transaction.forEach((e) => {
                    let tab = e.path.split("/");
                    if (tab[tab.length - 1] !== "piscine-js-2"){
                        amount.push(e.amount);
                        NameProject.push(tab[tab.length - 1]);
                    }
                });

                let tab2 = changeToPourcent(amount);
                let xps = [];
                amount.forEach((e) => {
                    xps.push(ConvertXpBar(e));
                });

                const datas = [];
                NameProject.forEach((e, i) => {
                    datas.push({ label: e, value: tab2[i], xp: xps[i] });
                });

                // Dessine le diagramme en barres
                drawBarChart(datas, 50, 100, 250, 100);


                let profile = document.getElementById("username");
                let grade = document.getElementById("grade");
                let audit = document.getElementById("audit");
                let xp = document.getElementById("xpUser");
                let firstname = document.getElementById("firstname");
                let lastname = document.getElementById("lastname");

                profile.textContent = res.data.user[0].login
                xp.textContent = ConvertXp(res.data.xp.aggregate.sum.amount)
                grade.textContent = res.data.grade[0].amount;
                audit.textContent = (res.data.up_sum.aggregate.sum.amount / res.data.down_sum.aggregate.sum.amount).toFixed(1);
                firstname.textContent = res.data.user[0].attrs.firstName;
                lastname.textContent = res.data.user[0].attrs.lastName;
            })
            .catch(error => {
                console.error("Error fetching data: ", error)
                navigateTo("/")
            })
    }
}