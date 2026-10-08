import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface TimeSlotsProps {
  selectedTimeSlot: string | null;
  onSelectTimeSlot: (slot: string) => void;
}

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM'
];

// Randomly make some slots unavailable
const availableSlots = timeSlots.map(slot => ({
  time: slot,
  available: Math.random() > 0.3,
}));

export default function TimeSlots({ selectedTimeSlot, onSelectTimeSlot }: TimeSlotsProps) {
  return (
    <FlatList
      data={availableSlots}
      numColumns={3}
      keyExtractor={(item) => item.time}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.timeSlot,
            !item.available && styles.unavailableSlot,
            selectedTimeSlot === item.time && styles.selectedSlot,
          ]}
          onPress={() => item.available && onSelectTimeSlot(item.time)}
          disabled={!item.available}
        >
          <Text
            style={[
              styles.timeText,
              !item.available && styles.unavailableText,
              selectedTimeSlot === item.time && styles.selectedText,
            ]}
          >
            {item.time}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  timeSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 8,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.sm,
    backgroundColor: colors.gray[50],
  },
  unavailableSlot: {
    backgroundColor: colors.gray[100],
  },
  selectedSlot: {
    backgroundColor: colors.primary[600],
  },
  timeText: {
    ...typography.bodySmall,
    color: colors.gray[900],
  },
  unavailableText: {
    color: colors.gray[400],
    textDecorationLine: 'line-through',
  },
  selectedText: {
    color: colors.white,
    fontFamily: 'Inter-Medium',
  },
});