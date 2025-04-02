import checkCurrentPage from "../checks/check-current-page";
import checkImages from "../checks/check-images";
import currentYear from "../common/get-current-year";
import loadImages from "../common/load-images";

export default function routingFunctions() {
  checkCurrentPage();
  currentYear();
  loadImages();
  checkImages();
}