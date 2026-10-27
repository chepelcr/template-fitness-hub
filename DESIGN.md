# Fitness Hub — design plan

**Concept: Pista.** A running track. The hero is tartan red with white lane
lines that sweep in once along the photo's slanted cut; categories are the
lanes of the track; sessions show their duration as a scoreboard figure;
headlines run in condensed italics like a meet's start list.

Serves: gyms and studios, personal trainers, supplements and sportswear
shops, classes and plans sold as services.

## Palette

| Token | Hex | Role |
|---|---|---|
| tartan | `#C4432B` | the store's accent (org primary): hero, lanes, main buttons |
| tartan text | `#A93520` | the accent as text (offers, small labels) |
| lane white | `#F7F6F2` | page, lane lines |
| infield | `#E9E7E0` | quiet surfaces |
| stadium blue | `#1C3A6E` | scoreboard, footer, CTA block, demo notice |
| ink | `#22201E` | text |

Contrast (computed): ink on lane white 15.0:1 · soft ink `#5C5752` 6.6:1 ·
white on tartan 5.0:1 (all text on the track is white) · tartan text on lane
white 6.0:1 · white on stadium 11.2:1 · `#C9D3E3` on stadium 7.4:1. Tartan on
stadium is only 2.2:1, so buttons on blue are lane white, never tartan.

## Type

**Barlow Condensed** 700/800 italic for display and prices, **Barlow** for
text. Sentence case; no all-caps eyebrows, no monospace, no numbered lanes
(categories are not a sequence).

## Layout

```
HOME
┌ tartan ──────────────────────────────┬ /lane lines/ ┬─ photo (slant cut) ┐
│ Entrenamiento y equipo                │  sweep once  │                    │
│ Salí a la pista                       │              │                    │
│ [Ver catálogo] [Reservar una clase]   │              │                    │
└───────────────────────────────────────┴──────────────┴────────────────────┘
 Carriles: the track — one lane per category (colour marker, name,
           description, count), white lane lines between
 En la línea de salida: horizontal cards, two across; sessions carry a
           scoreboard (60 | minutos) from their own duration text
 benefits under a double lane rule · slanted story photo · blue CTA
CATALOG: tartan title band │ search + Filtros (sheet on phones) │ chips │
groups under a tartan rule, horizontal cards
PRODUCT: slanted photo over a lane rule │ name, price, scoreboard, text,
fact tiles (category, type, level, availability), add
```

## Signature

`LaneLines` draws the lanes in real pixels (measured with a ResizeObserver)
parallel to the `.slant` cut, and they sweep in once (staggered
stroke-dashoffset). They rest drawn, so they show wherever animation is off;
reduced motion shows them at once. Route changes wipe on a slant (view
transitions; core.css removes it under reduced motion). No WebGL.

## Changed from the generic default

- Left "near-black + acid green": tartan red on lane white with stadium blue.
- No stats strip or invented numbers: the only big figures are the store's
  own durations, split from its text.
- Horizontal cards instead of a square card grid.
