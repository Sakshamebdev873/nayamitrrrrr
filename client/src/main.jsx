import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { Layout } from './components/Layout.jsx'
import { Home } from './components/Home.jsx'
// import { About } from './components/About.jsx'
import { StateInfoSection } from './components/About.jsx'
import { Contact } from './components/Contact.jsx'
import { CyberSection } from './components/CyberSection.jsx'
import { ErrorHandler } from './components/ErrorHandler.jsx'
import { LegalAssistant } from './components/LegalAssistant.jsx'
import{ Dashboard} from './components/Dashboard.jsx'

import { Auth0Provider } from '@auth0/auth0-react'
// import { Contact } from './components/Contact.jsx'
const router = createBrowserRouter([{
  path:'/',
  element:<Layout/>,
  errorElement:<ErrorHandler/>,
  children:[
    {
    path:'',
    element:<Home/>
  },
    {
    path:'lawforstate',
    element:<StateInfoSection/>
  },
    {
    path:'cybersection',
    element:<CyberSection/>
  },
    {
    path:'contact',
    element:<Contact/>
  },
    {
    path:'legalAssistance',
    element:<LegalAssistant/>
  },
    {
    path:'dashboard',
    element:<Dashboard/>
  },
]
}])



createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-1s3xbux7bjgukotd.us.auth0.com"
    clientId="d7YBGujwM8YPQdLJvaM0MSsa5WFpyzY2"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
  <RouterProvider router={router}> 
  <StrictMode>
    <App />
  </StrictMode>
  </RouterProvider>
  </Auth0Provider>
)
