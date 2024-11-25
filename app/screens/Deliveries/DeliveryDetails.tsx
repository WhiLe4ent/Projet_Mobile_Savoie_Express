import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { updateDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";

const DeliveryDetails = ({ route }: { route: any }) => {
  const { delivery } = route.params;
  const [currentStep, setCurrentStep] = useState(1);
  const [updatedDelivery, setUpdatedDelivery] = useState(delivery);
  const [currentInput, setCurrentInput] = useState<string>("");

  const steps = [
    {
      label: "Présence (OUI/NON)",
      value: updatedDelivery.presence,
      field: "presence",
      placeholder: "Présence sur le site (OUI/NON)",
    },
    {
      label: "Disponibilité",
      value: updatedDelivery.availability,
      field: "availability",
      placeholder: "Disponibilité (Immédiate ou date)",
    },
    {
      label: "Frais de préparation",
      value: updatedDelivery.preparationFees,
      field: "preparationFees",
      placeholder: "Description des frais",
    },
    // Ajoute d'autres étapes ici si nécessaire
  ];

  // Vérifie les étapes déjà remplies au chargement
  useEffect(() => {
    const firstIncompleteStep = steps.findIndex((step) => !step.value);
    setCurrentStep(firstIncompleteStep === -1 ? steps.length : firstIncompleteStep + 1);
  }, [steps]);

  const handleSave = async () => {
    try {
      const docRef = doc(FIREBASE_DB, "deliveries", delivery.id);
      await updateDoc(docRef, updatedDelivery);
      alert("Modifications enregistrées !");
    } catch (error) {
      console.error("Error saving delivery:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUpdatedDelivery({ ...updatedDelivery, [field]: value });
    setCurrentInput(value); // Met à jour l'état de l'input actuel
  };

  const renderStep = () => {
    return steps.slice(0, currentStep).map((step, index) => (
      <View key={index}>
        <Text style={styles.label}>{step.label} :</Text>
        <TextInput
          style={styles.input}
          value={updatedDelivery[step.field] || ""}
          onChangeText={(text) => handleInputChange(step.field, text)}
          placeholder={step.placeholder}
        />
      </View>
    ));
  };

  const canProceedToNextStep = currentInput.trim() !== ""; 

  return (
    <View style={styles.container}>
      {renderStep()}
      <View style={styles.buttonContainer}>
        <Button
          title="Étape suivante"
          onPress={() => {
            setCurrentStep((prev) => prev + 1);
            setCurrentInput(""); // Réinitialise l'input pour l'étape suivante
          }}
          disabled={!canProceedToNextStep || currentStep >= steps.length} 
        />
        <Button title="Enregistrer les modifications" onPress={handleSave} />
      </View>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default DeliveryDetails;
