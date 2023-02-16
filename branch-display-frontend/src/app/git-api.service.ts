import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GitApiService {

  private apiUrl = '/api'; // Replace with your API endpoint URL

  constructor(private http: HttpClient) { }

  getBranchHistory(repoLink: string): Observable<any> {
    const url = `${this.apiUrl}/git/?repoLink=${repoLink}`;
    return this.http.get(url);
  }
}
