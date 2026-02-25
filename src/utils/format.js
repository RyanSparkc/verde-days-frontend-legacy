const currencyFormatter = new Intl.NumberFormat('zh-TW');

export const currency = (num) => currencyFormatter.format(num);
