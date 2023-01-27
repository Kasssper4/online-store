import { QueryParams } from '../query-params';
import { Cart } from './cart';
import { createDocElement } from '../../utilites/utilites';

export class ModalWindow {
    private modal = <HTMLDivElement>createDocElement('div', 'modal none');
    private cart = new Cart();
    private query = new QueryParams();

    private addInput(type: string, name: string) {
        const input = <HTMLInputElement>createDocElement('input', `form-modal__input input-${name}`);
        input.id = name;
        input.setAttribute('type', type);
        input.setAttribute('required', 'true');
        switch (name) {
            case 'name':
                input.setAttribute('pattern', '^\\D\\D\\D+\\s\\D\\D\\D+$');
                input.setAttribute('placeholder', 'First Name and Last Name');
                break;
            case 'tel':
                input.setAttribute('pattern', '^\\+\\d{8}\\d+$');
                input.setAttribute('placeholder', 'Phone number');
                break;
            case 'address':
                input.setAttribute('pattern', '^\\D{4}\\D+\\s\\D{4}\\D+\\s\\D{4}\\D+$');
                input.setAttribute('placeholder', 'Address');
                break;
            case 'email':
                input.setAttribute('pattern', '.+@.+\\..+');
                input.setAttribute('placeholder', 'E-mail');
                break;
            case 'card-num':
                input.setAttribute('pattern', '^\\d{4}\\s\\d{4}\\s\\d{4}\\s\\d{4}$');
                input.setAttribute('placeholder', 'Card number');
                break;
            case 'valid-to':
                input.setAttribute('pattern', '^\\d{2}\\s/\\s\\d{2}$');
                input.setAttribute('placeholder', 'Valid Thru');
                break;
            case 'cvv':
                input.setAttribute('pattern', '^\\d{3}$');
                input.setAttribute('placeholder', 'Code');
                break;
        }
        return input;
    }

    private checkCardNum(element: EventTarget | null, img: HTMLDivElement) {
        const input = <HTMLInputElement>element;
        const value = input.value;
        if (value.length === 0) {
            img.className = 'card-img';
        } else if (value.length === 1) {
            if (value === '4') {
                img.className = 'visa';
            } else if (value === '5') {
                img.className = 'mastercard';
            } else if (value === '6') {
                img.className = 'union';
            }
        } else if (value.length === 4 || value.length === 9 || value.length === 14) {
            input.value += ' ';
        } else if (value.length > 19) {
            input.value = value.slice(0, 19);
        }
    }

    private checkValidDate(element: EventTarget | null) {
        const input = <HTMLInputElement>element;
        const value = input.value;
        if (value.length === 2 && Number(value) <= 12) {
            input.value += ' / ';
        } else if (value.length >= 2 && Number(value.slice(0, 2)) > 12) {
            input.value = value.slice(0, 2);
        } else if (value.length > 7) {
            input.value = value.slice(0, 7);
        }
    }

    private sendForm(event: Event, form: HTMLFormElement) {
        event.preventDefault();
        form.innerText = 'Order is processed';
        setTimeout(() => {
            window.location.hash = 'main-page';
            this.cart.clearCart();
            this.cart.updateCartInfo();
        }, 3000);
    }

    createModal() {
        const formWrap = createDocElement('div', 'form-wrap');

        const form = <HTMLFormElement>createDocElement('form', 'form-modal');
        const personalInfo = createDocElement('div', 'form-modal__personal');
        const paymentInfo = createDocElement('div', 'form-modal__payment');
        const submitBtn = createDocElement('button', 'form-modal__submit', 'Submit');

        personalInfo.append(
            this.addInput('text', 'name'),
            this.addInput('tel', 'tel'),
            this.addInput('text', 'address'),
            this.addInput('email', 'email')
        );
        const cardNum = createDocElement('div', 'card-num-wrap');
        const inputCardNum = this.addInput('text', 'card-num');
        const img = <HTMLDivElement>createDocElement('div', 'card-img');

        inputCardNum.addEventListener('input', (e) => {
            return this.checkCardNum(e.target, img);
        });
        cardNum.append(img, inputCardNum);

        const cardAdditional = createDocElement('div', 'card-add-wrap');
        const validInput = this.addInput('text', 'valid-to');
        validInput.addEventListener('input', (e) => {
            this.checkValidDate(e.target);
        });

        const cvvInput = this.addInput('password', 'cvv');
        cvvInput.addEventListener('input', () => {
            if (cvvInput.value.length > 3) {
                cvvInput.value = cvvInput.value.slice(0, 3);
            }
        });

        cardAdditional.append(validInput, cvvInput);
        paymentInfo.append(cardNum, cardAdditional);
        form.append(personalInfo, paymentInfo, submitBtn);
        formWrap.append(form);
        this.modal.append(formWrap);

        form.addEventListener('submit', (e) => {
            this.sendForm(e, form);
        });

        return this.modal;
    }

    openModal() {
        this.modal.className = 'modal';
        this.closeModal();
    }

    closeModal() {
        this.modal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                if (this.query.getModalParam()) {
                    const url = new URL(window.location.href);
                    const params = new URLSearchParams(url.search);
                    params.delete('modal');
                    window.location.search = params.toString();
                }
                this.modal.className = 'modal none';
            }
        });
    }

    render() {
        return this.createModal();
    }
}
