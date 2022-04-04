# Это руководство для шаблона содержащее используемые технологии, запуск и установку проекта, а также файловую структуру.

# Технологии

#### Главные завимимости

- NodeJS >= 14 https://nodejs.org
  - Чтобы запустить проект на локальном компьютере, вы должны установить NodeJS. Можно загрузить исполняемый файл для своей операционной системы и установить его.
- Yarn: `brew install yarn` или следовать специальному руководству для ОС https://yarnpkg.com/lang/en/docs/install/

#### Сборка

- Webpack 5.x https://webpack.js.org (Сборщик модулей для управления всеми зависимостями сайта.)

#### Препроцессоры:

- PUG https://pugjs.org (Это механизм шаблонов и самый быстрый способ написания HTML.)
- SCSS https://sass-scss.ru/ (Это препроцессор CSS, который используется для написания стилей.)

#### CSS

- reset.css (Библиотека для сброса стандартных стилей назначенных браузером.)
- tailwind.css (CSS-фреймворк, ориентированный на утилиты, содержит множество классов, которые можно скомпоновать для создания любого дизайна прямо в разметке.)

#### JS

- Barba.js (Небольшая и простая в использовании библиотека, которая поможет создавать плавные и плавные переходы между страницами веб-сайта.)
- Gsap.js (Набор инструментов для реализации анимации любого уровня сложности.)
- jQuery.js (Быстрая, небольшая и многофункциональная библиотека. Она значительно упрощает такие вещи, как обход и манипулирование документами HTML, обработку событий, анимацию и Ajax, с помощью простого в использовании API, который работает во множестве браузеров.)
- Lottie-Web.js (Библиотека для анализа анимации Adobe After Effects, экспортированную в формате `.json` с помощью Bodymovin.)
- ScrollReveal.js (Библиотека для анимации элементов по мере их прокрутки в поле зрения.)
- Smooth-Scroll.js (Легкий скрипт для анимации прокрутки к якорным ссылкам.)

#### Шрифты

- FontAwesome 6 (Иконочный шрифт.)
- GraphikLCG (Основной шрифт.)

#### Иконки

- Feather-Icons (Коллекция иконок.)
- UseAnimations (Анимирование иконок Feather в Lottie Web.)

# Запуск и установка проекта для разработки

#### Установка зависимостей

- Webpack и Webpack dev server: Установите их с помощью `yarn global add webpack webpack-dev-server`.

#### Процесс разработки

1. Необходимо скопировать директорию шаблона и измените ее название на актуальное для проекта.
2. Откройте директорию `название проекта` в редакторе кода.
3. Запустить процесс разработки в проекте можно командой `yarn dev`. (для запуска проекта в своей локальной сети,  следует вместо этого запустить `yarn dev-network`, а с помощью IP-адреса хост-компьютера можно получить доступ к проекту на других устройствах.)
4. Проверьте доступность страниц.
5. Выполните все необходимые модификации.

#### Сборка проекта

6. Для начала сборки проекта нажмите `CTRL + C` чтобы остановить сервер разработки, запустите команду `yarn build` и сборка будет создана в директорию `dist`.

#### Тестирование

7. Тестирование возможно через `http-server` установив его командой `yarn global add http-server`. Выполнив команду `http-server -p 9090`, по URL-адресу `http://localhost:9090` можно увидеть сборку в действии.
8. Broken Link Checker - Скрипт для проверки работоспособности ссылок на всём сайте (выполните команду `node blc`.)

# Файловая структура

