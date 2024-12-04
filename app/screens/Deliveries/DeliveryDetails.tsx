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
import { Text, Button, Icon, useTheme, IconButton, ActivityIndicator} from "react-native-paper";
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
  const [loading, setLoading] = useState<boolean>(false);

  interface Step {
    label: string;
    field: Steps;
    type: "text" | "boolean" | "date" ;
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
    { label: "Statut de financement", field: Steps.FinancingStatus, type: "boolean", allowedRoles: [Role.financialManager, Role.rco] },
    { label: "Paiement reçu", field: Steps.PaymentReceived, type: "boolean", allowedRoles: [Role.financialManager, Role.rco, Role.rco] },
    { label: "Date de livraison", field: Steps.DeliveryDate, type: "date", allowedRoles: [Role.vendeur, Role.rco] },
    { label: "Packaging prêt", field: Steps.PackagingReady, type: "boolean", allowedRoles: [Role.accessoiriste, Role.rco] },

  ];

  if(!user) return null;

  //Si le user on lui met Secretariat (le moins de droit possible)
  const currentUserRole = user?.role || Role.secretariat ; 

  const canEditStep = (step: Step): boolean => {
    const normalizedCurrentUserRole = currentUserRole.toLowerCase();
    const normalizedAllowedRoles = step.allowedRoles.map(role => role.toLowerCase());
  
    return normalizedAllowedRoles.includes(normalizedCurrentUserRole);
  };
  
  const [currentStep, setCurrentStep] = useState(
    stepsArray.findIndex((step) => {
      const value = updatedDelivery[step.field];
      return value === undefined || value === null || value === ''; 
    }) === -1
      ? stepsArray.length
      : stepsArray.findIndex((step) => {
          const value = updatedDelivery[step.field];
          return value === undefined || value === null || value === ''; 
        }) + 1
  );
  
  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(FIREBASE_DB, "deliveries", delivery.id);
      await updateDoc(docRef, updatedDelivery);
  
      // Fonctionnel mais vous devez d'abord mettre en place l'api pour le serveur express
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
    } finally {
      setLoading(false);
    }
  };
  
  const sendEmailNotification = async () => {
    try {
      const currentStepInfo = stepsArray[currentStep];
      if (!currentStepInfo) {
        Alert.alert("Erreur", "Étape actuelle introuvable.");
        return;
      }
  
      const previousStepIndex = currentStep - 1;
      if (previousStepIndex < 0) {
        Alert.alert("Erreur", "Il n'y a pas d'étape précédente.");
        return;
      }
      const previousStepInfo = stepsArray[previousStepIndex];
      const allowedRoles = previousStepInfo.allowedRoles;
  
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
          `Validation requise pour l'étape ${previousStepInfo.label}`,
          `Bonjour ${recipient.name},\n\nA votre tour de noter pour valider l'étape "${previousStepInfo.label}" et passer à l'étape suivante "${currentStepInfo.label}".\n\nCordialement,`,
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
        {step.type === "boolean" && !isEditable && (
          <View style={styles.stepCard}>
            <Text style={styles.label}>{step.label}</Text>
            {updatedDelivery[step.field] === true ? (
              <Icon source={"check-circle-outline"} size={24} color="#71d177" />
            ) : (
              <Icon source={"close-circle-outline"} size={24} color="#e00000" />
            )}
          </View>
        )}

        {step.type === "boolean" && isEditable && (
          <View style={styles.stepCard}>
            <Text style={styles.label}>{step.label}</Text>
            <Switch
              value={updatedDelivery[step.field] !== undefined ? updatedDelivery[step.field] : false}
              onValueChange={(value) => handleInputChange(step.field, value)}
            />
          </View>
        )}

        {step.type === "text" && (
          isEditable ? (
            // Editable Container
            <View style={styles.containerDatePicker}>
              <Text style={styles.label}>{step.label}</Text>
              <TextInput
                style={styles.input}
                value={updatedDelivery[step.field]}
                onChangeText={(value) => handleInputChange(step.field, value)}
              />
            </View>
          ) : (
            // Non-editable Container
            isCompleted && step.field !== Steps.FinancingStatus && (
              <View style={styles.containerDatePicker}>
                <Text style={styles.label}>{step.label}</Text>
                <View style={{marginTop: 4}}>
                  <Text style={styles.completedStepText}>{updatedDelivery[step.field]}</Text>
                </View>
              </View>
            )
          )
        )}

        {step.type === "date" && isEditable ? (
          <View style={styles.containerDatePicker}>
            <Text style={styles.labelDate}>{step.label}</Text>
            
            <TouchableOpacity
              onPress={() => setActiveDatePicker(step.field)}
              style={styles.dateButton}
            >
              <Text style={styles.dateText}>
                {updatedDelivery[step.field]
                  ? new Date(updatedDelivery[step.field]).toLocaleDateString("en-GB")
                  : (() => {
                      handleInputChange(step.field, date.toISOString());
                      return new Date(date).toLocaleDateString("en-GB");
                    })()
                }
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
          </View>
        ) : (
          step.type === "date" && isCompleted && step.field !== Steps.FinancingStatus && (
            <View style={styles.stepCard}>
              <Text style={styles.label}>{step.label}</Text>
              <View>
                <Text style={styles.completedStepText}>
                  {new Date(updatedDelivery[step.field]).toLocaleDateString("en-GB")}
                </Text>
              </View>
            </View>
          )
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

  const isUserAllowedToModifyStep = (step: Step) => {
    return user.role && step.allowedRoles.includes(user.role);
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >      
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${((currentStep + 1) / stepsArray.length) * 100}%` },
          ]}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Envoi des mails en cours...</Text>
        </View>
        ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.deliveryTitle}>
            Livraison "{delivery.title}"
          </Text>

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
              <View style={[styles.buttonArrowContainer]}>
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
                <View style={[styles.buttonArrowContainer]}>
                  <IconButton
                    icon={"arrow-right"}
                    iconColor={theme.colors.primary}
                    size={22}
                    disabled={
                      (currentStep >=stepsArray.length - 1) 
                      || (!(stepsArray[currentStep].type === "date") && !updatedDelivery[stepsArray[currentStep].field])
                      || (currentStep===1 && delivery.presence===false)
                      || !isUserAllowedToModifyStep(stepsArray[currentStep])

                    }
                    onPress={() => setCurrentStep((prev) => prev === stepsArray.length - 1 ? prev : prev + 1)}
                  />
                </View>
                )
            }

          </View>

          {currentUserRole !== Role.secretariat &&
            <View>
              {currentUserRole == Role.vendeur &&  
                <Button 
                  onPress={()=>setOpenModal(true)} 
                  mode="outlined"
                  style={styles.cancelButton}
                >
                    <View style={styles.buttonContent}>
                      <Icon source={"delete"} size={22} color={theme.colors.primary}/>
                      <Text style={[styles.buttonText, { ...theme.fonts.labelLarge, color: theme.colors.primary }]}>
                        Supprimer
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
      )}

      {currentUserRole !== Role.secretariat && (
        <View style={[styles.buttonSaveContainer, styles.floatingButton]}>
          <IconButton
            icon={"content-save"}
            iconColor={"#ffffff"}
            size={22}
            onPress={handleSave}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 14,
    backgroundColor: "#f9f9f9",
    paddingBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 50
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
  buttonSaveContainer: {
    borderWidth: 1,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  buttonArrowContainer: {
    borderWidth: 1,
    borderRadius: 40,
    borderColor: theme.colors.primary
  },
  stepContainer: {
    borderRadius: 8,
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 10,
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
  saveButton: {
    marginTop: 50,
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: '#007BFF',
  },
  cancelButton: {
    marginTop: 15,
    borderWidth: 1,
    alignSelf: "center",
    borderColor: theme.colors.accent,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  labelDate: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1C1C1E",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 30,
    backgroundColor: "#fff",
    fontSize: 16,
    marginTop: 10
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 30,
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
  canelDeleteButton: {
    marginTop: 10,
    marginVertical: 10,
    width: "100%",
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
  floatingButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    width: 60, 
    height: 60,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007BFF", 
    elevation: 5, 
    zIndex: 999,
  },
  deliveryTitle:{
    fontWeight: 'bold',
    fontSize: 22,
    marginLeft: 20,
    marginVertical: 15
  },
  completedStepText: {
    color: "#888",
    fontSize: 16,
  },
  containerDatePicker:{
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 20,
  },
  stepCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 40,
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
  
});

export default DeliveryDetails;


