export type AnoRow = {
  ano: number;
  total: number;
  aprovados: number;
  nota_corte_media: number | null;
  total_curso: number;
};

export type Opcoes = {
  campuses: string[];
  turnos: string[];
  graus: string[];
  modalidades: string[];
};

export type Resultado = {
  rows: AnoRow[];
  resumo: { total: number; aprovados: number; taxa: number } | null;
};

export type SelectOption = { label: string; value: string };
