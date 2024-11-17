import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { useStores } from "../../stores";
import { Product } from "../../types/Product";

const Products = () => {
  const { apiStore } = useStores();
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = async (): Promise<void> => {
    try {
      const fetchedProducts = await apiStore.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Text>Products</Text>
      {products.map((product) => (
        <Text key={product.id}>{product.name}</Text>
      ))}
    </>
  );
};

export default Products;
