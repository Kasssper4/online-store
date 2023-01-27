import { IProductInfo } from '../../interfaces/interfaces';

export class Products {
    async loadAllProducts() {
        const response = await fetch('https://dummyjson.com/products?limit=50');
        const parseResponse: Promise<IProductInfo> = await response.json();
        return parseResponse;
    }
}
