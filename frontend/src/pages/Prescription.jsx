import { useEffect, useMemo, useState } from "react";

import {
  FileText,
  Plus,
  Search,
  X,
  Trash2,
  Eye,
  CalendarDays,
  UserRound,
  Building2,
  Pill,
  ClipboardCheck,
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Stethoscope,
} from "lucide-react";

const STORAGE_KEY = "mediai_prescriptions";

function Prescription() {
  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Unable to load prescriptions:", error);
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    doctorName: "",
    clinicName: "",
    prescriptionDate: "",
    followUpDate: "",
    medicines: "",
    notes: "",
  });

  /* ============================================================
     SAVE
  ============================================================ */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(prescriptions)
      );
    } catch (error) {
      console.error("Unable to save prescriptions:", error);
    }
  }, [prescriptions]);

  /* ============================================================
     FORM
  ============================================================ */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ============================================================
     ADD PRESCRIPTION
  ============================================================ */

  const addPrescription = (e) => {
    e.preventDefault();

    if (
      !form.doctorName.trim() &&
      !form.clinicName.trim()
    ) {
      return;
    }

    const newPrescription = {
      id: Date.now(),

      doctorName:
        form.doctorName.trim() ||
        "Doctor not specified",

      clinicName:
        form.clinicName.trim() ||
        "Clinic not specified",

      prescriptionDate:
        form.prescriptionDate,

      followUpDate:
        form.followUpDate,

      medicines:
        form.medicines.trim(),

      notes:
        form.notes.trim(),

      createdAt:
        new Date().toISOString(),
    };

    setPrescriptions((previous) => [
      newPrescription,
      ...previous,
    ]);

    resetForm();
  };

  /* ============================================================
     RESET
  ============================================================ */

  const resetForm = () => {
    setForm({
      doctorName: "",
      clinicName: "",
      prescriptionDate: "",
      followUpDate: "",
      medicines: "",
      notes: "",
    });

    setShowModal(false);
  };

  /* ============================================================
     DELETE
  ============================================================ */

  const deletePrescription = (id) => {
    setPrescriptions((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );

    if (
      selectedPrescription?.id === id
    ) {
      setSelectedPrescription(null);
    }
  };

  /* ============================================================
     SEARCH
  ============================================================ */

  const filteredPrescriptions = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return prescriptions;
    }

    return prescriptions.filter(
      (item) =>
        item.doctorName
          .toLowerCase()
          .includes(query) ||
        item.clinicName
          .toLowerCase()
          .includes(query) ||
        item.medicines
          .toLowerCase()
          .includes(query)
    );
  }, [prescriptions, search]);

  /* ============================================================
     STATS
  ============================================================ */

  const medicineCount = prescriptions.reduce(
    (total, item) => {
      if (!item.medicines) return total;

      return (
        total +
        item.medicines
          .split("\n")
          .filter(Boolean).length
      );
    },
    0
  );

  const followUpCount = prescriptions.filter(
    (item) => item.followUpDate
  ).length;

  /* ============================================================
     RETURN
  ============================================================ */

  return (
    <main className="min-h-full bg-[#f6f8fb] px-5 sm:px-8 lg:px-10 py-7">

      <div className="max-w-[1320px] mx-auto">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">

              <FileText size={25} strokeWidth={1.8} />

            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-[27px] leading-tight font-bold tracking-[-0.5px] text-slate-950">
                  Prescriptions
                </h1>

                {prescriptions.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                    {prescriptions.length}
                  </span>
                )}

              </div>

              <p className="text-[14px] text-slate-500 mt-1">
                Keep your prescriptions organized and easy to access.
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              h-12
              px-5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-[14px]
              font-semibold
              shadow-[0_8px_20px_rgba(37,99,235,0.18)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              active:translate-y-0
            "
          >

            <Plus size={18} />

            Add prescription

          </button>

        </div>


        {/* ======================================================
            STAT CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <StatCard
            icon={<FileText size={21} />}
            label="Total prescriptions"
            value={prescriptions.length}
            description="Saved prescriptions"
            accent="blue"
          />

          <StatCard
            icon={<Pill size={21} />}
            label="Medicines"
            value={medicineCount}
            description="Medicine entries"
            accent="violet"
          />

          <StatCard
            icon={<ClipboardCheck size={21} />}
            label="Follow-ups"
            value={followUpCount}
            description="Scheduled follow-ups"
            accent="emerald"
          />

        </div>


        {/* ======================================================
            CONTENT HEADER
        ====================================================== */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">

          <div>

            <h2 className="text-[19px] font-bold text-slate-950">
              Your prescriptions
            </h2>

            <p className="text-[14px] text-slate-500 mt-1">
              View and manage your saved prescriptions.
            </p>

          </div>


          <div className="relative w-full md:w-[310px]">

            <Search
              size={18}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search prescriptions..."
              className="
                w-full
                h-11
                rounded-xl
                border
                border-slate-200
                bg-white
                pl-10
                pr-4
                text-[14px]
                text-slate-800
                placeholder:text-slate-400
                outline-none
                transition
                focus:border-blue-400
                focus:ring-4
                focus:ring-blue-50
              "
            />

          </div>

        </div>


        {/* ======================================================
            PRESCRIPTIONS
        ====================================================== */}

        {filteredPrescriptions.length === 0 ? (

          <EmptyState
            search={search}
            onAdd={() =>
              setShowModal(true)
            }
          />

        ) : (

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {filteredPrescriptions.map(
              (prescription) => (

                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onView={() =>
                    setSelectedPrescription(
                      prescription
                    )
                  }
                  onDelete={() =>
                    deletePrescription(
                      prescription.id
                    )
                  }
                />

              )
            )}

          </div>

        )}


        {/* ======================================================
            DISCLAIMER
        ====================================================== */}

        <div className="
          mt-7
          rounded-2xl
          border
          border-amber-200
          bg-amber-50
          px-5
          py-4
          flex
          items-start
          gap-3
        ">

          <div className="
            w-9
            h-9
            shrink-0
            rounded-xl
            bg-white
            border
            border-amber-100
            flex
            items-center
            justify-center
            text-amber-600
          ">

            <ClipboardCheck size={17} />

          </div>

          <div>

            <p className="text-[13px] font-semibold text-amber-900">
              Important
            </p>

            <p className="text-[13px] leading-5 text-amber-700 mt-0.5">
              Prescriptions stored here are for organization
              and reference. Always follow the instructions
              provided by your healthcare professional.
            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          ADD MODAL
      ====================================================== */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-[200]
            bg-slate-950/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              resetForm();
            }
          }}
        >

          <div className="
            w-full
            max-w-[600px]
            max-h-[92vh]
            overflow-y-auto
            bg-white
            rounded-[24px]
            shadow-[0_25px_80px_rgba(15,23,42,0.22)]
            border
            border-white
          ">

            {/* MODAL HEADER */}

            <div className="
              px-6
              py-5
              border-b
              border-slate-100
              flex
              items-center
              justify-between
            ">

              <div className="flex items-center gap-3">

                <div className="
                  w-11
                  h-11
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                ">

                  <FileText size={20} />

                </div>

                <div>

                  <h2 className="text-[18px] font-bold text-slate-950">
                    Add prescription
                  </h2>

                  <p className="text-[13px] text-slate-500 mt-0.5">
                    Save your prescription details.
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={resetForm}
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-slate-50
                  hover:bg-slate-100
                  text-slate-500
                  flex
                  items-center
                  justify-center
                  transition
                "
              >

                <X size={18} />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={addPrescription}
              className="p-6 space-y-5"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <InputField
                  label="Doctor name"
                  name="doctorName"
                  value={form.doctorName}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Rahul Sharma"
                />

                <InputField
                  label="Clinic / Hospital"
                  name="clinicName"
                  value={form.clinicName}
                  onChange={handleChange}
                  placeholder="e.g. City Hospital"
                />

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <InputField
                  label="Prescription date"
                  type="date"
                  name="prescriptionDate"
                  value={form.prescriptionDate}
                  onChange={handleChange}
                />

                <InputField
                  label="Follow-up date"
                  type="date"
                  name="followUpDate"
                  value={form.followUpDate}
                  onChange={handleChange}
                />

              </div>


              {/* MEDICINES */}

              <div>

                <label className="
                  block
                  text-[13px]
                  font-semibold
                  text-slate-800
                  mb-2
                ">
                  Medicines
                </label>

                <textarea
                  name="medicines"
                  value={form.medicines}
                  onChange={handleChange}
                  rows={5}
                  placeholder={
                    "Example:\nParacetamol - 500 mg - Twice a day\nVitamin D - 1000 IU - Once a day"
                  }
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50/50
                    px-4
                    py-3.5
                    text-[14px]
                    text-slate-800
                    outline-none
                    transition
                    focus:bg-white
                    focus:border-blue-400
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />

                <p className="text-[12px] text-slate-400 mt-1.5">
                  Add each medicine on a new line.
                </p>

              </div>


              {/* NOTES */}

              <div>

                <label className="
                  block
                  text-[13px]
                  font-semibold
                  text-slate-800
                  mb-2
                ">
                  Doctor's notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Additional instructions or notes..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50/50
                    px-4
                    py-3.5
                    text-[14px]
                    text-slate-800
                    outline-none
                    transition
                    focus:bg-white
                    focus:border-blue-400
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />

              </div>


              {/* ACTIONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={resetForm}
                  className="
                    flex-1
                    h-12
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    text-[14px]
                    font-semibold
                    text-slate-600
                    hover:bg-slate-50
                    transition
                  "
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="
                    flex-1
                    h-12
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    text-[14px]
                    font-semibold
                    shadow-[0_8px_20px_rgba(37,99,235,0.18)]
                    transition
                  "
                >
                  Save prescription
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ======================================================
          VIEW MODAL
      ====================================================== */}

      {selectedPrescription && (

        <div
          className="
            fixed
            inset-0
            z-[210]
            bg-slate-950/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onMouseDown={(e) => {

            if (
              e.target === e.currentTarget
            ) {
              setSelectedPrescription(null);
            }

          }}
        >

          <div className="
            w-full
            max-w-[650px]
            max-h-[92vh]
            overflow-y-auto
            bg-white
            rounded-[24px]
            shadow-[0_25px_80px_rgba(15,23,42,0.22)]
          ">

            {/* HEADER */}

            <div className="
              px-6
              py-5
              border-b
              border-slate-100
              flex
              items-center
              justify-between
            ">

              <div className="flex items-center gap-3">

                <div className="
                  w-12
                  h-12
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                ">

                  <FileText size={21} />

                </div>

                <div>

                  <h2 className="text-[19px] font-bold text-slate-950">
                    Prescription details
                  </h2>

                  <p className="text-[13px] text-slate-500 mt-0.5">
                    Saved prescription information
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedPrescription(null)
                }
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-slate-50
                  hover:bg-slate-100
                  text-slate-500
                  flex
                  items-center
                  justify-center
                "
              >

                <X size={18} />

              </button>

            </div>


            {/* CONTENT */}

            <div className="p-6 space-y-5">

              {/* DOCTOR */}

              <div className="
                rounded-2xl
                bg-slate-50
                border
                border-slate-100
                p-4
              ">

                <div className="flex items-center gap-2 mb-4">

                  <div className="
                    w-9
                    h-9
                    rounded-lg
                    bg-white
                    text-blue-600
                    border
                    border-slate-100
                    flex
                    items-center
                    justify-center
                  ">

                    <Stethoscope size={17} />

                  </div>

                  <div>

                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      Healthcare provider
                    </p>

                    <p className="text-[15px] font-semibold text-slate-900">
                      {selectedPrescription.doctorName}
                    </p>

                  </div>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <InfoBlock
                    icon={<UserRound size={16} />}
                    label="Doctor"
                    value={
                      selectedPrescription.doctorName
                    }
                  />

                  <InfoBlock
                    icon={<Building2 size={16} />}
                    label="Clinic / Hospital"
                    value={
                      selectedPrescription.clinicName
                    }
                  />

                </div>

              </div>


              {/* DATES */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <InfoBlock
                  icon={<CalendarDays size={16} />}
                  label="Prescription date"
                  value={
                    selectedPrescription.prescriptionDate ||
                    "Not specified"
                  }
                />

                <InfoBlock
                  icon={<Clock3 size={16} />}
                  label="Follow-up date"
                  value={
                    selectedPrescription.followUpDate ||
                    "Not scheduled"
                  }
                />

              </div>


              {/* MEDICINES */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <div className="
                      w-8
                      h-8
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                    ">

                      <Pill size={16} />

                    </div>

                    <h3 className="text-[15px] font-bold text-slate-900">
                      Medicines
                    </h3>

                  </div>

                </div>


                <div className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-4
                  whitespace-pre-line
                  text-[14px]
                  leading-6
                  text-slate-700
                ">

                  {selectedPrescription.medicines ||
                    "No medicines recorded."}

                </div>

              </div>


              {/* NOTES */}

              <div>

                <h3 className="text-[15px] font-bold text-slate-900 mb-2">
                  Doctor's notes
                </h3>

                <div className="
                  rounded-2xl
                  border
                  border-amber-100
                  bg-amber-50
                  p-4
                  text-[14px]
                  leading-6
                  text-amber-800
                ">

                  {selectedPrescription.notes ||
                    "No additional notes."}

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedPrescription(null)
                }
                className="
                  w-full
                  h-12
                  rounded-xl
                  bg-slate-950
                  hover:bg-slate-800
                  text-white
                  text-[14px]
                  font-semibold
                  transition
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}


/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  icon,
  label,
  value,
  description,
  accent,
}) {
  const styles = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    violet: {
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
  };

  const current =
    styles[accent] || styles.blue;

  return (
    <div className="
      group
      bg-white
      border
      border-slate-200
      rounded-2xl
      p-5
      shadow-[0_2px_8px_rgba(15,23,42,0.04)]
      hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)]
      hover:-translate-y-0.5
      transition-all
      duration-200
    ">

      <div className="flex items-start justify-between">

        <div className={`
          w-11
          h-11
          rounded-xl
          ${current.bg}
          ${current.text}
          flex
          items-center
          justify-center
        `}>

          {icon}

        </div>


        <span className="
          text-[27px]
          leading-none
          font-bold
          tracking-tight
          text-slate-950
        ">
          {value}
        </span>

      </div>


      <p className="
        text-[15px]
        font-semibold
        text-slate-900
        mt-5
      ">
        {label}
      </p>


      <p className="
        text-[13px]
        text-slate-500
        mt-1
      ">
        {description}
      </p>

    </div>
  );
}


