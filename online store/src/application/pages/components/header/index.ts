import Component from '../../../patterns/component';
import { PageIds } from '../../app/index';

const Buttons = [
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
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    renderPageButtons() {
        const pageButtons = document.createElement('nav');
        pageButtons.className = 'header__nav';
        Buttons.forEach((button) => {
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
        this.container.append(pageButtons);
    }

    render() {
        this.renderPageButtons();
        return this.container;
    }
}

export default Header;
