export default function currentYear() {
  const currentYear = $('.currentYear');
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  currentYear.text(year);
}
currentYear();
