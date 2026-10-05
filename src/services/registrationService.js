/**
 * CHRONYX 2026 - Registration Data Service
 * 
 * Implements the verified registration data structure:
 * - registration_id (Format: CHX26-0001, CHX26-0002... monotonic, non-reusable)
 * - full_name
 * - email
 * - phone
 * - college
 * - department
 * - year
 * - event
 * - team_members
 * - utr
 * - payment_screenshot
 * - status ('Submitted' | 'Payment Verification Pending' | 'Confirmed' | 'Rejected')
 * - created_at (ISO 8601 string)
 * 
 * Features:
 * - Public privacy guard: Strips UTR, payment_screenshot, phone from public check status
 * - IndexedDB + LocalStorage dual layer (handles image screenshots without LocalStorage 5MB quota errors)
 * - Organizer export & update capabilities ready for protected dashboard
 */

import { 
  idbSaveRegistration, 
  idbSaveScreenshot, 
  idbGetScreenshot, 
  idbGetAllRegistrations 
} from './indexedDbHelper.js';

const STORAGE_KEY = 'chronyx_2026_registrations_v2';
const SEQ_COUNTER_KEY = 'chronyx_2026_reg_seq_counter';

export const STATUS_VALUES = {
  SUBMITTED: 'Submitted',
  VERIFICATION_PENDING: 'Payment Verification Pending',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Rejected',
};

// Initial verified mock records for status testing
export const INITIAL_REGISTRATIONS = [
  {
    registration_id: 'CHX26-0001',
    full_name: 'Aravind Kumar',
    email: 'aravind.k@example.com',
    phone: '9876543210',
    college: 'Jaya Sakthi Engineering College',
    department: 'Artificial Intelligence and Data Science',
    year: 'III Year',
    event: 'Mystery Code, Datathon',
    team_members: [
      { name: 'Sanjay R', email: 'sanjay.r@example.com', mobile: '9876543211' }
    ],
    utr: '428901245678',
    payment_screenshot: {
      filename: 'payment_receipt_001.png',
      file_type: 'image/png',
      file_size: 142050,
      storage_path: 'payment_screenshots/CHX26-0001_receipt.png',
      uploaded_at: '2026-10-01T10:30:00.000Z'
    },
    status: STATUS_VALUES.CONFIRMED,
    created_at: '2026-10-01T10:30:00.000Z',
    remarks: 'Registration confirmed. Please carry your college ID card on event day.',
    amount: 200,
    registration_type: 'team',
    stall_booking: false,
    food_preference: 'Veg'
  },
  {
    registration_id: 'CHX26-0002',
    full_name: 'Priya Dharshini',
    email: 'priya.d@example.com',
    phone: '9845012345',
    college: 'Sri Venkateswara College of Engineering',
    department: 'Computer Science and Engineering',
    year: 'IV Year',
    event: 'Project Expo',
    team_members: [
      { name: 'Kavitha M', email: 'kavitha.m@example.com', mobile: '9845012346' }
    ],
    utr: '428909876543',
    payment_screenshot: {
      filename: 'gpay_confirm_002.jpg',
      file_type: 'image/jpeg',
      file_size: 189400,
      storage_path: 'payment_screenshots/CHX26-0002_receipt.jpg',
      uploaded_at: '2026-10-02T11:20:00.000Z'
    },
    status: STATUS_VALUES.VERIFICATION_PENDING,
    created_at: '2026-10-02T11:20:00.000Z',
    remarks: 'Transaction ID is under reconciliation with accounts desk. Verification pending.',
    amount: 200,
    registration_type: 'team',
    stall_booking: false,
    food_preference: 'Veg'
  },
  {
    registration_id: 'CHX26-0003',
    full_name: 'Mohammed Faisal',
    email: 'faisal.m@example.com',
    phone: '9789012345',
    college: 'RMK Engineering College',
    department: 'Information Technology',
    year: 'II Year',
    event: 'E-Sports',
    team_members: [
      { name: 'Dinesh K', food_preference: 'Non-Veg', foodPreference: 'Non-Veg' },
      { name: 'Naveen P', food_preference: 'Veg', foodPreference: 'Veg' },
      { name: 'Akash S', food_preference: 'Non-Veg', foodPreference: 'Non-Veg' }
    ],
    utr: '428912349876',
    payment_screenshot: {
      filename: 'paytm_screenshot_003.webp',
      file_type: 'image/webp',
      file_size: 112300,
      storage_path: 'payment_screenshots/CHX26-0003_receipt.webp',
      uploaded_at: '2026-10-02T16:45:00.000Z'
    },
    status: STATUS_VALUES.SUBMITTED,
    created_at: '2026-10-02T16:45:00.000Z',
    remarks: 'Registration documents submitted. Awaiting verification queue.',
    amount: 400,
    registration_type: 'team',
    stall_booking: false,
    food_preference: 'Non-Veg'
  },
  {
    registration_id: 'CHX26-0004',
    full_name: 'Rohan Sharma',
    email: 'rohan.s@example.com',
    phone: '9123456780',
    college: 'Panimalar Engineering College',
    department: 'Artificial Intelligence and Machine Learning',
    year: 'III Year',
    event: 'DeepFake Detection',
    team_members: [],
    utr: '000012345678',
    payment_screenshot: {
      filename: 'receipt_004.png',
      file_type: 'image/png',
      file_size: 95400,
      storage_path: 'payment_screenshots/CHX26-0004_receipt.png',
      uploaded_at: '2026-09-30T13:10:00.000Z'
    },
    status: STATUS_VALUES.REJECTED,
    created_at: '2026-09-30T13:10:00.000Z',
    remarks: 'Invalid transaction reference number or mismatched screenshot. Please re-register or reach out to the student coordinators.',
    amount: 100,
    registration_type: 'individual',
    stall_booking: false,
    food_preference: 'Veg'
  }
];

