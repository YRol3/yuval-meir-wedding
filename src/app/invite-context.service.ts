import { Injectable } from '@angular/core';

export interface InviteDetails {
  name?: string;
  will_arrive?: string;
  how_many?: string;
  note?: string;
  language?: string;
  [key: string]: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class InviteContextService {
  private inviteDetails: InviteDetails | null = null;
  private readonly utf8Decoder = new TextDecoder('utf-8', { fatal: true });

  loadFromUrl(search: string): void {
    const encodedInvite = this.getInviteParam(search);

    if (!encodedInvite) {
      this.inviteDetails = null;
      return;
    }

    const decodedInvite = this.decodeInvite(encodedInvite);

    this.inviteDetails = decodedInvite && !Array.isArray(decodedInvite) ? decodedInvite : null;

    if (this.inviteDetails) {
      console.log('Decoded invite payload:', this.inviteDetails);
    }
  }

  get data(): InviteDetails | null {
    return this.inviteDetails;
  }

  get preferredLanguage(): 'en' | 'he' {
    const language = this.inviteDetails?.language?.trim().toLowerCase();

    return language === 'en' || language === 'he' ? language : 'he';
  }

  private getInviteParam(search: string): string | null {
    const match = search.match(/[?&]invite=([^&]+)/);

    return match ? match[1] : null;
  }

  private decodeInvite(encodedInvite: string): InviteDetails | null {
    const candidates = [
      encodedInvite,
      this.safeDecodeURIComponent(encodedInvite),
      encodedInvite.replace(/ /g, '+'),
      this.safeDecodeURIComponent(encodedInvite).replace(/ /g, '+')
    ];

    for (const candidate of [...new Set(candidates)]) {
      try {
        const normalized = candidate
          .trim()
          .replace(/\s+/g, '')
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
        const binary = atob(padded);
        const json = this.decodeUtf8(binary);
        const parsed = JSON.parse(json);

        return parsed && typeof parsed === 'object' ? parsed as InviteDetails : null;
      } catch {
        continue;
      }
    }

    console.error('Failed to decode invite payload:', encodedInvite);
    return null;
  }

  private safeDecodeURIComponent(value: string): string {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  private decodeUtf8(binary: string): string {
    try {
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return this.utf8Decoder.decode(bytes);
    } catch {
      return this.decodeLegacyUnicodeBinary(binary);
    }
  }

  private decodeLegacyUnicodeBinary(binary: string): string {
    try {
      return decodeURIComponent(this.escapeBinary(binary));
    } catch {
      throw new Error('Invite payload is not valid UTF-8');
    }
  }

  private escapeBinary(binary: string): string {
    return Array.from(binary)
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('');
  }
}
