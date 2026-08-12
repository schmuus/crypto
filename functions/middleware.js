// Cloudflare Pages Function – läuft VOR jeder Anfrage an die Seite.
// Fragt HTTP Basic Auth ab (nativer Browser-Login-Dialog).
// Ohne korrektes Passwort wird KEIN Inhalt ausgeliefert (auch kein Quellcode).
//
// Benutzername/Passwort werden NICHT hier im Code eingetragen, sondern als
// Umgebungsvariablen im Cloudflare-Dashboard hinterlegt (siehe Anleitung).

export async function onRequest(context) {
  const { request, env } = context;

  const validUser = env.BASIC_AUTH_USER;
  const validPass = env.BASIC_AUTH_PASS;

  const authHeader = request.headers.get("Authorization");

  if (authHeader && authHeader.startsWith("Basic ")) {
    const encoded = authHeader.slice(6);
    const decoded = atob(encoded); // "user:pass"
    const sepIndex = decoded.indexOf(":");
    const user = decoded.slice(0, sepIndex);
    const pass = decoded.slice(sepIndex + 1);

    if (user === validUser && pass === validPass) {
      return context.next(); // Zugriff erlaubt, Seite wird normal ausgeliefert
    }
  }

  // Kein oder falsches Passwort -> Login-Dialog anfordern
  return new Response("Zugriff verweigert.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Krypto Portfolio", charset="UTF-8"',
    },
  });
}
