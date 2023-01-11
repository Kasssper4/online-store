import { Cart } from '../../components/cart/cart';
import Component from '../../patterns/component';
import { PageIds } from '../app/index';

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

    renderPageButtons() {
        const pageButtons = document.createElement('nav');
        pageButtons.className = 'header__nav';
        buttons.forEach((button) => {
            const buttonHTML = document.createElement('a');
            buttonHTML.className = 'header__nav-link';
            buttonHTML.href = `#${button.id}`;
            buttonHTML.innerHTML = `<div class = "header__ico ${
                button.text.split(' ')[0].toLowerCase() + '-link'
            }"></div>\
            <div class = "header__text ${button.text.split(' ')[0].toLowerCase() + '-nav-text'}">Online Store</div>`;
            pageButtons.append(buttonHTML);
        });
        const catrText = pageButtons.querySelector('.cart-nav-text');
        catrText?.remove();

        const cart = pageButtons.lastChild;
        const amountOfProduct = document.createElement('p');
        const totalSumBlock = document.createElement('p');
        amountOfProduct.className = 'cart-amount';
        totalSumBlock.className = 'total-sum';
        totalSumBlock.innerHTML = '<span class = "money">0 </span><span>$</span>';

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

        cart?.appendChild(amountOfProduct);
        cart?.appendChild(totalSumBlock);

        // window.addEventListener('storage', () => {
        //     console.log(1);
        //     if (prodInCart) {
        //         amountOfProduct.innerText = `${JSON.parse(prodInCart).length}`;
        //     }
        // });

        this.container.append(pageButtons);
    }

    render() {
        this.renderPageButtons();
        return this.container;
    }
}

export default Header;
