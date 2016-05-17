/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var {Happiness, Energy, Food} = __webpack_require__(1);
	var SoundMaker = __webpack_require__(2).SoundMaker;
	var {checkLocalStorage, hasStoredData, notify} = __webpack_require__(3);
	var animations = __webpack_require__(4);

	class Peppa {
	    constructor(lifeSpeed, speed) {
	        this.initAnimations();
	        this.speed = speed;
	        this.lifeSpeed = lifeSpeed;
	        this.initPeppa();
	        this.loadData();
	        this.displayData();
	        
	    }
	    loadData() {
	        if (checkLocalStorage() && hasStoredData()) {
	            var res = JSON.parse(localStorage.getItem('peppa'));
	            this.energy.val = res.energy;
	            this.food.val = res.food;
	            this.happiness.val = res.happiness;
	        } else {
	            this.energy.val = 100;
	            this.food.val = 100;
	            this.happiness.val = 100;
	        }
	    }
	    saveData() {
	        if (checkLocalStorage()) {
	            localStorage.setItem('peppa', this.toString());
	            console.log('saved');
	        }
	    }
	    displayData() {
	        document.getElementsByClassName('food').item(0).value = this.food.val;
	        document.getElementsByClassName('energy').item(0).value = this.energy.val;
	        document.getElementsByClassName('happiness').item(0).value = this.happiness.val;
	    }
	    toString() {
	        var this_ = this;
	        var obj = {
	            food: this_.food.val,
	            energy: this_.energy.val,
	            happiness: this_.happiness.val
	        };
	        return JSON.stringify(obj);
	    }
	    initPeppa() {

	        let sounds = {
	            0: document.getElementById('sound0'),
	            1: document.getElementById('sound1'),
	            2: document.getElementById('sound2'),
	            death: document.getElementById('death')
	        };
	        let volume = new Slider('#volume', {
	            formatter: function(value) {
	                return 'Current value: ' + value;
	            }
	        });
	        this.soundMaker = new SoundMaker(sounds, volume);
	        
	        let peppa = document.getElementsByClassName('peppaThePig').item(0);
	        let speechLog = document.querySelector('div.speechLog');
	        this.happiness = new Happiness(100, peppa, speechLog, this.soundMaker);
	        this.energy = new Energy(100);
	        this.food = new Food(100);

	        this.lifeID = setInterval(() => {this.lifeController();}, 1000 * this.lifeSpeed);
	        setInterval(() => {this.saveData()}, 10000);

	        this.initNotifications();

	        let resetBtn = document.getElementsByClassName('reset').item(0);
	        resetBtn.addEventListener(
	            'click', (event) => {this.reset(event);}, false);

	        let feedBtn = document.getElementsByClassName('feed').item(0);
	        if (!this.food.canEat) {
	            feedBtn.addEventListener('click', () => {this.food.inc(15)});
	        } else {
	            feedBtn.parentNode.style.display = 'none';
	            feedBtn.style.display = 'none';
	        }
	    }
	    lifeController() {
	        if (this.energy.isSleeping()) {
	            this.energy.inc(this.speed);
	            this.food.dec(1);
	            this.happiness.dec(1);
	            this.happiness.stopListening();
	        } else if (this.food.isEating()) {
	            this.energy.dec(1);
	            this.food.inc(this.speed);
	            this.happiness.dec(1);
	            this.happiness.stopListening();
	        } else {
	            this.energy.dec(1);
	            this.food.dec(1);
	            this.happiness.dec(1);
	        }
	        if (!this.isAlive()) {
	            this.die();
	        }
	        this.displayData();
	    }
	    isAlive() {
	        return !(this.happiness.val == 0 && this.food.val == 0 ||
	        this.happiness.val == 0 && this.energy.val == 0 ||
	        this.food.val == 0 && this.energy.val == 0);
	    }
	    die() {
	        clearInterval(this.lifeID);
	        this.soundMaker.makeSound(true);
	        // this.soundMaker.stop();
	        this.soundMaker.mute();
	    }
	    reset() {
	        localStorage.removeItem('peppa');
	        this.happiness.stopListening();
	        this.soundMaker.unmute();
	        this.loadData();
	        clearInterval(this.lifeID);
	        this.lifeID = setInterval(() => {this.lifeController();}, this.lifeSpeed * 1000);
	    }
	    initNotifications() {
	        var Notification = window.Notification ||
	            window.webkitNotification || null;
	        if (Notification) {
	            Notification.requestPermission()
	                .then((result) => {
	                    if (result === 'denied' || result === 'default') {
	                        console.log('The permission request was dismissed.');
	                        return;
	                    }
	                    setInterval(() => {this.checkStats()}, 5 * 1000)
	                });
	        }
	    }
	    checkStats() {
	        var message = "";
	        if (this.food <= 40) {
	            message += ' I\'m hungry:(';
	        }
	        if (this.happiness <= 70) {
	            message += ' It\'s so boring to be alone:(';
	        }
	        if (message && this.isAlive()) {
	            notify('Hey!', 'Did you forget about me?' + message);
	            this.soundMaker.makeSound(false);
	        }
	    }
	    initAnimations() {
	        this.bodyParts = animations.init();
	        animations.blink();
	    }
	}


	new Peppa(1, 3);


