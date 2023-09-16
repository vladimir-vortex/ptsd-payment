import { Component, OnInit } from '@angular/core';
import { BgTestSoundService } from 'src/app/services/bg-test-sound.service';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.sass']
})
export class TermsOfUseComponent implements OnInit {

  constructor(
    private bgTestSoundService: BgTestSoundService
  ) { }

  ngOnInit(): void {
    this.bgTestSoundService.stop();
  }

}
