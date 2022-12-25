import { IProductsItem } from '../../interfaces/interfaces';
import { Page } from '../../patterns/pagePattern';

class ProductPage extends Page {
    productTitle: HTMLHeadingElement;
    constructor(id: string, numOfProd: string) {
        super(id);
        ProductPage.TextObj = numOfProd;
        this.productTitle = document.createElement('h2');
    }

    async loadAllProducts(hash: string) {
        const response = await fetch(`https://dummyjson.com/${hash}`);
        const parseResponse: Promise<IProductsItem> = await response.json();
        return parseResponse;
    }

    render() {
        const hash = window.location.hash.slice(1);
        this.loadAllProducts(hash).then((product) => {
            this.container.append(
                this.createHeader(
                    `${product.category.toUpperCase()} >> ${product.brand.toUpperCase()} >> ${product.title.toUpperCase()}`
                )
            );
        });
        // const title = this.createHeader(`Product title`);
        // this.container.append(this.productTitle);
        return this.container;
    }
}

export default ProductPage;
