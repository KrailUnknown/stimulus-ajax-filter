import { Controller } from "stimulus"
// import { useDispatch } from "stimulus-use"

export class AjaxLoaderController extends Controller {
    static targets = [
        'loader',
        'dest'
    ];


    static values = {
        url: String,
        name: String,
        contentUpdateMethod: String,
        runOnPageLoad: Boolean
    };


    connect() {
        // useDispatch(this);

        //https://dev.to/leastbad/the-best-one-line-stimulus-power-move-2o90
        //Делаем экземпляр контроллера доступным для вызова из других контролеров

        this.element[
            (str => {
                return str
                    .split('--')
                    .slice(-1)[0]
                    .split(/[-_]/)
                    .map(w => w.replace(/./, m => m.toUpperCase()))
                    .join('')
                    .replace(/^\w/, c => c.toLowerCase())
            })(this.identifier)
            ] = this;

        if(this.runOnPageLoadValue) {
            this.trigger();
        }
    }


    trigger() {
        // console.log(`${this.nameValue} triggered`)


        if(this.isEnabled()) {
            this.sendAjax();
        }
    }


    sendAjax() {
        let params = this.getParams();
        this.showLoaders();
        axios({
            method: 'GET',
            url: this.urlValue,
            params: params,
            timeout:  1 * 600 * 1000, //600 секунд, т.к. на хостинге сейчас ограничение в 600 секунд
        }).then((response) => {
            this.showResults(response['data']);
        }).finally(() => {
            this.hideLoaders();
        });
    }


    updateElementContent(content) {
        //Подставлять сюда реализацию. беря её название из value-поля.
        //Реализация должна где-то лежать... но где?
        // window[this.contentUpdateMethodValue](content);
        this.element.innerHTML = content;
    }

    //
    // passParam(key, value) {
    //     this.params[key] = value;
    // }


    getParams() {
        //На случай, если я пойму, что контроллеры фильтров не успели прогрузиться
        //- раскомменитить нижнюю строку (и закрывающие скобки)
        //и сделать асинхронный возврат из функции
        //(для того, чтобы этот код выполнился при следующем цикле событий, т.е. после инициализации контроллеров)
        // Promise.resolve().then(() => {
            let params = {};
            let elements = this.ajaxFilters;
            elements.forEach((el) => {
                let key = el.ajaxFilter.key;
                let value = el.ajaxFilter.value;
                params[key] = value;
            });
        // });

        return params;
    }


    get ajaxFilters() {
        return document.querySelectorAll(`[data-loader-name~=${this.nameValue}]`);
    }


    showLoaders() {
        this.loaderTargets.forEach((el) => {
            el.dataset['loading'] =  true;
        });
    }


    hideLoaders() {
        this.loaderTargets.forEach((el) => {
            delete el.dataset['loading'];
        });
    }


    showResults(response) {
        this.destTargets.forEach((el) => {
            let type = el.dataset.destType;
            let result = response[type];
            if(result !== undefined) {
                el.innerHTML = result;
            }
        })

        // this.dispatch('resultsShown');
    }

    isEnabled() {
        //Нужно, чтобы каждый раз при попытке триггера проверялось какое-то условие (коллбэк)
        //Как этот коллбэк задать? И где?
        //Использовать JS-приколы и передать в value название класса/метода и т.п., а потом тут
        //обработать это значение и вызвать метод
        //Отдельный тип классов (статичных?), которые имели бы 1 метод: checkIfEnabled() и возвращали
        //бы значение true//false.
        return true;
    }


}
