export default function checkCurrentPage() {
  const pathname = window.location.pathname;
  const href = window.location.href;
  
  $(`a[href="${pathname}"], a[href="${href}"]`).on("click", function (e) {
    e.preventDefault();
  });
  $(`a[href="${pathname}"], a[href="${href}"]`).addClass('active');
}

checkCurrentPage();
