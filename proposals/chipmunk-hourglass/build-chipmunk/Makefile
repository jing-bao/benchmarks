#
# Example Makefile to build a Chipmunk2D powered Hourglass demo for Wasm
#
CHIP_DIR=Chipmunk2D
CHIP_SRC=$(CHIP_DIR)/src
CHIP_INC=$(CHIP_DIR)/include

CHIP_SRCS=\
    $(CHIP_SRC)/chipmunk.c $(CHIP_SRC)/cpArbiter.c $(CHIP_SRC)/cpArray.c \
    $(CHIP_SRC)/cpBBTree.c $(CHIP_SRC)/cpBody.c $(CHIP_SRC)/cpCollision.c \
    $(CHIP_SRC)/cpConstraint.c $(CHIP_SRC)/cpDampedRotarySpring.c \
    $(CHIP_SRC)/cpDampedSpring.c $(CHIP_SRC)/cpGearJoint.c \
    $(CHIP_SRC)/cpGrooveJoint.c $(CHIP_SRC)/cpHashSet.c \
    $(CHIP_SRC)/cpHastySpace.c $(CHIP_SRC)/cpMarch.c $(CHIP_SRC)/cpPinJoint.c \
    $(CHIP_SRC)/cpPivotJoint.c $(CHIP_SRC)/cpPolyShape.c \
    $(CHIP_SRC)/cpPolyline.c $(CHIP_SRC)/cpRatchetJoint.c \
    $(CHIP_SRC)/cpRobust.c $(CHIP_SRC)/cpRotaryLimitJoint.c \
    $(CHIP_SRC)/cpShape.c $(CHIP_SRC)/cpSimpleMotor.c \
    $(CHIP_SRC)/cpSlideJoint.c $(CHIP_SRC)/cpSpace.c \
    $(CHIP_SRC)/cpSpaceComponent.c $(CHIP_SRC)/cpSpaceDebug.c \
    $(CHIP_SRC)/cpSpaceHash.c $(CHIP_SRC)/cpSpaceQuery.c \
    $(CHIP_SRC)/cpSpaceStep.c $(CHIP_SRC)/cpSpatialIndex.c \
    $(CHIP_SRC)/cpSweep1D.c

SRCS=$(CHIP_SRCS) bridge.c

TARGET=chipmunk.js
TARGETS=$(TARGET) chipmunk.wasm

all: chipmunk.js

chipmunk.js: $(SRCS)
		emcc -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 \
		-I$(CHIP_INC) -Os -DNDEBUG \
		-s EXPORTED_FUNCTIONS="['_CM_Instance_new', '_CM_Instance_destroy', '_CM_Add_circle', '_CM_Add_wall', '_CM_Step', '_CM_Get_location', '_CM_Set_gravity']" \
		-o $@ $(SRCS)

clean:
	- rm $(TARGETS)
