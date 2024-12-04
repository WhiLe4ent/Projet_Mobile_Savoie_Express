import React, { useRef, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { observer } from 'mobx-react';
import { useStores } from '../../stores';
import { LoginForm } from '../../types/User';
import theme from '../../settings/Theme';

const Login = observer(() => {
  const { userStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation<any>();
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const signIn = async (data: LoginForm) => {
    setLoading(true);

    try {
      const response = await signInWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password);
      await userStore.loginUser({
        user: response.user,
        token: await response.user.getIdToken(),
      });

      if (response.user) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'TabScreens',
                params: { screen: 'Home' },
              },
            ],
          })
        );
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Sign-in Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = async () => {
    const data = getValues();
    navigation.navigate('Register', { initialEmail: data.email, initialPassword: data.password });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Bienvenue
      </Text>

      <Controller
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={emailRef}
            label="Email"
            keyboardType="email-address"
            placeholder="Enter your email"
            placeholderTextColor={theme.colors.placeholder}
            mode="flat"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.email}
            autoCapitalize="none"
            style={styles.input}
            onSubmitEditing={() => passwordRef.current.focus()} 
            returnKeyType="next"
          />
        )}
        name="email"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Controller
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={passwordRef}
            label="Password"
            placeholder="Enter your password"
            placeholderTextColor={theme.colors.placeholder}
            mode="flat"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                icon={passwordVisible ? 'eye-off' : 'eye'}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
            error={!!errors.password}
            style={styles.input}
            onSubmitEditing={handleSubmit(signIn)}
            returnKeyType="done"
          />
        )}
        name="password"
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSubmit(signIn)} style={styles.button}>
            Connexion
          </Button>
          <Button mode="text" onPress={goToSignUp} style={styles.button}>
            Créer un ompte
          </Button>
        </View>
      )}
    </KeyboardAvoidingView>
  );
});

export default Login;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#1C1C1E',
    fontWeight: "bold"
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 8,
  },
});
