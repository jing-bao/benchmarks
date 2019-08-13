/*
 * Copyright 2018 Google LLC. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
var cm_instance;
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

function build_world(option, Module) {
  cm_instance = Module._CM_Instance_new();
  // Create the walls of the interior of the hourglass shape
  for (var i = 0; i < interior.length - 2; i += 2) {
    Module._CM_Add_wall(cm_instance, 0, interior[i], interior[i + 1], interior[i + 2], interior[i + 3]);
  }
  generate_sand(option, Module);
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
function generate_sand(option, Module) {
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

function handle_tick(Module) {
  // Run a tick of the simulation
  Module._CM_Step(cm_instance);
}

function get_result_string(option, Module) {
  var result_str = "";;
  for (var i = 0; i < option.rows * option.cols; i++) {
    var ball = ballArr.shift();
    var location = Module._CM_Get_location(cm_instance, ball);
    var pos = new Float32Array(Module.HEAPU8.buffer, location, 3);
    result_str = result_str + pos[0].toFixed(3) + " " + pos[1].toFixed(3) + " ";
  }
  return result_str;
}

var Hourglass = {};
Hourglass.build_world = build_world;
Hourglass.handle_tick = handle_tick;
Hourglass.get_result_string = get_result_string;

if (typeof process !== "undefined") {
  module.exports = Hourglass;
}
