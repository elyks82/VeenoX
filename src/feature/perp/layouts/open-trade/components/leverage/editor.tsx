import { triggerAlert } from "@/lib/toaster";
import { getLeverageValue } from "@/utils/misc";
import { useAccount } from "@orderly.network/hooks";
import { FC, useEffect, useMemo, useState } from "react";
import {
  Range,
  checkValuesAgainstBoundaries,
  getTrackBackground,
} from "react-range";

interface LeverageEditorProps {
  onSave?: (value: { leverage: number }) => Promise<void>;
  maxLeverage?: number;
  leverageLevers: number[];
  isMutating: boolean;
  onSubmit: () => void;
}

export const LeverageEditor: FC<LeverageEditorProps> = ({
  maxLeverage,
  leverageLevers,
  onSave,
  onSubmit,
  isMutating,
}) => {
  const [leverage, setLeverage] = useState(() => maxLeverage ?? 0);
  const { state } = useAccount();
  const leverageValue = useMemo(() => {
    const index = leverageLevers.findIndex((item) => item === leverage);
    return index !== -1 ? index : 1;
  }, [leverage, leverageLevers]);

  const getMaxLeverageToValue = () => {
    switch (leverageValue) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
      case 5:
        return 5;
      case 10:
        return 6;
      case 15:
        return 7;
      case 20:
        return 8;
      case 30:
        return 9;
      case 40:
        return 10;
      case 50:
        return 11;
      default:
        return 10;
    }
  };
  const formatMaxLeverage = getMaxLeverageToValue();
  const [values, setValues] = useState([formatMaxLeverage]);
  const [selectedMax, setSelectedMax] = useState(100);
  const [selectedMin, setSelectedMin] = useState(0);
  const [selectedStep, setSelectedStep] = useState(1);

  useEffect(() => {
    const valuesCopy = values.map((value) =>
      checkValuesAgainstBoundaries(value, selectedMin, selectedMax)
    );
    setValues(valuesCopy);
  }, [selectedMin, selectedMax, selectedStep]);
  return (
    <div className="mb-2.5 w-[97%] mx-auto">
      <Range
        step={1}
        min={1}
        max={11}
        disabled={state.status !== 5}
        values={values}
        onChange={(value) => {
          setValues(value);
          const _value = leverageLevers[value[0]];
          setLeverage(_value);
        }}
        onFinalChange={(value) => {
          const _value = leverageLevers[value[0]];
          try {
            onSave?.({ leverage: _value }).catch(() => {
              setLeverage(maxLeverage ?? 1);
            });
            triggerAlert(
              "Success",
              "Max leverage has been updated successfully"
            );
          } catch (err) {
            triggerAlert("Error", "Error while trying to update max leverage");
          }
        }}
        renderMark={({ props, index }) => {
          const leverage = getLeverageValue(index);
          return (
            <div
              {...props}
              key={props.key}
              style={{
                ...props.style,
                display: "flex",
                flexDirection: "column",
                marginTop: "-2.3px",
              }}
            >
              <div
                className="mb-2 p-[2px]"
                style={{
                  height: "7px",
                  width: "7px",
                  borderRadius: "1px",
                  transform: "rotate(45deg)",
                  backgroundColor:
                    index * selectedStep + selectedMin < values[0]
                      ? "#836ef9"
                      : "rgba(70,70,70,1)",
                }}
              >
                <div
                  className={`w-full h-full ${
                    index * selectedStep + selectedMin < values[0]
                      ? "bg-[#836ef9]"
                      : "bg-borderColor-DARK"
                  }  rounded-[1px]`}
                />
              </div>
              <div className="text-font-80 text-[11px] -ml-1">{leverage}</div>
            </div>
          );
        }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: "36px",
              display: "flex",
              width: "100%",
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: "3px",
                width: "100%",
                borderRadius: "4px",
                background: getTrackBackground({
                  values,
                  colors: ["#836ef9", "rgba(70,70,70,1)"],
                  min: 1,
                  max: 11,
                  rtl: false,
                }),
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            key={props.key}
            style={{
              ...props.style,
              height: "12px",
              width: "12px",
              borderRadius: "100%",
              backgroundColor: "rgba(200,200,200,1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //   boxShadow: "0px 2px 6px #AAA",
              padding: "2px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "100%",
                backgroundColor: "#836ef9",
              }}
            />
          </div>
        )}
      />
    </div>
  );
};
