var Peppa = function (speed) {
    this.loadData();
    this.initPeppa(speed);
};

Peppa.prototype = {
    foodInc: function() {
        if (this.awake) {
            this.food = Math.min(100, this.food + 1 * this.speed);
            this.stopListening();
        } else {
            this.foodDec();
        }
    },
    happinessInc: function(value) {
        this.happiness = Math.min(100, this.happiness + value);
    },
    energyInc: function() {
        this.energy = Math.min(100, this.energy + 1 * this.speed);
        this.stopListening();
    },
    foodDec: function() {
        this.food = Math.max(0, this.food - 1)
    },
    happinessDec: function() {
        this.happiness = Math.max(0, this.happiness - 1)
    },
    energyDec: function() {
        this.energy = Math.max(0, this.energy - 1)
    },

    initPeppa: function (speed) {
        this.awake = true;
        this.speed = speed;
        this.peppa = document.getElementsByClassName('peppaThePig').item(0);
        this.feedBtn = document.getElementsByClassName('feed').item(0);
        this.resetBtn = document.getElementsByClassName('reset').item(0);
        this.speechLog = document.getElementsByClassName('speechLog').item(0);
        this.volume = document.getElementById('volume');
        this.sounds = {
            0: document.getElementById('sound0'),
            1: document.getElementById('sound1'),
            2: document.getElementById('sound2'),
            death: document.getElementById('death')
        };
        setInterval(() => {this.save();}, 10000);
        this.displayData();
        this.lifeID = setInterval(() => {this.lifeController()}, 1000);

        this.initSounds();
        this.initNotifications();
        this.initSpeech();
        this.initLightDetection();
        this.initFeed();

        document.addEventListener("visibilitychange",  () => {this.handleVisibilityChange()});
        this.resetBtn.addEventListener('click', (event) => {this.reset(event);}, false);
    },

    displayData: function () {
        document.getElementsByClassName('food').item(0).innerText = this.food;
        document.getElementsByClassName('energy').item(0).innerText = this.energy;
        document.getElementsByClassName('happiness').item(0).innerText = this.happiness;
    },
    save: function () {
        if (checkLocalStorage()) {
            localStorage.setItem('peppa', this.toString());
            console.log('saved');
        }
    },
    toString: function () {
        var this_ = this;
        var obj = {
            food: this_.food,
            energy: this_.energy,
            happiness: this_.happiness
        };
        return JSON.stringify(obj);
    },
    loadData: function () {
        if (checkLocalStorage() && hasStoredData()) {
            var res = JSON.parse(localStorage.getItem('peppa'));
            Object.assign(this, res);
        } else {
            this.energy = 100;
            this.food = 100;
            this.happiness = 100;
        }
    },

    lifeController: function () {
        this.displayData();
        this.hunger();
        if (this.awake) {
            this.energyDec();
        } else {
            this.energyInc()
        }
        this.happinessDec();
        if (!this.isAlive()) {
            this.die();
        }
    },
    initSounds: function () {
        this.volume.max = 1;
        this.volume.step = 0.1;
        this.volume.defaultValue = 0.5;
        this.changeVolume();
        this.volume.addEventListener('change', (event) => {this.changeVolume(event)});
        setInterval(() => {this.makeSound()}, Math.floor(Math.random() * 15) * 1000);
    },

    changeVolume: function () {
        for (var sound in this.sounds) {
            if (this.sounds.hasOwnProperty(sound)) {
                this.sounds[sound].volume = this.volume.value;
            }
        }
    },
    makeSound: function (anyway) {
        if (this.isAlive() && !this.listening && (!document.hidden || anyway)) {
            this.sounds[Math.floor(Math.random() * 3)].play();
        }
    },
    initNotifications: function () {
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
                }
            );
        }
    },
    checkStats: function () {
        var message = "";
        if (this.food <= 20) {
            message += ' I\'m hungry:(';
        }
        if (this.happiness <= 20) {
            message += ' It\'s so boring to be alone:(';
        }
        if (message && this.isAlive()) {
            notify('Hey!', 'Did you forget about me?' + message);
            this.makeSound(true);
        }
    },
    isAlive: function () {
        return !(this.happiness == 0 && this.food == 0 ||
        this.happiness == 0 && this.energy == 0 ||
        this.food == 0 && this.energy == 0);
    },

    initSpeech: function () {
        var SpeechRecognition = window.SpeechRecognition ||
            window.webkitSpeechRecognition || null;
        if (SpeechRecognition) {
            this.recognizer = new SpeechRecognition();
            this.recognizer.lang = 'ru-RU';
            this.recognizer.continuous = true;
            this.recognizer.interimResults = true;
            this.peppa.addEventListener('click', (event) => {this.checkTalk(event)});
            this.recognizer.addEventListener('result', (event) => {this.talkResults(event)})
        } else {
            this.speechLog.style.display = 'none';
        }
    },
    checkTalk: function () {
        if (this.happiness < 100) {
            this.recognizer.start();
            this.listening = true
        }
    },
    talkResults: function (event) {
        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                var res = event.results[i][0].transcript;
                this.speechLog.innerHTML += res + '<br>';
                this.happinessInc(res.length);
            }
        }
        if (this.happiness == 100) {
            this.stopListening();
        }
    },
    stopListening: function () {
        if (this.listening) {
            this.listening = false;
            this.recognizer.stop();
        }
    },
    initLightDetection: function () {
        if ('ondevicelight' in window) {
            window.addEventListener('devicelight', event => {this.isDarkOutside(event)});
        }
    },
    isDarkOutside: function (e) {
        this.awake = e.value > 10;
    },
    initFeed: function() {
        if (!navigator.getBattery) {
            this.feedBtn.addEventListener('click', event => {this.feed(event)}, false);
        } else {
            this.feedBtn.style.display = 'none';
        }
    },

    feed: function() {
        this.foodInc();
    },
    hunger: function() {
        if (navigator.getBattery) {
            navigator
                .getBattery()
                .then((battery) => {this.workBattery(battery)});
            return true;
        } else {
            this.foodDec();
            return false;
        }
    },
    workBattery: function(battery) {
        if (battery.charging) {
            this.foodInc();
        } else {
            this.foodDec();
        }
    },
    handleVisibilityChange: function() {
        this.awake = document.hidden ? false : true;
    },
    reset: function () {
        localStorage.removeItem('peppa');
        this.loadData();
        clearInterval(this.lifeID);
        this.lifeID = setInterval(() => {this.lifeController();}, 1000);
    },
    die: function () {
        clearInterval(this.lifeID);
        this.animateDeath();
        this.sounds.death.play()
    },
    animateDeath: function () {
        // TODO
    }
};

new Peppa(3);
