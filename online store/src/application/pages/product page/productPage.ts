import { Page } from '../../patterns/pagePattern';

class ProductPage extends Page {
    static TextObj = 'Product page';

    constructor(id: string, numOfProd: string) {
        super(id);
        ProductPage.TextObj = numOfProd;
    }

    render() {
        const title = this.createHeader(`Online store. ${ProductPage.TextObj}.`);
        this.container.append(title);
        return this.container;
    }
}

export default ProductPage;
