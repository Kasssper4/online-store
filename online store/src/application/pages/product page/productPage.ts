import { Cart } from '../../components/cart/cart';
import { ModalWindow } from '../../components/cart/modalWindow';
import { ProductsList } from '../../components/products list/productsList';
import { IProductsItem } from '../../interfaces/interfaces';
import { Page } from '../../patterns/pagePattern';

class ProductPage extends Page {
    productTitle: HTMLHeadingElement;
    cart: Cart;
    productList: ProductsList;
    private modal: ModalWindow;

    constructor(id: string, numOfProd: string) {
        super(id);
        ProductPage.TextObj = numOfProd;
        this.productTitle = document.createElement('h2');
        this.cart = new Cart();
        this.productList = new ProductsList();
        this.modal = new ModalWindow();
    }

    async loadAllProducts(hash: string) {
        const response = await fetch(`https://dummyjson.com/${hash}`);
        const parseResponse: Promise<IProductsItem> = await response.json();
        return parseResponse;
    }

    render() {
        const hash = window.location.hash.slice(1);
        this.loadAllProducts(hash).then((product) => {
            const header = this.createHeader(
                `${product.category.toUpperCase()} >> ${product.brand.toUpperCase()} >> ${product.title.toUpperCase()}`
            );

            const blockInfo = document.createElement('div');
            blockInfo.className = 'product-page-info';

            const photosWrap = document.createElement('div');
            photosWrap.className = 'product-page-info__photos';
            const photosArr = product.images;
            const mainPhoto = document.createElement('img');
            mainPhoto.className = 'product-page-info__photo';
            mainPhoto.src = photosArr[0];

            const imgArr = photosArr.map((photo) => {
                const req = new XMLHttpRequest();
                req.open('GET', photo, false);
                req.send();
                return req.getResponseHeader('content-length');
            });

            const helpArr: string[] = [];
            photosArr.forEach((photo, i) => {
                if (!helpArr.includes(imgArr[i] as string)) {
                    const img = document.createElement('img');
                    img.className = 'product-photo';
                    img.src = photo;
                    helpArr.push(imgArr[i] as string);
                    img.addEventListener('click', () => {
                        mainPhoto.src = photo;
                    });
                    photosWrap.append(img);
                }
            });

            const ul = document.createElement('ul');
            ul.className = 'product-page-info__list';
            function addLi(text: string, info: string | number) {
                const li = document.createElement('li');
                li.className = 'product-page-info__li';
                li.innerHTML = `<b>${text}:</b> ${info}`;
                return li;
            }
            ul.append(
                addLi('Product', product.title),
                addLi('Brand', product.brand),
                addLi('Category', product.category),
                addLi('Description', product.description),
                addLi('Price', `${product.price}$`),
                addLi('Discount', `${product.discountPercentage}%`),
                addLi('Rating', `${product.rating}`),
                addLi('Stock', `${product.stock}`)
            );

            const btnBlock = document.createElement('div');
            btnBlock.className = 'product-page-info__btns-wrap';
            const btnModal = document.createElement('button');
            btnModal.className = 'modal-btn-prodpage';
            btnModal.innerText = 'Buy now';
            btnModal.addEventListener('click', () => {
                const currentProdArr = this.cart.getProductsInCart();
                const currentIdArr = currentProdArr.map((prod) => prod.id);

                if (!currentIdArr.includes(product.id)) {
                    this.cart.addProductToCart(product.id, product.price);
                }

                const url = new URL(window.location.href);
                const params = new URLSearchParams(url.search);
                params.append('modal', 'yes');
                window.location.search = params.toString();
                window.location.hash = '#cart-page';
            });
            btnBlock.append(this.productList.addCartButton(product.id, product.price, 'fromProduct-btn'), btnModal);

            const mainPhotoWrap = document.createElement('div');
            mainPhotoWrap.className = 'product-page-info__photo-wrap';
            mainPhotoWrap.append(mainPhoto);
            blockInfo.append(photosWrap, mainPhotoWrap, ul, btnBlock);
            this.container.append(header, blockInfo);
        });

        return this.container;
    }
}

export default ProductPage;
