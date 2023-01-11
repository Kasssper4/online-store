import { Cart } from '../cart/cart';
import { Products } from './getProducts';

export class CartList {
    private cart: Cart;
    private products: Products;

    constructor() {
        this.cart = new Cart();
        this.products = new Products();
    }

    private listSection = document.createElement('section');
    private prodList = document.createElement('ul');

    createList() {
        this.products.loadAllProducts().then((productsList) => {
            const currentProdArr = this.cart.getProductsInCart();
            const currentProdIdArr = currentProdArr.map((prod) => prod.id);
            const cartList = productsList.products.filter((prod) => currentProdIdArr.includes(prod.id));

            const noProd = document.createElement('h2');
            noProd.className = 'no-product';
            noProd.innerText = 'Cart is Empty :(';
            if (cartList.length === 0) {
                this.prodList.append(noProd);
            }
            cartList.forEach((prod) => {
                const card = document.createElement('li');
                card.className = 'product-in-cart';

                const imgWrap = document.createElement('div');
                imgWrap.className = 'product-in-cart__img-wrap';
                const img = document.createElement('img');
                img.className = 'product-in-cart__img';
                img.src = prod.images[0];
                imgWrap.append(img);

                function addBlock(el: string, name: string) {
                    const block = document.createElement(el);
                    block.className = `product-in-cart__${name}`;
                    block.innerText = `${prod[name as keyof typeof prod]}`;
                    return block;
                }
                const mainInfo = document.createElement('div');
                mainInfo.className = 'product-in-cart__main-info';

                mainInfo.append(
                    addBlock('h3', 'title'),
                    addBlock('p', 'brand'),
                    addBlock('p', 'category'),
                    addBlock('p', 'description')
                );

                const additionalInfo = document.createElement('div');
                additionalInfo.className = 'product-in-cart__add-info';
                function addBlockadditional(name: string) {
                    const block = document.createElement('div');
                    block.className = `product-in-cart__${name}`;
                    const svg = document.createElement('div');
                    svg.className = `svg-${name}`;
                    const text = document.createElement('div');
                    text.innerText = `${prod[name as keyof typeof prod]}`;
                    block.append(svg, text);
                    return block;
                }
                additionalInfo.append(
                    addBlockadditional('rating'),
                    addBlockadditional('discountPercentage'),
                    addBlockadditional('stock')
                );

                const actionBlock = document.createElement('div');
                actionBlock.className = 'product-in-cart__action';

                const totalBlock = document.createElement('div');
                totalBlock.className = 'product-in-cart__total';

                const currProd = currentProdArr.find((el) => el.id === prod.id);

                const prodCount = document.createElement('p');
                prodCount.className = 'product-in-cart__prod-count';
                const money = document.createElement('p');
                money.className = 'product-in-cart__money';
                if (currProd) {
                    prodCount.innerText = `${currProd?.count}`;
                    money.innerText = `${currProd?.count * currProd?.price} $`;
                }

                totalBlock.append(prodCount, money);

                const addButton = (type: string) => {
                    const totalCount = document.querySelector('.count-in-summary');
                    const totalSum = document.querySelector('.total-in-summary');
                    const btn = document.createElement('div');
                    btn.className = `btn-in-cart__${type}`;
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
        this.listSection.className = 'cart-list-section';
        this.prodList.className = 'cart-list';
        this.listSection.append(this.createList());
        return this.listSection;
    }
}
