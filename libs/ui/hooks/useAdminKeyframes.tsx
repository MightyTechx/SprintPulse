import GlobalStyles from '@mui/material/GlobalStyles';

/**
 * Returns a <GlobalStyles> element that injects the shared `um-*` CSS keyframes
 * used across admin pages. Render the returned element once at the top of your
 * component tree (e.g. alongside the loading guard).
 */
export const useAdminKeyframes = () => {
  return (
    <GlobalStyles
      styles={`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.75); }
        }
      `}
    />
  );
};
