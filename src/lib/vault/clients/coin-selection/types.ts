export interface Input {
  address?: string;
  txid: string;
  hash?: Buffer | string;
  vout: number;
  hex?: string;
  // Set for taproot script-path spends: depth of the spent leaf in the script tree
  scriptPathDepth?: number;
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
