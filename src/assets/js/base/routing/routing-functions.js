import validationCurrentPage from "@validation/validation-current-page";
import currentYear from "@common/get-current-year";
import scrollReveal from "@common/scroll-reveal";
import setNbsp from "@common/set-nbsp";
import setSvgSize from "@common/set-svg-size";
import loadImages from "@common/load-images";
import { setTheme, initTheme } from "@common/set-theme";
import textareaAutoheight from "@common/textarea-autoheight";
import formAutosave from "../common/form-autosave";

export default function routingFunctions() {
  setTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  initTheme();
  validationCurrentPage();
  currentYear();
  setNbsp();
  setSvgSize();
  scrollReveal();
  loadImages();
  textareaAutoheight();
  formAutosave();
}