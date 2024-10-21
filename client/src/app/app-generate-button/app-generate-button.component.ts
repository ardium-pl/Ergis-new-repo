import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-app-generate-button',
  standalone: true,
  imports: [],
  templateUrl: './app-generate-button.component.html',
  styleUrl: './app-generate-button.component.scss'
})
export class AppGenerateButtonComponent {
  @Input({required:true}) highDesText: string = '';  // Właściwość do przechowywania tekstu na temat High-Density Polyethylene
  @Input({required:true}) lowDesText: string = '';   // Właściwość do przechowywania tekstu na temat Low-Density Polyethylene
  generateData() {
    console.log("Generate button clicked:",this.highDesText.length);
  }
}
