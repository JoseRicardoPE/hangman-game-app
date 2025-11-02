import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-word-display',
  imports: [CommonModule],
  templateUrl: './word-display.component.html',
  styleUrl: './word-display.component.scss'
})
export class WordDisplayComponent {
  @Input() word: string = '';
  @Input() guessedLetters: string[] = [];
  @Input() wrongCharacter: string = '_';

  get displayedWord(): string[] {
    return this.word.split('').map(letter => this.guessedLetters.includes(letter) ? letter : this.wrongCharacter);
  }

}
