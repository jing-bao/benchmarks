# Chipmunk Hourglass

## Overview
The benchmark simulates an hourglass with grains of sand inside it and update the positions of the grains of sand by calling into the [Chipmunk2D](http://chipmunk-physics.net/) physics engine compiled from C into WebAssembly.

The goal of this benchmark is to test performance of a physics engine which is important because it impacts the user experience of Web Games a lot.

The benchmark is based on https://codelabs.developers.google.com/codelabs/hour-chipmunk/index.html#0 but modified to be headless.

This benchmark updates the positions of the grains of sand for 500 times and measures the **Prepare time** and **Execution time**. After the last update, the sha256 checksum of a string including all positions is calculated and compared with the reference value. By setting the number of grains as 9\*20, 18\*20 and 18\*41, the benchmark runs in small, medium and large mode respectively.

## Possible benchmark evolution
This benchmark is expected to be refined by:

* Providing another scheme for more accurate startup time measurement.

## Benchmark category
I think this benchmark should be categorized as “application”.

## How to run
This workload could run in three modes with different number of grains of sand: small (9\*20), medium (18\*20) and large (18\*41). And it supports Node.js, V8 shell and browsers.

Node.js:
```
node perf.js [mode]
```
V8 shell:
```
d8 perf.js [-- mode]
```
Browsers with the workload deployed at localhost:8000:
```
chrome http://localhost:8000/test.html[?mode]
```
If *mode* is not specified, the workload runs in small mode by default.

## How to build Chipmunk2D
The build process is **optional** as prebuilt `chipmunk.js` and `chipmunk.wasm` are  already included in this project.

After installing Emscripten SDK, and activating PATH and other environment variables in current terminal, running `build.sh` script regenerates them and copies them to the right place:
```
./build.sh
```

## License

### License for perf.js and test.html
```
Copyright 2019 Intel Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

### License for hourglass.js and build-chipmunk/bridge.c
`hourglass.js` is modified from `hourglass.svg` of https://codelabs.developers.google.com/codelabs/hour-chipmunk/index.html#0
```
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
```

### License for Chipmunk2D
```
Copyright (c) 2007-2015 Scott Lembcke and Howling Moon Software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

### License for sha256.js
```
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* SHA-256 (FIPS 180-4) implementation in JavaScript                  (c) Chris Veness 2002-2019  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/sha256.html                                                     */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
```

## Expected output
The benchmark prints the startup time ("Prepare time") and total execution time ("Execution time") The benchmark checks the sha256 checksums of the results of the last iteration.

An example of the output shows:
```
chipmunk.js loaded
Prepare time: 8.353000000000002
Execution time: 418.03299999999996
```

## Profile report
We profiled the medium workload on d8 (only TurboFan) with Linux Perf tool:

```
perf record -k mono d8 --perf-prof --no-wasm-tier-up --no-liftoff perf.js -- medium
perf inject -j -i perf.data -o perf.data.jitted
perf report -i perf.data.jitted
```

And here is a snapshot of the profile report:

```
  18.29%  d8               jitted-31252-1838.so  [.] Function:wasm-function[196]-196
   6.38%  d8               jitted-31252-1750.so  [.] Function:wasm-function[132]-132
   6.18%  d8               jitted-31252-1555.so  [.] Function:wasm-function[123]-123
   6.00%  d8               jitted-31252-1787.so  [.] Function:wasm-function[14]-14
   5.94%  d8               jitted-31252-1560.so  [.] Function:wasm-function[122]-122
   4.99%  d8               jitted-31252-1790.so  [.] Function:wasm-function[13]-13
   4.07%  d8               jitted-31252-1801.so  [.] Function:wasm-function[10]-10
   3.30%  d8               jitted-31252-1733.so  [.] Function:wasm-function[30]-30
   2.60%  d8               jitted-31252-1550.so  [.] Function:wasm-function[124]-124
   2.03%  d8               jitted-31252-1799.so  [.] Function:wasm-function[11]-11
   1.97%  d8               jitted-31252-1810.so  [.] Function:wasm-function[195]-195
   1.83%  d8               jitted-31252-1731.so  [.] Function:wasm-function[31]-31
   1.75%  d8               jitted-31252-1780.so  [.] Function:wasm-function[43]-43
   1.69%  d8               perf-31252.map        [.] 0x000036ebbd506014
   1.68%  d8               jitted-31252-1807.so  [.] Function:wasm-function[19]-19
   1.48%  d8               jitted-31252-1589.so  [.] Function:wasm-function[117]-117
   1.20%  d8               jitted-31252-1796.so  [.] Function:wasm-function[12]-12
   0.97%  d8               jitted-31252-1593.so  [.] Function:wasm-function[238]-238
   0.97%  d8               jitted-31252-1742.so  [.] Function:wasm-function[28]-28
   0.94%  d8               jitted-31252-1772.so  [.] Function:wasm-function[243]-243
   0.83%  d8               jitted-31252-1812.so  [.] Function:wasm-function[58]-58
   0.82%  d8               jitted-31252-1730.so  [.] Function:wasm-function[32]-32
   0.80%  d8               jitted-31252-1671.so  [.] Function:wasm-function[253]-253
   0.75%  d8               jitted-31252-1563.so  [.] Function:wasm-function[299]-299
   0.74%  d8               perf-31252.map        [.] 0x000036ebbd50600f
   0.70%  d8               jitted-31252-1792.so  [.] Function:wasm-function[22]-22
   0.60%  d8               jitted-31252-1749.so  [.] Function:wasm-function[129]-129
   0.59%  d8               jitted-31252-1758.so  [.] Function:wasm-function[245]-245
   0.54%  d8               jitted-31252-1834.so  [.] Function:wasm-function[89]-89
   0.51%  d8               jitted-31252-1753.so  [.] Function:wasm-function[246]-246
   0.48%  d8               jitted-31252-1794.so  [.] Function:wasm-function[57]-57
   0.45%  d8               jitted-31252-1624.so  [.] Function:wasm-function[300]-300
   0.38%  d8               jitted-31252-1570.so  [.] Function:wasm-function[311]-311
   0.36%  d8               jitted-31252-1567.so  [.] Function:wasm-function[297]-297
   0.34%  d8               jitted-31252-1660.so  [.] Function:wasm-function[286]-286
   0.34%  d8               perf-31252.map        [.] 0x000036ebbd506000
   0.33%  d8               perf-31252.map        [.] 0x000036ebbd50606d
   0.33%  d8               jitted-31252-1628.so  [.] Function:wasm-function[109]-109
```
