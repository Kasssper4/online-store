import { IProductInfo, ISort } from '../../interfaces/interfaces';
import { PageIds } from '../../pages/app/index';
import { ControlPanel } from '../control panel/controlPanel';
import { QueryParams } from '../queryParams';

export class ProductsList {
    private controlPanel: ControlPanel;

    constructor() {
        this.controlPanel = new ControlPanel();
    }

    private prodSection = document.createElement('section');
    private prodList = document.createElement('div');

    async loadAllProducts() {
        const response = await fetch('https://dummyjson.com/products?limit=50');
        const parseResponse: Promise<IProductInfo> = await response.json();
        return parseResponse;
    }

    createProdListBlock() {
        const params = new QueryParams();
        const paramsArr = params.getAllFilterParams();

        this.loadAllProducts().then((productsList) => {
            let myList = productsList.products;
            if (window.location.search !== '') {
                myList = productsList.products.filter((productItem) => {
                    let match = 0;
                    let valuesStr = '';
                    for (const variable in productItem) {
                        if (variable !== 'id' && variable !== 'thumbnail' && variable !== 'images') {
                            valuesStr += productItem[variable as keyof typeof productItem] + ' ';
                        }
                    }
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
                        } else if (param[0] === 'search' && valuesStr.match(String(param[1][0]))) {
                            match += 1;
                        }
                    });
                    if (match === paramsArr.length) {
                        return productItem;
                    }
                });
            }

            const sortParam = params.getSortParam();
            if (sortParam) {
                const sortCriterion = sortParam.split('-')[0];
                const sortOrder = sortParam.split('-')[1];
                if (sortOrder === 'asc') {
                    myList.sort((a, b) => {
                        return a[sortCriterion as keyof ISort] - b[sortCriterion as keyof ISort];
                    });
                } else if (sortOrder === 'desc') {
                    myList.sort((a, b) => {
                        return b[sortCriterion as keyof ISort] - a[sortCriterion as keyof ISort];
                    });
                }
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
