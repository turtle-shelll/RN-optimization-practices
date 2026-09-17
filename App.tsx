import React, { Suspense, useState, useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, Modal, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getLinkingConfig } from './myAssetsLinking';
import ErrorBoundary from './src/components/ErrorBoundary';

// 1. Lazy load all our screens!
// This acts as logical "bundle splitting". The JS Engine will literally skip 
// over these files and NOT evaluate them into memory until the user taps the tab.
const HeavyScreen = React.lazy(() => import('./src/screens/HeavyScreen'));
const SecondScreen = React.lazy(() => import('./src/screens/SecondScreen'));
const ThirdScreen = React.lazy(() => import('./src/screens/ThirdScreen'));
const FourthScreen = React.lazy(() => import('./src/screens/FourthScreen'));
const FifthScreen = React.lazy(() => import('./src/screens/FifthScreen'));

const Tab = createBottomTabNavigator();

// 2. Fallback UI shown while JS is evaluating the lazy screen
const ScreenFallback = () => (
  <View style={styles.fallbackContainer}>
    <ActivityIndicator size="large" color="#3b82f6" />
  </View>
);

export default function App() {
  // 1. State for handling intercepted deep links
  const [pendingDeepLink, setPendingDeepLink] = useState<{url: string, listener: any} | null>(null);

  // 2. Wrap getLinkingConfig in useMemo so it doesn't re-create the config every render
  const linking = useMemo(() => {
    return getLinkingConfig((url, listener) => {
      console.log("Deep link intercepted inside App.tsx!", url);
      setPendingDeepLink({ url, listener });
    });
  }, []);

  // 3. Handlers for the Modal
  const handleApprove = () => {
    if (pendingDeepLink) {
      // Proceed to the requested URL
      pendingDeepLink.listener(pendingDeepLink.url);
      setPendingDeepLink(null);
    }
  };

  const handleDecline = () => {
    if (pendingDeepLink) {
      // Dump them to Tab 2 instead!
      pendingDeepLink.listener('myfirstapp://second');
      setPendingDeepLink(null);
    }
  };

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <NavigationContainer linking={linking}>
          <Tab.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#0f172a' },
              headerTintColor: '#fff',
              tabBarStyle: { backgroundColor: '#1e293b', borderTopColor: '#334155' },
              tabBarActiveTintColor: '#3b82f6',
              tabBarInactiveTintColor: '#64748b',
            }}
          >

            <Tab.Screen name="Tab2" options={{ title: 'Tab 2' }}>
              {() => (
                <Suspense fallback={<ScreenFallback />}>
                  <SecondScreen />
                </Suspense>
              )}
            </Tab.Screen>

            <Tab.Screen name="Tab3" options={{ title: 'Tab 3' }}>
              {() => (
                <Suspense fallback={<ScreenFallback />}>
                  <ThirdScreen />
                </Suspense>
              )}
            </Tab.Screen>

            {/* 3. Wrap the lazy component inside a function returning Suspense */}
            <Tab.Screen name="Heavy" options={{ title: 'Heavy Test' }}>
              {() => (
                <Suspense fallback={<ScreenFallback />}>
                  <HeavyScreen />
                </Suspense>
              )}
            </Tab.Screen>

            <Tab.Screen name="Tab4" options={{ title: 'Tab 4' }}>
              {() => (
                <Suspense fallback={<ScreenFallback />}>
                  <FourthScreen />
                </Suspense>
              )}
            </Tab.Screen>

            <Tab.Screen name="Tab5" options={{ title: 'Tab 5' }}>
              {() => (
                <Suspense fallback={<ScreenFallback />}>
                  <FifthScreen />
                </Suspense>
              )}
            </Tab.Screen>

          </Tab.Navigator>
        </NavigationContainer>

        {/* 4. Deep Link Interceptor Modal */}
        <Modal
          visible={!!pendingDeepLink}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Authentication Required</Text>
              <Text style={styles.modalText}>
                You clicked a deep link! Do you want to approve this action?
                {'\n\n'}Requested URL: {pendingDeepLink?.url}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0f172a',
  },
  modalText: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  approveButton: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
