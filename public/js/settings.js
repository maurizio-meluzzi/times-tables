/*
 * Le Tabelline - Times Tables learning game for children
 * Copyright (C) 2025  Maurizio Meluzzi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * settings.js
 * Shared persistence module for game settings.
 * Single source of truth for reading and writing tt-settings from localStorage.
 */

const STORAGE_KEY = 'tt-settings';

export const DEFAULT_SETTINGS = Object.freeze({
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    maxFactor: 10,
    tickDuration: 1000,
});

/**
 * Load settings from localStorage, merging with defaults.
 * Never throws — returns defaults on any error.
 * @returns {{tables: number[], maxFactor: number, tickDuration: number}}
 */
export function loadSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULT_SETTINGS, tables: [...DEFAULT_SETTINGS.tables] };
        const parsed = JSON.parse(raw);
        return {
            tables: Array.isArray(parsed.tables) ? parsed.tables : [...DEFAULT_SETTINGS.tables],
            maxFactor: typeof parsed.maxFactor === 'number' ? parsed.maxFactor : DEFAULT_SETTINGS.maxFactor,
            tickDuration: typeof parsed.tickDuration === 'number' ? parsed.tickDuration : DEFAULT_SETTINGS.tickDuration,
        };
    } catch {
        return { ...DEFAULT_SETTINGS, tables: [...DEFAULT_SETTINGS.tables] };
    }
}

/**
 * Save settings to localStorage.
 * Never throws.
 * @param {{tables: number[], maxFactor: number, tickDuration: number}} settings
 */
export function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
        // localStorage unavailable (private browsing quota, etc.) — silently ignore
    }
}
