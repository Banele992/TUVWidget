import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ChatRequest {
    message: string;
    conversationId?: string;
}

export interface ChatResponse {
    reply: string;
    conversationId: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private readonly apiUrl = `${environment.apiBaseUrl}/api/chat`;
    private readonly http = inject(HttpClient);

    sendMessage(request: ChatRequest): Observable<ChatResponse> {
        return this.http
            .post<ChatResponse>(this.apiUrl, request)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let message = 'An unexpected error occurred.';

        if (error.status === 0) {
            // Network / CORS / server not running
            message = 'Cannot reach the server. Please check that the API is running.';
        } else if (error.status === 400) {
            message = error.error?.error ?? 'Invalid request.';
        } else if (error.status === 500) {
            message = error.error?.error ?? 'A server error occurred. Please try again.';
        }

        return throwError(() => new Error(message));
    }
}
