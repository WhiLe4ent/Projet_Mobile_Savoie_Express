import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Modal, TouchableOpacity } from "react-native";
import { ActivityIndicator, IconButton, Text, Button } from "react-native-paper";
import { useStores } from "../../stores";
import { Delivery } from "../../types/Delivery";
import { Searchbar } from "react-native-paper";
import DeliveryCard from "./DeliveryCard";
import theme from "../../settings/Theme";

const DeliveriesList = () => {
  const { apiStore } = useStores();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortedByDate, setIsSortedByDate] = useState<"asc" | "desc" | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSortModal, setOpenSortModal] = useState<boolean>(false);

  const getDeliveries = async (sortOrder?: "asc" | "desc"): Promise<void> => {
    setLoading(true);

    try {
      let fetchedDeliveries = await apiStore.getDeliveries();
        
      if (sortOrder) {
        fetchedDeliveries = fetchedDeliveries.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        setIsSortedByDate(sortOrder);
      }
  
      setDeliveries([...fetchedDeliveries]);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getDeliveries();
  }, []);

  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (order: "asc" | "desc") => {
    setOpenSortModal(false);
    getDeliveries(order);
  };

  return (
    <View style={styles.container}>

      {/* Search and Sort Button */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Chercher par titre"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={{
            textAlignVertical: "center",
            paddingBottom: 8,
          }}
          placeholderTextColor={theme.colors.disabled}
        />
        <View style={styles.buttonContainer}>
          <IconButton
            icon="filter-variant"
            size={20}
            iconColor="white"
            onPress={()=> setOpenSortModal(true)}
          />
        </View>
      </View>

      {/* Deliveries List or Loading Indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Recherche des livraisons...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDeliveries}
          renderItem={({ item }) => <DeliveryCard delivery={item} />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      {/* Modal for Sort Options */}
      <Modal
        visible={openSortModal}
        transparent
        animationType="fade"
        onRequestClose={()=> setOpenSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Trier par date</Text>
            <Button mode="contained" onPress={() => handleSort("asc")} style={styles.modalButton}>
              Date Croissante
            </Button>
            <Button mode="contained" onPress={() => handleSort("desc")} style={styles.modalButton}>
              Date Décroissante
            </Button>
            <TouchableOpacity onPress={()=> setOpenSortModal(false)}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    marginLeft: 5,
    borderRadius: 40,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: theme.colors.primary,
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
  searchbar: {
    flex: 1,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    marginVertical: 10,
    width: "100%",
  },
  cancelText: {
    marginTop: 15,
    color: theme.colors.accent,
  },
});

export default DeliveriesList;
