import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/shadcn/dialog";
import { formatSymbol, getFormattedDate } from "@/utils/misc";
import { useEffect, useRef, useState } from "react";

export const PosterModal = ({ order }) => {
  console.log(order);
  const data = {
    side: order.position_qty > 0 ? "LONG" : "SHORT",
    symbol: formatSymbol(order.symbol),
    leverage: 20,
    price: 12.241,
    markPrice: 12.383,
    time: getFormattedDate(order.timestamp),
    amount: order.position_qty,
  };
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 675;

    const drawPoster = async () => {
      // Fond
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#001a2c");
      gradient.addColorStop(1, "#003355");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grille
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Texte principal
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "#00ffff";
      ctx.textAlign = "left";
      ctx.fillText(
        `${data.side} | ${data.symbol} | ${data.leverage}X`,
        50,
        100
      );

      // Pourcentage
      ctx.font = "bold 120px Arial";
      const pnlPercentage = (
        ((data.markPrice - data.price) / data.price) *
        100 *
        (data.side === "LONG" ? 1 : -1)
      ).toFixed(2);
      ctx.fillText(
        `${Number(pnlPercentage) > 0 ? "+" : ""}${pnlPercentage}%`,
        50,
        250
      );

      // Informations supplémentaires
      ctx.font = "24px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText(`Open price: ${data.price}`, 50, 350);
      ctx.fillText(
        `Opened at: ${new Date(data.time).toLocaleString()}`,
        50,
        400
      );
      ctx.fillText(`Mark price: ${data.markPrice}`, 50, 450);
      ctx.fillText(`Quantity: ${data.amount}`, 50, 500);

      // Logo IBX
      ctx.font = "bold 36px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("IBX", 50, canvas.height - 50);

      // Liens sociaux
      ctx.font = "18px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText("DISCORD.GG/VEENOX", 150, canvas.height - 70);
      ctx.fillText("X.COM/VEENOX_XYZ", 150, canvas.height - 40);

      ctx.fillStyle = "#00ffff";
      ctx.fillRect(canvas.width - 250, canvas.height - 70, 200, 40);
      ctx.fillStyle = "#000000";
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.borderRadius = "20px";
      ctx.fillText("veenox.xyz", canvas.width - 150, canvas.height - 45);

      setImageUrl(canvas.toDataURL());
    };

    drawPoster();
  }, [data]);

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.download = "trading_poster.png";
    link.href = imageUrl;
    link.click();
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button>Preview</button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] w-auto h-auto max-h-[90vh] flex flex-col gap-0 overflow-auto">
        <DialogHeader>
          <DialogTitle className="pb-5">Trading Poster</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {imageUrl && (
            <>
              <img
                src={imageUrl}
                alt="Generated Trading Poster"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <button
                onClick={downloadImage}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Télécharger le poster
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
