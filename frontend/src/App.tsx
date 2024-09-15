import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Auth0Provider } from 'react-native-auth0';
import { MMKV } from 'react-native-mmkv';

import { ThemeProvider } from '@/theme';

import ApplicationNavigator from './navigators/Application';
import './translations';
import MapSheetProvider from './context/MapSheetContext';
import UserProvider from './context/UserContext';
import OutingProvider from './context/OutingContext';
import LocationProvider from './context/LocationContext';
import { minutes } from './helpers/dates';

export const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    staleTime: 10 * minutes,
  },
});

export const storage = new MMKV();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storage={storage}>
        <Auth0Provider
          domain={process.env.AUTH0_DOMAIN ?? ''}
          clientId={process.env.AUTH0_CLIENT_ID ?? ''}
        >
          <UserProvider storage={storage}>
            <LocationProvider storage={storage}>
              <OutingProvider storage={storage}>
                <MapSheetProvider storage={storage}>
                  <ApplicationNavigator />
                </MapSheetProvider>
              </OutingProvider>
            </LocationProvider>
          </UserProvider>
        </Auth0Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
