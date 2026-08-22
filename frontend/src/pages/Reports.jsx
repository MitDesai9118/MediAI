import { useRef, useState } from "react";

import {
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import api from "../services/api";


function Reports() {

  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // SELECT FILE
  // ============================================================

  const handleFileChange = (e) => {

    const selectedFile = e.target.files?.[0];

    setError("");
    setResult(null);


    if (!selectedFile) {
      return;
    }


    // PDF only

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {

      setError(
        "Please select a PDF medical report."
      );

      e.target.value = "";

      return;
    }


    // 10 MB

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {

      setError(
        "File size must be less than 10 MB."
      );

      e.target.value = "";

      return;
    }


    setFile(
      selectedFile
    );

  };


  // ============================================================
  // UPLOAD REPORT
  // ============================================================

  const analyzeReport = async () => {

    if (!file) {

      setError(
        "Please select a medical report first."
      );

      return;
    }


    setLoading(true);
    setError("");
    setResult(null);


    try {

      const formData = new FormData();

      formData.append(
        "file",
        file
      );


      const response = await api.post(
        "/reports/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );


      if (response.data.success) {

        setResult(
          response.data.report
        );

      } else {

        setError(
          response.data.message ||
          "Unable to analyze report."
        );

      }

    } catch (error) {

      console.error(
        "Report upload error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to analyze the medical report."
      );

    } finally {

      setLoading(false);

    }

  };


  // ============================================================
  // RESET
  // ============================================================

  const resetReport = () => {

    setFile(null);

    setResult(null);

    setError("");

    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }

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

              <FileText size={23} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Medical Report Analyzer
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Upload a medical report and get an easy-to-understand explanation.
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

            This tool provides general information about
            the uploaded report. It does not provide a
            diagnosis or replace advice from a qualified
            healthcare professional.

          </p>

        </div>


        {/* ================================================== */}
        {/* RESULT */}
        {/* ================================================== */}

        {result ? (

          <div className="space-y-6">


            {/* Result Header */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">

                    <CheckCircle size={23} />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Report Analyzed
                    </h2>

                    <p className="text-sm text-slate-500 mt-1 break-all">
                      {result.filename}
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={resetReport}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >

                  <RotateCcw size={17} />

                  Analyze Another

                </button>

              </div>

            </div>


            {/* AI Analysis */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">

                  <FileText size={18} />

                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  AI Report Analysis
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
                This explanation is for informational
                purposes only. Please discuss your report
                and any concerning findings with a qualified
                healthcare professional.

              </p>

            </div>

          </div>

        ) : (

          /* ================================================== */
          /* UPLOAD */
          /* ================================================== */

          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">


            <div className="text-center mb-8">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">

                <Upload size={30} />

              </div>

              <h2 className="text-xl font-bold text-slate-900 mt-5">
                Upload Your Medical Report
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Currently supported: PDF files up to 10 MB.
              </p>

            </div>


            {/* File Drop Area */}

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="w-full border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-10 transition hover:bg-blue-50/30"
            >

              <div className="flex flex-col items-center">

                <FileText
                  size={40}
                  className="text-slate-400"
                />

                <p className="text-sm font-semibold text-slate-700 mt-4">

                  {file
                    ? file.name
                    : "Click to select a PDF"}

                </p>

                <p className="text-xs text-slate-400 mt-2">

                  PDF only • Maximum 10 MB

                </p>

              </div>

            </button>


            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />


            {/* Selected File */}

            {file && (

              <div className="mt-5 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">

                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">

                  <FileText size={20} />

                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-sm font-semibold text-slate-800 truncate">

                    {file.name}

                  </p>

                  <p className="text-xs text-slate-400 mt-1">

                    {(file.size / 1024 / 1024).toFixed(2)} MB

                  </p>

                </div>

              </div>

            )}


            {/* Error */}

            {error && (

              <div className="mt-5 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">

                {error}

              </div>

            )}


            {/* Analyze Button */}

            <button
              type="button"
              onClick={analyzeReport}
              disabled={!file || loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >

              {loading ? (

                <>

                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Analyzing Report...

                </>

              ) : (

                <>

                  <FileText size={19} />

                  Analyze Medical Report

                </>

              )}

            </button>

          </div>

        )}

      </div>

    </main>

  );

}


export default Reports;