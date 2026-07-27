import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from './supabase';
import type { Settings } from './types';

const DEFAULT_SETTINGS: Settings = {
  id: 1,
  website_name: 'ZK AI Studio',
  logo_url: '',
  hero_title:
    'Professional AI Website Development & UK TikTok Accounts',
  hero_subtitle:
    'Build modern websites and buy premium UK TikTok accounts for your online business.',
  whatsapp_number: '03439541210',
  email: 'uzaid1080@gmail.com',
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  footer_text: '© ZK AI Studio. All rights reserved.',
  primary_color: '#10b981',
  about_text:
    'ZK AI Studio builds modern, AI-powered websites and supplies premium UK TikTok accounts to help businesses grow online.',
  created_at: '',
};

interface SettingsContextValue {
  settings: Settings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refresh: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (!error && data) setSettings(data as Settings);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
