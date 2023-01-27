import { QueryParams } from '../query-params';
import { Cart } from './cart';
import { ModalWindow } from './modal-window';
import { createDocElement } from '../../utilites/utilites';

export class Total {
    private cart: Cart;
    private modal: ModalWindow;
    private query: QueryParams;

    constructor() {
        this.cart = new Cart();
        this.modal = new ModalWindow();
        this.query = new QueryParams();
    }

    private totalSection = document.createElement('section');
    private promoArr = [
        { name: 'RS', discount: 10 },
        { name: 'EPM', discount: 10 },
    ];
    private summary = createDocElement('div', 'cart-summary');
    private totalSumBlock = createDocElement('h2', 'cart-summary__sum');
    private newTotal = createDocElement('h2', 'cart-summary__sum');
    private discount = 0;

    private getTotalSumAndCount() {
        const currentProdArr = this.cart.getProductsInCart();
        let prodCounter = 0;
        let totalSum = 0;

        currentProdArr.forEach((prod) => {
            prodCounter += prod.count;
            totalSum += prod.price * prod.count;
        });

        return { count: prodCounter, sum: totalSum };
    }

    private checkInputPromo(value: string) {
        const promoEl = this.promoArr.find((el) => {
            if (el.name === value.toLowerCase() || el.name === value.toUpperCase()) return el;
        });
        const addingPromo = Array.from(this.summary.children).map((el) => el.id);
        if (promoEl && !addingPromo.includes(promoEl.name)) return promoEl;
        return '';
    }

    private changeNewTotalSum() {
        const finalSum = Math.floor(
            Number(document.querySelector('.money')?.innerHTML) * ((100 - this.discount) / 100)
        );
        this.newTotal.innerHTML = `Total: <span class = "discount-in-summary" id = "d:${this.discount}">${finalSum}</span>$`;
    }

    private createRemovePromo(promoDiscount: number, newPromoEl: HTMLElement) {
        const removeBtn = createDocElement('div', 'promo-code__remove');

        removeBtn.addEventListener('click', () => {
            this.discount -= promoDiscount;
            if (this.discount === 0) {
                this.newTotal.innerText = '';
                this.totalSumBlock.style.textDecoration = 'none';
            } else {
                this.changeNewTotalSum();
            }
            newPromoEl.remove();
        });
        return removeBtn;
    }

    private createNewPromoBlock(promoName: string, promoDiscount: number) {
        const newPromo = createDocElement('div', 'promo-code');
        newPromo.id = promoName;
        newPromo.innerHTML = `<p class = "promo-code__text">${promoName} -${promoDiscount}%</p>`;
        const removeBtn = this.createRemovePromo(promoDiscount, newPromo);
        newPromo.append(removeBtn);
        return newPromo;
    }

    private createBuyButton() {
        const buyBtn = createDocElement('button', 'cart-buy', 'Buy now');
        buyBtn.addEventListener('click', () => {
            this.modal.openModal();
        });
        return buyBtn;
    }

    createTotal() {
        const totalInfo = this.getTotalSumAndCount();
        const productCount = createDocElement('p', 'cart-summary__count');
        productCount.innerHTML = `Products: <span class = "count-in-summary">${totalInfo.count}</span>`;
        this.totalSumBlock.innerHTML = `Total: <span class = "total-in-summary">${totalInfo.sum}</span>$`;
        const promo = createDocElement('div', 'cart-summary__promo');
        const promoText = createDocElement('p', 'promo-text', 'Promo code:');
        const input = <HTMLInputElement>createDocElement('input', 'promo-input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Test promo: RS, EPM');

        input.addEventListener('change', () => {
            const promoEl = this.checkInputPromo(input.value);

            if (promoEl) {
                const newPromo = this.createNewPromoBlock(promoEl.name, promoEl.discount);
                this.discount += promoEl.discount;
                this.totalSumBlock.style.textDecoration = 'line-through';

                this.changeNewTotalSum();

                promo.after(newPromo);

                if (this.newTotal.innerText !== '') {
                    this.totalSumBlock.after(this.newTotal);
                }
            }
            input.value = '';
        });
        promo.append(promoText, input);
        this.summary.append(productCount, promo, this.totalSumBlock);
        const buyBtn = this.createBuyButton();

        this.totalSection.append(this.summary, buyBtn, this.modal.render());

        if (this.query.getModalParam() === 'yes') {
            this.modal.openModal();
        }

        return this.totalSection;
    }

    render() {
        this.totalSection.className = 'cart-total-section';
        return this.createTotal();
    }
}
