import isCurrentPage from "../checks/is-current-page";
import currentYear from "../common/get-current-year";

export default function routingFunctions() {
  isCurrentPage();
  currentYear();
}