let grid = document.querySelector("#grid");
let selectorSize = document.getElementById("selectorSize");
let generateButton = document.getElementById("generate");
let listPrediction = document.getElementById("listPrediction");
let start = document.getElementById("start");
let arrowLeft = document.getElementById("q");
let arrowRight = document.getElementById("z");
let arrowUp = document.getElementById("d");
arrows = [arrowLeft, arrowRight, arrowUp];
for (let arrow of arrows) {
    arrow.addEventListener("mousedown", () => {
        addArrowInPrediction(arrow);
        arrow.classList.add("active");
    });
    arrow.addEventListener("mouseup", () => {
        arrow.classList.remove("active");
    });
}

function undoPrediction() {
    let lastArrow = listPrediction.lastChild;
    if (lastArrow) {
        lastArrow.remove();
    }
}

function clearPrediction() {
    listPrediction.innerHTML = "";
}



function addArrowInPrediction(arrow) {
    // Ajoute l'ID de la flèche à la liste des prédictions
    if (arrow.id == "q") {
        listPrediction.innerHTML += `<img src="Arrow_Left.png" alt="${arrow.id}" class="arrowLeft textPrediction" />`;
    }
    if (arrow.id == "z") {
        listPrediction.innerHTML += `<img src="Arrow_Icon.png" alt="${arrow.id}" class="arrowUp textPrediction" />`;
    }
    if (arrow.id == "d") {
        listPrediction.innerHTML += `<img src="Arrow_Right.png" alt="${arrow.id}" class="arrowRight textPrediction" />`;
    }
    
}

generateButton.addEventListener("click", () => {
    // Vérifie que la taille de la grille est bien comprise entre 3 et 40
    if (selectorSize.value < 3 || selectorSize.value > 40) {
        alert("Please enter a number between 3 and 40.");
        return;
    }
    generateGrid(selectorSize.value);
});

function generateGrid(size) {
    // Vide la grille pour éviter les bugs
    grid.innerHTML = "";
    let starts = [];
    let ends = [];
    // Permet de transmettre la taille de la grille (size) à la grille en CSS (variable --n)
    grid.style.setProperty("--n", size);
    for (let i = 0; i < size * size; i++) {
        const div = document.createElement("div");
        div.classList.add("cell");
        // Donne une ligne et une colonne à la div
        div.ariaRowIndex = Math.floor(i / size);
        div.ariaColIndex = i % size;
        // Pour chaque case de la grille, permet de donner la classe path à la case si elle est cliquée droit
        div.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (div.classList.contains("start") || div.classList.contains("end") || div.classList.contains("wall")) {
            return;
        }
        div.classList.toggle("path");
        });

        // récupére les potentielles cases de départ et d'arrivée
        if (div.ariaColIndex == 0) {
            starts.push(div);
        } else if (div.ariaColIndex == size - 1) {
            ends.push(div);
        } else {
            // Donne une chance sur 5 à une case d'être un mur
            if (Math.random() < 0.2) {
                div.classList.add("wall");
            }
        }
        grid.appendChild(div);
    }
    // Sélectionne au hasard une case de départ et une case d'arrivée
    let startIndex = Math.floor(Math.random() * starts.length);
    let endIndex = Math.floor(Math.random() * ends.length);
    let start = starts[startIndex];
    let end = ends[endIndex];
    // Enlever le départ et l'arrivée des listes
    starts.splice(startIndex, 1);
    ends.splice(endIndex, 1);
    // Donne une chance sur 5 à une case d'être un mur
    for (let start of starts) {
        start.classList.remove("start");
        if (Math.random() < 0.2) {
            start.classList.add("wall");
        }
    }
    for (let end of ends) {
        end.classList.remove("end");
        if (Math.random() < 0.2) {
            end.classList.add("wall");
        }
    }
    // Donne une couleur aux cases de départ et d'arrivée
    start.classList.add("start");
    end.classList.add("end");
    // Ajoute le robot sur la case de départ
    let robot = document.createElement("div");
    robot.classList.add("robot");
    robot.ariaRowIndex = start.ariaRowIndex;
    robot.ariaColIndex = start.ariaColIndex;
    robot.textContent = "🤖";
    start.appendChild(robot);
    openPrediction();
}

function openPrediction() {
    document.getElementById("listPrediction").style.width = "400px";
    document.getElementById("listPrediction").style.padding = "30px";
  }
  
  function closePrediction() {
    document.getElementById("listPrediction").style.width = "0";
  }

