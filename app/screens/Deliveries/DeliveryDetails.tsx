import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Switch,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { updateDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";
import { Steps } from "../../types/Delivery";

const DeliveryDetails = ({ route }: { route: any }) => {
  const { delivery } = route.params;

  const stepsArray = [
    {
      label: "Présence (OUI/NON)",
      field: Steps.Presence,
      placeholder: "Présence sur le site (OUI/NON)",
      type: "boolean",
    },
    {
      label: "Disponibilité",
      field: Steps.Availability,
      placeholder: "Choisir une date",
      type: "date",
    },
    {
      label: "Frais de préparation",
      field: Steps.PreparationFees,
      placeholder: "Description des frais",
      type: "text",
    },
    {
      label: "Configuration du produit",
      field: Steps.Configuration,
      placeholder: "Choisir configuration",
      type: "text",
    },
    {
      label: "Documentation",
      field: Steps.Documentation,
      placeholder: "Présente ou Absente ?",
      type: "text",
    },
  ];

  const [updatedDelivery, setUpdatedDelivery] = useState(delivery);
  const [currentStep, setCurrentStep] = useState(0);
  const [date, setDate] = useState(new Date(delivery.availability || Date.now()));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const maxSteps = stepsArray.length;

  useEffect(() => {
    const firstIncompleteStep = stepsArray.findIndex(
      (step) => updatedDelivery[step.field] == null
    );
    setCurrentStep(firstIncompleteStep === -1 ? 0 : firstIncompleteStep);
  }, [updatedDelivery]);

  const handleSave = async () => {
    try {
      const docRef = doc(FIREBASE_DB, "deliveries", delivery.id);
      await updateDoc(docRef, updatedDelivery);
      alert("Modifications enregistrées !");
    } catch (error) {
      console.error("Error saving delivery:", error);
    }
  };

  const handleInputChange = (field: Steps, value: string | boolean | Date) => {
    setUpdatedDelivery((prev: any) => ({ ...prev, [field]: value }));
  };

  const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      handleInputChange(Steps.Availability, selectedDate.toISOString());
    }
  };

  const renderStep = () => {
    const step = stepsArray[currentStep];

    return (
      <View>
        {step.type === "date" ? (
          <>
            <Text style={styles.label}>{step.label}:</Text>
            <Text
              style={styles.selectedDate}
              onPress={() => setShowDatePicker(true)}
            >
              {new Date(updatedDelivery[step.field] || date).toLocaleDateString()}
            </Text>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
              />
            )}
          </>
        ) : step.type === "boolean" ? (
          <>
            <Text style={styles.label}>{step.label}:</Text>
            <View style={styles.toggleContainer}>
              <Switch
                value={!!updatedDelivery[step.field]}
                onValueChange={(value) => handleInputChange(step.field, value)}
              />
              <Text style={styles.toggleText}>
                {updatedDelivery[step.field] ? "Oui" : "Non"}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>{step.label}:</Text>
            <TextInput
              style={styles.input}
              value={updatedDelivery[step.field] || ""}
              onChangeText={(text) => handleInputChange(step.field, text)}
              placeholder={step.placeholder}
            />
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${((currentStep + 1) / maxSteps) * 100}%` },
          ]}
        />
      </View>
      {renderStep()}
      <View style={styles.buttonContainer}>
        {currentStep < maxSteps - 1 && (
          <Button
            title="Étape suivante"
            onPress={() => setCurrentStep((prev) => prev + 1)}
            disabled={!updatedDelivery[stepsArray[currentStep].field]}
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
  progressBarContainer: {
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007BFF",
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
    marginTop: 16,
  },
  selectedDate: {
    fontSize: 16,
    color: "#007BFF",
    marginTop: 8,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default DeliveryDetails;
