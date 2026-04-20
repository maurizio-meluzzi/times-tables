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
 * instructions.js
 * Entry point for instructions.html.
 * Initialises i18n and wires up the flag language selector.
 */

import { init, setLanguage } from './i18n/i18n.js';

const activeLang = await init();
initFlagSelector(activeLang);

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
