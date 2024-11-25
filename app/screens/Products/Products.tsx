import React, { useEffect, useState } from "react";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import { useStores } from "../../stores";
import { Product } from "../../types/Product";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import ProductCard from "./ProductCard";
import theme from "../../settings/Theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import ProductDetails from "./ProductDetails";

const Products = () => {
  const { apiStore } = useStores();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const getProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const fetchedProducts = await apiStore.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  };  

  useEffect(() => {
    getProducts();
  }, []);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

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

      {loading ? (
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary} 
          style={styles.loadingIndicator} 
        />
      ) : (
        <ScrollView>
        {filteredProducts.map(product => (
          <TouchableOpacity key={product.id} onPress={() => handleProductClick(product.id)}>
            <ProductCard product={product} />
          </TouchableOpacity>
        ))}
        </ScrollView>
      )}
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
  loadingIndicator: {
    marginTop: 32,
    alignSelf: "center",
  },
});

export default Products;
