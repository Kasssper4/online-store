import { Cart } from '../cart/cart';
import { Products } from './getProducts';
import { createDocElement } from '../../utilites/utilites';

export class CartList {
    private cart: Cart;
    private products: Products;

    constructor() {
        this.cart = new Cart();
        this.products = new Products();
    }

    private listSection = createDocElement('section', 'cart-list-section');
    private prodList = createDocElement('ul', 'cart-list');

    createList() {
        this.products.loadAllProducts().then((productsList) => {
            const currentProdArr = this.cart.getProductsInCart();
            const currentProdIdArr = currentProdArr.map((prod) => prod.id);
            const cartList = productsList.products.filter((prod) => currentProdIdArr.includes(prod.id));

            const noProd = createDocElement('h2', 'no-product', 'Cart is Empty :(');
            if (cartList.length === 0) {
                this.prodList.append(noProd);
            }
            cartList.forEach((prod) => {
                const card = createDocElement('li', 'product-in-cart');
                const imgWrap = createDocElement('div', 'product-in-cart__img-wrap');
                const img = <HTMLImageElement>createDocElement('img', 'product-in-cart__img');
                img.src = prod.images[0];
                imgWrap.append(img);

                function addBlock(el: string, name: string) {
                    const block = createDocElement(
                        el,
                        `product-in-cart__${name}`,
                        `${prod[name as keyof typeof prod]}`
                    );
                    return block;
                }
                const mainInfo = createDocElement('div', 'product-in-cart__main-info');
                mainInfo.append(
                    addBlock('h3', 'title'),
                    addBlock('p', 'brand'),
                    addBlock('p', 'category'),
                    addBlock('p', 'description')
                );

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

                const actionBlock = createDocElement('div', 'product-in-cart__action');
                const totalBlock = createDocElement('div', 'product-in-cart__total');

                const currProd = currentProdArr.find((el) => el.id === prod.id);

                const prodCount = createDocElement('p', 'product-in-cart__prod-count');
                const money = createDocElement('p', 'product-in-cart__money');
                if (currProd) {
                    prodCount.innerText = `${currProd?.count}`;
                    money.innerText = `${currProd?.count * currProd?.price} $`;
                }

                totalBlock.append(prodCount, money);

                const addButton = (type: string) => {
                    const totalCount = document.querySelector('.count-in-summary');
                    const totalSum = document.querySelector('.total-in-summary');
                    const btn = createDocElement('div', `btn-in-cart__${type}`);
                    btn.addEventListener('click', (e) => {
                        if (type === 'plus' && currProd && Number(prodCount.innerText) !== prod.stock) {
                            prodCount.innerText = `${Number(prodCount.innerText) + 1}`;
                            money.innerText = `${
                                Number(money.innerText.slice(0, money.innerText.length - 2)) + currProd.price
                            } $`;
                            this.cart.addProductToCart(currProd.id, currProd.price);
                            this.cart.updateCartInfo();
                            if (totalCount && totalSum) {
                                totalCount.innerHTML = `${Number(totalCount.innerHTML) + 1}`;
                                totalSum.innerHTML = `${Number(totalSum.innerHTML) + currProd.price}`;
                                const totalWithDiscount = document.querySelector('.discount-in-summary');
                                if (totalWithDiscount) {
                                    const resSum = Math.floor(
                                        Number(totalSum.innerHTML) *
                                            ((100 - Number(totalWithDiscount.id.slice(2))) / 100)
                                    );
                                    totalWithDiscount.innerHTML = `${resSum}`;
                                }
                            }
                        } else if (type === 'minus' && currProd) {
                            if (prodCount.innerText === '1') {
                                (<Element>e.target).closest('li')?.remove();
                            }
                            prodCount.innerText = `${Number(prodCount.innerText) - 1}`;
                            money.innerText = `${
                                Number(money.innerText.slice(0, money.innerText.length - 2)) - currProd.price
                            } $`;
                            this.cart.removeProductsFromCart(currProd.id, 'fromCart');
                            this.cart.updateCartInfo();
                            if (this.cart.getProductsInCart().length === 0) {
                                this.prodList.append(noProd);
                            }
                            if (totalCount && totalSum) {
                                totalCount.innerHTML = `${Number(totalCount.innerHTML) - 1}`;
                                totalSum.innerHTML = `${Number(totalSum.innerHTML) - currProd.price}`;
                                const totalWithDiscount = document.querySelector('.discount-in-summary');
                                if (totalWithDiscount) {
                                    const resSum = Math.floor(
                                        Number(totalSum.innerHTML) *
                                            ((100 - Number(totalWithDiscount.id.slice(2))) / 100)
                                    );
                                    totalWithDiscount.innerHTML = `${resSum}`;
                                }
                            }
                        }
                    });
                    return btn;
                };

                actionBlock.append(addButton('minus'), totalBlock, addButton('plus'));

                card.append(imgWrap, mainInfo, additionalInfo, actionBlock);
                this.prodList.append(card);
            });
        });
        return this.prodList;
    }

    render() {
        this.listSection.append(this.createList());
        return this.listSection;
    }
}
