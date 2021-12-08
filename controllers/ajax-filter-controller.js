import { Controller } from "stimulus"
let debounce = require('lodash/debounce');

export class AjaxFilterController extends Controller {
    static values = {
        name : String,
        debounce : Number
    };


    connect() {
        //https://dev.to/leastbad/the-best-one-line-stimulus-power-move-2o90
        //Делаем экземпляр контроллера доступным для вызова из других контролеров
        this.element['ajaxFilter'] = this;
    }


    initialize() {
        if(this.hasDebounceValue) {
            this.reloadAjax = debounce(this.reloadAjax, this.debounceValue);
        }
    }


    reloadAjax() {
        this.ajaxLoaderControllers.forEach((el) => {
            let controller = el.ajaxLoader;

            // this.passParamToController(controller);
            controller.trigger();
        });
    }


    get ajaxLoaderControllers() {
        let loaderNames = this.element.dataset.loaderName;
        let loaderNamesArr = loaderNames.split(' ');
        let elements = [];

        //Нахожу все лоадеры на странице и проверяю, привязан ли текущий фильтр к какому-либо из них
        document.querySelectorAll('[data-ajax-loader-name-value]').forEach(
            (el) => {
                let found = loaderNamesArr.includes(el.dataset.ajaxLoaderNameValue);
                if(found) {
                    elements.push(el);
                }
            });

        return elements;
    }


    passParamToController(controller) {
        let key = this.nameValue;
        let value = this.element.value;
        controller.passParam(key, value);
    }


    get key() {
        return this.nameValue;
    }


    /**
     * Данный метод должен быть реализован в зависимости от типа фильтра
     */
    get value() {

    }
}
