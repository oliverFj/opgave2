// Define the DataManager class before using it
class DataManager {
  constructor() {
    this.dataType = ""; // Variable to store the type of data received
    this.rectWidth = 0;
    this.rectHeight = 0;
    this.gyroscopeData = { alpha: 0, beta: 0, gamma: 0 };
  }

  updateDataType(newType) {
    this.dataType = newType;
  }

  getDataType() {
    return this.dataType;
  }

  updateRectangleSize(width, height) {
    this.rectWidth = width;
    this.rectHeight = height;
  }

  getRectangleSize() {
    return { width: this.rectWidth, height: this.rectHeight };
  }

  updateGyroscopeData(alpha, beta, gamma) {
    this.gyroscopeData = { alpha, beta, gamma };
  }

  getGyroscopeData() {
    return this.gyroscopeData;
  }
}

// Setup your topic here
let topic = "Opgave2Oliver";
let dataManager = new DataManager(); // Instance of the DataManager class

function onMessage(message) {
  console.log("received new message!");

  if (message["from"] != config.myID) {
    if (message["type"] === "motion") {
      let rectWidth = message["x"] / 10;
      let rectHeight = message["y"] / 10;

      // Constrain width and height to reasonable values
      rectWidth = constrain(rectWidth, 10, windowWidth - 10);
      rectHeight = constrain(rectHeight, 10, windowHeight - 10);

      dataManager.updateRectangleSize(rectWidth, rectHeight);
      console.log(`Motion data received: x=${message["x"]}, y=${message["y"]}, z=${message["z"]}`);
      dataManager.updateDataType("Motion Data");
    } else if (message["type"] === "gyroscope") {
      console.log(`Gyroscope data received: alpha=${message["alpha"]}, beta=${message["beta"]}, gamma=${message["gamma"]}`);
      dataManager.updateGyroscopeData(message["alpha"], message["beta"], message["gamma"]);
      dataManager.updateDataType("Gyroscope Data");
    }
  }
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('canvas-container');
  background(128);

  setupMQTT(topic);
}

function draw() {
  // Clear the canvas
  background(128);

  // Display the current data type
  let currentDataType = dataManager.getDataType();
  if (currentDataType) {
    displayDataType(currentDataType);
  }

  if (currentDataType === "Motion Data") {
    // Draw the rectangle
    let rectSize = dataManager.getRectangleSize();
    if (rectSize.width > 0 && rectSize.height > 0) {
      drawRectangle(rectSize.width, rectSize.height);
    }
  } else if (currentDataType === "Gyroscope Data") {
    // Draw the gyroscope visualization
    let gyroscopeData = dataManager.getGyroscopeData();
    drawGyroscopeVisualization(gyroscopeData.alpha, gyroscopeData.beta, gyroscopeData.gamma);
  }
}

function drawRectangle(width, height) {
  fill(255, 0, 0); // Fill color for the rectangle
  rectMode(CENTER);
  rect(600 / 2, 600 / 2, width, height);
}

function displayDataType(type) {
  fill(255); // Set text color to white
  textSize(32);
  textAlign(CENTER, CENTER);
  text(type, width / 2, 50); // Display the text at the top of the canvas
}

function drawGyroscopeVisualization(alpha, beta, gamma) {
  push(); // Save the current drawing style settings
  let centerX = width / 2;
  let centerY = height / 2;
  let maxRadius = 100;
  
  let alphaMapped = map(alpha, 0, 360, 0, TWO_PI);
  let betaRadius = map(beta, -180, 180, 0, maxRadius);
  let gammaRadius = map(gamma, -90, 90, 0, maxRadius);

  stroke(0, 255, 0);
  noFill();
  ellipse(centerX, centerY, betaRadius * 2, betaRadius * 2);

  stroke(0, 0, 255);
  line(centerX, centerY, centerX + cos(alphaMapped) * gammaRadius, centerY + sin(alphaMapped) * gammaRadius);
  pop(); // Restore the previous drawing style settings
}
