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
    constructor(val, obj, speechLog) {
        super(val);
        this.starter = obj;
        this.speechLog = speechLog;
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
        }
    }
    talkResults(event) {
        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                var res = event.results[i][0].transcript;
                this.speechLog.innerHTML += res + '<br>';
                this.inc(res.length);
            }
        }
        if (this.happiness == 100) {
            this.stopListening();
        }
    }
    stopListening() {
        if (this.listening) {
            this.listening = false;
            this.recognizer.stop();
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
        this.eating = this.battery.charging;
        return this.eating;
    }
}
