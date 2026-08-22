import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  RotateCcw,
  Stethoscope,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import api from "../services/api";


function Symptoms() {

  const [form, setForm] = useState({
    symptoms: "",
    age: "",
    gender: "",
    duration: "",
    severity: "Moderate",
  });

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ============================================================
  // ANALYZE SYMPTOMS
  // ============================================================

  const analyzeSymptoms = async (e) => {

    e.preventDefault();

    setError("");
    setResult(null);


    if (!form.symptoms.trim()) {

      setError(
        "Please enter your symptoms."
      );

      return;
    }


    setLoading(true);


    try {

      const response = await api.post(
        "/symptoms/analyze",
        {
          symptoms: form.symptoms.trim(),

          age: form.age
            ? Number(form.age)
            : null,

          gender: form.gender,

          duration: form.duration,

          severity: form.severity,
        }
      );


      if (response.data.success) {

        setResult(
          response.data.result
        );

      } else {

        setError(
          response.data.message ||
          "Unable to analyze symptoms."
        );

      }

    } catch (error) {

      console.error(
        "Symptom checker error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to analyze symptoms. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // RESET
  // ============================================================

  const resetChecker = () => {

    setForm({
      symptoms: "",
      age: "",
      gender: "",
      duration: "",
      severity: "Moderate",
    });

    setResult(null);

    setError("");

  };


  return (

    <main className="flex-1 min-h-[calc(100vh-64px)] bg-slate-50 p-6 md:p-8">

      <div className="max-w-5xl mx-auto">


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

              <Stethoscope size={23} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                AI Symptom Checker
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Get general medical information based on your symptoms.
              </p>

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* DISCLAIMER */}
        {/* ================================================== */}

        <div className="mb-6 flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">

          <AlertTriangle
            size={20}
            className="text-amber-600 shrink-0 mt-0.5"
          />

          <p className="text-sm text-amber-800 leading-6">

            This tool provides general health information
            and does not provide a medical diagnosis.
            If you think you may have a medical emergency,
            seek urgent medical care.

          </p>

        </div>


        {/* ================================================== */}
        {/* FORM */}
        {/* ================================================== */}

        {!result && (

          <form
            onSubmit={analyzeSymptoms}
            className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8"
          >

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                <Activity size={20} />

              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Tell us about your symptoms
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Provide as much information as you can.
                </p>

              </div>

            </div>


            {/* Symptoms */}

            <div className="mb-6">

              <label
                htmlFor="symptoms"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                What symptoms are you experiencing?
              </label>

              <textarea
                id="symptoms"
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                rows={5}
                placeholder="Example: Headache, mild fever, sore throat and tiredness..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>


            {/* Basic Information */}

            <div className="grid md:grid-cols-3 gap-5 mb-6">

              {/* Age */}

              <div>

                <label
                  htmlFor="age"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Age
                </label>

                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="e.g. 22"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>


              {/* Gender */}

              <div>

                <label
                  htmlFor="gender"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                >

                  <option value="">
                    Prefer not to say
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* Duration */}

              <div>

                <label
                  htmlFor="duration"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Duration
                </label>

                <input
                  id="duration"
                  name="duration"
                  type="text"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 3 days"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

            </div>


            {/* Severity */}

            <div className="mb-6">

              <label
                htmlFor="severity"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                How severe are the symptoms?
              </label>

              <select
                id="severity"
                name="severity"
                value={form.severity}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >

                <option value="Mild">
                  Mild
                </option>

                <option value="Moderate">
                  Moderate
                </option>

                <option value="Severe">
                  Severe
                </option>

              </select>

            </div>


            {/* Error */}

            {error && (

              <div className="mb-6 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">

                {error}

              </div>

            )}


            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >

              {loading ? (

                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Analyzing symptoms...

                </>

              ) : (

                <>
                  <Activity size={19} />

                  Analyze Symptoms
                </>

              )}

            </button>

          </form>

        )}


        {/* ================================================== */}
        {/* RESULT */}
        {/* ================================================== */}

        {result && (

          <div className="space-y-6">


            {/* Result Header */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">

                    <CheckCircle size={23} />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Symptom Analysis
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      General information based on the details you provided.
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={resetChecker}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >

                  <RotateCcw size={17} />

                  New Check

                </button>

              </div>

            </div>


            {/* Patient Details */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <div className="bg-white border border-slate-200 rounded-xl p-4">

                <p className="text-xs text-slate-400">
                  Symptoms
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1 line-clamp-2">
                  {result.symptoms}
                </p>

              </div>


              <div className="bg-white border border-slate-200 rounded-xl p-4">

                <p className="text-xs text-slate-400">
                  Age
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {result.age || "Not provided"}
                </p>

              </div>


              <div className="bg-white border border-slate-200 rounded-xl p-4">

                <p className="text-xs text-slate-400">
                  Duration
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {result.duration || "Not provided"}
                </p>

              </div>


              <div className="bg-white border border-slate-200 rounded-xl p-4">

                <p className="text-xs text-slate-400">
                  Severity
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {result.severity || "Not provided"}
                </p>

              </div>

            </div>


            {/* AI Analysis */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">

              <div className="flex items-center gap-3 mb-6">

                <Clock
                  size={20}
                  className="text-blue-600"
                />

                <h2 className="text-lg font-bold text-slate-900">
                  AI Analysis
                </h2>

              </div>


              <div className="prose prose-slate max-w-none text-sm leading-7">

                <ReactMarkdown>
                  {result.analysis}
                </ReactMarkdown>

              </div>

            </div>


            {/* Disclaimer */}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">

              <p className="text-sm text-amber-800 leading-6">

                <strong>Important:</strong>{" "}
                This analysis is for general informational
                purposes only and is not a diagnosis.
                A qualified healthcare professional should
                evaluate persistent, worsening, or concerning
                symptoms.

              </p>

            </div>


          </div>

        )}

      </div>

    </main>

  );
}


export default Symptoms;