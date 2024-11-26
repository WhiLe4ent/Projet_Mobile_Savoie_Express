import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from '../types/Product';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  TabScreens: undefined;
  Deliveries: { screen: "CreateDelivery"; params: { product?: Product } }; 
  CreateDelivery: {product?: Product};
  RoleScreens: undefined;
  Products: undefined;
  ProductDetails: { productId: string };
};
