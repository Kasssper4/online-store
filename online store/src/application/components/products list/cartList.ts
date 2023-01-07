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
            const currentProdIdArr = this.cart.getProductsInCart().map((prod) => prod.id);
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

                card.append(imgWrap);
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
