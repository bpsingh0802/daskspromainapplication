import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { formatDistanceToNow } from 'date-fns';
import { router } from 'expo-router';
import { Conversation } from '@/types/chat';

interface ChatListItemProps {
  conversation: Conversation;
}

export default function ChatListItem({ conversation }: ChatListItemProps) {
  const getTimeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => {
        // In a real app, navigate to conversation detail
        console.log('Navigate to conversation:', conversation.id);
      }}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: conversation.avatar }}
          style={styles.avatar}
        />
        {conversation.isOnline && <View style={styles.onlineBadge} />}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.name}>{conversation.name}</Text>
          <Text style={styles.time}>{getTimeAgo(conversation.lastMessageTime)}</Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text 
            style={[
              styles.message,
              conversation.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage}
          </Text>
          
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineBadge: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success[500],
    borderWidth: 2,
    borderColor: colors.white,
    bottom: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-Medium',
    color: colors.gray[900],
  },
  time: {
    ...typography.bodySmall,
    color: colors.gray[500],
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    ...typography.bodyMedium,
    color: colors.gray[600],
    flex: 1,
  },
  unreadMessage: {
    color: colors.gray[900],
    fontFamily: 'Inter-Medium',
  },
  unreadBadge: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  unreadCount: {
    ...typography.labelSmall,
    color: colors.white,
  },
});