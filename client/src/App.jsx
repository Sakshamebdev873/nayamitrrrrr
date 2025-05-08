import './App.css'
// number animation

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
 import LogIn from './pages/LogIn.jsx'
 import SignUp from './pages/SignUp.jsx'
import Chat from './pages/Chat.jsx'
 // import { Auth0Provider } from '@auth0/auth0-react'
 // import { Contact } from './components/Contact.jsx'
 function App() {
  
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
   {
     path : 'login',
     element : <LogIn/>
   },
   {
     path : 'signup',
     element : <SignUp/>
   },
   {
    path : 'chat',
    element : <Chat/>
   }
 ]
 }])
  
  return <RouterProvider router={router} />
}

export default App
