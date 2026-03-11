// accordion-item.component.ts
import { trigger, state, style, transition, animate } from '@angular/animations'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.sass'],
  animations: [
    trigger('bodyExpand', [
      state('collapsed', style({ height: '0', overflow: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', animate('300ms ease')),
    ]),
    trigger('arrowRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('collapsed <=> expanded', animate('300ms ease')),
    ]),
  ]
})
export class AccordionItemComponent {
    @Input() title: string = ''
    @Input() defaultOpen = false
    isOpen = false

  ngOnInit() {
    this.isOpen = this.defaultOpen
  }

  toggle() {
    this.isOpen = !this.isOpen
  }
}