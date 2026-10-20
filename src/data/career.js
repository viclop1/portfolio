/** Career timeline. Each span is bilingual as [en, es]; `to` of the current job tracks today. */
const NOW = new Date();
export const NOWV = NOW.getFullYear() + (NOW.getMonth() + 1) / 12;
/** Fractional year for a (year, zero-based month) pair. */
export function fr(y, m) { return y + m / 12; }

export const SPANS = [
  { id: "gr", name: "Gamereactor.dk", from: fr(2015, 3), to: fr(2015, 6), child: false,
    role: ["Software developer intern", "Desarrollador de software en prácticas"],
    sum: ["Website maintenance and development, including migrating an existing MySQL data access layer to PDO. Daily collaboration with the team in Denmark, in English.", "Mantenimiento y desarrollo web, incluida la migración de una capa de acceso a datos MySQL a PDO. Colaboración diaria en inglés con el equipo de Dinamarca."],
    tech: ["MySQL", "PDO"], loc: "Ciudad Real" },
  { id: "ae", name: "Aerín Sistemas", from: fr(2015, 8), to: fr(2017, 7), child: false,
    role: ["Junior developer", "Desarrollador junior"],
    sum: ["Real-time tools, monitoring applications and database solutions across backend and frontend, building data-driven applications.", "Herramientas en tiempo real, aplicaciones de monitorización y soluciones de base de datos en backend y frontend, creando aplicaciones basadas en datos."],
    tech: ["Python", "Django", "Node.js", "JavaScript", "AngularJS", "SQL", "HTML5", "jQuery"], loc: "Madrid" },
  { id: "ru", name: "Ruybesa", from: fr(2017, 6), to: fr(2019, 3), child: false,
    role: ["Web developer", "Desarrollador web"],
    sum: ["Systems for large-scale distribution of digital content to devices installed at major customers, including scheduling and delivery of advertising campaigns.", "Sistemas para la distribución a gran escala de contenido digital a dispositivos instalados en grandes clientes, incluida la programación y entrega de campañas publicitarias."],
    tech: ["Node.js", "JavaScript", "jQuery", "HTML", "CSS", "Gulp", "Mercurial"], loc: "Madrid" },
  { id: "sn", name: "SNIPPET", from: fr(2019, 4), to: fr(2020, 10), child: false, group: true,
    role: ["Full Stack Developer, then Technical Project Lead", "Full Stack Developer y después Technical Project Lead"],
    sum: ["Eighteen months that took me from building features to owning the technical direction of a product.", "Dieciocho meses que me llevaron de construir funcionalidades a ser responsable de la dirección técnica de un producto."],
    tech: [], loc: "Madrid" },
  { id: "sf", name: "Full Stack Developer", from: fr(2019, 4), to: fr(2020, 1), child: true, parent: "SNIPPET",
    role: ["Full Stack Developer", "Full Stack Developer"],
    sum: ["Features across the stack, from backend services and APIs to frontend functionality, working closely with the team on new product features.", "Funcionalidades en todo el stack, desde servicios backend y APIs hasta frontend, trabajando de cerca con el equipo en nuevas funciones de producto."],
    tech: [], loc: "Madrid" },
  { id: "sl", name: "Technical Project Lead", from: fr(2020, 0), to: fr(2020, 10), child: true, parent: "SNIPPET",
    role: ["Technical Project Lead", "Technical Project Lead"],
    sum: ["Owned the technical direction, planning and delivery of Myme, a platform for personalized video campaigns. Made the key technical decisions, judged feasibility with the business team and coordinated several teams.", "Responsable de la dirección técnica, la planificación y la entrega de Myme, una plataforma de campañas de vídeo personalizadas. Tomé las decisiones técnicas clave, evalué la viabilidad con el equipo de negocio y coordiné a varios equipos."],
    tech: ["Myme"], loc: "Madrid" },
  { id: "cf", name: "CrowdFarming", from: fr(2020, 10), to: NOWV + 0.09, child: false, cur: true,
    role: ["Backend developer", "Backend developer"],
    sum: ["Backend services in Node.js, TypeScript and NestJS in a microservices and monorepo setup. Payments and subscriptions, e-commerce, internal tooling and farmer-facing products, with a focus on testing and performance.", "Servicios backend en Node.js, TypeScript y NestJS en un entorno de microservicios y monorepo. Pagos y suscripciones, e-commerce, herramientas internas y productos para agricultores, con foco en testing y rendimiento."],
    tech: ["Node.js", "TypeScript", "NestJS", "PostgreSQL", "MongoDB", "Redis", "AWS", "Jest"], loc: "España" }
];
