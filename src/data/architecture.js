/** Hoopline architecture explorer: diagram nodes (SVG coordinates) and the user flows that walk through them. */
export const NODES = {
  app:      { x: 20,  y: 197, w: 150, h: 68, l: "Flutter app", s: "iOS · Android" },
  signin:   { x: 225, y: 14,  w: 180, h: 46, l: "Google · Apple sign-in" },
  rc:       { x: 225, y: 84,  w: 180, h: 46, l: "RevenueCat" },
  store:    { x: 225, y: 154, w: 180, h: 46, l: "App Store · Google Play" },
  admob:    { x: 225, y: 262, w: 180, h: 46, l: "AdMob · UMP consent" },
  push:     { x: 225, y: 332, w: 180, h: 46, l: "FCM · APNs" },
  nba:      { x: 225, y: 402, w: 180, h: 46, l: "balldontlie" },
  auth:     { x: 490, y: 40,  w: 260, h: 44, l: "Auth" },
  edge:     { x: 490, y: 110, w: 260, h: 56, l: "Edge Functions", s: "Deno" },
  pg:       { x: 490, y: 194, w: 260, h: 92, l: "PostgreSQL", s: "game logic · RLS · RPC" },
  cron:     { x: 630, y: 312, w: 120, h: 44, l: "pg_cron" },
  cf:       { x: 830, y: 24,  w: 150, h: 56, l: "Cloudflare", s: "hooplinegm.com" },
  resend:   { x: 830, y: 116, w: 150, h: 44, l: "Resend" },
  posthog:  { x: 830, y: 190, w: 150, h: 44, l: "PostHog" },
  github:   { x: 20,  y: 470, w: 150, h: 50, l: "GitHub" },
  codemagic:{ x: 225, y: 470, w: 180, h: 50, l: "Codemagic" },
  asc:      { x: 490, y: 470, w: 280, h: 50, l: "App Store Connect · Play Console" }
};

