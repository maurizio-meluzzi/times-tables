/*
 * Le Tabelline - Times Tables learning game for children
 * Copyright (C) 2025  Maurizio Meluzzi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * i18n.js
 * Core internationalisation module.
 * Supported languages: 'it', 'en' (default/fallback).
 * Persistence key: 'tt-lang' in localStorage.
 */

const SUPPORTED = ['it', 'en'];

/**
 * Determine the language to use following the priority chain:
 * 1. localStorage value
 * 2. Browser language (first 2 chars)
 * 3. 'en' fallback
 * @returns {string} Two-letter language code.
 */
export function resolveLanguage() {
    const stored = localStorage.getItem('tt-lang');
    if (stored && SUPPORTED.includes(stored)) return stored;

    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(browser)) return browser;

    return 'en';
}

/**
 * Dynamically import the dictionary for the given language.
 * Falls back to 'en' if the import fails.
 * @param {string} lang
 * @returns {Promise<Object>} Dictionary object.
 */
export async function loadDictionary(lang) {
    try {
        const module = await import(`./${lang}.js`);
        return module.default;
    } catch (_) {
        const fallback = await import('./en.js');
        return fallback.default;
    }
}

/**
 * Walk the DOM and apply translated strings to every [data-i18n] element.
 * - <img>  → sets alt attribute.
 * - others → sets innerHTML.
 * - page.title.* keys → also updates document.title.
 * @param {Object} dict
 */
export function applyTranslations(dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (!(key in dict)) return;

        const value = dict[key];

        if (el.tagName === 'IMG') {
            el.alt = value;
        } else {
            el.innerHTML = value;
        }

        if (key === 'page.title.landing' || key === 'page.title.game') {
            document.title = value;
        }
    });
}

/**
 * Persist a language choice and immediately apply it.
 * @param {string} lang
 * @returns {Promise<void>}
 */
export async function setLanguage(lang) {
    localStorage.setItem('tt-lang', lang);
    const dict = await loadDictionary(lang);
    applyTranslations(dict);
}

/**
 * Bootstrap i18n: resolve language, load dictionary, apply translations.
 * @returns {Promise<string>} The resolved language code.
 */
export async function init() {
    const lang = resolveLanguage();
    const dict = await loadDictionary(lang);
    applyTranslations(dict);
    return lang;
}
