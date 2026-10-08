// import { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
// import { MapPin } from 'lucide-react-native';
// import { colors } from '@/constants/colors';
// import { spacing } from '@/constants/spacing';
// import { typography } from '@/constants/typography';
// import { useLocation } from '@/hooks/useLocation';

// interface LocationPickerProps {
//   onLocationSelect: (location: string | null) => void;
// }

// export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
//   const locationData = useLocation();
  
//   if (!locationData) {
//     return (
//       <View style={[styles.inputContainer, { justifyContent: 'center' }]}>
//         <ActivityIndicator color={colors.primary[600]} />
//       </View>
//     );
//   }
  
//   const { location: deviceLocation, loading: deviceLoading, error: deviceError } = locationData;
  
//   // This is the single source of truth for what is displayed.
//   const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
//   const [isManualEntry, setIsManualEntry] = useState(false);
//   const [manualLocation, setManualLocation] = useState('');
//   const inputRef = useRef<TextInput>(null);

//   // ## THE FIX ##
//   // This new, simpler effect handles the initial location fetch.
//   useEffect(() => {
//     // It will only set the location if we have a GPS location AND
//     // if no location has been selected yet (either by GPS or manually).
//     if (deviceLocation && !selectedLocation) {
//       setSelectedLocation(deviceLocation);
//       onLocationSelect(deviceLocation);
//     }
//   }, [deviceLocation]); // It only depends on the deviceLocation

//   // This function handles submitting your custom location.
//   const handleSubmit = () => {
//     const newLocation = manualLocation.trim() || null;
    
//     // This updates the visual text in the search bar to your custom city.
//     setSelectedLocation(newLocation); 
    
//     // This tells the HomeScreen to filter the results.
//     onLocationSelect(newLocation);
    
//     // Exit manual entry mode.
//     setIsManualEntry(false);
//   };

//   // This function handles tapping the component to enter manual mode.
//   const handleToggleManualEntry = () => {
//     if (!isManualEntry) {
//       setIsManualEntry(true);
//       setManualLocation(selectedLocation || ''); // Pre-fill with the currently selected location
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   };
  
//   const handleInputChange = (text: string) => {
//     setManualLocation(text);
//   };

//   // This function determines what text to display.
//   const getDisplayText = () => {
//     // Show loading text only if the GPS is running AND no location has been selected yet.
//     if (deviceLoading && !selectedLocation) {
//       return 'Finding location...';
//     }
//     // Otherwise, always show the selected location.
//     return selectedLocation || 'Select location';
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.inputContainer}
//         onPress={handleToggleManualEntry} 
//         activeOpacity={0.7}
//       >
//         <MapPin size={18} color={colors.primary[600]} />
//         {isManualEntry ? (
//           <TextInput
//             ref={inputRef}
//             style={styles.input}
//             value={manualLocation}
//             onChangeText={handleInputChange}
//             placeholder="Enter location"
//             autoFocus
//             onSubmitEditing={handleSubmit}
//             onBlur={handleSubmit}
//           />
//         ) : (
//           <Text style={styles.text}>{getDisplayText()}</Text>
//         )}
//       </TouchableOpacity>
//       {deviceError && !isManualEntry && <Text style={styles.errorText}>{deviceError}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: spacing.sm,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.primary[50],
//     padding: spacing.sm,
//     borderRadius: 8,
//     minHeight: 44,
//   },
//   text: {
//     ...typography.bodyMedium,
//     color: colors.gray[700],
//     marginLeft: spacing.xs,
//   },
//   input: {
//     ...typography.bodyMedium,
//     color: colors.gray[700],
//     marginLeft: spacing.xs,
//     flex: 1,
//   },
//   errorText: {
//     ...typography.bodySmall,
//     color: colors.error[600],
//     marginLeft: spacing.xs,
//     marginTop: spacing.xs,
//   },
// });



// import { useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
// import { MapPin } from 'lucide-react-native';
// import { colors } from '@/constants/colors';
// import { spacing } from '@/constants/spacing';
// import { typography } from '@/constants/typography';

// // 1. UPDATE THE PROPS
// // We now accept the global location and loading state as props
// interface LocationPickerProps {
//   onLocationSelect: (location: string | null) => void;
//   currentLocation: string | null;
//   isLoading: boolean;
// }

// // 2. UPDATE THE FUNCTION
// // We remove the internal 'useLocation' hook
// export default function LocationPicker({ 
//   onLocationSelect, 
//   currentLocation, 
//   isLoading 
// }: LocationPickerProps) {
  
//   const [isManualEntry, setIsManualEntry] = useState(false);
//   const [manualLocation, setManualLocation] = useState('');
//   const inputRef = useRef<TextInput>(null);

//   // This function handles submitting your custom location.
//   const handleSubmit = () => {
//     const newLocation = manualLocation.trim() || null;
    
//     // This tells the HomeScreen to filter the results.
//     onLocationSelect(newLocation);
    
//     // Exit manual entry mode.
//     setIsManualEntry(false);
//   };

