function formatDateForForm(date: Date | null) {
  if (!date) return;

  return date.toLocaleDateString("en-CA");
}

export default formatDateForForm;