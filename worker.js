// TEMPORÄRE DEBUG-VERSION - zeigt bei falschem Login WARUM es fehlschlägt,
// ohne das Passwort im Klartext preiszugeben. Nach der Fehlersuche bitte
// wieder durch die normale Version ersetzen.

export default {
  async fetch(request, env) {
    const validUser = env.BASIC_AUTH_USER;
    const validPass = env.BASIC_AUTH_PASS;

    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Basic ")) {
      const decoded = atob(authHeader.slice(6));
      const sepIndex = decoded.indexOf(":");
      const enteredUser = decoded.slice(0, sepIndex);
      const enteredPass = decoded.slice(sepIndex + 1);

      if (enteredUser === validUser && enteredPass === validPass) {
        return env.ASSETS.fetch(request);
      }

      const debugInfo = [
        `env.BASIC_AUTH_USER gesetzt: ${validUser !== undefined}`,
        `env.BASIC_AUTH_PASS gesetzt: ${validPass !== undefined}`,
        `Eingegebener Benutzername: "${enteredUser}"`,
        `Erwarteter Benutzername:   "${validUser}"`,
        `Benutzername stimmt überein: ${enteredUser === validUser}`,
        `Länge eingegebenes Passwort: ${enteredPass.length}`,
        `Länge erwartetes Passwort:   ${validPass ? validPass.length : "n/a"}`,
        `Passwort stimmt überein (getrimmt): ${enteredPass.trim() === (validPass || "").trim()}`,
      ].join("\n");

      return new Response("Zugriff verweigert (Debug-Info):\n\n" + debugInfo, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    return new Response("Zugriff verweigert.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Krypto Portfolio", charset="UTF-8"',
      },
    });
  },
};
