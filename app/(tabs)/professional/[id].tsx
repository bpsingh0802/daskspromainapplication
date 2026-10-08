import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Modal, FlatList, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Star, Clock, MapPin, ChevronLeft, MessageSquare, Shield, DollarSign, Calendar, User, Award, CircleCheck as CheckCircle, Phone, Play } from 'lucide-react-native';
import { X, ChevronLeft as ChevronLeftIcon, ChevronRight } from 'lucide-react-native';
import Button from '@/components/common/Button';
import { getProfessionalById, ProfessionalDetail } from '@/lib/professionalApi';

export default function ProfessionalDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [professional, setProfessional] = useState<ProfessionalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showPhone, setShowPhone] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchProfessional();
    }
  }, [id]);

  const fetchProfessional = async () => {
    try {
      setLoading(true);
      const data = await getProfessionalById(id);
      console.log('Professional data received:', data);
      console.log('Portfolio images:', data?.portfolio_images);
      setProfessional(data);
    } catch (error) {
      console.error('Error fetching professional:', error);
      Alert.alert('Error', 'Failed to load professional details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (professional) {
      router.push(`/book-professional/${professional.id}`);
    }
  };

  const handleMessage = () => {
    Alert.alert('Message', 'Messaging feature coming soon!');
  };

  const maskPhoneNumber = (phone: string) => {
    if (!phone) return '';
    // Show first 3 digits and last 2 digits, mask the middle
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 5) {
      const start = cleaned.slice(0, 3);
      const end = cleaned.slice(-2);
      const middle = '*'.repeat(cleaned.length - 5);
      return `${start}${middle}${end}`;
    }
    return phone;
  };

  const handleShowPhone = () => {
    setAdLoading(true);
    
    // Simulate ad loading and display
    Alert.alert(
      'Advertisement',
      'Thank you for viewing our sponsor!\n\n🎯 Special Offer: Get 20% off your first service booking!\n\nUse code: FIRST20',
      [
        {
          text: 'Skip Ad (5s)',
          style: 'cancel',
          onPress: () => {
            setTimeout(() => {
              setAdLoading(false);
              setShowPhone(true);
            }, 2000); // 2 second delay to simulate ad
          }
        },
        {
          text: 'View Offer',
          onPress: () => {
            setTimeout(() => {
              setAdLoading(false);
              setShowPhone(true);
              Alert.alert('Offer Details', 'Visit our website to claim your 20% discount on first booking!');
            }, 1000);
          }
        }
      ]
    );
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImageIndex(null);
  };

  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && professional?.portfolio_images) {
      const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : professional.portfolio_images.length - 1;
      setSelectedImageIndex(newIndex);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && professional?.portfolio_images) {
      const newIndex = selectedImageIndex < professional.portfolio_images.length - 1 ? selectedImageIndex + 1 : 0;
      setSelectedImageIndex(newIndex);
    }
  };

  const renderPortfolioGallery = () => {
    if (!professional?.portfolio_images || professional.portfolio_images.length === 0) {
      return null;
    }

    return (
      <View style={styles.tabContent}>
        <Text style={styles.galleryTitle}>Portfolio Gallery</Text>
        <View style={styles.galleryContainer}>
          {professional.portfolio_images.map((imageUrl, index) => (
            <TouchableOpacity
              key={index}
              style={styles.galleryItem}
              onPress={() => handleImagePress(index)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderImageModal = () => {
    if (!showImageModal || selectedImageIndex === null || !professional?.portfolio_images) {
      return null;
    }

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    return (
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseImageModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseImageModal} style={styles.modalCloseButton}>
              <X size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedImageIndex + 1} of {professional.portfolio_images.length}
            </Text>
          </View>

          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalNavButton}
              onPress={handlePreviousImage}
              disabled={professional.portfolio_images.length <= 1}
            >
              <ChevronLeftIcon size={32} color={colors.white} />
            </TouchableOpacity>

            <Image
              source={{ uri: professional.portfolio_images[selectedImageIndex] }}
              style={[styles.modalImage, { width: screenWidth * 0.8, height: screenHeight * 0.6 }]}
              resizeMode="contain"
            />

            <TouchableOpacity
              style={styles.modalNavButton}
              onPress={handleNextImage}
              disabled={professional.portfolio_images.length <= 1}
            >
              <ChevronRight size={32} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalFooter}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailContainer}
            >
              {professional.portfolio_images.map((imageUrl, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.selectedThumbnail
                  ]}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading professional details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!professional) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Professional not found</Text>
          <Button 
            title="Go Back" 
            variant="primary" 
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.white} />
          </TouchableOpacity>
          
          <Image 
            source={{ uri: professional.avatar }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          
          <View style={styles.headerOverlay}>
            {professional.is_verified && (
              <View style={styles.verifiedBadge}>
                <Shield size={16} color={colors.white} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.content}>
          {/* Professional Info */}
          <View style={styles.profileSection}>
            <View style={styles.nameContainer}>
              <Text style={styles.businessName}>{professional.business_name}</Text>
              <Text style={styles.profession}>{professional.profession}</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
              <Text style={styles.ratingText}>{professional.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({professional.reviews} reviews)</Text>
            </View>
          </View>
          
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MapPin size={18} color={colors.gray[600]} />
              <Text style={styles.statText}>{professional.location}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Clock size={18} color={colors.gray[600]} />
              <Text style={styles.statText}>{professional.years_of_experience} years exp</Text>
            </View>
            
            <View style={styles.statItem}>
              <DollarSign size={18} color={colors.primary[600]} />
              <Text style={styles.priceText}>${professional.hourly_rate}/hour</Text>
            </View>
          </View>
          
          {/* Availability Status */}
          <View style={styles.availabilityContainer}>
            <View style={[
              styles.availabilityDot, 
              { backgroundColor: professional.availability === 'Available' ? colors.success[500] : colors.warning[500] }
            ]} />
            <Text style={styles.availabilityText}>{professional.availability}</Text>
          </View>
          
          {/* Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'about' && styles.activeTab]}
              onPress={() => setActiveTab('about')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'about' && styles.activeTabText
                ]}
              >
                About
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'skills' && styles.activeTab]}
              onPress={() => setActiveTab('skills')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'skills' && styles.activeTabText
                ]}
              >
                Skills
              </Text>
            </TouchableOpacity>
            
            {professional.portfolio_images && professional.portfolio_images.length > 0 && (
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'gallery' && styles.activeTab]}
                onPress={() => setActiveTab('gallery')}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    activeTab === 'gallery' && styles.activeTabText
                  ]}
                >
                  Gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Portfolio Gallery in Highlights */}
          {professional.portfolio_images && professional.portfolio_images.length > 0 && (
            <View style={styles.galleryHighlight}>
              <Text style={styles.galleryHighlightTitle}>Portfolio Gallery</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryHighlightContainer}
              >
                {professional.portfolio_images.slice(0, 4).map((imageUrl, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.galleryHighlightItem}
                    onPress={() => handleImagePress(index)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.galleryHighlightImage}
                      resizeMode="cover"
                        onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
                        onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                    />
                  </TouchableOpacity>
                ))}
                {professional.portfolio_images.length > 4 && (
                  <TouchableOpacity
                    style={styles.galleryHighlightMore}
                    onPress={() => setActiveTab('gallery')}
                  >
                    <Text style={styles.galleryHighlightMoreText}>
                      +{professional.portfolio_images.length - 4}
                    </Text>
                    <Text style={styles.galleryHighlightMoreLabel}>more</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
          
          {/* Tab Content */}
          {activeTab === 'about' ? (
            <View style={styles.tabContent}>
              <Text style={styles.bioTitle}>About {professional.business_name}</Text>
              <Text style={styles.bioText}>
                {professional.bio || 'No description available for this professional.'}
              </Text>
              
              <View style={styles.highlightsContainer}>
                <Text style={styles.highlightsTitle}>Highlights</Text>
                
                {/* Phone Number Section - Always show */}
                <View style={styles.highlightItem}>
                  <Phone size={16} color={colors.primary[600]} />
                  <View style={styles.phoneContainer}>
                    <Text style={styles.highlightText}>
                      {showPhone 
                        ? (professional.contact_number || professional.phone || 'Not available')
                        : maskPhoneNumber(professional.contact_number || professional.phone || '+1234567890')
                      }
                    </Text>
                    {!showPhone && (
                      <TouchableOpacity 
                        style={styles.revealButton}
                        onPress={handleShowPhone}
                        disabled={adLoading}
                      >
                        <Play size={12} color={colors.white} />
                        <Text style={styles.revealButtonText}>
                          {adLoading ? 'Loading...' : 'Reveal'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                
                <View style={styles.highlightItem}>
                  <Award size={16} color={colors.primary[600]} />
                  <Text style={styles.highlightText}>
                    {professional.years_of_experience} years of professional experience
                  </Text>
                </View>
                
                {professional.is_verified && (
                  <View style={styles.highlightItem}>
                    <CheckCircle size={16} color={colors.success[600]} />
                    <Text style={styles.highlightText}>Verified professional</Text>
                  </View>
                )}
                
                <View style={styles.highlightItem}>
                  <Star size={16} color={colors.warning[500]} />
                  <Text style={styles.highlightText}>
                    {professional.rating.toFixed(1)} star rating from {professional.reviews} reviews
                  </Text>
                </View>
              </View>
            </View>
          ) : activeTab === 'skills' ? (
            <View style={styles.tabContent}>
              <Text style={styles.skillsTitle}>Skills & Expertise</Text>
              <View style={styles.tagsContainer}>
                {professional.tags && professional.tags.length > 0 ? (
                  professional.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noSkillsText}>No skills listed</Text>
                )}
              </View>
            </View>
          ) : activeTab === 'gallery' ? (
            renderPortfolioGallery()
          ) : null}
        </View>
      </ScrollView>
      
      {/* Image Modal */}
      {renderImageModal()}
      
      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
          <MessageSquare size={24} color={colors.primary[600]} />
        </TouchableOpacity>
        
        <Button
          title="Book Now"
          variant="primary"
          onPress={handleBookNow}
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    position: 'relative',
    height: 280,
  },
  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: spacing.xs,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[200],
  },
  headerOverlay: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    gap: spacing.xs,
  },
  verifiedText: {
    ...typography.labelSmall,
    color: colors.white,
    fontFamily: 'Inter-Medium',
  },
  content: {
    padding: spacing.md,
  },
  profileSection: {
    marginBottom: spacing.lg,
  },
  nameContainer: {
    marginBottom: spacing.sm,
  },
  businessName: {
    ...typography.headingLarge,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  profession: {
    ...typography.bodyLarge,
    color: colors.primary[600],
    fontFamily: 'Inter-Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    ...typography.bodyMedium,
    color: colors.gray[800],
    fontFamily: 'Inter-Medium',
  },
  reviewCount: {
    ...typography.bodyMedium,
    color: colors.gray[600],
  },
  statsContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statText: {
    ...typography.bodyMedium,
    color: colors.gray[700],
  },
  priceText: {
    ...typography.bodyMedium,
    color: colors.primary[600],
    fontFamily: 'Inter-Medium',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availabilityText: {
    ...typography.bodyMedium,
    color: colors.success[700],
    fontFamily: 'Inter-Medium',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[600],
  },
  tabText: {
    ...typography.labelMedium,
    color: colors.gray[600],
  },
  activeTabText: {
    color: colors.primary[600],
    fontFamily: 'Inter-Medium',
  },
  tabContent: {
    marginBottom: spacing.xl,
  },
  bioTitle: {
    ...typography.headingSmall,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  bioText: {
    ...typography.bodyMedium,
    color: colors.gray[700],
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  newBadge: {
    backgroundColor: colors.secondary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  newBadgeText: {
    ...typography.labelSmall,
    color: colors.secondary[700],
    fontFamily: 'Inter-Medium',
  },
  highlightsContainer: {
    gap: spacing.md,
  },
  highlightsTitle: {
    ...typography.headingSmall,
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  highlightText: {
    ...typography.bodyMedium,
    color: colors.gray[700],
    flex: 1,
  },
  skillsTitle: {
    ...typography.headingSmall,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  tagText: {
    ...typography.bodySmall,
    color: colors.primary[700],
    fontFamily: 'Inter-Medium',
  },
  noSkillsText: {
    ...typography.bodyMedium,
    color: colors.gray[500],
    fontStyle: 'italic',
  },
  phoneContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  revealButtonText: {
    ...typography.labelSmall,
    color: colors.white,
    fontFamily: 'Inter-Medium',
  },
  galleryHighlight: {
    marginTop: spacing.lg,
  },
  galleryHighlightTitle: {
    ...typography.headingSmall,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  galleryHighlightContainer: {
    paddingRight: spacing.md,
    gap: spacing.sm,
  },
  galleryHighlightItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  galleryHighlightImage: {
    width: '100%',
    height: '100%',
  },
  galleryHighlightMore: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.primary[50],
    borderWidth: 2,
    borderColor: colors.primary[200],
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryHighlightMoreText: {
    ...typography.labelLarge,
    color: colors.primary[600],
    fontFamily: 'Inter-Bold',
  },
  galleryHighlightMoreLabel: {
    ...typography.labelSmall,
    color: colors.primary[600],
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
    gap: spacing.md,
  },
  messageButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  bookButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.bodyLarge,
    color: colors.gray[600],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.headingMedium,
    color: colors.gray[800],
    marginBottom: spacing.lg,
  },
  errorButton: {
    width: 200,
  },
  galleryTitle: {
    ...typography.headingSmall,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    zIndex: 10,
  },
  modalCloseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: spacing.sm,
  },
  modalTitle: {
    ...typography.bodyMedium,
    color: colors.white,
    fontFamily: 'Inter-Medium',
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  modalNavButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: spacing.sm,
    marginHorizontal: spacing.md,
  },
  modalImage: {
    borderRadius: 8,
  },
  modalFooter: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  thumbnailContainer: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: colors.primary[500],
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  debugText: {
    ...typography.bodySmall,
    color: colors.error[600],
    marginBottom: spacing.xs,
    fontFamily: 'Inter-Medium',
  },
});