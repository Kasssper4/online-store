export class QueryParams {
    getQueryParams(criterion: string) {
        const queryParams = window.location.search
            .slice(1)
            .split('&')
            .filter((el) => {
                if (el.split('=')[0] === criterion) return el;
            })
            .map((el) => el.split('=')[1]);
        return queryParams;
    }
}
