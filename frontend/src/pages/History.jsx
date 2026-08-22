import { useEffect, useState } from "react";

import {
  History as HistoryIcon,
  MessageCircle,
  Stethoscope,
  FileText,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  CalendarDays,
  Eye,
  Sparkles,
  Activity,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import api from "../services/api";


function History() {

  // ============================================================
  // STATE
  // ============================================================

  const [activeTab, setActiveTab] =
    useState("chats");

  const [chats, setChats] =
    useState([]);

  const [symptoms, setSymptoms] =
    useState([]);

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [openItem, setOpenItem] =
    useState(null);

  const [showAll, setShowAll] =
    useState(false);


  // ============================================================
  // LOAD CHAT HISTORY
  // ============================================================

  const loadChats = async () => {

    const response =
      await api.get(
        "/chat/history"
      );

    if (
      response.data.success
    ) {

      setChats(
        response.data.history || []
      );

    }

  };


  // ============================================================
  // LOAD SYMPTOM HISTORY
  // ============================================================

  const loadSymptoms = async () => {

    const response =
      await api.get(
        "/symptoms/history"
      );

    if (
      response.data.success
    ) {

      setSymptoms(
        response.data.history || []
      );

    }

  };


  // ============================================================
  // LOAD REPORT HISTORY
  // ============================================================

  const loadReports = async () => {

    const response =
      await api.get(
        "/reports/history"
      );

    if (
      response.data.success
    ) {

      setReports(
        response.data.history || []
      );

    }

  };


  // ============================================================
  // LOAD ALL HISTORY
  // ============================================================

  const loadHistory = async () => {

    try {

      setLoading(true);

      setError("");

      await Promise.all([
        loadChats(),
        loadSymptoms(),
        loadReports(),
      ]);

    } catch (error) {

      console.error(
        "History loading error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load your history."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadHistory();

  }, []);


  // ============================================================
  // GET VISIBLE ITEMS
  // ============================================================

  const getVisibleItems = (
    items
  ) => {

    if (showAll) {

      return items;

    }

    return items.slice(0, 3);

  };


  // ============================================================
  // TOGGLE ITEM
  // ============================================================

  const toggleItem = (
    type,
    id
  ) => {

    const key =
      `${type}-${id}`;

    setOpenItem(
      openItem === key
        ? null
        : key
    );

  };


  // ============================================================
  // CHANGE TAB
  // ============================================================

  const changeTab = (
    tab
  ) => {

    setActiveTab(tab);

    setOpenItem(null);

    setShowAll(false);

  };


  // ============================================================
  // DELETE CHAT
  // ============================================================

  const deleteChat = async (
    id
  ) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this conversation?"
      )
    ) {

      return;

    }


    try {

      await api.delete(
        `/chat/history/${id}`
      );


      setChats(
        (previous) =>
          previous.filter(
            (chat) =>
              chat.id !== id
          )
      );


      setOpenItem(null);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to delete conversation."
      );

    }

  };


  // ============================================================
  // DELETE SYMPTOM
  // ============================================================

  const deleteSymptom = async (
    id
  ) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this symptom check?"
      )
    ) {

      return;

    }


    try {

      await api.delete(
        `/symptoms/history/${id}`
      );


      setSymptoms(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id
          )
      );


      setOpenItem(null);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to delete symptom check."
      );

    }

  };


  // ============================================================
  // DELETE REPORT
  // ============================================================

  const deleteReport = async (
    id
  ) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this medical report?"
      )
    ) {

      return;

    }


    try {

      await api.delete(
        `/reports/history/${id}`
      );


      setReports(
        (previous) =>
          previous.filter(
            (report) =>
              report.id !== id
          )
      );


      setOpenItem(null);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to delete medical report."
      );

    }

  };


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    item
  ) => {

    const date =
      item?.created_at ||
      item?.createdAt ||
      item?.date;


    if (!date) {

      return "Date unavailable";

    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return "Date unavailable";

    }


    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <main
        className="
          min-h-full
          bg-[#f7f8fa]
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-3
            text-slate-500
          "
        >

          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
            "
          >

            <Loader2
              size={22}
              className="
                animate-spin
              "
            />

          </div>


          <span
            className="
              text-sm
              font-medium
            "
          >
            Loading your health history...
          </span>

        </div>

      </main>

    );

  }


  // ============================================================
  // TOTAL
  // ============================================================

  const totalActivities =
    chats.length +
    symptoms.length +
    reports.length;


  // ============================================================
  // CURRENT DATA
  // ============================================================

  const currentItems =
    activeTab === "chats"
      ? chats
      : activeTab === "symptoms"
        ? symptoms
        : reports;


  return (

    <main
      className="
        min-h-full
        bg-[#f7f8fa]
        px-5
        sm:px-7
        lg:px-10
        py-7
      "
    >

      <div
        className="
          max-w-[1180px]
          mx-auto
        "
      >

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            mb-6
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                w-12
                h-12
                shrink-0
                rounded-2xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >

              <HistoryIcon
                size={23}
              />

            </div>


            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-slate-950
                  tracking-tight
                "
              >
                Health History
              </h1>


              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >
                Everything you've done with MediAI, in one place.
              </p>

            </div>

          </div>


          {/* TOTAL ACTIVITIES */}

          <div
            className="
              w-fit
              inline-flex
              items-center
              gap-2
              px-3.5
              py-2
              rounded-xl
              bg-white
              border
              border-slate-200
              shadow-sm
            "
          >

            <Activity
              size={14}
              className="
                text-blue-600
              "
            />


            <span
              className="
                text-xs
                font-medium
                text-slate-500
              "
            >
              {totalActivities} total activities
            </span>

          </div>

        </div>


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (

          <div
            className="
              mb-5
              p-4
              rounded-xl
              bg-red-50
              border
              border-red-100
              text-red-600
              text-sm
            "
          >

            {error}

          </div>

        )}


        {/* ================================================== */}
        {/* TABS */}
        {/* ================================================== */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-1.5
            grid
            grid-cols-3
            gap-1.5
            mb-5
            shadow-sm
          "
        >

          <HistoryTab
            active={
              activeTab === "chats"
            }
            onClick={() =>
              changeTab("chats")
            }
            icon={
              <MessageCircle
                size={17}
              />
            }
            label="AI Chats"
            count={
              chats.length
            }
          />


          <HistoryTab
            active={
              activeTab === "symptoms"
            }
            onClick={() =>
              changeTab("symptoms")
            }
            icon={
              <Stethoscope
                size={17}
              />
            }
            label="Symptom Checks"
            count={
              symptoms.length
            }
          />


          <HistoryTab
            active={
              activeTab === "reports"
            }
            onClick={() =>
              changeTab("reports")
            }
            icon={
              <FileText
                size={17}
              />
            }
            label="Medical Reports"
            count={
              reports.length
            }
          />

        </div>


        {/* ================================================== */}
        {/* CONTENT */}
        {/* ================================================== */}

        {currentItems.length === 0 ? (

          <EmptyState
            icon={
              activeTab === "chats"
                ? (
                  <MessageCircle
                    size={28}
                  />
                )
                : activeTab === "symptoms"
                  ? (
                    <Stethoscope
                      size={28}
                    />
                  )
                  : (
                    <FileText
                      size={28}
                    />
                  )
            }
            title={
              activeTab === "chats"
                ? "No conversations yet"
                : activeTab === "symptoms"
                  ? "No symptom checks yet"
                  : "No medical reports yet"
            }
            text={
              activeTab === "chats"
                ? "Your AI medical conversations will appear here."
                : activeTab === "symptoms"
                  ? "Your symptom analyses will appear here."
                  : "Your analyzed medical reports will appear here."
            }
          />

        ) : (

          <div>

            {/* ================================================= */}
            {/* CHAT LIST */}
            {/* ================================================= */}

            {activeTab === "chats" && (

              <div
                className="
                  space-y-3
                "
              >

                {getVisibleItems(
                  chats
                ).map(
                  (chat) => {

                    const key =
                      `chat-${chat.id}`;

                    const isOpen =
                      openItem === key;


                    return (

                      <HistoryCard
                        key={
                          chat.id
                        }
                        type="chat"
                        icon={
                          <MessageCircle
                            size={19}
                          />
                        }
                        iconClass="
                          bg-blue-50
                          text-blue-600
                        "
                        badge="AI CHAT"
                        title={
                          chat.question ||
                          "Medical conversation"
                        }
                        subtitle="AI Medical Chat"
                        date={
                          formatDate(
                            chat
                          )
                        }
                        isOpen={
                          isOpen
                        }
                        onToggle={() =>
                          toggleItem(
                            "chat",
                            chat.id
                          )
                        }
                        onDelete={() =>
                          deleteChat(
                            chat.id
                          )
                        }
                      >

                        <div
                          className="
                            grid
                            lg:grid-cols-2
                            gap-4
                          "
                        >

                          {/* QUESTION */}

                          <DetailPanel
                            label="Your question"
                            icon={
                              <MessageCircle
                                size={15}
                              />
                            }
                            className="
                              bg-blue-50/60
                              border-blue-100
                            "
                          >

                            <p
                              className="
                                text-sm
                                text-slate-700
                                leading-6
                              "
                            >
                              {chat.question}
                            </p>

                          </DetailPanel>


                          {/* ANSWER */}

                          <DetailPanel
                            label="MediAI response"
                            icon={
                              <Sparkles
                                size={15}
                              />
                            }
                            className="
                              bg-white
                              border-slate-200
                            "
                          >

                            <div
                              className="
                                prose
                                prose-sm
                                prose-slate
                                max-w-none
                                leading-6
                              "
                            >

                              <ReactMarkdown>
                                {chat.answer ||
                                  "No response available."}
                              </ReactMarkdown>

                            </div>

                          </DetailPanel>

                        </div>

                      </HistoryCard>

                    );

                  }
                )}

              </div>

            )}


            {/* ================================================= */}
            {/* SYMPTOM LIST */}
            {/* ================================================= */}

            {activeTab === "symptoms" && (

              <div
                className="
                  space-y-3
                "
              >

                {getVisibleItems(
                  symptoms
                ).map(
                  (item) => {

                    const key =
                      `symptom-${item.id}`;

                    const isOpen =
                      openItem === key;


                    return (

                      <HistoryCard
                        key={
                          item.id
                        }
                        type="symptom"
                        icon={
                          <Stethoscope
                            size={19}
                          />
                        }
                        iconClass="
                          bg-emerald-50
                          text-emerald-600
                        "
                        badge="SYMPTOM CHECK"
                        title={
                          item.symptoms ||
                          "Symptom check"
                        }
                        subtitle="AI Symptom Analysis"
                        date={
                          formatDate(
                            item
                          )
                        }
                        isOpen={
                          isOpen
                        }
                        onToggle={() =>
                          toggleItem(
                            "symptom",
                            item.id
                          )
                        }
                        onDelete={() =>
                          deleteSymptom(
                            item.id
                          )
                        }
                      >

                        {/* PATIENT INFO */}

                        <div
                          className="
                            grid
                            grid-cols-2
                            md:grid-cols-4
                            gap-3
                            mb-4
                          "
                        >

                          <InfoBox
                            label="Age"
                            value={
                              item.age ||
                              "Not provided"
                            }
                          />


                          <InfoBox
                            label="Gender"
                            value={
                              item.gender ||
                              "Not provided"
                            }
                          />


                          <InfoBox
                            label="Duration"
                            value={
                              item.duration ||
                              "Not provided"
                            }
                          />


                          <InfoBox
                            label="Severity"
                            value={
                              item.severity ||
                              "Not provided"
                            }
                          />

                        </div>


                        {/* ANALYSIS */}

                        <DetailPanel
                          label="MediAI analysis"
                          icon={
                            <Sparkles
                              size={15}
                            />
                          }
                          className="
                            bg-white
                            border-slate-200
                          "
                        >

                          <div
                            className="
                              prose
                              prose-sm
                              prose-slate
                              max-w-none
                              leading-6
                            "
                          >

                            <ReactMarkdown>
                              {item.analysis ||
                                "No analysis available."}
                            </ReactMarkdown>

                          </div>

                        </DetailPanel>

                      </HistoryCard>

                    );

                  }
                )}

              </div>

            )}


            {/* ================================================= */}
            {/* REPORT LIST */}
            {/* ================================================= */}

            {activeTab === "reports" && (

              <div
                className="
                  space-y-3
                "
              >

                {getVisibleItems(
                  reports
                ).map(
                  (report) => {

                    const key =
                      `report-${report.id}`;

                    const isOpen =
                      openItem === key;


                    return (

                      <HistoryCard
                        key={
                          report.id
                        }
                        type="report"
                        icon={
                          <FileText
                            size={19}
                          />
                        }
                        iconClass="
                          bg-violet-50
                          text-violet-600
                        "
                        badge="MEDICAL REPORT"
                        title={
                          report.filename ||
                          report.file_name ||
                          "Medical report"
                        }
                        subtitle="AI Report Analysis"
                        date={
                          formatDate(
                            report
                          )
                        }
                        isOpen={
                          isOpen
                        }
                        onToggle={() =>
                          toggleItem(
                            "report",
                            report.id
                          )
                        }
                        onDelete={() =>
                          deleteReport(
                            report.id
                          )
                        }
                      >

                        {/* FILE */}

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            p-4
                            rounded-xl
                            bg-violet-50/60
                            border
                            border-violet-100
                            mb-4
                          "
                        >

                          <div
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-white
                              text-violet-600
                              flex
                              items-center
                              justify-center
                              border
                              border-violet-100
                            "
                          >

                            <FileText
                              size={18}
                            />

                          </div>


                          <div
                            className="
                              min-w-0
                            "
                          >

                            <p
                              className="
                                text-[10px]
                                uppercase
                                tracking-wider
                                font-semibold
                                text-violet-500
                              "
                            >
                              Uploaded file
                            </p>


                            <p
                              className="
                                text-sm
                                font-semibold
                                text-slate-800
                                truncate
                                mt-0.5
                              "
                            >
                              {
                                report.filename ||
                                report.file_name ||
                                "Medical report"
                              }
                            </p>

                          </div>

                        </div>


                        {/* ANALYSIS */}

                        <DetailPanel
                          label="MediAI report analysis"
                          icon={
                            <Sparkles
                              size={15}
                            />
                          }
                          className="
                            bg-white
                            border-slate-200
                          "
                        >

                          <div
                            className="
                              prose
                              prose-sm
                              prose-slate
                              max-w-none
                              leading-6
                            "
                          >

                            <ReactMarkdown>
                              {report.analysis ||
                                "No analysis available."}
                            </ReactMarkdown>

                          </div>

                        </DetailPanel>

                      </HistoryCard>

                    );

                  }
                )}

              </div>

            )}


            {/* ================================================= */}
            {/* VIEW ALL */}
            {/* ================================================= */}

            {currentItems.length > 3 && (

              <ViewAllButton
                expanded={
                  showAll
                }
                count={
                  currentItems.length
                }
                label={
                  activeTab === "chats"
                    ? "AI Chats"
                    : activeTab === "symptoms"
                      ? "Symptom Checks"
                      : "Medical Reports"
                }
                onClick={() =>
                  setShowAll(
                    (previous) =>
                      !previous
                  )
                }
              />

            )}

          </div>

        )}

      </div>

    </main>

  );

}