- `dist`: Сборка будет размещена здесь и готова к установке на сервер. Никаких изменений здесь не требуется, так как она автоматически генерируется из исходных файлов.
- `node_modules`: Содержит все зависимости javascript. **Не следует изменять там какие-либо файлы.**
- `src`: Весь исходный код содержится здесь. Ресурсы, `.js`, `.scss`, `.pug` и т. д. **Любые изменения, которые вы хотите внести на веб-сайт, должны быть сделаны здесь.**
  - `assets`: Основная рабочая директория.
    - `files`: Может содержать файлы `.pdf`, `.doc` и прочие.
    - `fonts`: Шрифты.
    - `images`: Изображения.
    - `js`: Скрипты. (Можно создать любую структуру.)
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
    - `styles`: Файлы `.scss`. (Можно создать любую структуру.)
      - `base`: Базовые стили.
        - `fontawesome`: Стили шрифтов fontawesome.
        - `_dimensions`: Переменные основных размерностей.
        - `_fonts`: Подключение шрифтов и их переменные.
        - `_global`: Глобальные стили.
        - `_palette`: Палетта переменных цветов.
      - `components`: Компоненты (файлы которые можно переиспользовать по всему проекту.)
      - `pages`: Детальные стили для каждой отдельной страницы.
      - `utils`: Утилиты.
        - `_keyframes`: Анимации созданные с помощью @keyframes.
        - `_mixins`: Миксины.
      - `_app`: Основной файл подключения скритов.
  - `markdown`: Директория `.md` файлов.
    - `build`: Динамическая директория с файлами генерируемая из файлов директории `src/markdown/constructor`.
    - `constructor`: Директория с функционалом для генерации `.pug` из `.md` файлов.
      - `decs.d.mts`: Файл декларирования модулей.
      - `index.mts`: Файл с генерацией `.md` файлов, шаблона статьи и мета контента для них.
      - `markdown.mts`: Основной конфигурационный файл markdown.
    - `docs`: Директория с файлами `.md`.
	- `scripts`: Вспомогательные скрипты.
		- `changeUrl.js`: Скрипт для изменения адресов `http://localhost:8080` в карте сайта на актуальный адрес (актуальный адрес необходимо указать в этом файле в константе `realUrl`).
		- `renamer.sh`: Скрипт для переименования файлов из `.js` в `.mjs` расширения в директории `src/markdown/build`.
		- `sitemap.js`: Скрипт для создания карты сайта в директорию `src`.
  - `views`: Файлы `.pug`. (Можно создать любую структуру.)
    - `components`: Компоненты (файлы которые можно переиспользовать по всему проекту.)
    - `layouts`: Основные файлы шаблонов. Здесь также можно создать разные темы для сайта.
    - `mixins`: Фрагменты файлов `.pug`, которые используются для той же цели, что и макеты, а именно для того, чтобы избежать повторения кода в каждом шаблоне и вместо этого использовать микширование для размещения одного и того же компонента и т. д., просто передавая атрибут для каждого один раз.
    - `pages`: Шаблоны страниц.
      - `blog`: Динамическая директория со статьями генерируемая из `.md` файлов из директории `src/markdown/docs/`.
    - `index.pug`: Шаблон главной страницы.
  - `bundle.js`: Основной файл объединяющий в себя CSS и JS для более быстрой работы сайта.
  - `sitemap.xml`: Карта сайта.
- `.babelrc`: Конфигурационный файл Babel.
- `.editorconfig`: Используется для установки конфигурации кода редактора, например, использования пробелов вместо табуляции, набора символов, файлов и т. д.
- `.gitignore`: Здесь вы можете указать, какие файлы/директории не должны отслеживаться `git`, это означает, что файл/директория, записанные в этом файле, не будут помещены в репозиторий, например, директория `node_modules` и `dist`.
- `.nvmrc`: Файл с версией NodeJS данного проекта.
- `blc.js`: Скрипт для проверки работоспособности ссылок на всём сайте.
- `README.md`: Файл описания шаблона.
- `package.json`: Когда вы запускаете команду `yarn install`, установленными пакетами являются те, которые перечислены в этом файле с версией, которая была установлена, если нужно добавить больше пакетов, вы можете сделать это, выполнив команду `yarn add название_пакета --save`, затем новый пакет будет установлен в директорию `node_modules`, а `package.json` будет обновлен с добавлением новой строки пакета, также он содержит все команды для запуска и сборки проекта.
- `postcss.config.js`: Конфигурационный файл PostCSS.
- `tailwind.config.js`: Конфигурационный файл библиотеки `Tailwind.css`.
- `tsconfig.json`: Конфигурационный файл `TypeScript`.
- `utils.js`: Файл для определения режимов разработки/сборки и генерации путей для вложенных файлов `.pug`.
- `webpack.config.js`: Это один из самых важных файлов проекта, потому что именно он создает сборку, а также среду разработки, компилируя файлы `.scss` и `.pug` в код `.css` и `.html`, а также минимизирует все файлы.

#### Шаблоны

- `/`: Главгая
- `/blog`: Блог
- `/blog/post`: Статья
- `/404`: Страница ошибки 404
