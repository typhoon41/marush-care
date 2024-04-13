import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import marushDetails from '@shared/models/marush-details.model';

@Component({
  selector: 'marush-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  marushDetails = marushDetails;
}
