export abstract class Page {
    protected container: HTMLElement;
    static TextObj = {};
    constructor(id: string) {
        this.container = document.createElement('div');
        this.container.id = id;
    }
    protected createHeader(text: string) {
        const header = document.createElement('h1');
        header.innerText = text;
        return header;
    }
    render() {
        return this.container;
    }
}
