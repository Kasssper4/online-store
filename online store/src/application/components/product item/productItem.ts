import { IProductInfo } from '../../interfaces/interfaces';

export class ProductItem {
    prodList = document.createElement('div');
    async loadAllProducts() {
        const response = await fetch('https://dummyjson.com/products');
        const parseResponse: Promise<IProductInfo> = await response.json();
        return parseResponse;
    }

    render() {
        this.loadAllProducts().then((productsList) =>
            productsList.products.map((productItem) => {
                const prodItemWrap = document.createElement('div');
                const prodImageWrap = document.createElement('div');
                prodImageWrap.classList.add('product-image-wrap');

                prodItemWrap.className = 'item-wrap';
                prodItemWrap.append(productItem.title);

                const productImage = document.createElement('img');
                prodImageWrap.append(productImage);
                prodItemWrap.append(prodImageWrap);
                productImage.src = productItem.images[0];

                this.prodList.append(prodItemWrap);
            })
        );
        this.prodList.className = 'items-wrap';
        return this.prodList;
    }
}
