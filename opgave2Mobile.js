//opgave2Mobile.js
// setup your topic here
let topic = "Opgave2Oliver";

let sendGyroscopeData = false; // Flag to toggle gyroscope data sending
let sendMotionData = false; // Flag to toggle motion data sending

function setup() {
  setupMQTT(topic);
  setupMotion(10); // Initialize motion sensor with a threshold
  setupOrientation(10);
}

function draw() {
  // Check if new motion sensor data is available and motion data sending is enabled
  if (sendMotionData && motionSensor.hasNewValue) {
    let motionData = motionSensor.get();
    sendMotionDataFunc(motionData);
  }

  // Check if new gyroscope data is available and the flag is set
  if (sendGyroscopeData && orientationSensor.hasNewValue) {
    let orientationData = orientationSensor.get();
    sendGyroscopeDataFunc(orientationData);
  }
}

function touchStarted() {
  setupMotion(10);
  setupOrientation(10);
}

function sendMotionDataFunc(motionData) {
  let message = {
    "from": config.myID,
    "type": "motion",
    "x": motionData.x,
    "y": motionData.y,
    "z": motionData.z
  };
  sendMessage(message);
}

function sendGyroscopeDataFunc(orientationData) {
  let message = {
    "from": config.myID,
    "type": "gyroscope",
    "alpha": orientationData.alpha,
    "beta": orientationData.beta,
    "gamma": orientationData.gamma
  };
  sendMessage(message);
}

function toggleGyroscope() {
  sendGyroscopeData = !sendGyroscopeData;
  sendMotionData = false; // Ensure motion data is disabled when gyroscope is enabled
  console.log(`Gyroscope data sending is now ${sendGyroscopeData ? 'enabled' : 'disabled'}`);
  
  // Update button styles
  updateButtonStyles();
}

function toggleMotion() {
  sendMotionData = !sendMotionData;
  sendGyroscopeData = false; // Ensure gyroscope data is disabled when motion is enabled
  console.log(`Motion data sending is now ${sendMotionData ? 'enabled' : 'disabled'}`);
  
  // Update button styles
  updateButtonStyles();
}

function updateButtonStyles() {
  const motionButton = document.getElementById('toggleMotionBtn');
  const gyroscopeButton = document.getElementById('toggleGyroscopeBtn');
  
  if (sendMotionData) {
    motionButton.classList.add('pressed');
    motionButton.classList.remove('shadow');
  } else {
    motionButton.classList.remove('pressed');
    motionButton.classList.add('shadow');
  }
  
  if (sendGyroscopeData) {
    gyroscopeButton.classList.add('pressed-gyroscope');
    gyroscopeButton.classList.remove('shadow');
  } else {
    gyroscopeButton.classList.remove('pressed-gyroscope');
    gyroscopeButton.classList.add('shadow');
  }
}