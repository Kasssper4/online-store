import { ProductItem } from '../../components/product item/productItem';
import { ProductsList } from '../../components/product List/productsList';
import { Page } from '../../patterns/pagePattern';

class MainPage extends Page {
    static TextObj = {
        MainTitle: 'Main page',
    };
    private productsList = new ProductsList();
    private productItem = new ProductItem();

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createHeader(`Online store. ${MainPage.TextObj.MainTitle}.`);
        this.container.append(title);
        this.container.append(this.productsList.render());
        this.container.append(this.productItem.render());
        return this.container;
    }
}

export default MainPage;
