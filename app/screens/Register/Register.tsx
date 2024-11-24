import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Alert, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RegisterForm, Role } from '../../types/User';
import theme from '../../settings/Theme';

type RegisterRouteProps = {
  initialEmail?: string;
  initialPassword?: string;
};

const Register = () => {
  const route = useRoute();
  const { initialEmail, initialPassword } = route.params as RegisterRouteProps;
  const navigation = useNavigation<any>();
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
    defaultValues: {
      email: initialEmail || '',
      password: initialPassword || '',
      pseudo: '',
      role: undefined,
    },
  });

  const formValues = watch();

  const handleCreateAccount = async (data: RegisterForm) => {
    try {
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password);
      const userId = response.user.uid;

      // Create or update the user's document in Firestore
      await setDoc(doc(FIREBASE_DB, 'Users', userId), {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        pseudo: data.pseudo,
        role: data.role,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
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
      >
        <Text style={styles.title}>Créer un compte</Text>

        {/* Email Field */}
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
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        {/* Password Field */}
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
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
 
        {/* First Name Field */}
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: 'First name is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="First Name"
              placeholder="Enter your first name"
              placeholderTextColor={theme.colors.placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.email}
              autoCapitalize="none"
              style={styles.input}
            />
          )}
        />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}
        
        {/* Last Name Field */}
        <Controller
          control={control}
          name="lastName"
          rules={{
            required: 'Last name is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Last Name"
              placeholder="Enter your last name"
              placeholderTextColor={theme.colors.placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.email}
              autoCapitalize="none"
              style={styles.input}
            />
          )}
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

        {/* Pseudo Field */}
        <Controller
          control={control}
          name="pseudo"
          rules={{ required: 'Pseudo is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Pseudo"
              placeholder="Enter your pseudo"
              placeholderTextColor={theme.colors.placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.pseudo}
              style={styles.input}
            />
          )}
        />
        {errors.pseudo && <Text style={styles.errorText}>{errors.pseudo.message}</Text>}

        {/* Role Picker */}
        <TouchableOpacity
          onPress={() => setPickerVisible(!isPickerVisible)}
          style={[styles.input, styles.pickerButton]}
        >
          <Text style={styles.textRolePicker}>
            {formValues.role ? formValues.role : 'Open Role Picker'}
          </Text>
        </TouchableOpacity>
        
        {isPickerVisible && 
        <Controller
          control={control}
          rules={{
              required: true,
          }}
          render={({ field: { onBlur, onChange,value } }) => (
              <View style={styles.pickerContainer}>
                  <Picker
                      onBlur={onBlur}
                      style={styles.picker}
                      selectedValue={value}
                      onValueChange={(itemValue) => {
                        onChange(itemValue);
                        setPickerVisible(false);
                      }}
                  >
                    <Picker.Item label="Vendeur" value={Role.vendeur} />
                    <Picker.Item label="RCO" value={Role.rco} />
                    <Picker.Item label="Financial Manager" value={Role.financialManager} />
                    <Picker.Item label="Secretariat" value={Role.secretariat} />
                    <Picker.Item label="Expert Produit" value={Role.expertProduit} />
                  </Picker>
              </View>
          )}
          name='role'
        />} 

        {errors.role && <Text style={styles.errorText}>{errors.role.message}</Text>}

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSubmit(handleCreateAccount)}>
            Créer compte
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
  pickerButton: {
    marginVertical: 10,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 12,
  },
  picker: {
    height:150,
    backgroundColor: '#fff',
  },
  pickerContainer:{
    width: '95%',
    overflow: 'hidden',
    borderRadius: 30,
    marginBottom: 25,     
    alignSelf: 'center',     
    elevation: 5,
    shadowColor: '#000',//ios
    shadowOffset: { width: 0, height: 5 },//ios
    shadowOpacity: 0.5,//ios
    shadowRadius: 5,//ios
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
