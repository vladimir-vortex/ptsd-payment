import { Component, OnInit } from '@angular/core';
import { BgTestSoundService } from 'src/app/services/bg-test-sound.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {

  constructor(
    private bgTestSoundService: BgTestSoundService
  ) { }

  ngOnInit(): void {
    this.bgTestSoundService.stop();
  }

}
