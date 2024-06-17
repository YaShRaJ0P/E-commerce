import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import { ProductList, Product } from "@/interface/productInterface";
import { setProducts as setProductsAction } from "@/utils/products";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/utils/appStore";

export const Main = () => {
  const [products, setProductsState] = useState<ProductList>([]);
  const dispatch = useDispatch<AppDispatch>();
  const productLists = useSelector((state: RootState) => state.products);

  useEffect(() => {
    axios
      .get("http://localhost:5555/products")
      .then((res) => {
        dispatch(setProductsAction(res.data.products));
        setProductsState(res.data.products);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    setProductsState(productLists);
  }, [productLists]);

  return (
    <div className="w-full relative flex flex-col min-h-screen bg-gray-900 pl-4">
      <div className="flex flex-row flex-wrap gap-2">
        {products.map((product: Product) => (
          <ProductCard
            key={product._id}
            name={product.name}
            price={product.price}
            image={product.image}
            stock={product.stock}
            id={product._id}
          />
        ))}
      </div>
    </div>
  );
};

export default Main;
