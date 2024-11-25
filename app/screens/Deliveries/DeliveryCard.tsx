import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Delivery } from "../../types/Delivery";

// Définir les types des routes
type RootStackParamList = {
  DeliveryDetails: { delivery: Delivery }; // Déclare les paramètres pour DeliveryDetails
  // Ajoute d'autres écrans ici si nécessaire
};

// Typage pour la navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "DeliveryDetails">;

type DeliveryCardProps = {
  delivery: Delivery;
};

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery }) => {
  const navigation = useNavigation<NavigationProp>(); // Utiliser le type de navigation

  const handlePress = () => {
    // Naviguer vers l'écran des détails avec l'objet delivery
    navigation.navigate("DeliveryDetails", { delivery });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {delivery.title}
        </Text>
        <Text style={styles.attribute}>Model: {delivery.model}</Text>
        <Text style={styles.attribute}>Description: {delivery.notes}</Text>
        <Text style={styles.attribute}>Date: {new Date(delivery.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    height: 100,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  attribute: {
    fontSize: 14,
    color: "#555",
  },
});

export default DeliveryCard;
