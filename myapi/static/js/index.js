class EyeController {
  constructor(elements = {}, eyeSize = '33.33vmin') {
    this._eyeSize = eyeSize;
    this._blinkTimeoutID = null;

    this.setElements(elements);
  }

  get leftEye() { return this._leftEye; }
  get rightEye() { return this._rightEye; }

  setElements({
    leftEye,
    rightEye,
    upperLeftEyelid,
    upperRightEyelid,
    lowerLeftEyelid,
    lowerRightEyelid,
    leftEyebrow,
    rightEyebrow
  } = {}) {
    this._leftEye = leftEye;
    this._rightEye = rightEye;
    this._upperLeftEyelid = upperLeftEyelid;
    this._upperRightEyelid = upperRightEyelid;
    this._lowerLeftEyelid = lowerLeftEyelid;
    this._lowerRightEyelid = lowerRightEyelid;
    this._leftEyebrow = leftEyebrow;
    this._rightEyebrow = rightEyebrow;
    return this;
  }

  _createKeyframes({
    tgtTranYVal = 0,
    tgtRotVal = 0,
    enteredOffset = 1 / 3,
    exitingOffset = 2 / 3,
  } = {}) {
    return [
      { transform: `translateY(0px) rotate(0deg)`, offset: 0.0 },
      { transform: `translateY(${tgtTranYVal}) rotate(${tgtRotVal})`, offset: enteredOffset },
      { transform: `translateY(${tgtTranYVal}) rotate(${tgtRotVal})`, offset: exitingOffset },
      { transform: `translateY(0px) rotate(0deg)`, offset: 1.0 },
    ];
  }

  express({
    type = '',
    // level = 3,  // 1: min, 5: max
    duration = 1000,
    enterDuration = 75,
    exitDuration = 75,
  }) {
    if (!this._leftEye) {  // assumes all elements are always set together
      console.warn('Eye elements are not set; return;');
      return;
    }

    const options = {
      duration: duration,
    };

    switch (type) {
      case 'happy':
        // log('happy');
        console.log('happy');
        return {
          lowerLeftEyelid: this._lowerLeftEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * -2 / 3)`,
            tgtRotVal: `30deg`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
          lowerRightEyelid: this._lowerRightEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * -2 / 3)`,
            tgtRotVal: `-30deg`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
        };

      case 'sad':
        return {
          upperLeftEyelid: this._upperLeftEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
            tgtRotVal: `-20deg`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
          upperRightEyelid: this._upperRightEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
            tgtRotVal: `20deg`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
        };

      case 'angry':
        return {
          upperLeftEyelid: this._upperLeftEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * 1 / 4)`,
            tgtRotVal: `30deg`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
          upperRightEyelid: this._upperRightEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * 1 / 4)`,
            tgtRotVal: `-30deg`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
        };

      case 'focused':
        return {
          upperLeftEyelid: this._upperLeftEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
          upperRightEyelid: this._upperRightEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
          lowerLeftEyelid: this._lowerLeftEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * -1 / 3)`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
          lowerRightEyelid: this._lowerRightEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * -1 / 3)`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
        }

      case 'confused':
        return {
          upperRightEyelid: this._upperRightEyelid.animate(this._createKeyframes({
            tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
            tgtRotVal: `-10deg`,
            enteredOffset: enterDuration / duration,
            exitingOffset: 1 - (exitDuration / duration),
          }), options),
        }

      default:
        console.warn(`Invalid input type=${type}`);
    }
  }

  blink({
    duration = 150,  // in ms
  } = {}) {
    if (!this._leftEye) {  // assumes all elements are always set together
      console.warn('Eye elements are not set; return;');
      return;
    }

    [this._leftEye, this._rightEye].map((eye) => {
      eye.animate([
        { transform: 'rotateX(0deg)' },
        { transform: 'rotateX(90deg)' },
        { transform: 'rotateX(0deg)' },
      ], {
        duration,
        iterations: 1,
      });
    });
  }

  startBlinking({
    maxInterval = 5000
  } = {}) {
    if (this._blinkTimeoutID) {
      console.warn(`Already blinking with timeoutID=${this._blinkTimeoutID}; return;`);
      return;
    }
    const blinkRandomly = (timeout) => {
      this._blinkTimeoutID = setTimeout(() => {
        this.blink();
        blinkRandomly(Math.random() * maxInterval);
      }, timeout);
    }
    blinkRandomly(Math.random() * maxInterval);
  }

  stopBlinking() {
    clearTimeout(this._blinkTimeoutID);
    this._blinkTimeoutID = null;
  }

  setEyePosition(eyeElem, x, y, isRight = false) {
    if (!eyeElem) {  // assumes all elements are always set together
      console.warn('Invalid inputs ', eyeElem, x, y, '; retuning');
      return;
    }

    if (!!x) {
      if (!isRight) {
        eyeElem.style.left = `calc(${this._eyeSize} / 3 * 2 * ${x})`;
      } else {
        eyeElem.style.right = `calc(${this._eyeSize} / 3 * 2 * ${1 - x})`;
      }
    }
    if (!!y) {
      eyeElem.style.bottom = `calc(${this._eyeSize} / 3 * 2 * ${1 - y})`;
    }
  }

  // make the setEyeClose function to eye close.
  setEyeClose(eyeElem, isClose) {
    if (!eyeElem) {  // assumes all elements are always set together
      console.warn('Invalid inputs ', eyeElem, isClose, '; retuning');
      return;
    }

    if (isClose) {
      eyeElem.style.transform = 'rotateX(89deg)';
    } else {
      eyeElem.style.transform = 'rotateX(1deg)';
    }
  }

  setEyebrowAngle(eyebrowElem, angle) {
    if (!eyebrowElem) {  // assumes all elements are always set together
      console.warn('Invalid inputs ', eyebrowElem, angle, '; retuning');
      return;
    }

    eyebrowElem.style.transform = `rotate(${angle}deg)`;
  }
}

