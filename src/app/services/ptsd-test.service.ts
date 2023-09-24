import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Answer {
  questionId: number,
  answer: number
}

@Injectable({
  providedIn: 'root'
})


export class PtsdTestService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  answers: Answer[] = [];

  getQuestions(): Observable<any> {
    return this.http.get<any>('assets/data/ptsd-questions.json');
      // .map((response:any) => response.json())
      // .catch((error:any) => console.log(error));
  }
  
  getFablesQuestions(): Observable<any> {
    return this.http.get<any>('assets/data/ptsd-fables-questions.json');

  }

  getResults(): Observable<any> {
    return this.http.get<any>('assets/data/ptsd-results.json');
  }

  create(body: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + `/api/v1/ptsd-test`, body, { headers: this.headers, observe: 'response', responseType: 'json' });
  }

  result(testId: string): Observable<any> {
    return this.http.get<any>(environment.apiUrl + `/api/v1/ptsd-test/${testId}/results`, { headers: this.headers, observe: 'response', responseType: 'json' });
  }

  submit(): Observable<any> {
    let test = this.getTest();
    return this.http.post<any>(environment.apiUrl + `/api/v1/ptsd-test/${this.getTestId()}/answers`,
     { "child": test.child, "lusher": test.lusher, "fables": test.fables }, { headers: this.headers, observe: 'response', responseType: 'json' });
  }

  send(id: string, body: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + `/api/v1/ptsd-test/${id}/send-results`,
    body, { headers: this.headers, observe: 'response', responseType: 'json' });
  }

  // test(body: any): Observable<any> {
  //   // return this.http.post<any>(`https://vetclinic-backend.onrender.com/api/users/registration`, body, { headers: this.headers, observe: 'response', responseType: 'json' });
  // }

  setTest(test: string) {
    localStorage.setItem('ptsd-test-data', JSON.stringify(test));
  }

  clearTest() {
    localStorage.removeItem('ptsd-test-data');
  }

  getTest() {
    return JSON.parse(localStorage.getItem('ptsd-test-data') || '');
  }

  setTestId(id: string) {
    localStorage.setItem('ptsd-test-id', id);
  }

  getTestId() {
    return localStorage.getItem('ptsd-test-id');
  }

  setAnswer(answer: Answer) {
    let idx = this.answers.findIndex((e: any) => answer.questionId === e.questionId);
    if(idx != -1) {
      this.answers.splice(idx, 1);
    }
    this.answers.push(answer);
  }
}
