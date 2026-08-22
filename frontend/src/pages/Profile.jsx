import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";


function Profile() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ============================================================
  // LOAD PROFILE
  // ============================================================

  const loadProfile = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await api.get(
        "/profile"
      );

      if (response.data.success) {

        setName(
          response.data.user.name || ""
        );

        setEmail(
          response.data.user.email || ""
        );

      }

    } catch (error) {

      console.error(
        "Profile loading error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load profile."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadProfile();

  }, []);


  // ============================================================
  // UPDATE PROFILE
  // ============================================================

  const updateProfile = async (e) => {

    e.preventDefault();

    setSaving(true);

    setMessage("");

    setError("");


    try {

      const response = await api.put(
        "/profile",
        {
          name,
          email,
        }
      );


      if (response.data.success) {

        setMessage(
          "Profile updated successfully."
        );

      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Unable to update profile."
      );

    } finally {

      setSaving(false);

    }

  };


  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  const updatePassword = async (e) => {

    e.preventDefault();

    setChangingPassword(true);

    setMessage("");

    setError("");


    try {

      const response = await api.put(
        "/profile/password",
        {
          current_password:
            currentPassword,

          new_password:
            newPassword,
        }
      );


      if (response.data.success) {

        setMessage(
          "Password changed successfully."
        );

        setCurrentPassword("");

        setNewPassword("");

      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Unable to change password."
      );

    } finally {

      setChangingPassword(false);

    }

  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <main className="flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">

        <div className="flex items-center gap-3 text-slate-500">

          <Loader2
            size={22}
            className="animate-spin"
          />

          Loading profile...

        </div>

      </main>

    );

  }


  return (

    <main className="flex-1 min-h-[calc(100vh-64px)] bg-slate-50 p-6 md:p-8">

      <div className="max-w-4xl mx-auto">


        {/* Header */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

              <User size={23} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Profile & Account
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage your personal account information.
              </p>

            </div>

          </div>

        </div>


        {/* Messages */}

        {message && (

          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">

            <CheckCircle size={19} />

            {message}

          </div>

        )}


        {error && (

          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">

            <AlertCircle size={19} />

            {error}

          </div>

        )}


        <div className="space-y-6">


          {/* ================================================== */}
          {/* PERSONAL INFORMATION */}
          {/* ================================================== */}

          <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">

            <div className="mb-6">

              <h2 className="text-lg font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Update your name and email address.
              </p>

            </div>


            <form
              onSubmit={updateProfile}
              className="space-y-5"
            >


              {/* Name */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    placeholder="Your name"
                  />

                </div>

              </div>


              {/* Email */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    placeholder="you@example.com"
                  />

                </div>

              </div>


              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
              >

                {saving ? (

                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                ) : (

                  <Save size={18} />

                )}

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </form>

          </section>


          {/* ================================================== */}
          {/* PASSWORD */}
          {/* ================================================== */}

          <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">

            <div className="mb-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">

                  <Lock size={20} />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Change Password
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Use at least 8 characters for your new password.
                  </p>

                </div>

              </div>

            </div>


            <form
              onSubmit={updatePassword}
              className="space-y-5"
            >


              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  placeholder="Current password"
                  required
                />

              </div>


              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  placeholder="New password"
                  minLength={8}
                  required
                />

              </div>


              <button
                type="submit"
                disabled={changingPassword}
                className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
              >

                {changingPassword ? (

                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                ) : (

                  <Lock size={18} />

                )}

                {changingPassword
                  ? "Changing..."
                  : "Change Password"}

              </button>

            </form>

          </section>

        </div>

      </div>

    </main>

  );

}


export default Profile;