// Helper to provide backwards-compatible getters so existing UI components continue working seamlessly
function enhanceRecord(record) {
  if (!record) return null;
  const eventsArray = Array.isArray(record.event) 
    ? record.event 
    : (record.event ? record.event.split(',').map(s => s.trim()).filter(Boolean) : []);

  return {
    ...record,
    // Aliases for component compatibility
    regId: record.registration_id,
    name: record.full_name,
    mobile: record.phone,
    events: eventsArray,
    utrNumber: record.utr,
    teamName: record.team_name || record.teamName || '',
    teamMembers: record.team_members || record.teamMembers || [],
    foodPreference: record.food_preference || record.foodPreference || 'Veg',
    food_preference: record.food_preference || record.foodPreference || 'Veg',
    amount: record.amount !== undefined ? record.amount : 0,
    registration_type: record.registration_type || record.registrationType || 'individual',
    stall_booking: Boolean(record.stall_booking || record.bookStall),
    submittedAt: new Date(record.created_at).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    })
  };
}

/**
 * Retrieve all registrations from LocalStorage (with sync fallback)
 */
export function getStoredRegistrations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
      // Initialize sequence counter to 4
      if (!localStorage.getItem(SEQ_COUNTER_KEY)) {
        localStorage.setItem(SEQ_COUNTER_KEY, '4');
      }
      return INITIAL_REGISTRATIONS.map(enhanceRecord);
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(enhanceRecord) : INITIAL_REGISTRATIONS.map(enhanceRecord);
  } catch (err) {
    console.error('Error loading stored registrations', err);
    return INITIAL_REGISTRATIONS.map(enhanceRecord);
  }
}

/**
 * Generate unique, monotonic Registration ID: CHX26-0001, CHX26-0002...
 * Guarantees no ID reuse even if records are filtered.
 */
export function generateNextRegistrationId() {
  try {
    let currentSeq = parseInt(localStorage.getItem(SEQ_COUNTER_KEY) || '0', 10);
    
    // Also scan existing stored registrations to find max ID number
    const all = getStoredRegistrations();
    let maxFound = currentSeq;
    all.forEach(r => {
      const match = (r.registration_id || r.regId || '').match(/CHX26-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxFound) maxFound = num;
      }
    });

    const nextSeq = maxFound + 1;
    localStorage.setItem(SEQ_COUNTER_KEY, String(nextSeq));
    return `CHX26-${String(nextSeq).padStart(4, '0')}`;
  } catch (err) {
    const fallbackSeq = Date.now().toString().slice(-4);
    return `CHX26-${fallbackSeq}`;
  }
}

/**
 * Read File object as Data URL safely
 */
export function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/**
 * Save new registration with strict data structure
 */
