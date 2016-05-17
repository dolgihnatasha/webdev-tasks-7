'use strict';

let bodyParts;

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
    bodyParts.eyeCover.obj.transform(`T 0, 0`);
}

function openEyes() {
    bodyParts.eyeCover.obj.transform(`t 0, ${bodyParts.leftEyeOpened.cords.h}`);
}

function blink() {
    openEyes();
    bodyParts.eyeCover.obj.animate({
        transform: `t 0, ${bodyParts.leftEyeOpened.cords.h + 5}`
    }, 1000, () => {
        bodyParts.eyeCover.obj.animate({
            transform: `T 0, 0`
        }, 1000, blink)
    })
}

function init() {
    bodyParts = {
        rightHand: {obj: Snap('#rightHand'), cords: Snap('#rightHand').getBBox()},
        leftHand: {obj: Snap('#leftHand'), cords: Snap('#leftHand').getBBox()},
        leftEyeOpened: {obj: Snap('#leftEyeOpened'), cords: Snap('#leftEyeOpened').getBBox()},
        rightEyeOpened: {obj: Snap('#rightEyeOpened'), cords: Snap('#rightEyeOpened').getBBox()},
        leftEyeClosed: {obj: Snap('#leftEyeClosed'), cords: Snap('#leftEyeClosed').getBBox()},
        rightEyeClosed: {obj: Snap('#rightEyeClosed'), cords: Snap('#rightEyeClosed').getBBox()},
        rightEyeCover: {obj: Snap('#rightCover'), cords: Snap('#rightCover').getBBox()},
        leftEyeCover: {obj: Snap('#leftCover'), cords: Snap('#leftCover').getBBox()},
        eyeCover: {obj: Snap('#eyeCover'), cords: Snap('#eyeCover').getBBox()}

    };
    // bodyParts.eyeCover.obj.attr({stroke: 'silver', 'strokeWidth': 40, fill: 'silver'})
    bodyParts.leftEyeOpened.obj.attr({
        mask: bodyParts.leftEyeCover.obj
    });
    bodyParts.rightEyeOpened.obj.attr({
        mask: bodyParts.rightEyeCover.obj
    });
    moveRightHand();
    moveLeftHand();
    // closeEyes();
    openEyes();
    // blink();
    return bodyParts
}

module.exports = {
    init,
    closeEyes,
    blink
};


