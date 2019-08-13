# Chipmunk Hourglass

## Overview
The benchmark simulates an hourglass with grains of sand inside it and update the positions of the grains of sand by calling into the [Chipmunk2D](http://chipmunk-physics.net/) physics engine compiled from C into WebAssembly.

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
  17.52%  d8               jitted-23351-1712.so  [.] Function:wasm-function[196]-196
   7.12%  d8               jitted-23351-1554.so  [.] Function:wasm-function[123]-123
   6.74%  d8               jitted-23351-1769.so  [.] Function:wasm-function[132]-132
   5.55%  d8               jitted-23351-1559.so  [.] Function:wasm-function[122]-122
   5.55%  d8               jitted-23351-1806.so  [.] Function:wasm-function[14]-14
   4.73%  d8               jitted-23351-1814.so  [.] Function:wasm-function[13]-13
   3.35%  d8               jitted-23351-1811.so  [.] Function:wasm-function[10]-10
   2.88%  d8               jitted-23351-1727.so  [.] Function:wasm-function[30]-30
   2.87%  d8               jitted-23351-1547.so  [.] Function:wasm-function[124]-124
   2.37%  d8               jitted-23351-1809.so  [.] Function:wasm-function[11]-11
   2.33%  d8               jitted-23351-1674.so  [.] Function:wasm-function[195]-195
   1.70%  d8               perf-23351.map        [.] 0x0000143f57ff5014
   1.66%  d8               jitted-23351-1724.so  [.] Function:wasm-function[31]-31
   1.64%  d8               jitted-23351-1810.so  [.] Function:wasm-function[12]-12
   1.63%  d8               jitted-23351-1815.so  [.] Function:wasm-function[19]-19
   1.52%  d8               jitted-23351-1587.so  [.] Function:wasm-function[117]-117
   1.18%  d8               jitted-23351-1688.so  [.] Function:wasm-function[43]-43
   1.17%  d8               jitted-23351-1739.so  [.] Function:wasm-function[28]-28
   0.90%  d8               jitted-23351-1596.so  [.] Function:wasm-function[240]-240
   0.87%  d8               jitted-23351-1802.so  [.] Function:wasm-function[22]-22
   0.84%  d8               jitted-23351-1818.so  [.] Function:wasm-function[58]-58
   0.81%  d8               jitted-23351-1657.so  [.] Function:wasm-function[255]-255
   0.81%  d8               perf-23351.map        [.] 0x0000143f57ff5000
   0.80%  d8               jitted-23351-1840.so  [.] Function:wasm-function[57]-57
   0.69%  d8               jitted-23351-1781.so  [.] Function:wasm-function[245]-245
   0.69%  d8               jitted-23351-1720.so  [.] Function:wasm-function[32]-32
   0.67%  d8               jitted-23351-1565.so  [.] Function:wasm-function[301]-301
   0.67%  d8               jitted-23351-1759.so  [.] Function:wasm-function[247]-247
   0.56%  d8               jitted-23351-1567.so  [.] Function:wasm-function[299]-299
   0.56%  d8               jitted-23351-1620.so  [.] Function:wasm-function[302]-302
   0.53%  d8               jitted-23351-1615.so  [.] Function:wasm-function[109]-109
   0.50%  d8               jitted-23351-1753.so  [.] Function:wasm-function[248]-248
   0.43%  d8               jitted-23351-1732.so  [.] Function:wasm-function[70]-70
   0.41%  d8               jitted-23351-1789.so  [.] Function:wasm-function[129]-129
   0.39%  d8               perf-23351.map        [.] 0x0000143f57ff506d
   0.35%  d8               jitted-23351-1555.so  [.] Function:wasm-function[162]-162
   0.34%  d8               perf-23351.map        [.] 0x0000143f57ff500f
   0.32%  d8               perf-23351.map        [.] 0x0000143f57ff5068
```
