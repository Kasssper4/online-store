export class FiltersList {
    static filterSection = document.createElement('section');
    query: string;
    static categotiesArr = [
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

    getQueryParams(criterion: string) {
        const queryParams = this.query
            .slice(1)
            .split('&')
            .filter((el) => {
                if (el.split('=')[0] === criterion) return el;
            })
            .map((el) => el.split('=')[1]);
        return queryParams;
    }

    createCheckbox(criterion: string) {
        const queryParamsArr = this.getQueryParams(criterion);
        const checkboxBlock = document.createElement('div');
        checkboxBlock.className = 'checkbox';
        const header = document.createElement('h3');
        header.innerText = criterion;
        const formElement = document.createElement('form');
        formElement.className = `filter-form ${criterion}`;
        checkboxBlock.append(header, formElement);

        let arr;
        criterion === 'categories' ? (arr = FiltersList.categotiesArr) : (arr = FiltersList.brandsArr);

        arr.forEach((el) => {
            const inputWrap = document.createElement('p');
            inputWrap.className = 'filter-checkbox';
            let checked = false;

            for (let i = 0; i < queryParamsArr.length; i++) {
                if (queryParamsArr[i] === el) {
                    checked = true;
                    break;
                }
            }

            inputWrap.innerHTML = `<input type = "checkbox" value = "${el}" class = "filter-checkbox__input"> ${el}`;

            if (inputWrap.firstChild) {
                inputWrap.firstChild.addEventListener('change', () => {
                    const url = new URL(window.location.href);
                    const params = new URLSearchParams(url.search);
                    if ((inputWrap.firstChild as HTMLInputElement).checked) {
                        params.append(criterion, (inputWrap.firstChild as HTMLInputElement).value);
                        window.location.search = params.toString();
                    } else {
                        const newQuery = this.query
                            .slice(1)
                            .split('&')
                            .filter((el) => el !== `${criterion}=${(inputWrap.firstChild as HTMLInputElement).value}`);
                        window.location.search = '?' + newQuery.join('&');
                    }
                });
            }

            if (checked) {
                (inputWrap.firstChild as HTMLInputElement).checked = true;
            }

            formElement.append(inputWrap);
        });

        return checkboxBlock;
    }

    createRange(criterion: string) {
        const queryParamsArrFrom = this.getQueryParams(criterion + 'From');
        const queryParamsArrTo = this.getQueryParams(criterion + 'To');
        const rangeBlock = document.createElement('div');
        rangeBlock.className = 'slider';
        const header = document.createElement('h3');
        header.innerText = criterion;
        const rangeWrap = document.createElement('div');
        rangeWrap.className = `filter-slider ${criterion}`;
        rangeBlock.append(header, rangeWrap);

        let fromValue = 0;
        let toValue = 100;
        if (queryParamsArrFrom.length > 0) {
            fromValue = Number(queryParamsArrFrom[0]);
        }
        if (queryParamsArrTo.length > 0) {
            toValue = Number(queryParamsArrTo[0]);
        }

        rangeWrap.innerHTML = `<input id="fromSlider" type="range" value="${fromValue}" min="0" max="100"/>\
            <input id="toSlider" type="range" value="${toValue}" min="0" max="100"/>`;

        const fromInput = rangeWrap.firstChild;
        const toInput = rangeWrap.lastChild;

        fromInput?.addEventListener('input', () => {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            if (
                queryParamsArrTo.length === 0 ||
                Number((fromInput as HTMLInputElement).value) < Number(queryParamsArrTo[0])
            ) {
                if (queryParamsArrFrom.length > 0) {
                    params.delete(criterion + 'From');
                }
                params.append(criterion + 'From', (fromInput as HTMLInputElement).value);
            } else {
                if (queryParamsArrTo.length > 0) {
                    params.delete(criterion + 'From');
                    params.delete(criterion + 'To');
                    params.append(criterion + 'From', queryParamsArrTo[0]);
                    params.append(criterion + 'To', (fromInput as HTMLInputElement).value);
                }
            }
            window.location.search = params.toString();
        });
        toInput?.addEventListener('input', () => {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            if (
                queryParamsArrFrom.length === 0 ||
                Number((toInput as HTMLInputElement).value) > Number(queryParamsArrFrom[0])
            ) {
                if (queryParamsArrTo.length > 0) {
                    params.delete(criterion + 'To');
                }
                params.append(criterion + 'To', (toInput as HTMLInputElement).value);
            } else {
                if (queryParamsArrFrom.length > 0) {
                    params.delete(criterion + 'From');
                    params.delete(criterion + 'To');
                    params.append(criterion + 'To', queryParamsArrFrom[0]);
                    params.append(criterion + 'From', (toInput as HTMLInputElement).value);
                }
            }
            window.location.search = params.toString();
        });

        return rangeBlock;
    }

    render() {
        FiltersList.filterSection.className = 'filters';

        if (!FiltersList.filterSection.firstChild) {
            FiltersList.filterSection.append(
                this.createCheckbox('categories'),
                this.createCheckbox('brand'),
                this.createRange('price'),
                this.createRange('stock')
            );
        }

        return FiltersList.filterSection;
    }
}
