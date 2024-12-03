import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView,} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Text, TextInput } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import { useStores } from "../../stores";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigations/RootStackParamList";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DeliveryForm, DeliveryKeys } from "../../types/DeliveryForm";
import theme from "../../settings/Theme";
import { Product } from "../../types/Product";

type CreateDeliveryProps = NativeStackScreenProps<RootStackParamList, "CreateDelivery">;

const CreateDelivery: React.FC<CreateDeliveryProps> = ({ navigation, route }) => {
  const { apiStore } = useStores();
  const { product } = route.params || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [stepsCompleted, setStepsCompleted] = useState(false); 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fields: { label: string; key: DeliveryKeys; placeholder: string }[] = [
    { label: "Référence*", key: "reference", placeholder: "Référence" },
    { label: "Numéro ID*", key: "numberId", placeholder: "Numéro ID" },
    { label: "Couleur*", key: "color", placeholder: "Couleur" },
    { label: "Site présence physique*", key: "physicalSite", placeholder: "Site physique" },
    { label: "Site destination*", key: "destinationSite", placeholder: "Site destination" },
    { label: "Divers", key: "notes", placeholder: "Notes" }
  ];
    
  const defaultValues = {
    title: "",
    type: "",
    model: product?.model || "",
    reference: product?.reference || "",
    numberId: product?.size || "",
    color: product?.color || "",
    physicalSite: product?.currentSite || "",
    destinationSite: product?.destinationSite || "",
    notes: "",
  };

  const { control, handleSubmit, setValue, formState: { errors }, trigger, watch, reset } = useForm<DeliveryForm>({
    defaultValues,
  });

  const formValues = watch()

  const deliveryTypes = [
    { label: "Type A", value: "A" },
    { label: "Type B", value: "B" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await apiStore.getProducts() as Product[]
        setProducts(fetchedProducts);
      } catch (error) {
        Alert.alert("Erreur", "Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiStore]);

  const saveDelivery = async (data: DeliveryForm) => {
    try {
      const newDelivery = { ...data, createdAt: new Date().toISOString() };
      const deliveriesCollectionRef = collection(FIREBASE_DB, "deliveries");
      await addDoc(deliveriesCollectionRef, newDelivery);

      Alert.alert("Succès", "Votre livraison a bien été créée.");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "TabScreens" }],
        })
      );
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const checkValidName: SubmitHandler<DeliveryForm> = async (data) => {
    const isValid = await apiStore.checkDeliveryName(data.title);
    if (!isValid) {
      Alert.alert(
        "Erreur",
        "Une livraison portant ce titre existe déjà. Veuillez choisir un autre titre."
      );
      return;
    }
    setStepsCompleted(true);
    setCurrentStep(2);
  };

  const handleNext = async () => {
    const isValid = await trigger()
    if(!isValid) return
    if (currentStep === 1 && !stepsCompleted) {
      Alert.alert("Erreur", "Veuillez valider le titre avant de continuer.");
      return;
    }
    if(currentStep===2) {
      const selectedProduct = products.filter(product => product.model === formValues.model)[0]
      reset({
        model: selectedProduct.model,
        reference: selectedProduct.reference,
        numberId: selectedProduct.size,
        color: selectedProduct.color,
        physicalSite: selectedProduct.currentSite,
        destinationSite: selectedProduct.destinationSite,
        notes: "",
      })
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        keyboardShouldPersistTaps="handled" 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Step 1 */}
        {currentStep === 1 && (
          <>
            <Controller
              control={control}
              name="title"
              rules={{ required: "Nom du client est requis" }}
              render={({ field: { onChange, value } }) => (
                <TextInputField
                  label="Nom du client*"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Entrez le nom du client"
                  error={errors.title?.message}
                />
              )}
            />
            <Button 
              mode="contained" 
              onPress={handleSubmit(checkValidName)}
              style={{marginTop: 40}}
            >
              Valider le titre
            </Button>
          </>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <View style={styles.step2}>
            <Controller
              control={control}
              name="type"
              rules={{ required: "Type est requis" }}
              render={({ field: { onChange, value } }) => (
                <DropdownField
                  label="Type*"
                  placeholder="Choisissez un type"
                  data={deliveryTypes}
                  value={value}
                  onChange={onChange}
                  error={errors.type?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="model"
              
              rules={{ required: "Modèle est requis" }}
              render={({ field: { onChange, value } }) => (
                <DropdownField
                  label="Modèle*"
                  data={products.map((p) => ({ label: p.model, value: p.model }))}
                  value={value}
                  onChange={onChange}
                  error={errors.model?.message}
                />
              )}
            />
          </View>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <>
            {fields.map(({ label, key, placeholder }) => (
              <Controller
                key={key}
                control={control}
                name={key}
                rules={{ required: `${label} est requis` }}
                render={({ field: { onChange, value } }) => (
                  <TextInputField
                    label={label}
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    error={errors[key]?.message}
                  />
                )}
              />
            ))}
          </>
        )}

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <Button 
              onPress={handlePrevious} 
              mode="outlined"
              style={styles.buttonText}
            >
              Précédent
            </Button>
          )}
          {( currentStep < 3 && currentStep > 1 )&& (
            <Button 
              onPress={handleNext} 
              mode="contained"
            >
              Suivant
            </Button>
          )}
          {currentStep === 3 && (
            <Button onPress={handleSubmit(saveDelivery)} mode="contained">
              Créer la livraison
            </Button>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

  const TextInputField = ({ label, value, onChangeText, placeholder, error }: any) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && { borderColor: "red" }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const DropdownField = ({ label, data, value, onChange, error, placeholder }: any) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Dropdown
        style={[styles.dropdown, error && { borderColor: "red" }]}
        data={data}
        placeholder={placeholder}
        labelField="label"
        valueField="value"
        value={value}
        placeholderStyle={{color: theme.colors.placeholder}}
        onChange={(item) => onChange(item.value)}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    paddingBottom: 30
  },
  button: { 
    backgroundColor: '#007BFF',
  },
  buttonText: {
    borderColor: theme.colors.accent,
    borderWidth: 1
  },
  step2: {
    display: "flex",
    flexDirection: "column",
    gap: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    fontSize: 16,
  },
  dropdown: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#ccc",
    backgroundColor: theme.colors.background
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  errorText: { 
    color: "red", 
    fontSize: 12,
    paddingLeft: 20,
    marginBottom: 20 
  },
});

export default CreateDelivery;
