// Global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
let initialColors;

// Functions

// Function that generates a color
// function generateHex() {
//   const letters = "#0123456789ABCDEF";
//   let hash = "#";
//   for (let i = 0; i < 6; i++) {
//     hash += letters[Math.floor(Math.random() * 16)];
//   }
//   return hash;
// }

// Function that generates a color using the chroma-js library
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

// Function that loops over all the color divs and adds the random hex to their backgrounds
function randomColors() {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    // Add the color to the background
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    // Check for text contrast
    checkTextContrast(randomColor, hexText);
  });
}

// Function that checks the text contrast of the hex code
function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

randomColors();

// Event listeners
