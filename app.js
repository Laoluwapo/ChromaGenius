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
    // Initial colorization of the sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    // Call the function that colorizes the sliders
    colorizeSliders(color, hue, brightness, saturation);
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

// Function that colorizes the sliders
function colorizeSliders(color, hue, brightness, saturation) {
  // Scale saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]); // Use chroma to map numeric values to a color palette
  // Scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);
  // Update input colors
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75),rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
}

// Function that controls the hsl
function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];
  const bgColor = colorDivs[index].querySelector("h2").innerText;
  // Set the hue, sat and brightness to the value from the slider
  let color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value);
  // Update the background color of the adjusted colorDiv background
  colorDivs[index].style.backgroundColor = color;
}

randomColors();

// Event listeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
