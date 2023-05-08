# Anleitungen

Anmerkung: Anführungszeigen (") nicht mit eingeben, außer es steht explizit dabei!

## Anleitung Update

### Update Visualisierung

1. PowerShell öffnen
2. "`cd `" eingeben (nicht Enter drücken)
3. Ordner von Desktop "map-react" in PowerShell Fenster ziehen
4. Enter drücken
5. "`git pull`"
6. "`pnpm i`"
7. "`pnpm build`"

### Update Server

1. Im Ordner serial-bridge auf dem Desktop die Datei "identifiers.json" kopieren und woanders speichern
2. PowerShell öffnen
3. "`cd `" eingeben (nicht Enter drücken)
4. Ordner von Desktop "serial-bridge" in PowerShell Fenster ziehen
5. Enter drücken
6. "`git add .`"
7. "`git stash`" (ggf Enter drücken bis Hinweis weggeht)
8. "`git pull`"
9. "`pnpm i`"
10. Datei "identifiers.json" wieder in Ordner ziehen

## Start

1. PowerShell öffnen
2. "`cd `" eingeben (nicht Enter drücken)
3. Ordner von Desktop "serial-bridge" in PowerShell Fenster ziehen
4. Enter drücken
5. "`pnpm start`"
