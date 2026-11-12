const nf = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

export function fmt(n, digits = 0) {
  if (!isFinite(n)) return "–";
  if (!digits) return nf.format(Math.round(n));
  return n.toLocaleString("en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** 12,345 -> 12.3k, 1,234,567 -> 1.23m. For tight spots only. */
export function short(n) {
  const a = Math.abs(n);
  if (a >= 1e6) return (n / 1e6).toFixed(a >= 1e7 ? 1 : 2).replace(/\.0+$/, "") + "m";
  if (a >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  return fmt(n);
}

export function gp(n) {
  return short(n) + " gp";
}

/** Hours as "3h 20m", "45 min" or "2d 4h". */
export function duration(hours) {
  if (!isFinite(hours) || hours <= 0) return "–";
  if (hours < 1) return Math.max(1, Math.round(hours * 60)) + " min";
  if (hours >= 48) {
    const d = Math.floor(hours / 24), h = Math.round(hours - d * 24);
    return d + "d" + (h ? " " + h + "h" : "");
  }
  let h = Math.floor(hours), m = Math.round((hours - h) * 60);
  if (m === 60) { h++; m = 0; }
  return h + "h" + (m ? " " + m + "m" : "");
}

export function days(n) {
  if (!isFinite(n) || n <= 0) return "–";
  return n === 1 ? "1 day" : fmt(n) + " days";
}

export function plural(n, one, many = one + "s") {
  return Math.round(n) === 1 ? one : many;
}

export function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}
