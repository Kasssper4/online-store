import { IProductsItem, ISort } from '../../interfaces/interfaces';
import { PageIds } from '../../pages/app/index';
import { Cart } from '../cart/cart';
import { ControlPanel } from '../control-panel/control-panel';
import { QueryParams } from '../query-params';
import { Products } from './get-products';
import { createDocElement } from '../../utilites/utilites';

export class ProductsList {
    private products: Products;
    private controlPanel: ControlPanel;
    private params: QueryParams;
    private cart: Cart;

    constructor() {
        this.products = new Products();
        this.controlPanel = new ControlPanel();
        this.params = new QueryParams();
        this.cart = new Cart();
    }

    private prodSection = createDocElement('section', 'products');
    private prodList = document.createElement('div');

    private filterProducts(notFilteredArr: Array<IProductsItem>) {
        const paramsArr = this.params.getAllFilterParams();
        const filteredArr = notFilteredArr.filter((productItem) => {
            let match = 0;
            let valuesStr = '';
            for (const variable in productItem) {
                if (variable !== 'id' && variable !== 'thumbnail' && variable !== 'images') {
                    valuesStr += productItem[variable as keyof typeof productItem] + ' ';
                }
            }
            valuesStr = valuesStr.toLowerCase();
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
                } else if (param[0] === 'search' && valuesStr.match(String(param[1][0]).toLowerCase())) {
                    match += 1;
                }
            });
            if (match === paramsArr.length) {
                return productItem;
            }
        });
        return filteredArr;
    }

    private sortProducts(notSortedArr: Array<IProductsItem>, sortParam: string) {
        const sortCriterion = sortParam.split('-')[0];
        const sortOrder = sortParam.split('-')[1];
        if (sortOrder === 'asc') {
            notSortedArr.sort((a, b) => {
                return a[sortCriterion as keyof ISort] - b[sortCriterion as keyof ISort];
            });
        } else if (sortOrder === 'desc') {
            notSortedArr.sort((a, b) => {
                return b[sortCriterion as keyof ISort] - a[sortCriterion as keyof ISort];
            });
        }
        return notSortedArr;
    }

    private addViewClassname(card: HTMLElement, prodItemWrap: HTMLAnchorElement) {
        const viewParam = this.params.getViewParam();
        if (viewParam === 'tile-view' || !viewParam) {
            card.className = 'card';
            prodItemWrap.className = 'item-wrap';
        } else {
            card.className = 'card-list';
            prodItemWrap.className = 'item-wrap-list';
        }
    }

    private createCard(productItem: IProductsItem) {
        const card = createDocElement('div', 'card');
        const prodItemWrap = document.createElement('a');
        const prodImageWrap = createDocElement('div', 'product-image-wrap');
        this.addViewClassname(card, prodItemWrap);

        prodItemWrap.href = `#${PageIds.ProductPage}/${productItem.id}`;
        const prodDescription = createDocElement('div', 'prod-item-description');
        prodDescription.insertAdjacentHTML('beforeend', `<h3>${productItem.title}</h3>`);
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
        prodItemWrap.append(prodImageWrap, prodDescription);
        productImage.src = productItem.images[0];
        card.append(prodItemWrap, this.addCartButton(productItem.id, productItem.price, 'fromMain-btn'));
        this.prodList.append(card);
    }

    createProdListBlock() {
        this.products.loadAllProducts().then((productsList) => {
            let myList = productsList.products;
            if (window.location.search !== '') {
                myList = this.filterProducts(productsList.products);
            }

            const sortParam = this.params.getSortParam();
            if (sortParam) {
                myList = this.sortProducts(myList, sortParam);
            }

            const counterProduct = document.querySelector('.products-amount__num');
            if (counterProduct) {
                counterProduct.innerHTML = `${myList.length}`;
            }

            if (myList.length === 0) {
                this.prodList.innerHTML = `<h2 class = "no-products">No products found</h2>`;
            }

            myList.forEach((productItem) => {
                return this.createCard(productItem);
            });
        });
        return this.prodList;
    }

    addCartButton(id: number, price: number, className: string) {
        const addBtn = createDocElement('button', `add-button ${className}`);

        const currentProdArr = this.cart.getProductsInCart();
        const currentIdArr = currentProdArr.map((prod) => prod.id);

        if (currentIdArr.includes(id)) {
            addBtn.innerText = 'Drop from cart';
            addBtn.classList.add('adding');
        } else {
            addBtn.innerText = 'Add to cart';
        }

        addBtn.addEventListener('click', (e) => {
            const btnEl = <HTMLElement>e.target;
            if (btnEl.classList.contains('adding')) {
                btnEl.classList.remove('adding');
                btnEl.innerText = 'Add to cart';
                this.cart.removeProductsFromCart(id, 'fromMain');
            } else {
                btnEl.classList.add('adding');
                btnEl.innerText = 'Drop from cart';
                this.cart.addProductToCart(id, price);
            }
            this.cart.updateCartInfo();
        });
        return addBtn;
    }

    render() {
        const viewParam = this.params.getViewParam();
        if (viewParam === 'tile-view' || !viewParam) {
            this.prodList.className = 'items-wrap';
        } else {
            this.prodList.className = 'items-wrap-list';
        }
        this.prodSection.append(this.controlPanel.render(), this.createProdListBlock());
        return this.prodSection;
    }
}
