import { FiltersList } from '../../components/filters/filters';
import { ProductsList } from '../../components/products list/productsList';
import { Page } from '../../patterns/pagePattern';

class MainPage extends Page {
    static TextObj = {
        MainTitle: 'Main page',
    };

    private productsList: ProductsList;
    private filters: FiltersList;

    constructor(id: string, query: string) {
        super(id);
        this.filters = new FiltersList(query);
        this.productsList = new ProductsList();
    }

    render() {
        const title = this.createHeader('Catalog');
        this.container.append(title);
        const main = document.createElement('main');
        main.className = 'main-page-main';
        main.append(this.filters.render(), this.productsList.render());
        this.container.append(main);
        return this.container;
    }
}

export default MainPage;
