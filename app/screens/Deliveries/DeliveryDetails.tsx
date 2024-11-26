import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { CommonActions, useNavigation } from "@react-navigation/native";

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
  const navigation = useNavigation<any>();

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
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "DeliveriesList" }],
        })
      );    } catch (error) {
      console.error("Error saving delivery:", error);
    }
  };

  const handleInputChange = (field: Steps, value: string | boolean | Date) => {
    setUpdatedDelivery((prev: any) => ({ ...prev, [field]: value }));
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDate(selectedDate)
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
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateText}>
                {new Date(updatedDelivery[step.field] || date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange} // Use the updated `onDateChange`
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
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setCurrentStep((prev) => prev + 1)}
            disabled={!updatedDelivery[stepsArray[currentStep].field]}
          >
            <Text style={styles.buttonText}>Étape suivante</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  nextButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#007BFF",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
});

export default DeliveryDetails;
