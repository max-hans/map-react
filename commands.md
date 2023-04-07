# Commands

Alle Zahlenwerte müssen als Ganzzahlen übertragen werte. Kein Komma oder negative Zahlen!
Am Ende eines jeden Commands muss ein newline (\n) gesendet werden.

Alle Commands folgen diesem Schema:

```
[Command],[Wert]\n
```

Beispiel Arduino:

```C++
Serial.println("a,100");
```

## Werte

### Szenarien

Die wählbaren Szenarien

```
Prefix: s
Werte: 0-10 (?)
```

Beispiele:

- `s,10`
- `s,0`

### Historische Daten

```
Prefix: h
Werte: 0-1000
```

Die historischen Daten über die letzten Jahrzehnte. Die Werte müssen auf eine Range von 0-1000 gemapped werden.

Beispiel:

- frühester Zeitpunkt Januar 1950 -> Wert 0 -> `h,0`
- spätester Zeitpunkt Januar 2022 -> Wert 1 -> `h,1000`

### Navigation

```
Prefix: n
Werte: 0-3
```

Die Richtung wird auf die Zahlen von 0 bis 3 gemapped:

- Links: 0 -> `n,0`
- Rechts: 1 -> `n,1`
- Hoch: 2 -> `n,2`
- Runter: 3 -> `n,3`

### Zoom

```
Prefix: n
Werte: 0-10
```

Die Zoom-Stufen werden von 0 - 100 gemapped (wird später in realed Werte umgerechnet).

- Maximal herausgezoomed: 0 -> `z,0`
- Maximal hineingezoomed: 0 -> `z,100`
