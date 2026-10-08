import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface DropdownProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export default function Dropdown({
  label,
  value,
  onValueChange,
  options,
  placeholder,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder || 'Select an option';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {selectedLabel}
        </Text>
        <ChevronDown size={20} color={colors.gray[600]} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView style={styles.optionsList} nestedScrollEnabled>
              {options.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    value === option.value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.gray[700],
    marginBottom: spacing.xs,
    fontFamily: 'Inter-Medium',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  dropdownText: {
    ...typography.bodyMedium,
    color: colors.gray[900],
    flex: 1,
  },
  placeholderText: {
    color: colors.gray[500],
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    maxHeight: '60%',
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  selectedOption: {
    backgroundColor: colors.primary[50],
  },
  optionText: {
    ...typography.bodyMedium,
    color: colors.gray[900],
  },
  selectedOptionText: {
    color: colors.primary[700],
    fontFamily: 'Inter-Medium',
  },
});
