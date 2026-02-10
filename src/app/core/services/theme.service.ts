import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'opsboard_theme';

    // Initialize with saved theme or system preference
    readonly currentTheme = signal<Theme>(this.getInitialTheme());

    constructor() {
        // Reactive effect to apply the theme when the signal changes
        effect(() => {
            const theme = this.currentTheme();
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem(this.THEME_KEY, theme);

            // Update body styles transitions
            document.body.classList.add('theme-transitioning');
            setTimeout(() => document.body.classList.remove('theme-transitioning'), 300);
        });
    }

    toggleTheme(): void {
        this.currentTheme.update(t => t === 'light' ? 'dark' : 'light');
    }

    private getInitialTheme(): Theme {
        const saved = localStorage.getItem(this.THEME_KEY) as Theme;
        if (saved && (saved === 'light' || saved === 'dark')) return saved;

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}
