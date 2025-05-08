import auth from '@react-native-firebase/auth';

export const registerUser = async (email, password) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const loginUser = async (email, password) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const logoutUser = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
