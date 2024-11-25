
import React from 'react';
import { Text } from 'react-native-paper';

const DeliveryDetails = () => {
  return (
    <Text>Delivery Details</Text>
  );
};

export default DeliveryDetails;







































// import React, { useState } from 'react';







// import { View, StyleSheet } from 'react-native';
// import { Text, TextInput, Button } from 'react-native-paper';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import firestore from '@react-native-firebase/firestore';
// import { useStores } from "../../stores";


// type DeliveryDetailsRouteProps = {
//   clientName?: string;
//   deliveryType?: string;
// };


// const DeliveryDetails = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { clientName, deliveryType } = route.params as DeliveryDetailsRouteProps;

//   const [model, setModel] = useState('');
//   const [reference, setReference] = useState('');
//   const [idNumber, setIdNumber] = useState('');
//   const [color, setColor] = useState('');
//   const [originSite, setOriginSite] = useState('');
//   const [destinationSite, setDestinationSite] = useState('');
//   const [misc, setMisc] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSubmit = async () => {
//     if (!model || !reference || !idNumber || !originSite || !destinationSite) {
//       setErrorMessage('Tous les champs obligatoires doivent être remplis.');
//       return;
//     }

//     const deliveryData = {
//       clientName,
//       deliveryType,
//       model,
//       reference,
//       idNumber,
//       color,
//       originSite,
//       destinationSite,
//       misc,
//       createdAt: firestore.Timestamp.fromDate(new Date()),
//       updatedAt: firestore.Timestamp.fromDate(new Date()),
//     };

//     try {
//       await firestore().collection('deliveries').add(deliveryData);
//       console.log('Livraison ajoutée avec succès.');
//       const parentNavigation: any = navigation.getParent();
//       parentNavigation.navigate('Home');
//           } catch (error) {
//       console.error('Erreur lors de l’ajout de la livraison :', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Livraison : {clientName}</Text>
//       {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

//       <TextInput
//         label="Modèle"
//         value={model}
//         onChangeText={setModel}
//         style={styles.input}
//       />
//       <TextInput
//         label="Référence"
//         value={reference}
//         onChangeText={setReference}
//         style={styles.input}
//       />
//       <TextInput
//         label="Numéro ID"
//         value={idNumber}
//         onChangeText={setIdNumber}
//         style={styles.input}
//       />
//       <TextInput
//         label="Couleur"
//         value={color}
//         onChangeText={setColor}
//         style={styles.input}
//       />
//       <TextInput
//         label="Site présence physique"
//         value={originSite}
//         onChangeText={setOriginSite}
//         style={styles.input}
//       />
//       <TextInput
//         label="Site destination"
//         value={destinationSite}
//         onChangeText={setDestinationSite}
//         style={styles.input}
//       />
//       <TextInput
//         label="Divers"
//         value={misc}
//         onChangeText={setMisc}
//         style={styles.input}
//       />

//       <Button mode="contained" onPress={handleSubmit} style={styles.button}>
//         Enregistrer
//       </Button>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   input: {
//     marginBottom: 16,
//   },
//   button: {
//     marginTop: 16,
//   },
//   error: {
//     color: 'red',
//     marginBottom: 16,
//   },
// });

// export default DeliveryDetails;
