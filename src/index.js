var {Happiness, Energy, Food} = require('./objects');
var SoundMaker = require('./soundMaker').SoundMaker;
var {checkLocalStorage, hasStoredData, notify} = require('./lib');
var animations = require('./animations');

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
