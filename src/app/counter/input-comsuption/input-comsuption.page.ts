import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-comsuption',
  templateUrl: './input-comsuption.page.html',
  styleUrls: ['./input-comsuption.page.scss'],
})
export class InputComsuptionPage implements OnInit {
  numbers: number[] = [0, 0, 0, 0, 0]; // Tableau pour stocker les nombres
  decimals: number[] = [0, 0, 0]; // Tableau pour stocker les décimales

  editNumber(index: number) {
    const newNumber = prompt('Entrez un nombre :');
    if (newNumber !== null) {
      const parsedNumber = parseInt(newNumber, 10);
      if (!isNaN(parsedNumber)) {
        // Mettez à jour le tableau de nombres avec le nouveau nombre
        if (index < this.numbers.length) {
          this.numbers[index] = parsedNumber;
        } else {
          const decimalIndex = index - this.numbers.length;
          if (decimalIndex < this.decimals.length) {
            this.decimals[decimalIndex] = parsedNumber;
          }
        }
      }
    }
  }

  getEnteredNumbers(){
    // Concaténez les nombres et les décimales en une seule chaîne
    const enteredNumbers = this.numbers.join('') + ',' + this.decimals.join('');
    console.log(enteredNumbers);
  }

  constructor() { }

  ngOnInit() {
  }

}
