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

function App() {

  return (
    <AppThemeProvider>
      <GlobalProvider>
        <NetworkProvider>
          <Main />
        </NetworkProvider>
      </GlobalProvider>
    </AppThemeProvider>
  );
}


export default App;
