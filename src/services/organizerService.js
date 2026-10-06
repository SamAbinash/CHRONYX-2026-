/**
 * Organizer Service (Protected)
 *
 * Organizer authentication remains local,
 * while registration data and status updates use
 * the live Google Apps Script / Google Sheet backend.
 */

import {
  STATUS_VALUES
} from './registrationService.js';

import {
  getRegistrationsFromGoogleSheet,
  updateRegistrationStatusInGoogleSheet
} from './googleSheetService.js';

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
 * Fetch full registration records from Google Sheet.
 */
export async function getProtectedRegistrations(key) {
  if (!verifyOrganizerKey(key)) {
    throw new Error('Access Denied: Invalid Organizer Access Key.');
  }

  const result = await getRegistrationsFromGoogleSheet();

  if (!result || !result.success) {
    throw new Error(
      result?.message || 'Failed to load registrations from Google Sheet.'
    );
  }

  return Array.isArray(result.registrations)
    ? result.registrations
    : [];
}

/**
 * Update registration status in Google Sheet.
 */
export async function setProtectedRegistrationStatus(
  registrationId,
  newStatus,
  remarks,
  key
) {
  if (!verifyOrganizerKey(key)) {
    throw new Error('Access Denied: Invalid Organizer Access Key.');
  }

  const result = await updateRegistrationStatusInGoogleSheet(
    registrationId,
    newStatus,
    remarks
  );

  if (!result || !result.success) {
    throw new Error(
      result?.message || 'Failed to update registration status.'
    );
  }

  return result;
}

/**
 * Retrieve uploaded payment screenshot.
 *
 * Screenshots are currently stored locally in IndexedDB.
 */
export async function getProtectedScreenshot(registrationId, key) {
  if (!verifyOrganizerKey(key)) {
    throw new Error('Access Denied: Invalid Organizer Access Key.');
  }

  return await idbGetScreenshot(registrationId);
}

/**
 * Export registrations.
 *
 * For now, this uses the live Google Sheet data and generates
 * the CSV in the browser.
 */
export async function exportProtectedCSV(key) {
  if (!verifyOrganizerKey(key)) {
    throw new Error('Access Denied: Invalid Organizer Access Key.');
  }

  const registrations = await getProtectedRegistrations(key);

  if (!registrations.length) {
    throw new Error('No registrations available to export.');
  }

  const headers = Object.keys(registrations[0]);

  const escapeCSV = (value) => {
    const text = String(value ?? '');

    if (
      text.includes(',') ||
      text.includes('"') ||
      text.includes('\n') ||
      text.includes('\r')
    ) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  };

  const csvRows = [
    headers.join(','),
    ...registrations.map((record) =>
      headers.map((header) => escapeCSV(record[header])).join(',')
    )
  ];

  const csvContent = csvRows.join('\r\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `CHRONYX-2026-Registrations-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export { STATUS_VALUES };