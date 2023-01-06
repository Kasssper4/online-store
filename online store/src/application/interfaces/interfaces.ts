export interface IProductsItem {
    id: number; //нет в поиске
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string; //нет в поиске
    images: string[]; //нет в поиске
}

export interface IProductInfo {
    products: Array<IProductsItem>;
    total: number;
    skip: number;
    limit: number;
}

export interface ISort {
    price: number;
    rating: number;
}
