import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Switch,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import SecurityIcon from '@mui/icons-material/Security';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PaletteIcon from '@mui/icons-material/Palette';
import PreviewIcon from '@mui/icons-material/Preview';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PageHeader } from '@infygen/component';
import { useStyles } from './styles/Settings.styles';
import { useThemeContext } from '@infygen/theme';
import { getUserPreferences, updateUserTheme } from '../../../services/index';

// ── Tab Config ────────────────────────────────────────────────────────────────
interface TabConfig {
  label: string;
  icon: React.ReactElement;
  description: string;
}

const TABS: TabConfig[] = [
  {
    label: 'General',
    icon: <SettingsIcon fontSize='small' />,
    description: 'Platform preferences & settings',
  },
  {
    label: 'Security',
    icon: <SecurityIcon fontSize='small' />,
    description: 'Authentication & access control',
  },
  {
    label: 'Admin Controls',
    icon: <TuneIcon fontSize='small' />,
    description: 'System configuration & preferences',
  },
  {
    label: 'Notifications',
    icon: <NotificationsActiveIcon fontSize='small' />,
    description: 'Alert & notification preferences',
  },
];

// ── Theme Configs ─────────────────────────────────────────────────────────────
// These IDs must match the theme names in themePalettes.ts
interface ThemeConfig {
  id: string;
  name: string;
  swatch: string;
  accent: string;
  light: string;
  sidebar: string;
  header: string;
  button: string;
  buttonText: string;
}

// Theme IDs map to names in libs/theme/themePalettes.ts
const THEMES: ThemeConfig[] = [
  {
    id: 'System',
    name: 'Default Admin',
    swatch: 'linear-gradient(135deg, #0d1b3e, #1a3a6b)',
    accent: '#6366f1',
    light: '#a5b4fc',
    sidebar: '#0d1b3e',
    header: '#0f2355',
    button: '#6366f1',
    buttonText: '#fff',
  },
  {
    id: 'Cobalt',
    name: 'Cobalt Blue',
    swatch: 'linear-gradient(135deg, #312e81, #4f46e5)',
    accent: '#4f46e5',
    light: '#eef2ff',
    sidebar: '#312e81',
    header: '#3730a3',
    button: '#4f46e5',
    buttonText: '#fff',
  },
  {
    id: 'Midnight',
    name: 'Midnight Purple',
    swatch: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
    accent: '#7c3aed',
    light: '#ede9fe',
    sidebar: '#1e1b4b',
    header: '#3730a3',
    button: '#7c3aed',
    buttonText: '#fff',
  },
  {
    id: 'Rose',
    name: 'Rose Pink',
    swatch: 'linear-gradient(135deg, #881337, #f43f5e)',
    accent: '#f43f5e',
    light: '#ffe4e6',
    sidebar: '#881337',
    header: '#be123c',
    button: '#f43f5e',
    buttonText: '#fff',
  },
  {
    id: 'Forest',
    name: 'Forest Green',
    swatch: 'linear-gradient(135deg, #064e3b, #059669)',
    accent: '#059669',
    light: '#d1fae5',
    sidebar: '#064e3b',
    header: '#065f46',
    button: '#059669',
    buttonText: '#fff',
  },
  {
    id: 'Blues',
    name: 'Sky Blues',
    swatch: 'linear-gradient(135deg, #0369a1, #38bdf8)',
    accent: '#0284c7',
    light: '#e0f2fe',
    sidebar: '#0369a1',
    header: '#0284c7',
    button: '#0284c7',
    buttonText: '#fff',
  },
  {
    id: 'Clean',
    name: 'Clean Sky',
    swatch: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
    accent: '#0ea5e9',
    light: '#e0f2fe',
    sidebar: '#0369a1',
    header: '#0284c7',
    button: '#0ea5e9',
    buttonText: '#fff',
  },
  {
    id: 'Black and White',
    name: 'Dark Charcoal',
    swatch: 'linear-gradient(135deg, #111827, #374151)',
    accent: '#374151',
    light: '#f3f4f6',
    sidebar: '#111827',
    header: '#1f2937',
    button: '#374151',
    buttonText: '#fff',
  },
  {
    id: 'Blimey',
    name: 'Amber Gold',
    swatch: 'linear-gradient(135deg, #92400e, #d97706)',
    accent: '#d97706',
    light: '#fef3c7',
    sidebar: '#92400e',
    header: '#b45309',
    button: '#d97706',
    buttonText: '#fff',
  },
];

