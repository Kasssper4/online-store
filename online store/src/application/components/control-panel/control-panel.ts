import { QueryParams } from '../query-params';
import { createDocElement } from '../../utilites/utilites';
export class ControlPanel {
    controlBlock = createDocElement('div', 'control');
    query = new QueryParams();

    createSearch() {
        const inputText = <HTMLInputElement>createDocElement('input', 'search');
        inputText.setAttribute('type', 'text');
        inputText.setAttribute('autofocus', 'true');
        inputText.setAttribute('placeholder', 'Search product');
        const querySearchArr = this.query.getQueryParam('search');
        if (querySearchArr.length > 0) {
            inputText.value = querySearchArr[0];
        }
        inputText.addEventListener('input', () => {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            if (querySearchArr.length > 0) {
                params.delete('search');
            }
            params.append('search', inputText.value);
            window.location.search = params.toString();
        });
        return inputText;
    }

    createSort() {
        const select = <HTMLSelectElement>createDocElement('select', 'sort');
        select.setAttribute('size', '1');
        select.innerHTML = `<option disabled>Sort by:</option>\
            <option value = "price-asc">Price ASC</option>\
            <option value = "price-desc">Price DESC</option>\
            <option value = "rating-asc">Rating ASC</option>\
            <option value = "rating-desc">Rating DESC</option>`;

        const querySortArr = this.query.getQueryParam('sort');
        if (querySortArr.length === 0) {
            select.firstElementChild?.setAttribute('selected', 'true');
        }
        Array.from(select.children).forEach((option) => {
            if ((<HTMLInputElement>option).value === querySortArr[0]) {
                option.setAttribute('selected', 'true');
            }
        });

        select.addEventListener('change', () => {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            if (querySortArr.length > 0) {
                params.delete('sort');
            }
            params.append('sort', select.value);
            window.location.search = params.toString();
        });

        return select;
    }

    createViewButtons() {
        const buttonsWrap = createDocElement('div', 'view');
        const btnArr = ['tile-view', 'list-view'];
        btnArr.forEach((buttonClass) => {
            const btn = createDocElement('button', `view-button ${buttonClass}`);
            const viewParam = this.query.getViewParam();
            if (viewParam === buttonClass) {
                btn.classList.add('active-view');
            } else if (!viewParam && buttonClass === 'tile-view') {
                btn.classList.add('active-view');
            }
            btn.addEventListener('click', () => {
                const url = new URL(window.location.href);
                const params = new URLSearchParams(url.search);
                if (viewParam) {
                    params.delete('view');
                }
                params.append('view', buttonClass);
                window.location.search = params.toString();
            });
            buttonsWrap.append(btn);
        });
        return buttonsWrap;
    }

    createProductsAmount() {
        const amountBlock = createDocElement('div', 'products-amount');
        amountBlock.innerHTML = `<span>Find products: </span><span class = "products-amount__num">0</span>`;
        return amountBlock;
    }

    render() {
        this.controlBlock.append(
            this.createSearch(),
            this.createSort(),
            this.createViewButtons(),
            this.createProductsAmount()
        );
        return this.controlBlock;
    }
}
