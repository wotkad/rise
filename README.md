# 🥥 Rise - Гибкий шаблон для разработки веб-сайтов и приложений.

**Rise** - это быстрый, лёгкий в использовании и настройке шаблон, с помощью которого можно реализовать проект любой сложности, от лендинга до высоконагруженного сервиса.

Шаблон значительно упрощает такие вещи, как сборка проекта, поиск необходимых библиотек для старта проекта, генерацию карты сайта, настройку базового SEO, настройку архитектуры проекта, а также предлагает создание контента в формате `.md`.

**Шаблон включает в себя:**
- Шаблонизацию в `.pug` и `.scss`
- Простое подключения библиотек `css` и `js`
- Удобную архитектуру
- Генерацию статей в формате `.md`
- Легкую настройку начального SEO
- Тестирование
- и многое другое...

Для начала работы необходимо [установить зависимости](https://github.com/wotkad/rise?tab=readme-ov-file#-%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0-%D0%B8-%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA).

## ✨ Установка и запуск

#### 🔗 Установка зависимостей
- **Node.js**: [https://nodejs.org/en/download](https://nodejs.org/en/download)
  - Для запуска шаблона на локальном компьютере необходим Node.js, его можно скачать по ссылке выше (версия 19.7.0 или выше).
- **Yarn**: [https://yarnpkg.com/lang/en/docs/install](https://yarnpkg.com/lang/en/docs/install)
  - Далее нужно выполнить в консоли команду `brew install yarn` для установки Yarn или следовать специальному руководству по ссылке выше.

#### 👨‍💻 Запуск шаблона

1. Для начала работы требуется создать новый репозиторий на основе шаблона.
2. Открыть директорию `название проекта` в редакторе кода.
3. Выполнить команду `yarn one-page` для одностраничного проекта или `yarn multi-page` для многостраничного.
4. Обновить зависимости запустив команду `yarn`.
5. Запустить процесс разработки в проекте можно командой `yarn dev`.
6. Приступить к разработке.

#### 📄 Добавление страниц

- Для создания новой страницы, необходимо создать её в директории `/views/pages`, после этого необходимо остановить проект и выполнить команду `yarn dev` для повторного запуска.
- Для создания любого раздела, например, `/products/product`, где `/products` - родительский раздел, а `/product` - дочерняя, нужно в файле `webpack.config.js`, в объект `plugins`, добавить код `...utils.pages(MODE, "products")`.

#### 🗺️ Карта сайта

- Для добавления карты сайта в проект необходимо поменять значиение константы `realUrl` на актуальный адрес сайта в файле `node_scripts/changeSitemapUrls.js`.

#### 📦 Сборка проекта

- Для сборки проекта необходимо выполнить команду `yarn build` - проект будет создан в директорию `/build`.
- При дальнейшей необходимости создания архива из папки `build`, необходимо запустить скрипт `yarn archive-paths` для обновления путей до всех ресурсов (папка `assets`), чтобы `.html` файлы корректно отображались.

#### 🔬 Тестирование

- В шаблоне есть 2 вида линтеров, для `.pug` файлов и для `.scss`. Запустить их можно командой `yarn lint:all`, либо по отедельности `yarn lint:pug` и `yarn lint:scss`. При сборке проекта команда выполняется по умолчанию.
- Тестирование проекта возможно через `http-server`. Для начала необходимо собрать проект командой `yarn build`. Далее, выполнив команду `npx http-server -p 9090 ./build`, по URL-адресу `http://localhost:9090` будет запущен рабочий проект.
- Также можно протестировать доступность всех ссылок проекта благодаря пакету `linkinator`. Запустить скрипт можно командой `yarn linkinator`.

#### 📂 Файловая структура

- `build`: Динамическая директория которая создаётся при выполнении команды `yarn build`. Сборка проекта будет размещена здесь и готова к установке на сервер. Никаких изменений здесь не требуется.
- `node_modules`: Содержит все зависимости проекта. **Не следует изменять какие-либо файлы.**
- `node_scripts`: Вспомогательные скрипты.
  - `archive-paths.js`: Скрипт для перезаписывания ссылок в проекте и их актуализация если проект необходимо просмотреть без запуска сервера.
  - `init-project.js`: Скрипт для быстрой подготовки проекта для соответствующего типа. Доступны команды `yarn landing` и `yarn corporate`.
  - `js-clear-defaults.js`: Скрипт для форматирования и сортировки дефолтных свойств миксинов.
  - `linkinator.js`: Скрипт для проверки доступности всех ссылок проекта.
  - `markdown-compiler.js`: Скрипт с генерацией `.md` файлов и созданием мета контента для них.
  - `not-found-page-update.js`: Скрипт для создания файла `/404.html` в директории - `/build`.
  - `pug-clear-mixins.js`: Скрипт для форматирования `.pug` миксинов.
  - `pug-clear.js`: Небольшой линтер для `.pug` файлов.
  - `scss-clear.js`: Небольшой линтер для `.scss` файлов.
  - `sitemap-update.js`: Скрипт для изменения адресов `http://localhost:8080` в карте сайта на актуальный адрес (его необходимо указать в этом файле в значении константы `realUrl`).
  - `svg-clear.js`: Небольшой линтер для инлайновых тэгов `<svg>` в `.pug` файлах.
- `src`: Содержит весь исходный код. Ресурсы, `.js`, `.pug`, `.scss` и т. д. **Любые изменения, которые вы хотите внести на веб-сайт, должны быть сделаны здесь.**
  - `assets`: Ресурсы. Шрифты, изображения, файлы и прочее.
    - `files`: Директория для файлов `.pdf`, `.doc` и других.
    - `fonts`: Директория с шрифтами.
      - `fontawesome`: Библиотека иконочного шрифта.
        - `font`: Директория с шрифтом.
        - `styles`: Стили и подключения шрифта.
    - `images`: Директория с изображениями.
      - `favicons`: Директория для фавиконок.
      - `icons`: Директория для иконок.
    - `js`: Директория для файлов `.js`. (Можно создать любую структуру).
      - `_defaults`: Директория с дефолтными значениями миксинов `.pug`.
        - `article`: Директория с дефолтными значениями миксина `article`.
          - `_defaults.js`: Файл с дефолтными значениями миксина `article`.
        - `title`: Директория с дефолтными значениями миксина `title`.
          - `_defaults.js`: Файл с дефолтными значениями миксина `title`.
      - `base`: Основные базовые скрипты проекта.
        - `checks`: Директория со скриптами проверок.
          - `check-internal-links.js`: Проверка внутренних ссылок на 404-ю ошибку.
          - `check-target.js`: Проверка внешних ссылков и добавление им `target="_blank"`.
          - `check-current-page.js`: Проверка на какой странице находится пользователь.
        - `common`: Директория с базовыми функциями.
          - `get-current-year.js`: Скрипт для получения текущего года.
          - `get-header-height.js`: Скрипт для получения высоты хедера.
          - `load-images.js`: Скрипт для блюра изображений пока они полностью не загрузились.
          - `preloader.js`: Скрипт прелоадера.
          - `scroll-reveal.js`: Скрипт для плавного появления элементов.
          - `smooth-scroll.js`: Скрипт для плавного скролла к якорным ссылкам.
        - `routing`: Функционал для переходов по страницам.
          - `routing.js`: Главная функиця.
          - `routingFunctions.js`: Функция, которая содержит другие функции для их перезапуска в `barba.js`.
      - `app.js`: Основной файл подключения скриптов.
    - `styles`: Директория для файлов `.scss`. (Можно создать любую структуру).
      - `base`: Базовые стили.
        - `fonts.scss`: Подключение шрифтов и их переменные.
        - `global.scss`: Глобальные стили.
        - `typography.scss`: Файл настройки стилей для тегов контента.
        - `variables.scss`: Переменные.
      - `components`: Директория компонентов (файлы которые можно переиспользовать по всему проекту).
        - `blog.scss`: Компонент на странице блога.
        - `not-found.scss`: Компонент на странице ошибки.
        - `footer.scss`: Компонент футера.
        - `header.scss`: Компонент хедера.
      - `mixins`: Части файлов или "Примеси" `.scss`, которые можно легко переиспользовать. Содержат небольшие фрагменты стилей для примесей `.pug`.
        - `article.scss`: Миксин записи.
        - `title.scss`: Миксин заголовка.
      - `utils`: Утилиты.
        - `keyframes.scss`: Анимации созданные с помощью @keyframes.
        - `mixins.scss`: Миксины для стилей.
        - `reset.scss`: Файл для сброса стандартных стилей назначенных браузером (Использовать в случае если в проекте не подключён Tailwind).
      - `app.scss`: Основной файл подключения стилей.
    - `videos`: Директория с видео.
  - `markdown`: Директория с файлами `.md`.
    - `post.md`: Пример записи 1.
    - `post2.md`: Пример записи 2.
  - `views`: Файлы `.pug`. (Можно создать любую структуру).
    - `components`: Компоненты (файлы которые можно переиспользовать по всему проекту).
      - `blog.pug`: Компонент на странице блога.
      - `not-found.pug`: Компонент на странице ошибки.
      - `footer.pug`: Компонент футера.
      - `header.pug`: Компонент хедера.
      - `hero.pug`: Компонент блока на главной странице.
    - `layouts`: Основные файлы шаблонов. Здесь также можно создать разные темы для сайта.
      - `master.pug`: Главный шаблон.
    - `mixins`: Части файлов или "Примеси" `.pug`, которые можно легко переиспользовать. Необходимы для того, чтобы избежать повторения кода в каждом файле.
      - `article.pug`: Миксин записи.
      - `title.pug`: Миксин заголовка.
    - `pages`: Шаблоны страниц.
      - `blog`: Динамическая директория со статьями генерируемых из `.md` файлов из директории `/src/markdown`.
        - `post.pug`: Сгенерированный "Пример записи 1".
        - `post2.pug`: Сгенерированный "Пример записи 2".
      - `404.pug`: Шаблон страницы ошибки.
      - `blog.pug`: Шаблон страницы блога.
    - `index.pug`: Шаблон главной страницы.
  - `bundle.js`: Корневой файл подключения ресурсов, объединяющий в себя CSS и JS.
  - `sitemap.xml`: Карта сайта.
- `.babelrc`: Конфигурационный файл Babel.
- `.editorconfig`: Используется для установки конфигурации кода редактора, например, использования пробелов вместо табуляции, набора символов, файлов и т. д.
- `.gitignore`: Здесь можно указать, какие файлы или директории не должны отслеживаться `git`, это означает, что файл или директория, записанные в этом файле, не будут помещены в репозиторий, например, директория `/node_modules` и `/build`.
- `.htaccess`: Файл настроек редиректов.
- `.nvmrc`: Файл с версией NodeJS данного шаблона.
- `.prettierignore`: Файл с путями, которые Prettier не должен форматировать.
- `browserconfig.xml`: Конфигурационный файл для изображений сайта на платформах Windows.
- `LICENSE`: Файл лицензии.
- `manifest.json`: Файл манифеста содержит информацию об иконках, цветовой теме, ориентации экрана, начальном URL и т. д.
- `package.json`: Когда вы запускаете команду `yarn`, шаблон установит все зависимости, которые перечислены в этом файле с соответствующей версией. Если необходимо добавить другие зависимости, можно сделать это, выполнив команду `yarn add название_зависимости -D`. Новая зависимость будет установлена в директорию `/node_modules`, а `package.json` будет обновлен с добавлением новой строки. Также он содержит все команды для запуска и сборки проекта.
- `postcss.config.js`: Конфигурационный файл PostCSS.
- `prettier.config.js`: Конфигурационный файл Prettier.
- `README.md`: Файл описания шаблона.
- `tailwind.config.js`: Конфигурационный файл библиотеки `tailwind.css`.
- `utils.js`: Файл для определения режимов разработки/сборки и генерации путей для вложенных файлов `.pug`.
- `webpack.config.js`: Это один из самых важных файлов шаблона, потому что именно он создает сборку, а также среду разработки, компилируя файлы `.scss` и `.pug` в код `.css` и `.html`, а также минимизирует все файлы и создает карту сайта в директорию `/src`.
- `yarn.lock`: Ссылки на все зависимости шаблона.

#### 📑 Страницы

- `/`: Главная
- `/blog`: Блог
  - `/blog/post`: Статья 1
  - `/blog/post2`: Статья 2
- `/404`: Страница ошибки

## ⚙ Технологии

#### 🛠 Препроцессоры:

- **PUG**: [https://pugjs.org](https://pugjs.org)
  - Это механизм шаблонов и самый быстрый способ написания HTML. Предоставляет возможность создавать миксины для более модульного подхода, использовать переменные, циклы, условия и многое другое.
- **SASS**: [https://sass-scss.ru](https://sass-scss.ru)
  - Это препроцессор CSS, который используется для написания стилей, значительно повышает читабельность и скорость написания кода, а также позволяет использовать переменные, импорты, миксины и наследование.

#### 🎨 CSS

- **tailwind.css**: [https://tailwindcss.com](https://tailwindcss.com)
  - CSS-фреймворк, ориентированный на утилиты, содержит множество классов, которые можно комбинировать для создания любого дизайна прямо в разметке. Также можно использовать такие директивы, как `@apply`, и такие функции, как `theme()`.

#### 🔧 JS

- **barba.js**: [https://barba.js.org](https://barba.js.org)
  - Небольшая и простая в использовании библиотека, которая поможет создавать плавные переходы между страницами веб-сайта, а также более детально настраивать роутинг.
- **GSAP**: [https://greensock.com/gsap](https://greensock.com/gsap)
  - Набор инструментов для реализации анимации любого уровня сложности.
- **jQuery.js**: [https://jquery.com](https://jquery.com)
  - Быстрая, небольшая и многофункциональная библиотека. Она значительно упрощает такие вещи, как обход и манипулирование элементами HTML, обработку событий, анимации, Ajax, с помощью простого в использовании API, который работает во множестве браузеров.
- **scrollreveal.js**: [https://scrollrevealjs.org](https://scrollrevealjs.org)
  - Библиотека для анимации элементов по мере их прокрутки в окне браузера.
- **smooth-scroll.js**: [Smooth-Scroll.js](https://github.com/cferdinandi/smooth-scroll)
  - Легкий скрипт для анимации прокрутки к якорным ссылкам.

#### 🖋 Шрифты

- **Font Sans**: [Font Sans](https://tailwindcss.com/docs/font-family)
  - В качестве примера используется шрифт системный шрифт.
  - Подключать/редактировать/удалять другие шрифты можно в файле `src/assets/styles/base/fonts.scss`.
  - Основной шрифт указан в файле `src/assets/styles/base/global.scss`.

#### 🖼 Иконки

- **FontAwesome 6**: [https://fontawesome.com](https://fontawesome.com)
  - Иконочный шрифт. Использовать его можно так: `i.fa.fa-argle-right`, где первый класс `.fa` отвечает за стиль иконки. Начертание может быть обычным, жирным, тонким или являтся ‘брендом’, что позволяет использовать, например, иконку Twitter `i.fa-brands.fa-twitter`. Список всех начертаний: `fa-brands`, `fa-solid`, `fa-regular`, `fa-light`, `fa-thin`, `fa-duotone`, `fa-brands`.