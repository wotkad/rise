import checkCurrentPage from "../checks/check-current-page";
import currentYear from "../common/get-current-year";
import scrollReveal from "../common/scroll-reveal";
import setNbsp from "../common/set-nbsp";
import setSvgSize from "../common/set-svg-size";
import loadImages from '../common/load-images';
import { setTheme } from "../common/set-theme";
import checkOffline from "../checks/check-offline";

export default function routingFunctions() {
  setTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  checkCurrentPage();
  currentYear();
  setNbsp();
  setSvgSize();
  scrollReveal();
  loadImages();
  checkOffline();
}