export const getAccessToken  = () => localStorage.getItem("nf_access_token");
export const getRefreshToken = () => localStorage.getItem("nf_refresh_token");

export const saveTokens = (access, refresh) => {
  localStorage.setItem("nf_access_token",  access);
  localStorage.setItem("nf_refresh_token", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("nf_access_token");
  localStorage.removeItem("nf_refresh_token");
};