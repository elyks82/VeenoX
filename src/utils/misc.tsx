export const addressSlicer = (address: `0x${string}` | undefined) => {
  return address?.slice(0, 6) + "..." + address?.slice(-4);
};

export const formatSymbol = (symbol: string, isOnlySymbol?: boolean) => {
  const isPerp = symbol.includes("PERP");
  try {
    const formatted = symbol.replace("PERP", "").slice(1).replace("_", "-");
    if (isOnlySymbol) {
      return formatted.split("-")[0].toUpperCase();
    }
    if (isPerp) {
      return formatted;
    }
    return symbol;
  } catch (e) {
    return symbol;
  }
};

export function getFormattedAmount(
  price: number | string | undefined,
  lessPrecision = 0,
  settings: {
    shouldNotMinifyBigNumbers?: boolean;
    canUseHTML?: boolean;
    isScientificNotation?: boolean;
  } = {
    shouldNotMinifyBigNumbers: false,
    canUseHTML: false,
    isScientificNotation: false,
  }
) {
  try {
    if (price) {
      price = parseFloat(String(price)).toFixed(
        Math.min(
          String(price).includes("-")
            ? parseInt(String(price).split("-")[1]) + 2
            : String(price).split(".")[1]?.length || 0,
          100
        )
      );

      if (
        settings.isScientificNotation &&
        Math.abs(parseFloat(price)) < 0.0001
      ) {
        const exp = price.match(/0\.0+[1-9]/)?.[0] || "";
        return `${price.split(".")[0]}.0..0${price
          .split(exp.slice(0, exp.length - 2))[1]
          .slice(1, 5 - lessPrecision)}`;
      }

      if (Math.abs(parseFloat(price)) > 1000000) {
        return !settings.shouldNotMinifyBigNumbers
          ? formatBigAmount(price)
          : formatAmount(price, 0);
      }
      if (Math.abs(parseFloat(price)) > 1000) {
        return String(parseInt(price)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      if (Math.abs(parseFloat(price)) < 0.0000001 && settings.canUseHTML) {
        return formatSmallNumber(Math.abs(parseFloat(price)));
      }
      if (Math.abs(parseFloat(price)) < 0.0001) {
        const priceString = price.toString();
        const newPrice = [];
        const arr = priceString.split(".");
        const decimals = arr[1]?.split("");
        decimals.forEach((digit, index) => {
          if (newPrice.some((digit) => digit !== "0")) return;
          if (digit === "0") newPrice.push(digit);
          if (decimals[index - 1] == "0" && digit !== "0") {
            newPrice.push(digit);
            newPrice.push(decimals[index + 1]);
            newPrice.push(decimals[index + 2]);
          }
        });
        return `${arr[0]}.${newPrice.join("")}`;
      }
      if (Math.abs(parseFloat(price)) < 0.01) {
        return price.slice(0, 8 - lessPrecision);
      }
      price = price.slice(0, 6 - lessPrecision);
      if (price[price.length - 1] === ".")
        price = price.slice(0, 5 - lessPrecision);
      return price;
    }
    if (Number.isNaN(price)) {
      return "--";
    }
    return 0;
  } catch (e) {
    return "--";
  }
}

export function formatBigAmount(amount: number | string, precision = 3) {
  amount = formatAmount(parseInt(amount as string));
  let letter: string = "";
  switch (amount.split(",").length) {
    case 1:
      letter = "";
      break;
    case 2:
      letter = "k";
      break;
    case 3:
      letter = "M";
      break;
    case 4:
      letter = "B";
      break;
    case 5:
      letter = "T";
      break;
    case 6:
      letter = "Q";
      break;
    case 7:
      letter = "Qi";
      break;
    case 8:
      letter = "S";
      break;
  }

  const fractionalPart = amount
    .split(",")
    .slice(1)
    .join("")
    .slice(0, precision - amount.split(",")[0].length);

  if (fractionalPart === "0") {
    return `${amount.split(",")[0]}${letter}`;
  }

  if (precision) {
    return `${amount.split(",")[0]}${
      fractionalPart ? `.${fractionalPart}` : ""
    }${letter}`;
  }

  return amount.split(",")[0] + letter;
}

const formatSmallNumber = (number: number) => {
  const nbrToString = toFullString(number);
  const cutFirstHalf = nbrToString.split("");
  const firstHalf = [cutFirstHalf[0], cutFirstHalf[1], cutFirstHalf[2]];
  const numberArray = cutFirstHalf.slice(3, cutFirstHalf.length);

  let countZero = 0;

  for (let i = 0; i < numberArray.length; i++) {
    if (numberArray[i] === "0") countZero++;
    else break;
  }

  return (
    <>
      {firstHalf}
      <sub className="text-[xs] self-end font-medium mx-[2px]">{countZero}</sub>
      {numberArray.slice(countZero, countZero + 3).join("")}
    </>
  );
};

function toFullString(num) {
  let str = num.toString();
  if (str.includes("e")) {
    const parts = str.split("e");
    const base = parts[0].replace(".", "");
    const exponent = parseInt(parts[1], 10);

    if (exponent < 0) {
      const decimalPlaces = Math.abs(exponent) - 1;
      str = "0." + "0".repeat(decimalPlaces) + base;
    } else {
      str = base + "0".repeat(exponent - base.length + 1);
    }
  }
  return str;
}

export function formatAmount(amount: number | string, decimals = 2) {
  if (isNaN(parseInt(amount as string))) return "--";
  return (
    String(Math.floor(parseFloat(amount as string))).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    ) +
    (amount.toString().includes(".") && decimals
      ? `.${amount.toString().split(".")[1].substr(0, decimals)}`
      : "")
  );
}

export const getFormattedDate = (date: number) => {
  if (!date) return null;

  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedDate = new Date(date).toLocaleDateString(undefined, options);
  return formattedDate;
};

export const resolutionToTimeframe = (resolution: string) => {
  const map: { [key: string]: string } = {
    "1": "1m",
    "5": "5m",
    "15": "15m",
    "60": "1h",
    "120": "2h",
    "240": "4h",
    "24H": "1d",
    "7D": "1w",
    "30D": "1M",
  };
  return map[resolution] || "1m";
};

export const getNextBarTime = (resolution: string, time: number) => {
  const date = new Date(time);
  const utcDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );

  switch (resolution) {
    case "1":
    case "3":
    case "5":
    case "15":
      utcDate.setMinutes(utcDate.getMinutes() + 1);
      break;
    case "60":
    case "120":
    case "240":
    case "360":
    case "720":
    case "D":
      utcDate.setHours(utcDate.getHours() + 1);
      break;
    case "W":
      utcDate.setDate(utcDate.getDate() + 7);
      break;
    case "M":
      utcDate.setMonth(utcDate.getMonth() + 1);
      break;
  }

  return Math.floor(utcDate.getTime());
};