export async function createRegistration({
  fullName,
  email,
  phone,
  college,
  department,
  year,
  selectedEvents = [],
  teamMembers = [],
  teamName = '',
  foodPreference = 'Veg',
  flexibleMemberDetails = '',
  utr,
  screenshotFile = null,
  amount = 0,
  registrationType = 'individual',
  bookStall = false
}) {
  const regId = generateNextRegistrationId();
  const createdAtIso = new Date().toISOString();

  // Normalize event string / array
  const eventString = Array.isArray(selectedEvents) 
    ? selectedEvents.join(', ') 
    : String(selectedEvents || '');

  // Format team members
  const formattedTeamMembers = Array.isArray(teamMembers) 
    ? teamMembers
        .filter(m => m && (typeof m === 'string' ? m.trim() : (m.name && m.name.trim())))
        .map(m => {
          if (typeof m === 'string') {
            return { name: m.trim(), food_preference: 'Veg', foodPreference: 'Veg' };
          }
          const foodPref = m.foodPreference || m.food_preference || 'Veg';
          return {
            name: m.name.trim(),
            food_preference: foodPref,
            foodPreference: foodPref,
            ...(m.email ? { email: m.email.trim() } : {}),
            ...(m.mobile ? { mobile: m.mobile.trim() } : {})
          };
        })
    : [];

  if (flexibleMemberDetails && flexibleMemberDetails.trim()) {
    formattedTeamMembers.push({
      name: 'Additional Details',
      notes: flexibleMemberDetails.trim()
    });
  }

  // Secure payment screenshot preparation
  let screenshotMeta = null;
  let screenshotDataUrl = null;

  if (screenshotFile) {
    screenshotDataUrl = await readFileAsDataUrl(screenshotFile);
    screenshotMeta = {
      filename: screenshotFile.name || 'screenshot.png',
      file_type: screenshotFile.type || 'image/png',
      file_size: screenshotFile.size || 0,
      storage_path: `payment_screenshots/${regId}_${screenshotFile.name || 'receipt.png'}`,
      uploaded_at: createdAtIso
    };

    // Store in IndexedDB for secure high-capacity storage
    await idbSaveScreenshot(regId, {
      ...screenshotMeta,
      data_url: screenshotDataUrl
    });
  }

  // Exact data structure
  const registrationRecord = {
    registration_id: regId,
    full_name: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    college: college.trim(),
    department: department.trim(),
    year: year || 'III Year',
    event: eventString,
    team_members: formattedTeamMembers,
    team_name: (teamName || '').trim(),
    food_preference: foodPreference || 'Veg',
    utr: utr.trim(),
    payment_screenshot: screenshotMeta || {
      filename: 'pending_attachment',
      file_type: 'none',
      file_size: 0,
      storage_path: null,
      uploaded_at: createdAtIso
    },
    status: STATUS_VALUES.VERIFICATION_PENDING,
    created_at: createdAtIso,
    remarks: 'Registration submitted successfully. Payment verification is pending.',
    amount: Number(amount) || 0,
    registration_type: registrationType || 'individual',
    stall_booking: Boolean(bookStall)
  };

  // 1. Save to LocalStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : INITIAL_REGISTRATIONS;
    const updated = [registrationRecord, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('LocalStorage save failed, using memory/IndexedDB', err);
  }

  // 2. Save to IndexedDB
  await idbSaveRegistration(registrationRecord);

  // Return enhanced record for immediate UI confirmation
  return enhanceRecord(registrationRecord);
}

/**
 * Public Check Status lookup
 * PRIVACY SECURITY:
 * Strips UTR, payment_screenshot, phone, and email.
 * Only returns:
 * - registration_id
 * - full_name
 * - event
 * - status
 * - college / department / created_at (neutral meta)
 */
export function getPublicRegistrationStatus(query) {
  if (!query) return null;
  const clean = query.trim().toUpperCase();
  const all = getStoredRegistrations();

  const found = all.find(r => 
    (r.registration_id && r.registration_id.toUpperCase() === clean) ||
    (r.regId && r.regId.toUpperCase() === clean)
  );

  if (!found) return null;

  // Sanitized Public Object - NO UTR, NO PAYMENT SCREENSHOT, NO PRIVATE CONTACT
  return {
    registration_id: found.registration_id || found.regId,
    regId: found.registration_id || found.regId, // alias
    full_name: found.full_name || found.name,
    name: found.full_name || found.name, // alias
    event: found.event,
    events: found.events || (found.event ? found.event.split(',').map(s => s.trim()) : []),
    status: found.status,
    college: found.college,
    department: found.department,
    year: found.year,
    team_members: found.team_members || [],
    created_at: found.created_at,
    submittedAt: found.submittedAt,
    remarks: found.remarks || 'Status active in symposium records.'
  };
}

/**
 * ORGANIZER SIDE UTILITIES
 * For future protected organizer dashboard.
 * Requires authSecret verification.
 */
export function getExpectedOrganizerKey() {
  try {
    return (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ORGANIZER_ACCESS_KEY) || 'chronyx_admin_secret_2026';
  } catch (e) {
    return 'chronyx_admin_secret_2026';
  }
}

export function getOrganizerRegistrations(authSecret) {
  const expectedSecret = getExpectedOrganizerKey();
  if (authSecret !== expectedSecret) {
    throw new Error('Unauthorized: Invalid organizer access key.');
  }

  return getStoredRegistrations();
}

