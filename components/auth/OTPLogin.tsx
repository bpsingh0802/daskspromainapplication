// import React, { useState } from 'react';
// import { View, TextInput, Button, Alert, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
// import { sendOTP, verifyOTP, signInAfterVerification } from '@/lib/twilioService';
// import { ChevronLeft } from 'lucide-react-native';
// import { useRouter } from 'expo-router';
// import { colors } from '@/constants/colors';

// export default function OTPLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
//   const router = useRouter();
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [step, setStep] = useState<'phone' | 'otp'>('phone');
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleBack = () => {
//     if (step === 'otp') {
//       setStep('phone');
//       setOtp('');
//       setError(null);
//     } else {
//       router.back();
//     }
//   };

//   const handlePhoneChange = (value: string) => {
//     if (value === '' || value.startsWith('+')) {
//       setPhoneNumber(value.replace(/[^0-9+]/g, ''));
//     }
//   };

//   const handleSendOTP = async () => {
//     if (!/^\+\d{10,15}$/.test(phoneNumber)) {
//       setError('Please use the E.164 format (e.g., +919876543210)');
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     const result = await sendOTP(phoneNumber);
//     setLoading(false);

//     if (result.success) {
//       setStep('otp');
//       Alert.alert('OTP Sent!', `A code was sent to ${phoneNumber}.`);
//     } else {
//       setError(result.error || 'Failed to send OTP.');
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (otp.length < 4) {
//       setError('Please enter a valid OTP.');
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     const verifyResult = await verifyOTP(phoneNumber, otp);

//     if (!verifyResult.success) {
//       setLoading(false);
//       setError(verifyResult.error || 'Verification failed.');
//       return;
//     }

//     const signInResult = await signInAfterVerification(phoneNumber);
//     setLoading(false);

//     if (signInResult.success) {
//       if (signInResult.isNewUser) {
//         Alert.alert('Welcome!', 'You can complete your profile later from the Profile tab.');
//       } else {
//         Alert.alert('Welcome back!', 'You are now logged in.');
//       }
//       onLoginSuccess();
//     } else {
//       setError(signInResult.error || 'Could not complete login.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//           <ChevronLeft size={24} color={colors.gray[700]} />
//         </TouchableOpacity>
//         <Text style={styles.title}>{step === 'phone' ? 'Phone Login' : 'Verify OTP'}</Text>
//       </View>

//       {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}
//       {step === 'phone' ? (
//         <View style={styles.form}>
//           <Text style={styles.label}>Enter your phone number</Text>
//           <TextInput
//             placeholder="+919876543210"
//             value={phoneNumber}
//             onChangeText={handlePhoneChange}
//             keyboardType="phone-pad"
//             style={styles.input}
//             autoComplete="tel"
//           />
//           {error && <Text style={styles.errorText}>{error}</Text>}
//           <Button title="Send OTP" onPress={handleSendOTP} disabled={loading} />
//         </View>
//       ) : (
//         <View style={styles.form}>
//           <Text style={styles.label}>Enter code sent to {phoneNumber}</Text>
//           <TextInput
//             placeholder="123456"
//             value={otp}
//             onChangeText={setOtp}
//             keyboardType="number-pad"
//             style={styles.input}
//             autoFocus
//           />
//           {error && <Text style={styles.errorText}>{error}</Text>}
//           <Button title="Verify & Sign In" onPress={handleVerifyOTP} disabled={loading} />
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
//   backButton: { padding: 8, marginRight: 12 },
//   title: { fontSize: 20, fontWeight: '600', color: '#333' },
//   form: { flex: 1, justifyContent: 'center', padding: 20 },
//   loader: { position: 'absolute', zIndex: 10, top: 0, left: 0, right: 0, bottom: 0 },
//   label: { fontSize: 16, marginBottom: 8, color: '#333' },
//   input: { height: 50, borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 15, marginVertical: 10, borderRadius: 8, backgroundColor: '#fff', fontSize: 16 },
//   errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
// });

// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   Alert,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity
// } from 'react-native';

// import { sendOTP, verifyOTP, signInAfterVerification } from '@/lib/twilioService';
// import { ChevronLeft } from 'lucide-react-native';
// import { useRouter } from 'expo-router';
// import { colors } from '@/constants/colors';

// export default function OTPLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {

//   const router = useRouter();

//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [step, setStep] = useState<'phone' | 'otp'>('phone');
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);


//   const handleBack = () => {
//     if (step === 'otp') {
//       setStep('phone');
//       setOtp('');
//       setError(null);
//     } else {
//       router.back();
//     }
//   };


//   // Allow only numbers and max 10 digits
//   const handlePhoneChange = (value: string) => {
//     const cleaned = value.replace(/[^0-9]/g, '');

//     if (cleaned.length <= 10) {
//       setPhoneNumber(cleaned);
//     }
//   };


//   // Convert to E.164 format
//   const formatToE164 = (number: string) => {
//     return `+91${number}`;
//   };


//   const handleSendOTP = async () => {

//     if (phoneNumber.length !== 10) {
//       setError('Please enter a valid 10 digit mobile number');
//       return;
//     }

//     const formattedNumber = formatToE164(phoneNumber);

//     setLoading(true);
//     setError(null);

//     const result = await sendOTP(formattedNumber);

//     setLoading(false);

//     if (result.success) {
//       setStep('otp');
//       Alert.alert('OTP Sent', `Code sent to ${formattedNumber}`);
//     } else {
//       setError(result.error || 'Failed to send OTP.');
//     }
//   };


//   const handleVerifyOTP = async () => {

//     if (otp.length < 4) {
//       setError('Enter valid OTP');
//       return;
//     }

//     const formattedNumber = formatToE164(phoneNumber);

//     setLoading(true);
//     setError(null);

//     const verifyResult = await verifyOTP(formattedNumber, otp);

//     if (!verifyResult.success) {
//       setLoading(false);
//       setError(verifyResult.error || 'Verification failed.');
//       return;
//     }

//     const signInResult = await signInAfterVerification(formattedNumber);

//     setLoading(false);

//     if (signInResult.success) {

//       if (signInResult.isNewUser) {
//         Alert.alert('Welcome!', 'You can complete your profile later.');
//       } else {
//         Alert.alert('Welcome back!');
//       }

//       onLoginSuccess();

//     } else {
//       setError(signInResult.error || 'Login failed');
//     }
//   };


//   return (
//     <View style={styles.container}>

//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//           <ChevronLeft size={24} color={colors.gray[700]} />
//         </TouchableOpacity>

//         <Text style={styles.title}>
//           {step === 'phone' ? 'Phone Login' : 'Verify OTP'}
//         </Text>
//       </View>


//       {loading && (
//         <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
//       )}


//       {step === 'phone' ? (

//         <View style={styles.form}>

//           <Text style={styles.label}>Enter your mobile number</Text>

//           <View style={styles.phoneWrapper}>

//             <View style={styles.countryBox}>
//               <Text style={styles.countryText}>🇮🇳 +91</Text>
//             </View>

//             <TextInput
//               placeholder="9876543210"
//               value={phoneNumber}
//               onChangeText={handlePhoneChange}
//               keyboardType="number-pad"
//               maxLength={10}
//               style={styles.phoneInput}
//             />

//           </View>

//           {error && <Text style={styles.errorText}>{error}</Text>}

//           <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
//             <Text style={styles.buttonText}>Send OTP</Text>
//           </TouchableOpacity>

//         </View>

//       ) : (

//         <View style={styles.form}>

//           <Text style={styles.label}>
//             Enter OTP sent to +91{phoneNumber}
//           </Text>

//           <TextInput
//             placeholder="123456"
//             value={otp}
//             onChangeText={setOtp}
//             keyboardType="number-pad"
//             style={styles.input}
//             maxLength={6}
//           />

//           {error && <Text style={styles.errorText}>{error}</Text>}

//           <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
//             <Text style={styles.buttonText}>Verify OTP</Text>
//           </TouchableOpacity>

//         </View>

//       )}

//     </View>
//   );
// }



// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5'
//   },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     paddingTop: 60,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0'
//   },

//   backButton: {
//     padding: 8,
//     marginRight: 12
//   },

//   title: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333'
//   },

//   form: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20
//   },

//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//     color: '#333'
//   },

//   loader: {
//     position: 'absolute',
//     zIndex: 10,
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0
//   },



//   phoneWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 12,
//     backgroundColor: '#fff',
//     height: 55,
//     marginVertical: 15,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 2
//   },

//   countryBox: {
//     paddingHorizontal: 14,
//     height: '100%',
//     justifyContent: 'center',
//     borderRightWidth: 1,
//     borderRightColor: '#eee',
//     backgroundColor: '#fafafa'
//   },

//   countryText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333'
//   },

//   phoneInput: {
//     flex: 1,
//     fontSize: 16,
//     paddingHorizontal: 15
//   },



//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     paddingHorizontal: 15,
//     marginVertical: 15,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     fontSize: 16
//   },

//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//     textAlign: 'center'
//   },

//   button: {
//     backgroundColor: '#007AFF',
//     height: 50,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },

//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600'
//   }

// });




import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import { sendOTP, verifyOTP, signInAfterVerification } from '@/lib/twilioService';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';

export default function OTPLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {

  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setOtp('');
      setError(null);
    } else {
      router.back();
    }
  };


  // Allow only numbers and max 10 digits
  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');

    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
    }
  };


  // Convert phone to E.164
  const formatToE164 = (number: string) => {
    return `+91${number}`;
  };


  const handleSendOTP = async () => {

    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10 digit mobile number');
      return;
    }

    const formattedNumber = formatToE164(phoneNumber);

    setLoading(true);
    setError(null);

    const result = await sendOTP(formattedNumber);

    setLoading(false);

    if (result.success) {
      setStep('otp');
      Alert.alert('OTP Sent', `Code sent to ${formattedNumber}`);
    } else {
      setError(result.error || 'Failed to send OTP.');
    }
  };


  const handleVerifyOTP = async () => {

    if (otp.length !== 6) {
      setError('Please enter the 6 digit OTP');
      return;
    }

    const formattedNumber = formatToE164(phoneNumber);

    setLoading(true);
    setError(null);

    const verifyResult = await verifyOTP(formattedNumber, otp);

    if (!verifyResult.success) {
      setLoading(false);
      setError(verifyResult.error || 'Verification failed.');
      return;
    }

    const signInResult = await signInAfterVerification(formattedNumber);

    setLoading(false);

    if (signInResult.success) {

      if (signInResult.isNewUser) {
        Alert.alert('Welcome!', 'You can complete your profile later.');
      } else {
        Alert.alert('Welcome back!');
      }

      onLoginSuccess();

    } else {
      setError(signInResult.error || 'Login failed');
    }
  };


  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>

        <Text style={styles.title}>
          {step === 'phone' ? 'Phone Login' : 'Verify OTP'}
        </Text>
      </View>


      {loading && (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      )}


      {step === 'phone' ? (

        <View style={styles.form}>

          <Text style={styles.label}>Enter your mobile number</Text>

          <View style={styles.phoneWrapper}>

            <View style={styles.countryBox}>
              <Text style={styles.countryText}>🇮🇳 +91</Text>
            </View>

            <TextInput
              placeholder="9876543210"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              keyboardType="number-pad"
              maxLength={10}
              style={styles.phoneInput}
            />

          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>

        </View>

      ) : (

        <View style={styles.form}>

          <Text style={styles.label}>
            Enter the 6-digit OTP sent to +91{phoneNumber}
          </Text>

          <TextInput
            placeholder="123456"
            value={otp}
            onChangeText={(value) => {
              const cleaned = value.replace(/[^0-9]/g, '');
              if (cleaned.length <= 6) setOtp(cleaned);
            }}
            keyboardType="number-pad"
            style={styles.input}
            maxLength={6}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>

        </View>

      )}

    </View>
  );
}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },

  backButton: {
    padding: 8,
    marginRight: 12
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333'
  },

  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },

  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333'
  },

  loader: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  phoneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    height: 55,
    marginVertical: 15,
    overflow: 'hidden',
    elevation: 2
  },

  countryBox: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    backgroundColor: '#fafafa'
  },

  countryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },

  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },

  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }

});