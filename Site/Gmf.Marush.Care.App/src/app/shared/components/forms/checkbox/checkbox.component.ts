import { Component, Input } from '@angular/core';

@Component({
    selector: 'marush-checkbox',
    standalone: true,
    imports: [],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss'
  })
  export class CheckBoxComponent {
    @Input() labelText = '';
  }
