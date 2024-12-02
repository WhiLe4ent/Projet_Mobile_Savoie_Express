import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from '../types/Product';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  TabScreens: undefined;

  RoleScreens: undefined;

  Products: undefined;
  ProductDetails: { productId: string };

  Deliveries: { screen: "CreateDelivery"; params: { product?: Product } }; 
  CreateDelivery: {product?: Product};
  DeliveryDetails: { productId: string };
  DeliveriesList: undefined;
};
