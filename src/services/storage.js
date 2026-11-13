import { DEFAULT_BANNERS, DEFAULT_VILLAS, DEFAULT_SETTINGS, DEFAULT_REGIONS, DEFAULT_ARTICLES } from '../data/initialData';

const KEY_BANNERS = 'SEKALA_BANNERS';
const KEY_VILLAS = 'SEKALA_VILLAS';
const KEY_SETTINGS = 'SEKALA_SETTINGS';
const KEY_REGIONS = 'SEKALA_REGIONS';
const KEY_ARTICLES = 'SEKALA_ARTICLES';
const KEY_AUTH = 'SEKALA_ADMIN_AUTH';

export const storage = {
  getBanners: () => {
    try {
      const raw = localStorage.getItem(KEY_BANNERS);
      return raw ? JSON.parse(raw) : DEFAULT_BANNERS;
    } catch {
      return DEFAULT_BANNERS;
    }
  },
  saveBanners: (data) => {
    localStorage.setItem(KEY_BANNERS, JSON.stringify(data));
  },

  getVillas: () => {
    try {
      const raw = localStorage.getItem(KEY_VILLAS);
      return raw ? JSON.parse(raw) : DEFAULT_VILLAS;
    } catch {
      return DEFAULT_VILLAS;
    }
  },
  saveVillas: (data) => {
    localStorage.setItem(KEY_VILLAS, JSON.stringify(data));
  },

  getRegions: () => {
    try {
      const raw = localStorage.getItem(KEY_REGIONS);
      return raw ? JSON.parse(raw) : DEFAULT_REGIONS;
    } catch {
      return DEFAULT_REGIONS;
    }
  },
  saveRegions: (data) => {
    localStorage.setItem(KEY_REGIONS, JSON.stringify(data));
  },

  getArticles: () => {
    try {
      const raw = localStorage.getItem(KEY_ARTICLES);
      return raw ? JSON.parse(raw) : DEFAULT_ARTICLES;
    } catch {
      return DEFAULT_ARTICLES;
    }
  },
  saveArticles: (data) => {
    localStorage.setItem(KEY_ARTICLES, JSON.stringify(data));
  },

  getSettings: () => {
    try {
      const raw = localStorage.getItem(KEY_SETTINGS);
      return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  saveSettings: (data) => {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(data));
  },

  isAuth: () => localStorage.getItem(KEY_AUTH) === 'true',
  setAuth: (val) => localStorage.setItem(KEY_AUTH, val ? 'true' : 'false')
};
