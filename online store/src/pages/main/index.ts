import { Page } from '../../patterns/pagePattern';

class MainPage extends Page {
    static TextObj = {
        MainTitle: 'Main page',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createHeader(`Online store. ${MainPage.TextObj.MainTitle}.`);
        this.container.append(title);
        return this.container;
    }
}

export default MainPage;
