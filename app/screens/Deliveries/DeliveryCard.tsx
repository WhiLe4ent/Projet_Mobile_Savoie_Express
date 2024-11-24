import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Delivery } from "../../types/Delivery";

type DeliveryCardProps = {
  delivery: Delivery;
};

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery }) => {
  return (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {delivery.title}
        </Text>
        <Text style={styles.attribute}>Model: {delivery.model}</Text>
        <Text style={styles.attribute}>Description: {delivery.notes}</Text>
        <Text style={styles.attribute}>Date: {new Date(delivery.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
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
