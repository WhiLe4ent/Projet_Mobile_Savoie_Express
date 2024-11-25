import React, { useEffect, useState } from "react";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import { useStores } from "../../stores";
import { Product } from "../../types/Product";
import { Searchbar } from "react-native-paper";
import ProductCard from "./ProductCard";

const Products = () => {
  const { apiStore } = useStores();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products</Text>

      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 16,
  },
});

export default Products;
