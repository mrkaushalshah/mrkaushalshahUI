import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private title: Title, private meta: Meta) { }

  updateSeoData(data: { title: string, description: string, keywords: string, image?: string, url?: string }) {
    // 1. Set Browser Title
    this.title.setTitle(data.title);

    // 2. Set Standard Meta Tags
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ name: 'keywords', content: data.keywords });
    this.meta.updateTag({ name: 'author', content: 'Kaushal Shah' });

    // 3. Set Open Graph (Facebook/LinkedIn/WhatsApp) Tags
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: data.url || 'https://mrkaushalshah.com' });

    if (data.image) {
      this.meta.updateTag({ property: 'og:image', content: data.image });
    } else {
      this.meta.updateTag({ property: 'og:image', content: 'https://mrkaushalshah.com/assets/dp.png' });
    }

    // 4. Set Twitter Card Tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    if (data.image) {
      this.meta.updateTag({ name: 'twitter:image', content: data.image });
    }

    // 5. Dynamic Canonical Link Tag
    const canonicalUrl = data.url || 'https://mrkaushalshah.com/';
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }
}