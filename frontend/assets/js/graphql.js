export const userQuery = `
    query {
        user {
            id,
            login,
            profile,
            attrs
        }
        
        transaction(where: {type: {_eq: "xp"}, eventId:{_eq:56}, path:{_nlike:"/dakar/div-01/checkpoint/%"}},order_by:{createdAt:asc}) {
            id,
            amount,
            path,
            eventId,
            createdAt
        }
        
        xp: transaction_aggregate(where: {type: {_eq: "xp"}, eventId:{_eq:56}}) {
            aggregate {
                sum {
                    amount
                }
            }
        }
        
        up_sum: transaction_aggregate(where: {type: {_eq: "up"}, path: {_like: "/dakar/div-01%"}}) {
            aggregate {
                sum {
                    amount
                }
            }
        }
        
        down_sum: transaction_aggregate(where: {type: {_eq: "down"}, path: {_like: "/dakar/div-01%"}}) {
            aggregate {
                sum {
                    amount
                }
            }
        }
        
        grade: transaction(where: {type: {_eq: "level"}, path: {_like: "/dakar/div-01%"}}, order_by: {id: desc}, limit: 1) {
            amount
        }
        
        fail: audit(where: {grade: {_lt : 1}}, order_by: {createdAt: asc}) {
            createdAt,
            auditorId,
            grade
        }
        
        pass: audit(where: {grade: {_gte : 1}}, order_by: {createdAt: asc}) {
            createdAt,
            auditorId,
            grade
        }
    }
`

export const drawPieChart = (data, cx, cy, radius) => {
    let totalPercentage = 0;
    data.forEach(item => totalPercentage += item);

    let startAngle = -Math.PI / 2;
    let i = 0;

    data.forEach(item => {
        const endAngle = startAngle + (item / totalPercentage) * (Math.PI * 2);
        const largeArcFlag = item > 50 ? 1 : 0;
        const startX = cx + Math.cos(startAngle) * radius;
        const startY = cy + Math.sin(startAngle) * radius;
        const endX = cx + Math.cos(endAngle) * radius;
        const endY = cy + Math.sin(endAngle) * radius;

        // Crée un élément path SVG pour chaque portion du diagramme
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`);
        let labels = (i == 0) ? "Fail" : "Pass";
        path.id = labels;
        path.setAttribute("fill", getRandomColor());
        path.addEventListener("mouseover", function () {
            mouseover(labels);
        });
        path.addEventListener("mouseout", function () {
            mouseout(labels);
        });
        document.getElementById("pie-chart").appendChild(path);

        // Crée un élément texte SVG pour chaque label
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        const midX = cx + Math.cos(midAngle) * (radius / 2);
        const midY = cy + Math.sin(midAngle) * (radius / 2);
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", midX);
        label.setAttribute("y", midY);
        label.id = "label" + labels;
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "middle");
        const angleDeg = (midAngle * 180) / Math.PI;
        label.setAttribute("transform", `rotate(${angleDeg}, ${midX}, ${midY})`);
        label.style = "display:none;";
        label.textContent = labels + " " + Math.round(item) + "%";
        i++;
        document.getElementById("pie-chart").appendChild(label);

        startAngle = endAngle;
    });
}

export const getRandomColor = () => {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    const color = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
    return color;
}

// Fonction pour dessiner le diagramme en barres
export const drawBarChart = (data, x, y, width, height) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const barWidth = (width / data.length);

    data.forEach((item, index) => {
        const barHeight = ((item.value / total) * height) * 5;
        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bar.id = item.label;
        bar.addEventListener("mouseover", () => {
            mouseOverBar(item.label);
        });
        bar.addEventListener("mouseout", () => {
            mouseout(item.label);
        });
        bar.setAttribute("x", x + index * barWidth);
        bar.setAttribute("y", y + (height - barHeight));
        bar.setAttribute("width", barWidth);
        bar.setAttribute("height", barHeight);
        bar.setAttribute("fill", getRandomColor());
        document.getElementById("bar-chart").appendChild(bar);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x + index * barWidth + barWidth / 2);
        label.setAttribute("y", y + (height - barHeight) - 5);
        label.setAttribute("text-anchor", "middle");
        label.id = "label" + item.label;
        label.textContent = item.label + " " + item.xp;
        label.style = "font-size:3px; display:none";
        document.getElementById("bar-chart").appendChild(label);
    });
}

// Fonction pour afficher un label lors du survol d'une portion du diagramme
export const mouseover = (id) => {
    let label = document.getElementById("label" + id);
    if (label != null) {
        label.style.display = "block";
        label.style.fontSize = "90%";
        label.style.fontWeight = "bolder";
    }
}

// Fonction pour afficher un label lors du survol d'une barre du diagramme
export const mouseOverBar = (id) => {
    let label = document.getElementById("label" + id);
    if (label != null) {
        label.style.display = "block";
        label.style.fontSize = "90%";
        label.style.fontWeight = "bolder";
        label.setAttribute("x", 100);
    }
}

// Fonction pour cacher un label lorsqu'une section du diagramme n'est plus survolée
export const mouseout = (id) => {
    let label = document.getElementById("label" + id);
    if (label != null) {
        label.style.display = "none";
    }
}

export const changeToPourcent = (tab) => {
    // Convertit un tableau de valeurs en pourcentages
    let total = 0;
    let newTab = [];
    tab.forEach((e) => {
        total += Math.round(e);
    });
    tab.forEach((e) => {
        newTab.push((Math.round(e) / total) * 100);
    });
    return newTab;
}