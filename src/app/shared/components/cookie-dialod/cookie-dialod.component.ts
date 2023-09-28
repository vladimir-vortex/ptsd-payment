import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cookie-dialod',
  templateUrl: './cookie-dialod.component.html',
  styleUrls: ['./cookie-dialod.component.sass']
})
export class CookieDialodComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CookieDialodComponent>
  ) { }

  position = 'bottom';

  ngOnInit(): void {
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
