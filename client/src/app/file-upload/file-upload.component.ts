import { Component } from '@angular/core';
import { AppGenerateButtonComponent } from '../app-generate-button/app-generate-button.component';
import { ViewResultComponent } from '../view-result/view-result.component';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.js';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [AppGenerateButtonComponent, ViewResultComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  pdfText: string ='';
  combinedLowDesText: string = '';
  combinedhighDesText: string = '';

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.selectedFile = target.files[0]; 
    }
  }

  uploadFile() {
    console.log('uploadFile function called');
    if (this.selectedFile) {
      const fileReader = new FileReader();
      
      fileReader.onload = async () => {
        console.log('File read successfully');
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        
        const tocPage = await pdf.getPage(1);
        const tocText = await this.extractTextFromPage(tocPage);
       
        //console.log('Table of Contents:', tocText);

        const pagesToSearchHigh = this.findPagesInContents(tocText, 'High-Density Polyethylene');
        const pagesToSearchLow = this.findPagesInContents(tocText, 'Low Density Polyethylene');

        if (pagesToSearchHigh.length > 0) {
          this.combinedhighDesText = await this.extractTextFromPages(pdf, pagesToSearchHigh);
        }
        if(pagesToSearchLow.length > 0) {
          this.combinedLowDesText = await this.extractTextFromPages(pdf, pagesToSearchLow);
        }
        if(pagesToSearchHigh.length == 0 && pagesToSearchLow.length > 0){
          console.log('Contents are not found or it,has not have seraching value');
        }else{
          console.log('Contents are  found and we took the part of the text');
        }

      };

      fileReader.readAsArrayBuffer(this.selectedFile);
    } else {
      console.log('No file selected'); // Log, gdy nie wybrano pliku
    }
  }
  private async extractTextFromPages(pdf: any, pageRanges: number[]): Promise<string> {
    let combinedText = '';
    
    for (let i = 0; i < pageRanges.length; i += 2) {
      const startPage = pageRanges[i];
      const endPage = pageRanges[i + 1];

      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const pageText = await this.extractTextFromPage(page);
        combinedText += `${pageText}\n`; // Dodaje tekst z każdej strony, oddzielając nowe strony nową linią
      }
    }
    
    return combinedText; // Zwraca połączony tekst
  }
  
  private async extractTextFromPage(page: any): Promise<string> {
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(' ');
  }
  private findPagesInContents(contents: string, keyword: string): number[] {
    const pageNumbers: number[] = [];
    const findedIndices = this.simpleSearch(contents, keyword);
    
    for (const index of findedIndices) {
      const result = this.findrange(contents, index);
      pageNumbers.push(result[0]);
      pageNumbers.push(result[1]);
    }
    
    return pageNumbers;
  }
  
  private findrange(text: string, index: number): [number, number] { // index - index końca wyszukanego słowa
    let j = index;
    while (j < text.length && (text[j] < '0' || text[j] > '9')) {
      j++;
    }
    let liczba: string = '';
    while (j < text.length && (text[j] >= '0' && text[j] <= '9')) {
      liczba += text[j];
      j++;
    }
    while (j < text.length && (text[j] < '0' || text[j] > '9')) {
      j++;
    }
    let liczba2: string = '';
    while (j < text.length && (text[j] >= '0' && text[j] <= '9')) {
      liczba2 += text[j];
      j++;
    }
  
    const pagenumber1 = parseInt(liczba, 10);
    const pagenumber2 = parseInt(liczba2, 10);
    
    return [pagenumber1, pagenumber2];
  }
  
    
  private simpleSearch(text: string, pattern: string): number[] {
    const textLength = text.length;
    const patternLength = pattern.length;
    const indices: number[] = []; // Tablica do przechowywania indeksów znalezionych wystąpień

    for (let i = 0; i <= textLength - patternLength; i++) {
        let found = true;

        for (let j = 0; j < patternLength; j++) {
            if (text[i + j] !== pattern[j]) {
                found = false;
                break;
            }
        }

        if (found) {
            indices.push(i); // Dodaje indeks znalezionego wystąpienia do tablicy
        }
    }

    return indices; // Zwraca tablicę wszystkich znalezionych indeksów
}

}
