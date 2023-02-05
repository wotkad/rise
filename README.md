# 🥥 Rise - A flexible template for developing websites and applications.

**Rise** is a fast, easy-to-use and customizable template with which you can implement a project of any complexity, from a landing page to a highly loaded service.

The template greatly simplifies such things as building a project, finding the necessary libraries to start a project, generating a sitemap, setting up basic SEO, setting up a project architecture, and also offers the creation of content in the `.md` format.

**Pattern Includes:**
- Templates in `.pug` and `.scss`
- Easy connection of `css` and `js` libraries
- Convenient architecture
- Generation of articles in `.md` format
- Easy initial SEO setup
- Tests
- and much more ...

To get started, you need to install the [main dependencies](/docs/main-dependencies/).

## ⚙ Technology

#### ⛓ Main dependencies

- **NodeJS**: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
  - To run the project on your local machine, you need to install NodeJS version 18.13.0 or higher. From the link above, you can download the executable file for your operating system and install it.
- **Yarn**: [https://yarnpkg.com](https://yarnpkg.com)
  - Required to install various modules in your project.
- **Webpack**: [https://webpack.js.org](https://webpack.js.org)
  - Module builder to manage all site dependencies (requires version 5 or higher).

#### 🛠 Preprocessors:

- **PUG**: [https://pugjs.org](https://pugjs.org)
  - It's a templating engine and the fastest way to write HTML. Provides the ability to write mixins for a more modular approach to HTML, using variables, loops, conditions, and more.
- **SCSS**: [https://sass-scss.ru](https://sass-scss.ru)
  - This is a CSS preprocessor that is used for writing styles and greatly improves the readability and speed of writing code, and also allows you to use variables, imports, mixins and inheritance.

#### 🎨 CSS

- **tailwind.css**: [https://tailwindcss.com](https://tailwindcss.com)
  - The utility-oriented CSS framework contains many classes that can be combined to create any design right in the markup. It is also possible to use directives like `@apply` and functions like `theme()`.

#### 🔧 JS

- **Barba.js**: [https://barba.js.org](https://barba.js.org)
  - A small and easy-to-use library that will help you create smooth transitions between website pages, as well as configure routing in more detail.
- **Gsap.js**: [https://greensock.com/gsap](https://greensock.com/gsap)
  - A set of tools for the implementation of animation of any level of complexity.
- **jQuery.js**: [https://jquery.com](https://jquery.com)
  - Fast, small and feature rich library. It greatly simplifies things like traversing and manipulating HTML documents, event handling, animation, and Ajax with an easy-to-use API that works across multiple browsers.
- **Lottie-Web.js**: [http://airbnb.io/lottie](http://airbnb.io/lottie)
  - Library for working with animations created in Adobe After Effects and exported in `.json` format using Bodymovin. Allows you to play, stop, get individual frames of animation and much more.
- **ScrollReveal.js**: [https://scrollrevealjs.org](https://scrollrevealjs.org/)
  - A library to animate elements as they scroll in the browser window.
- **Smooth-Scroll.js**: [Smooth-Scroll.js](https://github.com/cferdinandi/smooth-scroll)
  - Lightweight script to animate scrolling to anchor links.

#### 🖋 Fonts

- **GraphikLCG**: [GraphikLCG](https://gist.github.com/mfd/e7842774e037edf15919037594a79b2b)
  - The main font set for the example. You can change it in the file `/assets/styles/base/_fonts.scss`

#### 🖼 Icons

- **FontAwesome 6**: [https://fontawesome.com](https://fontawesome.com)
  - Icon font. You can use it like this: `i.fa.fa-argle-right`, where the first `.fa` class is responsible for the style of the icon. The face can be regular, bold, thin, or 'branded', allowing for example the Twitter icon `i.fa-brands.fa-twitter`. List of all styles: `fa-brands`, `fa-solid`, `fa-regular`, `fa-light`, `fa-thin`, `fa-duotone`, `fa-brands`.

## ✨ Installation and launch

#### 🔗 Install dependencies

- **Yarn**
  - First you need to run the command `brew install yarn` in the console or follow the special guide for the OS [https://yarnpkg.com/lang/en/docs/install/](https://yarnpkg.com/lang/en/ docs/install/).
- **Webpack** and **Webpack Dev Server**:
  - Then you need to install `Webpack and Webpack Dev Server` using `yarn global add webpack webpack-dev-server` command.

#### 👨‍💻 Development process

1. You need to clone the project with the command `git clone https://git@github.com:wotkad/rise.git` to the directory with projects and change its name to the current one.
2. Open the `project name` directory in the code editor.
3. Install all dependencies with the `yarn install` command.
4. You can start the development process in the project with the `yarn dev` command. (to run the project on your local network, you should run `yarn dev-network` instead of `yarn dev`, and using the IP address of the host computer (it must be specified in the `package.json` file for the `dev-network` command ) you can access the project on other devices).
5. Check page availability.
6. Make any necessary modifications.

#### 📄 Adding pages

7. To add a page, you need to create it in the `/views` directory in the right place, after that you need to restart the project by pressing `CTRL + C` to stop the development process and run the `yarn dev` command to restart it.
8. To create any section, for example, `/products/product`, where `/products` is the parent section, in the `webpack.config.js` file, in the `plugins` object, add the line `...utils. pages(MODE, "products")`.

#### 📦 Build project

9. To start building the project, you must press `CTRL + C` to stop the development process and run the `yarn build` command - the project will be created in the `/build` directory.

#### 🔬 Testing

10. Testing is possible via `http-server`. Before starting, you need to build the project with the `yarn build` command. Next, by running `npx http-server -p 9090 ./build`, you can see the build in action at the URL `http://localhost:9090`.
11. Broken Link Checker - Script for checking the functionality of links on the entire site (To run, you need to run the `node blc` command when the project is running).

## 📂 File structure

- `build`: The assembly will be placed here and ready to be installed on the server. No changes are required here as it is automatically generated from source files.
- `node_modules`: Contains all javascript dependencies. **Do not modify any files.**
- `src`: All source code is contained here. Resources, `.js`, `.scss`, `.pug`, etc. **Any changes you wish to make to the website must be made here.**
  - `assets`: Main working directory.
    - `files`: May contain `.pdf`, `.doc` and other files.
    - `fonts`: Fonts.
      - `fontawesome`: Icon font library.
    - `images`: Images.
      - `favicons`: Contains all favicons.
    - `js`: `.js` files. (You can create any structure).
      - `linksChecker`: Check links.
        - `checkInternalLinks`: Check internal links for 404 errors.
        - `checkTarget`: Check external links and add `target="_blank"` to them.
        - `isCurrentPage`: Check which page the user is on.
      - `preloader`: Preloader script.
      - `routing`: Functionality for page navigation.
        - `routing`: Main function.
        - `routingFunctions`: A function that contains other functions to restart them in barba.js.
      - `scroll`: Scroll functionality.
        - `scrollReveal`: Script for smooth appearance of elements.
        - `smoothScroll`: Script for smooth scrolling to anchor links.
      - `app.js`: Main script file.
    - `styles`: `.scss` files. (You can create any structure).
      - `base`: Base styles.
        - `fontawesome`: Font styles for fontawesome.
        - `_dimensions`: Basic dimensions variables.
        - `_fonts`: Including fonts and their variables.
        - `_global`: Global styles.
        - `_palette`: Variable color palette.
      - `components`: Components (files that can be reused throughout the project).
      - `mixins`: Parts of `.scss` files that contains small pieces of code for `.pug` mixins.
        - `_header`: Header mixin.
      - `utils`: Utilities.
        - `_keyframes`: Animations created with @keyframes.
        - `_reset`: File to reset the default styles assigned by the browser.
      - `_app`: Main script connection file.
    - `videos`: Videos.
  - `markdown`: Directory of `.md` files.
    - `build`: A dynamic directory with files generated from files in the `/src/markdown/constructor` directory.
    - `constructor`: Directory with functionality for generating `.pug` from `.md` files.
      - `decs.d.mts`: Module declaration file.
      - `index.mts`: File with generation of `.md` files, article template and meta content for them.
      - `markdown.mts`: The main configuration file for markdown.
    - `docs`: Directory with `.md` files.
  - `scripts`: Helper scripts.
    - `changeSitemapUrls.js`: Script to change `http://localhost:8080` addresses in the sitemap to the actual address (the actual address must be specified in the `realUrl` constant in this file).
    - `renameJsFiles.js`: Script to rename files from `.js` to `.mjs` extension in `/src/markdown/build` directory.
    - `replaceErrorPageBuild`: Script to create `/404.html` file in build mode - `/build`.
  - `views`: `.pug` files. (You can create any structure).
    - `components`: Components (files that can be reused throughout the project).
      - `footer`: Footer component.
    - `layouts`: Main template files. Here you can also create different themes for the site.
      - `layout`: Main layout.
    - `mixins`: Parts of `.pug` files that can be easily reused. Necessary in order to avoid repeating code in each file.
      - `header`: Header mixin.
    - `pages`: Page templates.
      - `blog`: Dynamic directory with articles generated from `.md` files in `/src/markdown/docs` directory.
      - `404`: Error page.
    - `index`: Master page template.
  - `bundle.js`: The main file that combines CSS and JS for faster website performance.
  - `sitemap.xml`: Site map.
- `.babelrc`: Babel configuration file.
- `.editorconfig`: Used to set editor code configuration, such as using spaces instead of tabs, character set, files, etc.
- `.gitignore`: Here you can specify which files/directories should not be tracked by `git`, this means that the file/directory written in this file will not be put into the repository, for example, the directory `/node_modules` and `/ build`.
- `.nvmrc`: File with NodeJS version of this project.
- `blc.js`: Script to check if links on the whole site are working.
- `README.md`: Template description file.
- `package.json`: When you run the `yarn install` command, the installed packages are those listed in this file with the version that was installed, if you need to add more packages, you can do this by running the command `yarn add packagename - -save`, then the new package will be installed in the `/node_modules` directory, and `package.json` will be updated with a new package line, it also contains all the commands to run and build the project.
- `postcss.config.js`: PostCSS configuration file.
- `tailwind.config.js`: `tailwind.css` library configuration file.
- `tsconfig.json`: `TypeScript` configuration file.
- `utils.js`: File to define development/build modes and generate paths for nested `.pug` files.
- `webpack.config.js`: This is one of the most important files in the project because it creates the build as well as the development environment by compiling the `.scss` and `.pug` files into `.css` and `.html code ` and also minifies all files and creates a sitemap in the `/src` directory.
- `yarn.lock`: Links to all dependencies of project.

#### 📑 Templates

- `/`: Home
- `/blog`: Blog
- `/blog/post`: Article
- `/404`: Error page
