import { Caixa } from "./caixa";

export class Cliente{
  id?: number;
  nome?: string;
  cnpj?: string;
  endereco?: string;
  caixas?: Caixa[];
}