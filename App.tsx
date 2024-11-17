import React from 'react';
import Navigations from './app/navigations/Navigations';
import { PaperProvider } from 'react-native-paper';
import theme from './app/settings/Theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Navigations/>
    </PaperProvider>
  );
}
