import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Text } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { CommonActions, RouteProp } from "@react-navigation/native";
import { useStores } from "../../stores";
import { Product, ProductStatus } from "../../types/Product";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Products/ProductDetails";


type CreateDeliveryProps = NativeStackScreenProps<RootStackParamList, 'CreateDelivery'>;

const CreateDelivery: React.FC<CreateDeliveryProps> = ({ navigation, route }) => {

  const defaultProduct: Product = {
    id: "",
    model: "",
    reference: "",
    color: "",
    size: "",
    quantity: 0,
    currentSite: "",
    destinationSite: "",
    status: ProductStatus.available,
    createdAt: new Date(),
    updatedAt: new Date(),
    photo: "",
  };
  
  const product = route.params?.product || defaultProduct; 

  const { apiStore } = useStores();
  const [step, setStep] = useState(1);
  
  // Valeurs par défaut pour éviter undefined au début
  const [delivery, setDelivery] = useState({
    title: "", 
    type: "",
    model: product?.model ,
    reference: product?.reference ,
    numberId: product?.size ,
    color: product?.color ,
    physicalSite: product?.currentSite ,
    destinationSite: product?.destinationSite ,
    notes: "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const deliveryTypes = [
    { label: "Type A", value: "A" },
    { label: "Type B", value: "B" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await apiStore.getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiStore]);


  const isNotEmpty = (value: string | undefined): boolean => {
    return value !== undefined && value.replace(/\s+/g, "").length > 0;
  };

  const validateForm = (updatedDelivery: typeof delivery) => {
    const {
      title,
      type,
      model,
      reference,
      numberId,
      color,
      physicalSite,
      destinationSite,
    } = updatedDelivery;

    const isValidForm =
      isNotEmpty(title) &&
      isNotEmpty(type) &&
      isNotEmpty(model) &&
      isNotEmpty(reference) &&
      isNotEmpty(numberId) &&
      isNotEmpty(color) &&
      isNotEmpty(physicalSite) &&
      isNotEmpty(destinationSite);

    setIsValid(isValidForm);
  };

  const handleInputChange = (key: string, value: string) => {
    const updatedDelivery = { ...delivery, [key]: value };
    setDelivery(updatedDelivery);
    validateForm(updatedDelivery);
  };

  const handleModelChange = (model: string) => {
    const selectedProduct = products.find((product) => product.model === model);
    const updatedDelivery = {
      ...delivery,
      model,
      reference: selectedProduct?.reference || "",
      numberId: selectedProduct?.size || "",
      color: selectedProduct?.color || "",
      physicalSite: selectedProduct?.currentSite || "",
      destinationSite: selectedProduct?.destinationSite || "",
    };
    setDelivery(updatedDelivery);
    validateForm(updatedDelivery);
  };

  const goToNextStep = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const saveDelivery = async () => {
    if (!isValid) {
      Alert.alert("Incomplet", "Veuillez remplir tous les champs obligatoires avant de continuer.");
      return;
    }
    try {
      const newDelivery = {
        ...delivery,
        createdAt: new Date().toISOString(),
      };
      const deliveriesCollectionRef = collection(FIREBASE_DB, "deliveries");
      await addDoc(deliveriesCollectionRef, newDelivery);
      Alert.alert("Succès", "Votre livraison a bien été créé.");
      
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "DeliveriesList" }],
        })
      );
    } catch (error) {
      console.error("Error adding delivery:", error);
    }
  };

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={100}

  >
    <ScrollView 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"

    >
      <View style={styles.container}>
        {step === 1 ? (
          <View>
            <Text style={styles.label}>Nom du client :</Text>
            <TextInput
              style={styles.input}
              value={delivery.title}
              onChangeText={(text) => handleInputChange("title", text)}
              placeholder="Entrez le nom du client"
            />
            <View style={styles.buttonContainer}>
              <Button mode="text" onPress={() => navigation.dispatch(CommonActions.goBack())}>
                Précédent
              </Button>
              <Button mode="contained" onPress={goToNextStep}>
                Suivant
              </Button>
            </View>
          </View>
          ) : <>
            <View>
              <DropdownField
                label="Type*"
                data={deliveryTypes}
                value={delivery.type}
                onChange={(value: string) => handleInputChange("type", value)}
              />
              <DropdownField
                label="Modèle*"
                data={products.map((product) => ({ label: product.model, value: product.model }))}
                value={delivery.model}
                onChange={handleModelChange}
                search
              />
              {[
                { label: "Référence*", key: "reference", placeholder: "Référence" },
                { label: "Numéro ID*", key: "numberId", placeholder: "Numéro ID" },
                { label: "Couleur*", key: "color", placeholder: "Couleur" },
                { label: "Site présence physique*", key: "physicalSite", placeholder: "Site physique" },
                { label: "Site destination*", key: "destinationSite", placeholder: "Site destination" },
                { label: "Divers", key: "notes", placeholder: "Notes" }
              ].map(({ label, key, placeholder }) => (
                <TextInputField
                  key={key}
                  label={label}
                  value={(delivery as any)[key]}
                  onChangeText={(text: string) => handleInputChange(key, text)}
                  placeholder={placeholder}
                />
              ))}

              <View style={styles.buttonContainer}>
                <Button mode="text" onPress={() => setStep(1)}>
                  Précédent
                </Button>
                <Button mode="contained" onPress={saveDelivery} disabled={false}>
                  Créer la livraison
                </Button>
              </View>
            </View>
          </>
        }
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};



const DropdownField = ({ label, data, value, onChange, search = false }: any) => (
  <View>
    <Text style={styles.label}>{label} :</Text>
    <Dropdown
      data={data}
      labelField="label"
      valueField="value"
      placeholder={`Sélectionnez ${label.toLowerCase()}`}
      value={value}
      onChange={(item) => onChange(item.value)}
      style={styles.input}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      containerStyle={styles.dropdownContainer}
      search={search}
    />
  </View>
);

const TextInputField = ({ label, value, onChangeText, placeholder }: any) => (
  <View>
    <Text style={styles.label}>{label} :</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:16,
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
    color: "#aaa",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  },
  dropdownContainer: {
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});

export default CreateDelivery;
