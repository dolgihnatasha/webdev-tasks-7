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