import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private baseUrl = 'http://localhost:8080/email';

  constructor(private http: HttpClient) {}

  private getTemplate(templateUrl: string): Observable<string> {
    return this.http.get(templateUrl, { responseType: 'text' });
  }

  sendAccountCreationEmail(emailData: any): Observable<any> {
    console.log('Email data: ', emailData);
    return this.getTemplate(
      'assets/email-templates/account-creation-email.component.html'
    ).pipe(
      map((template) => {
        const emailContent = template
          .replace('{{ name }}', emailData.name)
          .replace('{{ password }}', emailData.password);
        return this.http.post(
          `${this.baseUrl}/sendAccountCreation`,
          {
            to: emailData.to,
            subject: 'Account Creation',
            body: emailContent,
          },
          { responseType: 'text' }
        );
      }),
      switchMap((postRequest) => postRequest),
      tap(() => console.log('Account creation email request sent')),
      catchError((error) => {
        console.error('Error sending account creation email:', error);
        return throwError(error);
      })
    );
  }

  sendDonationValidationEmail(emailData: any): Observable<any> {
    return this.getTemplate(
      'assets/email-templates/donation-validation-email.component.html'
    ).pipe(
      map((template) => {
        const emailContent = template.replace('{{ name }}', emailData.name);
        return this.http.post(
          `${this.baseUrl}/sendDonationValidation`,
          {
            to: emailData.to,
            subject: 'Donation Validation',
            body: emailContent,
          },
          { responseType: 'text' }
        );
      }),
      switchMap((postRequest) => postRequest),
      tap(() => console.log('Donation validation email request sent')),
      catchError((error) => {
        console.error('Error sending donation validation email:', error);
        return throwError(error);
      })
    );
  }
}
