# Moto Wektor — strona (szablon)

Statyczna, wielostronicowa witryna producenta zabudów do aut dostawczych
(Bielsko-Biała). Wersja szablonowa: layout, treść i animacje gotowe, miejsca na
zdjęcia oznaczone placeholderami.

## Strony
| Plik | Strona |
|---|---|
| `index.html` | Strona główna (hero, oferta, proces, realizacje, konfigurator, kontakt) |
| `oferta.html` | Pełna oferta zabudów (sekcje per typ) |
| `realizacje.html` | Galeria realizacji |
| `o-firmie.html` | O firmie + serwis / gwarancja / certyfikaty |
| `konfigurator.html` | Konfigurator — „wkrótce" (placeholder) |
| `kontakt.html` | Kontakt: dane, formularz, miejsce na mapę |

Wspólne zasoby: `assets/css/style.css`, `assets/css/fonts.css`, `assets/js/main.js`,
`assets/js/lenis.min.js`, `assets/fonts/*.woff2`.

## Podgląd — wystarczy otworzyć plik
Strona jest **w pełni samodzielna** (czcionki, biblioteki, style i skrypty są lokalnie),
więc **nie trzeba uruchamiać żadnego serwera**:

- Kliknij dwukrotnie `index.html` (otworzy się w przeglądarce jako `file://`).
- Działa też bez internetu — żadnych zależności z CDN.

Serwer `python -m http.server 5577` jest opcjonalny (przydaje się tylko do testów na
telefonie w tej samej sieci); nie jest wymagany do normalnego oglądania.

## Jak dodać zdjęcia
Każdy placeholder to element `<div class="ph"></div>` (na ciemnym tle `<div class="ph ph--dark"></div>`).
Wstawiając zdjęcie, zamień go na:
```html
<img src="assets/img/nazwa.jpg" alt="Opis zabudowy" loading="lazy" width="…" height="…">
```
Podawaj `width`/`height` (lub `aspect-ratio`), żeby uniknąć przeskoków układu.
Hero korzysta z `.hero__media .ph` — tam najlepiej wstawić mocne zdjęcie produktu.

## Do uzupełnienia przez klienta
- Realne dane kontaktowe (telefon, e-mail, adres, godziny) — obecnie placeholdery `000`.
- Backend formularza (wysyłka maila / integracja) — formularz jest dziś demonstracyjny.
- Osadzenie mapy Google na stronie kontaktu.
- Zdjęcia realizacji i logotypy podwozi.

Szczegóły systemu projektowego: `DESIGN.md`.
