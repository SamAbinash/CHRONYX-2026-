const GOOGLE_SHEET_API_URL = import.meta.env.VITE_GOOGLE_SHEET_API_URL;

async function parseGoogleSheetResponse(response) {
  if (!response.ok) {
    throw new Error(`Google Sheet API responded with status ${response.status}`);
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse Google Apps Script response:', text);
    throw new Error('Invalid JSON response received from Google Apps Script backend.');
  }
}

/**
 * Save registration to Google Sheet.
 */
export async function saveRegistrationToGoogleSheet(registration) {
  if (!GOOGLE_SHEET_API_URL) {
    throw new Error('Google Sheet API URL is missing.');
  }

  const { registration_id: _ignoredId, ...registrationData } = registration || {};

  const payload = {
    action: 'register',
    ...registrationData,
    team_members: Array.isArray(registration?.team_members)
      ? JSON.stringify(registration.team_members)
      : registration?.team_members || '',
    payment_screenshot: ''
  };

  const response = await fetch(GOOGLE_SHEET_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  });

  return await parseGoogleSheetResponse(response);
}

/**
 * Retrieve all registrations from Google Sheet.
 * Used by Check Status and Organizer Dashboard.
 */
export async function getRegistrationsFromGoogleSheet() {
  if (!GOOGLE_SHEET_API_URL) {
    throw new Error('Google Sheet API URL is missing.');
  }

  const response = await fetch(GOOGLE_SHEET_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({
      action: 'get_registrations'
    })
  });

  return await parseGoogleSheetResponse(response);
}

/**
 * Find one registration by Registration ID from live Google Sheet data.
 */
export async function getRegistrationStatusFromGoogleSheet(registrationId) {
  const cleanId = String(registrationId || '').trim().toUpperCase();

  if (!cleanId) {
    return null;
  }

  const result = await getRegistrationsFromGoogleSheet();

  if (!result || !result.success || !Array.isArray(result.registrations)) {
    return null;
  }

  const found = result.registrations.find((record) => {
    const id = String(
      record.registration_id || ''
    ).trim().toUpperCase();

    return id === cleanId;
  });

  if (!found) {
    return null;
  }

  return found;
}
/**
 * Update registration status in Google Sheet.
 */
export async function updateRegistrationStatusInGoogleSheet(
  registrationId,
  status,
  remarks = ''
) {
  if (!GOOGLE_SHEET_API_URL) {
    throw new Error('Google Sheet API URL is missing.');
  }

  const cleanId = String(registrationId || '').trim().toUpperCase();

  if (!cleanId) {
    throw new Error('Registration ID is required.');
  }

  if (!status) {
    throw new Error('Registration status is required.');
  }

  const response = await fetch(GOOGLE_SHEET_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({
      action: 'update_status',
      registration_id: cleanId,
      status: status,
      remarks: remarks || ''
    })
  });

  return await parseGoogleSheetResponse(response);
}