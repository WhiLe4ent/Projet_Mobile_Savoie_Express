import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useStores } from "../../stores";
import { Product } from "../../types/Product";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import ProductCard from "./ProductCard";
import theme from "../../settings/Theme";


const Products = () => {
  const { apiStore } = useStores();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 

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

  const onRefresh = async () => {
    setRefreshing(true);
    await getProducts(); 
    setRefreshing(false); 
  };

  const filteredProducts = products.filter(product =>
    product.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Chercher par nom"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={{ 
          textAlignVertical: "center",
          paddingBottom: 8
        }}
        placeholderTextColor={theme.colors.disabled}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Recherche des produits...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} />} 
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()} 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
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
