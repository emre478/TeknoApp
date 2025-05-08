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
import { sendPasswordReset } from '../../Services/authService';

const EmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendReset = async () => {
    if (!email) {
      Alert.alert('Eksik Bilgi', 'Lütfen e-posta adresinizi girin.');
      return;
    }

    const result = await sendPasswordReset(email);

    if (result.success) {
      Alert.alert('Başarılı', 'Şifre sıfırlama e-postası gönderildi.');
      navigation.goBack();
    } else {
      Alert.alert('Hata', result.error.message || 'Bir hata oluştu.');
    }
  };

  return (
    <LinearGradient colors={['#00c853', '#D1EAED']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Şifre Sıfırlama</Text>

        <TextInput
          placeholder="E-posta adresiniz"
          placeholderTextColor="#4d4d4d"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleSendReset}>
          <Text style={styles.buttonText}>Gönder</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Giriş ekranına dön</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default EmailScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
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
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backText: {
    color: '#1e88e5',
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
