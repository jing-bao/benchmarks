# OpenCV kernels

## Overview
The HTML5 standard brings users the great cability of including and handling multimedia locally, together with an emerging need of computer vision programming functions available on the web. However, real-time user experience cannot be achieved when implementing those computation-intensive functions in JavaScript, even on the highly-optimized JavaScript engine. With the announcement of WebAssembly technology, source code in multiple programming languages, such as C, C++, Rust, etc. can be compiled into a sort of low-level and platform-independent bytecode which can run on the browsers while maintaining near-to-native execution speed. Thus, the widely-used OpenCV library can be ported to web platform with little extra effort, the ported library is officially called OpenCV.js.
 
The OpenCV-based applications relies on the kernel functions for the performance-critical work. This benchmark evaluates three vision kernels for image transformation, including: threshold, integral and cvtColor. The threshold function applies fixed-level thresholding to a single-channel array; the integral function calculates the integral of an image; the cvtColor converts an image from one color space to another. The reasons for their admission are: 

1) they are representative kernels in OpenCV; 
2) they are heavily used in the image-processing applications;  
3) they are computation-intensive kernels which can reflect WebAssembly's performance and real user experience.
 
This benchmark runs each of the functions for 1000 times and measures the startup time and average execution time, the standard deviations are also calculated for stability analysis. In the tail of all 1000 runs, sha256 checksum of output image is calculated and compared with the reference value. By setting the size of images as 640\*480, 1280\*720 and 1920\*1080, the benchmark runs in small, medium and large mode respectively.

## Possible benchmark evolution
This benchmark is expected to be refined by:

* Providing another scheme for more accurate startup time measurement;
* Adding more representative kernel functions in OpenCV;
* Adding multi-thread and SIMD mode.

## Benchmark category
I think this benchmark should be categorized as “kernel”.

## License

### License for OpenCV
```
By downloading, copying, installing or using the software you agree to this license.
If you do not agree to this license, do not download, install,
copy or use the software.


                          License Agreement
               For Open Source Computer Vision Library
                       (3-clause BSD License)

Copyright (C) 2000-2019, Intel Corporation, all rights reserved.
Copyright (C) 2009-2011, Willow Garage Inc., all rights reserved.
Copyright (C) 2009-2016, NVIDIA Corporation, all rights reserved.
Copyright (C) 2010-2013, Advanced Micro Devices, Inc., all rights reserved.
Copyright (C) 2015-2016, OpenCV Foundation, all rights reserved.
Copyright (C) 2015-2016, Itseez Inc., all rights reserved.
Third party copyrights are property of their respective owners.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * Neither the names of the copyright holders nor the names of the contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

This software is provided by the copyright holders and contributors "as is" and
any express or implied warranties, including, but not limited to, the implied
warranties of merchantability and fitness for a particular purpose are disclaimed.
In no event shall copyright holders or contributors be liable for any direct,
indirect, incidental, special, exemplary, or consequential damages
(including, but not limited to, procurement of substitute goods or services;
loss of use, data, or profits; or business interruption) however caused
and on any theory of liability, whether in contract, strict liability,
or tort (including negligence or otherwise) arising in any way out of
the use of this software, even if advised of the possibility of such damage.
```

### License for sha256.js
```
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* SHA-256 (FIPS 180-4) implementation in JavaScript                  (c) Chris Veness 2002-2019  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/sha256.html                                                     */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
```

## How to build OpenCV.js
The source code of OpenCV located at: https://github.com/opencv/opencv.git

This repo includes OpenCV as a submodule, thus we need to firstly initialize and update the submodule:
```
git submodule init
git submodule update
```
After installing Emscripten SDK, and activating PATH and other environment variables in current terminal, running the following commands generate OpenCV.js:
```
cd opencv
python ./platforms/js/build_js.py build_wasm --build_wasm
```
It might be more convinient to build OpenCV.js with build.sh, which encapsulates the above operations:
```
./build.sh
```

