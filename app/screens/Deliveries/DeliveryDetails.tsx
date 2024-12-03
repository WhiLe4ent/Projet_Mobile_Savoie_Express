import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
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
import { Role } from "../../types/User";
import { useStores } from "../../stores";

const DeliveryDetails = ({ route }: { route: any }) => {
  const { delivery } = route.params;
  const [updatedDelivery, setUpdatedDelivery] = useState(delivery);
  const [date, setDate] = useState(new Date(delivery.availability || Date.now()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { userStore, apiStore, emailStore } = useStores(); 
  const [openModal, setOpenModal] = useState<boolean>(false);
  const user = userStore.user; 

  interface Step {
    label: string;
    field: Steps;
    type: "text" | "boolean" | "date" | "checkbox";
    allowedRoles: string[]; 
  }
  
  const stepsArray: Step[] = [
    { label: "Présence", field: Steps.Presence, type: "boolean", allowedRoles: [Role.rco] },
    { label: "Disponibilité", field: Steps.Availability, type: "date", allowedRoles: [Role.rco] },
    { label: "Frais de préparation", field: Steps.PreparationFees, type: "text", allowedRoles: [Role.rco] },
    { label: "Configuration du produit", field: Steps.Configuration, type: "text", allowedRoles: [Role.rco] },
    { label: "Documentation", field: Steps.Documentation, type: "boolean", allowedRoles: [Role.rco] },
    { label: "Date d’arrivée", field: Steps.ConvoyageDate, type: "date", allowedRoles: [Role.convoyage, Role.rco] },
    { label: "Date contrôle qualité", field: Steps.QualityControlDate, type: "date", allowedRoles: [Role.vendeur, Role.rco] },
    { label: "Packaging requis", field: Steps.PackagingRequired, type: "boolean", allowedRoles: [Role.vendeur, Role.rco] },
    { label: "Statut de financement", field: Steps.FinancingStatus, type: "text", allowedRoles: [Role.financialManager, Role.rco] },
    { label: "Paiement reçu", field: Steps.PaymentReceived, type: "boolean", allowedRoles: [Role.financialManager, Role.rco] },
    { label: "Date de livraison", field: Steps.DeliveryDate, type: "date", allowedRoles: [Role.vendeur, Role.rco] },
    { label: "Packaging prêt", field: Steps.PackagingReady, type: "boolean", allowedRoles: [Role.accessoiriste, Role.rco] },
  ];

  //Si le user on lui met Secretariat (le moins de droit possible)
  const currentUserRole = user?.role || Role.secretariat ; 

  const canEditStep = (step: Step): boolean => {
    const normalizedCurrentUserRole = currentUserRole.toLowerCase();
    const normalizedAllowedRoles = step.allowedRoles.map(role => role.toLowerCase());
  
    return normalizedAllowedRoles.includes(normalizedCurrentUserRole);
  };
  
  const [currentStep, setCurrentStep] = useState(
    stepsArray.findIndex((step) => !updatedDelivery[step.field]) === -1
      ? stepsArray.length
      : stepsArray.findIndex((step) => !updatedDelivery[step.field]) + 1
  );

  const handleSave = async () => {
    try {
      const docRef = doc(FIREBASE_DB, "deliveries", delivery.id);
      await updateDoc(docRef, updatedDelivery);
  
      await sendEmailNotification();
  
      Alert.alert("Success", "Modifications enregistrées et email envoyé !");

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "DeliveriesList" }],
        })
      );
    } catch (error) {
      console.error("Error saving delivery or sending email:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'enregistrement ou de l'envoi de l'email.");
    }
  };
  
  const sendEmailNotification = async () => {
    try {
      const currentStepInfo = stepsArray[currentStep];
      if (!currentStepInfo) {
        Alert.alert("Erreur", "Étape actuelle introuvable.");
        return;
      }
  
      const allowedRoles = currentStepInfo.allowedRoles;
  
      // Récupérer les utilisateurs correspondant aux rôles autorisés
      const recipients: { email: string; name: string }[] = [];
      for (const role of allowedRoles) {
        const users = await apiStore.getUsersByRole(role);
        recipients.push(...users);
      }
  
      if (recipients.length === 0) {
        Alert.alert("Aucun destinataire trouvé", "Aucun utilisateur ne correspond aux rôles requis.");
        return;
      }
  
      for (const recipient of recipients) {
        await emailStore.sendEmail(
          recipient.email,
          updatedDelivery.title,
          delivery.title,
          delivery.id
        );
      }
    } catch (error) {
      console.error("Error sending email notification:", error);
      throw new Error("Email notification failed");
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
    const isCompleted = !!updatedDelivery[step.field];
    const isEditable = canEditStep(step);
  
    return (
      <View key={step.field} style={styles.stepContainer}>
        <Text style={styles.label}>{step.label} :</Text>
  
        {isCompleted && !isEditable ? (
          <Text style={styles.completedStepText}>
            {step.type === "date"
              ? new Date(updatedDelivery[step.field]).toLocaleDateString()
              : updatedDelivery[step.field]?.toString() || "Non renseigné"}
          </Text>
        ) : (
          <>
            {step.type === "text" && isEditable && (
              <TextInput
                style={styles.input}
                value={updatedDelivery[step.field] || ""}
                onChangeText={(value) => handleInputChange(step.field, value)}
              />
            )}
            {step.type === "boolean" && isEditable && (
              <Switch
                value={!!updatedDelivery[step.field]}
                onValueChange={(value) => handleInputChange(step.field, value)}
              />
            )}
            {step.type === "date" && isEditable && (
              <>
                <TouchableOpacity
                  onPress={() => setActiveDatePicker(step.field)}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateText}>
                    {new Date(updatedDelivery[step.field] || date).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {activeDatePicker === step.field && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setActiveDatePicker(null);
                      if (selectedDate) {
                        setDate(selectedDate);
                        handleInputChange(step.field, selectedDate.toISOString());
                      }
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </View>
    );
  };

  const handleDelete = async () => {
    try {
      await apiStore.deleteDelivery(delivery.id);
      Alert.alert("Success", `Delivery with ID "${delivery.title}" has been deleted`);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "DeliveriesList" }],
        })  
      ); 
    } catch (error) {
      Alert.alert("Error", "Failed to delete delivery. Please try again.");
    }
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
          {currentUserRole !== Role.secretariat && (
            <View style={[styles.buttonBackContainer]}>
              <IconButton
                icon={"arrow-left"}
                iconColor={theme.colors.primary}
                size={22}
                disabled={currentStep === 0}
                onPress={() => setCurrentStep((prev) => prev - 1)}
              />
            </View>
          )}

          {currentUserRole !== Role.secretariat && (
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
              )
          }

        </View>

        {currentUserRole !== Role.secretariat &&
          <View>
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

            {currentUserRole == Role.vendeur &&  
              <Button 
                onPress={()=>setOpenModal(true)} 
                mode="outlined"
                style={styles.cancelButton}
              >
                  <View style={styles.buttonContent}>
                    <Icon source={"delete"} size={22} color={theme.colors.primary}/>
                    <Text style={[styles.buttonText, { ...theme.fonts.labelLarge, color: theme.colors.primary }]}>
                      Supprimer la livraison
                    </Text>
                  </View>
              </Button>
            }
            <Modal
              visible={openModal}
              transparent
              animationType="fade"
              onRequestClose={()=> setOpenModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Êtes-vous sûr de vouloir supprimer?</Text>
                  <Button mode="contained" 
                    onPress={handleDelete} 
                    style={styles.modalButton}
                  >
                    Supprimer
                  </Button>
                  <Button 
                    mode="outlined"  
                    onPress={()=> setOpenModal(false)} 
                    style={styles.canelDeleteButton}>
                      Annuler
                  </Button>
                </View>
              </View>
            </Modal>
          </View>


        }

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    paddingBottom: 20
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    marginVertical: 10,
    width: "100%",
  },
  cancelButton: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: theme.colors.accent,
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
    marginTop: 50,
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: '#007BFF',
  },
  canelDeleteButton: {
    marginTop: 10,
    alignSelf: "center",
    borderColor: "#FF6347",
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
  completedStepContainer: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  completedStepText: {
    color: "#888",
    fontSize: 16,
  },
  
});

export default DeliveryDetails;


