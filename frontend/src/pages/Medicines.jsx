import { useEffect, useMemo, useState } from "react";

import {
  Pill,
  Plus,
  Search,
  X,
  Trash2,
  Check,
  Clock3,
  CalendarDays,
  CircleCheck,
  Activity,
} from "lucide-react";


const STORAGE_KEY = "mediai_medicines";


function Medicines() {

  const [medicines, setMedicines] = useState(() => {

    try {

      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );


      if (!saved) {
        return [];
      }


      const parsed =
        JSON.parse(saved);


      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch (error) {

      console.error(
        "Unable to load medicines:",
        error
      );

      return [];

    }

  });


  const [showModal, setShowModal] =
    useState(false);


  const [search, setSearch] =
    useState("");


  const [filter, setFilter] =
    useState("active");


  const [form, setForm] = useState({

    name: "",

    dosage: "",

    frequency: "Once a day",

    time: "09:00",

    startDate: "",

    endDate: "",

    notes: "",

  });


  // Save whenever medicines change

  useEffect(() => {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(medicines)
      );

    } catch (error) {

      console.error(
        "Unable to save medicines:",
        error
      );

    }

  }, [medicines]);


  // ============================================================
  // FORM CHANGE
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
  // ADD MEDICINE
  // ============================================================

  const addMedicine = (e) => {

    e.preventDefault();


    if (!form.name.trim()) {
      return;
    }


    const newMedicine = {

      id:
        Date.now(),

      name:
        form.name.trim(),

      dosage:
        form.dosage.trim() ||
        "As prescribed",

      frequency:
        form.frequency,

      time:
        form.time,

      startDate:
        form.startDate,

      endDate:
        form.endDate,

      notes:
        form.notes.trim(),

      takenToday:
        false,

      status:
        "active",

      createdAt:
        new Date().toISOString(),

    };


    setMedicines((previous) => [
      newMedicine,
      ...previous,
    ]);


    resetForm();

  };


  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {

    setForm({

      name: "",

      dosage: "",

      frequency: "Once a day",

      time: "09:00",

      startDate: "",

      endDate: "",

      notes: "",

    });


    setShowModal(false);

  };


  // ============================================================
  // DELETE
  // ============================================================

  const deleteMedicine = (id) => {

    setMedicines((previous) =>
      previous.filter(
        (medicine) =>
          medicine.id !== id
      )
    );

  };


  // ============================================================
  // MARK TAKEN
  // ============================================================

  const toggleTaken = (id) => {

    setMedicines((previous) =>
      previous.map(
        (medicine) => {

          if (
            medicine.id !== id
          ) {
            return medicine;
          }


          return {

            ...medicine,

            takenToday:
              !medicine.takenToday,

          };

        }
      )
    );

  };


  // ============================================================
  // COMPLETE MEDICINE
  // ============================================================

  const toggleStatus = (id) => {

    setMedicines((previous) =>
      previous.map(
        (medicine) => {

          if (
            medicine.id !== id
          ) {
            return medicine;
          }


          return {

            ...medicine,

            status:
              medicine.status ===
              "active"
                ? "completed"
                : "active",

          };

        }
      )
    );

  };


  // ============================================================
  // FILTER
  // ============================================================

  const filteredMedicines =
    useMemo(() => {

      return medicines.filter(
        (medicine) => {

          const matchesSearch =
            medicine.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );


          const matchesFilter =
            filter === "all"
              ? true
              : medicine.status ===
                filter;


          return (
            matchesSearch &&
            matchesFilter
          );

        }
      );

    }, [
      medicines,
      search,
      filter,
    ]);


  // ============================================================
  // STATS
  // ============================================================

  const activeCount =
    medicines.filter(
      (medicine) =>
        medicine.status ===
        "active"
    ).length;


  const completedCount =
    medicines.filter(
      (medicine) =>
        medicine.status ===
        "completed"
    ).length;


  const takenCount =
    medicines.filter(
      (medicine) =>
        medicine.takenToday
    ).length;


  return (

    <main
      className="
        min-h-full
        bg-[#f8f9fb]
        px-5 sm:px-8 lg:px-10 xl:px-12
        py-8 lg:py-10
      "
    >

      <div
        className="
          w-full max-w-[1480px]
          mx-auto
        "
      >

        {/* ================================================== */}
        {/* PAGE HEADER */}
        {/* ================================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            mb-8
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                "
              >

                <Pill
                  size={21}
                />

              </div>


              <div>

                <h1
                  className="
                    text-2xl
                    font-bold
                    text-slate-900
                  "
                >
                  Medicines
                </h1>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-0.5
                  "
                >
                  Manage your medicines and daily doses.
                </p>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              setShowModal(true)
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              h-11
              px-5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-sm
              font-semibold
              shadow-sm
              transition
              active:scale-[0.98]
            "
          >

            <Plus size={17} />

            Add medicine

          </button>

        </div>


        {/* ================================================== */}
        {/* STATS */}
        {/* ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
            mb-8
          "
        >

          <StatCard
            icon={
              <Pill size={19} />
            }
            label="Active medicines"
            value={activeCount}
            description="Currently taking"
          />


          <StatCard
            icon={
              <Check size={19} />
            }
            label="Taken today"
            value={takenCount}
            description="Doses marked complete"
          />


          <StatCard
            icon={
              <CircleCheck size={19} />
            }
            label="Completed"
            value={completedCount}
            description="Finished medicines"
          />

        </div>


        {/* ================================================== */}
        {/* TODAY'S MEDICATION */}
        {/* ================================================== */}

        {activeCount > 0 && (

          <section
            className="
              bg-gradient-to-br
              from-blue-600
              to-indigo-600
              rounded-2xl
              p-5
              sm:p-6
              text-white
              mb-8
              shadow-[0_10px_30px_rgba(37,99,235,0.18)]
            "
          >

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
              "
            >

              <div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mb-2
                  "
                >

                  <Activity
                    size={17}
                  />

                  <span
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-blue-100
                    "
                  >
                    Today's medication
                  </span>

                </div>


                <h2
                  className="
                    text-xl
                    font-bold
                  "
                >
                  Stay on track with your medicines
                </h2>


                <p
                  className="
                    text-sm
                    text-blue-100
                    mt-1
                  "
                >
                  {takenCount} of{" "}
                  {activeCount} active
                  medicines marked as taken today.
                </p>

              </div>


              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-white/15
                  border
                  border-white/20
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-bold
                "
              >

                {activeCount === 0
                  ? 0
                  : Math.round(
                      (takenCount /
                        activeCount) *
                        100
                    )}
                %

              </div>

            </div>

          </section>

        )}


        {/* ================================================== */}
        {/* MEDICINE LIST HEADER */}
        {/* ================================================== */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
            mb-4
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              Your medicines
            </h2>

            <p
              className="
                text-xs
                text-slate-400
                mt-1
              "
            >
              Keep track of your medication schedule.
            </p>

          </div>


          {/* SEARCH */}

          <div
            className="
              relative
              w-full
              md:w-[340px]
            "
          >

            <Search
              size={16}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />


            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search medicines..."
              className="
                w-full
                h-12
                rounded-xl
                border
                border-slate-200
                bg-white
                pl-9
                pr-3
                text-xs
                outline-none
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-50
              "
            />

          </div>

        </div>


        {/* ================================================== */}
        {/* FILTERS */}
        {/* ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            mb-5
            overflow-x-auto
          "
        >

          {[
            ["active", "Active"],
            ["all", "All"],
            ["completed", "Completed"],
          ].map(
            ([value, label]) => (

              <button
                key={value}
                type="button"
                onClick={() =>
                  setFilter(value)
                }
                className={`
                  px-5
                  py-2.5
                  rounded-xl
                  text-sm
                  font-semibold
                  whitespace-nowrap
                  transition

                  ${
                    filter === value
                      ? `
                        bg-slate-900
                        text-white
                      `
                      : `
                        bg-white
                        text-slate-500
                        border
                        border-slate-200
                        hover:bg-slate-50
                      `
                  }
                `}
              >
                {label}
              </button>

            )
          )}

        </div>


        {/* ================================================== */}
        {/* MEDICINES */}
        {/* ================================================== */}

        {filteredMedicines.length === 0 ? (

          <EmptyState
            search={search}
            onAdd={() =>
              setShowModal(true)
            }
          />

        ) : (

          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-5
            "
          >

            {filteredMedicines.map(
              (medicine) => (

                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  onTaken={() =>
                    toggleTaken(
                      medicine.id
                    )
                  }
                  onDelete={() =>
                    deleteMedicine(
                      medicine.id
                    )
                  }
                  onStatus={() =>
                    toggleStatus(
                      medicine.id
                    )
                  }
                />

              )
            )}

          </div>

        )}


        {/* ================================================== */}
        {/* MEDICAL DISCLAIMER */}
        {/* ================================================== */}

        <div
          className="
            mt-7
            p-4
            rounded-xl
            bg-amber-50
            border
            border-amber-100
            text-xs
            text-amber-700
            leading-5
          "
        >

          <strong>
            Important:
          </strong>{" "}
          MediAI helps you organize your
          medicines. Always follow your
          healthcare professional's
          instructions for dosage and
          medication changes.

        </div>

      </div>


      {/* ====================================================== */}
      {/* ADD MEDICINE MODAL */}
      {/* ====================================================== */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-[200]
            bg-slate-900/35
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

          <div
            className="
              w-full
              max-w-[520px]
              max-h-[90vh]
              overflow-y-auto
              bg-white
              rounded-2xl
              shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                px-6
                py-5
                border-b
                border-slate-100
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  Add medicine
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  Add your medication schedule.
                </p>

              </div>


              <button
                type="button"
                onClick={resetForm}
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-slate-50
                  hover:bg-slate-100
                  text-slate-500
                  flex
                  items-center
                  justify-center
                "
              >

                <X size={17} />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={addMedicine}
              className="
                p-6
                space-y-5
              "
            >

              <InputField
                label="Medicine name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Paracetamol"
                required
              />


              <InputField
                label="Dosage"
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                placeholder="e.g. 500 mg"
              />


              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                "
              >

                <div>

                  <label
                    className="
                      block
                      text-xs
                      font-semibold
                      text-slate-700
                      mb-2
                    "
                  >
                    Frequency
                  </label>


                  <select
                    name="frequency"
                    value={form.frequency}
                    onChange={handleChange}
                    className="
                      w-full
                      h-11
                      px-3
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      text-sm
                      text-slate-700
                      outline-none
                      focus:border-blue-400
                    "
                  >

                    <option>
                      Once a day
                    </option>

                    <option>
                      Twice a day
                    </option>

                    <option>
                      Three times a day
                    </option>

                    <option>
                      Every 4 hours
                    </option>

                    <option>
                      Every 6 hours
                    </option>

                    <option>
                      Every 8 hours
                    </option>

                    <option>
                      As needed
                    </option>

                  </select>

                </div>


                <InputField
                  label="Time"
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                />

              </div>


              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                "
              >

                <InputField
                  label="Start date"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />


                <InputField
                  label="End date"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                />

              </div>


              <div>

                <label
                  className="
                    block
                    text-xs
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Notes
                </label>


                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Optional notes..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    py-3
                    text-sm
                    outline-none
                    focus:border-blue-400
                    focus:ring-2
                    focus:ring-blue-50
                  "
                />

              </div>


              {/* ACTIONS */}

              <div
                className="
                  flex
                  gap-3
                  pt-2
                "
              >

                <button
                  type="button"
                  onClick={resetForm}
                  className="
                    flex-1
                    h-11
                    rounded-xl
                    border
                    border-slate-200
                    text-sm
                    font-semibold
                    text-slate-600
                    hover:bg-slate-50
                  "
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="
                    flex-1
                    h-11
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    text-sm
                    font-semibold
                  "
                >
                  Add medicine
                </button>

              </div>

            </form>

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
}) {

  return (

    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-6
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-blue-50
            text-blue-600
            flex
            items-center
            justify-center
          "
        >
          {icon}
        </div>


        <span
          className="
            text-2xl
            font-bold
            text-slate-900
          "
        >
          {value}
        </span>

      </div>


      <p
        className="
          text-sm
          font-semibold
          text-slate-800
          mt-4
        "
      >
        {label}
      </p>


      <p
        className="
          text-xs
          text-slate-400
          mt-1
        "
      >
        {description}
      </p>

    </div>

  );

}


/* ================================================================
   MEDICINE CARD
================================================================ */

function MedicineCard({
  medicine,
  onTaken,
  onDelete,
  onStatus,
}) {

  const isCompleted =
    medicine.status ===
    "completed";


  return (

    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-6
        shadow-sm
        hover:shadow-md
        transition
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        {/* LEFT */}

        <div
          className="
            flex
            items-start
            gap-3
            min-w-0
          "
        >

          <div
            className={`
              w-11
              h-11
              shrink-0
              rounded-xl
              flex
              items-center
              justify-center

              ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-blue-50 text-blue-600"
              }
            `}
          >

            <Pill
              size={20}
            />

          </div>


          <div
            className="
              min-w-0
            "
          >

            <h3
              className={`
                text-sm
                font-bold
                truncate

                ${
                  isCompleted
                    ? "text-slate-400 line-through"
                    : "text-slate-900"
                }
              `}
            >
              {medicine.name}
            </h3>


            <p
              className="
                text-xs
                text-slate-500
                mt-1
              "
            >
              {medicine.dosage}
            </p>

          </div>

        </div>


        {/* STATUS */}

        <span
          className={`
            shrink-0
            px-2.5
            py-1
            rounded-full
            text-[10px]
            font-semibold

            ${
              isCompleted
                ? `
                  bg-emerald-50
                  text-emerald-600
                `
                : `
                  bg-blue-50
                  text-blue-600
                `
            }
          `}
        >
          {isCompleted
            ? "Completed"
            : "Active"}
        </span>

      </div>


      {/* ================================================== */}
      {/* DETAILS */}
      {/* ================================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-3
          mt-5
          pt-4
          border-t
          border-slate-100
        "
      >

        <Detail
          icon={
            <Clock3 size={14} />
          }
          label="Schedule"
          value={`${medicine.frequency} · ${medicine.time}`}
        />


        <Detail
          icon={
            <CalendarDays size={14} />
          }
          label="Duration"
          value={
            medicine.startDate
              ? `${medicine.startDate}${
                  medicine.endDate
                    ? ` → ${medicine.endDate}`
                    : ""
                }`
              : "Not specified"
          }
        />

      </div>


      {/* NOTES */}

      {medicine.notes && (

        <div
          className="
            mt-4
            p-3
            rounded-xl
            bg-slate-50
            text-xs
            text-slate-500
            leading-5
          "
        >
          {medicine.notes}
        </div>

      )}


      {/* ================================================== */}
      {/* ACTIONS */}
      {/* ================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-2
          mt-5
        "
      >

        <button
          type="button"
          onClick={onTaken}
          disabled={isCompleted}
          className={`
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-lg
            text-xs
            font-semibold
            transition

            ${
              medicine.takenToday
                ? `
                  bg-emerald-50
                  text-emerald-600
                `
                : `
                  bg-slate-100
                  text-slate-600
                  hover:bg-emerald-50
                  hover:text-emerald-600
                `
            }

            ${
              isCompleted
                ? "opacity-60 cursor-not-allowed"
                : ""
            }
          `}
        >

          <Check
            size={14}
          />

          {medicine.takenToday
            ? "Taken today"
            : "Mark as taken"}

        </button>


        <div
          className="
            flex
            items-center
            gap-1
          "
        >

          <button
            type="button"
            onClick={onStatus}
            className="
              px-3
              py-2
              rounded-lg
              text-xs
              font-medium
              text-slate-500
              hover:bg-slate-100
            "
          >
            {isCompleted
              ? "Activate"
              : "Complete"}
          </button>


          <button
            type="button"
            onClick={onDelete}
            className="
              w-8
              h-8
              rounded-lg
              text-slate-400
              hover:text-red-600
              hover:bg-red-50
              flex
              items-center
              justify-center
            "
            title="Delete medicine"
          >

            <Trash2
              size={14}
            />

          </button>

        </div>

      </div>

    </div>

  );

}


/* ================================================================
   DETAIL
================================================================ */

function Detail({
  icon,
  label,
  value,
}) {

  return (

    <div>

      <div
        className="
          flex
          items-center
          gap-1.5
          text-slate-400
        "
      >

        {icon}

        <span
          className="
            text-[10px]
            uppercase
            tracking-wider
          "
        >
          {label}
        </span>

      </div>


      <p
        className="
          text-xs
          font-medium
          text-slate-700
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
  required = false,
}) {

  return (

    <div>

      <label
        className="
          block
          text-sm
          font-semibold
          text-slate-700
          mb-2
        "
      >

        {label}

        {required && (
          <span className="text-red-500">
            {" "}*
          </span>
        )}

      </label>


      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          w-full
          h-11
          px-3
          rounded-xl
          border
          border-slate-200
          bg-white
          text-sm
          text-slate-700
          outline-none
          focus:border-blue-400
          focus:ring-2
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

    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-12
        sm:p-16
        text-center
      "
    >

      <div
        className="
          w-20
          h-20
          mx-auto
          rounded-2xl
          bg-blue-50
          text-blue-600
          flex
          items-center
          justify-center
          mb-5
        "
      >

        <Pill
          size={32}
        />

      </div>


      <h3
        className="
          text-lg
          font-bold
          text-slate-900
        "
      >
        {search
          ? "No medicines found"
          : "No medicines added yet"}
      </h3>


      <p
        className="
          max-w-md
          mx-auto
          text-sm
          text-slate-400
          mt-2
          leading-6
        "
      >
        {search
          ? "Try searching with a different medicine name."
          : "Add your medicines to keep your medication schedule organized."}
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
            px-4
            h-10
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            text-xs
            font-semibold
          "
        >

          <Plus
            size={15}
          />

          Add your first medicine

        </button>

      )}

    </div>

  );

}


export default Medicines;