export const FLOWS = [
  { id: "signup", en: "Sign up", es: "Registro", steps: [
    { a: "app", b: "signin", en: "The player picks Google or Apple, or types an email. Google returns an id_token, and Apple signs in natively on iOS.", es: "El jugador elige Google o Apple, o escribe un email. Google devuelve un id_token y Apple inicia sesión de forma nativa en iOS." },
    { a: "signin", b: "auth", en: "Supabase Auth checks the token and opens a session. Accounts link through a confirmed email.", es: "Supabase Auth comprueba el token y abre una sesión. Las cuentas se vinculan por email confirmado." },
    { a: "auth", b: "resend", en: "For email sign-ups, Auth sends the confirmation through my own SMTP on Resend, with branded templates in 4 languages.", es: "En los registros por email, Auth envía la confirmación por mi propio SMTP en Resend, con plantillas de marca en 4 idiomas." },
    { a: "resend", b: "cf", en: "The link in the email lands on hooplinegm.com/auth/confirm, served by Cloudflare.", es: "El enlace del email llega a hooplinegm.com/auth/confirm, servido por Cloudflare." },
    { a: "cf", b: "auth", en: "The page hands the confirmation back to Supabase Auth and the account is verified.", es: "La página devuelve la confirmación a Supabase Auth y la cuenta queda verificada." },
    { a: "app", b: "app", en: "The player is in. Row level security decides what each session can read and write.", es: "El jugador ya está dentro. La seguridad a nivel de fila decide qué puede leer y escribir cada sesión." }
  ]},
  { id: "bid", en: "Place a bid", es: "Hacer una puja", steps: [
    { a: "app", b: "pg", en: "The app calls a Postgres function over RPC with the Supabase client.", es: "La app llama a una función de Postgres por RPC con el cliente de Supabase." },
    { a: "pg", b: "pg", en: "The function checks the salary cap and the market rules under row level security, then stores the bid.", es: "La función comprueba el tope salarial y las reglas del mercado bajo seguridad a nivel de fila, y guarda la puja." },
    { a: "cron", b: "pg", en: "Every minute, pg_cron runs the market simulation and rival teams bid back.", es: "Cada minuto, pg_cron ejecuta la simulación del mercado y los equipos rivales pujan de vuelta." },
    { a: "pg", b: "edge", en: "When the player needs to know something, the send-notifications Edge Function runs.", es: "Cuando hay algo que el jugador debe saber, se ejecuta la Edge Function send-notifications." },
    { a: "edge", b: "push", en: "It sends through Firebase Cloud Messaging, and APNs delivers on iOS.", es: "Envía por Firebase Cloud Messaging, y APNs lo entrega en iOS." },
    { a: "push", b: "app", en: "The alert reaches the phone.", es: "La alerta llega al móvil." }
  ]},
  { id: "buy", en: "Buy a pack", es: "Comprar un pack", steps: [
    { a: "app", b: "store", en: "The player buys a gem pack or Premium through StoreKit on iOS or Google Play Billing on Android.", es: "El jugador compra un pack de gemas o Premium con StoreKit en iOS o Google Play Billing en Android." },
    { a: "store", b: "rc", en: "RevenueCat, through its Flutter SDK, validates the purchase.", es: "RevenueCat, con su SDK de Flutter, valida la compra." },
    { a: "rc", b: "edge", en: "RevenueCat calls my revenuecat-webhook Edge Function.", es: "RevenueCat llama a mi Edge Function revenuecat-webhook." },
    { a: "edge", b: "pg", en: "The function runs apply_revenuecat_event in Postgres, which grants the gems or Premium.", es: "La función ejecuta apply_revenuecat_event en Postgres, que concede las gemas o el Premium." },
    { a: "pg", b: "resend", en: "A scheduled job sends the purchase confirmation email through Resend.", es: "Una tarea programada envía el email de confirmación de la compra a través de Resend." },
    { a: "pg", b: "posthog", en: "pg_net reports the event to PostHog straight from the database.", es: "pg_net envía el evento a PostHog directamente desde la base de datos." }
  ]},
  { id: "ad", en: "Watch a reward ad", es: "Ver un anuncio con premio", steps: [
    { a: "app", b: "admob", en: "After the consent message (Google UMP, required in the EU), the app shows a rewarded ad.", es: "Tras el mensaje de consentimiento (Google UMP, obligatorio en la UE), la app muestra un anuncio con recompensa." },
    { a: "admob", b: "edge", en: "AdMob calls my admob-ssv Edge Function with a signed callback.", es: "AdMob llama a mi Edge Function admob-ssv con un callback firmado." },
    { a: "edge", b: "pg", en: "The function verifies the signature, and only then does Postgres grant the reward.", es: "La función verifica la firma, y solo entonces Postgres concede la recompensa." },
    { a: "pg", b: "app", en: "The app shows the new balance.", es: "La app muestra el nuevo saldo." }
  ]},
  { id: "nba", en: "Sync NBA stats", es: "Sincronizar estadísticas NBA", steps: [
    { a: "edge", b: "edge", en: "A weekly Edge Function runs the sync. The balldontlie key lives only as its secret, and shared secrets sit in Vault.", es: "Una Edge Function semanal ejecuta la sincronización. La clave de balldontlie vive solo como secreto suyo, y los secretos compartidos están en Vault." },
    { a: "edge", b: "nba", en: "It pulls real players, teams and stats from balldontlie.", es: "Descarga jugadores, equipos y estadísticas reales de balldontlie." },
    { a: "nba", b: "pg", en: "The data lands in Postgres, and player ratings follow real-world performance.", es: "Los datos llegan a Postgres, y las valoraciones de los jugadores siguen su rendimiento real." }
  ]},
  { id: "ship", en: "Ship a release", es: "Publicar una versión", steps: [
    { a: "github", b: "codemagic", en: "I start the ios-release workflow on Codemagic, built from the GitHub repository.", es: "Lanzo el workflow ios-release en Codemagic, construido desde el repositorio de GitHub." },
    { a: "codemagic", b: "asc", en: "Codemagic signs the build and uploads it to App Store Connect automatically.", es: "Codemagic firma el build y lo sube automáticamente a App Store Connect." },
    { a: "asc", b: "asc", en: "After review, the release goes on sale. iOS 1.0 did on 5 October 2026.", es: "Tras la revisión, la versión sale a la venta. La 1.0 de iOS lo hizo el 5 de octubre de 2026." }
  ]}
];
