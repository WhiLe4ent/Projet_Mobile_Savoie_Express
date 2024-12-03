import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '200',
    },
  },
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#006CFF',
    accent: '#FF9500',
    background: '#F9F9F9',
    surface: '#FFFFFF',
    text: '#1C1C1E',
    disabled: '#A0A0A0',
    placeholder: '#C7C7CD',
    backdrop: '#00000066',
    fontConfig: fontConfig,
  },
  roundness: 8,
};

export default theme;
