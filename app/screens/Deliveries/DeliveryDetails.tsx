import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Text, Button } from "react-native-paper";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { updateDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";
import { Steps } from "../../types/Delivery";
import { CommonActions, useNavigation } from "@react-navigation/native";

const DeliveryDetails = ({ route }: { route: any }) => {
  const { delivery } = route.params;
  const [updatedDelivery, setUpdatedDelivery] = useState(delivery);
  const [date, setDate] = useState(new Date(delivery.availability || Date.now()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation<any>();

    
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


  const [currentStep, setCurrentStep] = useState(
    stepsArray.findIndex((step) => !updatedDelivery[step.field]) === -1
      ? stepsArray.length
      : stepsArray.findIndex((step) => !updatedDelivery[step.field]) + 1
  );

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
      );  
    } catch (error) {
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
      setDate(selectedDate);
      handleInputChange(Steps.Availability, selectedDate.toISOString());
    }
  };

  const renderStep = (stepIndex: number) => {
    const step = stepsArray[stepIndex];
    return (
      <View key={stepIndex} style={styles.stepContainer}>
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
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${((currentStep + 1) / stepsArray.length) * 100}%` },
            ]}
          />
        </View>
        {stepsArray.slice(0, currentStep + 1).map((_, index) => renderStep(index))}
        <View style={styles.buttonContainer}>
          {/* Étape précédente */}
          <Button
            mode="text"
            onPress={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 0}
          >
            Étape précédente
          </Button>
          {/* Étape suivante */}
          <Button
            mode="contained"
            onPress={() => setCurrentStep((prev) => prev === stepsArray.length - 1 ? prev : prev + 1)}
            disabled={
              (currentStep >= stepsArray.length - 1) || 
              (!(stepsArray[currentStep].type === "date") && !updatedDelivery[stepsArray[currentStep].field])
            }
          >
            Étape suivante
          </Button>

        </View>

        {/* Sauvegarder les modifications */}
        <Button style={styles.saveButton} onPress={handleSave}>
          Enregistrer les modifications
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  stepContainer: {
    marginBottom: 16,
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
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  saveButton: {
    alignSelf: "center",
    marginTop: 16,
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 6,
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
