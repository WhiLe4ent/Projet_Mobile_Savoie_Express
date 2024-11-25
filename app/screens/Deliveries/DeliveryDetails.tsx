import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent} from "@react-native-community/datetimepicker";
import { updateDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";

const DeliveryDetails = ({ route }: { route: any }) => {
  const { delivery } = route.params;

  // Initialiser l'état avec les données de livraison
  const [updatedDelivery, setUpdatedDelivery] = useState(delivery);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [date, setDate] = useState(new Date(updatedDelivery.availability || new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const steps = [
    {
      label: "Présence (OUI/NON)",
      value: updatedDelivery.presence,
      field: "presence",
      placeholder: "Présence sur le site (OUI/NON)",
      type: "text",
    },
    {
      label: "Disponibilité",
      value: updatedDelivery.availability,
      field: "availability",
      placeholder: "Choisir une date",
      type: "date",
    },
    {
      label: "Frais de préparation",
      value: updatedDelivery.preparationFees,
      field: "preparationFees",
      placeholder: "Description des frais",
      type: "text",
    },
    {
      label: "Configuration du produit",
      value: updatedDelivery.configuration,
      field: "configuration",
      placeholder: "Choisir configuration",
      type: "text",
    },
    {
      label: "Documentation",
      value: updatedDelivery.documentation,
      field: "documentation",
      placeholder: "Présente ou Absente ?",
      type: "text",
    },
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

  const handleInputChange = (field: string, value: string | Date) => {
    setUpdatedDelivery({ ...updatedDelivery, [field]: value });
    setCurrentInput(value as string); 
  };

  const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      handleInputChange("availability", selectedDate.toISOString());
    }
  };

  const renderStep = () => {
    return steps.slice(0, currentStep).map((step, index) => {
      if (step.type === "date") {
        return (
          <View key={index}>
            <Text style={styles.label}>{step.label} :</Text>
            <Text
              style={styles.selectedDate}
              onPress={() => setShowDatePicker(true)}
            >
              Date : {new Date(updatedDelivery[step.field]).toLocaleDateString()}
            </Text>
            {showDatePicker && (
              <DateTimePicker
                key={index}
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
              />
            )}
          </View>
        );
      }

      return (
        <View key={index}>
          <Text style={styles.label}>{step.label} :</Text>
          <TextInput
            style={styles.input}
            value={updatedDelivery[step.field] || ""}
            onChangeText={(text) => handleInputChange(step.field, text)}
            placeholder={step.placeholder}
          />
        </View>
      );
    });
  };

  const canProceedToNextStep =
    currentInput.trim() !== "" || steps[currentStep - 1]?.type === "date";

  return (
    <View style={styles.container}>
      {renderStep()}
      <View style={styles.buttonContainer}>
        {currentStep < steps.length && (
          <Button
            title="Étape suivante"
            onPress={() => {
              setCurrentStep((prev) => prev + 1);
              setCurrentInput(""); 
            }}
            disabled={!canProceedToNextStep}
          />
        )}
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
  selectedDate: {
    fontSize: 16,
    color: "#007BFF",
    marginTop: 8,
    marginBottom: 16,
  },
});

export default DeliveryDetails;
