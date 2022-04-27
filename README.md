# 🌱 Rise - Гибкий шаблон для разработки сайтов и приложений.

## ⚙ Технологии

#### ⛓ Главные зависимости

- **NodeJS**: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
  - Чтобы запустить проект на локальном компьютере, нужно установить NodeJS версии 14 или выше. По ссылке выше можно загрузить исполняемый файл для своей операционной системы и установить его.
- **Yarn**: [https://yarnpkg.com](https://yarnpkg.com)
  - Для установки пакетного менеджера Yarn необходимо открыть ваш проект в редакторе кода, например, Visual Studio Code и выполнить в консоли команду `brew install yarn` или следовать специальному руководству для ОС [https://yarnpkg.com/lang/en/docs/install/](https://yarnpkg.com/lang/en/docs/install/).
- **Webpack**: [https://webpack.js.org](https://webpack.js.org)
  - Сборщик модулей для управления всеми зависимостями сайта (необходимая версия 5 или выше).

#### 🛠 Препроцессоры:

- **PUG**: [https://pugjs.org](https://pugjs.org) 
  - Это механизм шаблонов и самый быстрый способ написания HTML. Предоставляет возможность писать миксины для более модульного подхода к верстке, использовать переменные, циклы, условия и многое другое.
- **SCSS**: [https://sass-scss.ru](https://sass-scss.ru) 
  - Это препроцессор CSS, который используется для написания стилей, позволяет использовать переменные, импорты, миксины и наследование.

#### 🎨 CSS

- **reset.css**: [reset.css](https://gist.github.com/DavidWells/18e73022e723037a50d6)
  - Библиотека для сброса стандартных стилей назначенных браузером.
- **tailwind.css**: [https://tailwindcss.com](https://tailwindcss.com)
  - CSS-фреймворк, ориентированный на утилиты, содержит множество классов, которые можно скомпоновать для создания любого дизайна прямо в разметке. А также возможно использовать директивы, например, `@apply` и функции, например, `theme()`.

#### 🔧 JS

- **Barba.js**: [https://barba.js.org](https://barba.js.org)
  - Небольшая и простая в использовании библиотека, которая поможет создавать плавные переходы между страницами веб-сайта, а также более детально настраивать роутинг.
- **Gsap.js**: [https://greensock.com/gsap](https://greensock.com/gsap)
  - Набор инструментов для реализации анимации любого уровня сложности.
- **jQuery.js**: [https://jquery.com](https://jquery.com)
  - Быстрая, небольшая и многофункциональная библиотека. Она значительно упрощает такие вещи, как обход и манипулирование документами HTML, обработку событий, анимацию и Ajax, с помощью простого в использовании API, который работает во множестве браузеров.
- **Lottie-Web.js**: [http://airbnb.io/lottie](http://airbnb.io/lottie)
  - Библиотека для работы с анимациями анимации Adobe After Effects, экспортированную в формате `.json` с помощью Bodymovin.
- **ScrollReveal.js**: [https://scrollrevealjs.org](https://scrollrevealjs.org/)
  - Библиотека для анимации элементов по мере их прокрутки в поле зрения.
- **Smooth-Scroll.js**: [Smooth-Scroll.js](https://github.com/cferdinandi/smooth-scroll)
  - Легкий скрипт для анимации прокрутки к якорным ссылкам.

#### 🖋 Шрифты

- **FontAwesome 6**: [https://fontawesome.com](https://fontawesome.com)
  - Иконочный шрифт. Использовать его можно так: `i.fa.fa-argle-right`, также присутствуют другие категории `fa-solid, fa-regular, fa-light, fa-thin, fa-duotone, fa-brands`.

- **GraphikLCG**: [GraphikLCG](https://gist.github.com/mfd/e7842774e037edf15919037594a79b2b)
  - Основной шрифт. Изменить его можно в файле `/assets/styles/base/_fonts.scss`

#### 🖼 Иконки

- **Feather-Icons**: [https://feathericons.com](https://feathericons.com/)
  - Коллекция иконок.
- **UseAnimations**: [https://useanimations.com](https://useanimations.com/)
  - Анимирование иконок Feather в Lottie Web.

## ✨ Установка и запуск

#### 🔗 Установка зависимостей

- **Webpack** и **Webpack Dev Server**: 
  - Необходимо установить `Webpack и Webpack Dev Server` с помощью `yarn global add webpack webpack-dev-server`.
  - Затем нужно запустить процесс `yarn install` для того чтобы привязать все зависимости в проекте.

#### 👨‍💻 Процесс разработки

1. Необходимо склонировать проект командой `git clone git@github.com:wotkad/rise.git` в директорию с проектами и изменить её название на актуальное.
2. Открыть директорию `название проекта` в редакторе кода.
3. Установить все зависимости командой `yarn install`.
4. Запустить процесс разработки в проекте можно командой `yarn dev`. (для запуска проекта в своей локальной сети, следует вместо этого запустить `yarn dev-network`, а с помощью IP-адреса хост-компьютера (его необходимо указать в файле `package.json` для команды `dev-network`) можно получить доступ к проекту на других устройствах).
5. Проверьте доступность страниц.
6. Выполните все необходимые модификации.

#### 📄 Добавление страниц

7. Для добавления страницы необходимо создать её в директории `/views` в необходимом месте, после этого необходимо нажать `CTRL + C` чтобы остановить процесс разработки и запустить команду `yarn dev` для повторного запуска.
8. Для создания любого раздела, например, `/products/product`, где `/products` - раздел, нужно в файле `webpack.config.js`, в объект `plugins`, добавить строчку `...utils.pages(MODE, "products")`.

#### 📦 Сборка проекта

9. Для начала сборки проекта необходимо нажать `CTRL + C` чтобы остановить сервер разработки и запустить команду `yarn build` - сборка будет создана в директорию `/dist`.

#### 🔬 Тестирование

10. Тестирование возможно через `http-server` установив его командой `yarn global add http-server`. Выполнив команду `npx http-server -p 9090 ./dist`, по URL-адресу `http://localhost:9090` можно увидеть сборку в действии.
11. Broken Link Checker - Скрипт для проверки работоспособности ссылок на всём сайте (выполните команду `node blc` при запущенном проекте).

## 📂 Файловая структура

- `dist`: Сборка будет размещена здесь и готова к установке на сервер. Никаких изменений здесь не требуется, так как она автоматически генерируется из исходных файлов.
- `node_modules`: Содержит все зависимости javascript. **Не следует изменять какие-либо файлы.**
- `src`: Весь исходный код содержится здесь. Ресурсы, `.js`, `.scss`, `.pug` и т. д. **Любые изменения, которые вы хотите внести на веб-сайт, должны быть сделаны здесь.**
  - `assets`: Основная рабочая директория.
    - `files`: Может содержать файлы `.pdf`, `.doc` и прочие.
    - `fonts`: Шрифты.
    - `images`: Изображения.
    - `js`: Скрипты. (Можно создать любую структуру).
      - `animations`: `.json` файлы от UseAnimations для анимирования с помощью Lottie Web.
      - `linksChecker`: Проверка ссылок.
        - `checkInternalLinks`: Проверка внутренних ссылок на 404-ю ошибку.
        - `isCurrentPage`: Проверка на какой странице находится пользователь.
      - `preloader`: Скрипт прелоадера.
      - `routing`: Функционал для переходов по страницам.
      - `scroll`: Функционал скролла.
        - `scrollReveal`: Скрипт для плавного появления элементов.
        - `smoothScroll`: Скрипт для плавного скролла к якорным ссылкам.
      - `app.js`: Основной файл со скриптами.
    - `styles`: Файлы `.scss`. (Можно создать любую структуру).
      - `base`: Базовые стили.
        - `fontawesome`: Стили шрифтов fontawesome.
        - `_dimensions`: Переменные основных размерностей.
        - `_fonts`: Подключение шрифтов и их переменные.
        - `_global`: Глобальные стили.
        - `_palette`: Палетта переменных цветов.
      - `components`: Компоненты (файлы которые можно переиспользовать по всему проекту).
      - `pages`: Детальные стили для каждой отдельной страницы.
      - `utils`: Утилиты.
        - `_keyframes`: Анимации созданные с помощью @keyframes.
        - `_mixins`: Миксины.
      - `_app`: Основной файл подключения скритов.
  - `markdown`: Директория `.md` файлов.
    - `build`: Динамическая директория с файлами генерируемая из файлов директории `/src/markdown/constructor`.
    - `constructor`: Директория с функционалом для генерации `.pug` из `.md` файлов.
      - `decs.d.mts`: Файл декларирования модулей.
      - `index.mts`: Файл с генерацией `.md` файлов, шаблона статьи и мета контента для них.
      - `markdown.mts`: Основной конфигурационный файл markdown.
    - `docs`: Директория с файлами `.md`.
  - `scripts`: Вспомогательные скрипты.
    - `changeSitemapUrls.js`: Скрипт для изменения адресов `http://localhost:8080` в карте сайта на актуальный адрес (актуальный адрес необходимо указать в этом файле в константе `realUrl`).
    - `renameJsFiles.js`: Скрипт для переименования файлов из `.js` в `.mjs` расширения в директории `/src/markdown/build`.
    - `replaceErrorPageDist`: Скрипт для создания файла `/404.html` в режиме сборки - `/dist`.
  - `views`: Файлы `.pug`. (Можно создать любую структуру).
    - `components`: Компоненты (файлы которые можно переиспользовать по всему проекту).
    - `layouts`: Основные файлы шаблонов. Здесь также можно создать разные темы для сайта.
    - `mixins`: Фрагменты файлов `.pug`, которые используются для той же цели, что и макеты, а именно для того, чтобы избежать повторения кода в каждом шаблоне и вместо этого использовать микширование для размещения одного и того же компонента и т. д., просто передавая атрибут для каждого один раз.
    - `pages`: Шаблоны страниц.
      - `blog`: Динамическая директория со статьями генерируемая из `.md` файлов из директории `/src/markdown/docs`.
    - `index.pug`: Шаблон главной страницы.
  - `bundle.js`: Основной файл объединяющий в себя CSS и JS для более быстрой работы сайта.
  - `sitemap.xml`: Карта сайта.
- `.babelrc`: Конфигурационный файл Babel.
- `.editorconfig`: Используется для установки конфигурации кода редактора, например, использования пробелов вместо табуляции, набора символов, файлов и т. д.
- `.gitignore`: Здесь можно указать, какие файлы/директории не должны отслеживаться `git`, это означает, что файл/директория, записанные в этом файле, не будут помещены в репозиторий, например, директория `/node_modules` и `/dist`.
- `.nvmrc`: Файл с версией NodeJS данного проекта.
- `blc.js`: Скрипт для проверки работоспособности ссылок на всём сайте.
- `README.md`: Файл описания шаблона.
- `package.json`: Когда вы запускаете команду `yarn install`, установленными пакетами являются те, которые перечислены в этом файле с версией, которая была установлена, если нужно добавить больше пакетов, можно сделать это, выполнив команду `yarn add название_пакета --save`, затем новый пакет будет установлен в директорию `/node_modules`, а `package.json` будет обновлен с добавлением новой строки пакета, также он содержит все команды для запуска и сборки проекта.
- `postcss.config.js`: Конфигурационный файл PostCSS.
- `tailwind.config.js`: Конфигурационный файл библиотеки `Tailwind.css`.
- `tsconfig.json`: Конфигурационный файл `TypeScript`.
- `utils.js`: Файл для определения режимов разработки/сборки и генерации путей для вложенных файлов `.pug`.
- `webpack.config.js`: Это один из самых важных файлов проекта, потому что именно он создает сборку, а также среду разработки, компилируя файлы `.scss` и `.pug` в код `.css` и `.html`, а также минимизирует все файлы и создает карту сайта в директорию `/src`.

#### 📑 Шаблоны

- `/`: Главная
- `/blog`: Блог
- `/blog/post`: Статья
- `/404`: Страница ошибки
