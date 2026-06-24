function formatDate(date: Date | null) {
  if (!date) return null;

  return date.toLocaleString("en-EN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default formatDate;