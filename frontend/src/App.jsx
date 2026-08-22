import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Symptoms from "./pages/Symptoms";
import Reports from "./pages/Reports";
import Medicines from "./pages/Medicines";
import Prescription from "./pages/Prescription";
import History from "./pages/History";
import Profile from "./pages/Profile";

import { AuthProvider } from "./context/AuthContext";


function AppLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div
      className="
        min-h-screen
        w-full
        bg-[#e9e9e7]
        p-2
        sm:p-3
        lg:p-4
      "
    >

      {/* ================================================= */}
      {/* MAIN APPLICATION SHELL */}
      {/* ================================================= */}

      <div
        className="
          w-full
          min-h-[calc(100vh-16px)]
          sm:min-h-[calc(100vh-24px)]
          lg:min-h-[calc(100vh-32px)]

          bg-[#f7f7f5]

          rounded-[24px]
          lg:rounded-[28px]

          overflow-hidden

          border
          border-white

          shadow-[0_8px_35px_rgba(0,0,0,0.07)]

          flex
          flex-col
        "
      >

        {/* ================================================= */}
        {/* TOP HEADER */}
        {/* ================================================= */}

        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />


        {/* ================================================= */}
        {/* APPLICATION BODY */}
        {/* ================================================= */}

        <div
          className="
            flex
            flex-1
            min-h-0
          "
        >

          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <Sidebar
            isOpen={sidebarOpen}
            onClose={() =>
              setSidebarOpen(false)
            }
          />


          {/* ================================================= */}
          {/* MAIN CONTENT */}
          {/* ================================================= */}

          <main
            className="
              flex-1
              min-w-0
              overflow-x-hidden
              bg-[#f8f9fa]
            "
          >

            <Routes>

              {/* ================================================= */}
              {/* DEFAULT */}
              {/* ================================================= */}

              <Route
                path="/"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />


              {/* ================================================= */}
              {/* DASHBOARD */}
              {/* ================================================= */}

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />


              {/* ================================================= */}
              {/* AI CHAT */}
              {/* ================================================= */}

              <Route
                path="/chat"
                element={<Chat />}
              />


              {/* ================================================= */}
              {/* SYMPTOMS */}
              {/* ================================================= */}

              <Route
                path="/symptoms"
                element={<Symptoms />}
              />


              {/* ================================================= */}
              {/* REPORTS */}
              {/* ================================================= */}

              <Route
                path="/reports"
                element={<Reports />}
              />


              {/* ================================================= */}
              {/* MEDICINES */}
              {/* ================================================= */}

              <Route
                path="/medicines"
                element={<Medicines />}
              />


              {/* ================================================= */}
              {/* PRESCRIPTION */}
              {/* ================================================= */}

              <Route
                path="/prescription"
                element={<Prescription />}
              />


              {/* ================================================= */}
              {/* HISTORY */}
              {/* ================================================= */}

              <Route
                path="/history"
                element={<History />}
              />


              {/* ================================================= */}
              {/* PROFILE */}
              {/* ================================================= */}

              <Route
                path="/profile"
                element={<Profile />}
              />


              {/* ================================================= */}
              {/* UNKNOWN ROUTE */}
              {/* ================================================= */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />

            </Routes>

          </main>

        </div>

      </div>

    </div>
  );
}


function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <Routes>

          {/* ================================================= */}
          {/* PUBLIC PAGES */}
          {/* ================================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ================================================= */}
          {/* PROTECTED APPLICATION */}
          {/* ================================================= */}

          <Route
            element={<ProtectedRoute />}
          >

            <Route
              path="/*"
              element={<AppLayout />}
            />

          </Route>

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}


export default App;