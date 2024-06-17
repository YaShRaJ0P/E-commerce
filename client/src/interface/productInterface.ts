export interface Product {
    _id: string,
    name: string,
    price: number,
    stock: number,
    image: string,
    category: string
}

export type ProductList = Product[];