# 🥥 Rise - A flexible template for developing websites and applications.

**Rise** is a fast, easy-to-use and customizable template with which you can implement a project of any complexity, from a landing page to a highly loaded service.

The template greatly simplifies such things as building a project, finding the necessary libraries to start a project, generating a sitemap, developing a project architecture, and also offers storing pages in the `.md` format.

**Pattern Includes:**
- Templates in `.pug` and `.scss`
- Connections of `css` and `js` libraries
- Post structure generation
- Scripts for tests
- Scripts for routing
- Scripts to check internal link links
- and much more ...

To get started, you need to install [main dependencies](#-main-dependencies).

## ⚙ Technology

#### ⛓ Main dependencies

- **NodeJS**: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
  - To run the project on your local machine, you need to install NodeJS version 14 or higher. From the link above, you can download the executable file for your operating system and install it.
- **Yarn**: [https://yarnpkg.com](https://yarnpkg.com)
  - To install the Yarn package manager, you need to open your project in a code editor, for example, Visual Studio Code and run the `brew install yarn` command in the console or follow the specific guide for the OS [https://yarnpkg.com/lang/en/docs/ install/](https://yarnpkg.com/lang/en/docs/install/).
- **Webpack**: [https://webpack.js.org](https://webpack.js.org)
  - Module builder to manage all site dependencies (requires version 5 or higher).

#### 🛠 Preprocessors:

- **PUG**: [https://pugjs.org](https://pugjs.org)
  - It's a templating engine and the fastest way to write HTML. Provides the ability to write mixins for a more modular approach to layout, use variables, loops, conditions, and more.
- **SCSS**: [https://sass-scss.ru](https://sass-scss.ru)
  - This is a CSS preprocessor that is used to write styles, allows you to use variables, imports, mixins and inheritance.

#### 🎨 CSS

- **reset.css**: [reset.css](https://gist.github.com/DavidWells/18e73022e723037a50d6)
  - Library for resetting standard styles assigned by the browser.
- **tailwind.css**: [https://tailwindcss.com](https://tailwindcss.com)
  - The utility-oriented CSS framework contains many classes that can be combined to create any design right in the markup. It is also possible to use directives like `@apply` and functions like `theme()`.

#### 🔧JS

- **Barba.js**: [https://barba.js.org](https://barba.js.org)
  - A small and easy-to-use library that will help you create smooth transitions between website pages, as well as configure routing in more detail.
- **Gsap.js**: [https://greensock.com/gsap](https://greensock.com/gsap)
  - A set of tools for the implementation of animation of any level of complexity.
- **jQuery.js**: [https://jquery.com](https://jquery.com)
  - Fast, small and feature rich library. It greatly simplifies things like traversing and manipulating HTML documents, event handling, animation, and Ajax with an easy-to-use API that works across multiple browsers.
- **Lottie-Web.js**: [http://airbnb.io/lottie](http://airbnb.io/lottie)
  - Library for working with Adobe After Effects animations, exported in `.json` format using Bodymovin.
- **ScrollReveal.js**: [https://scrollrevealjs.org](https://scrollrevealjs.org/)
  - A library to animate elements as they scroll into view.
- **Smooth-Scroll.js**: [Smooth-Scroll.js](https://github.com/cferdinandi/smooth-scroll)
  - Lightweight script to animate scrolling to anchor links.

#### 🖋 Fonts

- **FontAwesome 6**: [https://fontawesome.com](https://fontawesome.com)
  - Icon font. You can use it like this: `i.fa.fa-argle-right`, there are also other categories `fa-solid`, `fa-regular`, `fa-light`, `fa-thin`, `fa-duotone` , `fa-brands`.
- **GraphikLCG**: [GraphikLCG](https://gist.github.com/mfd/e7842774e037edf15919037594a79b2b)
  - Primary font. You can change it in the file `/assets/styles/base/_fonts.scss`

#### 🖼 Icons

- **Feather-Icons**: [https://feathericons.com](https://feathericons.com/)
   - Collection of icons.
- **UseAnimations**: [https://useanimations.com](https://useanimations.com/)
   - Animation of Feather icons in Lottie Web.

## ✨ Installation and launch

#### 🔗 Install dependencies

- **Webpack** and **Webpack Dev Server**:
   - You need to install `Webpack and Webpack Dev Server` with `yarn global add webpack webpack-dev-server`.
   - Then you need to run the `yarn install` process in order to bind all the dependencies in the project.

#### 👨‍💻 Development process

1. You need to clone the project with the command `git clone git@github.com:wotkad/rise.git` to the directory with projects and change its name to the current one.
2. Open the `project name` directory in the code editor.
3. Install all dependencies with the `yarn install` command.
4. You can start the development process in the project with the `yarn dev` command. (to run the project on your local network, you should run `yarn dev-network` instead, and using the IP address of the host machine (you need to specify it in the `package.json` file for the `dev-network` command), you can get access to the project on other devices).
5. Check the availability of the pages.
6. Make any necessary modifications.

#### 📄 Adding pages

7. To add a page, you need to create it in the `/views` directory in the required place, after that you need to press `CTRL + C` to stop the development process and run the `yarn dev` command to restart it.
8. To create any section, for example, `/products/product`, where `/products` is a section, in the `webpack.config.js` file, in the `plugins` object, add the line `...utils.pages (MODE, "products")`.

#### 📦 Build project

9. To start building the project, you must press `CTRL + C` to stop the development server and run the `yarn build` command - the assembly will be created in the `/dist` directory.

#### 🔬 Testing

10. Testing is possible through `http-server` by installing it with the command `yarn global add http-server`. By running `npx http-server -p 9090 ./dist`, you can see the assembly in action at the URL `http://localhost:9090`.
11. Broken Link Checker - Script to check the functionality of links on the entire site (execute the `node blc` command when the project is running).

## 📂 File structure

- `dist`: The assembly will be placed here and ready to be installed on the server. No changes are required here as it is automatically generated from source files.
- `node_modules`: Contains all javascript dependencies. **Do not modify any files.**
- `src`: All source code is contained here. Resources, `.js`, `.scss`, `.pug`, etc. **Any changes you want to make to the website must be made here.**
  - `assets`: Main working directory.
    - `files`: May contain `.pdf`, `.doc` and other files.
    - `fonts`: Fonts.
    - `images`: Images.
    - `js`: Scripts. (You can create any structure).
      - `animations`: `.json` files from UseAnimations for animation with Lottie Web.
      - `linksChecker`: Check links.
        - `checkInternalLinks`: Check internal links for 404 errors.
        - `isCurrentPage`: Check which page the user is on.
      - `preloader`: Preloader script.
      - `routing`: Functionality for page navigation.
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
      - `pages`: Detail styles for each individual page.
      - `utils`: Utilities.
        - `_keyframes`: Animations created with @keyframes.
        - `_mixins`: Mixins.
      - `_app`: Main script connection file.
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
    - `replaceErrorPageDist`: Script to create `/404.html` file in build mode - `/dist`.
  - `views`: `.pug` files. (You can create any structure).
    - `components`: Components (files that can be reused throughout the project).
    - `layouts`: Main template files. Here you can also create different themes for the site.
    - `mixins`: Fragments of `.pug` files that are used for the same purpose as layouts, namely to avoid repeating code in each template and instead use mixins to place the same component, etc. by simply passing the attribute for each once.
    - `pages`: Page templates.
      - `blog`: Dynamic directory with articles generated from `.md` files in `/src/markdown/docs` directory.
    - `index.pug`: Master page template.
  - `bundle.js`: The main file that combines CSS and JS for faster website performance.
  - `sitemap.xml`: Site map.
- `.babelrc`: Babel configuration file.
- `.editorconfig`: Used to set editor code configuration, such as using spaces instead of tabs, character set, files, etc.
- `.gitignore`: Here you can specify which files/directories should not be tracked by `git`, this means that the file/directory written in this file will not be put into the repository, for example, the directory `/node_modules` and `/ dist`.
- `.nvmrc`: File with NodeJS version of this project.
- `blc.js`: Script to check if links on the whole site are working.
- `README.md`: Template description file.
- `package.json`: When you run the `yarn install` command, the installed packages are those listed in this file with the version that was installed, if you need to add more packages, you can do this by running the command `yarn add packagename - -save`, then the new package will be installed in the `/node_modules` directory, and `package.json` will be updated with a new package line, it also contains all the commands to run and build the project.
- `postcss.config.js`: PostCSS configuration file.
- `tailwind.config.js`: `Tailwind.css` library configuration file.
- `tsconfig.json`: `TypeScript` configuration file.
- `utils.js`: File to define development/build modes and generate paths for nested `.pug` files.
- `webpack.config.js`: This is one of the most important files in the project because it creates the build as well as the development environment by compiling the `.scss` and `.pug` files into `.css` and `.html code ` and also minifies all files and creates a sitemap in the `/src` directory.

#### 📑 Templates

- `/`: Home
- `/blog`: Blog
- `/blog/post`: Article
- `/404`: Error page
