import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import React from 'react';
import {disableReactDevTools} from "@fvilers/disable-react-devtools"

//redux func
  // import { Provider } from 'react-redux'
  // import {legacy_createStore as createStore} from "redux"
  // import allReducers from "./redux/reducers/allReducers"


//able to preserve state of rendered data (no need to fetch API over and over again)
  import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
  const queryClient = new QueryClient()

// importing Clerk API key & its ref
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  import { ClerkProvider } from '@clerk/clerk-react'

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


if (process.env.NODE_ENC === "production") disableReactDevTools()
// //globalizes variables
// const store =createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__&& window.__REDUX_DEVTOOLS_EXTENSION__())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
)
