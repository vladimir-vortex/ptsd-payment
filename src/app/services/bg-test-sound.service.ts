import { Injectable,  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BgTestSoundService {

  audio: HTMLAudioElement = new Audio('/assets/sounds/ambient.mp3');

  public isPlaying = false;

  constructor(
  ) { 
    this.audio.loop = true;
    this.audio.volume = 0.1;
  }

  start(): boolean {
    this.audio.play();
    if(!this.audio.paused) {
      this.isPlaying = true;
      return true;
    }
    this.isPlaying = false;
    return false;
  }

  pause(): void {
    this.isPlaying = false;
    this.audio.pause();
  }

  stop(): void {
    this.isPlaying = false;
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
