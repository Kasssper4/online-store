import { IProductInfo } from '../../interfaces/interfaces';
import { PageIds } from '../../pages/app/index';

export class ProductItem {
    prodList = document.createElement('section');
    async loadAllProducts() {
        const response = await fetch('https://dummyjson.com/products');
        const parseResponse: Promise<IProductInfo> = await response.json();
        return parseResponse;
    }

    render() {
        this.loadAllProducts().then((productsList) =>
            productsList.products.map((productItem, i) => {
                const prodItemWrap = document.createElement('a');
                const prodImageWrap = document.createElement('div');
                prodImageWrap.classList.add('product-image-wrap');

                prodItemWrap.className = 'item-wrap';
                const href = `#${PageIds.ProductPage}/${i + 1}`;
                prodItemWrap.href = href;
                const prodDescription = document.createElement('div');
                prodDescription.classList.add('prod-item-description');
                prodItemWrap.append(productItem.title);
                prodDescription.insertAdjacentHTML('beforeend', `<div>Category: ${productItem.category}</div>`);
                prodDescription.insertAdjacentHTML('beforeend', `<div>Brand: ${productItem.brand}</div>`);
                prodDescription.insertAdjacentHTML('beforeend', `<div>Price: $${String(productItem.price)}</div>`);
                prodDescription.insertAdjacentHTML(
                    'beforeend',
                    `<div>Discount: ${String(productItem.discountPercentage)}</div>`
                );
                prodDescription.insertAdjacentHTML('beforeend', `<div>Rating: ${String(productItem.rating)}</div>`);
                prodDescription.insertAdjacentHTML('beforeend', `<div>Stock: ${String(productItem.stock)}</div>`);

                const productImage = document.createElement('img');
                prodImageWrap.append(productImage);
                prodItemWrap.append(prodDescription, prodImageWrap);
                productImage.src = productItem.images[0];

                this.prodList.append(prodItemWrap);
            })
        );
        this.prodList.className = 'items-wrap';
        return this.prodList;
    }
}
