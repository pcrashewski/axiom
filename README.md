# Opifex — strona portfolio

Strona portfolio/wizytówka, zbudowana na Astro 4 + Tailwind CSS, gotowa do hostowania
na Cloudflare Pages.

## Stack

- [Astro 4](https://astro.build) (output: `static`)
- Tailwind CSS — paleta i fonty zdefiniowane w `tailwind.config.mjs`
- Fonty self-hosted: [Fraunces](https://fonts.google.com/specimen/Fraunces) (nagłówki) +
  [Work Sans](https://fonts.google.com/specimen/Work+Sans) (treść), przez `@fontsource`
- Cloudflare Pages Function (`/functions/api/contact.ts`) obsługująca formularz kontaktowy

## Rozwój lokalny

```bash
npm install
npm run dev
```

Strona dostępna pod `http://localhost:4321`.

## Build

```bash
npm run build
```

Wynik trafia do katalogu `dist/`.

## Wdrożenie na Cloudflare Pages

1. Wypchnij repozytorium na GitHub.
2. W panelu Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** i wybierz
   to repozytorium.
3. Ustawienia builda:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Po pierwszym deployu podłącz domenę w **Custom domains**.

Każdy push do `main` tworzy nowy deploy produkcyjny; każdy pull request / inna gałąź
dostaje własny **preview URL** — to jest adres podglądowy wspomniany w sekcji "Proces".

## Zanim opublikujesz — lista rzeczy do podmiany

- **Domena:** w `astro.config.mjs` podmień `site: 'https://opifex.pl'` na rzeczywistą
  domenę (wpływa na `sitemap.xml` i tagi OG).
- **Realizacje:** w `src/components/Portfolio.astro` placeholdery `SiteMockup` zastąp
  realnymi screenshotami (np. `<img>` w `src/assets` + `astro:assets`).
- **Umowa:** dodaj plik `public/umowa-opifex.pdf` — link na `/umowa` już na niego wskazuje.
- **Dane kontaktowe / treści:** sprawdź teksty w `src/components/*.astro` — cennik,
  opisy realizacji i proces są oparte na ustaleniach z briefu, ale warto przejrzeć
  przed publikacją.

## Formularz kontaktowy

Formularz działa od razu (przekierowanie + komunikat potwierdzenia), ale wysyłka maila
wymaga konfiguracji zmiennych środowiskowych w **Cloudflare Pages → Settings →
Environment variables**:

| Zmienna | Wymagana | Opis |
|---|---|---|
| `RESEND_API_KEY` | tak, do wysyłki maila | Klucz API z [resend.com](https://resend.com) (darmowy plan wystarcza na start) |
| `CONTACT_TO` | tak | Adres, na który mają trafiać zapytania |
| `CONTACT_FROM` | tak | Adres "od" — musi pochodzić ze zweryfikowanej domeny w Resend |
| `PUBLIC_TURNSTILE_SITE_KEY` | opcjonalnie | Klucz publiczny [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) — ochrona antyspamowa |
| `TURNSTILE_SECRET_KEY` | opcjonalnie | Klucz tajny Turnstile (do weryfikacji po stronie funkcji) |

Bez tych zmiennych formularz nadal działa (zgłoszenie nie zniknie w nicość — możesz
np. odczytać dane z logów Pages Functions), ale mail nie zostanie wysłany. Pole
`company` w formularzu to honeypot — nie usuwaj go, jest niewidoczne dla użytkowników
i odsiewa proste boty.

## Struktura projektu

```
src/
├── components/      # sekcje strony (Hero, Services, Portfolio, Process, Pricing, Contact)
├── layouts/          # Layout.astro — head, meta, schema.org
├── pages/            # index.astro, umowa.astro
└── styles/           # global.css — Tailwind + fonty + komponenty (.btn-primary itd.)
functions/api/        # Cloudflare Pages Function — formularz kontaktowy
```
