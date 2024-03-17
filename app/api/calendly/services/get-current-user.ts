export const getCurrentUser = async (accessToken: string) => {
  const response = await fetch('https://api.calendly.com/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.json();
};
