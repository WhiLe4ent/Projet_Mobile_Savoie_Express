import React from 'react';
import DeliveriesList from '../screens/Deliveries/DeliveriesList';
import CreateDelivery from '../screens/Deliveries/CreateDelivery';
import DeliveryDetails from '../screens/Deliveries/DeliveryDetails';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStackParamList';
import { useStores } from '../stores';

const DeliveryStack = createNativeStackNavigator<RootStackParamList>();

const DeliveryNavigator = () => {

    const { userStore } = useStores(); 
    const role = userStore.user?.role; 

    return (
        <DeliveryStack.Navigator
            initialRouteName="DeliveriesList"
            screenOptions={{
                headerStyle: { backgroundColor: '#006CFF' },
                headerTitleStyle: { color: 'white' },
                headerBackTitle: '',
                headerTintColor: '#FFFFFF'
            }}
        >
            <DeliveryStack.Screen
                name="DeliveriesList"
                component={DeliveriesList}
                options={{
                    title: 'Toutes les livraisons'                
                }}
            />
            <DeliveryStack.Screen
                name="DeliveryDetails"
                component={DeliveryDetails}
                options={{
                    title: 'Détails de livraison',
                }}
            />
            {role === 'Vendeur' || role === 'RCO' ? (
                <DeliveryStack.Screen
                name="CreateDelivery"
                component={CreateDelivery}
                options={{
                    title: 'Créer une nouvelle livraison',
                }}
                />
            ) : null}
        </DeliveryStack.Navigator>
    );
};

export default DeliveryNavigator;
