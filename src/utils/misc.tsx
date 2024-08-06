export const addressSlicer = (address: `0x${string}` | undefined) => {
  return address?.slice(0, 6) + "..." + address?.slice(-4);
};

export const formatSymbol = (symbol: string) => {
  const isPerp = symbol.includes("PERP");
  try {
    const formatted = symbol.replace("PERP", "").slice(1).replace("_", "/");
    if (isPerp) {
      return formatted;
    }
    return symbol;
  } catch (e) {
    return symbol;
  }
};
