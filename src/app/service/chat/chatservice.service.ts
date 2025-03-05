import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatserviceService {

  constructor(private httpClient: HttpClient) {}
  baseURL = environment.flaskUrl;

  processQuery(query:string){
    console.log("came here",query);
    
    const url = `${this.baseURL}/chatbot_prompt`;
    const body = { prompt: query };

    const headers = { 'Content-Type': 'application/json' };
    this.httpClient.post(url, body, { headers }).subscribe({
      next: response => {
        console.log('Response:', response);
      },
      error: error => {
        console.error('Error occurred:', error);
      }
    });
    
  }



  
}
