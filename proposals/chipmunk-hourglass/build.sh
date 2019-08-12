#! /bin/bash

git submodule init
git submodule update

cd build-chipmunk
make

cp chipmunk.js ..
cp chipmunk.wasm ..
