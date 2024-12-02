import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView,} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Text } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import { useStores } from "../../stores";
import { Product, ProductStatus } from "../../types/Product";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Products/ProductDetails";

type CreateDeliveryProps = NativeStackScreenProps<RootStackParamList, "CreateDelivery">;

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
  const [delivery, setDelivery] = useState({
    title: "",
    type: "",
    model: product.model,
    reference: product.reference,
    numberId: product.size,
    color: product.color,
    physicalSite: product.currentSite,
    destinationSite: product.destinationSite,
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
        Alert.alert("Erreur", "Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiStore]);



const validateForm = useCallback(
  (updatedDelivery: typeof delivery) => {
    if (step === 1) {
      setIsValid(updatedDelivery.title.trim().length > 0);
    } else {
      const requiredFields = [
        updatedDelivery.title || "",
        updatedDelivery.type  || "",
        updatedDelivery.model  || "",
        updatedDelivery.reference || "", 
        updatedDelivery.numberId || "",
        updatedDelivery.color || "",
        updatedDelivery.physicalSite || "",
        updatedDelivery.destinationSite || "",
      ];
      setIsValid(requiredFields.every((field) => field.trim().length > 0));
    }
  },
  [step]
);

useEffect(() => {
  validateForm(delivery);
}, [delivery, validateForm]);

  const handleInputChange = (key: keyof typeof delivery, value: string) => {
      const updatedDelivery = { ...delivery, [key]: value };
      setDelivery(updatedDelivery);
    
      validateForm(updatedDelivery);
  };

  const handleModelChange = (model: string) => {
    const selectedProduct = products.find((product) => product.model === model);
    if (selectedProduct) {
      setDelivery((prev) => ({
        ...prev,
        model,
        reference: selectedProduct.reference,
        numberId: selectedProduct.size,
        color: selectedProduct.color,
        physicalSite: selectedProduct.currentSite,
        destinationSite: selectedProduct.destinationSite,
      }));
    }
    validateForm(delivery);
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
      Alert.alert("Succès", "Votre livraison a bien été créée.");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "TabNavigator" }],
        })
      );
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la sauvegarde.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {step === 1 ? (
            <>
              <TextInputField
                label="Nom du client*"
                value={delivery.title}
                onChangeText={(text: string) => handleInputChange("title", text)}
                placeholder="Entrez le nom du client"
              />
              <View style={styles.buttonContainer}>

                <Button mode="text" onPress={() =>  
                  navigation.getParent()}>
                  Précédent
                </Button>
                <Button mode="contained" onPress={() => setStep(2)} disabled={!isValid}>
                    Suivant
                </Button>

              </View>
            </>
          ) : (
            <>
              <DropdownField
                label="Type*"
                data={deliveryTypes}
                value={delivery.type}
                onChange={(value: string) => handleInputChange("type", value)}
              />
              <DropdownField
                label="Modèle*"
                data={products.map((p) => ({ label: p.model, value: p.model }))}
                value={delivery.model}
                onChange={handleModelChange}
                search
              />
              {["reference", "numberId", "color", "physicalSite", "destinationSite", "notes"].map(
                (key) => (
                  <TextInputField
                    key={key}
                    label={key}
                    value={delivery[key as keyof typeof delivery]}
                    onChangeText={(text: string) => handleInputChange(key as keyof typeof delivery, text)}
                    placeholder={`Entrer ${key}`}
                  />
                )
              )}
              <View style={styles.buttonContainer}>
                <Button mode="text" onPress={() => setStep(1)}>
                  Précédent
                </Button>
                <Button mode="contained" onPress={saveDelivery} disabled={!isValid}>
                  Créer la livraison
                </Button>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const DropdownField = React.memo(({ label, data, value, onChange, search }: any) => (
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
      search={search}
    />
  </View>
));

const TextInputField = React.memo(({ label, value, onChangeText, placeholder }: any) => (
  <View>
    <Text style={styles.label}>{label} :</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
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
    marginTop: 16,
  },
});

export default CreateDelivery;
