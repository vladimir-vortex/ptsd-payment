import { Component, OnInit } from '@angular/core';
import { BgTestSoundService } from 'src/app/services/bg-test-sound.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.sass']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    private bgTestSoundService: BgTestSoundService
  ) { }

  ngOnInit(): void {
    this.bgTestSoundService.stop();
  }

}
