import { IProductInfo } from '../../interfaces/interfaces';
import { PageIds } from '../../pages/app/index';
import { ControlPanel } from '../control panel/controlPanel';

export class ProductsList {
    private controlPanel: ControlPanel;

    constructor() {
        this.controlPanel = new ControlPanel();
    }

    private prodSection = document.createElement('section');
    private prodList = document.createElement('div');

    async loadAllProducts() {
        const response = await fetch('https://dummyjson.com/products');
        const parseResponse: Promise<IProductInfo> = await response.json();
        return parseResponse;
    }

    getParams() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        function getRangeArr(criterion: string) {
            let resArr: (string | null)[] = [];

            if (params.get(`${criterion}From`) && params.get(`${criterion}To`)) {
                resArr = [params.get(`${criterion}From`), params.get(`${criterion}To`)];
            } else if (params.get(`${criterion}From`)) {
                resArr = [params.get(`${criterion}From`), '100'];
            } else if (params.get(`${criterion}To`)) {
                resArr = ['0', params.get(`${criterion}To`)];
            }
            return resArr;
        }

        const paramsObj = {
            category: params.getAll('categories'),
            brand: params.getAll('brand'),
            price: getRangeArr('price'),
            stock: getRangeArr('stock'),
        };

        return Object.entries(paramsObj).filter((el) => el[1].length > 0);
    }

    // createControlBlock() {

    // }

    createProdListBlock() {
        const paramsArr = this.getParams();

        this.loadAllProducts().then((productsList) => {
            let myList = productsList.products;
            if (window.location.search !== '') {
                myList = productsList.products.filter((productItem) => {
                    let match = 0;
                    paramsArr.forEach((param) => {
                        if (
                            (param[0] === 'brand' || param[0] === 'category') &&
                            param[1].includes(String(productItem[param[0] as keyof typeof productItem]))
                        ) {
                            match += 1;
                        } else if (
                            (param[0] === 'price' || param[0] === 'stock') &&
                            Number(productItem[param[0] as keyof typeof productItem]) >= Number(param[1][0]) &&
                            Number(productItem[param[0] as keyof typeof productItem]) <= Number(param[1][1])
                        ) {
                            match += 1;
                        }
                    });
                    if (match === paramsArr.length) {
                        return productItem;
                    }
                });
            }

            myList.forEach((productItem, i) => {
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
            });
        });
        return this.prodList;
    }

    render() {
        this.prodSection.className = 'products';
        this.prodList.className = 'items-wrap';
        this.prodSection.append(this.controlPanel.render(), this.createProdListBlock());
        return this.prodSection;
    }
}
