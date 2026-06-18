function formatDate(date: Date) {
  return date.toLocaleString("en-EN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default formatDate;