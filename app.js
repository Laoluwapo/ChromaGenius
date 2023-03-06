// Global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButtons = document.querySelectorAll(".adjust");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
const lockButtons = document.querySelectorAll(".lock");
let initialColors;
// For local storage
let savedPalettes = [];

// Functions

// Function that generates a color using the chroma-js library
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

// Function that loops over all the color divs and adds the random hex to their backgrounds
function randomColors() {
  initialColors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    const icons = colorDivs[index].querySelectorAll(".controls button");
    // Add color to the array
    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomColor).hex());
    }
    // Add the color to the background
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    // Check for text contrast
    checkTextContrast(randomColor, hexText);
    // Check icon contrast too
    for (icon of icons) {
      checkTextContrast(randomColor, icon);
    }
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
  // Set the sliders value to match the hsl value of the color generated
  hue.value = color.hsl()[0];
  saturation.value = color.hsl()[1];
  brightness.value = color.hsl()[2];
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
  const bgColor = initialColors[index];
  // Set the hue, sat and brightness to the value from the slider
  let color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value);
  // Update the background color of the adjusted colorDiv background
  colorDivs[index].style.backgroundColor = color;
  // Update the sliders
  colorizeSliders(color, hue, brightness, saturation);
}

// Function that updates the text whenever hsl is adjusted
function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  textHex.innerText = color.hex();
  // Check text contrast
  checkTextContrast(color, textHex);
  // Check buttons contrast
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

// Function that copies to clipboard
function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  // Pop-up animation
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
  setTimeout(() => {
    popup.classList.remove("active");
    popupBox.classList.remove("active");
  }, 600);
}

// Function that opens the color adjustment panel
function openAdjustmentPanel(index) {
  sliderContainers[index].classList.toggle("active");
}

// Function that closes the color adjustment panel
function closeAdjustmentPanel(index) {
  sliderContainers[index].classList.remove("active");
}

// Function that handles the lock feature
function lockFeature(e, index) {
  colorDivs[index].classList.toggle("locked");
  if (colorDivs[index].classList.contains("locked")) {
    e.target.innerHTML = `<i class = "fas fa-lock"></i>`;
  } else {
    e.target.innerHTML = `<i class = "fas fa-lock-open"></i>`;
  }
}

// Event listeners
generateBtn.addEventListener("click", randomColors);
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});
currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});
adjustButtons.forEach((adjustButton, index) => {
  adjustButton.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});
closeAdjustments.forEach((closePanelButton, index) => {
  closePanelButton.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});
lockButtons.forEach((lockButton, index) => {
  lockButton.addEventListener("click", (e) => {
    lockFeature(e, index);
  });
});

// Implement save to palette and LOCAL STORAGE STUFF
// selectors
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

// Functions

// Function to open the save palette
function openPalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
}

// Function to close the save palette
function closePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  popup.classList.add("remove");
}

// Function to save color palettes on the localstorage
function savePalette(e) {
  saveContainer.classList.remove("active");
  const popup = saveContainer.children[0];
  popup.classList.remove("active");
  const name = saveInput.value;
  const colors = [];
  currentHexes.forEach((hex) => {
    colors.push(hex.innerText);
  });
  // Generate Object
  let paletteNr = savedPalettes.length;
  const paletteObj = { name: name, colors: colors, nr: paletteNr };
  savedPalettes.push(paletteObj);
  // Save to local storage
  saveToLocal(paletteObj);
  saveInput.value = "";
  // Generate the palette for the library
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");
  const title = document.createElement("h4");
  title.innerText = paletteObj.name;
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletteObj.colors.forEach((smallColor) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;
    preview.appendChild(smallDiv);
  });
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.nr);
  paletteBtn.innerText = "Select";

  // Append to library
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette);
}

// Function to open the library
function openLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
}

// Function to close library
function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}

// Function to check the local storage for saved data
function saveToLocal(paletteObj) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

// Event listeners
saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);

randomColors();