const eyes = new EyeController({
  leftEye: document.querySelector('.left.eye'),
  rightEye: document.querySelector('.right.eye'),
  upperLeftEyelid: document.querySelector('.left .eyelid.upper'),
  upperRightEyelid: document.querySelector('.right .eyelid.upper'),
  lowerLeftEyelid: document.querySelector('.left .eyelid.lower'),
  lowerRightEyelid: document.querySelector('.right .eyelid.lower'),
  leftEyebrow: document.querySelector('.eyebrow.left'),
  rightEyebrow: document.querySelector('.eyebrow.right'),
});


async function compareTime(set_time) {
  // Fetch the JSON data from the /get_dest and return json
  var dest_json = await fetch('/get_dest').then(response => response.json());
  // Get the time string from the JSON data 'time' field
  var timeString = dest_json.time;

  // Split the time string into date and time components
  var time = new Date(timeString.replace('_', 'T'));

  // Create a new Date object with the extracted components

  const TempTime = new Date();
  const timeZone = "Asia/Seoul";
  const options = {
    timeZone: timeZone,
    hour12: false, // Use 24-hour format
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  currentTime = new Date(TempTime.toLocaleString("en-US", options).replace(',', ''));

  result = Math.abs(currentTime - time) < set_time;

  return result;
};

window.onload = function () {
  // start with eye closed
  const set_time = 5000;
  eyes.setEyeClose(eyes._leftEye, true);
  eyes.setEyeClose(eyes._rightEye, true);

  eyes.setEyebrowAngle(eyes._leftEyebrow, 0);
  eyes.setEyebrowAngle(eyes._rightEyebrow, 0);

  // play sound in if loop
  

  // Create a new interval object.
  const interval = setInterval(() => {

    // Call the compareTime() function and store the promiss result.
    const resultPromise = compareTime(set_time);
    resultPromise.then(result => {
      if (result === true) {
        eyes.setEyeClose(eyes._leftEye, false);
        eyes.setEyeClose(eyes._rightEye, false);
        eyes.setEyebrowAngle(eyes._leftEyebrow, 20);
        eyes.setEyebrowAngle(eyes._rightEyebrow, -20);
        eyes.startBlinking();
        var audio = new Audio('/static/sound/siren.mp3');
        audio.play();
        clearInterval(interval);
        console.log("interval cleared");
      }
    });
  }, 1000);
};