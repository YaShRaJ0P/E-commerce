export interface Cart {
    _id: string,
    name: string,
    price: number,
    quantity: number,
    image: string,
    category: string,
    productId: string
}

export type CartList = Cart[];