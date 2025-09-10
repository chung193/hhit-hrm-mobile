/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { AppThemeProvider } from '@core/ThemeContext';
import Main from './src';
import { GlobalProvider, NetworkProvider } from '@providers'
import './src/i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {

  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <GlobalProvider>
          <NetworkProvider>
            <Main />
          </NetworkProvider>
        </GlobalProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}


export default App;
