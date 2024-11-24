import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";
import { Dropdown } from 'react-native-element-dropdown';


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

  const handleNext = async () => {
    if (step === 1 && delivery.title.trim()) {
      setStep(2);
    } else if (step === 2) {
      try {
        const newDelivery = {
          ...delivery,
          createdAt: new Date().toISOString(),
        };
   
        const deliveriesCollectionRef = collection(FIREBASE_DB, "deliveries");
        await addDoc(deliveriesCollectionRef, newDelivery);
  
        // Rediriger vers la liste des livraisons
        navigation.navigate("DeliveriesList");
      } catch (error) {
        console.error("Error adding delivery:", error);
      }
    } 
  };
  
  const deliveryTypes = [
    { label: 'Type A', value: 'A' },
    { label: 'Type B', value: 'B' },
  ];
  

  return (
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
          <Button title="Suivant" onPress={handleNext} />
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

          <Text style={styles.label}>Modèle :</Text>
          <TextInput
            style={styles.input}
            value={delivery.model}
            onChangeText={(text) => setDelivery({ ...delivery, model: text })}
            placeholder="Modèle"
          />

          <Text style={styles.label}>Référence :</Text>
          <TextInput
            style={styles.input}
            value={delivery.reference}
            onChangeText={(text) => setDelivery({ ...delivery, reference: text })}
            placeholder="Référence"
          />

          <Text style={styles.label}>Numéro ID :</Text>
          <TextInput
            style={styles.input}
            value={delivery.numberId}
            onChangeText={(text) => setDelivery({ ...delivery, numberId: text })}
            placeholder="Numéro ID"
          />

          <Text style={styles.label}>Couleur :</Text>
          <TextInput
            style={styles.input}
            value={delivery.color}
            onChangeText={(text) => setDelivery({ ...delivery, color: text })}
            placeholder="Couleur"
          />

          <Text style={styles.label}>Site présence physique :</Text>
          <TextInput
            style={styles.input}
            value={delivery.physicalSite}
            onChangeText={(text) =>
              setDelivery({ ...delivery, physicalSite: text })
            }
            placeholder="Site présence physique"
          />

          <Text style={styles.label}>Site destination :</Text>
          <TextInput
            style={styles.input}
            value={delivery.destinationSite}
            onChangeText={(text) =>
              setDelivery({ ...delivery, destinationSite: text })
            }
            placeholder="Site destination"
          />

          <Text style={styles.label}>Divers :</Text>
          <TextInput
            style={styles.input}
            value={delivery.notes}
            onChangeText={(text) => setDelivery({ ...delivery, notes: text })}
            placeholder="Notes"
          />

          <Button title="Créer la livraison" onPress={handleNext} />
        </View>
      )}
    </View>
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
    color: '#aaa',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  dropdownContainer: {
    borderRadius: 8,
  },
});

export default CreateDelivery;
