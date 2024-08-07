export const getLeverageFromMarkValue = (mark: number) => {
  switch (mark) {
    case 0:
      return 1;
    case 10:
      return 2;
    case 20:
      return 3;
    case 30:
      return 4;
    case 40:
      return 5;
    case 50:
      return 10;
    case 60:
      return 20;
    case 70:
      return 30;
    case 80:
      return 40;
    case 90:
      return 50;
    default:
      return 1;
  }
};