// ── Mini App Preview ─────────────────────────────────────────────────────────
const AppPreview = ({
  theme,
  classes,
}: {
  theme: ThemeConfig;
  classes: Record<string, string>;
}) => (
  <Box className={classes.appPreviewWrapper}>
    <Box className={classes.browserChrome}>
      {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
        <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
      ))}
      <Box className={classes.browserUrlBar} />
    </Box>
    <Box className={classes.appLayout}>
      <Box
        sx={{
          width: 82,
          background: `linear-gradient(180deg, ${theme.sidebar} 0%, ${theme.accent}cc 100%)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          p: 1.25,
          pt: 1.75,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 18,
            borderRadius: 1.5,
            background: 'rgba(255,255,255,0.22)',
            mb: 1.5,
          }}
        />
        {[true, false, false, false, false].map((active, i) => (
          <Box
            key={i}
            sx={{
              width: '100%',
              height: 22,
              borderRadius: 1.5,
              background: active ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 0.75,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: 0.75,
                flexShrink: 0,
                background: active ? theme.accent : 'rgba(255,255,255,0.4)',
              }}
            />
            <Box
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 0.5,
                background: active ? `${theme.accent}90` : 'rgba(255,255,255,0.25)',
              }}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            height: 38,
            background: theme.header,
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            gap: 1,
          }}
        >
          <Box
            sx={{ flex: 1, height: 10, borderRadius: 1, background: 'rgba(255,255,255,0.28)' }}
          />
          {[0, 1].map((i) => (
            <Box
              key={i}
              sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.22)',
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 1.25,
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.85,
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {[
              { bg: theme.accent, bar1: 'rgba(255,255,255,0.75)', bar2: 'rgba(255,255,255,0.4)' },
              { bg: `${theme.accent}1a`, bar1: `${theme.accent}80`, bar2: `${theme.accent}40` },
              { bg: theme.light, bar1: `${theme.accent}60`, bar2: `${theme.accent}30` },
            ].map((card, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: 42,
                  borderRadius: 1.75,
                  background: card.bg,
                  border: `1px solid ${theme.accent}18`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: 0.85,
                  gap: 0.4,
                }}
              >
                <Box sx={{ width: '65%', height: 5, borderRadius: 0.5, background: card.bar1 }} />
                <Box sx={{ width: '40%', height: 3.5, borderRadius: 0.5, background: card.bar2 }} />
              </Box>
            ))}
          </Box>
          {[0.85, 0.65, 0.45].map((op, i) => (
            <Box
              key={i}
              sx={{
                width: '100%',
                height: 13,
                borderRadius: 1,
                background: `rgba(226,232,240,${op})`,
              }}
            />
          ))}
          <Box sx={{ display: 'flex', gap: 0.75, mt: 'auto', pt: 0.25 }}>
            <Box
              sx={{
                height: 22,
                px: 1.25,
                borderRadius: 1.25,
                background: theme.button,
                display: 'flex',
                alignItems: 'center',
                boxShadow: `0 2px 8px ${theme.accent}35`,
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 5,
                  borderRadius: 0.5,
                  background:
                    theme.buttonText === '#fff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.65)',
                }}
              />
            </Box>
            <Box
              sx={{
                height: 22,
                px: 1.25,
                borderRadius: 1.25,
                border: `1.5px solid ${theme.accent}`,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{ width: 22, height: 5, borderRadius: 0.5, background: `${theme.accent}70` }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

// ── General Tab ───────────────────────────────────────────────────────────────
const GeneralTab = ({ classes }: { classes: Record<string, string> }) => (
  <Box>
    <Box className={classes.sectionPanel}>
      <Box className={classes.sectionPanelHeader}>
        <Box className={classes.sectionPanelTitle}>
          <Box
            className={classes.sectionPanelIcon}
            sx={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
            }}
          >
            <SettingsIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Box>
            <Typography className={classes.sectionPanelTitleText}>Platform Settings</Typography>
            <Typography className={classes.sectionPanelSubtitle}>
              Basic platform configuration
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className={classes.sectionPanelBody}>
        <Box className={classes.settingRowList}>
          {[
            {
              title: 'Platform Name',
              desc: 'The name displayed across the admin panel and emails.',
              value: 'SprintPulse Admin',
            },
            {
              title: 'Support Email',
              desc: 'Contact email shown to users for support queries.',
              value: 'support@infygen.in',
            },
            {
              title: 'Default Timezone',
              desc: 'Timezone applied to all timestamps in the system.',
              value: 'Asia/Kolkata (IST)',
            },
            {
              title: 'Default Language',
              desc: 'Primary language for the admin interface.',
              value: 'English (en-IN)',
            },
          ].map((item, i) => (
            <Box key={i} className={classes.settingRow}>
              <Box flex={1}>
                <Typography fontWeight={600} fontSize='0.9rem'>
                  {item.title}
                </Typography>
                <Typography fontSize='0.8rem' color='text.secondary' mt={0.3}>
                  {item.desc}
                </Typography>
              </Box>
              <Typography className={classes.settingValue}>{item.value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>

    <Box className={classes.sectionPanel} sx={{ mt: 3 }}>
      <Box className={classes.sectionPanelHeader}>
        <Box className={classes.sectionPanelTitle}>
          <Box
            className={classes.sectionPanelIcon}
            sx={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)' }}
          >
            <VisibilityIcon sx={{ fontSize: 18, color: '#06b6d4' }} />
          </Box>
          <Box>
            <Typography className={classes.sectionPanelTitleText}>Display Preferences</Typography>
            <Typography className={classes.sectionPanelSubtitle}>
              UI display and navigation settings
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className={classes.sectionPanelBody}>
        <Box className={classes.settingRowList}>
          {[
            {
              icon: <DarkModeIcon sx={{ color: '#6366f1' }} />,
              title: 'Compact View Mode',
              desc: 'Show more data in less space',
              color: '#6366f1',
            },
            {
              icon: <LightModeIcon sx={{ color: '#f59e0b' }} />,
              title: 'Show Animations',
              desc: 'Enable smooth transitions and effects',
              color: '#f59e0b',
            },
          ].map((item, i) => {
            return (
              <Box key={i} className={classes.configItem}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: `${item.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  onChange={() => {}}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4f46e5',
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  </Box>
);

// ── Security Tab ──────────────────────────────────────────────────────────────
const SecurityTab = ({ classes }: { classes: Record<string, string> }) => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [loginAttempts, setLoginAttempts] = useState('5');
  const [pwExpiry, setPwExpiry] = useState('90');

  return (
    <Box>
      <Box className={classes.sectionPanel}>
        <Box className={classes.sectionPanelHeader}>
          <Box className={classes.sectionPanelTitle}>
            <Box
              className={classes.sectionPanelIcon}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
              }}
            >
              <SecurityIcon sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Box>
              <Typography className={classes.sectionPanelTitleText}>Authentication</Typography>
              <Typography className={classes.sectionPanelSubtitle}>
                Security and access settings
              </Typography>
            </Box>
          </Box>
          <Box className={classes.statusIndicator}>
            <Box
              className={classes.statusDot}
              sx={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }}
            />
            <Typography className={classes.statusText}>Protected</Typography>
          </Box>
        </Box>
        <Box className={classes.sectionPanelBody}>
          <Box className={classes.settingRowList}>
            <Box className={`${classes.configItem} ${twoFactor ? classes.configItemActive : ''}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: twoFactor ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SecurityIcon sx={{ color: twoFactor ? '#10b981' : '#8b5cf6', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Two-Factor Authentication
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Require 2FA for all admin accounts
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>
            <Box className={classes.configItem}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'rgba(6,182,212,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SecurityIcon sx={{ color: '#06b6d4', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Session Timeout
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Auto logout after inactivity
                  </Typography>
                </Box>
              </Box>
              <FormControl size='small' sx={{ minWidth: 140 }}>
                <Select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value as string)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value='15'>15 min</MenuItem>
                  <MenuItem value='30'>30 min</MenuItem>
                  <MenuItem value='60'>1 hour</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className={classes.infoBox} sx={{ mt: 3 }}>
        <Box className={classes.infoBoxIcon}>
          <InfoOutlinedIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
        </Box>
        <Box className={classes.infoBoxContent}>
          <Typography className={classes.infoBoxTitle}>Security Best Practices</Typography>
          <Typography className={classes.infoBoxText}>
            Enable Two-Factor Authentication for enhanced security. Review audit logs regularly to
            track system changes.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// ── Admin Controls Tab (Theme Selection + Live Preview) ─────────────────────
const AdminControlsTab = ({ classes }: { classes: Record<string, string> }) => {
  const { themeName, setThemeName } = useThemeContext();
  const [selectedTheme, setSelectedTheme] = useState(themeName || 'Cobalt');
  const [livePreview, setLivePreview] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await getUserPreferences();
        if (prefs.theme) {
          setSelectedTheme(prefs.theme);
          setThemeName(prefs.theme);
        }
      } catch (error) {
        // Use localStorage fallback if API fails
        const savedTheme = localStorage.getItem('serivceops_selected_theme');
        if (savedTheme) {
          setSelectedTheme(savedTheme);
        }
      }
    };
    loadPreferences();
  }, [setThemeName]);

  // Sync with context
  useEffect(() => {
    setSelectedTheme(themeName || 'Cobalt');
  }, [themeName]);

  const handleThemeSelect = useCallback(
    async (themeId: string) => {
      setSelectedTheme(themeId);
      setThemeName(themeId);

      if (autoSave) {
        setIsLoading(true);
        try {
          await updateUserTheme(themeId);
        } catch (error) {
          // Silently fail - localStorage already saved the theme
          console.log('Theme saved locally');
        } finally {
          setIsLoading(false);
        }
      }
    },
    [autoSave, setThemeName],
  );

  const currentTheme = THEMES.find((t) => t.id === selectedTheme) || THEMES[0];

  return (
    <Box>
      {/* Preview Controls */}
      <Box className={classes.sectionPanel}>
        <Box className={classes.sectionPanelHeader}>
          <Box className={classes.sectionPanelTitle}>
            <Box
              className={classes.sectionPanelIcon}
              sx={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
                boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
              }}
            >
              <PreviewIcon sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Box>
              <Typography className={classes.sectionPanelTitleText}>Live Preview</Typography>
              <Typography className={classes.sectionPanelSubtitle}>
                See how your dashboard looks in real-time
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={currentTheme.name}
              size='small'
              sx={{
                background: `${currentTheme.accent}15`,
                color: currentTheme.accent,
                border: `1px solid ${currentTheme.accent}30`,
                fontWeight: 700,
                fontSize: '0.72rem',
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                Enable Preview
              </Typography>
              <Switch
                checked={livePreview}
                onChange={(e) => setLivePreview(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box className={classes.sectionPanelBody}>
          {livePreview ? (
            <Box
              sx={{
                border: '2px solid rgba(79,70,229,0.2)',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(79,70,229,0.15)',
              }}
            >
              <AppPreview theme={currentTheme} classes={classes} />
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4, background: '#f8fafc', borderRadius: 2 }}>
              <Typography sx={{ color: 'text.secondary' }}>
                Enable preview to see theme changes
              </Typography>
            </Box>
          )}

          {/* Color Palette */}
          <Typography className={classes.colorPaletteLabel}>Color Palette</Typography>
          <Box className={classes.colorPaletteRow}>
            {[
              { label: 'Primary', color: currentTheme.accent },
              { label: 'Button', color: currentTheme.button },
              { label: 'Sidebar', color: currentTheme.sidebar },
              { label: 'Header', color: currentTheme.header },
            ].map(({ label, color }) => (
              <Box key={label} className={classes.colorSwatch}>
                <Box
                  className={classes.colorSwatchDot}
                  sx={{ background: color, boxShadow: `0 2px 8px ${color}45` }}
                />
                <Box>
                  <Typography className={classes.colorSwatchLabel}>{label}</Typography>
                  <Typography className={classes.colorSwatchHex}>{color}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Theme Selection Grid */}
      <Box className={classes.sectionPanel} sx={{ mt: 3 }}>
        <Box className={classes.sectionPanelHeader}>
          <Box className={classes.sectionPanelTitle}>
            <Box
              className={classes.sectionPanelIcon}
              sx={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <PaletteIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
            </Box>
            <Box>
              <Typography className={classes.sectionPanelTitleText}>Theme Selection</Typography>
              <Typography className={classes.sectionPanelSubtitle}>
                Choose a color scheme for the dashboard
              </Typography>
            </Box>
          </Box>
          {autoSave && (
            <Box className={classes.panelAutoSave}>
              <CloudDoneIcon sx={{ fontSize: '0.9rem', color: '#10b981' }} />
              <Typography fontSize='0.68rem' color='text.secondary'>
                Auto-saved
              </Typography>
            </Box>
          )}
        </Box>
        <Box className={classes.sectionPanelBody}>
          <Box className={classes.themeGrid}>
            {THEMES.map((theme) => {
              const isSelected = selectedTheme === theme.id;
              return (
                <Box
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`${classes.themeOption} ${isSelected ? classes.themeOptionSelected : ''}`}
                >
                  <Box className={classes.themePreview} sx={{ background: theme.light }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '40%',
                        background: `linear-gradient(135deg, ${theme.sidebar}, ${theme.accent})`,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 8,
                        right: 8,
                        height: 16,
                        borderRadius: 1,
                        background: '#fff',
                        border: '1px solid rgba(0,0,0,0.08)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        right: 8,
                        height: 12,
                        borderRadius: 1,
                        background: '#fff',
                        border: '1px solid rgba(0,0,0,0.05)',
                      }}
                    />
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: theme.accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircleIcon sx={{ color: '#fff', fontSize: 12 }} />
                      </Box>
                    )}
                  </Box>
                  <Box className={classes.themeInfo}>
                    <Typography className={classes.themeName}>{theme.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: theme.accent,
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: theme.button,
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: theme.sidebar,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Display Options */}
      <Box className={classes.sectionPanel} sx={{ mt: 3 }}>
        <Box className={classes.sectionPanelHeader}>
          <Box className={classes.sectionPanelTitle}>
            <Box
              className={classes.sectionPanelIcon}
              sx={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <TuneIcon sx={{ fontSize: 18, color: '#6366f1' }} />
            </Box>
            <Box>
              <Typography className={classes.sectionPanelTitleText}>Display Options</Typography>
              <Typography className={classes.sectionPanelSubtitle}>
                Customize your viewing experience
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className={classes.sectionPanelBody}>
          <Box className={classes.settingRowList}>
            <Box className={`${classes.configItem} ${darkMode ? classes.configItemActive : ''}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: darkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DarkModeIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Dark Mode</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Use dark theme for the interface
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>
            <Box className={`${classes.configItem} ${compactView ? classes.configItemActive : ''}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: compactView ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VisibilityIcon sx={{ color: '#10b981', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Compact View
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Show more data in less space
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={compactView}
                onChange={(e) => setCompactView(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>
            <Box className={`${classes.configItem} ${autoSave ? classes.configItemActive : ''}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: autoSave ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CloudDoneIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Auto-save Theme
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Automatically save theme changes
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ── Notifications Tab ─────────────────────────────────────────────────────────
const NotificationsTab = ({ classes }: { classes: Record<string, string> }) => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  return (
    <Box>
      <Box className={classes.sectionPanel}>
        <Box className={classes.sectionPanelHeader}>
          <Box className={classes.sectionPanelTitle}>
            <Box
              className={classes.sectionPanelIcon}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              }}
            >
              <NotificationsActiveIcon sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Box>
              <Typography className={classes.sectionPanelTitleText}>
                Notification Channels
              </Typography>
              <Typography className={classes.sectionPanelSubtitle}>
                Configure how you receive alerts
              </Typography>
            </Box>
          </Box>
          <Box className={classes.statusIndicator}>
            <Box
              className={classes.statusDot}
              sx={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }}
            />
            <Typography className={classes.statusText}>Enabled</Typography>
          </Box>
        </Box>
        <Box className={classes.sectionPanelBody}>
          <Box className={classes.settingRowList}>
            <Box className={`${classes.configItem} ${emailNotif ? classes.configItemActive : ''}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: emailNotif ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NotificationsActiveIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Email Notifications
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Receive alerts via email
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>

            <Box className={`${classes.configItem} ${pushNotif ? classes.configItemActive : ''}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: pushNotif ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NotificationsActiveIcon sx={{ color: '#06b6d4', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Push Notifications
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Browser and mobile app alerts
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={pushNotif}
                onChange={(e) => setPushNotif(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>

            <Box className={`${classes.configItem} ${smsNotif ? classes.configItemActive : ''}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: smsNotif ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NotificationsActiveIcon sx={{ color: '#10b981', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    SMS Notifications
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Text message alerts
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={smsNotif}
                onChange={(e) => setSmsNotif(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>

            <Box
              className={`${classes.configItem} ${criticalOnly ? classes.configItemActive : ''}`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: criticalOnly ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NotificationsActiveIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Critical Alerts Only
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Only notify for critical events
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={criticalOnly}
                onChange={(e) => setCriticalOnly(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className={classes.sectionPanel} sx={{ mt: 3 }}>
        <Box className={classes.sectionPanelHeader}>
          <Box className={classes.sectionPanelTitle}>
            <Box
              className={classes.sectionPanelIcon}
              sx={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <SettingsIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
            </Box>
            <Box>
              <Typography className={classes.sectionPanelTitleText}>Report Scheduling</Typography>
              <Typography className={classes.sectionPanelSubtitle}>
                Automated performance reports
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className={classes.sectionPanelBody}>
          <Box className={classes.settingRowList}>
            <Box className={`${classes.configItem} ${dailyDigest ? classes.configItemActive : ''}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: dailyDigest ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NotificationsActiveIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Daily Digest
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Daily summary at 8:00 AM
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={dailyDigest}
                onChange={(e) => setDailyDigest(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>

            <Box
              className={`${classes.configItem} ${weeklyReport ? classes.configItemActive : ''}`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: weeklyReport ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NotificationsActiveIcon sx={{ color: '#10b981', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Weekly Report
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Monday morning analysis
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={weeklyReport}
                onChange={(e) => setWeeklyReport(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ── Main Settings Page ────────────────────────────────────────────────────────
const Settings = () => {
  const { classes } = useStyles();
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box className={classes.container}>
      {/* ── Page Header ── */}
      <PageHeader
        title='Settings & Preferences'
        description='Configure system settings, themes, notifications and security preferences for your dashboard'
        icon={SettingsIcon}
        variant='admin'
      />

      {/* ── Tab Bar ── */}
      <Box className={classes.tabBar}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} className={classes.tabs}>
          {TABS.map((tab) => (
            <Tab
              key={tab.label}
              icon={tab.icon}
              iconPosition='start'
              label={tab.label}
              sx={{ minWidth: { md: 'auto' }, px: { md: 2.5 } }}
            />
          ))}
        </Tabs>
      </Box>

      {/* ── Tab Content ── */}
      {tabValue === 0 && <GeneralTab classes={classes} />}
      {tabValue === 1 && <SecurityTab classes={classes} />}
      {tabValue === 2 && <AdminControlsTab classes={classes} />}
      {tabValue === 3 && <NotificationsTab classes={classes} />}

      {/* ── Save Button (Floating) ── */}
      <Box
        sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', gap: 1.5, zIndex: 1000 }}
      >
        <Button
          variant='outlined'
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          Reset
        </Button>
        <Button
          variant='contained'
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
