import { Component } from '@angular/core';

@Component({
  selector: 'app-view-result',
  standalone: true,
  imports: [],
  templateUrl: './view-result.component.html',
  styleUrl: './view-result.component.scss'
})
export class ViewResultComponent {
  viewResults() {
    console.log("View Results button clicked");
  }
}
