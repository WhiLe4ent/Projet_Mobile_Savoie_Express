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
  Alert,
} from "react-native";
import { Text, Button, Icon, useTheme, Title, IconButton} from "react-native-paper";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { updateDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";
import { Steps } from "../../types/Delivery";
import { CommonActions, useNavigation } from "@react-navigation/native";
import theme from "../../settings/Theme";

const DeliveryDetails = ({ route }: { route: any }) => {
  const { delivery } = route.params;
  const [updatedDelivery, setUpdatedDelivery] = useState(delivery);
  const [date, setDate] = useState(new Date(delivery.availability || Date.now()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);
  const navigation = useNavigation<any>();
  const theme = useTheme();

  interface Step {
    label: string;
    field: Steps;
    type: "text" | "boolean" | "date" | "checkbox";
  }

  const stepsArray: Step[] = [
    { label: "Présence", field: Steps.Presence, type: "boolean" },
    { label: "Disponibilité", field: Steps.Availability, type: "date" },
    { label: "Frais de préparation", field: Steps.PreparationFees, type: "text" },
    { label: "Configuration du produit", field: Steps.Configuration, type: "text" },
    { label: "Documentation", field: Steps.Documentation, type: "boolean" },
    { label: "Date d’arrivée", field: Steps.ConvoyageDate, type: "date" },
    { label: "Date contrôle qualité", field: Steps.QualityControlDate, type: "date" },
    { label: "Packaging requis", field: Steps.PackagingRequired, type: "boolean" },
    { label: "Statut de financement", field: Steps.FinancingStatus, type: "text" },
    { label: "Paiement reçu", field: Steps.PaymentReceived, type: "boolean" },
    { label: "Date de livraison", field: Steps.DeliveryDate, type: "date" },
    { label: "Packaging prêt", field: Steps.PackagingReady, type: "boolean" },
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
      Alert.alert("Success","Modifications enregistrées !" )
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
      setShowDatePicker(false);
    }
  };

  const renderStep = (stepIndex: number) => {
    const step = stepsArray[stepIndex];
  
    return (
      <View key={step.field} style={styles.stepContainer}>
        <Text style={styles.label}>{step.label} :</Text>
        {step.type === "text" && (
          <TextInput
            style={styles.input}
            value={updatedDelivery[step.field] || ""}
            onChangeText={(value) => handleInputChange(step.field, value)}
          />
        )}
        {step.type === "boolean" && (
          <Switch
            value={!!updatedDelivery[step.field]}
            onValueChange={(value) => handleInputChange(step.field, value)}
          />
        )}
        {step.type === "date" && (
          <>
            <TouchableOpacity
              onPress={() => setActiveDatePicker(step.field)} // Open this step's date picker
              style={styles.dateButton}
            >
              <Text style={styles.dateText}>
                {new Date(updatedDelivery[step.field] || date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {activeDatePicker === step.field && ( // Show only this step's picker
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setActiveDatePicker(null); // Close the picker
                  if (selectedDate) {
                    setDate(selectedDate);
                    handleInputChange(step.field, selectedDate.toISOString());
                  }
                }}
              />
            )}
          </>
        )}
      </View>
    );
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}

    >      
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${((currentStep + 1) / stepsArray.length) * 100}%` },
            ]}
          />
        </View>
          {stepsArray.slice(0, currentStep + 1).map((_, index) => renderStep(index))}


          {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                
              />
            )}
        <View style={styles.buttonContainer}>
          {/* Étape précédente */}
          <View style={[styles.buttonBackContainer]}>
            <IconButton
              icon={"arrow-left"}
              iconColor={theme.colors.primary}
              size={22}
              disabled={currentStep === 0}
              onPress={() => setCurrentStep((prev) => prev - 1)}
            />
          </View>

          {/* Étape suivante */}
          <View style={[styles.buttonNextContainer]}>
            <IconButton
              icon={"arrow-right"}
              iconColor={"#ffffff"}
              size={22}
              disabled={
                (currentStep >= stepsArray.length - 1) || 
                (!(stepsArray[currentStep].type === "date") && !updatedDelivery[stepsArray[currentStep].field])
              }
              onPress={() => setCurrentStep((prev) => prev === stepsArray.length - 1 ? prev : prev + 1)}
            />
          </View>
        </View>

        {/* Sauvegarder les modifications */}
        <Button 
          mode="contained"
          style={styles.saveButton} 
          onPress={handleSave}
        >
          <View style={styles.buttonContent}>
            <Icon source={"content-save"} size={22} color="white" />
            <Text style={[styles.buttonText, { ...theme.fonts.labelLarge }]}>Enregistrer les modifications</Text>
          </View>
        </Button>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginVertical: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 4,
  },
  buttonNextContainer: {
    borderWidth: 1,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  buttonBackContainer: {
    borderWidth: 1,
    borderRadius: 40,
    borderColor: theme.colors.primary
  },
  stepContainer: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1C1C1E",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#007BFF",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginVertical: 10,
  },
  saveButton: {
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: '#007BFF',
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DeliveryDetails;


