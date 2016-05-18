'use strict';

let bodyParts;
let blinkID;

function moveRightHand() {
    bodyParts.rightHand.obj.animate({
        transform: `r-45, ${bodyParts.rightHand.cords.x}, ${bodyParts.rightHand.cords.y}`
    }, 2000, () => {
        bodyParts.rightHand.obj.animate(
            {transform: `r0, ${bodyParts.rightHand.cords.x}, ${bodyParts.rightHand.cords.y}`}, 2000, moveRightHand)
    });
}

function moveLeftHand() {
    bodyParts.leftHand.obj.animate(
        {transform: `r45, ${bodyParts.leftHand.cords.x + bodyParts.leftHand.cords.w}, ${bodyParts.leftHand.cords.y}`},
        2000, () => {
        bodyParts.leftHand.obj.animate(
            {transform: `r0, ${bodyParts.leftHand.cords.x + bodyParts.leftHand.cords.w}, ${bodyParts.leftHand.cords.y}`},
            2000, moveLeftHand)
    })
}

function closeEyes() {
    bodyParts.leftEyeCover.obj.animate({
        transform: `s1,7 t0,2.1`
    }, 1000, () => {});
    bodyParts.rightEyeCover.obj.animate({
        transform: `s1,7 t0,2.1`
    }, 1000, () => {});
    // openEyes();
    // bodyParts.leftEyeCover.obj.transform(`t 0, 0`);
}

function openEyes() {
    bodyParts.leftEyeCover.obj.animate({
        transform: `S1,1 t0,0`
    }, 1000, () => {});
    bodyParts.rightEyeCover.obj.animate({
        transform: `S1,1 t0,0`
    }, 1000, () => {});
}

function blink() {
    closeEyes();
    setTimeout(openEyes, 1000)
}

function blinking() {
    
}

function sleep() {
    clearInterval(blinkID);
    closeEyes();
}

function awake() {
    openEyes();
    blinkID = setInterval(blink, 3000);
}

function init() {
    bodyParts = {
        svg: {obj: Snap('#peppaThePig'), cords: Snap('#peppaThePig').getBBox()},
        rightHand: {obj: Snap('#rightHand'), cords: Snap('#rightHand').getBBox()},
        leftHand: {obj: Snap('#leftHand'), cords: Snap('#leftHand').getBBox()},
        leftEyeOpened: {obj: Snap('#leftEyeOpened'), cords: Snap('#leftEyeOpened').getBBox()},
        rightEyeOpened: {obj: Snap('#rightEyeOpened'), cords: Snap('#rightEyeOpened').getBBox()},
        leftEyeClosed: {obj: Snap('#leftEyeClosed'), cords: Snap('#leftEyeClosed').getBBox()},
        leftEye: {obj: Snap('#leftEye'), cords: Snap('#leftEye').getBBox()},
        rightEyeClosed: {obj: Snap('#rightEyeClosed'), cords: Snap('#rightEyeClosed').getBBox()},
        rightEyeCover: {obj: Snap('#rightCover'), cords: Snap('#rightCover').getBBox()},
        leftEyeCover: {obj: Snap('#leftCover'), cords: Snap('#leftCover').getBBox()}
    };
    moveRightHand();
    moveLeftHand();
    // closeEyes();
    // setTimeout(openEyes, 2000);
    // closeEyes();
    blinkID = setInterval(blink, 3000);
    return bodyParts
}

module.exports = {
    init,
    closeEyes,
    blink,
    sleep,
    awake
};


