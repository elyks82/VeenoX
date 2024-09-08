import { useDaily } from "@orderly.network/hooks";
import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";

export const TimeSeriesChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { data } = useDaily();

  useEffect(() => {
    if (chartInstance.current) {
      (chartInstance.current as any).destroy();
    }

    const ctx = (chartRef.current as any).getContext("2d");

    (chartInstance.current as any) = new Chart(ctx, {
      type: "line",
      data: {
        labels:
          data?.map((entry) => new Date(entry.date).toLocaleDateString()) || [],
        datasets: [
          {
            label: "Perp Volume",
            data: data?.map((entry) => entry.perp_volume) || [],
            borderColor: "#836EF9",
            backgroundColor: "rgba(131, 110, 249, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: "#836EF9",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(30, 30, 30, 0.8)",
            titleColor: "#FFFFFF",
            bodyColor: "#1B1D22",
            borderColor: "#836EF9",
            borderWidth: 1,
            displayColors: false,
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("en-US").format(
                    context.parsed.y
                  );
                }
                return label;
              },
            },
          },
        },

        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.03)",
            },
            ticks: {
              color: "#FFFFFF",
            },
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.03)",
            },
            ticks: {
              color: "#FFFFFF",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        (chartInstance.current as any).destroy();
      }
    };
  }, [data]);

  return (
    <div className="relative h-[350px]">
      <canvas ref={chartRef} />
      {(data?.length || 0) < 2 ? (
        <div className="absolute backdrop-blur-sm left-0 flex items-center justify-center top-0 h-full w-full">
          <p className="text-lg font-medium">Not enough Volume</p>
        </div>
      ) : null}
    </div>
  );
};
