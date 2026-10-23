/**
 * App Store screenshots of Hoopline GM (version 1.0.6), one set per store language.
 * Files live in public/screens/<lang>/<id>.webp. The order below is the order shown.
 * To drop a screenshot from the site, remove its id here.
 */
export const SCREEN_LANGS = ["en", "es", "fr", "de"];

/** Alt text per screenshot, as [en, es]. Order = the store order of version 1.0.6. */
export const SCREENS = [
  { id: "market",   alt: ["Player market with every bid in the open", "Mercado de jugadores con todas las pujas a la vista"] },
  { id: "home",     alt: ["Home with the odds of the next game and the squad rating", "Inicio con la probabilidad del próximo partido y la valoración de la plantilla"] },
  { id: "team",     alt: ["Starting five and roster", "Quinteto titular y plantilla"] },
  { id: "board",    alt: ["Tactics board: style, defense, pace and key player", "Pizarra táctica: estilo, defensa, ritmo y jugador clave"] },
  { id: "box",      alt: ["Result of a game with the factors that decided it", "Resultado de un partido con lo que lo decidió"] },
  { id: "playoffs", alt: ["Playoff bracket with the series of each round", "Cuadro de playoffs con las series de cada ronda"] },
  { id: "duels",    alt: ["Duels: today's rivals and their starting fives", "Duelos: los rivales de hoy y sus quintetos"] },
  { id: "cups",     alt: ["Ladder of cups against fictional clubs", "Escalera de copas contra clubes ficticios"] },
  { id: "table",    alt: ["League table with twelve teams", "Clasificación de la liga con doce equipos"] },
  { id: "season",   alt: ["Season summary with coins, trophies and league leaders", "Resumen de temporada con monedas, trofeos y líderes de la liga"] }
];
