/** Hoopline overview data: headline stats, and the repository tour (all text as [en, es]). */
export const STATS = [
  [210, "", "migrations", "migraciones"], [7, "", "Edge Functions", "Edge Functions"], [4, "", "languages", "idiomas"],
  [30, "", "feature modules", "módulos de funcionalidad"], [100, "+", "SQL test files", "ficheros de test SQL"], [8, "", "CI checks", "comprobaciones de CI"]
];

export const TOUR = [
  { p: "lib/", st: ["220+ Dart files · 30 modules", "220+ ficheros Dart · 30 módulos"],
    h: ["The Flutter app", "La app en Flutter"],
    d: ["One folder per domain (draft, market, league, duels, objectives, friends, store…), each with its own screens, widgets and logic. Only bootstrap lives in main.dart, and every string goes through the localization files, and a test stops untranslated text from slipping in.",
        "Una carpeta por dominio (draft, mercado, liga, duelos, objetivos, amigos, tienda…), cada una con sus pantallas, widgets y lógica. En main.dart solo hay arranque, y todas las cadenas pasan por los ficheros de localización, y un test impide que se cuele texto sin traducir."] },
  { p: "supabase/migrations/", st: ["210 numbered migrations", "210 migraciones numeradas"],
    h: ["The game itself, in SQL", "El juego en sí, en SQL"],
    d: ["Simulation, auctions, economy, seasons and playoffs are SQL functions and scheduled jobs, written as numbered migrations. SCHEMA_NOTES.md explains the calls that are not obvious.",
        "La simulación, las subastas, la economía, las temporadas y los playoffs son funciones SQL y tareas programadas, escritas como migraciones numeradas. SCHEMA_NOTES.md explica las decisiones poco obvias."] },
  { p: "supabase/functions/", st: ["7 Edge Functions", "7 Edge Functions"],
    h: ["What Postgres should not do", "Lo que Postgres no debe hacer"],
    d: ["Verifying signed AdMob rewards, the RevenueCat webhook that grants purchases, push notifications, purchase emails, the player and stats syncs, and revoking Sign in with Apple when an account is deleted.",
        "Verificar las recompensas firmadas de AdMob, el webhook de RevenueCat que concede las compras, las notificaciones push, los emails de compra, las sincronizaciones de jugadores y estadísticas, y revocar Sign in with Apple al borrar una cuenta."] },
  { p: "supabase/tests/", st: ["100+ SQL test files", "100+ ficheros de test SQL"],
    h: ["Where the tests are deepest", "Donde los tests son más profundos"],
    d: ["A numbered SQL suite that checks invariants instead of fixed values and plays a full league from draft to Finals. Most of the bugs this project has had were in SQL, so this is where the safety net is thickest.",
        "Una suite SQL numerada que comprueba invariantes en vez de valores fijos y juega una liga completa del draft a las Finales. La mayoría de los bugs de este proyecto han estado en SQL, así que aquí la red de seguridad es más gruesa."] },
  { p: "test/ + tool/", st: ["90+ test files · 2 guardrails", "90+ ficheros de test · 2 barreras"],
    h: ["A contract between Dart and SQL", "Un contrato entre Dart y SQL"],
    d: ["Dart tests, plus one that reads schema.sql and checks every database function the client calls: that it exists, its arguments, and the required ones. Two guardrails stop untranslated strings and test coverage from slipping.",
        "Tests de Dart, y uno que lee schema.sql y comprueba cada función de la base de datos que llama el cliente: que existe, sus argumentos y los obligatorios. Dos barreras impiden que se escapen cadenas sin traducir o que baje la cobertura."] },
  { p: "check.sh · codemagic.yaml", st: ["8 checks, same as CI", "8 comprobaciones, las mismas que en CI"],
    h: ["One command, same as CI", "Un comando, igual que el CI"],
    d: ["One script runs on a laptop the same eight checks as CI. It runs all of them instead of stopping at the first failure, and a check it could not run does not count as a pass.",
        "Un script ejecuta en el portátil las mismas ocho comprobaciones que el CI. Las ejecuta todas en vez de parar en el primer fallo, y una comprobación que no ha podido ejecutarse no cuenta como superada."] },
  { p: "DESIGN.md", st: ["a design guide", "una guía de diseño"],
    h: ["Color has to mean something", "El color tiene que significar algo"],
    d: ["A guide detailed enough to build a screen without asking anyone. My favorite rule: the accent color is only ever “the one thing to act on”, never decoration.",
        "Una guía lo bastante detallada como para construir una pantalla sin preguntar a nadie. Mi regla favorita: el color de acento es siempre “lo único sobre lo que actuar”, nunca decoración."] }
];
