let grid = document.querySelector("#grid");
let selectorSize = document.getElementById("selectorSize");
let generateButton = document.getElementById("generate");


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
}

