import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Text } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { CommonActions } from "@react-navigation/native";

const CreateDelivery = ({ navigation }: { navigation: any }) => {
  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState({
    title: "",
    type: "",
    model: "",
    reference: "",
    numberId: "",
    color: "",
    physicalSite: "",
    destinationSite: "",
    notes: "",
  });

  const deliveryTypes = [
    { label: "Type A", value: "A" },
    { label: "Type B", value: "B" },
  ];

  const goToNextStep = () => {
    if (step === 1 && delivery.title.trim()) {
      setStep(2);
    }
  };

  const saveDelivery = async () => {
    try {
      const newDelivery = {
        ...delivery,
        createdAt: new Date().toISOString(),
      };
      const deliveriesCollectionRef = collection(FIREBASE_DB, "deliveries");
      await addDoc(deliveriesCollectionRef, newDelivery);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "DeliveriesList" }],
        })
      );
    } catch (error) {
      console.error("Error adding delivery:", error);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {step === 1 ? (
          <View>
            <Text style={styles.label}>Nom du client :</Text>
            <TextInput
              style={styles.input}
              value={delivery.title}
              onChangeText={(text) => setDelivery({ ...delivery, title: text })}
              placeholder="Entrez le nom du client"
            />
            <View style={styles.buttonContainer}>
              <Button mode="text" disabled>
                Précédent
              </Button>
              <Button mode="contained" onPress={goToNextStep}>
                Suivant
              </Button>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.label}>Type :</Text>
            <Dropdown
              data={deliveryTypes}
              labelField="label"
              valueField="value"
              placeholder="Sélectionnez un type"
              value={delivery.type}
              onChange={(item) => setDelivery({ ...delivery, type: item.value })}
              style={styles.input}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.dropdownContainer}
            />

            {[
              { label: "Modèle :", key: "model", placeholder: "Modèle" },
              { label: "Référence :", key: "reference", placeholder: "Référence" },
              { label: "Numéro ID :", key: "numberId", placeholder: "Numéro ID" },
              { label: "Couleur :", key: "color", placeholder: "Couleur" },
              {
                label: "Site présence physique :",
                key: "physicalSite",
                placeholder: "Site présence physique",
              },
              {
                label: "Site destination :",
                key: "destinationSite",
                placeholder: "Site destination",
              },
              { label: "Divers :", key: "notes", placeholder: "Notes" },
            ].map(({ label, key, placeholder }) => (
              <View key={key}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={(delivery as any)[key]}
                  onChangeText={(text) =>
                    setDelivery({ ...delivery, [key]: text })
                  }
                  placeholder={placeholder}
                />
              </View>
            ))}

            <View style={styles.buttonContainer}>
              <Button mode="text" onPress={() => setStep(1)}>
                Précédent
              </Button>
              <Button mode="contained" onPress={saveDelivery}>
                Créer la livraison
              </Button>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#aaa",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  },
  dropdownContainer: {
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});

export default CreateDelivery;
