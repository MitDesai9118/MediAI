import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const res = await api.post(
        "/auth/register",
        form
      );

      if (res.data.success) {

        navigate("/login");

      }

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Registration failed."
      );

    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Join MediAI today
        </p>

        {message && (
          <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-4 mt-6"
        >

          <input
            placeholder="Full Name"
            className="w-full border rounded-xl px-4 py-3"
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl px-4 py-3"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <p className="text-center text-sm mt-5">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 font-semibold ml-1"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;