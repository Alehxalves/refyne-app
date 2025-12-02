import { MOSCOW_LEVEL, CSD_LEVEL } from "@/lib/supabase/enums";

export const moscowLevelsPtBr: Record<MOSCOW_LEVEL, string> = {
  MUST: "Deve ter",
  SHOULD: "Deveria ter",
  COULD: "Poderia ter",
  WONT: "Não terá",
};

export const csdLevelsPtBr: Record<CSD_LEVEL, string> = {
  CERTAINTIES: "Certeza",
  SUPPOSITIONS: "Suposição",
  DOUBTS: "Dúvida",
};
