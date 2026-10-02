/**
 * Organizer Service (Protected)
 * 
 * Provides administrative data access, status updates, screenshot retrieval,
 * and RFC 4180 CSV export.
 * Protected by organizer access key from environment variables (VITE_ORGANIZER_ACCESS_KEY).
 */

import { 
  getStoredRegistrations, 
  updateRegistrationStatus as updateStatusInDb, 
  exportRegistrationsToCSV,
  downloadRegistrationsCSV,
  STATUS_VALUES
} from './registrationService.js';
import { idbGetScreenshot } from './indexedDbHelper.js';

const DEFAULT_SECRET = 'chronyx_admin_secret_2026';

export function getExpectedOrganizerKey() {
  return import.meta.env.VITE_ORGANIZER_ACCESS_KEY || DEFAULT_SECRET;
}

export function verifyOrganizerKey(providedKey) {
  if (!providedKey) return false;
  return providedKey.trim() === getExpectedOrganizerKey().trim();
}

/**
 * Fetch full registration records including UTR, phone, and email
 */
export function getProtectedRegistrations(key) {
  if (!verifyOrganizerKey(key)) {
    throw new Error('Access Denied: Invalid Organizer Access Key.');
  }
  return getStoredRegistrations();
}

/**
 * Update status of a specific registration
 */
export function setProtectedRegistrationStatus(registrationId, newStatus, remarks, key) {
  if (!verifyOrganizerKey(key)) {
    throw new Error('Access Denied: Invalid Organizer Access Key.');
  }
  return updateStatusInDb(registrationId, newStatus, remarks, key);
}

/**
 * Retrieve uploaded payment screenshot for a registration
 */
export async function getProtectedScreenshot(registrationId, key) {
  if (!verifyOrganizerKey(key)) {
    throw new Error('Access Denied: Invalid Organizer Access Key.');
  }
  return await idbGetScreenshot(registrationId);
}

/**
 * Export registrations to CSV
 */
export function exportProtectedCSV(key) {
  if (!verifyOrganizerKey(key)) {
    throw new Error('Access Denied: Invalid Organizer Access Key.');
  }
  downloadRegistrationsCSV(key);
}

export { STATUS_VALUES };
