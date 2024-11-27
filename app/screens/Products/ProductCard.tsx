import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getStatusColor, Product, ProductStatus } from "../../types/Product";

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
                <Text style={styles.attribute}>Color: {product.color}</Text>
                <Text style={styles.attribute}>Current Site: {product.currentSite}</Text>
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
        height: 100,
        aspectRatio: 1/1,
        marginRight: 16,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },     
    details: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    attribute: {
        fontSize: 14,
        color: "#555",
    },
    badge: {
        alignSelf: "flex-start",
        marginTop: 5,
        paddingVertical: 2,
        paddingHorizontal: 8,
        fontSize: 12,
        color: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        textTransform: "uppercase",
    }
});

export default ProductCard;