function formatDate(date: Date | null) {
  if (!date) return null;

  return date.toLocaleString("en-EN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default formatDate;