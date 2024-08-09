export interface FuturesAssetFetchProps {
  success: boolean;
  timestamp: number;
  data: {
    rows: [
      {
        symbol: string;
        index_price: number;
        mark_price: number;
        sum_unitary_funding: number;
        est_funding_rate: number;
        last_funding_rate: number;
        next_funding_time: number;
        open_interest: string;
        "24h_open": number;
        "24h_close": number;
        "24h_high": number;
        "24h_low": number;
        "24h_amount": number;
        "24h_volume": number;
      }
    ];
  };
}

export interface FuturesAssetProps {
  symbol: string;
  index_price: number;
  mark_price: number;
  sum_unitary_funding: number;
  est_funding_rate: number;
  last_funding_rate: number;
  next_funding_time: number;
  open_interest: string;
  "24h_open": number;
  "24h_close": number;
  "24h_high": number;
  "24h_low": number;
  "24h_amount": number;
  "24h_volume": number;
}

export interface TradesProps {
  side: string;
  price: number;
  size: number;
  ts: number;
}

export interface CustomBarProps {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BarsSymbolInfoProps {
  base_name: string[];
  data_status: string;
  description: string;
  exchange: string | undefined;
  full_name: string;
  has_intraday: boolean;
  intraday_multipliyers: string[];
  legs: string[];
  minmov: number;
  name: string;
  pricescale: number;
  pro_name: string;
  session: string;
  supported_resolution: string[];
  ticker: string;
  type: string;
  volume_precision: number;
}
