import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import store from './src/store'
import Navigation from './src/navigation'
import { LogBox } from 'react-native'
import ErrorBoundary from './src/components/ErrorBoundary';
import NotificationBootstrap from './src/components/NotificationBootstrap';

LogBox.ignoreAllLogs()

const App = () => {

  const requestAllPermissions = async () => {
    try {
      console.log('App starting - permissions disabled temporarily');
      // Permissions temporarily disabled for debugging
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  useEffect(() => {
    console.log('App.tsx useEffect - initializing');
    requestAllPermissions();
  }, [])

  console.log('App.tsx rendering - store initialized');
  
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <NotificationBootstrap />
        <Navigation />
      </Provider>
    </ErrorBoundary>
  )
}

export default App
