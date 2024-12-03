import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStackParamList';
import { useStores } from '../stores';
import Products from '../screens/Products/Products';
import ProductDetails from '../screens/Products/ProductDetails';

const ProducdStack = createNativeStackNavigator<RootStackParamList>();

const ProductNavigator = () => {

    const { userStore } = useStores(); 
    const role = userStore.user?.role; 

    return (
        <ProducdStack.Navigator
            initialRouteName="Products"
            screenOptions={{
                headerStyle: { backgroundColor: '#006CFF' },
                headerTitleStyle: { color: 'white' },
                headerBackTitle: '',
                headerTintColor: '#FFFFFF'
            }}
        >
            <ProducdStack.Screen
                name="Products"
                component={Products}
                options={{
                    title: 'Tous les produits'                
                }}
            />
            <ProducdStack.Screen
                name="ProductDetails"
                component={ProductDetails}
                options={{
                    title: 'Détails du produit',
                    headerBackTitle: '',
                }}
            />
        </ProducdStack.Navigator>
    );
};

export default ProductNavigator;
