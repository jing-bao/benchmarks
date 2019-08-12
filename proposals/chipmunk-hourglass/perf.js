// Copyright 2019 Intel Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function getNodeMs(hrstart, hrend) {
  return (hrend[0]-hrstart[0])*1000 + (hrend[1]-hrstart[1])/1000000;
}

function getMs(timestart, timeend) {
  return timeend - timestart;
}

const samples = 500;

const options = {
  small: {
    cols: 20,
    rows: 9,
    expected_loc_hash: "7dd246d84777cbc70b90419abd76a4579e5263b46fc31a276c418c6048cc1e41"
  },
  medium: {
    cols: 20,
    rows: 18,
    expected_loc_hash: "20c9df4cc438a753d83ef741d74dd71d58d912b70e7123891bc8c3edb97d3d4f"
  },
  large: {
    cols: 41,
    rows: 18,
    expected_loc_hash: "6dc3b888d4a56ea4b7203b4690bc56c461561938501104fbb0c3901d91a85ad1"
  }
};

const options_keys = Object.keys(options);
let prestart;

if (typeof window !== "undefined") {
  getTimestamp = function(){ return performance.now(); };

  let output_node = document.getElementById("output");
  output_node.value = "";

  console.log = function() {
    let text = "";
    for (let i = 0; i < arguments.length; ++i) {
      text += arguments[i];
    }
    text += "\n"
    output_node.value += text;
    output_node.scrollTop = output_node.scrollHeight;
  }

  prestart = getTimestamp();

  let chipmunk_script = document.createElement("script");
  chipmunk_script.id = "chipmunk_js";
  chipmunk_script.setAttribute("async", "false");
  chipmunk_script.setAttribute("type", "text/javascript");
  chipmunk_script.src = "./chipmunk.js";
  chipmunk_script.onload = function() {
    Module.onRuntimeInitialized = chipmunk_onRuntimeInitialized;
  }
  output_node.parentElement.insertBefore(chipmunk_script, output_node);

  let arguments = window.location.search.substring(1).split("&");
  option_str = arguments.length > 0 && options_keys.includes(arguments[0]) ? arguments[0] : "small";
}
else if (typeof process !== "undefined") {
  getMs = getNodeMs;
  getTimestamp = process.hrtime;

  prestart = getTimestamp();

  Module = require("./chipmunk.js");
  Sha256 = require("./sha256.js");
  Module.onRuntimeInitialized = chipmunk_onRuntimeInitialized;

  option_str = process.argv.length > 2 && options_keys.includes(process.argv[2]) ? process.argv[2] : "small";
}
else {
  getTimestamp = performance.now;

  prestart = getTimestamp();

  load("./chipmunk.js");
  load("./sha256.js");
  Module.onRuntimeInitialized = chipmunk_onRuntimeInitialized;

  option_str = arguments.length > 0 && options_keys.includes(arguments[0]) ? arguments[0] : "small";
}

var cm_instance;
function chipmunk_onRuntimeInitialized() {
  let preend = getTimestamp();
  console.log("chipmunk.js loaded");
  console.log("Prepare time:", getMs(prestart, preend));

  let option = options[option_str];
  cm_instance = Module._CM_Instance_new();
  build_world(option);
  perf_ticks(option);
};

const interior = [
  105,89,
  276,89,
  284,100,
  288,127,
  285,151,
  273,176,
  249,204,
  198,247,
  198,258,
  250,308,
  271,334,
  284,358,
  287,379,
  285,403,
  96,403,
  98,375,
  107,345,
  128,315,
  186,257,
  186,247,
  127,193,
  114,180,
  105,165,
  98,141,
  97,111,
  105,89
];

function build_world(option) {
  // Create the walls of the interior of the hourglass shape
  for (var i = 0; i < interior.length - 2; i += 2) {
    Module._CM_Add_wall(cm_instance, 0, interior[i], interior[i + 1], interior[i + 2], interior[i + 3]);
  }
  generate_sand(option);
  // Invert gravity and run for a few ticks to clump the sand at the top of the hourglass before starting
  //Module._CM_Set_gravity(cm_instance, 2, -50);
  //for (var i = 0; i < 200; i++) {
    //Module._CM_Step(cm_instance);
  //}
  //Module._CM_Set_gravity(cm_instance, 0, 50);
}

const startx = 109;
const starty = 92;
var ballArr = [];
function generate_sand(option) {
  var ball;
  x = startx;
  y = starty;
  for (j = 0; j < option.rows; j++) {
    for (i = 0; i < option.cols; i++) {
      ball = Module._CM_Add_circle(cm_instance, (i * option.cols) + j, x, y, 1.8);
      ballArr.push(ball);
      x += 4;
    }
    x = startx;
    y += 4;
  }
}

function handle_tick() {
  // Run a tick of the simulation, and update grains of sand positions
  //var exe_start = performance.now();
  Module._CM_Step(cm_instance);
  //var exe_end = performance.now();
  //Module['exeTime'] += exe_end - exe_start;
}

function perf_ticks(option) {
  const start = getTimestamp()
  for (let i = 0; i < samples; ++i) {
    handle_tick();
  }
  const end = getTimestamp();
  console.log(`Execution time: ${getMs(start, end)}`);

  var result_str = "";;
  for (var i = 0; i < option.rows * option.cols; i++) {
    var ball = ballArr.shift();
    var location = Module._CM_Get_location(cm_instance, ball);
    var pos = new Float32Array(Module.HEAPU8.buffer, location, 3);
    result_str = result_str + pos[0].toFixed(3) + " " + pos[1].toFixed(3) + " ";
  }
  let loc_hash = Sha256.hash(result_str);
  if (loc_hash !== option.expected_loc_hash) {
    throw "Wrong result!";
  }

}
