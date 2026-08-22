import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function ProtectedRoute() {

  const {
    user,
    loading,
  } = useAuth();


  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-50">

        <div className="text-slate-500">

          Checking authentication...

        </div>

      </div>

    );

  }


  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  return <Outlet />;

}


export default ProtectedRoute;