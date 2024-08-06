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
