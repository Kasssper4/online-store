import { QueryParams } from '../query-params';
import { createDocElement } from '../../utilites/utilites';

export class FiltersList {
    static filterSection = createDocElement('section', 'filters');
    query: string;
    static categoriesArr = [
        'smartphones',
        'laptops',
        'fragrances',
        'skincare',
        'groceries',
        'home-decoration',
        'furniture',
        'tops',
        'womens-dresses',
        'womens-shoes',
        'mens-shirts',
        'mens-shoes',
        'mens-watches',
        'womens-watches',
        'womens-bags',
        'womens-jewellery',
        'sunglasses',
        'automotive',
        'motorcycle',
        'lighting',
    ];
    static brandsArr = [
        'Apple',
        'Samsung',
        'OPPO',
        'Huawei',
        'Microsoft Surface',
        'Infinix',
        'HP Pavilion',
        'Impression of Acqua Di Gio',
        'Royal_Mirage',
        'Fog Scent Xpressio',
        'Al Munakh',
        'Lord - Al-Rehab',
        "L'Oreal Paris",
        'Hemani Tea',
        'Dermive',
        'ROREC White Rice',
        'Fair and Clear',
        'Saaf and Khaas',
        'Bake Parlor Big',
        'Baking Food Items',
        'fauji',
        'Dry Rose',
        'Boho Decor',
        'Flying Wooden',
        'LED Lights',
        'luxury palace',
        'Golden',
    ];

    constructor(query: string) {
        this.query = query;
    }

    createCheckbox(criterion: string) {
        const query = new QueryParams();
        const queryParamsArr = query.getQueryParam(criterion);
        const checkboxBlock = createDocElement('div', 'checkbox');
        const header = createDocElement('h3', 'checkbox__header', criterion.toUpperCase());
        const formElement = createDocElement('form', `filter-form ${criterion}`);
        checkboxBlock.append(header, formElement);

        let arr;
        criterion === 'categories' ? (arr = FiltersList.categoriesArr) : (arr = FiltersList.brandsArr);

        arr.forEach((el) => {
            const inputWrap = createDocElement('p', 'filter-checkbox');
            let checked = false;

            for (let i = 0; i < queryParamsArr.length; i++) {
                if (queryParamsArr[i] === el) {
                    checked = true;
                    break;
                }
            }

            inputWrap.innerHTML = `<input type = "checkbox" value = "${el}" id = "${el}" class = "filter-checkbox__input">\
                                    <label for = "${el}" class = "checkbox-label"> ${el}</label>`;

            const checkboxElement = <HTMLInputElement>inputWrap.firstChild;
            if (checkboxElement) {
                checkboxElement.addEventListener('change', () => {
                    const url = new URL(window.location.href);
                    const params = new URLSearchParams(url.search);
                    if (checkboxElement.checked) {
                        params.append(criterion, checkboxElement.value);
                        window.location.search = params.toString();
                    } else {
                        const newQuery = this.query
                            .slice(1)
                            .split('&')
                            .filter((el) => el !== `${criterion}=${checkboxElement.value}`);
                        window.location.search = '?' + newQuery.join('&');
                    }
                });
            }

            if (checked) {
                checkboxElement.checked = true;
            }

            formElement.append(inputWrap);
        });

        return checkboxBlock;
    }

    createRange(criterion: string) {
        const query = new QueryParams();
        const queryParamsArrFrom = query.getQueryParam(criterion + 'From');
        const queryParamsArrTo = query.getQueryParam(criterion + 'To');
        const rangeBlock = createDocElement('div', 'slider');
        const header = createDocElement('h3', 'slider__header', criterion.toUpperCase());
        const rangeWrap = createDocElement('div', `filter-slider ${criterion}`);
        rangeBlock.append(header, rangeWrap);

        let fromValue;
        let toValue;
        let min;
        let max;

        if (criterion === 'price') {
            min = 10;
            max = 1749;
        } else if (criterion === 'stock') {
            min = 2;
            max = 150;
        }

        fromValue = min;
        toValue = max;

        if (queryParamsArrFrom.length > 0) {
            fromValue = Number(queryParamsArrFrom[0]);
        }
        if (queryParamsArrTo.length > 0) {
            toValue = Number(queryParamsArrTo[0]);
        }

        rangeWrap.innerHTML = `<input id="fromSlider" type="range" value="${fromValue}" min="${min}" max="${max}"/>\
            <input id="toSlider" type="range" value="${toValue}" min="${min}" max="${max}"/>`;

        const fromInput = <HTMLInputElement>rangeWrap.firstChild;
        const toInput = <HTMLInputElement>rangeWrap.lastChild;

        fromInput?.addEventListener('mouseup', () => {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            if (queryParamsArrTo.length === 0 || Number(fromInput.value) < Number(queryParamsArrTo[0])) {
                if (queryParamsArrFrom.length > 0) {
                    params.delete(criterion + 'From');
                }
                params.append(criterion + 'From', fromInput.value);
            } else {
                if (queryParamsArrTo.length > 0) {
                    params.delete(criterion + 'From');
                    params.delete(criterion + 'To');
                    params.append(criterion + 'From', queryParamsArrTo[0]);
                    params.append(criterion + 'To', fromInput.value);
                }
            }
            window.location.search = params.toString();
        });
        toInput?.addEventListener('mouseup', () => {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            if (queryParamsArrFrom.length === 0 || Number(toInput.value) > Number(queryParamsArrFrom[0])) {
                if (queryParamsArrTo.length > 0) {
                    params.delete(criterion + 'To');
                }
                params.append(criterion + 'To', toInput.value);
            } else {
                if (queryParamsArrFrom.length > 0) {
                    params.delete(criterion + 'From');
                    params.delete(criterion + 'To');
                    params.append(criterion + 'To', queryParamsArrFrom[0]);
                    params.append(criterion + 'From', toInput.value);
                }
            }
            window.location.search = params.toString();
        });

        return rangeBlock;
    }

    createBtnBlock() {
        const btnClear = createDocElement('button', 'button-clear', 'Reset Filters');
        btnClear.addEventListener('click', () => {
            window.location.search = '';
        });
        const btnCopy = createDocElement('button', 'button-copy', 'Copy Link');
        btnCopy.addEventListener('click', () => {
            if (btnCopy.innerText === 'Copy Link') {
                btnCopy.innerText = 'Copied!';
            }
            navigator.clipboard.writeText(window.location.href);
        });
        const btnWrap = createDocElement('div', 'filters__button-wrap');
        btnWrap.append(btnClear, btnCopy);
        return btnWrap;
    }

    render() {
        if (!FiltersList.filterSection.firstChild) {
            FiltersList.filterSection.append(
                this.createBtnBlock(),
                this.createCheckbox('categories'),
                this.createCheckbox('brand'),
                this.createRange('price'),
                this.createRange('stock')
            );
        }

        return FiltersList.filterSection;
    }
}
