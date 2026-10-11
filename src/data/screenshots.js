/**
 * App Store screenshots of Hoopline GM, one set per store language.
 * Files live in public/screens/<lang>/<id>.webp. The order below is the order shown.
 * To drop a screenshot from the site, remove its id here.
 */
export const SCREEN_LANGS = ["en", "es", "fr", "de"];

/** Alt text per screenshot, as [en, es]. */
export const SCREENS = [
  { id: "market", alt: ["Player market with every bid in the open", "Mercado de jugadores con todas las pujas a la vista"] },
  { id: "board",  alt: ["Tactics board: style, defense, pace and key player", "Pizarra táctica: estilo, defensa, ritmo y jugador clave"] },
  { id: "team",   alt: ["Starting five and roster", "Quinteto titular y plantilla"] },
  { id: "box",    alt: ["Box score of a finished game", "Estadísticas de un partido terminado"] },
  { id: "table",  alt: ["League table with twelve teams", "Clasificación de la liga con doce equipos"] },
  { id: "cups",   alt: ["Ladder of cups against fictional clubs", "Escalera de copas contra clubes ficticios"] },
  { id: "report", alt: ["End-of-season report", "Informe de final de temporada"] }
];

