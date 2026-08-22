import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HeartPulse, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";


function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);


  const submit = async (e) => {

    e.preventDefault();

    setMessage("");

    if (!email.trim() || !password) {

      setMessage(
        "Please enter your email and password."
      );

      return;
    }

    setLoading(true);

    try {

      const result = await login(
        email.trim(),
        password
      );

      if (result.success) {

        navigate("/dashboard");

      } else {

        setMessage(
          result.message ||
          "Invalid email or password."
        );

      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Unable to connect to the server. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="min-h-screen bg-slate-50 flex">

      {/* Left Section */}

      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white p-12 flex-col justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">

              <HeartPulse size={25} />

            </div>

            <span className="text-2xl font-bold">
              MediAI
            </span>

          </div>


          <div className="max-w-lg mt-28">

            <h1 className="text-5xl font-bold leading-tight">
              Your intelligent
              <br />
              health companion.
            </h1>

            <p className="mt-6 text-blue-100 text-lg leading-8">
              Get clear, easy-to-understand medical
              information powered by artificial intelligence.
            </p>

          </div>

        </div>


        <p className="text-sm text-blue-100">
          AI-generated information is not a substitute
          for professional medical advice.
        </p>

      </div>


      {/* Login Section */}

      <div className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}

          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">

            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">

              <HeartPulse size={23} />

            </div>

            <span className="text-2xl font-bold text-slate-900">
              MediAI
            </span>

          </div>


          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 sm:p-9">

            <div className="mb-7">

              <h2 className="text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="text-slate-500 mt-2">
                Login to continue to your account.
              </p>

            </div>


            {/* Error */}

            {message && (

              <div className="mb-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">

                {message}

              </div>

            )}


            <form
              onSubmit={submit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>


              {/* Password */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-12 py-3.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >

                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>


              {/* Login */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-xl font-semibold transition flex items-center justify-center"
              >

                {loading
                  ? "Signing in..."
                  : "Sign in"}

              </button>

            </form>


            {/* Register */}

            <p className="text-center text-sm text-slate-500 mt-7">

              Don't have an account?

              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:text-blue-700 ml-1"
              >
                Create account
              </Link>

            </p>

          </div>


          <p className="text-center text-xs text-slate-400 mt-6">
            Your information is handled securely.
          </p>

        </div>

      </div>

    </div>

  );
}


export default Login;