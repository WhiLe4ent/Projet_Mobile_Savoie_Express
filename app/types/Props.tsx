import { NavigationProp } from "@react-navigation/native";
import UserStore from "../stores/UserStore";

export interface LoginProps 
{
    userStore?: UserStore,
    navigation: NavigationProp<'Login'>;
}
