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
 * settings-page.js
 * Entry point for settings.html.
 * Initialises i18n, loads current settings, wires up controls, and auto-saves on change.
 */

import { init as initI18n, setLanguage } from './i18n/i18n.js';
import { loadSettings, saveSettings } from './settings.js';

// Initialise i18n and language selector
const activeLang = await initI18n();
initFlagSelector(activeLang);

// Initialise settings controls
initSettingsControls();

// ─── Language selector ────────────────────────────────────────────────────────

function initFlagSelector(activeLang) {
    const flags = document.querySelectorAll('[data-lang]');
    flags.forEach(flag => {
        if (flag.dataset.lang === activeLang) {
            flag.classList.add('active');
        }
        flag.addEventListener('click', async () => {
            flags.forEach(f => f.classList.remove('active'));
            flag.classList.add('active');
            await setLanguage(flag.dataset.lang);
        });
    });
}

// ─── Settings controls ────────────────────────────────────────────────────────

function initSettingsControls() {
    const settings = loadSettings();

    // --- Checkboxes: tabelline abilitate ---
    const checkboxes = document.querySelectorAll('input[data-table]');
    checkboxes.forEach(cb => {
        const tableNum = parseInt(cb.dataset.table, 10);
        cb.checked = settings.tables.includes(tableNum);
        cb.addEventListener('change', handleTableChange);
    });

    // --- Radio buttons: maxFactor ---
    const radios = document.querySelectorAll('input[name="maxFactor"]');
    radios.forEach(radio => {
        radio.checked = parseInt(radio.value, 10) === settings.maxFactor;
        radio.addEventListener('change', handleMaxFactorChange);
    });

    // --- Slider: tickDuration ---
    const slider = document.getElementById('tick-duration');
    const sliderLabel = document.getElementById('tick-duration-value');
    slider.value = settings.tickDuration;
    sliderLabel.textContent = settings.tickDuration;
    slider.addEventListener('input', () => {
        sliderLabel.textContent = slider.value;
    });
    slider.addEventListener('change', handleTickDurationChange);

    // --- Checkbox: weighted mode ---
    const weightedToggle = document.getElementById('weighted-toggle');
    weightedToggle.checked = settings.weighted;
    weightedToggle.addEventListener('change', handleWeightedChange);
}

// ─── Event handlers ───────────────────────────────────────────────────────────

function handleTableChange(event) {
    const checkbox = event.target;
    const settings = loadSettings();

    if (!checkbox.checked) {
        // Validate: at least one table must remain enabled
        const checkedBoxes = Array.from(
            document.querySelectorAll('input[data-table]')
        ).filter(cb => cb.checked);

        if (checkedBoxes.length === 0) {
            // Re-check this box and show warning
            checkbox.checked = true;
            showTablesWarning();
            return;
        }
    }

    hideTablesWarning();

    // Build new tables array from current checkbox state
    settings.tables = getCheckedTables();
    saveSettings(settings);
}

function handleMaxFactorChange(event) {
    const settings = loadSettings();
    const maxFactor = parseInt(event.target.value, 10);
    settings.maxFactor = maxFactor;

    // Automatism: force required table checkboxes on
    if (maxFactor >= 11) {
        forceTableChecked(11);
    }
    if (maxFactor >= 12) {
        forceTableChecked(12);
    }

    settings.tables = getCheckedTables();
    saveSettings(settings);
}

function handleTickDurationChange(event) {
    const settings = loadSettings();
    settings.tickDuration = parseInt(event.target.value, 10);
    saveSettings(settings);
}

function handleWeightedChange(event) {
    const settings = loadSettings();
    settings.weighted = event.target.checked;
    saveSettings(settings);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCheckedTables() {
    return Array.from(document.querySelectorAll('input[data-table]'))
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.dataset.table, 10));
}

function forceTableChecked(tableNum) {
    const cb = document.querySelector(`input[data-table="${tableNum}"]`);
    if (cb) cb.checked = true;
}

function showTablesWarning() {
    const warning = document.getElementById('tables-min-warning');
    if (warning) warning.hidden = false;
}

function hideTablesWarning() {
    const warning = document.getElementById('tables-min-warning');
    if (warning) warning.hidden = true;
}