/* ================================================================
   HISTORY TAB
================================================================ */

function HistoryTab({
  active,
  onClick,
  icon,
  label,
  count,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className={`
        h-11
        px-3
        rounded-xl
        flex
        items-center
        justify-center
        gap-2
        text-xs
        sm:text-sm
        font-semibold
        transition-all
        duration-200

        ${
          active
            ? `
              bg-blue-600
              text-white
              shadow-sm
            `
            : `
              text-slate-500
              hover:bg-slate-50
              hover:text-slate-800
            `
        }
      `}
    >

      {icon}


      <span>
        {label}
      </span>


      <span
        className={`
          min-w-5
          h-5
          px-1.5
          rounded-full
          flex
          items-center
          justify-center
          text-[10px]
          font-bold

          ${
            active
              ? `
                bg-white/20
                text-white
              `
              : `
                bg-slate-100
                text-slate-500
              `
          }
        `}
      >
        {count}
      </span>

    </button>

  );

}


/* ================================================================
   HISTORY CARD
================================================================ */

function HistoryCard({
  icon,
  iconClass,
  badge,
  title,
  subtitle,
  date,
  isOpen,
  onToggle,
  onDelete,
  children,
}) {

  return (

    <div
      className={`
        bg-white
        border
        rounded-2xl
        overflow-hidden
        transition-all
        duration-200

        ${
          isOpen
            ? `
              border-blue-200
              shadow-[0_8px_30px_rgba(15,23,42,0.06)]
            `
            : `
              border-slate-200
              hover:border-slate-300
              hover:shadow-sm
            `
        }
      `}
    >

      {/* ====================================================== */}
      {/* MAIN ROW */}
      {/* ====================================================== */}

      <div
        className="
          p-4
          sm:p-5
          flex
          items-center
          gap-3
          sm:gap-4
        "
      >

        {/* ICON */}

        <button
          type="button"
          onClick={onToggle}
          className={`
            w-11
            h-11
            shrink-0
            rounded-xl
            flex
            items-center
            justify-center
            ${iconClass}
          `}
        >

          {icon}

        </button>


        {/* CONTENT */}

        <button
          type="button"
          onClick={onToggle}
          className="
            flex-1
            min-w-0
            text-left
          "
        >

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
              mb-1
            "
          >

            <span
              className="
                text-[9px]
                sm:text-[10px]
                font-bold
                tracking-[0.12em]
                text-blue-600
                bg-blue-50
                px-2
                py-1
                rounded-md
              "
            >
              {badge}
            </span>

          </div>


          <h3
            className="
              text-sm
              sm:text-[15px]
              font-semibold
              text-slate-900
              truncate
            "
            title={title}
          >

            {title}

          </h3>


          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-1
              mt-1.5
            "
          >

            <span
              className="
                text-[11px]
                text-slate-400
              "
            >
              {subtitle}
            </span>


            <span
              className="
                hidden
                sm:block
                w-1
                h-1
                rounded-full
                bg-slate-300
              "
            />


            <span
              className="
                flex
                items-center
                gap-1
                text-[11px]
                text-slate-400
              "
            >

              <CalendarDays
                size={12}
              />

              {date}

            </span>

          </div>

        </button>


        {/* ACTIONS */}

        <div
          className="
            flex
            items-center
            gap-1
            shrink-0
          "
        >

          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            className="
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              text-slate-400
              hover:text-red-600
              hover:bg-red-50
              transition
            "
          >

            <Trash2
              size={16}
            />

          </button>


          <button
            type="button"
            onClick={onToggle}
            title={
              isOpen
                ? "Hide details"
                : "View details"
            }
            className={`
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              transition

              ${
                isOpen
                  ? `
                    bg-blue-50
                    text-blue-600
                  `
                  : `
                    text-slate-400
                    hover:bg-slate-100
                    hover:text-slate-700
                  `
              }
            `}
          >

            {isOpen ? (

              <ChevronUp
                size={17}
              />

            ) : (

              <ChevronDown
                size={17}
              />

            )}

          </button>

        </div>

      </div>


      {/* ====================================================== */}
      {/* DETAILS */}
      {/* ====================================================== */}

      {isOpen && (

        <div
          className="
            border-t
            border-slate-100
            bg-[#f8f9fb]
            p-4
            sm:p-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              mb-4
            "
          >

            <div
              className="
                w-7
                h-7
                rounded-lg
                bg-white
                border
                border-slate-200
                flex
                items-center
                justify-center
                text-blue-600
              "
            >

              <Eye
                size={14}
              />

            </div>


            <span
              className="
                text-xs
                font-semibold
                text-slate-700
              "
            >
              Activity details
            </span>

          </div>


          {children}

        </div>

      )}

    </div>

  );

}


/* ================================================================
   DETAIL PANEL
================================================================ */

function DetailPanel({
  label,
  icon,
  children,
  className = "",
}) {

  return (

    <div
      className={`
        rounded-xl
        border
        p-4
        ${className}
      `}
    >

      <div
        className="
          flex
          items-center
          gap-2
          mb-3
        "
      >

        <div
          className="
            text-blue-600
          "
        >

          {icon}

        </div>


        <span
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-slate-400
          "
        >
          {label}
        </span>

      </div>


      {children}

    </div>

  );

}


/* ================================================================
   INFO BOX
================================================================ */

function InfoBox({
  label,
  value,
}) {

  return (

    <div
      className="
        bg-white
        rounded-xl
        p-3.5
        border
        border-slate-200
      "
    >

      <p
        className="
          text-[10px]
          uppercase
          tracking-wider
          font-semibold
          text-slate-400
        "
      >

        {label}

      </p>


      <p
        className="
          text-sm
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
   VIEW ALL BUTTON
================================================================ */

function ViewAllButton({
  expanded,
  count,
  label,
  onClick,
}) {

  return (

    <div
      className="
        mt-4
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-3
        flex
        items-center
        justify-center
      "
    >

      <button
        type="button"
        onClick={onClick}
        className="
          flex
          items-center
          justify-center
          gap-2
          px-5
          h-10
          rounded-xl
          text-sm
          font-semibold
          text-blue-600
          hover:bg-blue-50
          transition
        "
      >

        {expanded
          ? "Show latest 3"
          : `View all ${label}`}


        {expanded ? (

          <ChevronUp
            size={16}
          />

        ) : (

          <ChevronDown
            size={16}
          />

        )}

      </button>


      {!expanded && (

        <span
          className="
            ml-2
            text-[11px]
            text-slate-400
          "
        >
          {count} total
        </span>

      )}

    </div>

  );

}


/* ================================================================
   EMPTY STATE
================================================================ */

function EmptyState({
  icon,
  title,
  text,
}) {

  return (

    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-10
        sm:p-14
        text-center
      "
    >

      <div
        className="
          w-16
          h-16
          mx-auto
          rounded-2xl
          bg-blue-50
          text-blue-600
          flex
          items-center
          justify-center
        "
      >

        {icon}

      </div>


      <h2
        className="
          text-lg
          font-bold
          text-slate-900
          mt-5
        "
      >

        {title}

      </h2>


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

        {text}

      </p>

    </div>

  );

}


export default History;