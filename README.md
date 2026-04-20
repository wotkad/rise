# 🥥 Rise - гибкий шаблон для разработки веб-сайтов и приложений

**Rise** - быстрый, лёгкий и масштабируемый шаблон для разработки сайтов и приложений. Он подходит как для создания простых лендингов, так и для высоконагруженных сайтов с поддержкой SPA и PWA. Rise позволяет быстро собрать проект с модульной структурой файлов, автоматизацией сборки и оптимизацией ресурсов.

## Оглавление

1. [Введение](https://github.com/wotkad/rise/?tab=readme-ov-file#-1-%D0%B2%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5)
2. [Запуск шаблона](https://github.com/wotkad/rise/?tab=readme-ov-file#-2-%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA-%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B0)
3. [Архитектура проекта](https://github.com/wotkad/rise/?tab=readme-ov-file#%EF%B8%8F-3-%D0%B0%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%B0-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0)
4. [Работа с компонентами](https://github.com/wotkad/rise/?tab=readme-ov-file#-4-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0-%D1%81-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%B0%D0%BC%D0%B8)
5. [Стили и типографика](https://github.com/wotkad/rise/?tab=readme-ov-file#-5-%D1%81%D1%82%D0%B8%D0%BB%D0%B8-%D0%B8-%D1%82%D0%B8%D0%BF%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B0)
6. [Скрипты и функциональные модули](https://github.com/wotkad/rise/?tab=readme-ov-file#-6-%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D1%8B-%D0%B8-%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D0%B8)
7. [Сборка проекта](https://github.com/wotkad/rise/?tab=readme-ov-file#-7-%D1%81%D0%B1%D0%BE%D1%80%D0%BA%D0%B0-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0)
8. [Инструменты и команды](https://github.com/wotkad/rise/?tab=readme-ov-file#-8-%D0%B8%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D1%8B-%D0%B8-%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D1%8B)
9. [Автоматизация и Git-интеграции](https://github.com/wotkad/rise/?tab=readme-ov-file#-9-%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%B8-git-%D0%B8%D0%BD%D1%82%D0%B5%D0%B3%D1%80%D0%B0%D1%86%D0%B8%D0%B8)
10. [SEO и контент](https://github.com/wotkad/rise/?tab=readme-ov-file#-10-seo-%D0%B8-%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%BD%D1%82)
11. [Оптимизация и производительность](https://github.com/wotkad/rise/?tab=readme-ov-file#-11-%D0%BE%D0%BF%D1%82%D0%B8%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%B8-%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D1%8C)
12. [Файловая структура](https://github.com/wotkad/rise/?tab=readme-ov-file#-12-%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D0%B0%D1%8F-%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0)

---

# 🧱 1. Введение

## Основные возможности

* 🔧 Конструктор компонентов - автоматическая генерация UI-блоков с шаблоном, стилем и логикой.
* 🧩 Модульная архитектура с PUG-шаблонами и SCSS - разделение кода на переиспользуемые части (/components, /mixins).
* 🎨 Стилизация SCSS + Tailwind - кастомные стилеи и возможность использования Tailwind.
* 🔍 SEO и метаданные - генерация sitemap, `robots.txt`, `manifest.json` и проверка контента.
* 🚀 Автоматизация и отчётность - Performance Report, Lighthouse Report, Accessibility Report, Content Report.
* ⚡ Оптимизация сборки - Smart Watcher, Smart Lazy Loader, Service Worker, PurgeCSS.
* 🔥 HMR для `.scss` и `.js` файлов, а также watcher для `.pug` файлов.
* 📄 Генерация статей из Markdown - автоматическое создание контентных страниц из .md-файлов.
* и многое другое...

## Кому подходит

* Фриланс-разработчикам, которым нужен быстрый старт.
* Агентствам, создающим сайты под ключ.
* Командам, желающим шаблон с набором production-фич из коробки (PWA, SEO, оптимизация).
* Тем, кто хочет учить студентов/коллег практическим подходам к сборке фронтенда.

## Системные требования

* [Node.js](https://nodejs.org/en/download) >= 22.21.0
* [Yarn](https://classic.yarnpkg.com/en/docs/install) >= 1.22.22
* Браузер с поддержкой ES6

---

# 🔥 2. Запуск шаблона 

1. [Создаём](https://github.com/new?template_name=rise&template_owner=wotkad) проект на основе шаблона.
2. Клонируем созданный проект и открываем в редакторе кода.
3. Устанавливаем зависимости командой `yarn`.
4. Запускаем проект в режиме разработки `yarn dev`.
5. Приступаем к разработке.

После запуска проект будет доступен по адресу [http://localhost:8080](http://localhost:8080).

---

# ⚙️ 3. Архитектура проекта

## 3.1 Основная структура

```bash
src/           # исходный код
├── assets/    # шрифты, изображения, видео
├── js/        # модули и скрипты
├── styles/    # SCSS, Tailwind, миксины
├── views/     # PUG-шаблоны
└── markdown/  # статьи в формате .md

build/         # результат сборки проекта
node_modules/  # зависимости
plugins/       # вспомогательные скрипты (конструктор, оптимизация, отчеты)
reports/       # отчеты (Performance, Lighthouse, Accessibility, Content)
```

Более детально изучисть структуру вы можете в разделе [файловая структура](https://github.com/wotkad/rise/?tab=readme-ov-file#-12-%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D0%B0%D1%8F-%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0).

## 3.2 Структура страниц

* `/`: Главная
* `/blog`: Блог (Статьи внутри генерируются из `.md` файлов)
  * `/blog/post`: Статья 1 
  * `/blog/post2`: Статья 2
  * `/blog/post3`: Статья 3
* `/404`: Страница ошибки

## 3.3 Основные принципы

* **Модульность:** каждый компонент и модуль должен быть изолирован и переиспользоваться.
* **DRY:** повторяющийся код выносится в компоненты и миксины.
* **SPA:** Rise поддерживает плавные переходы между страницами без их перезагрузки благодаря `Barba.js`.

## 3.4 Как работают шаблоны

* **PUG:** используется для шаблонов страниц и компонентов, поддерживает миксины и параметры.
* **SCSS:** стили проектируются по компонентам и импортируются через `app.scss`.
* **JS:** логика компонентов подключается через `app.js`.

## 3.5 Добавление страниц

* Для создания новой страницы необходимо добавить файл в директорию `/views/pages`. После этого перезапустите проект - страница станет доступна.
* Чтобы создать раздел, например `/products/product`, где `/products` - родительский, а `/product` - дочерний, нужно в файле `webpack.config.js`, в объекте `plugins`, добавить код `...pager.pages(MODE, "products")`.

```js
module.exports = (env) => {
  return {
    plugins: [
      ...pager.pages(MODE), // Подключение прочих страниц
      ...pager.pages(MODE, "products"), // Подключение страниц /products
    ]
  }
}

// если у вас одностраничный сайт, этот участок кода можно удалить
```

## 3.6 Подключение и организация библиотек

* Все CSS/JS библиотеки подключаются в `src/assets` или через yarn и импортируются в `app.js` / `app.scss` / `bundle.js`.
* Для сокращения путей используется система алиасов.

## 3.7 Alias-ы (Smart Import Map)

Пример использования алиасов:

```js
import { sendForm } from '@p-components/form';
import initSlider from '@p-components/slider/slider';
```

* Алиас `@` ссылается на `src/`
* Автоматически генерируется через скрипт Smart Import Map

Все доступные алиасы вы можете найти в `/plugins/optimization/aliases.js`.

## 3.8 Доступные библиотеки JS

* [Barba](https://barba.js.org): Небольшая и простая в использовании библиотека, которая поможет создавать плавные переходы между страницами веб-сайта, а также более детально настраивать роутинг.
* [GSAP](https://greensock.com/gsap): Набор инструментов для реализации анимации любого уровня сложности.
* [jQuery](https://jquery.com): Быстрая, небольшая и многофункциональная библиотека. Она значительно упрощает такие вещи, как обход и манипулирование элементами HTML, обработку событий, анимации, Ajax, с помощью простого в использовании API, который работает во множестве браузеров.
* [ScrollReveal](https://scrollrevealjs.org): Библиотека для анимации элементов по мере их прокрутки в окне браузера.
* [SmoothScroll](https://github.com/cferdinandi/smooth-scroll): Легкий скрипт для анимации прокрутки к якорным ссылкам.
* [Swiper](https://swiperjs.com/): Библиотека дял создания слайдеров любой сложности.

---

# 🧩 4. Работа с компонентами

## 4.1 Создание нового кастомного компонента вручную

1. Создай папку в `src/views/custom-components/my-component/`

Например:

```bash
src/views/custom-components/button/
```

2. Создай файлы:

```bash
src/views/custom-components/button/button.pug
src/assets/styles/custom-components/button/button.scss
src/assets/js/custom-components/button/button.js
```

3. Пример `button.pug`:

```jade
button.button Кнопка
```

4. Пример `button.scss`:

```scss
.button {
  padding: 10px 20px;
  border-radius: 4px;
  &.primary { background: #007bff; color: #fff; }
  &.secondary { background: #6c757d; color: #fff; }
}
```

5. Пример `button.js`:

```js
export default function initButton() {
  document.querySelectorAll('.button').forEach(btn => {
    btn.addEventListener('click', () => alert('Button clicked!'))
  });
}
```

6. Пример добавления изображения в компонент:

```jade
img(src=require("@images/logo.svg") alt="logo")
```

## 4.2 Автоматическая генерация компонентов (Конструктор)

Используются компоненты из дизайна Flowbite v2.10.0

Для добавления в проект готового компонента выполните команду `yarn constructor my-component`. Компонент будет добавлен в проект, если он существует в библиотеке компонентов.

```bash
yarn constructor <component-name>              # генерация готового компонента в проект
yarn constructor <component-name> --rewrite    # перезапись готового компонента в проект
yarn constructor <component-name> --remove     # удаление готового компонента в проект
```

При добавлении, компонент создаётся в проекте в папках `/components/` и `/mixins/`, для PUG, SCSS, JS, для изображений в `/assets/`, и для `_defaults` в `/assets/js/_defaults/<mixin-name>`. Все прочие компоненты находятся в `/custom-components/`. При создании автоматически добавляются импорты в `app.scss` и `app.js`.

После создания выбранный компонент останется только подключить в нужное место в `.pug` файле.

* Компоненты могут быть разных версий (v1/v2...).
* Компоненты могут содержать миксины.
* Миксины содержат _defaults.


### Структура компонента

```bash
/components/<component-name>/<version>/
  ├── /<component-name>/          # изображения
  ├── <component-name>.pug        # шаблон компонента
  └── <component-name>.scss       # стили компонента
```

Возможно наличие миксина в компоненте:

```bash
/components/<component-name>/<version>/<mixin-name>/
  ├── _defaults.js                # дефолтные значение миксина
  ├── <mixin-name>.pug            # шаблон миксина
  └── <mixin-name>.scss           # стили миксина
```

```bash
/js/                              # глобальный JS
  └── <component-name>.js         # логика, используемая в компоненте (одноимённый с компонентом, содержит всю доступную логику для всех версий компонента)
```

## 4.3 Работа с миксинами и параметрами (_defaults)

`_defaults` обеспечивает базовые значения для миксинов.

Пример `_defaults.js`:

```js
module.exports = {
  defaults: {
    text: "Нажми меня",
    type: "primary"
  },
  mergeConfig(data, defaults) {
    return {
      text: data.text !== undefined ? data.text : defaults.text,
      type: data.type !== undefined ? data.type : defaults.type,
    }
  },
};
```

Миксины PUG принимают объект с опциями:

Пример `button.pug`:

```jade
mixin button(data)
  - const { defaults, mergeConfig } = require("@defaults/button/_defaults");
  - const modefied = mergeConfig(data, defaults);
  button.button(class=modefied.type)= modefied.text
```

Если при вызове миксина не переданы параметры, используются значения из `_defaults`.

```jade
+button() // Использует defaults: текст "Нажми меня", тип "primary"
```

## 4.4 Подключение PUG на страницы

PUG компонент:

```jade
include @p-components/button/button.pug
```

PUG миксин:

```jade
include @p-mixins/button/button.pug
+button({ text: "Отправить", type: "secondary" })
```

---

# 🎨 5. Стили и типографика

Rise использует Dart Sass - современную реализацию Sass, поддерживающую новый модульный синтаксис:

```scss
@use "@s-base/variables" as *;
@use "@s-mixins/mixins" as *;
```

Такой подход полностью заменяет устаревшие директивы @import и обеспечивает:

* Чистую иерархию зависимостей.
* Изоляцию переменных и функций.
* Более быструю компиляцию.
* Предсказуемый порядок подключения стилей.

```scss
@use "@s-base/variables" as *;
@use "@s-mixins/mixins" as *;

.hero {
  @include flex-center;
  background: $color-primary;
}
```

## 5.1 Структура SCSS

```
styles/
├── base/           # шрифты, переменные, типографика
├── components/     # header, footer, кнопки, карточки и др.
├── utils/          # системные миксины, функции, keyframes, сброс браузерных стилей
└── mixins/         # обычные миксины
```

## 5.2 Tailwind

Tailwind CSS - это утилитарный CSS-фреймворк, который позволяет быстро создавать интерфейсы с помощью готовых классов вместо написания кастомного CSS.

### Основная идея

Вместо:

```css
.btn {
  padding: 10px 20px;
  border-radius: 6px;
  background: #3b82f6;
  color: #fff;
}
```

в HTML пишем:

```html
<button class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
  Кнопка
</button>
```

или выносим это в SCSS через `@apply`:

```scss
.btn {
  @apply px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600;
}
```

### Возможности Tailwind

* Utility-классы для всего: от отступов и сеток до анимаций и фильтров.
→ `flex`, `grid`, `text-center`, `shadow-lg`, `rounded-xl`, `bg-gradient-to-r` и т. д.
* Responsive и hover-состояния прямо в классах:
→ `md:text-lg`, `hover:bg-blue-600`, `focus:ring`.
* Темизация через `tailwind.config.js` - можно задать свои цвета, шрифты, брейкпоинты, spacing и т. д.
* Производительность: PurgeCSS встроен - в сборку попадают только реально используемые классы.
* Совместимость: работает с SCSS, PostCSS, Pug, React, Vue, и любыми сборщиками.

## 5.3 Типографика и переменные

### Типографика

Основные стили типографики написаны в `typography.scss`. Вы можете их использовать либо настроить под себя.

### Переменные

```scss
$transition-default: 0.3s;
$container-padding: 16px;
$blue-050: #ebf5ff;

@use "@s-base/variables" as *;
body {
  transition: $transition-default;
  padding: $container-padding;
  color: $blue-050;
}
```

## 5.4 Темная тема

Rise включает встроенную поддержку тёмной темы, основанную на классическом принципе переключения класса `.dark` у тега `<body>`.
Это решение полностью совместимо с Tailwind CSS, SCSS и JavaScript-модулями, и позволяет гибко управлять визуальными стилями без сторонних библиотек.

### Принцип работы

Тёмная тема активируется добавлением класса `.dark` к элементу `<body>`.
Когда класс присутствует - применяются альтернативные цвета, фоны и тени из заранее определённой палитры.

```scss
@use "@s-base/variables" as *;

body {
  color: $black;
  background-color: $white;

  &.dark {
    background-color: $slate-900;
    color: $white;
  }
}
```

В шаблоне уже присутствует функционал переключения на темную тему. 

Также Rise может определять системные настройки пользователя с помощью prefers-color-scheme и автоматически активировать нужный режим.

Тёмная тема может переключаться вручную пользователем, автоматически при системной настройке или сохраняться в localStorage.

## 5.5 Основной шрифт - Inter

В качестве примера используется шрифт `Inter`.

Подключать/рекдактировать/удалять другие шрифты можно в файле `src/assets/styles/base/fonts.scss`.

Основной шрифт указан в файле `src/assets/styles/base/global.scss`.

## 5.6 Иконочный шрифт Font Awesome 6.0.0

В Rise по умолчанию подключён иконочный шрифт [Font Awesome 6.0.0](https://fontawesome.com/), обеспечивающий единый визуальный стиль и простое использование иконок без дополнительных SVG-файлов.

### Подключение

Шрифт уже встроен в систему типографики Rise, поэтому он доступен во всех шаблонах без дополнительного импорта.
Достаточно использовать класс `.fa` и соответствующее название иконки:

```jade
i.fa.fa-arrow-right
```

Иконки работают по принципу CSS-шрифтов - каждая иконка представляет собой символ в шрифтовом наборе.

### Варианты начертания

Font Awesome 6 поддерживает несколько семейств стиля, что позволяет адаптировать вид иконки под общий дизайн проекта:

| Начертание            | Класс         | Пример использования     |
| --------------------- | ------------- | ------------------------ |
| Solid (жирный)        | `.fa-solid`   | `i.fa-solid.fa-check`    |
| Regular (обычный)     | `.fa-regular` | `i.fa-regular.fa-heart`  |
| Light (тонкий)        | `.fa-light`   | `i.fa-light.fa-star`     |
| Thin (ультратонкий)   | `.fa-thin`    | `i.fa-thin.fa-circle`    |
| Duotone (двухцветный) | `.fa-duotone` | `i.fa-duotone.fa-camera` |
| Brands (брендовые)    | `.fa-brands`  | `i.fa-brands.fa-twitter` |

### Примеры использования

```jade
// Обычная стрелка
i.fa.fa-arrow-right

// Жирное начертание
i.fa-solid.fa-user

// Иконка бренда (Twitter)
i.fa-brands.fa-twitter
```

В SCSS можно управлять размером иконок, цветом и отступами:

```scss
i.fa {
  font-size: 1.25rem;
  color: $color-primary;
  margin-right: 0.5rem;

  &.fa-brands {
    color: $color-accent;
  }
}
```

---

# 🧠 6. Скрипты и функциональные модули

## 6.1 SPA переходы

`Barba.js` - это библиотека, которая позволяет реализовать плавные переходы между страницами без полной перезагрузки сайта.

Она работает как SPA (Single Page Application) над обычным многостраничным сайтом:

* при клике по ссылке страница не перезагружается,
* контент `<main>` (или другой контейнер) подменяется,
* вызываются переходы и анимации.

### Структура реализации

#### Подключение библиотек

```js
import barba from "@barba/core";
import barbaPrefetch from "@barba/core";
import gsap from "gsap";
import routingFunctions from "@routing/routing-functions";
```

* barba - основной движок переходов.
* barbaPrefetch - модуль предварительной подгрузки страниц (ускоряет переходы).
* gsap - анимации появления и исчезновения контента.
* routingFunctions - твой кастомный модуль, где инициализируются все функции, нужные после загрузки новой страницы (слайдеры, формы, видео, галереи и т.п.).

#### Управление скроллом

```js
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
```

Отключает автоматическое восстановление позиции скролла браузером.
Это нужно, чтобы при каждом переходе скролл сбрасывался в начало, а не оставался на старой высоте.

#### Настройка Barba

```js
async function initBarba() {
  barba.use(barbaPrefetch);
```

Подключается prefetch - он будет подгружать страницы при наведении на ссылку, ускоряя навигацию.

#### Обновление активного пункта меню

```js
barba.hooks.beforeLeave((data) => {
  const nextPath = data.next.url.href;
  const nextItem = $(`a[href="${nextPath}"]`);
  $(`.${"active"}`).removeClass("active");
  nextItem.addClass("active");
});
```

Перед уходом со страницы Barba вызывает hook - специальный "перехватчик событий".
Здесь обновляется активный пункт меню, если он находится вне `barba-wrapper`.

> Если навигация (header) уже внутри `barba-wrapper`, этот код не нужен, потому что он будет перерендериваться вместе со страницей.

#### Основная инициализация переходов

```js
barba.init({
  timeout: 1000000,
  preventRunning: true,
  requestError: ...
  transitions: [ ... ]
});
```

Параметры:

* timeout: увеличен, чтобы Barba не прерывала переход, если страница загружается долго.
* preventRunning: не позволяет запускать новую анимацию, пока предыдущая не завершилась.
* requestError: обработка ошибок (например, если страница не найдена → переход на /404).

#### Определение перехода (transition)

```js
{
  name: "fade",
  leave({ current }) {
    return gsap.to(current.container, { opacity: 0, duration: 0.3 });
  },
  enter({ next }) {
    ...
  },
  afterLeave({ current }) {
    ...
  },
}
```

Barba использует объекты переходов, где есть три ключевых стадии:

* leave - анимация ухода старой страницы
  * С помощью GSAP плавно скрывается текущий контейнер.
* enter - загрузка и анимация новой страницы
  * Сначала обновляются `<meta>` теги, чтобы SEO и соцсети корректно отображали данные.
  * Затем вызывается `routingFunctions()`, чтобы инициализировать нужные модули.
  * После этого анимируется появление новой страницы `opacity: 0 → 1`.
* afterLeave - финальная очистка
  * Прокрутка к началу страницы.
  * Удаление старого контейнера, чтобы не оставалось дубликатов в DOM.

#### Обновление `<head>` мета-тегов

```js
let $newPageHead = $('<head />').html(
  $.parseHTML(next.html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0])
);
let headTags = [
  "meta[name='keywords']",
  "meta[name='description']",
  "meta[property='og:title']",
  "meta[property='og:description']",
  "meta[property='og:type']",
  "meta[property='og:image']",
  "meta[property='og:url']",
].join(',');

$('head').find(headTags).remove();
$newPageHead.find(headTags).appendTo('head');
```

Этот блок:
* парсит `<head>` из HTML следующей страницы,
* находит нужные мета-теги,
* удаляет старые и добавляет новые в текущий документ.

Благодаря этому, даже при SPA-переходах, данные страницы (описание, title, OG) всегда актуальны - полезно для SEO и соцсетей.

## 6.2 Lazy Load и Smart Lazy Loader

Lazy Load - это одна из технологий оптимизации производительности в Rise.
Она позволяет загружать изображения только тогда, когда они действительно появляются в зоне видимости пользователя, а не все сразу при загрузке страницы.

В Rise реализована улучшенная версия - Smart Lazy Loader, которая не просто откладывает загрузку изображений, но и добавляет визуально приятный плейсхолдер с доминантным цветом, создавая эффект постепенной подгрузки контента.

### Цели Smart Lazy Loader

* Ускорить загрузку страниц за счёт отложенной подгрузки изображений.
* Сделать визуальное восприятие контента мягким и современным.
* Повысить оценку производительности в Lighthouse и Core Web Vitals (LCP, FCP).
* Использовать кеширование и повторное использование уже загруженных изображений.

### Механика работы

1. Подключение модуля

```js
import { loadImages } from '@common/load-images';
loadImages();
```

Модуль автоматически сканирует все изображения `<img>` на странице и добавляет наблюдатель `IntersectionObserver`.

2. Отложенная загрузка

Как только изображение попадает в область видимости (примерно 10% элемента видны пользователю), Smart Lazy Loader:

* временно добавляет фоновый placeholder;
* определяет доминантный цвет изображения;
* применяет эффект размытия `filter: blur(10px)`, чтобы создать мягкий переход.

3. Плавная подмена на реальное изображение

Когда изображение загружается:

* фон заменяется на настоящее изображение;
* размытие убирается;
* изображение кешируется в imageCache, чтобы при следующем появлении на других страницах не вызывать повторную обработку.

### Как работает анализ цвета

Smart Lazy Loader использует функцию `extractDominantColor()` для получения доминирующего цвета изображения.

Она рисует миниатюру картинки на скрытом canvas, считывает данные пикселей и вычисляет среднее значение RGB.

```js
function extractDominantColor(imgSrc, callback) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imgSrc;

  img.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = Math.min(img.width, 64);
    const h = Math.min(img.height, 64);
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    const data = ctx.getImageData(0, 0, w, h).data;
    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 4 * 16) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    callback(`rgb(${r}, ${g}, ${b})`);
  };

  img.onerror = () => callback('#ccc');
}
```

### Кеширование изображений

Rise использует модуль `@cache/image-cache`, который хранит список уже обработанных изображений.

Это позволяет:

* избегать повторной обработки canvas;
* мгновенно отображать изображения, которые уже были загружены на других страницах.

## 6.3 Прелоадер

Preloader отвечает за отображение плавной анимации загрузки страницы перед её полной отрисовкой.

Он используется для улучшения UX и предотвращения визуальных "рывков" при первичной загрузке контента.

### Основной принцип работы

Скрипт `preloader.js` с помощью GSAP управляет элементом `.render`,
делая его видимым во время загрузки и плавно скрывая после завершения инициализации страницы.

### Пример реализации

```js
import gsap from "gsap";

function renderPage() {
  const render = $(".render");
  if (!render.length) return;

  gsap.to(render, {
    opacity: 0,
    duration: 0.5,
    delay: 0.2,
    onComplete: () => render.remove(),
  });
}

$(window).on("load", () => {
  renderPage();
});
```

### Детали

* Элемент .render размещается поверх контента во время загрузки.
* После завершения инициализации он плавно исчезает.
* Используется GSAP для анимации (гибко и кроссбраузерно).
* Прелоадер удаляется из DOM после завершения анимации, чтобы не мешать работе других слоёв.


## 6.4 Offline Detector

Offline Detector - это встроенный модуль Rise, который отвечает за отслеживание состояния сети и улучшение пользовательского опыта при потере соединения.

Он работает в связке с Service Worker и системой кэширования, обеспечивая корректную работу сайта даже без доступа к интернету.

### Цели

* Обеспечить устойчивость интерфейса при потере сети.
* Сохранять данные и состояние между онлайн/оффлайн режимами.
* Повышать UX за счёт информирования пользователя о текущем статусе соединения.
* Поддерживать offline fallback, чтобы приложение оставалось функциональным.

### Принцип работы

Offline Detector использует нативное API браузера:

```js
navigator.onLine
window.addEventListener('online', handler)
window.addEventListener('offline', handler)
```

При потере сети Rise автоматически:

* Активирует оффлайн-баннер (Вы офлайн).
* Сохраняет текущее состояние или данные (например, открытые статьи).
* При восстановлении сети:
  * баннер исчезает;
  * Rise восстанавливает последние сохранённые данные;
  * при необходимости инициируется синхронизация.

### Пример реализации

```js
import { showBanner, hideBanner } from '@common/notifications';
import { cache } from '@cache/offline-cache';

function handleOffline() {
  showBanner('Вы офлайн. Последние данные доступны из кеша.');
  document.body.classList.add('offline');
}

function handleOnline() {
  hideBanner();
  document.body.classList.remove('offline');

  // Восстанавливаем данные
  cache.restore();
}

window.addEventListener('offline', handleOffline);
window.addEventListener('online', handleOnline);
```

### Взаимодействие с Service Worker

Offline Detector тесно интегрирован с автоматически генерируемым `service-worker.js`, который создаётся командой:

```bash
yarn production:service-worker
```

Service Worker реализует стратегию cache-first, а Offline Detector обеспечивает уведомление пользователя и обновление интерфейса.

Cache-first стратегия:
1. При загрузке страницы сначала проверяется локальный кеш.
2. Если сети нет - данные берутся из кеша.
3. Если сеть восстановилась - загружаются свежие данные и обновляются локальные кэши.

### Настройка fallback

В `service-worker.js` есть встроенный fallback для оффлайн-доступа:

```js
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match('/offline.html'))
  );
});
```

Rise автоматически генерирует `offline.html` во время продакшен-сборки.
Если страница недоступна из сети, пользователь видит адаптированную оффлайн-версию с сообщением:

>Вы офлайн. Проверьте подключение к интернету.

## 6.5 Автоматическая высота `textarea`

Скрипт `textarea-autoheight.js` отвечает за автоматическую адаптацию высоты поля `<textarea>` под его содержимое.

Это делает работу с формами значительно удобнее, особенно в интерфейсах с активным вводом текста - например, в чатах, комментариях, формах обратной связи и CMS-редакторах.

### Основная идея

Скрипт динамически регулирует высоту текстового поля в зависимости от количества строк, которые вводит пользователь.

При каждом изменении текста:

1. Высота сбрасывается `height: auto`,
2. Затем вычисляется и устанавливается новая высота равная `scrollHeight`,
3. Добавляется плавная анимация изменения размера для естественного UX.

Также поддерживается автоматическая корректировка при resize окна - если ширина контейнера изменилась, высота пересчитывается.

### Пример реализации

```js
export default function textareaAutoheight() {
  const $textareas = $('textarea.auto-height');
  function adjustHeight($el) {
    $el.css('height', 'auto');
    $el.css('height', $el[0].scrollHeight + 'px');
  }

  $textareas.each(function () {
    adjustHeight($(this));
  });

  $(document).on('input', 'textarea.auto-height', function () {
    adjustHeight($(this));
  });

  $(window).on('resize', function () {
    $textareas.each(function () {
      adjustHeight($(this));
    });
  });
}
textareaAutoheight();
```

### Детали и интеграция

* Работает только с элементами, у которых есть класс `.auto-height`.
Это даёт контроль - можно применять функционал только к нужным текстовым полям.
* Подключение выполняется через общий `app.js` или модуль инициализации UI.
* Используется jQuery для простоты селекторов и делегирования событий.
* Стили вставляются динамически в `<head>`, что избавляет от необходимости создавать отдельный SCSS-файл.

### Пример использования

```js
<form>
  <label>Комментарий:</label>
  <textarea class="auto-height" placeholder="Напишите что-нибудь..."></textarea>
</form>
```

Пользователь начинает вводить текст - поле растягивается вниз по мере увеличения количества строк, не создавая горизонтального или вертикального скролла.

## 6.6 Проверка битых ссылок и `target="_blank"`

Этот модуль помогает поддерживать корректность навигации на сайте и улучшает UX.
Он состоит из двух независимых частей:

1. Проверка внутренних ссылок на наличие ошибок (битые ссылки).
2. Добавление `target="_blank"` ко всем внешним ссылкам (чтобы они открывались в новой вкладке).

Rise использует этот подход, чтобы сайт всегда оставался стабильным, даже если часть страниц была удалена, переименована или временно недоступна.

### Основные задачи

* Предотвратить появление "битых" ссылок, ведущих на несуществующие страницы.
* Повысить безопасность и удобство при переходе по внешним ссылкам.
* Сделать проект устойчивым и SEO-дружественным.

### Преимущества

* Безопасность: исключается случайное открытие внешних ресурсов в том же окне.
* SEO: поисковики не индексируют битые страницы, что улучшает позиции.
* UX: пользователи не сталкиваются с неработающими ссылками.
* Автоматизация: Rise сам контролирует корректность контента без ручной проверки.

## 6.7 Прочие скрипты

* Скрипт для `<svg><use>`. Скрипт нужен для автоматического переноса размеров и `viewBox` из `<symbol>` в сам `<svg>`, который использует этот символ через тег `<use>`.
* Скрипт - типографический автокорректор пробелов.
Он автоматически ставит неразрывный пробел `&nbsp;` после коротких слов, чтобы они не переносились на новую строку.
* Скрипт отвечающий за плавное появление элементов при прокрутке страницы - так называемую анимацию при скролле (scroll reveal effect).
* Скрипт для получения и установки текущего года.
* Скрипт для автоматического сохранения незавершённых форм в localStorage и восстановления после перезагрузки страницы.
* Скрипт для автоматической подстановки временного placeholder'a при отсутствии изображения отсутствует на сервере.

---

# 📦 7. Сборка проекта

В Rise процесс финальной сборки проекта полностью автоматизирован и выполняется через команду `yarn build`.

Если вам требуется отключить минификацию файлов `.js` и `.scss`, нужно отредактировать участок кода в файле `webpack.config.js`.

```js
module.exports = (env) => {
  return {
    optimization: {
      minimize: true, // <- Изменить на false
    }
  }
}
```

## 7.1 Этапы сборки

### 7.1.1 Очистка прошлой сборки

```bash
rimraf build
```

Удаляет старую директорию `build`, чтобы исключить возможные конфликты и устаревшие файлы.
`rimraf` - это кроссплатформенная альтернатива `rm -rf`.

### 7.1.2 Компиляция проекта через Webpack

```bash
webpack --env mode=production --config ./webpack.config --progress
```

Основной этап, где происходит:
* Компиляция `.pug` → `.html` (через pug-loader).
* Компиляция `.scss` → `.css` (через sass-loader и Dart Sass).
* Минификация JS, CSS и HTML.
* Оптимизация изображений.
* Копирование ассетов в `build/assets`.
* Формирование финальной структуры сайта.

В процессе сборки Webpack также:
* Генерирует `manifest.json`.
* Генерирует `sitemap.xml`.
* Генерирует `robots.txt`.
* Собирает отчёты о доступности, производительности, размере файлов и ошибках в контенте.

### 7.1.3 Build Metadata Injector

Этот скрипт автоматически вставляет в `<head>` тег с информацией о текущей сборке:

```bash
yarn production:metatag
```

Запускает Build Metadata Injector

```html
<meta name="build" content="2025.11.06 02:47 (commit a2b9f7e)">
```

Данные берутся из Git (commit hash) и текущего времени.
Позволяет легко отследить, какая версия кода деплоилась и когда.

### 7.1.4 Performance Report - отчёт по весу сборки

```bash
yarn reports:performance
```

После сборки автоматически анализируются все файлы:
* Общий вес JS, CSS, IMG и FONTS.
* Сравнение с предыдущей сборкой (через сохранённый JSON отчёт).
* Если размер вырос более чем на 10%, в консоли выводится предупреждение.

Результаты сохраняются в (`/reports)/performance`)

### 7.1.5 Lighthouse Report - анализ производительности

```bash
yarn reports:lighthouse
```

Запускает Lighthouse в headless-режиме (без браузера).

Lighthouse проверяет:

* Performance
* Accessibility
* Best Practices
* SEO
* Progressive Web App (PWA)

Результаты сохраняются в (`/reports/lighthouse`) в форматах `.html` и `.json`.

### 7.1.6 Accessibility Report (A11y Audit)

```bash
yarn reports:a11y
```

Автоматическая проверка доступности с помощью pa11y или axe-core.

Сканируются все .pug-страницы на наличие:

* alt-тегов у изображений
* корректной структуры заголовков (H1-H6)
* контрастности текста
* aria-атрибутов
* label для input-элементов

Результаты сохраняются в (`/reports/a11y`).

### 7.1.7 Service Worker и Offline Cache

```bash
yarn production:service-worker
```

* Генерирует `service-worker.js` и `offline.html`.
* Реализует стратегию Cache-First:
* При первой загрузке кэширует основные ресурсы (HTML, CSS, JS, IMG).
* При потере сети показывает `offline.html`.

---

# 🧰 8. Инструменты и команды

## 8.1 Основные команды

```bash
yarn dev                                   # запуск локального сервера
yarn build                                 # сборка проекта
yarn prettify:all                          # линтинг всего проекта
```

## 8.2 Команды аналитики

```bash
yarn reports:performance                   # Performance Report: сравнение веса JS, CSS, IMG, FONTS
yarn reports:lighthouse                    # Lighthouse Report (только при запущенном dev)
yarn reports:a11y                          # Accessibility Report через pa11y/axe-core
yarn reports:content                       # Content Report (title, description, alt, SCSS)
```

## 8.3 Сервисные команды

```bash
yarn production:markdown                   # компилятор .md в .pug
yarn production:favicons                   # генерация favicons для проекта
yarn production:service-worker             # генерация service-worker и offline.html

yarn prettify:scss                         # линтинг SCSS
yarn prettify:pug                          # линтинг PUG
yarn prettify:svg                          # линтинг SVG
yarn prettify:staged                       # precommit скрипт
yarn prettify:linkinator                   # проверка всех ссылок проекта
```

## 8.4 Автоматическая генерация компонентов

```bash
yarn constructor my-component              # генерация готового компонента в проект
yarn constructor my-component --rewrite    # перезапись готового компонента в проект
yarn constructor my-component --remove     # удаление готового компонента в проект
```

---

# 🤖 9. Автоматизация и Git-интеграции

## 9.1 Husky precommit linting

### Husky

Система Husky вместе с lint-staged автоматически проверяет и форматирует код перед каждым коммитом.

Это гарантирует, что в репозиторий попадает чистый, согласованный по стилю и безошибочный код - как для JS, так и для SCSS, Pug и Tailwind CSS.

Husky - это инструмент, который управляет Git-хуками. В частности, используется хук `pre-commit`, который срабатывает до того, как изменения попадут в коммит.

```json
"husky": {
  "hooks": {
    "pre-commit": "yarn prettify:staged"
  }
}
```

* `pre-commit` - это событие, на которое Husky реагирует.
* `yarn prettify:staged` - команда, которая запускает lint-staged, проверяющий только изменённые файлы.

Таким образом, при каждом `git commit` Husky автоматически запускает линтинг и форматирование нужных файлов.

### lint-staged

`lint-staged` управляет тем, какие файлы нужно проверить и что именно с ними сделать.
Он работает только с файлами, добавленными в коммит `git add`, что делает процесс быстрым и эффективным.

```json
"lint-staged": {
  "src/**/*.scss": [
    "prettier --write",
    "yarn prettify:scss-files",
    "yarn prettify:stylelint"
  ],
  "src/**/*.pug": [
    "prettier --write",
    "yarn prettify:pug-files",
    "yarn prettify:pug-mixins",
    "yarn prettify:js-defaults"
  ]
}
```

## 9.2 Проверка и форматирование SCSS

Файлы: `src/**/*.scss`

1. `prettier --write` - форматирует SCSS по единому стилю (отступы, кавычки, точки с запятой).
2. `yarn prettify:scss-files` - кастомный скрипт, который проходит по SCSS-файлам и:
    * проверяет порядок свойств.
    * сортирует блоки и миксины в правильном порядке.
    * устраняет дубли и пробелы.
3. `yarn prettify:stylelint` - запускает Stylelint для поиска ошибок в стилях (например, неправильный синтаксис, неиспользуемые переменные и т. д.).

## 9.3 Проверка и форматирование PUG

Файлы: `src/**/*.pug`

1. `prettier --write` - форматирование по стандартам Prettier.
2. `yarn prettify:pug-files` - базовая проверка PUG-файлов: отступы, структура, отсутствие синтаксических ошибок.
3. `yarn prettify:pug-mixins` - линтинг и сортировка миксинов `.pug`, чтобы сохранялся порядок и читаемость.
4. `yarn prettify:js-defaults` - сортировка дефолтных значений для PUG-миксинов из `/src/js/_defaults/`.

## 9.4 Очистка и линтинг

Rise включает автоматическую систему очистки и форматирования кода, которая поддерживает единый стиль проекта, предотвращает накопление мусора в шаблонах и SCSS-файлах, а также помогает избегать ошибок на этапе сборки.

Эта система объединяет инструменты Prettier, Stylelint, а также кастомные скрипты для анализа `.pug` и `.scss` файлов.

### Основные задачи

* Сортировка свойств в PUG миксинах.
* Очистка и оптимизация `.scss` и Tailwind файлов - вычищаются неиспользуемые переменные и классы.
* Автоматическое исправление форматирования - выравнивание кода, единые отступы, кавычки, порядок свойств.
* Автоматический линтинг - проверка синтаксиса и соответствия стайлгайду с помощью Stylelint и Prettier.

### Очистка `.pug` файлов

Rise анализирует шаблоны и компоненты `.pug`, чтобы:

* сортирует свойства в миксинах по алфавиту.
* упорядочить структуру.
* автоматически форматировать отступы и пробелы по единому правилу.

```bash
yarn lint:pug
```

>Этот скрипт проходит по папке `/src/views/` и проверяет все файлы .pug и исправляет ошибки форматирования в соответствии с Prettier.

### Очистка `.scss` и Tailwind файлов

SCSS-файлы проходят через Stylelint и Prettier, а также через дополнительную утилиту, которая:

* выравнивает порядок свойств (order/properties-order).
* упорядочивает структуру.
* сортирует порядок tailwind свойств.

```bash
yarn lint:scss
```

Stylelint использует кастомную конфигурацию Rise `.stylelintrc.js`, где указаны:

* единый стиль для SCSS и Tailwind.
* сортировка свойств по группам (позиционирование → оформление → текст).

## 9.5 Smart Watcher

Smart Watcher - это умный наблюдатель за изменениями файлов в проекте Rise, который пересобирает только реально изменившиеся файлы, минимизируя время сборки и увеличивая продуктивчность разработки.

Он особенно полезен для больших проектов с множеством компонентов, где обычная пересборка всего проекта занимает много времени.

### Преимущества

* Экономия времени: пересборка только нужных файлов вместо полного проекта.
* Простая интеграция с dev-сервером: обновления видны сразу в браузере.
* Чистая архитектура: минимизируется риск случайного перезаписывания не связанных файлов.
* Лёгкое масштабирование: удобно работать с большими проектами, где много страниц и компонентов.

### Основные принципы работы

1. Отслеживание зависимостей компонентов

    Smart Watcher анализирует:

    * какие .pug-миксины подключены на страницах;
    * какие SCSS-файлы подключены к каждому компоненту;
    * какие JS-модули используются на конкретных страницах.

2. Выборочная пересборка

    * Если изменился компонент `header.pug`, пересобираются только страницы, где этот компонент используется.
    * Если изменился `hero.scss`, пересобирается только CSS, связанный с этим компонентом.
    * JS-файлы тоже пересобираются локально, если изменился модуль, который используется на странице.

3. Поддержка динамических страниц

Smart Watcher учитывает вложенные страницы и секции. Например:

```bash
/blog/post.pug → зависит от header.pug и footer.pug
/products/item.pug → зависит от header.pug и product.scss
```

Изменение `header.pug` → пересборка `/blog/post.pug` и `/products/item.pug`.
Изменение `product.scss` → пересборка CSS только для `/products/item.pug`.

---

# 🧾 10. SEO и контент

## 10.1 Генерация sitemap.xml

Файл `sitemap.xml` - это один из ключевых инструментов SEO.

Он сообщает поисковым системам (Google, Yandex, Bing и т. д.), какие страницы существуют на сайте и как часто они обновляются.

Rise автоматически создаёт sitemap при сборке проекта, поэтому вручную ничего добавлять не нужно.
Это помогает поисковым системам индексировать все страницы сайта.

### Как это работает

При выполнении команды:

```bash
yarn build
```

система автоматически генерирует файл `sitemap.xml` и помещает его в директорию:

```bash
/build/sitemap.xml
```

В процессе сборки Rise анализирует все шаблоны страниц (`.pug` или `.html`) в директории `/src/views/pages/`, формирует список URL и добавляет их в карту сайта.

### Пример автоматически созданной карты сайта

```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourwebsite.ru/</loc>
    <lastmod>2025-11-05</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://yourwebsite.ru/about</loc>
    <lastmod>2025-11-05</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://yourwebsite.ru/blog</loc>
    <lastmod>2025-11-05</lastmod>
    <changefreq>monthly</changefreq>
  </url>
</urlset>
```

### Настройка домена

```bash
https://yourwebsite.ru
```

Чтобы карта сайта содержала актуальные ссылки вашего проекта, нужно изменить базовый адрес в конфигурации Webpack.

Откройте файл `webpack.config.js` и найдите блок с подключением плагина `SitemapGenerator`:

```js
plugins: [
  new SitemapGenerator({
    baseUrl: pager.isDevMode(MODE)
      ? 'http://localhost:8080'
      : 'https://yourwebsite.ru', // <- здесь нужно заменить на реальный домен
    viewsDir: path.resolve(__dirname, 'src/views'),
    output: path.resolve(__dirname, 'build/sitemap.xml'),
  }),
]
```

### Как правильно указать домен

Если вам уже известен продакшен домен, замените строку:

```bash
'https://yourwebsite.ru'
```

на актуальный адрес вашего сайта.

После этого, когда сборка проекта будет создана, sitemap будет содержать ссылки именно на ваш продакшен домен, что позволит поисковым системам корректно индексировать страницы.

## 10.2 Генерация robots.txt

Файл `robots.txt` сообщает поисковым системам, какие страницы вашего сайта разрешено индексировать, а какие — нет.

Rise автоматически создаёт этот файл на основе конфигурации в `webpack.config.js`, что упрощает работу с SEO и исключает ошибки ручного редактирования.

### Как это работает

1. Путь сохранения — Rise создаёт файл `robots.txt` в корневой директории build при каждой сборке
2. Правила индексации — policy указывает, какие страницы разрешены или запрещены для роботов.
    * `userAgent: "*"` — правило применяется ко всем поисковым системам.
    * `allow: "/"` — разрешает индексировать все страницы.
    * Можно использовать `disallow: "/private"` для запрета индексации отдельных разделов.
3. Ссылка на sitemap — поисковики автоматически узнают местоположение карты сайта.
4. Хост сайта — указывает основной адрес вашего проекта.

### Пример автоматически сгенерированного файла

```bash
User-agent: *
Allow: /

Sitemap: http://localhost:8080/sitemap.xml
Host: http://localhost:8080/
```

### Настройка домена

Чтобы `robots.txt` содержал актуальные ссылки вашего проекта, нужно изменить базовый адрес в конфигурации Webpack.

Откройте файл `webpack.config.js` и найдите блок с подключением плагина `RobotstxtPlugin`:


```js
new RobotstxtPlugin({
  filePath: './robots.txt',
  policy: [
    {
      userAgent: '*',
      allow: '/',
    },
  ],
  sitemap: `${pager.isDevMode(MODE)
    ? 'http://localhost:8080'
    : 'https://yourwebsite.ru'}/sitemap.xml`,
  host: pager.isDevMode(MODE)
    ? 'http://localhost:8080'
    : 'https://yourwebsite.ru',
}),
```

### Как правильно указать домен

Если вам уже известен продакшен домен, замените строку:

```bash
'https://yourwebsite.ru'
```

на актуальный адрес вашего сайта.

## 10.3 Manifest.json и .htaccess

В проектах на Rise автоматически создаются файлы `manifest.json` и `.htaccess`, которые помогают управлять поведением сайта, его кэшированием, редиректами, а также интеграцией с PWA (Progressive Web App).

### Manifest.json

Файл `manifest.json` используется для настройки Progressive Web App (PWA), значков приложения и метаданных, которые браузеры и устройства используют при добавлении сайта на главный экран.

Пример конфигурации:

```js
const { RawSource } = require('webpack').sources;

class ManifestGenerator {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('GenerateManifestPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'GenerateManifestPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const icons = [36, 48, 72, 96, 144, 192, 256, 384, 512].map(size => ({
            src: `/assets/images/favicons/android-chrome-${size}x${size}.png`,
            sizes: `${size}x${size}`,
            type: 'image/png',
          }));

          const manifest = {
            name: 'Rise',
            short_name: 'Rise',
            icons,
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
          };

          const json = JSON.stringify(manifest, null, 2);
          compilation.emitAsset('manifest.json', new RawSource(json));
        }
      );
    });
  }
}

module.exports = ManifestGenerator;
```

### Что делает плагин:

* Генерирует файл `manifest.json` при сборке.
* Создаёт и подключает иконки разного размера для PWA.
* Устанавливает основные метаданные: `name`, `short_name`, `theme_color`, `background_color`, `display`.
* Позволяет вашему сайту работать как самостоятельное приложение на устройствах с поддержкой PWA.

### Пример сгенерированного файла manifest.json:

```json
{
  "name": "Rise",
  "short_name": "Rise",
  "icons": [
    { "src": "/assets/images/favicons/android-chrome-36x36.png", "sizes": "36x36", "type": "image/png" },
    { "src": "/assets/images/favicons/android-chrome-48x48.png", "sizes": "48x48", "type": "image/png" },
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

### .htaccess

Файл `.htaccess` отвечает за правила редиректа, обработку ошибок сервера и кэширование. В Rise он создаётся автоматически или может быть настроен вручную.

Пример конфигурации:

```apache
ErrorDocument 404 https://yourwebsite.ru/404
ErrorDocument 500 https://yourwebsite.ru/500

RewriteEngine On

# Перенаправление HTTP → HTTPS
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI}

# Добавление расширения .html к страницам без него
RewriteRule ^(\w+)$ $1.html [NC]

# Перенаправление с www на основной домен
RewriteCond %{HTTP_HOST} ^www\.(.*)$
RewriteRule ^(.*)$ http://%1/$1 [L,R=301]
```

Что делает каждая часть:

* ErrorDocument 404 / 500 — настраивает кастомные страницы ошибок для пользователей.
* HTTP → HTTPS — обеспечивает безопасность соединения.
* Добавление .html — упрощает работу с адресами без указания расширений.
* Редирект с www — предотвращает дублирование страниц и улучшает SEO.

## 10.4 Build Metadata Injector

Вставляет метатег с информацией о билде:

```html
<meta name="build" content="2025.10.19 22:47 (commit a2b9f7e)">
```

## 10.5 Content Report

Проверяет контент перед релизом:

* title и description в `.pug`
* наличие alt у изображений
* неиспользуемые SCSS-переменные

Cохраняет отчёты в (`/reports/content`).

## 10.6 Генерация статей из `.md`

Статьи в `/src/markdown` компилируются в страницы `.pug` автоматически при сборке, а в дальнейшем конвертируются из Markdown в HTML с метаданными для SEO.

---

# 🪄 11. Оптимизация и производительность

## 11.1 Автоматическая оптимизация изображений

При добавлении изображений в папку `images`, автоматически конвертирует в формат `.webp`, а также создаёт превью.

* Конвертиртация в `.webp`
* Создание превью для `<picture>`
* Ресайз до максимальной ширины

## 11.2 PurgeCSS

* Очищает неиспользуемый CSS из Tailwind/SCSS.

Настройка в `webpack.config.js`:

```js
purge: ['**/*.html', '**/*.js']
```

Cохраняет отчёты в ()`/reports/css-purge`).

## 11.3 Performance Report

Отслеживает рост веса файлов:

* если JS/CSS/IMG/FONTS увеличились >10%, выводит предупреждение

Cохраняет отчёты в ()`/reports/performance`).

## 11.4 Lighthouse Report

Аудит производительности и SEO (только при запущенном dev), сохраняет отчёты в (`/reports/lighthouse`).

## 11.5 Умное кэширование через Service Worker

Файл `service-worker.js` автоматически генерируется при сборке и отвечает за оффлайн-работу сайта, кэширование ресурсов, ускорение загрузки и безопасную работу с API. Он сочетает стратегии cache-first, network-first, автоматическую инвалидацию кэша и интеллектуальное хранение данных DatoCMS.

### Основные возможности:

* кэширование статических файлов (CSS, JS, изображения, шрифты)
* network-first обработка HTML-страниц
* генерация страницы `offline.html`
* кэширование POST-запросов к DatoCMS с TTL
* хеширование всего кэша на основе файлов билда
* автоматическое удаление старых версий кеша

Пример регистрация на сайте:

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/assets/js/base/common/service-worker.js')
      .then(reg => console.log('[SW] Registered', reg))
      .catch(err => console.error('[SW] Registration failed', err));
  });
}
```

Как работает система:

* Cache-first для ассетов: статические файлы загружаются из кэша и обновляются в фоне.
* Network-first для HTML: страницы всегда стремятся загрузиться из сети, но fallback — из кэша.
* Offline fallback: если страница не найдена ни в сети, ни в кэше, отображается `offline.html`.
* DatoCMS кэширование: POST-запросы к `https://graphql.datocms.com/` хэшируются, хранятся 10 минут и работают оффлайн.
* Автоинвалидация: при каждом билде формируется новый CACHE_NAME, основанный на хеше содержимого всех файлов.

---

# 📂 12. Файловая структура

- `build`: Динамическая директория которая создаётся при выполнении команды `yarn build`. Сборка проекта будет размещена здесь и готова к установке на сервер. Никаких изменений здесь не требуется.
- `node_modules`: Содержит все зависимости проекта. **Не следует изменять какие-либо файлы.**
- `plugins`: Вспомогательные скрипты.
  - `constructor`: Директория конструктора секций.
    - `components`: Библиотека готовых секций.
    - `constructor.js`: Скрипт подключения секций.
  - `optimization`: Скрипты для оптимизации проекта.
    - `aliases.js`: Алиасы для проекта. Можно настроить под себя.
    - `css-purge.js`: Скрипт очистки и оптимизации CSS при сборке проекта.
    - `images.js`: Скрипт оптимизации изображений в формат `.webp`.
  - `prettify`: Скрипты для линтинга.
    - `js-defaults.js`: Скрипт для форматирования и сортировки дефолтных свойств миксинов.
    - `linkinator.js`: Скрипт для проверки доступности всех ссылок проекта.
    - `pug-files.js`: Небольшой линтер для `.pug` файлов.
    - `pug-mixins.js`: Скрипт для форматирования `.pug` миксинов.
    - `scss-files.js`: Небольшой линтер для `.scss` файлов.
    - `svg.js`: Небольшой линтер для инлайновых тэгов `<svg>` в `.pug` файлах.
  - `production`: Скрипты для оптимизации билда.
    - `favicons-generator.js`: Скрипт для автоматический генерации favicons.
    - `manifest.js`: Скрипт добавляет файл `manifest.json` при сборке проекта.
    - `markdown.mjs`: Скрипт с генерацией `.md` файлов и созданием мета контента для них.
    - `metatag.js`: Скрипт добавляет метатег с информацией о текущем билде.
    - `relative-paths.js`: Скрипт для перезаписывания ссылок в проекте и их актуализация если проект необходимо просмотреть без запуска сервера.
    - `service-worker.js`: Скрипт генерации `service-worker`.
    - `sitemap.js`: Скрипт генерации карты сайта.
  - `reports`: Скрипты для создания отчётов.
    - `a11y`: Генератор отчёта о доступности.
    - `content`: Генератор отчёта о контенте.
    - `lighthouse`: Генератор отчёта lighthouse (работает только в dev-режиме).
    - `performance`: Генератор отчёта о размерах файлов.
- `reports`: Директория для отчётов.
  - `a11y`: Отчёт о доступности.
  - `constructor`: Отчёт о готовых компонентах в конструкторе с их скриншотами.
  - `content`: Отчёт о контенте.
  - `css-purge`: Отчёт об оптимизации при сборке проекта.
  - `lighthouse`: Отчёт lighthouse.
  - `performance`: Отчёт о размерах файлов.
- `src`: Содержит весь исходный код. Ресурсы, `.js`, `.pug`, `.scss` и т. д. **Любые изменения, которые вы хотите внести на веб-сайт, должны быть сделаны здесь.**
  - `assets`: Ресурсы. Шрифты, изображения, файлы и прочее.
    - `fonts`: Директория с шрифтами.
      - `fontawesome`: Библиотека иконочного шрифта.
        - `font`: Директория с шрифтом.
        - `styles`: Стили и подключения шрифта.
      - `Inter`: Основной шрифт.
    - `images`: Директория с изображениями.
      - `favicons`: Директория для фавиконок.
      - `icons`: Готовые `svg` иконки для проекта.
      - `logos`: Готовые `svg` логотипы для проекта.
      - `logo.svg`: Иконка сайта.
    - `js`: Директория для файлов `.js`. (Можно создать любую структуру).
      - `_defaults`: Функционал подстановки дефолтных данных для `.pug` миксинов в случае их вызова с недостающими параметрами или без них вовсе.
        - `article`: Директория с дефолтными значениями миксина `article`.
          - `_defaults.js`: Файл с дефолтными значениями миксина `article`.
        - `title`: Директория с дефолтными значениями миксина `title`.
          - `_defaults.js`: Файл с дефолтными значениями миксина `title`.
      - `base`: Основные базовые скрипты проекта.
        - `common`: Директория с базовыми функциями.
          - `form-autosave.js`: Скрипт для автоматического сохранения незавершённых форм в localStorage и восстановления после перезагрузки страницы.
          - `get-current-year.js`: Скрипт для получения текущего года.
          - `get-header-height.js`: Скрипт для получения высоты хедера.
          - `load-images.js`: Скрипт для блюра изображений пока они полностью не загрузились.
          - `placeholder-iamges`: Скрипт для автоматической подстановки временного placeholder'a при отсутствии изображения отсутствует на сервере.
          - `preloader.js`: Скрипт прелоадера.
          - `scroll-reveal.js`: Скрипт для плавного появления элементов.
          - `service-worker.js`: Скрипт подключения `service-worker`.
          - `set-header-bg.js`: Скрипт для установки активного класса для `<header>`.
          - `set-nbsp.js`: Скрипт для установки `&nbsp;` после предлогов.
          - `set-svg-size.js`: Скрипт для установки размеров для `svg`.
          - `set-theme.js`: Скрипт для переключения на светлую/темную тему.
          - `smooth-scroll.js`: Скрипт для плавного скролла к якорным ссылкам.
          - `textarea-autoheight.js`: Скрипт для автоматической установки высоты `<textarea>`.
        - `routing`: Функционал для переходов по страницам.
          - `routing.js`: Главная функция.
          - `routingFunctions.js`: Функция, которая содержит другие функции для их перезапуска в `barba.js`.
        - `validation`: Директория со скриптами проверок.
          - `validation-current-page.js`: Проверка на какой странице находится пользователь.
          - `validation-internal-links.js`: Скрипт проверки ответа от страницы и установки ошибки 404, если ответ отсутствует.
          - `validation-offline.js`: Скрипт для отображения баннера "Вы офлайн".
          - `validation-target.js`: Проверка внешних ссылок и добавление к ним `target="_blank"`.
      - `cache`: Кэш.
        - `image-cache.js`: Файл кэша изображений.
      - `app.js`: Основной файл подключения скриптов.
    - `styles`: Директория для файлов `.scss`. (Можно создать любую структуру).
      - `base`: Базовые стили.
        - `fonts.scss`: Подключение шрифтов и их переменные.
        - `global.scss`: Глобальные стили.
        - `typography.scss`: Файл настройки стилей для тегов контента.
        - `variables.scss`: Переменные.
      - `custom-components`: Директория компонентов (файлы которые можно переиспользовать по всему проекту).
        - `blog.scss`: Компонент на странице блога.
        - `footer.scss`: Компонент футера.
        - `header.scss`: Компонент хедера.
        - `intro.scss`: Компонент блока на главной странице.
        - `not-found.scss`: Компонент на странице ошибки.
      - `mixins`: Части файлов или "Примеси" `.scss`, которые можно легко переиспользовать. Содержат небольшие фрагменты стилей для примесей `.pug`.
        - `article.scss`: Миксин записи.
        - `mixins.scss`: Основные миксины.
        - `title.scss`: Миксин заголовка.
      - `utils`: Утилиты.
        - `keyframes.scss`: Анимации созданные с помощью @keyframes.
        - `reset.scss`: Файл для сброса стандартных стилей назначенных браузером (Использовать в случае если в проекте не подключён Tailwind).
      - `app.scss`: Основной файл подключения стилей.
    - `videos`: Директория с видео.
  - `markdown`: Директория с файлами `.md`.
    - `post.md`: Пример записи 1.
    - `post2.md`: Пример записи 2.
    - `post3.md`: Пример записи 3.
  - `views`: Файлы `.pug`. (Можно создать любую структуру).
    - `custom-components`: Компоненты (файлы которые можно переиспользовать по всему проекту).
      - `blog.pug`: Компонент на странице блога.
      - `favicons`: Компонент сгенерированный скриптом `favicons-generator.js` со всеми подключениями иконок.
      - `footer.pug`: Компонент футера.
      - `header.pug`: Компонент хедера.
      - `intro.pug`: Компонент блока на главной странице.
      - `not-found.pug`: Компонент на странице ошибки.
    - `layouts`: Основные файлы шаблонов. Здесь также можно создать разные темы для сайта.
      - `master.pug`: Главный шаблон.
    - `mixins`: Части файлов или "Примеси" `.pug`, которые можно легко переиспользовать. Необходимы для того, чтобы избежать повторения кода в каждом файле.
      - `article.pug`: Миксин записи.
      - `title.pug`: Миксин заголовка.
    - `pages`: Шаблоны страниц.
      - `blog`: Динамическая директория со статьями генерируемых из `.md` файлов из директории `/src/markdown`.
        - `post.pug`: Сгенерированный "Пример записи 1".
        - `post2.pug`: Сгенерированный "Пример записи 2".
        - `post3.pug`: Сгенерированный "Пример записи 3".
      - `404.pug`: Шаблон страницы ошибки.
      - `blog.pug`: Шаблон страницы блога.
    - `index.pug`: Шаблон главной страницы.
  - `bundle.js`: Корневой файл подключения ресурсов, объединяющий в себя CSS и JS.
- `.babelrc`: Конфигурационный файл Babel.
- `.editorconfig`: Используется для установки конфигурации кода редактора, например, использования пробелов вместо табуляции, набора символов, файлов и т. д.
- `.gitignore`: Здесь можно указать, какие файлы или директории не должны отслеживаться `git`, это означает, что файл или директория, записанные в этом файле, не будут помещены в репозиторий, например, директория `/node_modules` и `/build`.
- `.htaccess`: Файл настроек редиректов.
- `.nvmrc`: Файл с версией NodeJS данного шаблона.
- `.prettierignore`: Файл с путями, которые Prettier не должен форматировать.
- `.stylelintrc.json`: Конфигурационный файл Stylelint.
- `LICENSE`: Файл лицензии.
- `package.json`: Когда вы запускаете команду `yarn`, шаблон установит все зависимости, которые перечислены в этом файле с соответствующей версией. Если необходимо добавить другие зависимости, можно сделать это, выполнив команду `yarn add название_зависимости -D`. Новая зависимость будет установлена в директорию `/node_modules`, а `package.json` будет обновлен с добавлением новой строки. Также он содержит все команды для запуска и сборки проекта.
- `pager.js`: Файл для определения режимов разработки/сборки и генерации путей для вложенных файлов `.pug`.
- `postcss.config.js`: Конфигурационный файл PostCSS.
- `prettier.config.js`: Конфигурационный файл Prettier.
- `README.md`: Файл описания шаблона.
- `robots-txt.config.js`: Конфигурационный файл для генерации `robots.txt`
- `tailwind.config.js`: Конфигурационный файл библиотеки `tailwind.css`.
- `webpack.config.js`: Это один из самых важных файлов шаблона, потому что именно он создает сборку, а также среду разработки, компилируя файлы `.scss` и `.pug` в код `.css` и `.html`, а также минимизирует все файлы и создает карту сайта в директорию `/src`.
- `yarn.lock`: Ссылки на все зависимости шаблона.