import { CartList } from '../../components/products list/cartList';
import { Page } from '../../patterns/pagePattern';
export class CartPage extends Page {
    private cartList: CartList;

    constructor(id: string) {
        super(id);
        this.cartList = new CartList();
    }

    render() {
        const title = this.createHeader(`Products in cart`);
        this.container.append(title, this.cartList.render());
        return this.container;
    }
}

export default CartPage;
