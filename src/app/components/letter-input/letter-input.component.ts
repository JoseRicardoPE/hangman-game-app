import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusGame } from '../../enums/status-game';

@Component({
  selector: 'app-letter-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './letter-input.component.html',
  styleUrl: './letter-input.component.scss'
})
export class LetterInputComponent {

  @Output() letterGuessed = new EventEmitter<string>();
  @Input() guessedLetters: string[] = [];
  @Input() wrongLetters: string[] = [];
  @Input() isDisabled!: boolean;

  letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  guessLetter(letter: string) {
    this.letterGuessed.emit(letter);
  }

  isLetterDisabled(letter: string): boolean {
    return this.guessedLetters.includes(letter) || this.wrongLetters.includes(letter);
  }
}
