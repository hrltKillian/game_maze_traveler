let grid = document.querySelector("#grid");
let listPrediction = document.getElementById("listPrediction");
let start = document.getElementById("start");
let arrowDirection = document.getElementById("arrow");
let arrowLeft = document.getElementById("q");
let arrowRight = document.getElementById("z");
let arrowUp = document.getElementById("d");
let spinner = document.getElementById("spinner");
let keys = document.getElementById("keys");
let arrowDiv = document.getElementById("arrowDiv");
let text = document.getElementById("text");
let historyText = document.getElementById("history");
let game = document.getElementById("game");
let level = document.getElementById("level");

// Cache le spinner, les flèches directionnelles
spinner.style.display = "none";
keys.style.display = "none";
arrowDiv.style.display = "none";
historyText.style.display = "none";

// Initialise les variables pour pouvoir les utiliser dans les fonctions
let RobotStartDirection = "";
let rotation = "";
let startRobotDirection = "";

// Vérifie si une touche est appuyée
document.addEventListener("keydown", (e) => {
    // Si les touches q, z ou d sont appuyées, on ajoute la flèche correspondante à la liste des prédictions
    if (e.key == "q" || e.key == "z" || e.key == "d") {
        addArrowInPrediction(e.key);
        let arrow = document.getElementById(e.key);
        arrow.classList.add("active");
    }
    // Si la touche Entrée est appuyée, on lance les mouvements du robot
    if (e.key == "Enter") {
        startRobotMouvements();
    }
    // Si la touche a est appuyée, on enlève la dernière prédiction
    if (e.key == "a") {
        undoPrediction();
    }
    // Si la touche e est appuyée, on vide les prédictions
    if (e.key == "e") {
        clearPrediction();
    }
});

// Vérifie si une touche est relâchée
document.addEventListener("keyup", (e) => {
    // Si les touches q, z ou d sont relâchées, on enlève la classe active de la flèche correspondante
    if (e.key == "q" || e.key == "z" || e.key == "d") {
        let arrow = document.getElementById(e.key);
        arrow.classList.remove("active");
    }
});

