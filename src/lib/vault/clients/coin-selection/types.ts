export interface Input {
  address?: string;
  txid: string;
  hash?: Buffer | string;
  vout: number;
  hex?: string;
  value: number;
}

export interface Output {
  address?: string;
  value?: number;
}

export interface AlgorithmResult {
  inputs: Input[];
  outputs: Output[];
  fee: number;
}

export interface SelectionResult {
  inputs: Input[];
  outputs: Output[];
  fee: number;
  totalSatoshis: number;
  error?: string;
}
