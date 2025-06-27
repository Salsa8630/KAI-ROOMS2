import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, CheckBox, Image, TouchableOpacity } from 'react-native';

const SignUpPage = () => {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      {/* ... semua isi UI */}
    </View>
  );
};

// ⬇️ Letakkan StyleSheet SETELAH komponen
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
  },
  leftSection: {
    flex: 1,
    backgroundColor: '#FF5900',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  rightSection: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  illustration: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  tagline: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
  },
  signupButton: {
    backgroundColor: '#5a73ff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

// ⬇️ export-nya terakhir, setelah semua dideklarasikan
export default SignUpPage;
