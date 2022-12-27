import { FiltersList } from '../../components/filters/filters';
import { ProductItem } from '../../components/product item/productItem';
import { Page } from '../../patterns/pagePattern';

class MainPage extends Page {
    static TextObj = {
        MainTitle: 'Main page',
    };
    private productItem = new ProductItem();
    private filters: FiltersList;

    constructor(id: string, query: string) {
        super(id);
        this.filters = new FiltersList(query);
    }

    render() {
        const title = this.createHeader(`Online store. ${MainPage.TextObj.MainTitle}.`);
        this.container.append(title);
        const main = document.createElement('main');
        main.className = 'main-page-main';
        main.append(this.filters.render(), this.productItem.render());
        this.container.append(main);
        return this.container;
    }
}

export default MainPage;
