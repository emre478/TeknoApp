import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { loginUser } from '../Services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    const result = await loginUser(email, password);

    if (result.success) {
      navigation.replace('Home');
    } else {
      const code = result.error?.code || '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password'
      ) {
        Alert.alert('Hatalı Giriş', 'E-posta veya şifreniz yanlış.');
      } else {
        Alert.alert('Hata', result.error.message || 'Bir hata oluştu.');
      }
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('Email');
  };

  return (
    <LinearGradient colors={['#00c853', '#D1EAED']} style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.innerContainer}>
        <Text style={styles.title}>EcoHesApp</Text>

        <TextInput
          placeholder="E-posta"
          placeholderTextColor="#4d4d4d"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Şifre"
          placeholderTextColor="#4d4d4d"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Şifremi Unuttum</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Hesabın yok mu? Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 50,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffffcc',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    elevation: 2,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4caf50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#1e88e5',
    marginTop: 15,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  registerText: {
    color: '#2e7d32',
    marginTop: 20,
    fontSize: 14,
  },
});