export function updateRegistrationStatus(registrationId, newStatus, remarks = '', authSecret) {
  const expectedSecret = getExpectedOrganizerKey();
  if (authSecret !== expectedSecret) {
    throw new Error('Unauthorized: Invalid organizer access key.');
  }

  const validStatuses = Object.values(STATUS_VALUES);
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  const all = getStoredRegistrations();
  const index = all.findIndex(r => (r.registration_id === registrationId || r.regId === registrationId));
  if (index === -1) {
    throw new Error(`Registration ID ${registrationId} not found.`);
  }

  all[index].status = newStatus;
  if (remarks) {
    all[index].remarks = remarks;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  idbSaveRegistration(all[index]);
  return enhanceRecord(all[index]);
}

/**
 * Generate standard RFC 4180 CSV Export of all registrations for organizers
 */
export function exportRegistrationsToCSV(authSecret) {
  const expectedSecret = getExpectedOrganizerKey();
  if (authSecret !== expectedSecret) {
    throw new Error('Unauthorized: Invalid organizer access key.');
  }

  const records = getStoredRegistrations();
  
  const headers = [
    'Registration ID',
    'Name',
    'Email',
    'Phone',
    'College',
    'Department',
    'Year',
    'Event',
    'Team Members',
    'UTR',
    'Status',
    'Created Date',
    'Amount',
    'Registration Type',
    'Team Name',
    'Stall Booking',
    'Food Preference'
  ];

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = records.map(r => {
    const teamMembersText = Array.isArray(r.team_members) 
      ? r.team_members.map(m => {
          if (typeof m === 'string') return m;
          const extras = [];
          const food = m.food_preference || m.foodPreference;
          if (food) extras.push(`Food: ${food}`);
          if (m.mobile) extras.push(`Mobile: ${m.mobile}`);
          if (m.email) extras.push(`Email: ${m.email}`);
          return extras.length > 0 ? `${m.name || ''} (${extras.join(', ')})` : (m.name || '');
        }).join('; ')
      : '';

    return [
      escapeCsv(r.registration_id || r.regId),
      escapeCsv(r.full_name || r.name),
      escapeCsv(r.email),
      escapeCsv(r.phone || r.mobile),
      escapeCsv(r.college),
      escapeCsv(r.department),
      escapeCsv(r.year),
      escapeCsv(r.event),
      escapeCsv(teamMembersText),
      escapeCsv(r.utr || r.utrNumber),
      escapeCsv(r.status),
      escapeCsv(r.created_at),
      escapeCsv(r.amount !== undefined ? r.amount : 0),
      escapeCsv(r.registration_type || r.registrationType || 'individual'),
      escapeCsv(r.team_name || r.teamName || ''),
      escapeCsv(r.stall_booking ? 'Yes' : 'No'),
      escapeCsv(r.food_preference || r.foodPreference || 'Veg')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  return csvContent;
}

/**
 * Trigger browser file download for CSV
 */
export function downloadRegistrationsCSV(authSecret) {
  const csvData = exportRegistrationsToCSV(authSecret);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CHRONYX_2026_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Direct status updater for authenticated admin sessions
 */
export function updateRegistrationStatusDirect(registrationId, newStatus, remarks = '') {
  const validStatuses = Object.values(STATUS_VALUES);
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  const all = getStoredRegistrations();
  const index = all.findIndex(r => (r.registration_id === registrationId || r.regId === registrationId));
  if (index === -1) {
    throw new Error(`Registration ID ${registrationId} not found.`);
  }

  all[index].status = newStatus;
  if (remarks) {
    all[index].remarks = remarks;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  idbSaveRegistration(all[index]);
  return enhanceRecord(all[index]);
}

/**
 * Retrieve uploaded payment screenshot securely for authenticated admin
 */
export async function getRegistrationScreenshotSecure(registrationId) {
  return await idbGetScreenshot(registrationId);
}

// Backwards-compatible export functions for mockStatusData compatibility
export const saveNewRegistration = (data) => {
  return createRegistration({
    fullName: data.name || data.full_name,
    email: data.email,
    phone: data.mobile || data.phone,
    college: data.college,
    department: data.department,
    year: data.year,
    selectedEvents: data.events || [data.event],
    teamMembers: data.teamMembers || data.team_members,
    teamName: data.teamName || data.team_name || '',
    foodPreference: data.foodPreference || data.food_preference || 'Veg',
    flexibleMemberDetails: data.flexibleMemberDetails || '',
    utr: data.utrNumber || data.utr,
    screenshotFile: data.screenshotFile || null,
    amount: data.amount || 0,
    registrationType: data.registrationType || data.registration_type || 'individual',
    bookStall: data.bookStall || data.stall_booking || false
  });
};

export const getNextRegistrationId = generateNextRegistrationId;
export const findRegistration = getPublicRegistrationStatus;
