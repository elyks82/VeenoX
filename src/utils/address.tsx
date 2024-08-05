export const addressSlicer = (address: `0x${string}` | undefined) => {
  return address?.slice(0, 6) + "..." + address?.slice(-4);
};
