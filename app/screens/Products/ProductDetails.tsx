import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { getStatusColor, Product } from '../../types/Product';
import { useStores } from '../../stores';
import { Button, useTheme, Text } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigations/RootStackParamList';

type ProductDetailsProps = StackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetails: React.FC<ProductDetailsProps> = ({ route }) => {
  const { apiStore } = useStores();
  const { productId } = route.params;
  const theme = useTheme();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  
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

  const handlePress = () => {
    console.log("product details : " + JSON.stringify(product))
    if (product)
    navigation.navigate("Deliveries", { screen: "CreateDelivery", params: {product} });

  };


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
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Image source={{ uri: product.photo }} style={styles.productImage} resizeMode={"contain"}
        />
        <Text style={styles.productTitle}>{product.model}</Text>
        <View style={styles.productInfoContainer}>
          <Text style={styles.productInfo}>Couleur: {product.color}</Text>
          <Text style={styles.productInfo}>Taille: {product.size} cm</Text>
          <Text style={styles.productInfo}>Quantité: {product.quantity}</Text>
          <Text style={styles.productInfo}>Site actuel: {product.currentSite}</Text>
          {product.destinationSite && (
            <Text style={styles.productInfo}>Site destination: {product.destinationSite}</Text>
          )}
          <Text 
            style={[styles.badge, 
                { backgroundColor: 
                    getStatusColor(product.status) 
                }]} 
          >           
            {product.status}
          </Text>
        </View>
      </View>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            style={styles.button} 
            icon="cart"
            onPress={() => navigation.navigate("Deliveries", { screen: "CreateDelivery", params: {product} })}
          >
            Commander maintenant
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
    backgroundColor: '#f9f9f9',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 20,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
  },  
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    padding: 15,
    width: '100%',
    maxWidth: 400,
    marginVertical: 20,
  },  
  productImage: {
    width: '100%',
    height: 220,
    marginBottom: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
  buttonContainer: {
    marginVertical: 30,
    alignItems: 'center',
    width: '100%'
  },
  button: {
    marginBottom: 8,
    width: '80%',
  },
  badge: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    textTransform: 'uppercase',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default ProductDetails;
