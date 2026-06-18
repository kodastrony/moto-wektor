# Moto Wektor — system projektowy

Jasny, „branżowy" szablon wzorowany **strukturalnie** na carpol.pl i
nadwozia.autoboss.com.pl (układ sekcji, nawigacja, typy komponentów). Treść,
zdjęcia i identyfikacja są własne MotoWektora — to nie kopia tych stron.

## Motyw
Jasny (białe/stalowe tło), granat jako primary, **amber `#f7a30f`** jako akcent/CTA.
Dużo zdjęć (placeholdery `.ph`), sekcje na przemian białe / stalowe / granatowe.

## Kolory (tokeny w `assets/css/style.css`)
| Rola | Token | Wartość |
|---|---|---|
| Tło białe | `--white` | `#ffffff` |
| Tło stalowe (sekcje) | `--surface` | `#f5f7f9` |
| Sekcje ciemne / stopka / hero | `--navy-900` | `#0c2238` |
| Primary (granat) | `--navy` | `#173a5e` |
| Nagłówki | `--ink` | `#15212c` |
| Tekst stonowany (jasne tło) | `--muted` | `#586471` (≥4.5:1) |
| Akcent / CTA | `--amber` | `#f7a30f` |
| Tekst na amber | `--amber-ink` | `#1c1402` |

## Typografia
- **Display:** Archivo 700–900 (nagłówki). **Body:** Hanken Grotesk 400–600.
- Skala `clamp()` (`--fs-hero` … `--fs-xs`). `text-wrap: balance` na nagłówkach.

## Struktura strony głównej (z carpol + auto-boss)
1. Topbar — telefon, e-mail, godziny, przełącznik PL/EN/DE.
2. Header (sticky, biały) — logo, nav, „Zapytaj o wycenę".
3. Hero — zdjęcie w tle + overlay, slogan, 2× CTA, wskaźnik „przewiń".
4. Pasek USP (amber) — 4 atuty z ikonami.
5. Wstęp / misja — tekst + zdjęcie.
6. Kategorie — siatka kart z numerami (`.cat-grid` / `.cat-card`).
7. Podwozia — siatka logotypów marek (`.partners__grid`).
8. „Dlaczego my" (granat) — karty zaufania (`.trust-card`) + liczniki (`.stat`).
9. Produkcja — układ dwóch zdjęć + lista (`.split`).
10. Realizacje — galeria (`.gallery` / `.shot`).
11. Oś czasu — historia firmy (`.timeline`, przewijana poziomo).
12. Pasek konfiguratora (`.config-band`, badge „WKRÓTCE").
13. Kontakt — dane + formularz (`.contact-grid`).
14. Footer (granat) — kolumny + odznaki certyfikatów.

Podstrony używają `.page-hero` (zdjęcie + overlay) i tego samego topbara/headera/stopki.

## Komponenty kluczowe
`.btn` / `.btn--navy` / `.btn--outline`, `.cat-card`, `.trust-card`, `.partners__cell`,
`.split`, `.gallery/.shot`, `.timeline/.tl-item`, `.config-band`, `.form`, `.ph` (placeholder zdjęć).

## Ruch / animacje
- Smooth scroll **Lenis** (CDN), wyłączany przy `prefers-reduced-motion`.
- Reveal: `data-reveal` / `data-reveal-stagger` + IntersectionObserver.
  Treść widoczna bez JS — animacja tylko wzbogaca (brak pustych bloków).
- Hero: staggered load (`animation-delay`). Liczniki `data-count`. Hover na kartach.
- Pełna obsługa `@media (prefers-reduced-motion: reduce)`.

## Responsywność
Breakpointy 1024 / 860 / 540 px. < 860 px: menu hamburger; siatki → 1–2 kolumny.

## Gdzie wstawiać zdjęcia
Każdy `<div class="ph"></div>` to placeholder — patrz `README.md` (sekcja „Jak dodać zdjęcia").
