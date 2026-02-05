export const currency = (num) =>
  new Intl.NumberFormat("zh-TW").format(num);