## How to run
This workload could run in three modes with input images of different sizes: small (640\*480), medium (1280\*720) and large (1920\*1080). And it supports Node.js, V8 shell and browsers.

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
chrome http://localhost:8000/opencv-kernel.html[?mode]
```
If *mode* is not specified, the workload runs in small mode by default.

## Expected output
Moreover, this workload prints the startup time ("Prepare time"), total execution time and validation time each workload takes ("elapsed time") and average execution time ("average time") in milliseconds (ms), together with the standard deviation of execution time. The output matrices of the functions will not be displayed due to their huge sizes, instead, the benchmark checked the sha256 checksums of the results of last iterations. 

An example of the output shows:
```
opencv.js loaded
Prepare time: 1163.084406
=== cvtColor ===
elapsed time: 449.648181
average time: 0.44928623100000004
stddev: 0.021455702109174562 (4.78%)
=== threshold ===
elapsed time: 289.104296
average time: 0.2886608429999998
stddev: 0.015280695784497221 (5.29%)
=== integral ===
elapsed time: 838.173489
average time: 0.8370389330000002
stddev: 0.04490799442545297 (5.37%)
```
And here lists the performance data of d8 (7.8.37) with only TurboFan, data on Node.js and browsers should be close to it.
<table>
    <tr>
        <td>mode</td>
        <td>Prepare time</td>
        <td>Kernel</td>
        <td>elapsed time</td>
        <td>average time</td>
        <td>stddev</td>
    </tr>
    <tr>
        <td rowspan="3">small</td>
        <td rowspan="3">1501.386</td>
        <td>cvtColor</td>
        <td>498.602</td>
        <td>0.464</td>
        <td>0.015 (3.31%)</td>
    </tr>
    <tr>
        <td>threshold</td>
        <td>207.133</td>
        <td>0.172</td>
        <td>0.006 (3.89%)</td>
    </tr>
    <tr>
        <td>integral</td>
        <td>986.372</td>
        <td>0.605</td>
        <td>0.039 (6.49%)</td>
    </tr>
    <tr>
        <td rowspan="3">medium</td>
        <td rowspan="3">1504.993</td>
        <td>cvtColor</td>
        <td>1398.531</td>
        <td>1.341</td>
        <td>0.052 (3.87%)</td>
    </tr>
    <tr>
        <td>threshold</td>
        <td>560.060</td>
        <td>0.496</td>
        <td>0.022 (4.37%)</td>
    </tr>
    <tr>
        <td>integral</td>
        <td>2986.283</td>
        <td>1.813</td>
        <td>0.101 (5.56%)</td>
    </tr>
    <tr>
        <td rowspan="3">large</td>
        <td rowspan="3">1551.478</td>
        <td>cvtColor</td>
        <td>3131.883</td>
        <td>3.014</td>
        <td>0.137 (4.54%)</td>
    </tr>
    <tr>
        <td>threshold</td>
        <td>1264.85</td>
        <td>1.132</td>
        <td>0.038 (3.38%)</td>
    </tr>
    <tr>
        <td>integral</td>
        <td>5911.873</td>
        <td>4.066</td>
        <td>0.272 (6.69%)</td>
    </tr>
</table>

## Profile report
We profiled the medium workload on d8 (only TurboFan) with Linux Perf tool: 

```
perf recork -k mono d8 --perf-prof --no-wasm-tier-up --no-liftoff perf.js -- medium
perf inject -j -i perf.data -o perf.data.jitted
perf report -i perf.data.jitted
```

And here is a snapshot of the profile report:

```
  17.16%  d8               jitted-23177-3826.so   [.] Function:wasm-function[3853]-3853                                                                                                                                                                                                   
  12.85%  d8               jitted-23177-11949.so  [.] Function:wasm-function[2844]-2844                                                                                                                                                                                                   
   4.72%  d8               jitted-23177-1712.so   [.] Function:wasm-function[3874]-3874                                                                                                                                                                                                   
   3.23%  d8               jitted-23177-12192.so  [.] LazyCompile:*hash ./sha256.js:38                                                                                                                                                                                                    
   2.06%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler18LiveRangeConnector18ResolveControlFlowEPNS0_4ZoneE                                                                                                                                                        
   1.71%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler19LinearScanAllocator25FindFreeRegistersForRangeEPNS1_9LiveRangeENS0_6VectorINS1_16LifetimePositionEEE                                                                                                      
   1.65%  d8               d8                     [.] _ZN2v88internal9Scavenger25EvacuateShortcutCandidateINS0_18FullHeapObjectSlotEEENS0_18SlotCallbackResultENS0_3MapET_NS0_10ConsStringEi                                                                                              
   1.57%  d8               jitted-23177-12190.so  [.] LazyCompile:*hash ./sha256.js:38                                                                                                                                                                                                    
   1.10%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler12GraphReducer9ReduceTopEv                                                                                                                                                                                  
   1.05%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler9Scheduler11PrepareUsesEv                                                                                                                                                                                   
   0.88%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler12GraphTrimmer9TrimGraphEv                                                                                                                                                                                  
   0.87%  V8 DefaultWorke  d8                     [.] _ZN2v88internal9BitVector8Iterator7AdvanceEv                                                                                                                                                                                        
   0.86%  d8               d8                     [.] _ZN2v88internal6String11WriteToFlatIhEEvS1_PT_ii                                                                                                                                                                                    
   0.82%  d8               jitted-23177-772.so    [.] Builtin:TypedArrayPrototypeJoin                                                                                                                                                                                                     
   0.82%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler24ScheduleEarlyNodeVisitor9VisitNodeEPNS1_4NodeE                                                                                                                                                            
   0.75%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler16LiveRangeBuilder19ProcessInstructionsEPKNS1_16InstructionBlockEPNS0_9BitVectorE                                                                                                                           
   0.75%  V8 DefaultWorke  d8                     [.] _ZNSt3__16__treeIPN2v88internal8compiler9LiveRangeENS3_19LinearScanAllocator17LiveRangeOrderingENS2_13ZoneAllocatorIS5_EEE15__emplace_multiIJRKS5_EEENS_15__tree_iteratorIS5_PNS_11__tree_nodeIS5_PvEElEEDpOT_                      
   0.72%  d8               libc-2.27.so           [.] __memmove_avx_unaligned_erms                                                                                                                                                                                                        
   0.70%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler23ScheduleLateNodeVisitor9SplitNodeEPNS1_10BasicBlockEPNS1_4NodeE                                                                                                                                           
   0.69%  d8               d8                     [.] _ZN2v88internal18BodyDescriptorBase15IteratePointersINS0_40IterateAndScavengePromotedObjectsVisitorEEEvNS0_10HeapObjectEiiPT_                                                                                                       
   0.69%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler19LinearScanAllocator14ForwardStateToENS1_16LifetimePositionE                                                                                                                                               
   0.66%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler19LinearScanAllocator34PickRegisterThatIsAvailableLongestEPNS1_9LiveRangeEiRKNS0_6VectorINS1_16LifetimePositionEEE                                                                                          
   0.57%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler23ScheduleLateNodeVisitor9VisitNodeEPNS1_4NodeE                                                                                                                                                             
   0.56%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler13MoveOptimizer12MigrateMovesEPNS1_11InstructionES4_                                                                                                                                                        
   0.51%  V8 DefaultWorke  d8                     [.] _ZNSt3__127__tree_balance_after_insertIPNS_16__tree_node_baseIPvEEEEvT_S5_                                                                                                                                                          
   0.49%  d8               d8                     [.] _ZN2v88internal8WorklistINSt3__14pairINS0_10HeapObjectEiEELi256EE3PopEiPS5_                                                                                                                                                         
   0.49%  V8 DefaultWorke  d8                     [.] _ZN2v88internal4wasm15WasmFullDecoderILNS1_7Decoder12ValidateFlagE1ENS1_12_GLOBAL__N_126WasmGraphBuildingInterfaceEE18DecodeFunctionBodyEv                                                                                          
   0.48%  d8               d8                     [.] _ZN2v88internal9Scavenger14ScavengeObjectINS0_18FullHeapObjectSlotEEENS0_18SlotCallbackResultET_NS0_10HeapObjectE                                                                                                                   
   0.48%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler15OperandAssigner16AssignSpillSlotsEv                                                                                                                                                                       
   0.47%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler19InstructionSelector10VisitBlockEPNS1_10BasicBlockE                                                                                                                                                        
   0.46%  d8               jitted-23177-885.so    [.] Builtin:StringPrototypeCharCodeAt                                                                                                                                                                                                   
   0.46%  d8               jitted-23177-1541.so   [.] LazyCompile:*decodeBase64 ./opencv/build_wasm/bin/opencv.js:24                                                                                                                                                                      
   0.45%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler19LinearScanAllocator23TryAllocatePreferredRegEPNS1_9LiveRangeERKNS0_6VectorINS1_16LifetimePositionEEE                                                                                                      
   0.44%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler24ScheduleEarlyNodeVisitor30PropagateMinimumPositionToNodeEPNS1_10BasicBlockEPNS1_4NodeE                                                                                                                    
   0.43%  V8 DefaultWorke  d8                     [.] _ZNK2v88internal8compiler19InstructionSequence17GetSourcePositionEPKNS1_11InstructionEPNS0_14SourcePositionE                                                                                                                        
   0.43%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler15OperandAssigner16CommitAssignmentEv                                                                                                                                                                       
   0.43%  d8               jitted-23177-52.so     [.] Builtin:StringIndexOf                                                                                                                                                                                                               
   0.40%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler4Node3NewEPNS0_4ZoneEjPKNS1_8OperatorEiPKPS2_b                                                                                                                                                              
   0.39%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler18LiveRangeSeparator8SplinterEv                                                                                                                                                                             
   0.38%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler19LinearScanAllocator18AllocateBlockedRegEPNS1_9LiveRangeENS1_22RegisterAllocationData9SpillModeE                                                                                                           
   0.37%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler17TopLevelLiveRange14AddUseIntervalENS1_16LifetimePositionES3_PNS0_4ZoneEb                                                                                                                                  
   0.37%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler10BasicBlock18GetCommonDominatorEPS2_S3_                                                                                                                                                                    
   0.36%  V8 DefaultWorke  d8                     [.] _ZN2v86Object36GetRealNamedPropertyInPrototypeChainENS_5LocalINS_7ContextEEENS1_INS_4NameEEE                                                                                                                                        
   0.36%  d8               d8                     [.] _ZN2v88internal4Heap11OnMoveEventENS0_10HeapObjectES2_i                                                                                                                                                                             
   0.36%  V8 DefaultWorke  d8                     [.] _ZN2v88internal11TickCounter6DoTickEv                                                                                                                                                                                               
   0.34%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler9Scheduler28DecrementUnscheduledUseCountEPNS1_4NodeEiS4_                                                                                                                                                    
   0.33%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler9LiveRange8DetachAtENS1_16LifetimePositionEPS2_PNS0_4ZoneENS2_20HintConnectionOptionE                                                                                                                       
   0.32%  V8 DefaultWorke  libc-2.27.so           [.] __memmove_avx_unaligned_erms                                                                                                                                                                                                        
   0.31%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler22RegisterAllocationData23GetOrCreateLiveRangeForEi                                                                                                                                                         
   0.31%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler21ValueNumberingReducer6ReduceEPNS1_4NodeE                                                                                                                                                                  
   0.30%  d8               d8                     [.] _ZN2v88internal3Uri6EncodeEPNS0_7IsolateENS0_6HandleINS0_6StringEEEb                                                                                                                                                                
   0.30%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler19LinearScanAllocator17AllocateRegistersEv                                                                                                                                                                  
   0.30%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler23ScheduleLateNodeVisitor12ProcessQueueEPNS1_4NodeE                                                                                                                                                         
   0.30%  d8               d8                     [.] _ZN2v88internal9Scavenger7ProcessEPNS0_14OneshotBarrierE                                                                                                                                                                            
   0.29%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler18LiveRangeConnector13ConnectRangesEPNS0_4ZoneE                                                                                                                                                             
   0.28%  d8               libc-2.27.so           [.] __memchr_avx2                                                                                                                                                                                                                       
   0.28%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler19InstructionSelector18SelectInstructionsEv                                                                                                                                                                 
   0.27%  V8 DefaultWorke  d8                     [.] _ZN2v88internal24ConcurrentMarkingVisitor23ProcessStrongHeapObjectINS0_18FullHeapObjectSlotEEEvNS0_10HeapObjectET_S4_                                                                                                               
   0.27%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler13MoveOptimizer13FinalizeMovesEPNS1_11InstructionE                                                                                                                                                          
   0.26%  d8               [kernel.kallsyms]      [k] _raw_spin_lock                                                                                                                                                                                                                      
   0.25%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler9Scheduler15UpdatePlacementEPNS1_4NodeENS2_9PlacementE                                                                                                                                                      
   0.25%  V8 DefaultWorke  libc-2.27.so           [.] _int_malloc                                                                                                                                                                                                                         
   0.25%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler16WasmGraphBuilder20CreateOrMergeIntoPhiENS0_21MachineRepresentationEPNS1_4NodeES5_S5_                                                                                                                      
   0.25%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler16LiveRangeBuilder14ComputeLiveOutEPKNS1_16InstructionBlockEPNS1_22RegisterAllocationDataE                                                                                                                  
   0.25%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler19LinearScanAllocator18TryAllocateFreeRegEPNS1_9LiveRangeERKNS0_6VectorINS1_16LifetimePositionEEE                                                                                                           
   0.25%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler23ScheduleLateNodeVisitor14GetBlockForUseENS1_4EdgeE                                                                                                                                                        
   0.24%  d8               d8                     [.] _ZN2v88internal7Scanner10ScanStringEv                                                                                                                                                                                               
   0.24%  d8               [kernel.kallsyms]      [k] prepare_exit_to_usermode                                                                                                                                                                                                            
   0.24%  V8 DefaultWorke  d8                     [.] _ZN2v88internal8compiler23ScheduleLateNodeVisitor12ScheduleNodeEPNS1_10BasicBlockEPNS1_4NodeE                                                                                                                                       
```
It can be observed that the top 3 functions are WebAssembly functions, which account for around 34.72% of the total CPU time.