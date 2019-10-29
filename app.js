// Get divs from DOM
const monsterBodyDiv = document.querySelector('#monster-body');
const monsterEyelidsDiv = document.querySelector("#monster-eyelids");
const monsterMouthDiv = document.querySelector("#monster-mouth");
// Get user input
const username = document.querySelector("#username");
const password = document.querySelector("#password");

// State
const state = {
    "frameCountBody": 0, // incl. eyes
    "frameCountEyelids": 0,
    "frameCountMouth": 0,
    "finish": false
};

// Init animations
const monsterBody = lottie.loadAnimation({
        container: monsterBodyDiv,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path:'./animations/monster_body.02.json'
});

const monsterEyelids = lottie.loadAnimation({
    container: monsterEyelidsDiv,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path:'./animations/monster-eyelids.json'
});

const monsterMouth = lottie.loadAnimation({
    container: monsterMouthDiv,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path:'./animations/monster-mouth.json'
});

// Wait for animations to be loaded
monsterBody.addEventListener("DOMLoaded", function () {
    username.addEventListener('focus', function () {
        monsterBody.playSegments([0, 10], true);
        //Update State
        state.frameCountBody = 10;
        state.frameCountEyelids = 75;
        state.frameCountMouth = 125;
    });

    username.addEventListener('keyup', function (e) {
        // Play next frame.
        monsterBody.playSegments([state.frameCountBody, (state.frameCountBody + 1)]);
        monsterEyelids.playSegments([state.frameCountEyelids, (state.frameCountEyelids + 1)]);

        // update state, if at end, reset back to start.
        state.frameCountEyelids !== 100 ? state.frameCountEyelids++ : state.frameCountEyelids = 75;
        state.frameCountBody !== 60 ? state.frameCountBody++ : state.frameCountBody = 0;

        // Check if user inputs '@'
        if(e.key === 'AltGraph'){
            //Play happy mouth
            monsterMouth.playSegments([125,129]);
        }
    });
    // Input field de-selected.
    username.addEventListener('blur', function () {

        // Play from current frame --> end, then reset animation
        if (state.frameCountBody / 60 >= 0.5) {
            monsterBody.playSegments([state.frameCountBody, 60]);
        }else {
            monsterBody.playSegments([state.frameCountBody, 0]);
        }
        monsterBody.setSpeed(2); // Speed up animation for better UX.
        state.frameCountBody = 0; // reset.
        state.finish = false;
    });

    password.addEventListener("focus", function () {
        monsterBody.addEventListener('complete', function () {

            if(!state.finish){
                monsterBody.playSegments([[130,135],[135,145]]);
                monsterBody.setSpeed(.25);
                state.finish = true;
            }
        })
    });

    password.addEventListener('blur', function () {
        monsterBody.playSegments([145,150]);
        monsterBody.setSpeed(.2);
    })
}); // End - data_ready

// prevent submit form.
document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
});

