import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WordApiResponse } from '../models/word-api-response'

@Injectable({
  providedIn: 'root'
})
export class WordService {

  private  apiURL = 'https://random-words-api.kushcreates.com/api';

  // Fallback local
  private fallback = {
    en: ['ANGULAR', 'TYPESCRIPT', 'HANGMAN', 'MAGIC', 'DRAGON'],
    es: ['MAGIA', 'AHORCADO', 'ANGULAR', 'TIPO', 'GATO']
  };

  private categories = ['animals', 'countries', 'sports', 'programming languages']

  constructor(
    private http: HttpClient,
  ) { }

  getRandomWord(category: string, lang: string): Observable<string> {
    const url = `${this.apiURL}?category=${category}&language=${lang}&words=10`;

    console.log(`Solicitando palabras a: ${url}`);

    return this.http.get<WordApiResponse[]>(url).pipe(
      map(response => {
        if (!response || response.length === 0) throw new Error('Empty response');

        const randomIndex = Math.floor(Math.random() * response.length);
        const apiWord = response[randomIndex].word;

        const cleanedWord = apiWord
          .normalize('NFD')                   //separa letras de sus acentos.
          .replace(/[\u0300-\u036f]/g, '')    //elimina acentos.
          .replace(/[\s+]/g, '')               //elimina espacios.
          .toUpperCase();

        console.log('Palabra limpia: ', cleanedWord);
        return cleanedWord;
      }),
      catchError(() => {
        const words = this.fallback[lang as 'en' | 'es'];
        const randomIndex = Math.floor(Math.random() * words.length);

        const fallbackWord = words[randomIndex]
          .normalize('NFD')                   //separa letras de sus acentos.
          .replace(/[\u0300-\u036f]/g, '')    //elimina acentos.
          .replace(/[\s+]/g, '')               //elimina espacios.
          .toUpperCase();
        
        console.log('Usando palabra de fallback: ', fallbackWord);
        return fallbackWord;
      })
    );
  }

  getAvailableCategories(): string[] {
    return this.categories;
  }
  
}
