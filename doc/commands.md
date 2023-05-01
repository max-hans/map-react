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
Prefix: x / y
Werte: -100 - 100
```

- Links: -> `x,-100`
- Rechts: -> `x,100`
- Hoch: -> `y,-100`
- Runter: -> `y,100`

### Zoom

```
Prefix: z
Werte: -100 bis 100
```

Beim Hereinzoomen wird Wert 1 geschickt, beim Herauszoome Wert 0

- Hereinzoomen: 100 -> `z,100`
- Herauszoomen: -100 -> `z,-100`
