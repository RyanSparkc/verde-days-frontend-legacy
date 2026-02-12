import { adminClient } from './client';

const TOKEN_COOKIE = 'verdeAdminToken';
const LEGACY_TOKEN_COOKIE = 'hexToken';

const readCookie = (name) => {
  return document.cookie.replace(
    new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*=\\s*([^;]*).*$)|^.*$`),
    '$1',
  );
};

const expireCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const getAdminToken = () => {
  return readCookie(TOKEN_COOKIE) || readCookie(LEGACY_TOKEN_COOKIE);
};

export const setAdminToken = ({ token, expired }) => {
  if (!token) return;

  const expires = expired ? new Date(expired).toUTCString() : undefined;
  if (expires) {
    document.cookie = `${TOKEN_COOKIE}=${token}; expires=${expires}; path=/;`;
  } else {
    document.cookie = `${TOKEN_COOKIE}=${token}; path=/;`;
  }
};

export const clearAdminToken = () => {
  expireCookie(TOKEN_COOKIE);
  expireCookie(LEGACY_TOKEN_COOKIE);
};

export const applyAdminToken = (token) => {
  if (token) {
    adminClient.defaults.headers.common.Authorization = token;
    return;
  }
  delete adminClient.defaults.headers.common.Authorization;
};
