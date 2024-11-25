import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  TabScreens: undefined;
  Deliveries: undefined;
  RoleScreens: undefined;
  Products: undefined;
  ProductDetails: { productId: string };
};
