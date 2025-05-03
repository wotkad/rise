import checkCurrentPage from "../checks/check-current-page";
import currentYear from "../common/get-current-year";
import setNbsp from "../common/set-nbsp";
import setSvgSize from "../common/set-svg-size";

export default function routingFunctions() {
  checkCurrentPage();
  currentYear();
  setNbsp();
  setSvgSize();
}