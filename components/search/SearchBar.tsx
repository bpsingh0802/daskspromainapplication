import { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  const [query, setQuery] = useState('');

  // Debounce effect: waits 300ms after user stops typing to call onSearch
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 300);

    // Cleanup function: clears the timeout if the user types again
    return () => {
      clearTimeout(handler);
    };
  }, [query]); // This effect re-runs whenever the 'query' state changes

  return (
    <View style={styles.container}>
      <Search size={20} color={colors.gray[500]} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        placeholderTextColor={colors.gray[500]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Allows it to take up available space
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  input: {
    ...typography.bodyMedium,
    color: colors.gray[900],
    marginLeft: spacing.sm,
    flex: 1, // Ensures it fills the space
  },
});