/***/ },
/* 1 */
/***/ function(module, exports) {

	class SomeValue {
	    constructor(value) {
	        this._value = value;
	    }
	    set val(value) {
	        this._value = value > 100 ? 100 : value < 0 ? 0 : value;
	    }
	    get val() {
	        return this._value;
	    }
	    inc(val) {
	        this.val = this._value + val;
	        return val > 100 ? false : val >= 0;
	    }
	    dec(val) {
	        this.val = this._value - val;
	        return val === 100 ? false : val === 0;
	    }
	}

	class Energy extends SomeValue{
	    constructor(val){
	        super(val);
	        this.awake = true;
	        this.initLightDetection();
	    }
	    isDarkOutside(event) {
	        this.awake = event.value < 10;
	    }
	    initLightDetection(){
	        if ('ondevicelight' in window) {
	            window.addEventListener('devicelight', event => {
	                this.isDarkOutside(event)
	            });
	        }
	    }
	    isSleeping() {
	        this.awake = !document.hidden || (document.hidden && this.val === 100);
	        return !this.awake
	    }
	}

	class Happiness extends SomeValue {
	    constructor(val, obj, speechLog, soundMaker) {
	        super(val);
	        this.starter = obj;
	        this.speechLog = speechLog;
	        this.soundMaker = soundMaker;
	        this.initSpeech();

	    }
	    initSpeech() {
	        var SpeechRecognition = window.SpeechRecognition ||
	            window.webkitSpeechRecognition || null;
	        
	        if (SpeechRecognition) {
	            this.recognizer = new SpeechRecognition();
	            this.recognizer.lang = 'ru-RU';
	            this.recognizer.continuous = true;
	            this.recognizer.interimResults = true;
	            
	            this.starter.addEventListener('click',
	                (event) => {this.checkTalk(event)});
	            
	            this.recognizer.addEventListener('result', 
	                (event) => {this.talkResults(event)})
	            
	        } else {
	            this.speechLog.style.display = 'none';
	        }
	    }
	    checkTalk() {
	        if (this.val < 100 && !this.listening) {
	            this.recognizer.start();
	            this.listening = true;
	            this.soundMaker.mute()
	        }
	    }
	    talkResults(event) {
	        for (var i = event.resultIndex; i < event.results.length; i++) {
	            if (event.results[i].isFinal) {
	                var res = event.results[i][0].transcript;
	                this.speechLog.innerHTML += res + '<br>';
	                this.inc(res.length);
	                
	                if (this.val === 100) {
	                    this.stopListening();
	                }
	            }
	        }
	    }
	    stopListening() {
	        if (this.listening) {
	            this.listening = false;
	            this.recognizer.stop();
	            this.soundMaker.unmute();
	        }
	    }
	}

	class Food extends SomeValue {
	    constructor(val) {
	        super(val);
	        this.initBatteryCheck()
	    }
	    initBatteryCheck() {
	        if (navigator.getBattery) {
	            this._canEat = true;
	            navigator.getBattery().then(battery => {
	                this.battery = battery;
	                this.isEating();
	            });
	        } else {
	            this._canEat = false;
	        }
	    }
	    get canEat() {
	        return this._canEat;
	    }
	    isEating() {
	        if (this.battery) {
	            this.eating = this.battery.charging;
	            return this.eating;
	        } else {
	            this.initBatteryCheck();
	            return false
	        }
	    }
	}


	module.exports.Happiness = Happiness;
	module.exports.Energy = Energy;
	module.exports.Food = Food;

/***/ },
/* 2 */
/***/ function(module, exports) {

	class SoundMaker {
	    constructor(sounds, volume) {
	        this.sounds = sounds;
	        this.volume = volume;
	        this.initSounds();
	    }
	    initSounds() {
	        this.changeVolume();
	        this.volume.on('change',
	            (event) => {this.changeVolume(event)});
	        this.soundID = this.start();
	    }
	    changeVolume() {
	        for (var sound in this.sounds) {
	            if (this.sounds.hasOwnProperty(sound)) {
	                this.sounds[sound].volume = this.volume.getValue();
	            }
	        }
	    }
	    makeSound(death) {
	        if (!death) {
	            if (!this.listening && !this.muted) {
	                this.sounds[Math.floor(Math.random() * 3)].play();
	            }
	        } else {
	            this.sounds.death.play();
	        }
	    }
	    stop() {
	        clearInterval(this.soundID);
	    }
	    start() {
	        this.soundID = setInterval(() => {this.makeSound()},
	            (Math.floor(Math.random() * 10) + 5) * 1000);
	    }
	    mute() {
	        this.muted = true;
	    }
	    unmute() {
	        this.muted = false;
	    }
	}

	module.exports.SoundMaker = SoundMaker;

/***/ },
/* 3 */
/***/ function(module, exports) {

	function checkLocalStorage() {
	    try {
	        localStorage.setItem('key', 'value');
	        localStorage.removeItem('key');
	        return true;
	    } catch (error) {
	        return false;
	    }
	}

	function hasStoredData() {
	    return !!localStorage.getItem('peppa');
	}

	function notify(title, message) {
	    var notif = new Notification(title, {body: message});
	    notif.onclick = () => {window.focus();}
	}

	Object.assign(module.exports, {notify, hasStoredData, checkLocalStorage});


/***/ },
/* 4 */
/***/ function(module, exports) {

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




/***/ }
/******/ ]);