import React, { useEffect, useState } from "react";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import { useStores } from "../../stores";
import { Product } from "../../types/Product";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import ProductCard from "./ProductCard";
import theme from "../../settings/Theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

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
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={{ 
          textAlignVertical: "center",
          paddingBottom: 8
        }}
        placeholderTextColor={theme.colors.placeholder}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Fetching Products...</Text>
        </View>
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
    backgroundColor: "#f0f4f7",
  },
  searchbar: {
    marginBottom: 16,
    borderRadius: 25,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#c2c0c0",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 50,
    textAlignVertical: "center",
    justifyContent: "center"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#888",
  },
});

export default Products;
