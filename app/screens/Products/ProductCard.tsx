import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { getStatusColor, Product, ProductStatus } from "../../types/Product";
import { Text } from "react-native-paper";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

    return (
        <View style={styles.card}>
          <Image
            source={{ uri: product.photo }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.details}>
            <Text 
                style={styles.name}
                numberOfLines={1}
                ellipsizeMode="tail"
            >{product.model}</Text>
            <Text style={styles.attribute}>
                Color: {product.color}
            </Text>
            <Text style={styles.attribute}>
                Current Site: {product.currentSite}
            </Text>
            <View style={styles.statusContainer}>
                <Text style={styles.attribute}>Status: {product.status}</Text>
                <View
                    style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(product.status), width: 10, height: 10, borderRadius: 5 },
                    ]}
                />
                </View>
            </View>
        </View>
      );
    };
    
const styles = StyleSheet.create({
    card: {
        padding: 5,
        height: 120,
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        position: "relative",
    },
    image: {
        width: 100,
        marginRight: 16,
    },
    details: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    attribute: {
        fontSize: 13,
        color: "#555",
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
    }
});

export default ProductCard;