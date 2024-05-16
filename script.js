let grid = document.querySelector("#grid");
let selectorSize = document.getElementById("selectorSize");
let generateButton = document.getElementById("generate");
let listPrediction = document.getElementById("listPrediction");
let start = document.getElementById("start");
let arrowDirection = document.getElementById("arrow");
let arrowLeft = document.getElementById("q");
let arrowRight = document.getElementById("z");
let arrowUp = document.getElementById("d");
let spinner = document.getElementById("spinner");
let keys = document.getElementById("keys");
let arrowNText = document.getElementById("arrowNText");

// Cache le spinner, les flèches directionnelles
spinner.style.display = "none";
keys.style.display = "none";
arrowNText.style.display = "none";

// Initialise les variables pour pouvoir les utiliser dans les fonctions
let RobotStartDirection = "";
let rotation = "";

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
    // Vide la grille pour éviter les bugs
    grid.innerHTML = "";
    // Affiche le spinner
    spinner.style.display = "flex";
    setTimeout(() => {
        generateGrid(selectorSize.value);
        // Cache le spinner
        spinner.style.display = "none";
    }, 2000);
    keys.style.display = "flex";
    arrowNText.style.display = "flex";
    rotation = giveRandomDirection();
    RobotStartDirection = getRobotStartDirection(rotation);
    
    
});

function generateGrid(size) {
    // Ferme la liste des prédictions et affiche le spinner
    closePrediction();
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
    // Vide les prédictions et les affiche
    clearPrediction();
    openPrediction();
}

function openPrediction() {
    document.getElementById("listPrediction").style.width = "400px";
    document.getElementById("listPrediction").style.padding = "30px";
}

function closePrediction() {
    document.getElementById("listPrediction").style.width = "0";
}

function giveRandomDirection() {
    let rotation = Math.floor(Math.random() * 4) * 90;
    arrowDirection.style.transform = `rotate(${rotation}deg)`;
    return rotation;
}

function getRobotStartDirection(rotation) {
    let directions = ["right", "down", "left", "up"];
    return directions[rotation / 90];
}

function verifyMazeCanBeFinished(){
    let robot = document.querySelector(".robot");
    let end = document.querySelector(".end");
    let walls = document.querySelectorAll(".wall");
    let robotRow = robot.ariaRowIndex;
    let robotCol = robot.ariaColIndex;
    let endRow = end.ariaRowIndex;
    let endCol = end.ariaColIndex;
    let visited = [];
    let wallsCoordonates = [];
    let noUp = false;
    let noDown = false;
    let noLeft = false;
    let noRight = false;

    robotRow = +robotRow;
    robotCol = +robotCol;
    endRow = +endRow;
    endCol = +endCol;
    for (let wall of walls) {
        let wallX = +wall.ariaRowIndex;
        let wallY = +wall.ariaColIndex;
        wallsCoordonates.push([wallX, wallY]);
    }
    let paths = [[robotRow, robotCol]];
    let coordonates = [];
    while (paths.length > 0) {
        coordonates = paths.pop();
        let row = coordonates[0];
        let col = coordonates[1];
        // Si le robot est sur la case d'arrivée, le labyrinthe peut être fini
        if (row == endRow && col == endCol) {
            // Colore les cases visitées en orange
            /*visited.shift();
            visited.forEach((arr, index) => {
                setTimeout(() => {
                    let cell = document.querySelector(`[aria-rowindex="${arr[0]}"][aria-colindex="${arr[1]}"]`);
                    cell.classList.add("visited");
                }, index * 1000); // Multiplier l'index par 1000 pour obtenir un délai incrémentiel
            });*/
            return true;
        }
        // Si la case du dessus est le bord ou un mur ou a déjà été visitée, le robot ne peut pas aller en haut
        if (row <= 0){
            noUp = true;
        } else if (wallsCoordonates.some(arr => arr[0] === row-1 && arr[1] === col)){
            noUp = true;
        } else if (visited.some(arr => arr[0] === row-1 && arr[1] === col)){
            noUp = true;
        } else if (paths.some(arr => arr[0] === row-1 && arr[1] === col)){
            noUp = true;
        }
        // Si la case du bas est le bord ou un mur ou a déjà été visitée, le robot ne peut pas aller en bas
        if (row >= (+selectorSize.value - 1)){
            noDown = true;
        } else if (wallsCoordonates.some(arr => arr[0] === (row+1) && arr[1] === col)){
            noDown = true;
        } else if (visited.some(arr => arr[0] === (row+1) && arr[1] === col)){
            noDown = true;
        } else if (paths.some(arr => arr[0] === (row+1) && arr[1] === col)){
            noDown = true;
        }
        // Si la case de gauche est le bord ou un mur ou a déjà été visitée, le robot ne peut pas aller à gauche
        if (col <= 0){
            noLeft = true;
        } else if (wallsCoordonates.some(arr => arr[0] === row && arr[1] === col-1)){
            noLeft = true;
        } else if (visited.some(arr => arr[0] === row && arr[1] === col-1)){
            noLeft = true;
        } else if (paths.some(arr => arr[0] === row && arr[1] === col-1)){
            noLeft = true;
        }
        // Si la case de droite est le bord ou un mur ou a déjà été visitée, le robot ne peut pas aller à droite
        if (col >= (+selectorSize.value - 1)){
            noRight = true;
        } else if (wallsCoordonates.some(arr => arr[0] === row && arr[1] === (col+1))){
            noRight = true;
        } else if (visited.some(arr => arr[0] === row && arr[1] === (col+1))){
            noRight = true;
        } else if (paths.some(arr => arr[0] === row && arr[1] === (col+1))){
            noRight = true;
        }
        // Si la case n'a pas déjà été visitée, on l'ajoute à la liste des cases visitées
        if (!visited.some(arr => arr[0] === row && arr[1] === col)) {
            visited.push([row, col]);
        }
        // Si le robot peut aller dans une direction, on ajoute cette direction à la liste des chemins possibles
        if (!noUp) {
            paths.push([row - 1, col]);
        }

        if (!noDown) {
            paths.push([row + 1, col]);
        }

        if (!noLeft) {
            paths.push([row, col - 1]);
        }

        if (!noRight) {
            paths.push([row, col + 1]);
        }
        // On réinitialise les variables pour la prochaine itération
        noUp = false;
        noDown = false;
        noLeft = false;
        noRight = false;
    }
    // Si le robot ne peut pas atteindre la case d'arrivée, le labyrinthe ne peut pas être fini
    return false;
}

function test(){
    if (verifyMazeCanBeFinished()){
        alert("The maze can be finished");
    } else {
        alert("The maze can't be finished");
    }
}
