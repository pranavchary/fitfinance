export const encryptPassword = async (password) => {
  let encoder = new TextEncoder();
  let data = encoder.encode(password);
  let hash = await crypto.subtle.digest('SHA-256', data);
  let hashArray = Array.from(new Uint8Array(hash));
  let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const isNull = (object) => {
  return object === null;
}

export const isUndefined = (object) => {
  return object === undefined;
}

export const isNullOrUndefined = (object) => {
  // Loose comparison (==) to null returns true for both null and undefined
  return object == null;
}

export const getMonthStartEndDates = (month, year) => {
  // month should not be 0 indexed
  if (month < 10)
    month = '0' + month;
  let start = `${year}-${month}-01`;
  let end = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
  return { start, end }
}

export const getMonthYear = () => {
  let monthAbbr = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
  let date = new Date();
  return `${ monthAbbr[date.getMonth()] } ${ date.getFullYear() }`
}

export const amountWithDecimals = (amount) => {
  if (amount % 1 === 0) {
    return amount + ".00";
  }
  return amount.toString();
}
