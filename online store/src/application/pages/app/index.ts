import MainPage from '../main/index';
import CartPage from '../cart/index';
import Header from '../components/header/index';
import { Page } from '../../patterns/pagePattern';
import ProductPage from '../product page/productPage';

export const enum PageIds {
    MainPage = 'main-page',
    CartPage = 'cart-page',
    ProductPage = 'product-page',
}

class App {
    private static container: HTMLElement = document.body;
    private static defaultPageId = 'current-page';
    private header: Header;

    static renderNewPage(idPage: string) {
        const currentPage = document.querySelector(`#${App.defaultPageId}`);
        if (currentPage) {
            currentPage.remove();
        }
        let page: Page | null = null;

        if (idPage === PageIds.MainPage) {
            console.log('main');
            page = new MainPage(idPage);
        } else if (idPage === PageIds.CartPage) {
            console.log('cart');
            page = new CartPage(idPage);
        } else if (/product-page/.test(idPage)) {
            page = new ProductPage(PageIds.ProductPage, idPage.split('/')[1]);
        }

        if (page) {
            const pageHTML = page.render();
            pageHTML.id = App.defaultPageId;
            App.container.append(pageHTML);
        }
    }

    private enableRouteChange() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            App.renderNewPage(hash);
        });
    }

    constructor() {
        this.header = new Header('header', 'header-container');
    }

    run() {
        App.container.append(this.header.render());
        App.renderNewPage('main-page');
        this.enableRouteChange();
    }
}

export default App;
