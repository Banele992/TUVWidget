import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from './chatbot/chatbot';

interface VoucherProvider {
  id: string;
  name: string;
  logoUrl: string;
  /** Brand colour used for hover border/glow */
  brandColor: string;
}

interface Tab {
  id: string;
  label: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, ChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TUVWidget');

  // ── Tab state ─────────────────────────────────────────────
  activeTab: string = 'vouchers';

  tabs: Tab[] = [
    { id: 'online', label: 'Online Deposit' },
    { id: 'vouchers', label: 'Top Up Vouchers' },
    { id: 'eft', label: 'EFT' },
    { id: 'ussd', label: 'Top Up Via Ussd' },
    { id: 'guides', label: 'Guides' }
  ];

  selectTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // ── Provider state ─────────────────────────────────────────
  selectedProvider: string = 'capitec-ownpay';

  /** Popular payment methods shown at the top (Capitec OwnPay + OwnPay) */
  popularProviders: VoucherProvider[] = [
    {
      id: 'capitec-ownpay',
      name: 'Capitec OwnPay',
      logoUrl: 'assets/providers/Capitec_OwnPay.jpg',
      brandColor: '#004A9F'
    },
    {
      id: 'ownpay',
      name: 'OwnPay',
      logoUrl: 'assets/providers/OwnPay.jpg',
      brandColor: '#00B4C8'
    }
  ];

  /** Voucher providers shown in the Top Up Vouchers tab */
  voucherProviders: VoucherProvider[] = [
    {
      id: 'hollytopup',
      name: 'HollywoodBets Top Up Vouchers',
      logoUrl: 'assets/providers/HollyTopUp.jpg',
      brandColor: '#6B21A8'
    },
    {
      id: 'easyload',
      name: 'Easyload',
      logoUrl: 'assets/providers/EasyLoad.jpg',
      brandColor: '#F57C00'
    },
    {
      id: 'ott',
      name: 'OTT',
      logoUrl: 'assets/providers/OTT.jpg',
      brandColor: '#3CB043'
    },
    {
      id: '1voucher',
      name: '1Voucher',
      logoUrl: 'assets/providers/Flash.jpg',
      brandColor: '#FF6600'
    },
    {
      id: 'bluvoucher',
      name: 'Blu Voucher',
      logoUrl: 'assets/providers/Blu.jpg',
      brandColor: '#E91E8C'
    },
    {
      id: 'anytime',
      name: 'Anytime Voucher (R&A Cellular)',
      logoUrl: 'assets/providers/RACellular.jpg',
      brandColor: '#008B8B'
    },
    {
      id: 'flexi',
      name: 'Flexi Voucher',
      logoUrl: 'assets/providers/Yoyo.jpg',
      brandColor: '#1565C0'
    },
    {
      id: 'easypay',
      name: 'EasyPay',
      logoUrl: 'assets/providers/EasyPay.jpg',
      brandColor: '#7B2D8B'
    },
    {
      id: 'capitec-ownpay',
      name: 'Capitec OwnPay',
      logoUrl: 'assets/providers/Capitec_OwnPay.jpg',
      brandColor: '#004A9F'
    },
    {
      id: 'ownpay',
      name: 'OwnPay',
      logoUrl: 'assets/providers/OwnPay.jpg',
      brandColor: '#00B4C8'
    }
  ];

  selectProvider(id: string): void {
    this.selectedProvider = id;
  }

  // ── Voucher input ──────────────────────────────────────────
  voucherNumber: string = '';

  submitVoucher(): void {
    if (!this.voucherNumber.trim()) return;
    // TODO: integrate with API
    console.log('Submitting voucher:', this.voucherNumber.trim(), 'Provider:', this.selectedProvider);
    alert(`Voucher "${this.voucherNumber.trim()}" submitted via ${this.selectedProvider}!`);
    this.voucherNumber = '';
  }

  // ── Utility actions ────────────────────────────────────────
  openHelp(event: Event): void {
    event.preventDefault();
    alert('Help: Select your voucher provider from the options above, then enter your voucher number below.');
  }

  openTsCs(event: Event): void {
    event.preventDefault();
    alert('Terms & Conditions: Bonus funds expire 30 days after the promotion ends. See full T\'s and C\'s on our website.');
  }
}
