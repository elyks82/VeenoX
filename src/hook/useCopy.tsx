import { useCallback, useState } from "react";

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    if (!navigator.clipboard) {
      setError("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setError(null);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (err) {
      console.error("Failed to copy: ", err);
      setError("Failed to copy");
      setIsCopied(false);
      return false;
    }
  }, []);

  return { copyToClipboard, isCopied, error };
};
