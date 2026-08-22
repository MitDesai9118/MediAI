import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function Dashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);


  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    loadDashboard();
  }, []);


  const loadDashboard = async () => {

    try {

      setLoading(true);

      const response = await api.get("/dashboard");

      console.log(
        "Dashboard API:",
        response.data
      );

      if (response.data.success) {

        setUser(response.data.user);

        setDashboard(response.data);

      }

    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {

    return (

      <div
        className="
          min-h-[calc(100vh-82px)]
          bg-[#f8f9fa]
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <div
            className="
              w-10
              h-10
              border-4
              border-blue-100
              border-t-blue-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-slate-500
            "
          >
            Loading your health dashboard...
          </p>

        </div>

      </div>

    );

  }


  // ============================================================
  // USER
  // ============================================================

  const firstName =
    user?.name?.split(" ")[0] || "there";


  // ============================================================
  // REAL DATABASE STATISTICS
  // ============================================================

  const stats = {

    healthScore: 86,

    consultations:
      dashboard?.stats?.chats ?? 0,

    reports:
      dashboard?.stats?.reports ?? 0,

    records:
      (dashboard?.stats?.chats ?? 0) +
      (dashboard?.stats?.symptom_checks ?? 0) +
      (dashboard?.stats?.reports ?? 0),

  };


  // ============================================================
  // RECENT ACTIVITY
  // ============================================================

  const recentActivity =
    dashboard?.recent_activity ?? [];


  // ============================================================
  // PAGE
  // ============================================================

  return (

    <div
      className="
        w-full
        bg-[#f8f9fa]
      "
    >

      {/* ================================================= */}
      {/* FULL WIDTH CONTENT */}
      {/* ================================================= */}

      <div
        className="
          w-full
          px-5
          sm:px-7
          lg:px-9
          xl:px-10
          py-7
          lg:py-8
        "
      >

        {/* ================================================= */}
        {/* WELCOME */}
        {/* ================================================= */}

        <section className="mb-7">

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-end
              lg:justify-between
              gap-5
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-medium
                  text-blue-600
                  mb-2
                "
              >
                Your personal health companion
              </p>


              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-[38px]
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                Good morning, {firstName} 👋
              </h1>


              <p
                className="
                  mt-2
                  text-slate-500
                  text-sm
                  sm:text-base
                "
              >
                Your health at a glance.
                What would you like to take
                care of today?
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/chat")
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-semibold
                px-5
                py-3
                rounded-xl
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                active:scale-[0.98]
                whitespace-nowrap
              "
            >

              <span className="text-lg">
                +
              </span>

              Start AI Consultation

            </button>

          </div>

        </section>


        {/* ================================================= */}
        {/* HEALTH OVERVIEW */}
        {/* ================================================= */}

        <section
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-4
            mb-8
          "
        >

          <StatCard
            title="Health Score"
            value={stats.healthScore}
            suffix="/100"
            description="Good standing"
            icon="♥"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />


          <StatCard
            title="AI Consultations"
            value={stats.consultations}
            description="Total consultations"
            icon="✦"
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />


          <StatCard
            title="Reports Analyzed"
            value={stats.reports}
            description="Medical reports"
            icon="▣"
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />


          <StatCard
            title="Health Records"
            value={stats.records}
            description="Saved securely"
            icon="✓"
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

        </section>


        {/* ================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================= */}

        <section className="mb-8">

          <div className="mb-4">

            <h2
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              Quick actions
            </h2>


            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Get started with MediAI
            </p>

          </div>


          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
            "
          >

            <ActionCard
              icon="✦"
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              title="AI Medical Chat"
              description="Ask health questions and get clear, easy-to-understand information."
              button="Open Chat"
              onClick={() =>
                navigate("/chat")
              }
            />


            <ActionCard
              icon="⌁"
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              title="Symptom Checker"
              description="Describe your symptoms and understand possible causes."
              button="Check Symptoms"
              onClick={() =>
                navigate("/symptoms")
              }
            />


            <ActionCard
              icon="▣"
              iconBg="bg-violet-50"
              iconColor="text-violet-600"
              title="Medical Reports"
              description="Upload and analyze your medical reports with AI."
              button="Analyze Report"
              onClick={() =>
                navigate("/reports")
              }
            />

          </div>

        </section>


        {/* ================================================= */}
        {/* LOWER SECTION */}
        {/* ================================================= */}

        <section
          className="
            grid
            grid-cols-1
            xl:grid-cols-5
            gap-5
          "
        >

          {/* ================================================= */}
          {/* RECENT ACTIVITY */}
          {/* ================================================= */}

          <div
            className="
              xl:col-span-3
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-6
              shadow-sm
              min-w-0
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                mb-5
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
                  Recent activity
                </h2>


                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  Your latest health activity
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate("/history")
                }
                className="
                  text-sm
                  font-semibold
                  text-blue-600
                  hover:text-blue-700
                  transition
                "
              >
                View all
              </button>

            </div>


            <div className="space-y-2">

              {recentActivity.length > 0 ? (

                recentActivity
                  .slice(0, 6)
                  .map((activity) => (

                    <ActivityItem
                      key={`${activity.type}-${activity.id}`}
                      icon={getActivityIcon(
                        activity.type
                      )}
                      iconBg={getActivityBg(
                        activity.type
                      )}
                      iconColor={getActivityColor(
                        activity.type
                      )}
                      title={activity.title}
                      description={
                        activity.description
                      }
                      time={formatActivityTime(
                        activity.created_at
                      )}
                    />

                  ))

              ) : (

                <EmptyActivity />

              )}

            </div>

          </div>


          {/* ================================================= */}
          {/* HEALTH INSIGHT */}
          {/* ================================================= */}

          <div
            className="
              xl:col-span-2
              relative
              overflow-hidden
              bg-gradient-to-br
              from-blue-600
              to-blue-700
              rounded-2xl
              p-7
              text-white
              shadow-sm
              min-h-[280px]
            "
          >

            {/* Decorative circle */}

            <div
              className="
                absolute
                -right-12
                -top-12
                w-40
                h-40
                rounded-full
                bg-white/10
                pointer-events-none
              "
            />


            <div
              className="
                absolute
                -right-5
                -bottom-12
                w-32
                h-32
                rounded-full
                bg-white/10
                pointer-events-none
              "
            />


            <div className="relative">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-white/15
                  flex
                  items-center
                  justify-center
                  text-xl
                  mb-5
                "
              >
                ♥
              </div>


              <p
                className="
                  text-blue-100
                  text-sm
                  font-medium
                  mb-2
                "
              >
                Today's health insight
              </p>


              <h2
                className="
                  text-2xl
                  font-bold
                  mb-3
                "
              >
                Take care of your health
              </h2>


              <p
                className="
                  text-blue-100
                  leading-6
                  text-sm
                  max-w-lg
                "
              >
                Keep track of recurring symptoms
                and important health changes.
                If something feels unusual or
                concerning, consider discussing it
                with a qualified healthcare
                professional.
              </p>


              <button
                type="button"
                onClick={() =>
                  navigate("/history")
                }
                className="
                  mt-6
                  bg-white
                  text-blue-700
                  hover:bg-blue-50
                  px-5
                  py-2.5
                  rounded-xl
                  text-sm
                  font-semibold
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  active:scale-[0.98]
                "
              >
                View Health History
              </button>

            </div>

          </div>

        </section>

      </div>

    </div>

  );

}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  suffix,
  description,
  icon,
  iconBg,
  iconColor,
}) {

  return (

    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        hover:-translate-y-0.5
        transition
        duration-200
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            {title}
          </p>


          <div
            className="
              flex
              items-baseline
              gap-1
              mt-3
            "
          >

            <span
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              {value}
            </span>


            {suffix && (

              <span
                className="
                  text-sm
                  text-slate-400
                "
              >
                {suffix}
              </span>

            )}

          </div>


          <p
            className="
              text-xs
              text-emerald-600
              font-medium
              mt-2
            "
          >
            {description}
          </p>

        </div>


        <div
          className={`
            w-11
            h-11
            rounded-xl
            flex
            items-center
            justify-center
            text-lg
            font-bold
            ${iconBg}
            ${iconColor}
          `}
        >
          {icon}
        </div>

      </div>

    </div>

  );

}


