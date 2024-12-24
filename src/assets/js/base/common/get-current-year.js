export default function currentYear() {
  const currentYear = $('.current-year');
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  currentYear.text(year);
}
currentYear();