'use strict';
// Get divs from DOM
const monsterBodyDiv = document.querySelector('#monster-body');
const monsterEyelidsDiv = document.querySelector('#monster-eyelids');
const monsterMouthDiv = document.querySelector('#monster-mouth');
// Get user input
const username = document.querySelector('#username');
const password = document.querySelector('#password');

const state = {
    frameCountBody: 1, // incl. eyes
    frameCountEyelids: 1,
    frameCountMouth: 1,
    finish: true
};

// Init animations
const monsterBody = lottie.loadAnimation({
    container: monsterBodyDiv,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: './animations/monster-body.v04.json'
});

const monsterEyelids = lottie.loadAnimation({
    container: monsterEyelidsDiv,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: './animations/monster-eyelids.v03.json'
});

const monsterMouth = lottie.loadAnimation({
    container: monsterMouthDiv,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: './animations/happy-mouth.v02.json'
});

// Wait for animations to be loaded
monsterBody.addEventListener('DOMLoaded', function() {
    // Create eye object to manipulate in realtime, pass in reference to path of eye pupil in DOM.
    const leftEye = new Eye(
        document.getElementById('left-pupil').children[0].children[0]
    );
    const rightEye = new Eye(
        document.getElementById('right-pupil').children[0].children[0]
    );

    document.addEventListener('mousemove', function(e) {
        // Get cursor movement to calculate eye movement.
        let x = Math.floor(e.clientX);
        let y = Math.floor(e.clientY);

        // Update eye positions
        leftEye.findPosition(x, y);
        rightEye.findPosition(x, y);
    });
    username.addEventListener('focus', function() {
        monsterBody.playSegments([0, 24], true);
        //Update State
        state.frameCountBody = 24;
    });

    username.addEventListener('keyup', function(e) {
        // Play next frame.
        monsterBody.playSegments(
            [state.frameCountBody, (state.frameCountBody += 3)],
            true
        );
        monsterEyelids.playSegments(
            [state.frameCountEyelids, (state.frameCountEyelids += 3)],
            true
        );

        // Check if user inputs '@'
        if (e.key === 'AltGraph') {
            //Play happy mouth
            monsterMouth.playSegments([1, 2], true);
        }
    });
    // Input field de-selected.
    username.addEventListener('blur', function() {
        // Check if animation has reach halfway point, IF true, continue out animation ELSE rewind animation,
        if (state.frameCountBody / 144 >= 0.5) {
            monsterBody.playSegments([state.frameCountBody, 144], true);
        } else {
            monsterBody.playSegments([state.frameCountBody, 1], true);
        }

        monsterBody.setSpeed(2); // Speed up animation for better UX.
        state.frameCountBody = 1; // reset.
        state.finish = false;
    });

    password.addEventListener('focus', function() {
        if (!state.finish) {
            monsterBody.addEventListener('complete', function() {
                monsterBody.playSegments([[144, 172], [172, 210]], true);
                monsterBody.loop = true;
                monsterBody.setSpeed(0.25);
                state.finish = true;
                monsterBody.removeEventListener('complete');
            });
        } else {
            monsterBody.playSegments([[144, 172], [172, 210]], true);
            monsterBody.loop = true;
            monsterBody.setSpeed(0.25);
        }
    });

    password.addEventListener('blur', function() {
        monsterBody.loop = false;
        // Check if animation has reach halfway point, IF true, continue out animation ELSE rewind animation,
        // .currenFrame gets the frame number at the current segment played
        // Example: fram if segment is ([120, 130]) and we currently are on frame 124, .currentFrame will return 4
        if (state.frameCountBody / 20 >= 0.5) {
            monsterBody.playSegments(
                [monsterBody.currentFrame + 144, 232],
                true
            );
            // Reset eyelids
            if (state.frameCountEyelids / 60 >= 0.5)
                monsterEyelids.playSegments([state.frameCountEyelids, 110]);
            else {
                monsterEyelids.playSegments([state.frameCountEyelids, 10]);
            }
            state.frameCountEyelids = 1; //reset
        } else if (state.frameCountBody / 20 <= 0.5) {
            monsterBody.playSegments(
                [monsterBody.currentFrame + 144, 144],
                true
            );
            // Reset eyelids
            if (state.frameCountEyelids / 30 >= 0.5)
                monsterEyelids.playSegments([state.frameCountEyelids, 110]);
            else {
                monsterEyelids.playSegments([state.frameCountEyelids, 10]);
            }
            state.frameCountEyelids = 1; //reset eyelids
        }
    });
}); // End - data_ready

// prevent submit form.
document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();
});
