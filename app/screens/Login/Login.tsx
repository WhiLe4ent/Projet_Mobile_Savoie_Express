import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextInput, Button, ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { inject, observer } from 'mobx-react';
import { useStores } from '../../stores';

const Login = observer(() => {
    const {userStore} = useStores();
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const {control,handleSubmit,formState: { errors }} = useForm({
      defaultValues: {
        email: '',
        password: '',
      },
    });

    const signIn = async (data: { email: string; password: string }) => {
      setLoading(true);

      try {
        const response = await signInWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password);
        await userStore.loginUser({
          user: response.user,
          token: await response.user.getIdToken(),
        });

        if(response.user) {
          navigation.navigate('Home');
        }

        console.log('Sign-in successful:', response.user);
      } catch (error: any) {
        console.error(error);
        Alert.alert('Sign-in Failed', error.message);
      } finally {
        setLoading(false);
      }
      
    };

    const goToSignUp = () => {
      navigation.navigate('Register');
    };

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome Back
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
              label="Email"
              keyboardType="email-address"
              placeholder="Enter your email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.email}
              autoCapitalize="none"
              style={styles.input}
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
              label="Password"
              placeholder="Enter your password"
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
              Sign In
            </Button>
            <Button mode="text" onPress={goToSignUp} style={styles.button}>
              Create Account
            </Button>
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }
);

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
