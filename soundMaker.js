class SoundMaker {
    constructor(sounds, volume) {
        this.sounds = sounds;
        this.volume = volume;
        this.initSounds();
    }
    initSounds() {
        this.volume.max = 1;
        this.volume.step = 0.1;
        this.volume.defaultValue = 0.5;
        this.changeVolume();
        this.volume.addEventListener('change', 
            (event) => {this.changeVolume(event)});
        this.soundID = this.start();
    }
    changeVolume() {
        for (var sound in this.sounds) {
            if (this.sounds.hasOwnProperty(sound)) {
                this.sounds[sound].volume = this.volume.value;
            }
        }
    }
    makeSound(death, ignoreHidden) {
        if (!death) {
            if (!this.listening && (!document.hidden || ignoreHidden)) {
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
}
