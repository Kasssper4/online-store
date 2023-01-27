import { ICart } from '../../interfaces/interfaces';

export class Cart {
    getProductsInCart(): Array<ICart> {
        const productsInCart = localStorage.getItem('productsInCart');
        return productsInCart ? JSON.parse(productsInCart) : [];
    }

    addProductToCart(id: number, price: number) {
        const currentProdArr = this.getProductsInCart();
        const currentIdArr = currentProdArr.map((prod: ICart) => prod.id);

        if (currentIdArr.includes(id)) {
            const changeProd = currentProdArr.find((el: ICart) => el.id === id);
            if (changeProd) {
                changeProd.count += 1;
            }
        } else {
            currentProdArr.push({
                id: id,
                price: price,
                count: 1,
            });
        }

        localStorage.setItem('productsInCart', JSON.stringify(currentProdArr));
    }

    removeProductsFromCart(id: number, options: string) {
        const currentProdArr = this.getProductsInCart();
        const changeProd = currentProdArr.find((el: ICart) => {
            if (el.id === id) return el;
        });

        if (
            (changeProd && changeProd.count === 1 && options !== 'fromMain') ||
            (changeProd && options === 'fromMain')
        ) {
            const i = currentProdArr.findIndex((el: ICart) => el.id === id);
            currentProdArr.splice(i, 1);
        } else if (changeProd) {
            changeProd.count -= 1;
        }

        localStorage.setItem('productsInCart', JSON.stringify(currentProdArr));
    }

    updateCartInfo() {
        const currentProdArr = this.getProductsInCart();
        const cartAmount = document.querySelector('.cart-amount');
        const cartTotal = document.querySelector('.money');
        let prodCounter = 0;
        let moneyCounter = 0;

        currentProdArr.forEach((prod: ICart) => {
            prodCounter += prod.count;
            moneyCounter += prod.count * prod.price;
        });

        if (cartAmount && cartTotal) {
            cartAmount.innerHTML = `${prodCounter}`;
            cartTotal.innerHTML = `${moneyCounter}`;
        }
    }

    clearCart() {
        localStorage.removeItem('productsInCart');
    }
}
