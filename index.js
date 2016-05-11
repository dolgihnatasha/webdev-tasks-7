class Peppa {
    constructor(speed) {
        this.speed = speed;
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
        document.getElementsByClassName('food').item(0).innerText = this.food.val;
        document.getElementsByClassName('energy').item(0).innerText = this.energy.val;
        document.getElementsByClassName('happiness').item(0).innerText = this.happiness.val;
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
        let peppa = document.getElementsByClassName('peppaThePig').item(0);
        let speechLog = document.getElementsByClassName('speechLog').item(0);
        this.happiness = new Happiness(100, peppa, speechLog);
        this.energy = new Energy(100);
        this.food = new Food(100);

        this.lifeID = setInterval(() => {this.lifeController();}, 2500);
        setInterval(() => {this.saveData()}, 10000);
        let sounds = {
            0: document.getElementById('sound0'),
            1: document.getElementById('sound1'),
            2: document.getElementById('sound2'),
            death: document.getElementById('death')
        };
        let volume = document.getElementById('volume');
        this.soundMaker = new SoundMaker(sounds, volume);

        this.initNotifications();

        let resetBtn = document.getElementsByClassName('reset').item(0);
        resetBtn.addEventListener(
            'click', (event) => {this.reset(event);}, false);

        let feedBtn = document.getElementsByClassName('feed').item(0);
        if (!this.food.canEat) {
            feedBtn.addEventListener('click', () => {this.food.inc(15)});
        } else {
            feedBtn.style.display = 'none';
        }
    }
    lifeController() {
        if (this.energy.isSleeping()) {
            this.energy.inc(this.speed);
            this.food.dec(1);
            this.happiness.dec(1);
            this.happiness.stopListening();
            // console.log(1);
        } else if (this.food.isEating()) {
            this.energy.dec(1);
            this.food.inc(this.speed);
            this.happiness.dec(1);
            this.happiness.stopListening();
            // console.log(2);
        } else {
            this.energy.dec(1);
            this.food.dec(1);
            this.happiness.dec(1);
            // console.log(3);
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
        // this.animateDeath();
        this.soundMaker.makeSound(true);
        this.soundMaker.stop();
    }
    reset() {
        localStorage.removeItem('peppa');
        this.loadData();
        clearInterval(this.lifeID);
        this.lifeID = setInterval(() => {this.lifeController();}, 1000);
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
        if (this.food <= 20) {
            message += ' I\'m hungry:(';
        }
        if (this.happiness <= 20) {
            message += ' It\'s so boring to be alone:(';
        }
        if (message && this.isAlive()) {
            notify('Hey!', 'Did you forget about me?' + message);
            this.soundMaker.makeSound(false, true);
        }
    }

}

new Peppa(3);
