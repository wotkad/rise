function validationInternalLinks() {
  const links = $("a[href^='/']");

  Array.from(links).forEach((link) => {
    fetch(link.href, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then((response) => {
        if (response.status === 404) {
          $(link).attr("href", "/404");
          console.warn(`⚠️ Битая ссылка: ${link.href} → заменена на /404`);
        }
      })
      .catch(() => {
        console.warn(`⚠️ Не удалось проверить ссылку: ${link.href}`);
      });
  });
}
validationInternalLinks();