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
                function addButton(type: string) {
                    const btn = document.createElement('div');
                    btn.className = `btn-in-cart__${type}`;
                    return btn;
                }
                const totalBlock = document.createElement('div');
                totalBlock.className = 'product-in-cart__total';

                const currProd = currentProdArr.find((el) => el.id === prod.id);
                console.log(currProd);

                const prodCount = document.createElement('p');
                prodCount.className = 'product-in-cart__prod-count';
                const money = document.createElement('p');
                money.className = 'product-in-cart__money';
                if (currProd) {
                    prodCount.innerText = `${currProd?.count}`;
                    money.innerText = `${currProd?.count * currProd?.price} $`;
                }
                totalBlock.append(prodCount, money);

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
