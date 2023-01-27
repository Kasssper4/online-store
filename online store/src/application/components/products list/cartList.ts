import { Cart } from '../cart/cart';
import { Products } from './getProducts';
import { createDocElement } from '../../utilites/utilites';
import { ICart, IProductsItem } from '../../interfaces/interfaces';

export class CartList {
    private cart: Cart;
    private products: Products;

    constructor() {
        this.cart = new Cart();
        this.products = new Products();
    }

    private listSection = createDocElement('section', 'cart-list-section');
    private prodList = createDocElement('ul', 'cart-list');

    private updateCountAndSum(type: string, currProd: ICart | undefined) {
        const totalCount = document.querySelector('.count-in-summary');
        const totalSum = document.querySelector('.total-in-summary');
        if (totalCount && totalSum) {
            if (type === 'plus') {
                totalCount.innerHTML = `${Number(totalCount.innerHTML) + 1}`;
                totalSum.innerHTML = `${Number(totalSum.innerHTML) + Number(currProd?.price)}`;
            } else {
                totalCount.innerHTML = `${Number(totalCount.innerHTML) - 1}`;
                totalSum.innerHTML = `${Number(totalSum.innerHTML) - Number(currProd?.price)}`;
            }

            const totalWithDiscount = document.querySelector('.discount-in-summary');
            if (totalWithDiscount) {
                const resSum = Math.floor(
                    Number(totalSum.innerHTML) * ((100 - Number(totalWithDiscount.id.slice(2))) / 100)
                );
                totalWithDiscount.innerHTML = `${resSum}`;
            }
        }
    }

    private addProdInfo(prod: IProductsItem, currProd: ICart | undefined) {
        const card = createDocElement('li', 'product-in-cart');
        card.append(
            this.addImg(prod),
            this.addMainProdInfo(prod),
            this.addAdditionalInfo(prod),
            this.addActionBlock(currProd, prod)
        );
        return card;
    }

    private addImg(prod: IProductsItem) {
        const imgWrap = createDocElement('div', 'product-in-cart__img-wrap');
        const img = <HTMLImageElement>createDocElement('img', 'product-in-cart__img');
        img.src = prod.images[0];
        imgWrap.append(img);
        return imgWrap;
    }

    private addMainProdInfo(prod: IProductsItem) {
        const mainInfo = createDocElement('div', 'product-in-cart__main-info');
        mainInfo.append(
            createDocElement('h3', 'product-in-cart__title', `${prod.title}`),
            createDocElement('p', 'product-in-cart__brand', `${prod.brand}`),
            createDocElement('p', 'product-in-cart__category', `${prod.category}`),
            createDocElement('p', 'product-in-cart__description', `${prod.description}`)
        );
        return mainInfo;
    }

    private addAdditionalInfo(prod: IProductsItem) {
        const additionalInfo = createDocElement('div', 'product-in-cart__add-info');
        function addBlockadditional(name: string) {
            const block = createDocElement('div', `product-in-cart__${name}`);
            const svg = createDocElement('div', `svg-${name}`);
            const text = createDocElement('div', 'product-in-cart-text', `${prod[name as keyof typeof prod]}`);
            block.append(svg, text);
            return block;
        }
        additionalInfo.append(
            addBlockadditional('rating'),
            addBlockadditional('discountPercentage'),
            addBlockadditional('stock')
        );
        return additionalInfo;
    }

    private addActionBlock(currProd: ICart | undefined, prod: IProductsItem) {
        const actionBlock = createDocElement('div', 'product-in-cart__action');
        const totalBlock = createDocElement('div', 'product-in-cart__total');
        const prodCount = createDocElement('p', 'product-in-cart__prod-count');
        const money = createDocElement('p', 'product-in-cart__money');
        if (currProd) {
            prodCount.innerText = `${currProd?.count}`;
            money.innerText = `${currProd?.count * currProd?.price} $`;
        }
        totalBlock.append(prodCount, money);
        const plusBtn = this.addButton('plus', currProd, prodCount, money, prod);
        const minusBtn = this.addButton('minus', currProd, prodCount, money, prod);
        actionBlock.append(minusBtn, totalBlock, plusBtn);
        return actionBlock;
    }

    private addButton(
        type: string,
        currProd: ICart | undefined,
        prodCount: HTMLElement,
        money: HTMLElement,
        prod: IProductsItem
    ) {
        const btn = createDocElement('div', `btn-in-cart__${type}`);
        btn.addEventListener('click', (e) => {
            if (type === 'plus' && currProd && Number(prodCount.innerText) !== prod.stock) {
                prodCount.innerText = `${Number(prodCount.innerText) + 1}`;
                money.innerText = `${Number(money.innerText.slice(0, money.innerText.length - 2)) + currProd.price} $`;
                this.cart.addProductToCart(currProd.id, currProd.price);
                this.cart.updateCartInfo();
            } else if (type === 'minus' && currProd) {
                if (prodCount.innerText === '1') {
                    (<Element>e.target).closest('li')?.remove();
                }
                prodCount.innerText = `${Number(prodCount.innerText) - 1}`;
                money.innerText = `${Number(money.innerText.slice(0, money.innerText.length - 2)) - currProd.price} $`;
                this.cart.removeProductsFromCart(currProd.id, 'fromCart');
                this.cart.updateCartInfo();
                if (this.cart.getProductsInCart().length === 0) {
                    this.prodList.append(this.addNoProduct());
                }
            }
            this.updateCountAndSum(type, currProd);
        });
        return btn;
    }

    private addNoProduct() {
        const noProd = createDocElement('h2', 'no-product', 'Cart is Empty :(');
        return noProd;
    }

    createList() {
        this.products.loadAllProducts().then((productsList) => {
            const currentProdArr = this.cart.getProductsInCart();
            const currentProdIdArr = currentProdArr.map((prod) => prod.id);
            const cartList = productsList.products.filter((prod) => currentProdIdArr.includes(prod.id));

            if (cartList.length === 0) {
                this.prodList.append(this.addNoProduct());
            }
            cartList.forEach((prod) => {
                const currProd = currentProdArr.find((el) => el.id === prod.id);
                this.prodList.append(this.addProdInfo(prod, currProd));
            });
        });
        return this.prodList;
    }

    render() {
        this.listSection.append(this.createList());
        return this.listSection;
    }
}
