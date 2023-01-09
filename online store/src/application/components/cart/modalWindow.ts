export class ModalWindow {
    private modal = document.createElement('div');

    createModal() {
        const formWrap = document.createElement('div');
        formWrap.className = 'form-wrap';

        const form = document.createElement('form');
        form.className = 'form-modal';
        function addInput(type: string, name: string) {
            const input = document.createElement('input');
            input.className = `form-modal__input input-${name}`;
            input.setAttribute('type', type);
            input.setAttribute('required', 'true');
            switch (name) {
                case 'name':
                    input.setAttribute('pattern', '^\\D\\D\\D+\\s\\D\\D\\D+$');
                    break;
                case 'tel':
                    input.setAttribute('pattern', '\\+\\d{8}\\d+$');
                    break;
                case 'adress':
                    input.setAttribute('pattern', '^\\D{4}\\D+\\s\\D{4}\\D+\\s\\D{4}\\D+$');
                    break;
                case 'email':
                    input.setAttribute('pattern', '.+@.+\\..+');
                    break;
            }
            return input;
        }

        form.append(
            addInput('text', 'name'),
            addInput('tel', 'tel'),
            addInput('text', 'adress'),
            addInput('email', 'email')
        );
        formWrap.append(form);
        this.modal.append(formWrap);
        this.modal.className = 'modal none';
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
