import {
    Component,
    signal,
    inject,
    ElementRef,
    ViewChild,
    AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';

interface Message {
    role: 'user' | 'assistant';
    text: string;
    timestamp: Date;
}

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chatbot.html',
    styleUrl: './chatbot.css'
})
export class ChatbotComponent implements AfterViewChecked {
    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

    private chatService = inject(ChatService);

    isOpen = signal(false);
    isLoading = signal(false);
    userInput = signal('');
    conversationId = signal<string | undefined>(undefined);
    messages = signal<Message[]>([
        {
            role: 'assistant',
            text: "👋 Hello! I'm your Top Up Voucher assistant. I can help you find voucher providers, check voucher status, or answer any questions about topping up. How can I help you today?",
            timestamp: new Date()
        }
    ]);

    private shouldScrollToBottom = false;

    toggleChat(): void {
        this.isOpen.update(v => !v);
    }

    sendMessage(): void {
        const text = this.userInput().trim();
        if (!text || this.isLoading()) return;

        const userMsg: Message = { role: 'user', text, timestamp: new Date() };
        this.messages.update(msgs => [...msgs, userMsg]);
        this.userInput.set('');
        this.isLoading.set(true);
        this.shouldScrollToBottom = true;

        this.chatService.sendMessage({
            message: text,
            conversationId: this.conversationId()
        }).subscribe({
            next: (response) => {
                this.conversationId.set(response.conversationId);
                const assistantMsg: Message = {
                    role: 'assistant',
                    text: response.reply,
                    timestamp: new Date()
                };
                this.messages.update(msgs => [...msgs, assistantMsg]);
                this.isLoading.set(false);
                this.shouldScrollToBottom = true;
            },
            error: (err: Error) => {
                const errorMsg: Message = {
                    role: 'assistant',
                    text: `⚠️ ${err.message ?? "Sorry, I couldn't connect to the server. Please try again."}`,
                    timestamp: new Date()
                };
                this.messages.update(msgs => [...msgs, errorMsg]);
                this.isLoading.set(false);
                this.shouldScrollToBottom = true;
            }
        });
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    ngAfterViewChecked(): void {
        if (this.shouldScrollToBottom) {
            this.scrollToBottom();
            this.shouldScrollToBottom = false;
        }
    }

    private scrollToBottom(): void {
        try {
            const el = this.messagesContainer?.nativeElement;
            if (el) el.scrollTop = el.scrollHeight;
        } catch (_) { }
    }
}
