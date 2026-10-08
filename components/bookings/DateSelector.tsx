import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format, addDays, isSameDay } from 'date-fns';

interface DateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onSelectDate }: DateSelectorProps) {
  const [dates, setDates] = useState<Date[]>([]);
  const [visibleWeek, setVisibleWeek] = useState(0);

  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const nextDates: Date[] = [];
      
      for (let i = 0; i < 30; i++) {
        nextDates.push(addDays(today, i));
      }
      
      setDates(nextDates);
    };
    
    generateDates();
  }, []);

  const navigateWeek = (direction: number) => {
    setVisibleWeek(prev => prev + direction);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateWeek(-1)}
          disabled={visibleWeek === 0}
        >
          <ChevronLeft 
            size={20} 
            color={visibleWeek === 0 ? colors.gray[300] : colors.gray[600]} 
          />
        </TouchableOpacity>
        
        <Text style={styles.monthYear}>
          {format(dates[visibleWeek * 7] || new Date(), 'MMMM yyyy')}
        </Text>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateWeek(1)}
          disabled={visibleWeek >= 3}
        >
          <ChevronRight 
            size={20} 
            color={visibleWeek >= 3 ? colors.gray[300] : colors.gray[600]} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesContainer}
      >
        {dates.slice(visibleWeek * 7, (visibleWeek + 1) * 7).map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const dayToday = isToday(date);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                isSelected && styles.selectedDate,
              ]}
              onPress={() => onSelectDate(date)}
            >
              <Text 
                style={[
                  styles.dayName, 
                  isSelected && styles.selectedText,
                  dayToday && styles.todayText,
                ]}
              >
                {format(date, 'EEE')}
              </Text>
              
              <Text 
                style={[
                  styles.dayNumber, 
                  isSelected && styles.selectedText,
                  dayToday && styles.todayText,
                ]}
              >
                {format(date, 'd')}
              </Text>
              
              {dayToday && !isSelected && (
                <View style={styles.todayDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  monthYear: {
    ...typography.bodyMedium,
    color: colors.gray[800],
    fontFamily: 'Inter-Medium',
  },
  navButton: {
    padding: spacing.xs,
  },
  datesContainer: {
    paddingVertical: spacing.sm,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 80,
    borderRadius: 12,
    marginRight: spacing.sm,
    backgroundColor: colors.gray[50],
    position: 'relative',
  },
  selectedDate: {
    backgroundColor: colors.primary[600],
  },
  dayName: {
    ...typography.labelSmall,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  dayNumber: {
    ...typography.bodyLarge,
    color: colors.gray[900],
    fontFamily: 'Inter-Medium',
  },
  selectedText: {
    color: colors.white,
  },
  todayText: {
    color: colors.primary[600],
  },
  todayDot: {
    position: 'absolute',
    bottom: 10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary[600],
  },
});