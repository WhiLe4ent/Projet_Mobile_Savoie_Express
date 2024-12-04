import React, { useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Alert, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Dropdown } from 'react-native-element-dropdown';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, Text } from 'react-native-paper';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { RegisterForm } from '../../types/User';
import theme from '../../settings/Theme';
import { observer } from 'mobx-react';
import { useStores } from '../../stores';

type RegisterRouteProps = {
  initialEmail?: string;
  initialPassword?: string;
};

const Register = observer(() => {
  const { userStore } = useStores();
  const route = useRoute();
  const { initialEmail, initialPassword } = route.params as RegisterRouteProps;
  const navigation = useNavigation<any>();
  const roles = [
    { label: 'Vendeur', value: 'vendeur' },
    { label: 'RCO', value: 'rco' },
    { label: 'Convoyeur', value: 'convoyeur' },
    { label: 'Financial Manager', value: 'financialManager' },
    { label: 'Secretariat', value: 'secretariat' },
    { label: 'Expert Produit', value: 'expertProduit' },
  ];

  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
    defaultValues: {
      email: initialEmail || '',
      password: initialPassword || '',
      pseudo: '',
      role: undefined,
    },
  });

  // Références pour chaque champ
  const passwordRef = useRef<any>(null);
  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const pseudoRef = useRef<any>(null);

  const formValues = watch();

  const handleCreateAccount = async (data: RegisterForm) => {  
    try {
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password);
      const userId = response.user.uid;
  
      await userStore.saveUserToDatabase(userId, data);
      await userStore.loginUser({
        user: response.user,
        token: await response.user.getIdToken(),
      });
  
      CommonActions.reset({
        index: 0,
        routes: [
            {
                name: 'TabScreens'
            },
        ],
      })
      navigation.navigate('TabScreens', { screen: 'Home'})
    } catch (error: any) {
      console.error(error);
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Créer un compte</Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.email}
              autoCapitalize="none"
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()} // Lors du "Enter", passer au champ mot de passe
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={passwordRef}
              label="Password"
              placeholder="Enter your password"
              placeholderTextColor={theme.colors.placeholder}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.password}
              autoCapitalize="none"
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => firstNameRef.current?.focus()} // Passer au champ prénom
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
        
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: 'First name is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={firstNameRef}
              label="First Name"
              placeholder="Enter your first name"
              placeholderTextColor={theme.colors.placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.firstName}
              autoCapitalize="none"
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()} // Passer au champ nom de famille
            />
          )}
        />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

        <Controller
          control={control}
          name="lastName"
          rules={{
            required: 'Last name is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={lastNameRef}
              label="Last Name"
              placeholder="Enter your last name"
              placeholderTextColor={theme.colors.placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.lastName}
              autoCapitalize="none"
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => pseudoRef.current?.focus()} // Passer au champ pseudo
            />
          )}
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

        <Controller
          control={control}
          name="pseudo"
          rules={{ required: 'Pseudo is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={pseudoRef}
              label="Pseudo"
              placeholder="Enter your pseudo"
              placeholderTextColor={theme.colors.placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.pseudo}
              style={styles.input}
              returnKeyType="next"
            />
          )}
        />
        {errors.pseudo && <Text style={styles.errorText}>{errors.pseudo.message}</Text>}

        <Controller
          control={control}
          name="role"
          rules={{ required: 'Rôle requis' }}
          render={({ field: { onChange, value } }) => (
            <Dropdown
              data={roles}
              labelField="label"
              valueField="value"
              placeholder="Sélectionnez un rôle"
              value={value}
              onChange={(item) => onChange(item.value)}
              style={[styles.input, styles.dropdown]}
            />
          )}
        />
        {errors.role && <Text style={styles.errorText}>{errors.role.message}</Text>}

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSubmit(handleCreateAccount)}>
            Créer compte
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#aaa',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  dropdownContainer: {
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  errorText: {
    color: '#E53935',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: 30
  },
  textRolePicker: {
    color: theme.colors.placeholder,
    fontSize: 16,
    paddingLeft: 6
  }
});
