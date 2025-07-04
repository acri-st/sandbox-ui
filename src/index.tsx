import React from 'react'
import ReactDOM from 'react-dom/client';
overrideLogerConfig({ global: { logLevel: 'debug' } })
axiosSetup()
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux';
import { AuthProvider, axiosSetup, overrideLogerConfig } from '@desp-aas/desp-ui-fwk';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Provider>,
)
