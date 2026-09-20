/// <reference types="@cloudflare/workers-types" />

interface Env {
  // Wymagane do wysyłki maila przez Resend (https://resend.com) — ustaw w
  // Cloudflare Pages → Settings → Environment variables.
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  // Opcjonalnie: ochrona Cloudflare Turnstile
  TURNSTILE_SECRET_KEY?: string;
}

// Domyślny adres docelowy formularza — można nadpisać zmienną środowiskową CONTACT_TO.
const DEFAULT_CONTACT_TO = 'outtareach@gmail.com';

// Minimalny czas (ms) między wyrenderowaniem formularza a wysyłką — boty
// wypełniające i wysyłające formularz natychmiast są odrzucane.
const MIN_FILL_TIME_MS = 2000;

const redirectTo = (request: Request, search: string) => {
  const url = new URL(request.url);
  return Response.redirect(`${url.origin}/${search}`, 303);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const formData = await request.formData();

  // Honeypot — pole wypełniane tylko przez boty. Jeśli ma wartość, "udajemy"
  // sukces bez wysyłki maila.
  if (formData.get('company')) {
    return redirectTo(request, '?wyslano=1#kontakt');
  }

  // Pole czasowe — ustawiane przez skrypt przy wczytaniu formularza. Brak
  // pola lub zbyt szybka wysyłka oznacza wypełnienie przez bota.
  const loadedAt = Number(formData.get('loaded_at') ?? '');
  if (!loadedAt || Date.now() - loadedAt < MIN_FILL_TIME_MS) {
    return redirectTo(request, '?wyslano=1#kontakt');
  }

  // Weryfikacja Turnstile, jeśli skonfigurowana
  if (env.TURNSTILE_SECRET_KEY) {
    const token = formData.get('cf-turnstile-response');
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') ?? '',
      }),
    });
    const verifyData = (await verifyRes.json()) as { success: boolean };
    if (!verifyData.success) {
      return new Response('Weryfikacja nie powiodła się. Spróbuj ponownie.', { status: 400 });
    }
  }

  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '');
  const projectType = String(formData.get('project_type') ?? '');
  const tier = String(formData.get('tier') ?? '');
  const message = String(formData.get('message') ?? '');

  if (!name || !email || !message) {
    return new Response('Brakuje wymaganych pól.', { status: 400 });
  }

  const bodyText = [
    `Imię i nazwisko: ${name}`,
    `Email: ${email}`,
    `Typ projektu: ${projectType}`,
    `Pakiet: ${tier}`,
    '',
    'Wiadomość:',
    message,
  ].join('\n');

  // Wysyłka maila przez Resend. Jeśli zmienne nie są ustawione, formularz
  // i tak działa (przekierowanie), ale mail nie zostanie wysłany — przydatne
  // np. na etapie podglądu (preview URL).
  if (env.RESEND_API_KEY && env.CONTACT_FROM) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: env.CONTACT_TO || DEFAULT_CONTACT_TO,
        reply_to: email,
        subject: `Axiom — zapytanie od ${name}`,
        text: bodyText,
      }),
    });
  }

  return redirectTo(request, '?wyslano=1#kontakt');
};
