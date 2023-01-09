import { Cart } from './cart';
import { ModalWindow } from './modalWindow';

export class Total {
    private cart: Cart;
    private modal: ModalWindow;

    constructor() {
        this.cart = new Cart();
        this.modal = new ModalWindow();
    }

    private totalSection = document.createElement('section');
    private promoArr = [
        { name: 'RS', discount: 10 },
        { name: 'EPM', discount: 10 },
    ];

    createTotal() {
        const currentProdArr = this.cart.getProductsInCart();
        let prodCounter = 0;
        let totalSum = 0;

        currentProdArr.forEach((prod) => {
            prodCounter += prod.count;
            totalSum += prod.price * prod.count;
        });

        const summary = document.createElement('div');
        summary.className = 'cart-summary';
        const productCount = document.createElement('p');
        productCount.className = 'cart-summary__count';
        productCount.innerHTML = `Products: <span class = "count-in-summary">${prodCounter}</span>`;
        const totalSumBlock = document.createElement('h2');
        totalSumBlock.className = 'cart-summary__sum';
        totalSumBlock.innerHTML = `Total: <span class = "total-in-summary">${totalSum}</span>$`;
        const promo = document.createElement('div');
        promo.className = 'cart-summary__promo';
        const promoText = document.createElement('p');
        promoText.className = 'promo-text';
        promoText.innerText = 'Promo code:';
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Enter promo code');
        input.className = 'promo-input';
        let discount = 0;
        const newTotal = document.createElement('h2');
        newTotal.className = 'cart-summary__sum';
        input.addEventListener('change', () => {
            const promoEl = this.promoArr.find((el) => {
                if (el.name === input.value.toLowerCase() || el.name === input.value.toUpperCase()) return el;
            });
            const addingPromo = Array.from(summary.children).map((el) => el.id);

            if (promoEl && !addingPromo.includes(promoEl.name)) {
                const newPromo = document.createElement('div');
                newPromo.className = 'promo-code';
                newPromo.id = promoEl.name;
                newPromo.innerHTML = `<p class = "promo-code__text">${input.value} -${promoEl.discount}%</p>`;
                const removeBtn = document.createElement('div');
                removeBtn.className = 'promo-code__remove';
                discount += promoEl.discount;
                totalSumBlock.style.textDecoration = 'line-through';

                const resSum = Math.floor(
                    Number(document.querySelector('.money')?.innerHTML) * ((100 - discount) / 100)
                );
                newTotal.innerHTML = `Total: <span class = "discount-in-summary" id = "d:${discount}">${resSum}</span>$`;

                newPromo.append(removeBtn);
                promo.after(newPromo);
                removeBtn.addEventListener('click', () => {
                    discount -= promoEl.discount;
                    if (discount === 0) {
                        newTotal.innerText = '';
                        totalSumBlock.style.textDecoration = 'none';
                    } else {
                        const finalSum = Math.floor(
                            Number(document.querySelector('.money')?.innerHTML) * ((100 - discount) / 100)
                        );
                        newTotal.innerHTML = `Total: <span class = "discount-in-summary" id = "d:${discount}">${finalSum}</span>$`;
                    }
                    newPromo.remove();
                });
                if (newTotal.innerText !== '') {
                    totalSumBlock.after(newTotal);
                }
            }
            input.value = '';
        });
        promo.append(promoText, input);
        summary.append(productCount, promo, totalSumBlock);
        const buyBtn = document.createElement('button');
        buyBtn.className = 'cart-buy';
        buyBtn.innerText = 'Buy now';

        this.totalSection.append(summary, buyBtn, this.modal.render());

        buyBtn.addEventListener('click', () => {
            this.modal.openModal();
        });

        return this.totalSection;
    }

    render() {
        this.totalSection.className = 'cart-total-section';
        return this.createTotal();
    }
}
