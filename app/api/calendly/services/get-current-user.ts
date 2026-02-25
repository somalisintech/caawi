export const getCurrentUser = async (accessToken: string) => {
  const response = await fetch('https://api.calendly.com/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Calendly get current user failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
