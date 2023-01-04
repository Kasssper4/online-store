export class ControlPanel {
    controlBlock = document.createElement('div');

    createSearch() {
        const inputText = document.createElement('input');
        inputText.className = 'search';
        inputText.setAttribute('type', 'text');
        return inputText;
    }

    createSort() {
        const select = document.createElement('select');
        select.className = 'sort';
        select.setAttribute('size', '1');
        select.innerHTML =
            '<option disabled selected>Sort by:</option>\
            <option>Price</option>\
            <option>Stock</option>';
        return select;
    }

    createViewButtons() {
        const buttonsWrap = document.createElement('div');
        buttonsWrap.className = 'view';
        function addButton() {
            const btn = document.createElement('button');
            btn.className = 'view-button';
            return btn;
        }
        buttonsWrap.append(addButton(), addButton());
        return buttonsWrap;
    }

    createProductsAmount() {
        const amountBlock = document.createElement('div');
        amountBlock.className = 'products-amount';
        amountBlock.innerHTML = '<span>Find products: </span><span>0</span>';
        return amountBlock;
    }

    render() {
        this.controlBlock.className = 'control';
        this.controlBlock.append(
            this.createSearch(),
            this.createSort(),
            this.createViewButtons(),
            this.createProductsAmount()
        );
        return this.controlBlock;
    }
}