/* ================================================================
   PRESCRIPTION CARD
================================================================ */

function PrescriptionCard({
  prescription,
  onView,
  onDelete,
}) {
  return (
    <div className="
      group
      bg-white
      border
      border-slate-200
      rounded-[22px]
      p-5
      sm:p-6
      shadow-[0_2px_8px_rgba(15,23,42,0.035)]
      hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]
      hover:-translate-y-0.5
      transition-all
      duration-200
    ">

      {/* TOP */}

      <div className="
        flex
        items-start
        justify-between
        gap-4
      ">

        <div className="
          flex
          items-center
          gap-3.5
          min-w-0
        ">

          <div className="
            w-12
            h-12
            shrink-0
            rounded-xl
            bg-blue-50
            text-blue-600
            flex
            items-center
            justify-center
          ">

            <FileText size={21} />

          </div>


          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h3 className="
                text-[16px]
                font-bold
                text-slate-950
                truncate
              ">
                {prescription.doctorName}
              </h3>

            </div>


            <p className="
              text-[13px]
              text-slate-500
              mt-0.5
              truncate
            ">
              {prescription.clinicName}
            </p>

          </div>

        </div>


        <span className="
          shrink-0
          px-2.5
          py-1
          rounded-full
          bg-emerald-50
          border
          border-emerald-100
          text-emerald-600
          text-[11px]
          font-semibold
        ">
          Saved
        </span>

      </div>


      {/* DIVIDER */}

      <div className="
        h-px
        bg-slate-100
        my-5
      " />


      {/* DATES */}

      <div className="
        grid
        grid-cols-2
        gap-4
      ">

        <InfoBlock
          icon={<CalendarDays size={15} />}
          label="Prescription date"
          value={
            prescription.prescriptionDate ||
            "Not specified"
          }
        />

        <InfoBlock
          icon={<Clock3 size={15} />}
          label="Follow-up"
          value={
            prescription.followUpDate ||
            "Not scheduled"
          }
        />

      </div>


      {/* MEDICINE */}

      <div className="
        mt-5
        rounded-2xl
        bg-slate-50
        border
        border-slate-100
        p-4
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-3
        ">

          <div className="flex items-center gap-2">

            <div className="
              w-8
              h-8
              rounded-lg
              bg-white
              text-blue-600
              border
              border-slate-100
              flex
              items-center
              justify-center
            ">

              <Pill size={15} />

            </div>

            <span className="
              text-[12px]
              font-semibold
              text-slate-500
            ">
              Medicines
            </span>

          </div>

          <ArrowUpRight
            size={15}
            className="text-slate-300"
          />

        </div>


        <p className="
          text-[13px]
          text-slate-700
          leading-5
          whitespace-pre-line
          line-clamp-3
        ">
          {prescription.medicines ||
            "No medicines recorded."}
        </p>

      </div>


      {/* ACTIONS */}

      <div className="
        flex
        items-center
        justify-between
        gap-3
        mt-5
      ">

        <button
          type="button"
          onClick={onView}
          className="
            flex
            items-center
            gap-2
            px-4
            h-10
            rounded-xl
            bg-blue-50
            text-blue-600
            hover:bg-blue-100
            text-[13px]
            font-semibold
            transition
          "
        >

          <Eye size={15} />

          View prescription

          <ChevronRight size={14} />

        </button>


        <button
          type="button"
          onClick={onDelete}
          className="
            w-10
            h-10
            rounded-xl
            text-slate-400
            hover:text-red-600
            hover:bg-red-50
            flex
            items-center
            justify-center
            transition
          "
          title="Delete prescription"
        >

          <Trash2 size={16} />

        </button>

      </div>

    </div>
  );
}


