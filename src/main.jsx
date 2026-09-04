import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/themContext.jsx'
import  { Toaster } from 'react-hot-toast'
import "./style.css"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
       <Toaster />
      <App />
     </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
