import { FiltersList } from '../../components/filters/filters';
import { ProductsList } from '../../components/products-list/products-list';
import { Page } from '../../patterns/page-pattern';
import { createDocElement } from '../../utilites/utilites';

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
        const main = createDocElement('main', 'main-page-main');
        main.append(this.filters.render(), this.productsList.render());
        this.container.append(main);
        return this.container;
    }
}

export default MainPage;
