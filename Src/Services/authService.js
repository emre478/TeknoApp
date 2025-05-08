import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// ✅ Register işlemi (hem Auth hem Firestore)
export const registerUser = async (name, email, password) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    // Firestore'a kullanıcı profili kaydet
    await firestore().collection('users').doc(uid).set({
      name,
      email,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// ✅ Giriş
export const loginUser = async (email, password) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// ✅ Çıkış
export const logoutUser = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// ✅ Şifre sıfırlama
export const sendPasswordReset = async (email) => {
  try {
    await auth().sendPasswordResetEmail(email);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
