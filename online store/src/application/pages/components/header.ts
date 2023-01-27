import { Cart } from '../../components/cart/cart';
import Component from '../../patterns/component';
import { PageIds } from '../app/index';
import { createDocElement } from '../../utilites/utilites';

const buttons = [
    {
        id: PageIds.MainPage,
        text: 'Main Page',
    },
    {
        id: PageIds.CartPage,
        text: 'Cart Page',
    },
];

class Header extends Component {
    private cart: Cart;

    constructor(tagName: string, className: string) {
        super(tagName, className);
        this.cart = new Cart();
    }

    private pageButtons = createDocElement('nav', 'header__nav');

    private createButton(button: { id: PageIds; text: string }) {
        const buttonHTML = <HTMLAnchorElement>createDocElement('a', 'header__nav-link');
        buttonHTML.href = `#${button.id}`;
        buttonHTML.innerHTML = `<div class = "header__ico ${button.text.split(' ')[0].toLowerCase() + '-link'}"></div>\
        <div class = "header__text ${button.text.split(' ')[0].toLowerCase() + '-nav-text'}">Online Store</div>`;
        this.pageButtons.append(buttonHTML);
    }

    private getProductsStat() {
        const amountOfProduct = createDocElement('p', 'cart-amount');
        const totalSumBlock = createDocElement('p', 'total-sum');
        totalSumBlock.innerHTML = `<span class = "money">0 </span><span>$</span>`;
        const prodInCart = this.cart.getProductsInCart();
        let prodCounter = 0;
        let totalSum = 0;

        prodInCart.forEach((prod) => {
            prodCounter += prod.count;
            totalSum += prod.price * prod.count;
        });

        amountOfProduct.innerText = `${prodCounter}`;
        if (totalSumBlock.firstChild) {
            (<HTMLElement>totalSumBlock.firstChild).innerText = `${totalSum}`;
        }
        return { amount: amountOfProduct, sum: totalSumBlock };
    }

    renderPageButtons() {
        buttons.forEach((button) => {
            return this.createButton(button);
        });

        const catrText = this.pageButtons.querySelector('.cart-nav-text');
        catrText?.remove();

        const cart = this.pageButtons.lastChild;
        const prodStat = this.getProductsStat();

        cart?.appendChild(prodStat.amount);
        cart?.appendChild(prodStat.sum);
        this.container.append(this.pageButtons);
    }

    render() {
        this.renderPageButtons();
        return this.container;
    }
}

export default Header;
