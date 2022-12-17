import { Page } from '../../patterns/pagePattern';
export class CartPage extends Page {
    static TextObj = {
        MainTitle: 'Cart Page.',
    };
    constructor(id: string) {
        super(id);
    }
    render() {
        const title = this.createHeader(`Online store. ${CartPage.TextObj.MainTitle}`);
        this.container.append(title);
        return this.container;
    }
}
