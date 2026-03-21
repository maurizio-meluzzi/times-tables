# TODO / Desired Features

---

## [ENGINE] Weighted deck — operazioni con pesi variabili

**Dipende da:** introduzione dello storage degli errori per sessione/storico.

### Contesto
L'engine attuale usa uno shuffled-deck uniforme: ogni operazione ha peso 1
e compare con la stessa frequenza. Quando sarà disponibile la mappa degli
errori (quante volte ogni operazione è stata sbagliata), dovrà essere
possibile aumentare il peso di quelle operazioni per proporle più spesso.

### Soluzione da implementare in `engine.js`

**1. Aggiungere una `Map` interna dei pesi**

```js
// chiave: "AxB", valore: intero >= 1
let _weights = new Map();
```

**2. Modificare `_buildOperationList(tables, maxFactor)` per rispettare i pesi**

```js
function _buildOperationList(tables, maxFactor) {
    const list = [];
    for (const t of tables) {
        for (let factor = 1; factor <= maxFactor; factor++) {
            const key = `${t}x${factor}`;
            const weight = _weights.get(key) ?? 1;
            const entry = { x: t, y: factor, result: t * factor,
                            resultDigits: String(t * factor).length };
            for (let w = 0; w < weight; w++) list.push(entry);
        }
    }
    return list;
}
```

**3. Aggiungere la funzione pubblica `setWeights(weightsMap)`**

```js
/**
 * Aggiorna i pesi delle operazioni e ricostruisce immediatamente il mazzo.
 * Può essere chiamata in qualsiasi momento tra una domanda e l'altra.
 *
 * @param {Object} weightsMap - es. { "6x7": 4, "3x8": 3, "4x9": 2 }
 *                              Le operazioni non presenti mantengono peso 1.
 */
export function setWeights(weightsMap) {
    _weights = new Map(Object.entries(weightsMap));
    _shuffledQueue = _shuffle(_buildOperationList(/* ... current tables & maxFactor */));
}
```

> **Nota:** per far funzionare il rebuild dentro `setWeights` sarà necessario
> salvare nello stato del modulo anche `_currentTables` e `_currentMaxFactor`
> (assegnati in `initEngine`), in modo da poter richiamare `_buildOperationList`
> senza ri-passare i parametri dall'esterno.

### Ciclo di vita atteso

```
initEngine(config)            ← inizio sessione
      ↓
generateOperation()           ← ogni domanda
      ↓
[risposta sbagliata]
      ↓
setWeights(errorMap)          ← error tracker aggiorna i pesi
      ↓
generateOperation()           ← le operazioni "pesanti" escono più spesso
```

### Nessun impatto sulle altre funzioni

| Funzione              | Cambia? |
|-----------------------|---------|
| `generateOperation()` | No      |
| `_shuffle()`          | No      |
| `initEngine()`        | Sì — salva tables e maxFactor nello stato del modulo |
| `_buildOperationList()` | Sì — loop peso |
| Aggiunta              | `setWeights()` |
