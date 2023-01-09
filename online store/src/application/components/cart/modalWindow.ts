import { Cart } from './cart';

export class ModalWindow {
    private modal = document.createElement('div');
    private cart = new Cart();

    createModal() {
        const formWrap = document.createElement('div');
        formWrap.className = 'form-wrap';

        const form = document.createElement('form');
        form.className = 'form-modal';
        const personalInfo = document.createElement('div');
        personalInfo.className = 'form-modal__personal';
        const paymentInfo = document.createElement('div');
        paymentInfo.className = 'form-modal__payment';
        const submitBtn = document.createElement('button');
        submitBtn.className = 'form-modal__submit';
        submitBtn.innerText = 'Submit';
        function addInput(type: string, name: string) {
            const input = document.createElement('input');
            input.className = `form-modal__input input-${name}`;
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
                case 'adress':
                    input.setAttribute('pattern', '^\\D{4}\\D+\\s\\D{4}\\D+\\s\\D{4}\\D+$');
                    input.setAttribute('placeholder', 'Adress');
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

        personalInfo.append(
            addInput('text', 'name'),
            addInput('tel', 'tel'),
            addInput('text', 'adress'),
            addInput('email', 'email')
        );
        const cardNum = document.createElement('div');
        cardNum.className = 'card-num-wrap';
        const inputCardNum = addInput('text', 'card-num');
        const img = document.createElement('div');
        img.className = 'card-img';

        inputCardNum.addEventListener('input', () => {
            if (inputCardNum.value.length === 0) {
                img.className = 'card-img';
            } else if (inputCardNum.value.length === 1) {
                if (inputCardNum.value === '4') {
                    img.className = 'visa';
                } else if (inputCardNum.value === '5') {
                    img.className = 'mastercard';
                } else if (inputCardNum.value === '6') {
                    img.className = 'union';
                }
            } else if (
                inputCardNum.value.length === 4 ||
                inputCardNum.value.length === 9 ||
                inputCardNum.value.length === 14
            ) {
                inputCardNum.value += ' ';
            } else if (inputCardNum.value.length > 19) {
                inputCardNum.value = inputCardNum.value.slice(0, 19);
            }
        });
        cardNum.append(img, inputCardNum);

        const cardAdditional = document.createElement('div');
        cardAdditional.className = 'card-add-wrap';
        const validInput = addInput('text', 'valid-to');
        validInput.addEventListener('input', () => {
            if (validInput.value.length === 2 && Number(validInput.value) <= 12) {
                validInput.value += ' / ';
            } else if (validInput.value.length >= 2 && Number(validInput.value.slice(0, 2)) > 12) {
                validInput.value = validInput.value.slice(0, 2);
            } else if (validInput.value.length > 7) {
                validInput.value = validInput.value.slice(0, 7);
            }
        });
        const cvvInput = addInput('password', 'cvv');
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
        this.modal.className = 'modal none';

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.innerText = 'Order is processed';
            setTimeout(() => {
                window.location.hash = 'main-page';
                this.cart.clearCart();
                this.cart.updateCartInfo;
            }, 3000);
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
                this.modal.className = 'modal none';
            }
        });
    }

    render() {
        return this.createModal();
    }
}