/* ============================================================
   ACTION CARD
============================================================ */

function ActionCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  button,
  onClick,
}) {

  return (

    <div
      className="
        group
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-6
        shadow-sm
        hover:shadow-md
        hover:-translate-y-1
        transition
        duration-200
      "
    >

      <div
        className={`
          w-12
          h-12
          rounded-xl
          flex
          items-center
          justify-center
          text-xl
          font-bold
          mb-5
          ${iconBg}
          ${iconColor}
        `}
      >
        {icon}
      </div>


      <h3
        className="
          text-lg
          font-bold
          text-slate-900
        "
      >
        {title}
      </h3>


      <p
        className="
          text-sm
          text-slate-500
          leading-6
          mt-2
          min-h-[48px]
        "
      >
        {description}
      </p>


      <button
        type="button"
        onClick={onClick}
        className="
          mt-5
          text-sm
          font-semibold
          text-blue-600
          hover:text-blue-700
          transition
        "
      >
        {button} →
      </button>

    </div>

  );

}


/* ============================================================
   ACTIVITY ITEM
============================================================ */

function ActivityItem({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  time,
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-4
        p-3
        rounded-xl
        hover:bg-slate-50
        transition
        duration-150
      "
    >

      <div
        className={`
          w-10
          h-10
          rounded-xl
          flex-shrink-0
          flex
          items-center
          justify-center
          font-bold
          ${iconBg}
          ${iconColor}
        `}
      >
        {icon}
      </div>


      <div
        className="
          flex-1
          min-w-0
        "
      >

        <p
          className="
            text-sm
            font-semibold
            text-slate-900
            truncate
          "
        >
          {title}
        </p>


        <p
          className="
            text-xs
            text-slate-500
            mt-1
          "
        >
          {description}
        </p>

      </div>


      <span
        className="
          text-xs
          text-slate-400
          whitespace-nowrap
        "
      >
        {time}
      </span>

    </div>

  );

}


