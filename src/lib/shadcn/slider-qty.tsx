import { cn } from "@/utils/cn";
import * as SliderPrimitive from "@radix-ui/react-slider";
import React, { useCallback, useEffect, useRef, useState } from "react";

type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  isBuy: boolean;
};

const SliderQty = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, isBuy, ...props }, ref) => {
  const [value, setValue] = useState(props.defaultValue || [0]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const sliderRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);

  const handleValueChange = useCallback(
    (newValue: number[]) => {
      setValue(newValue);
      if (props.onValueChange) {
        props.onValueChange(newValue);
      }
    },
    [props.onValueChange]
  );

  const updateTooltipPosition = useCallback((clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = -30; // Position above the slider
      setTooltipPosition({ x, y });
    }
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (isPointerDownRef.current) {
        updateTooltipPosition(event.clientX);
        setShowTooltip(true);
      }
    },
    [updateTooltipPosition]
  );

  const handlePointerDown = useCallback(() => {
    isPointerDownRef.current = true;
    setShowTooltip(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    isPointerDownRef.current = false;
    setShowTooltip(false);
  }, []);

  useEffect(() => {
    const handleWindowPointerUp = () => {
      isPointerDownRef.current = false;
      setShowTooltip(false);
    };

    window.addEventListener("pointerup", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, []);

  return (
    <div className="relative" ref={sliderRef}>
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        onValueChange={handleValueChange}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-terciary">
          <SliderPrimitive.Range
            className={cn(
              "absolute h-full transition-colors duration-150 ease-in-out",
              isBuy ? "bg-green" : "bg-red"
            )}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={`block h-3 w-3 rounded-full border ${
            isBuy ? "border-green" : "border-red"
          } bg-terciary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-all duration-150 ease-in-out`}
        />
      </SliderPrimitive.Root>
      {showTooltip && (
        <div
          className={`absolute bg-terciary shadow-secondary shadow-xl border border-borderColor text-font-80 px-1.5 py-1 rounded-md text-xs pointer-events-none ${
            showTooltip
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2"
          } transition-opacity transition-scale duration-75 ease-in-out`}
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translateX(-50%)",
          }}
        >
          {value[0]}%
        </div>
      )}
    </div>
  );
});

SliderQty.displayName = SliderPrimitive.Root.displayName;

export { SliderQty };
