export default function formAutosave() {
  const STORAGE_KEY = "autoform_data_jq";

  // Загружаем сохранённые данные
  let saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  // Восстановление значений при загрузке
  $(function () {
    $.each(saved, function (selector, value) {
      const $el = $(selector);
      if (!$el.length) return;

      if ($el.is(":checkbox, :radio")) {
        $el.prop("checked", value);
      } else {
        $el.val(value);
      }
    });
  });

  // Генерация уникального селектора
  function getSelector(el) {
    const $el = $(el);

    if (el.id) return `#${el.id}`;
    if (el.name) return `${el.tagName.toLowerCase()}[name="${el.name}"]`;

    // Путь через DOM
    let path = [];
    $el.parents().addBack().each(function () {
      if (this.tagName.toLowerCase() === "html") return;

      let selector = this.tagName.toLowerCase();
      const $siblings = $(this).parent().children(this.tagName);

      if ($siblings.length > 1) {
        selector += `:nth-of-type(${$siblings.index(this) + 1})`;
      }

      path.push(selector);
    });

    return path.reverse().join(" > ");
  }

  // Автосохранение
  $(document).on("input change", "input, textarea, select", function () {
    const selector = getSelector(this);

    saved[selector] = $(this).is(":checkbox, :radio")
      ? $(this).prop("checked")
      : $(this).val();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  });

  // Очистка после успешной отправки формы
  $(document).on("submit", "form", function () {
    localStorage.removeItem(STORAGE_KEY);
  });
}
formAutosave();
