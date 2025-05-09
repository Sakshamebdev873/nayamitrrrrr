import "./App.css";
// number animation

import { createBrowserRouter, RouterProvider } from "react-router";

import { Layout } from "./components/Layout.jsx";
import { Home } from "./components/Home.jsx";
// import { About } from './components/About.jsx'
import { StateInfoSection } from "./components/About.jsx";
import { Contact } from "./components/Contact.jsx";
import { CyberSection } from "./components/CyberSection.jsx";
import { ErrorHandler } from "./components/ErrorHandler.jsx";
import { LegalAssistant } from "./components/LegalAssistant.jsx";
import { Dashboard } from "./components/Dashboard.jsx";
import LogIn from "./pages/LogIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Chat from "./pages/Chat.jsx";
import { action as signAction } from "./pages/SignUp.jsx";
import { action as loginAction } from "./pages/LogIn.jsx";
import { action as chatAction,loader as chatLoader } from "./pages/Chat.jsx";
import PdfReader from "./components/PdfReader.jsx";
// import { Auth0Provider } from '@auth0/auth0-react'
// import { Contact } from './components/Contact.jsx'
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorHandler />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "lawforstate",
          element: <StateInfoSection />,
        },
        {
          path: "cybersection",
          element: <CyberSection />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "analyst",
          element: <PdfReader />,
        },
        {
          path: "legalAssistance",
          element: <LegalAssistant />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "login",
          element: <LogIn />,
          action: loginAction,
        },
        {
          path: "signup",
          element: <SignUp />,
          action: signAction,
        },
      ],
    },

    {
      path: "/chat/:id",
      element: <Chat />,
      action: chatAction,
      loader : chatLoader
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
