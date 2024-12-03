import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Delivery } from "../../types/Delivery";

type RootStackParamList = {
  DeliveryDetails: { delivery: Delivery }; 
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "DeliveryDetails">;

type DeliveryCardProps = {
  delivery: Delivery;
};

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
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
        <Text style={styles.attribute}>
          Date: {new Date(delivery.createdAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    height: 110,
    flexDirection: "row",
    backgroundColor: '#FAFAFA',
    borderColor: "#E0E0E0",
    borderWidth: 1,
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
    paddingVertical: 5,
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
