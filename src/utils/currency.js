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
  if (amount === null || amount === undefined || isNaN(amount)) {
    // return symbol only, example: "$"
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "INR":
        return "₹";
      default:
        return ""; // Return the currency code if symbol is not known
    }
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount); // returns formatted currency string, example: "$1,234.56"
}

export { RupeeFormatter, extractNumber, currency };
