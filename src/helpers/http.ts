export const getAuthorizationHeader = (token: string): Record<string, string> => ({
  Authorization: `Bearer ${token}`
});
