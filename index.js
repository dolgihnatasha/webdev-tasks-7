var params = {
    energy: 0,
    food: 0,
    happiness: 0
};
var awake = true;
var speed = 3;
var recognizer;
var peppa = document.getElementsByClassName('peppaThePig').item(0);
var feedBtn = document.getElementsByClassName('feed').item(0);
var resetBtn = document.getElementsByClassName('reset').item(0);
var speechLog = document.getElementsByClassName('speechLog').item(0);
var lifeID;

initPeppa();

function initPeppa() {
    loadData();
    displayData();
    lifeID = setInterval(lifeController, 1000);

    loadSounds();
    loadNotifications();
    initSpeech();
    initLightDetection();
    initFeed();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    resetBtn.addEventListener('click', reset, false);
    

    setInterval(saveData, 10000);
}

function loadNotifications() {
    var Notification = window.Notification ||
        window.webkitNotification || null;
    if (Notification) {
        Notification.requestPermission(
            function () {
                setInterval(notify, 60 * 1000);
            }
        );
    }
}

function initFeed() {
    if (!navigator.getBattery) {
        feedBtn.addEventListener('click', feed, false);
    } else {
        feedBtn.style.display = 'none';
    }
}

function notify() {
    new Notification('Heyy!', {body: 'Did you forget about me?'});
}

function reset() {
    localStorage.removeItem('params');
    loadData();
    clearInterval(lifeID);
    lifeID = setInterval(lifeController, 1000);
}

function initSpeech() {
    var SpeechRecognition = window.SpeechRecognition ||
        window.webkitSpeechRecognition || null;
    if (SpeechRecognition) {
        recognizer = new SpeechRecognition;
        recognizer.lang = 'ru-RU';
        recognizer.continuous = true;
        recognizer.interimResults = true;
        peppa.addEventListener('click', checkTalk);
        recognizer.addEventListener('result', talkResults)
    } else {
        speechLog.style.display = 'none';
    }
}

function lifeController() {
    displayData();
    hunger();
    if (awake) {
        if (params.energy > 0) {
            params.energy--;
        }
    } else {
        if (params.energy < 100) {
            params.energy += speed;
        }
    }
    params.happiness = Math.max(0, params.happiness - 1);
    isAlive();
    
}

function isAlive() {
    if (params.happiness == 0 && params.food == 0 ||
    params.happiness == 0 && params.energy == 0 ||
    params.food == 0 && params.energy == 0) {
        clearInterval(lifeID);
    }

}

function hunger() {
    if (navigator.getBattery) {
        navigator
            .getBattery()
            .then(workBattery);
        return true;
    } else {
        if (params.food > 0) {
            params.food--;
        }
        return false;
    }
}
function workBattery(battery) {
    if (battery.charging) {
        if (params.food < 100) {
            params.food += speed;
        }
    } else {
        if (params.food > 0) {
            params.food--;
        }
    }
}

function feed() {
    console.log('here');
    params.food = Math.min(100, params.food + 10);
}

function checkTalk() {
    if (params.happiness < 100) {
        recognizer.start();
    }
}

function talkResults(event) {
    for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            var res = event.results[i][0].transcript;
            speechLog.innerHTML += res + '<br>';
            if (params.happiness < 100) {
                params.happiness = Math.min(100, params.happiness + res.length);
            }
        }
    }
    if (params.happiness == 100) {
        recognizer.stop();
    }
}

function loadSounds() {
    //TODO
}

function handleVisibilityChange() {
    awake = (document.hidden) ? false : true;
}


function initLightDetection() {
    if ('ondevicelight' in window) {
        window.addEventListener('devicelight', isDarkOutside);
    }
}

function isDarkOutside(e) {
    awake = e.value > 10;
}

function saveData() {
    if (checkLocalStorage()) {
        localStorage.setItem('params', JSON.stringify(params));
        console.log('saved');
    }
}

function loadData() {
    if (checkLocalStorage() && hasStoredData()) {
        params = JSON.parse(localStorage.getItem('params'));
    } else {
        params = {
            energy: 100,
            food: 100,
            happiness: 100
        };
    }
}

function displayData() {
    document.getElementsByClassName('food').item(0).innerText = params.food;
    document.getElementsByClassName('energy').item(0).innerText = params.energy;
    document.getElementsByClassName('happiness').item(0).innerText = params.happiness;
}

function hasStoredData() {
    return !!localStorage.getItem('params');
}

function checkLocalStorage() {
    try {
        localStorage.setItem('key', 'value');
        localStorage.removeItem('key');
        return true;
    } catch (error) {
        return false;
    }
}
