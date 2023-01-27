import { Total } from '../../components/cart/total-block';
import { CartList } from '../../components/products-list/cart-list';
import { Page } from '../../patterns/page-pattern';
import { createDocElement } from '../../utilites/utilites';
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
        const main = createDocElement('main', 'cart-page-main');
        main.prepend(this.cartList.render(), this.total.render());
        this.container.append(title, main);
        return this.container;
    }
}

export default CartPage;
