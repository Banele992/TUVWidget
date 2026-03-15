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

export interface ChatRequest {
    message: string;
    conversationId?: string;
    language?: string;
}

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
    selectedLanguage = signal('en');
    languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
        { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
        { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
        { code: 'fr', name: 'French', flag: '🇫🇷' }
    ];

    private intros: Record<string, string> = {
        'en': "👋 Hello! I'm your Top Up Voucher assistant. I can help you find voucher providers, check voucher status, or answer any questions about topping up. How can I help you today?",
        'zu': "👋 Sawubona! NginguMsizi wakho we-Top Up Voucher. Ngingakusiza uthole abahlinzeki bamavawusha, uhlole isimo sevawusha, noma uphendule noma yimiphi imibuzo mayelana nokugcwalisa. Ngingakusiza kanjani namuhla?",
        'af': "👋 Hallo! Ek is jou Top Up Voocher-assistent. Ek kan jou help om koopbewysverskaffers te vind, koopbewysstatus na te gaan, of enige vrae oor herlaai te beantwoord. Hoe kan ek jou vandag help?",
        'pt': "👋 Olá! Sou o seu assistente de Voucher Top Up. Posso ajudá-lo a encontrar fornecedores de vouchers, verificar o estado dos vouchers ou responder a quaisquer questões sobre carregamentos. Como posso ajudá-lo hoje?",
        'fr': "👋 Bonjour ! Je suis votre assistant Top Up Voucher. Je peux vous aider à trouver des fournisseurs de bons, à vérifier l'état des bons ou à répondre à toutes vos questions sur les recharges. Comment puis-je vous aider aujourd'hui ?"
    };

    messages = signal<Message[]>([
        {
            role: 'assistant',
            text: this.intros['en'],
            timestamp: new Date()
        }
    ]);

    changeLanguage(langCode: string): void {
        this.selectedLanguage.set(langCode);
        
        // If it's a fresh conversation (only the welcome message exists), update the welcome message
        const currentMsgs = this.messages();
        if (currentMsgs.length === 1 && currentMsgs[0].role === 'assistant') {
            this.messages.set([{
                ...currentMsgs[0],
                text: this.intros[langCode] || this.intros['en']
            }]);
        }
    }

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
            conversationId: this.conversationId(),
            language: this.selectedLanguage()
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
