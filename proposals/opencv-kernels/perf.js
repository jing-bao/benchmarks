function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

function getNodeMs(hrstart, hrend) {
  return (hrend[0]-hrstart[0])*1000 + (hrend[1]-hrstart[1])/1000000;
}

function getMs(timestart, timeend) {
  return timeend - timestart;
}

function printResult(elapsed, perf) {
  console.log(`elapsed time: ${elapsed}`);
  console.log(`average time: ${average(perf)}`);
  console.log(`stddev: ${standardDeviation(perf)} (${(standardDeviation(perf)/average(perf)*100).toFixed(2)}%)`);
}

const samples = 1000;

const options = {
  small: {
    CvtColor: {
      height: 640,
      width: 480,
      expected_dest_hash: "4fdcba6ef8bea5ab32c80bed634ac3f49aaa83029f414c6681c725ef2a767d13"
    },
    Threshold: {
      height: 640,
      width: 480,
      expected_dest_hash: "ab4694ad4798a81765a94a74824a9f63d32e81d0495480d6e822de2fc2a69695"
    },
    Integral: {
      height: 640,
      width: 480,
      expected_sum_hash: "b9e6e35229e9cb86b449b1a40b1cf93ccf32a5cf81fbd5b6542c2e92b0acbeb3",
      expected_sqSum_hash: "88957e17569ce2628d514a3125ac8c4b229054b3cf0005c2a101451d41fe074a"
    }
  },
  medium: {
    CvtColor: {
      height: 1280,
      width: 720,
      expected_dest_hash: "834b7187e1de5721e6966ff553c6570781d7892ba920e297c09543492ddd2845"
    },
    Threshold: {
      height: 1280,
      width: 720,
      expected_dest_hash: "bb58c705fae087566ae9b37cd7c208a64a047dfa30f7aeafad9358f924ef0aa9"
    },
    Integral: {
      height: 1280,
      width: 720,
      expected_sum_hash: "7caea4305f6611a488aef2be84b567ddb71f85f5c462424327405b3454b13c30",
      expected_sqSum_hash: "9476de9674ee4f844baa75cb88b96d64e22ab3980c287608b10952cae4b9bdab"
    }
  },
  large: {
    CvtColor: {
      height: 1920,
      width: 1080,
      expected_dest_hash: "b242671e541b5d80289132aa1455ea886d6d54fa613de888fb71d6dd74ae87fc"
    },
    Threshold: {
      height: 1920,
      width: 1080,
      expected_dest_hash: "f77e2fbf81e8e27561bfa8dcdb5fd325b52c1e7d374a2a53a0290c820f0ee1da"
    },
    Integral: {
      height: 1920,
      width: 1080,
      expected_sum_hash: "cb5f25c64da1f6348225fcbe36357ee885aa4f49d497a2e7e100dd6b01aa3555",
      expected_sqSum_hash: "0fe35b14db31aa02a3675edec388ebc8e4aa93e005c34030a0f057ab5e93d252"
    }
  }
};

const options_keys = Object.keys(options);
var prestart;

if (typeof window !== "undefined") {
  getTimestamp = function(){ return performance.now() };

  var output_node = document.getElementById("output");
  output_node.value = "";

  console.log = function() {
    var text = "";
    for (let i = 0; i < arguments.length; ++i) {
      text += arguments[i];
    }
    text += "\n"
    output_node.value += text;
    output_node.scrollTop = output_node.scrollHeight;
  }

  prestart = getTimestamp();

  var opencv_script = document.createElement("script");
  opencv_script.id = "opencv_js";
  opencv_script.setAttribute("async", "false");
  opencv_script.setAttribute("type", "text/javascript");
  opencv_script.src = './opencv/build_wasm/bin/opencv.js';
  opencv_script.onload = function() {
    cv.onRuntimeInitialized = cv_onRuntimeInitialized; 
  }
  output_node.parentElement.insertBefore(opencv_script, output_node);

  var arguments = window.location.search.substring(1).split("&");
  option_str = arguments.length > 0 && options_keys.includes(arguments[0]) ? arguments[0] : "small";
}
else if (typeof process !== "undefined") {
  getMs = getNodeMs;
  getTimestamp = process.hrtime;

  prestart = getTimestamp();

  cv = require('./opencv/build_wasm/bin/opencv.js');
  Sha256 = require("./sha256.js");
  cv.onRuntimeInitialized = cv_onRuntimeInitialized; 

  option_str = process.argv.length > 2 && options_keys.includes(process.argv[2]) ? process.argv[2] : "small";
}
else {
  getTimestamp = performance.now;

  prestart = getTimestamp();

  load('./opencv/build_wasm/bin/opencv.js');
  load("./sha256.js");
  cv.onRuntimeInitialized = cv_onRuntimeInitialized; 

  option_str = arguments.length > 0 && options_keys.includes(arguments[0]) ? arguments[0] : "small";
}

