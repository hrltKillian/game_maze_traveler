let grid = document.querySelector("#grid");
let selectorSize = document.getElementById("selectorSize");
let generateButton = document.getElementById("generate");

generateButton.addEventListener("click", () => {
    if (selectorSize.value < 1 || selectorSize.value > 40) {
        alert("Please enter a number between 1 and 40.");
        return;
    }
    generateGrid(selectorSize.value);
});

function generateGrid(size) {
    grid.innerHTML = "";
    grid.style.setProperty("--n", size);
    for (let i = 0; i < size * size; i++) {
        const div = document.createElement("div");
        div.classList.add("cell");
        grid.appendChild(div);
    }
}
