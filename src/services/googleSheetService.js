const GOOGLE_SHEET_API_URL = import.meta.env.VITE_GOOGLE_SHEET_API_URL;

export async function saveRegistrationToGoogleSheet(registration) {
  if (!GOOGLE_SHEET_API_URL) {
    throw new Error('Google Sheet API URL is missing.');
  }

  const payload = {
    ...registration,
    team_members: Array.isArray(registration.team_members)
      ? JSON.stringify(registration.team_members)
      : registration.team_members || '',
    payment_screenshot: ''
  };

  const response = await fetch(GOOGLE_SHEET_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  });

  return response;
}