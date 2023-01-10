import { Page } from '../../patterns/pagePattern';

class ErrorPage extends Page {
    render() {
        const title = this.createHeader('PAGE NOT FOUND (404)');
        title.className = 'error-title';
        this.container.append(title);
        return this.container;
    }
}

export default ErrorPage;
