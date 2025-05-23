import "./App.css";
// number animation

import { createBrowserRouter, RouterProvider } from "react-router";

import { Layout } from "./components/Layout.jsx";
import {Constitution} from './components/Constitution.jsx'
import { Home } from "./components/Home.jsx";
// import { About } from './components/About.jsx'
import { StateInfoSection } from "./components/About.jsx";
import { Contact } from "./components/Contact.jsx";
import { CyberSection } from "./components/CyberSection.jsx";
import { ErrorHandler } from "./components/ErrorHandler.jsx";
import LegalAssistant from "./components/LegalAssistant.jsx";
import { action as GenerateAction } from "./components/LegalAssistant.jsx";
import { Dashboard } from "./components/Dashboard.jsx";
import LogIn from "./pages/LogIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Chat from "./pages/Chat.jsx";
import { action as signAction } from "./pages/SignUp.jsx";
import { action as loginAction } from "./pages/LogIn.jsx";
import { action as chatAction, loader as chatLoader } from "./pages/Chat.jsx";
import { loader as historyLoader } from "./pages/History.jsx";
import PdfReader from "./components/PdfReader.jsx";
import SafetyHub from "./components/SafetyHub.jsx";
import Survey from "./components/Survey.jsx";
import History from "./pages/History.jsx";
import CaseHelper from "./pages/CaseHelper.jsx";
import { action as caseAction } from "./pages/CaseHelper.jsx";
import CaseHistory from "./pages/caseHistory.jsx";
import {loader as loaderHistory} from './pages/caseHistory.jsx'
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
          path: "root",
          element: <Constitution />,
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
          action: GenerateAction,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "survey",
          element: <Survey />,
        },
        {
          path: "safetyhub",
          element: <SafetyHub />,
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
        {
          path: "history/:id",
          element: <History />,
          loader: historyLoader,
        },{
          path : 'caseHistory/:id',
          element : <CaseHistory/>,
          loader : loaderHistory,
        },
        {
          path: "caseHelper/:id",
          element: <CaseHelper />,
          action: caseAction,
        },
      ],
    },

    {
      path: "/chat/:id",
      element: <Chat />,
      action: chatAction,
      loader: chatLoader,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
