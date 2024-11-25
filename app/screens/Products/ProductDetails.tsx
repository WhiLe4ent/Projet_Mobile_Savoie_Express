import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { getStatusColor, Product } from '../../types/Product';
import { useStores } from '../../stores';
import { RootStackParamList } from '../../navigations/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, useTheme } from 'react-native-paper';

type ProductDetailsProps = StackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetails: React.FC<ProductDetailsProps> = ({ route }) => {
  const { apiStore } = useStores();
  const { productId } = route.params;
  const theme = useTheme();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId && apiStore) {
          const productDetails = await apiStore.getProductById(productId);
          setProduct(productDetails);
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, apiStore]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Image source={{ uri: product.photo }} style={styles.productImage} />
        <Text style={styles.productTitle}>{product.model}</Text>
        <View style={styles.productInfoContainer}>
          <Text style={styles.productInfo}>Color: {product.color}</Text>
          <Text style={styles.productInfo}>Size: {product.size} cm</Text>
          <Text style={styles.productInfo}>Quantity: {product.quantity}</Text>
          <Text style={styles.productInfo}>Current Site: {product.currentSite}</Text>
          {product.destinationSite && (
            <Text style={styles.productInfo}>Destination Site: {product.destinationSite}</Text>
          )}
          <View style={styles.statusContainer}>
              <Text style={styles.productInfo}>Status: {product.status}</Text>
                <View
                    style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(product.status), width: 10, height: 10, borderRadius: 5 },
                    ]}
                />
                </View>
            </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            style={styles.button} 
            icon="cart"
            onPress={() => console.log('Order button pressed')}
          >
            Order now
          </Button>
        </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  productInfoContainer: {
    marginTop: 8,
  },
  productInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  status: {
    fontWeight: 'bold',
  },
  statusIndicator: {
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 7.5,
  },
  statusContainer: {
      flexDirection: "row", 
      alignItems: "center", 
      justifyContent: "space-between"
  },
  buttonContainer: {
    marginTop: 100,
    alignItems: 'center',
    width: '100%'
  },
  button: {
    marginBottom: 8,
    width: '80%',
  },
});

export default ProductDetails;
