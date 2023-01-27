export class QueryParams {
    getQueryParam(criterion: string) {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        return params.getAll(criterion);
    }

    getAllFilterParams() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        function getRangeArr(criterion: string) {
            if (params.get(`${criterion}From`) && params.get(`${criterion}To`)) {
                return [params.get(`${criterion}From`), params.get(`${criterion}To`)];
            }

            if (params.get(`${criterion}From`) && criterion === 'price') {
                return [params.get(`${criterion}From`), '1749'];
            }

            if (params.get(`${criterion}From`) && criterion === 'stock') {
                return [params.get(`${criterion}From`), '150'];
            }

            if (params.get(`${criterion}To`)) {
                return ['0', params.get(`${criterion}To`)];
            }

            return [];
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
