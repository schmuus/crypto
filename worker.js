// Standard Cloudflare Worker (nicht "Pages Functions"-Format) - läuft dank
// run_worker_first in wrangler.toml IMMER zuerst, bevor irgendeine statische
// Datei (index.html etc.) ausgeliefert wird.
//
// Benutzername/Passwort werden als Umgebungsvariablen im Cloudflare-Dashboard
// hinterlegt: BASIC_AUTH_USER und BASIC_AUTH_PASS (Settings > Variables and
// Secrets, für die "Production"-Umgebung).

export default {
  async fetch(request, env) {
    const validUser = env.BASIC_AUTH_USER;
    const validPass = env.BASIC_AUTH_PASS;

    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Basic ")) {
      const decoded = atob(authHeader.slice(6)); // "user:pass"
      const sepIndex = decoded.indexOf(":");
      const user = decoded.slice(0, sepIndex);
      const pass = decoded.slice(sepIndex + 1);

      if (user === validUser && pass === validPass) {
        // Zugriff erlaubt -> statische Datei (index.html etc.) ausliefern
        return env.ASSETS.fetch(request);
      }
    }

    // Kein oder falsches Passwort -> Login-Dialog anfordern
    return new Response("Zugriff verweigert.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Krypto Portfolio", charset="UTF-8"',
      },
    });
  },
};
