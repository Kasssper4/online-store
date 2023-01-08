import { Total } from '../../components/cart/totalBlock';
import { CartList } from '../../components/products list/cartList';
import { Page } from '../../patterns/pagePattern';
export class CartPage extends Page {
    private cartList: CartList;
    private total: Total;

    constructor(id: string) {
        super(id);
        this.cartList = new CartList();
        this.total = new Total();
    }

    render() {
        const title = this.createHeader(`Products in cart`);
        const main = document.createElement('main');
        main.className = 'cart-page-main';
        main.prepend(this.cartList.render(), this.total.render());
        this.container.append(title, main);
        return this.container;
    }
}

export default CartPage;
