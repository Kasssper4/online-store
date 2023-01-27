export interface IProductsItem {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
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

export interface ICart {
    id: number;
    price: number;
    count: number;
}
