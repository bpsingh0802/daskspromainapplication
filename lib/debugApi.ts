import { getAllProfessionals } from './professionalApi';

export async function getAllProfessionalIds(): Promise<{ id: string; business_name: string; profession: string }[]> {
  return await getAllProfessionals();
}

export async function debugProfessionalData() {
  try {
    // Get all professionals using the API
    const professionals = await getAllProfessionals();
    console.log('=== DEBUG: Professional Data ===');
    console.log('Total professionals found:', professionals.length);
    
    professionals.forEach((prof, index) => {
      console.log(`${index + 1}. ID: ${prof.id}, Name: ${prof.business_name}, Profession: ${prof.profession}`);
    });
    
    if (professionals.length > 0) {
      console.log('=== Sample Professional IDs for Testing ===');
      console.log('You can test these URLs:');
      professionals.slice(0, 3).forEach((prof, index) => {
        console.log(`${index + 1}. /professional/${prof.id} - ${prof.business_name}`);
      });
    }
    
    return professionals;
  } catch (error) {
    console.error('Error in debugProfessionalData:', error);
    return [];
  }
}