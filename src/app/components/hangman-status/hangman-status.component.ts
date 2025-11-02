import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hangman-status',
  imports: [CommonModule],
  templateUrl: './hangman-status.component.html',
  styleUrl: './hangman-status.component.scss'
})
export class HangmanStatusComponent {
  @Input() attemptsLeft!: number;

  get errors(): number {
    return 6 - this.attemptsLeft;
  }
}
