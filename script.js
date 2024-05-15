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
    // Permet de transmettre la taille de la grille (size) à la grille en CSS (variable --n)
    grid.style.setProperty("--n", size);
    for (let i = 0; i < size * size; i++) {
        const div = document.createElement("div");
        div.classList.add("cell");
        // Donne une ligne et une colonne à la div
        div.ariaRowIndex = Math.floor(i / size);
        div.ariaColIndex = i % size;
        grid.appendChild(div);
    }
}
