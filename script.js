let grid = document.querySelector("#grid");

let size = 64;

grid.style.setProperty("--n", size);

for (let i = 0; i < size * size; i++) {
  const div = document.createElement("div");
  div.classList.add("cell");
  grid.appendChild(div);
}
