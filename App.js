import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { withAuthenticator, } from '@aws-amplify/ui-react-native';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { PaperProvider } from 'react-native-paper';
import BuyPointsScreen from './src/screens/BuyPointsScreen/BuyPointsScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

Amplify.configure(awsconfig);

const App = ()=> {
  return (
    <PaperProvider>
    <NavigationContainer>
    <DrawerNavigator/>
    </NavigationContainer>
    </PaperProvider>
  );
};
// glpat-tgTmDTyof6xJyceWVo-R
export default withAuthenticator(App); 