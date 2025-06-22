import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { sendPasswordReset } from '../../Services/authService';

export default function Setting({ navigation }) {

  const handlePasswordReset = async () => {
    const user = auth().currentUser;
    if (user && user.email) {
      const result = await sendPasswordReset(user.email);
      if (result.success) {
        Alert.alert(
          "E-posta Gönderildi",
          "Şifrenizi sıfırlamak için e-posta adresinize bir link gönderdik."
        );
      } else {
        Alert.alert("Hata", result.error.message || "Bir hata oluştu.");
      }
    } else {
      Alert.alert("Hata", "Şifre sıfırlama linki göndermek için kullanıcı bilgisi bulunamadı.");
    }
  };

  const handleContactUs = () => {
    Linking.openURL('mailto:destek@ecohesapp.com?subject=Destek Talebi')
      .catch(() => {
        Alert.alert("Hata", "E-posta uygulaması açılamadı. Lütfen destek@ecohesapp.com adresine mail gönderin.");
      });
  };
  
  const handleLogout = async () => {
    await auth().signOut();
    navigation.replace('Login');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>
      
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Image source={require('../../Assets/icon/update-password.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Şifreyi Değiştir</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleContactUs}>
        <Image source={require('../../Assets/icon/phone-call.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Bize Ulaşın</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Image source={require('../../Assets/icon/logout.png')} style={styles.icon} />
        <Text style={[styles.buttonText, styles.logoutButtonText]}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    marginTop: 20,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#2e7d32',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  buttonText: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#c62828',
    fontWeight: '600'
  }
});