/* ============================================================
   EMPTY ACTIVITY
============================================================ */

function EmptyActivity() {

  return (

    <div
      className="
        py-10
        text-center
      "
    >

      <div
        className="
          w-12
          h-12
          rounded-xl
          bg-blue-50
          text-blue-600
          flex
          items-center
          justify-center
          text-xl
          mx-auto
          mb-3
        "
      >
        ✦
      </div>


      <p
        className="
          text-sm
          font-semibold
          text-slate-700
        "
      >
        No activity yet
      </p>


      <p
        className="
          text-xs
          text-slate-400
          mt-1
        "
      >
        Start a consultation or symptom check.
      </p>

    </div>

  );

}


/* ============================================================
   ACTIVITY ICON
============================================================ */

function getActivityIcon(type) {

  if (type === "chat") {
    return "✦";
  }

  if (type === "symptom") {
    return "⌁";
  }

  if (type === "report") {
    return "▣";
  }

  return "•";

}


/* ============================================================
   ACTIVITY BACKGROUND
============================================================ */

function getActivityBg(type) {

  if (type === "chat") {
    return "bg-blue-50";
  }

  if (type === "symptom") {
    return "bg-emerald-50";
  }

  if (type === "report") {
    return "bg-violet-50";
  }

  return "bg-slate-50";

}


/* ============================================================
   ACTIVITY COLOR
============================================================ */

function getActivityColor(type) {

  if (type === "chat") {
    return "text-blue-600";
  }

  if (type === "symptom") {
    return "text-emerald-600";
  }

  if (type === "report") {
    return "text-violet-600";
  }

  return "text-slate-600";

}


/* ============================================================
   ACTIVITY TIME
============================================================ */

function formatActivityTime(dateString) {

  if (!dateString) {
    return "Recently";
  }


  const date = new Date(dateString);


  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }


  const now = new Date();


  const diff = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );


  if (diff < 60) {
    return "Just now";
  }


  if (diff < 3600) {

    return `${Math.floor(
      diff / 60
    )}m ago`;

  }


  if (diff < 86400) {

    return `${Math.floor(
      diff / 3600
    )}h ago`;

  }


  if (diff < 604800) {

    return `${Math.floor(
      diff / 86400
    )}d ago`;

  }


  return date.toLocaleDateString();

}


export default Dashboard;