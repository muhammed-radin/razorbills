function RupeeFormatter(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function extractNumber(formattedString) {
  const numberString = formattedString.replace(/[^0-9.-]+/g, "");
  return parseFloat(numberString);
}

function currency(amount, locale = "en-IN", currency = "INR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export { RupeeFormatter, extractNumber, currency };