arrows = [arrowLeft, arrowRight, arrowUp];
for (let arrow of arrows) {
    arrow.addEventListener("mousedown", () => {
        addArrowInPrediction(arrow.id);
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


function addArrowInPrediction(arrowId) {
    // Ajoute l'ID de la flèche à la liste des prédictions
    if (arrowId == "q") {
        listPrediction.innerHTML += `<img src="Arrow_Left.png" alt="${arrowId}" class="arrowLeft textPrediction" />`;
    }
    if (arrowId == "z") {
        listPrediction.innerHTML += `<img src="Arrow_Icon.png" alt="${arrowId}" class="arrowUp textPrediction" />`;
    }
    if (arrowId == "d") {
        listPrediction.innerHTML += `<img src="Arrow_Right.png" alt="${arrowId}" class="arrowRight textPrediction" />`;
    }

}

function generateGrid(size) {
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
    // Donne une direction aléatoire au robot
    rotation = giveRandomDirection();
    startRobotDirection = getRobotStartDirection(rotation);
    robot.ariaLevel = startRobotDirection;
    robot.ariaRowIndex = start.ariaRowIndex;
    robot.ariaColIndex = start.ariaColIndex;
    robot.textContent = "🤖";
    start.appendChild(robot);
}

function openPrediction() {
    document.getElementById("listPrediction").style.width = "400px";
    document.getElementById("listPrediction").style.padding = "30px";
    setTimeout(() => {
        historyText.style.display = "block";
    }, 500);

}

function closePrediction() {
    document.getElementById("listPrediction").style.width = "0";
    historyText.style.display = "none";
}

function hideArrowDirection() {
    arrowDiv.style.display = "none";
}

function showArrowDirection() {
    arrowDiv.style.display = "flex";
}

function hideKeys() {
    keys.style.display = "none";
}

function showKeys() {
    keys.style.display = "flex";
}

function giveRandomDirection() {
    let rotation = Math.floor(Math.random() * 4) * 90;
    arrowDirection.style.transform = `rotate(${rotation}deg)`;
    console.log(rotation);
    return rotation;
}

function getRobotStartDirection(rotation) {
    let directions = ["right", "down", "left", "up"];
    return directions[rotation / 90];
}

function getRobotDirection() {
    let robot = document.querySelector(".robot");
    let rotation = robot.ariaLevel;
    return rotation;
}

function verifyMazeCanBeFinished() {
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
        if (row <= 0) {
            noUp = true;
        } else if (wallsCoordonates.some(arr => arr[0] === row - 1 && arr[1] === col)) {
            noUp = true;
        } else if (visited.some(arr => arr[0] === row - 1 && arr[1] === col)) {
            noUp = true;
        } else if (paths.some(arr => arr[0] === row - 1 && arr[1] === col)) {
            noUp = true;
        }
        // Si la case du bas est le bord ou un mur ou a déjà été visitée, le robot ne peut pas aller en bas
        if (row >= (+selectorSize - 1)) {
            noDown = true;
        } else if (wallsCoordonates.some(arr => arr[0] === (row + 1) && arr[1] === col)) {
            noDown = true;
        } else if (visited.some(arr => arr[0] === (row + 1) && arr[1] === col)) {
            noDown = true;
        } else if (paths.some(arr => arr[0] === (row + 1) && arr[1] === col)) {
            noDown = true;
        }
        // Si la case de gauche est le bord ou un mur ou a déjà été visitée, le robot ne peut pas aller à gauche
        if (col <= 0) {
            noLeft = true;
        } else if (wallsCoordonates.some(arr => arr[0] === row && arr[1] === col - 1)) {
            noLeft = true;
        } else if (visited.some(arr => arr[0] === row && arr[1] === col - 1)) {
            noLeft = true;
        } else if (paths.some(arr => arr[0] === row && arr[1] === col - 1)) {
            noLeft = true;
        }
        // Si la case de droite est le bord ou un mur ou a déjà été visitée, le robot ne peut pas aller à droite
        if (col >= (+selectorSize - 1)) {
            noRight = true;
        } else if (wallsCoordonates.some(arr => arr[0] === row && arr[1] === (col + 1))) {
            noRight = true;
        } else if (visited.some(arr => arr[0] === row && arr[1] === (col + 1))) {
            noRight = true;
        } else if (paths.some(arr => arr[0] === row && arr[1] === (col + 1))) {
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

function startRobotMovements() {
    text.textContent = "";
    let listPrediction = document.getElementById("listPrediction");
    let predictions = Array.from(listPrediction.children).map(prediction => prediction.alt);

    if (predictions.length === 0) {
        text.textContent = "Essayez de donner des instructions au robot avant de le lancer";
        return;
    }

    let robot = document.querySelector(".robot");
    let robotRow = +robot.ariaRowIndex;
    let robotCol = +robot.ariaColIndex;
    let walls = Array.from(document.querySelectorAll(".wall"));
    let end = document.querySelector(".end");
    let endRow = +end.ariaRowIndex;
    let endCol = +end.ariaColIndex;
    let wallsCoordonates = walls.map(wall => [+wall.ariaRowIndex, +wall.ariaColIndex]);
    let robotDirection = getRobotDirection();

    function moveRobot(index) {
        if (index >= predictions.length) {
            return;
        }

        let prediction = predictions[index];
        if (prediction === "q") {
            robotDirection = turnLeft(robotDirection);
        } else if (prediction === "z") {
            if (robotDirection === "up" && robotRow > 0 && !wallsCoordonates.some(arr => arr[0] === (robotRow - 1) && arr[1] === robotCol)) {
                robotRow--;
            } else if (robotDirection === "down" && robotRow < (+selectorSize - 1) && !wallsCoordonates.some(arr => arr[0] === (robotRow + 1) && arr[1] === robotCol)) {
                robotRow++;
            } else if (robotDirection === "left" && robotCol > 0 && !wallsCoordonates.some(arr => arr[0] === robotRow && arr[1] === (robotCol - 1))) {
                robotCol--;
            } else if (robotDirection === "right" && robotCol < (+selectorSize - 1) && !wallsCoordonates.some(arr => arr[0] === robotRow && arr[1] === (robotCol + 1))) {
                robotCol++;
            } else {
                text.textContent = "Le robot ne peut pas aller dans cette direction";
                resetRobot();
                resetVisited();
                return;
            }
        } else if (prediction === "d") {
            robotDirection = turnRight(robotDirection);
        }

        let cell = document.querySelector(`[aria-rowindex="${robot.ariaRowIndex}"][aria-colindex="${robot.ariaColIndex}"]`);
        cell.removeChild(robot);

        robot.ariaRowIndex = robotRow;
        robot.ariaColIndex = robotCol;
        let newCell = document.querySelector(`[aria-rowindex="${robotRow}"][aria-colindex="${robotCol}"]`);
        newCell.appendChild(robot);
        robot.ariaLevel = robotDirection;

        if (!newCell.classList.contains("start") && !newCell.classList.contains("end") && !newCell.classList.contains("visited")) {
            if (newCell.classList.contains("path")) {
                newCell.classList.remove("path");
            }
            newCell.classList.add("visited");
        }

        if (robotRow === endRow && robotCol === endCol) {
            text.textContent = "Bravo, vous avez gagné !";
            startGame(+selectorSize + 1);
            return;
        }

        setTimeout(() => moveRobot(index + 1), 500); // Délai de 1 seconde entre chaque mouvement
    }
    moveRobot(0);
}


function resetRobot() {
    // Enlève le robot de la case actuelle
    let robot = document.querySelector(".robot");
    let robotRow = robot.ariaRowIndex;
    let robotCol = robot.ariaColIndex;
    let cell = document.querySelector(`[aria-rowindex="${robotRow}"][aria-colindex="${robotCol}"]`);
    cell.removeChild(robot);
    // Remet le robot sur la case de départ
    let start = document.querySelector(".start");
    robot.ariaRowIndex = start.ariaRowIndex;
    robot.ariaColIndex = start.ariaColIndex;
    robot.ariaLevel = startRobotDirection;
    resetArrowRotation(startRobotDirection);
    start.appendChild(robot);
}

function resetArrowRotation(startRobotDirection) {
    if (startRobotDirection == "right") {
        rotation = 0;
    } else if (startRobotDirection == "down") {
        rotation = 90;
    } else if (startRobotDirection == "left") {
        rotation = 180;
    } else if (startRobotDirection == "up") {
        rotation = 270;
    }
    arrowDirection.style.transform = `rotate(${rotation}deg)`;
}

function resetVisited() {
    // Remet les cases visitées en cases normales
    let visited = document.getElementsByClassName("visited");
    visited = Array.from(visited);
    visited.forEach(cell => {
        cell.classList.remove("visited");
    });
}

function turnLeft(direction) {
    if (direction == "right") {
        arrowDirection.style.transform = "rotate(270deg)";
        return "up";
    } else if (direction == "down") {
        arrowDirection.style.transform = "rotate(0deg)";
        return "right";
    } else if (direction == "left") {
        arrowDirection.style.transform = "rotate(90deg)";
        return "down";
    } else if (direction == "up") {
        arrowDirection.style.transform = "rotate(180deg)";
        return "left";
    }
}

function turnRight(direction) {
    if (direction == "right") {
        arrowDirection.style.transform = "rotate(90deg)";
        return "down";
    } else if (direction == "down") {
        arrowDirection.style.transform = "rotate(180deg)";
        return "left";
    } else if (direction == "left") {
        arrowDirection.style.transform = "rotate(270deg)";
        return "up";
    } else if (direction == "up") {
        arrowDirection.style.transform = "rotate(0deg)";
        return "right";
    }
}

game.addEventListener("click", () => {
    startGame();
});


function startGame(taille = 3) {
    game.style.display = "none";
    // Si le niveau est inférieur à 37, le jeu continue
    if (taille-2 < 39) {
        // Affiche le niveau actuel
        level.textContent = `Niveau ${taille-2}`;
        // la taille du labyrinthe
        selectorSize = taille;
        // Vide le texte
        text.textContent = "";
        // Vide la grille pour éviter les bugs
        grid.innerHTML = "";
        // Affiche le spinner
        spinner.style.display = "flex";
        // Vide et ferme la liste des prédictions
        clearPrediction();
        closePrediction();
        // Cache la flèche de direction du robot
        hideArrowDirection();
        // Cache les touches directionnelles
        hideKeys();
    
        setTimeout(() => {
            generateGrid(selectorSize);
            while (!verifyMazeCanBeFinished()) {
                grid.innerHTML = "";
                generateGrid(selectorSize);
            }
            // Cache le spinner
            spinner.style.display = "none";
            // Affiche les touches directionnelles
            showKeys();
            // Affiche la flèche de direction du robot
            showArrowDirection();
            // Affiche les prédictions
            openPrediction();
        }, 2000);
    } else {
        // Si le niveau est supérieur à 37, le jeu est gagné
        text.textContent = "Bravo, vous avez gagné le jeu !";
        game.style.display = "block";
        // Cache tout le reste
        spinner.style.display = "none";
        hideArrowDirection();
        hideKeys();
        closePrediction();
        grid.innerHTML = "";
    }
}