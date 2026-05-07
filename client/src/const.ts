export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// URL base do seu servidor no Railway
const API_BASE_URL = window.location.origin;

/**
 * URL de login principal. 
 * Alterada para apontar para o SEU servidor, removendo a dependência da api.manus.im
 */
export const getLoginUrl = () => {
  // Redireciona para a rota de autenticação do seu próprio backend
  return `${API_BASE_URL}/api/oauth/github`;
};

// GitHub OAuth login URL - Aponta para o seu backend processar
export const getGitHubLoginUrl = () => {
  return `${API_BASE_URL}/api/oauth/github`;
};

// Google OAuth login URL - Aponta para o seu backend processar
export const getGoogleLoginUrl = () => {
  return `${API_BASE_URL}/api/oauth/google`;
};
