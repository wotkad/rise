import checkCurrentPage from "../checks/check-current-page";
import currentYear from "../common/get-current-year";

export default function routingFunctions() {
  checkCurrentPage();
  currentYear();
}