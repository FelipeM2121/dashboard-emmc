export interface EMMCItem {
  item: string;
  tipo: string;       // EMMC | MnC
  servicio: string;
  piso: string;
  familia: string;
  nombre: string;
  cantidad: number;
  planAdq: string;
  planInst: string;
  proveedor: string;
  fchasRecinto: string;
  inicio: string;
  termino: string;
  entrenamiento: string;
  fchaPruebas: string;
  fchaRecepcion: string;
  _rawIndex: number;
}

export interface NameQty {
  name: string;
  qty: number;
}

export interface FechaStats {
  totalConFecha: number;
  fechaMin: string;
  fechaMax: string;
  totalMeses: number;
  totalSemanas: number;
}

export interface SummaryData {
  totalItems: number;
  totalQty: number;
  uniqueServicios: number;
  uniqueProveedores: number;
  uniqueFamilias: number;
  uniquePisos: number;
  byServicio: NameQty[];
  byProveedor: NameQty[];
  byFamilia: NameQty[];
  byPiso: NameQty[];
  byMes: NameQty[];
  bySemana: NameQty[];
  byDia: NameQty[];
  fechaStats: FechaStats;
}

export interface AppState {
  status: 'loading' | 'ready' | 'error';
  error?: string;
  items: EMMCItem[];
  summary: SummaryData;
  headers: string[];
  gasUrl: string;
  updated: string;
  changes: Record<string, string>;
}
