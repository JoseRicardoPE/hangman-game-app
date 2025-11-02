import { Component } from '@angular/core';
import { WordDisplayComponent } from "./components/word-display/word-display.component";
import { LetterInputComponent } from "./components/letter-input/letter-input.component";
import { HangmanStatusComponent } from "./components/hangman-status/hangman-status.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusGame } from './enums/status-game'
import { WordService } from './services/word.service';
import { triggerWinEffect } from './utils/confetti';

@Component({
  selector: 'app-root',
  imports: [WordDisplayComponent, LetterInputComponent, HangmanStatusComponent, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  
  // Lista de opciones para los dropdowns
  languages = [
    { code: 'en', culture: 'Inglés' },
    { code: 'es', culture: 'Español' },
  ];
  
  categories: string[] = [];
  selectedLanguage: string = '';
  selectedCategory: string = '';
  
  guessedLetters: string[] = [];
  wrongLetters: string[] = [];
  word: string = '';
  attemptsLeft: number = 6;
  wrongCharacter: string = '_';
  isLoading = false; 
  
  gameStatusEnum = StatusGame;
  currentStatus!: StatusGame;

  constructor(
    private wordService: WordService,
  ) {
    
  }

  ngOnInit() {
    this.currentStatus = this.gameStatusEnum.isReady;
    this.categories = this.wordService.getAvailableCategories();
  }

  startGame(): void {
    this.currentStatus = this.gameStatusEnum.isPlaying;
    
    if (!this.selectedLanguage || !this.selectedCategory) return;

    this.resetAndLoadNew();
  }
  
  loadNewWord() {
    if (!this.selectedLanguage || !this.selectedCategory) return;
    
    this.isLoading = true;
    
    this.wordService.getRandomWord(this.selectedCategory, this.selectedLanguage).subscribe({
      next: (word) => {
        this.word = word.toUpperCase();
        console.log('Nueva palabra cargada: ', this.word);
        this.isLoading = false;
      },
      error : (err) => {
        console.error('Error cargando palabra desde la API: ', err);
        this.word = 'ANGULAR';
        this.isLoading = false;
      }
    });
  }

  resetAndLoadNew(): void {
    this.resetGame();
    this.loadNewWord();
  }

  onLetterGuessed(letter: string) {

    if (this.currentStatus === this.gameStatusEnum.isGameOver || this.currentStatus === this.gameStatusEnum.isWinner) {
      return;
    }

    // Evitar repetidos
    if (this.guessedLetters.includes(letter) || this.wrongLetters.includes(letter)) {
      return;
    }

    // Verificar si la letra está en la palabra
    if (this.word.includes(letter)) {
      this.guessedLetters.push(letter);
      this.currentStatus = this.getGameStatus();
    } else {
      this.wrongLetters.push(letter);
      this.attemptsLeft--;
      this.currentStatus = this.getGameStatus();
    }
  }

  getGameStatus(): StatusGame {
    if (this.isWinner()) {
      triggerWinEffect();
      return StatusGame.isWinner;
    } else if (this.isGameOver()) {
      return StatusGame.isGameOver;
    } else {
      return StatusGame.isPlaying;
    }
  }

  isWinner(): boolean {
    return [...new Set(this.word)].every(letter => this.guessedLetters.includes(letter));
  }
  
  isGameOver(): boolean {
    return this.attemptsLeft <= 0 && !this.isWinner();
  }

  resetGame(): void {
    this.guessedLetters = []; 
    this.wrongLetters = [];
    this.attemptsLeft = 6;
    this.currentStatus = this.gameStatusEnum.isPlaying;
  }
}
