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

  Hourglass = require("./hourglass.js");
  Sha256 = require("./sha256.js");
  Module = require("./chipmunk.js");
  Module.onRuntimeInitialized = chipmunk_onRuntimeInitialized;

  option_str = process.argv.length > 2 && options_keys.includes(process.argv[2]) ? process.argv[2] : "small";
}
else {
  getTimestamp = performance.now;

  prestart = getTimestamp();

  load("./hourglass.js");
  load("./sha256.js");
  load("./chipmunk.js");
  Module.onRuntimeInitialized = chipmunk_onRuntimeInitialized;

  option_str = arguments.length > 0 && options_keys.includes(arguments[0]) ? arguments[0] : "small";
}

function chipmunk_onRuntimeInitialized() {
  let preend = getTimestamp();
  console.log("chipmunk.js loaded");
  console.log("Prepare time:", getMs(prestart, preend));

  let option = options[option_str];
  Hourglass.build_world(option, Module);
  perf_ticks(option);
};

function perf_ticks(option) {
  const start = getTimestamp()
  for (let i = 0; i < samples; ++i) {
    Hourglass.handle_tick(Module);
  }
  const end = getTimestamp();
  console.log(`Execution time: ${getMs(start, end)}`);

  let loc_hash = Sha256.hash(Hourglass.get_result_string(option, Module));
  if (loc_hash !== option.expected_loc_hash) {
    throw "Wrong result!";
  }
}
