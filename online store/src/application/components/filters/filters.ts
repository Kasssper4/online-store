export class FiltersList {
    static filterSection = document.createElement('section');
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
    query: string;

    constructor(query: string) {
        this.query = query;
    }

    render() {
        const queryParamsArr = this.query
            .slice(1)
            .split('&')
            .filter((el) => {
                el.split('=')[0] === 'categories';
                return el;
            })
            .map((el) => el.split('=')[1]);

        const formCategories = document.createElement('form');
        formCategories.className = 'filter-form categories';

        FiltersList.categotiesArr.forEach((el) => {
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
                        params.append('categories', (inputWrap.firstChild as HTMLInputElement).value);
                        window.location.search = params.toString();
                    } else {
                        const newQuery = this.query
                            .slice(1)
                            .split('&')
                            .filter((el) => el !== `categories=${(inputWrap.firstChild as HTMLInputElement).value}`);
                        window.location.search = '?' + newQuery.join('&');
                    }
                });
            }

            if (checked) {
                (inputWrap.firstChild as HTMLInputElement).checked = true;
            }

            formCategories.append(inputWrap);
        });

        if (!FiltersList.filterSection.firstChild) {
            FiltersList.filterSection.append(formCategories);
        }

        return FiltersList.filterSection;
    }
}