/* ================================================================
   INFO BLOCK
================================================================ */

function InfoBlock({
  icon,
  label,
  value,
}) {
  return (
    <div className="min-w-0">

      <div className="
        flex
        items-center
        gap-1.5
        text-slate-400
      ">

        {icon}

        <span className="
          text-[10px]
          uppercase
          tracking-[0.08em]
          font-semibold
        ">
          {label}
        </span>

      </div>


      <p
        className="
          text-[13px]
          font-semibold
          text-slate-800
          mt-1
          truncate
        "
        title={value}
      >
        {value}
      </p>

    </div>
  );
}


/* ================================================================
   INPUT
================================================================ */

function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="
        block
        text-[13px]
        font-semibold
        text-slate-800
        mb-2
      ">
        {label}
      </label>


      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          h-12
          px-4
          rounded-xl
          border
          border-slate-200
          bg-slate-50/50
          text-[14px]
          text-slate-800
          placeholder:text-slate-400
          outline-none
          transition
          focus:bg-white
          focus:border-blue-400
          focus:ring-4
          focus:ring-blue-50
        "
      />

    </div>
  );
}


/* ================================================================
   EMPTY STATE
================================================================ */

function EmptyState({
  search,
  onAdd,
}) {
  return (
    <div className="
      bg-white
      border
      border-slate-200
      rounded-[24px]
      min-h-[360px]
      flex
      items-center
      justify-center
      text-center
      px-6
    ">

      <div className="max-w-md">

        <div className="
          w-16
          h-16
          mx-auto
          rounded-2xl
          bg-blue-50
          text-blue-600
          flex
          items-center
          justify-center
          mb-5
        ">

          <FileText size={28} />

        </div>


        <h3 className="
          text-[20px]
          font-bold
          text-slate-950
        ">
          {search
            ? "No prescriptions found"
            : "No prescriptions yet"}
        </h3>


        <p className="
          text-[14px]
          text-slate-500
          mt-2
          leading-6
        ">
          {search
            ? "Try searching with a different doctor, clinic, or medicine."
            : "Add your prescriptions to keep your medical records organized."}
        </p>


        {!search && (

          <button
            type="button"
            onClick={onAdd}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              h-11
              px-5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-[13px]
              font-semibold
              shadow-[0_8px_20px_rgba(37,99,235,0.18)]
              transition
            "
          >

            <Plus size={16} />

            Add your first prescription

          </button>

        )}

      </div>

    </div>
  );
}


export default Prescription;