import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from './FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import HomeVendeur from './app/screens/home/HomeVendeur';
import HomeRco from './app/screens/home/HomeRco';
import HomeFinancialManager from './app/screens/home/HomeFinancialManager';
import HomeSecretariat from './app/screens/home/HomeSecretariat';
import HomeExpertProduit from './app/screens/home/HomeExpertProduit';
import Login from './app/screens/login/Login';
import RoleSelection from './app/screens/roles/RoleSelection';
// import ProgrammerLivraison from './app/screens/ProgrammerLivraison';
// import SuivreLivraison from './app/screens/SuivreLivraison';

// Fonction pour récupérer le rôle de l'utilisateur depuis Firebase
const fetchUserRole = async (userId: string): Promise<string | null> => {
  try {
    const userDoc = await getDoc(doc(FIREBASE_DB, 'Users', userId));
    if (userDoc.exists()) {
      return userDoc.data()?.role || null;
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
  }
  return null;
};

// Définition des paramètres de navigation pour chaque écran
type RootStackParamList = {
  Login: undefined;
  RoleSelection: undefined;
  HomeVendeur: undefined;
  HomeRco: undefined;
  HomeFinancialManager: undefined;
  HomeSecretariat: undefined;
  HomeExpertProduit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Stacks spécifiques à chaque rôle
const RcoStack = () => (
  <Stack.Navigator initialRouteName="HomeRco">
    <Stack.Screen name="HomeRco" component={HomeRco} />

    {/* <Stack.Screen name="ProgrammerLivraison" component={ProgrammerLivraison} />
    <Stack.Screen name="SuivreLivraison" component={SuivreLivraison} /> */}
  </Stack.Navigator>
);

const SecretariatStack = () => (
  <Stack.Navigator initialRouteName="HomeSecretariat">
    <Stack.Screen name="HomeSecretariat" component={HomeSecretariat} />
  {/*  <Stack.Screen name="SuivreLivraison" component={SuivreLivraison} /> */}
  </Stack.Navigator>
);

const VendeurStack = () => (
  <Stack.Navigator initialRouteName="HomeVendeur">
    <Stack.Screen name="HomeVendeur" component={HomeVendeur} />
  </Stack.Navigator>
);

const FinancialManagerStack = () => (
  <Stack.Navigator initialRouteName="HomeFinancialManager">
    <Stack.Screen name="HomeFinancialManager" component={HomeFinancialManager} />
  </Stack.Navigator>
);

const ExpertProduitStack = () => (
  <Stack.Navigator initialRouteName="HomeExpertProduit">
    <Stack.Screen name="HomeExpertProduit" component={HomeExpertProduit} />
  </Stack.Navigator>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authUser) => {
      setUser(authUser);

      if (authUser) {
        const userRole = await fetchUserRole(authUser.uid);
        setRole(userRole);
      } else {
        setRole(null);
      }
    });

    return unsubscribe;
  }, []);

  const renderStack = () => {
    if (!user) {
      return (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="RoleSelection" component={RoleSelection} />
        </Stack.Navigator>
      );
    }

    switch (role) {
      case 'Vendeur':
        return <VendeurStack />;
      case 'RCO':
        return <RcoStack />;
      case 'FinancialManager':
        return <FinancialManagerStack />;
      case 'Secretariat':
        return <SecretariatStack />;
      case 'ExpertProduit':
        return <ExpertProduitStack />;
      default:
        return (
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          </Stack.Navigator>
        );
    }
  };

  return <NavigationContainer>{renderStack()}</NavigationContainer>;
}
