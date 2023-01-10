export class QueryParams {
    paramArr = [
        'categories',
        'brand',
        'priceFrom',
        'priceTo',
        'stockFrom',
        'stockTo',
        'search',
        'sort',
        'view',
        'modal',
    ];

    getQueryParam(criterion: string) {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        return params.getAll(criterion);
    }

    getAllFilterParams() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        function getRangeArr(criterion: string) {
            let resArr: (string | null)[] = [];

            if (params.get(`${criterion}From`) && params.get(`${criterion}To`)) {
                resArr = [params.get(`${criterion}From`), params.get(`${criterion}To`)];
            } else if (params.get(`${criterion}From`) && criterion === 'price') {
                resArr = [params.get(`${criterion}From`), '1749'];
            } else if (params.get(`${criterion}From`) && criterion === 'stock') {
                resArr = [params.get(`${criterion}From`), '150'];
            } else if (params.get(`${criterion}To`)) {
                resArr = ['0', params.get(`${criterion}To`)];
            }
            return resArr;
        }

        const paramsObj = {
            category: params.getAll('categories'),
            brand: params.getAll('brand'),
            price: getRangeArr('price'),
            stock: getRangeArr('stock'),
            search: params.getAll('search'),
        };

        return Object.entries(paramsObj).filter((el) => el[1].length > 0);
    }

    getSortParam() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        return params.get('sort');
    }

    getViewParam() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        return params.get('view');
    }

    getModalParam() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        return params.get('modal');
    }
}
