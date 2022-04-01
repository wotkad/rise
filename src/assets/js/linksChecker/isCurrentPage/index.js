import $ from "jquery";

export default function isCurrentPage() {
  const page = window.location.pathname;
  $(`a[href="${page}"]`).addClass("active");
  if (page == page) {
    $(`a[href="${page}"]`).on("click", function (e) {
      e.preventDefault();
    });
  }
}
isCurrentPage();
