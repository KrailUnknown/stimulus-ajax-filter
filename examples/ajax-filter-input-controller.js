import { AjaxFilterController } from "../controllers/ajax-filter-controller"

export default class extends AjaxFilterController {

    /**
     * Данный метод должен быть реализован в зависимости от типа фильтра
     */
    get value() {
        return this.element.value;
    }
}
