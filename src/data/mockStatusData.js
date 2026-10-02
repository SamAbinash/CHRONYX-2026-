/**
 * Bridge file: Re-exports registration service functions
 * Ensures backwards compatibility while using the real registration data structure.
 */

export { 
  INITIAL_REGISTRATIONS as INITIAL_MOCK_REGISTRATIONS,
  getStoredRegistrations,
  generateNextRegistrationId as getNextRegistrationId,
  createRegistration,
  saveNewRegistration,
  getPublicRegistrationStatus as findRegistration,
  getOrganizerRegistrations,
  updateRegistrationStatus,
  exportRegistrationsToCSV,
  downloadRegistrationsCSV,
  STATUS_VALUES
} from '../services/registrationService';