function cv_onRuntimeInitialized() {
  var preend = getTimestamp();
  console.log('opencv.js loaded');
  console.log('Prepare time:', getMs(prestart, preend));

  var option = options[option_str];

  perfCvtColor(option["CvtColor"]);
  perfThreshold(option["Threshold"]);
  perfIntegral(option["Integral"]);
};

function perfCvtColor(option) {
  let source = new cv.Mat(option.height, option.width, cv.CV_8UC4);
  let dest = new cv.Mat();

  console.log(`=== cvtColor ===`);
  let perf = [];
  const start = getTimestamp()
  for (let i = 0; i < samples; ++i) {
    let hrstart = getTimestamp();
    cv.cvtColor(source, dest, cv.COLOR_BGR2GRAY, 0);
    let hrend = getTimestamp();
    perf.push(getMs(hrstart, hrend));
  }

  let dest_hash = Sha256.hash(dest.data.join('')); 
  if (dest_hash !== option.expected_dest_hash) {
    throw "Wrong result from cv.cvtColor()!";
  }

  const end = getTimestamp();
  printResult(getMs(start, end), perf);

  source.delete();
  dest.delete();
}

function perfThreshold(option) {
  const THRESHOLD = 127.0;
  const THRESHOLD_MAX = 210.0;
  let source = new cv.Mat(option.height, option.width, cv.CV_8UC1);
  let sourceView = source.data;
  sourceView[0] = 0; // < threshold
  sourceView[1] = 100; // < threshold
  sourceView[2] = 200; // > threshold

  let dest = new cv.Mat();

  console.log(`=== threshold ===`);
  let perf = [];
  const start = getTimestamp();
  for (let i = 0; i < samples; ++i) {
    let hrstart = getTimestamp();
    cv.threshold(source, dest, THRESHOLD, THRESHOLD_MAX, cv.THRESH_BINARY);
    let hrend = getTimestamp();
    perf.push(getMs(hrstart, hrend));
  }

  let dest_hash = Sha256.hash(dest.data.join('')); 
  if (dest_hash !== option.expected_dest_hash) {
    throw "Wrong result from cv.threshold()!";
  }

  const end = getTimestamp();
  printResult(getMs(start, end), perf);

  source.delete();
  dest.delete();
}

function perfIntegral(option) {
  let mat = cv.Mat.eye({height: option.height, width: option.width}, cv.CV_8UC1);
  let sum = new cv.Mat();
  let sqSum = new cv.Mat();

  console.log(`=== integral ===`);
  let perf = [];
  const start = getTimestamp();
  for (let i = 0; i < samples; ++i) {
    let hrstart = getTimestamp();
    cv.integral2(mat, sum, sqSum, -1, -1);
    let hrend = getTimestamp();
    perf.push(getMs(hrstart, hrend));
  }

  let sum_hash = Sha256.hash(sum.data.join('')); 
  let sqSum_hash = Sha256.hash(sqSum.data.join('')); 
  if (sum_hash !== option.expected_sum_hash || sqSum_hash !== option.expected_sqSum_hash) {
    throw "Wrong result from cv.integral2()!";
  }

  const end = getTimestamp();
  printResult(getMs(start, end), perf);

  mat.delete();
  sum.delete();
  sqSum.delete();
}
