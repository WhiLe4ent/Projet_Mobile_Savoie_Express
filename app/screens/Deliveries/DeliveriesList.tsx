import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useStores } from "../../stores";
import { Delivery } from "../../types/Delivery";
import { Searchbar } from "react-native-paper";
import DeliveryCard from "./DeliveryCard";
import theme from "../../settings/Theme";

const DeliveriesList = () => {
  const { apiStore } = useStores();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getDeliveries = async (): Promise<void> => {
    try {
      const fetchedDeliveries = await apiStore.getDeliveries();
      setDeliveries(fetchedDeliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  useEffect(() => {
    getDeliveries();
  }, []);

  // Filtrer les livraisons en fonction du titre
  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <View
      style={styles.container}
    >
      <Searchbar
        placeholder="Search by title"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={{
          textAlignVertical: "center",
          paddingBottom: 8
        }}
        placeholderTextColor={theme.colors.disabled} 
      />
      
      <FlatList
        data={filteredDeliveries}
        renderItem={({ item }) => <DeliveryCard delivery={item} />} 
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingRight: 16,
    paddingLeft: 16,
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
});

export default DeliveriesList;