//   // This function handles tapping the component to enter manual mode.
//   const handleToggleManualEntry = () => {
//     if (!isManualEntry) {
//       setIsManualEntry(true);
//       setManualLocation(currentLocation || ''); // Pre-fill with the global location
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   };
  
//   const handleInputChange = (text: string) => {
//     setManualLocation(text);
//   };

//   // This function determines what text to display.
//   const getDisplayText = () => {
//     // 3. UPDATE THE LOGIC
//     // Use the 'isLoading' prop from our global state
//     if (isLoading) {
//       return 'Finding location...';
//     }
//     // Use the 'currentLocation' prop from our global state
//     return currentLocation || 'Select location';
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.inputContainer}
//         onPress={handleToggleManualEntry} 
//         activeOpacity={0.7}
//       >
//         <MapPin size={18} color={colors.primary[600]} />
//         {isManualEntry ? (
//           <TextInput
//             ref={inputRef}
//              style={styles.input}
//             value={manualLocation}
//             onChangeText={handleInputChange}
//             placeholder="Enter location"
//             autoFocus
//             onSubmitEditing={handleSubmit}
//             onBlur={handleSubmit}
//           />
//         ) : (
//           // 4. SHOW THE TEXT OR LOADING SPINNER
//           isLoading ? (
//             <ActivityIndicator color={colors.primary[600]} style={{ marginLeft: spacing.xs }} />
//           ) : (
//             <Text 
//               style={[styles.text, !currentLocation && styles.placeholderText]}
//             >
//               {getDisplayText()}
//             </Text>
//           )
//         )}
//       </TouchableOpacity>
//       {/* We don't need the old error text here, as the hook is now in the provider */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     // marginBottom: spacing.sm, // Removed, let the parent (HomeScreen) handle gaps
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.primary[50],
//     padding: spacing.sm,
//     borderRadius: 8,
//     minHeight: 44,
//   },
//   text: {
//     ...typography.bodyMedium,
//     color: colors.gray[700],
//     marginLeft: spacing.xs,
//   },
//   placeholderText: {
//     color: colors.gray[500], // Lighter color for placeholder
//   },
//   input: {
//     ...typography.bodyMedium,
//     color: colors.gray[700],
//     marginLeft: spacing.xs,
//     flex: 1,
//   },
// });





import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

// We accept the global location and loading state as props
interface LocationPickerProps {
  onLocationSelect: (location: string | null) => void;
  currentLocation: string | null;
  isLoading: boolean;
}

// We remove the internal 'useLocation' hook
export default function LocationPicker({ 
  onLocationSelect, 
  currentLocation, 
  isLoading 
}: LocationPickerProps) {
  
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const inputRef = useRef<TextInput>(null);

  // This function handles submitting your custom location.
  const handleSubmit = () => {
    const newLocation = manualLocation.trim() || null;
    
    // This tells the HomeScreen to filter the results.
    onLocationSelect(newLocation);
    
    // Exit manual entry mode.
    setIsManualEntry(false);
  };

  // This function handles tapping the component to enter manual mode.
  const handleToggleManualEntry = () => {
    if (!isManualEntry) {
      setIsManualEntry(true);
      setManualLocation(currentLocation || ''); // Pre-fill with the global location
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };
  
  const handleInputChange = (text: string) => {
    setManualLocation(text);
  };

  // This function determines what text to display.
  const getDisplayText = () => {
    // Use the 'isLoading' prop from our global state
    if (isLoading && !currentLocation) {
      return 'Finding location...';
    }
    // Use the 'currentLocation' prop from our global state
    return currentLocation || 'Select location';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={handleToggleManualEntry} 
        activeOpacity={0.7}
      >
        <MapPin size={18} color={colors.primary[600]} />
        {isManualEntry ? (
          <TextInput
            ref={inputRef}
            style={styles.input} // <--- NO TYPO HERE
            value={manualLocation}
            onChangeText={handleInputChange}
            placeholder="Enter location"
            autoFocus
            onSubmitEditing={handleSubmit}
            onBlur={handleSubmit}
          />
        ) : (
          // Show the text or a loading spinner
          (isLoading && !currentLocation) ? (
            <ActivityIndicator color={colors.primary[600]} style={{ marginLeft: spacing.xs }} />
          ) : (
            <Text 
              style={[styles.text, !currentLocation && styles.placeholderText]}
            >
              {getDisplayText()}
            </Text>
          )
        )}
      </TouchableOpacity>
    </View> // <--- NO TYPO HERE
  );
}

const styles = StyleSheet.create({
  container: {
    // No margin, let the parent handle gaps
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    padding: spacing.sm,
    borderRadius: 8,
    minHeight: 44,
  },
  text: {
    ...typography.bodyMedium,
    color: colors.gray[700],
    marginLeft: spacing.xs,
  },
  placeholderText: {
    color: colors.gray[500],
  },
  input: {
    ...typography.bodyMedium,
    color: colors.gray[700],
    marginLeft: spacing.xs,
    flex: 1,
  },
});