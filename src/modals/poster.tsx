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
  console.log("order", order);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState("/poster/4.webp");
  const data = {
    side: order.position_qty > 0 ? "LONG" : "SHORT",
    symbol: formatSymbol(order.symbol),
    leverage: 20,
    price: order.average_open_price,
    markPrice: order.mark_price,
    time: getFormattedDate(order.timestamp),
    amount: order.position_qty,
  };
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 675;

    const drawPoster = async () => {
      // Fond
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "rgb(20,20,20)");
      gradient.addColorStop(1, "#1B1D22");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grille
      ctx.strokeStyle = "rgb(17,17,17)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 200) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 200) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      ctx.font = "48px Poppins";
      ctx.fillStyle =
        data.side === "LONG" ? "rgb(14 203 129)" : "rgb(234 57 67)";
      ctx.textAlign = "left";
      ctx.fillText(data.side, 50, 100);

      const sideWidth = ctx.measureText(data.side).width;

      ctx.fillStyle = "rgb(255,255,255,0.4)";
      const pipeY = 100;
      ctx.fillText(" | ", 50 + sideWidth, pipeY);

      const pipeWidth1 = ctx.measureText(" | ").width;

      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillText(data.symbol, 50 + sideWidth + pipeWidth1, 100);

      const symbolWidth = ctx.measureText(data.symbol).width;

      ctx.fillStyle = "rgb(255,255,255,0.4)";
      ctx.fillText(" | ", 50 + sideWidth + pipeWidth1 + symbolWidth, pipeY);

      const pipeWidth2 = ctx.measureText(" | ").width;

      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillText(
        `${data.leverage}X`,
        50 + sideWidth + pipeWidth1 + symbolWidth + pipeWidth2,
        100
      );

      ctx.font = "bold 105px Poppins";
      const pnlPercentage = (
        ((data.markPrice - data.price) / data.price) *
        100 *
        (data.side === "LONG" ? 1 : -1)
      ).toFixed(2);
      ctx.fillStyle =
        Number(pnlPercentage) > 0 ? "rgb(14 203 129)" : "rgb(234 57 67)";
      ctx.fillText(
        `${Number(pnlPercentage) > 0 ? "+" : ""}${pnlPercentage}%`,
        50,
        240
      );

      const drawBicolorText = (label1, value1, label2, value2, x1, x2, y) => {
        ctx.font = "20px Poppins";
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText(label1, x1, y);
        ctx.fillText(label2, x2, y);

        ctx.font = "24px Poppins";
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText(value1, x1, y + 34);
        ctx.fillText(value2, x2, y + 34);
      };

      const x1 = 50;
      const x2 = 280;

      const ySpacing = 40;

      drawBicolorText(
        "Open price: ",
        data.price.toString(),
        "Opened at: ",
        data.time,
        x1,
        x2,
        320
      );

      drawBicolorText(
        "Mark price: ",
        data.markPrice.toString(),
        "Quantity: ",
        data.amount.toString(),
        x1,
        x2,
        370 + ySpacing
      );

      ctx.font = "bold 42px Poppins";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("VEENOX", 50, canvas.height - 44);

      ctx.font = "18px Poppins";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";

      //   const text1 = "DISCORD.GG/VEENOX";
      //   const text2 = "X.COM/VEENOX_XYZ";

      //   const text1Width = ctx.measureText(text1).width;
      //   const text2Width = ctx.measureText(text2).width;

      //   const initialX = 280;
      //   const initialY = canvas.height - 55;

      //   ctx.fillText(text1, initialX, initialY);
      //   ctx.fillText(text2, initialX + text1Width + 20, initialY);

      //   const x = canvas.width - 220;
      //   const y = canvas.height - 82;
      //   const width = 160;
      //   const height = 40;
      //   const radius = 5;

      //   ctx.fillStyle = "#836EF9";
      //   ctx.beginPath();
      //   ctx.moveTo(x + radius, y);
      //   ctx.arcTo(x + width, y, x + width, y + height, radius);
      //   ctx.arcTo(x + width, y + height, x, y + height, radius);
      //   ctx.arcTo(x, y + height, x, y, radius);
      //   ctx.arcTo(x, y, x + width, y, radius);
      //   ctx.closePath();
      //   ctx.fill();

      //   ctx.fillStyle = "#FFFFFF";
      //   ctx.font = "20px Poppins";
      //   ctx.textAlign = "center";
      //   ctx.fillText("veenox.xyz", canvas.width - 140, canvas.height - 57);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, canvas.width - 650, 100, 650, 650);
        setImageUrl(canvas.toDataURL());
      };
      img.src = selectedImage;
    };

    drawPoster();
  }, [data, selectedImage]);

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.download = "veenox_poster.png";
    link.href = imageUrl;
    link.click();
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button>Preview</button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] w-[90%] h-auto max-h-[90vh] flex flex-col gap-0 overflow-auto">
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
            </>
          )}
          <div className="flex items-center flex-wrap gap-2 mt-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <button
                className={`border cursor-pointer ${
                  selectedImage === `/poster/${index + 1}.webp`
                    ? "border-base_color"
                    : "border-borderColor"
                } rounded p-2`}
                onClick={() => setSelectedImage(`/poster/${index + 1}.webp`)}
                key={index}
              >
                <img
                  className="h-[100px] w-[100px]"
                  src={`/poster/${index + 1}.webp`}
                />
              </button>
            ))}
          </div>
          <button
            onClick={downloadImage}
            className="mt-4 px-4 py-2 bg-base_color text-white rounded hover:bg-base_color transition-colors"
          >
            Télécharger le poster
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
