# OpenCV kernels

## Overview
The benchmark simulates a hourglass with grains of sand inside it and update the positions of the grains of sand by calling into the [Chipmunk2D](http://chipmunk-physics.net/) physics engine compiled from C into WebAssembly.

The benchmark is based on https://codelabs.developers.google.com/codelabs/hour-chipmunk/index.html#0 but modified to be headless.

This benchmark updates the positions of the grains of sand for 500 times and measures the **Prepare time** and **Execution time**. After the last update, the sha256 checksum of a string including all positions is calculated and compared with the reference value. By setting the number of grains as 9\*20, 18\*20 and 18\*41, the benchmark runs in small, medium and large mode respectively.

## Possible benchmark evolution
This benchmark is expected to be refined by:

* Providing another scheme for more accurate startup time measurement;

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

### License for build-chipmunk/bridge.c
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
waiting for zhiguo
```
And here lists the performance data of d8 (7.8.37) with only TurboFan, data on Node.js and browsers should be close to it.
```
waiting for zhiguo
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
waiting for zhiguo
```
