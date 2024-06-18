export interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
    category: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export type CartList = CartItem[];
