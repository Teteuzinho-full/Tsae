export type Availability = "ABERTO" | "ESGOTADO" | "ENCERRADO" | "EM_BREVE"; // EM_BREVE: curso em preparação (sem turma definida)
// Turma que já aconteceu = ENCERRADO (prevalece); depois, esgotado manual; senão aberto.
export function availability(c: { soldOut?: boolean | null; startsAt?: Date | string | null }, now: Date = new Date()): Availability {
  if (c.startsAt && new Date(c.startsAt) < now) return "ENCERRADO";
  if (c.soldOut) return "ESGOTADO";
  return "ABERTO";
}
export const availabilityLabel: Record<Availability, string> = { ABERTO: "Inscrições abertas", ESGOTADO: "Esgotado", ENCERRADO: "Encerrado", EM_BREVE: "Em breve" };
export const rank: Record<Availability, number> = { ABERTO: 0, ESGOTADO: 1, ENCERRADO: 2, EM_BREVE: 3 };
