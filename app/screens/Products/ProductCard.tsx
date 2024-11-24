import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Product, ProductStatus } from "../../types/Product";

type ProductCardProps = {
  product: Product;
};


const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

    const getStatusColor = () => {
        let res : string = ''

        switch (product.status) {
            case ProductStatus.available:
                res = '#17f213'
                break
            case ProductStatus.inTransit:
                res = '#1353f2';
                break;
            case ProductStatus.reserved:
                res = '#696969';
                break;
            case ProductStatus.unavailable:
                res = '#e00000';
                break;
            default:
                res = '#17f213'
        }

        return res;
    }

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
            <Text style={styles.attribute}>Color: {product.color}</Text>
            <Text style={styles.attribute}>Current Site: {product.currentSite}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.attribute}>Status: {product.status}</Text>
                <View
                    style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(),  marginLeft: 20 },
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
        width: 120,
        marginRight: 16,
    },
    details: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    attribute: {
        fontSize: 14,
        color: "#555",
    },
    statusIndicator: {
        right: 10,
        width: 10,
        height: 10,
        borderRadius: 7.5,
    },
});

export default ProductCard;