import { useLocation, useNavigate } from "react-router-dom";


function Sidebar({
  isOpen = false,
  onClose = () => {},
}) {

  const navigate = useNavigate();
  const location = useLocation();


  const sections = [

    {
      title: "Overview",

      items: [

        {
          label: "Dashboard",
          path: "/dashboard",
          icon: DashboardIcon,
        },

      ],
    },


    {
      title: "AI Health",

      items: [

        {
          label: "AI Medical Chat",
          path: "/chat",
          icon: ChatIcon,
          badge: "AI",
        },

        {
          label: "Symptom Checker",
          path: "/symptoms",
          icon: ActivityIcon,
        },

        {
          label: "Medical Reports",
          path: "/reports",
          icon: ReportIcon,
        },

      ],
    },


    {
      title: "Health Management",

      items: [

        {
          label: "Medicines",
          path: "/medicines",
          icon: MedicineIcon,
        },

        {
          label: "Prescriptions",
          path: "/prescription",
          icon: PrescriptionIcon,
        },

        {
          label: "Health History",
          path: "/history",
          icon: HistoryIcon,
        },

      ],
    },

  ];


  const navigateTo = (path) => {

    navigate(path);

    onClose();

  };


  return (
    <>

      {/* ================================================= */}
      {/* MOBILE BACKDROP */}
      {/* ================================================= */}

      {isOpen && (

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="
            fixed
            inset-0
            bg-black/20
            backdrop-blur-sm
            z-40
            lg:hidden
          "
        />

      )}


      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside
        className={`
          fixed
          lg:relative
          left-0
          top-0
          z-50
          lg:z-auto

          w-[285px]
          lg:w-[270px]

          h-full
          min-h-full

          bg-[#f3f3f1]

          border-r
          border-slate-200/70

          flex
          flex-col

          transition-transform
          duration-300
          ease-out

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* ================================================= */}
        {/* LOGO */}
        {/* ================================================= */}

        <div
          className="
            px-6
            pt-7
            pb-6
          "
        >

          <button
            type="button"
            onClick={() =>
              navigateTo("/dashboard")
            }
            className="
              flex
              items-center
              gap-3
              group
            "
          >

            {/* Logo */}

            <div
              className="
                w-12
                h-12
                rounded-[16px]
                bg-white
                border
                border-slate-200
                shadow-sm
                flex
                items-center
                justify-center
                text-slate-900
                group-hover:scale-[1.03]
                transition
              "
            >

              <div
                className="
                  relative
                  w-7
                  h-7
                  rounded-[9px]
                  border-[2px]
                  border-slate-800
                "
              >

                <span
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    w-[2px]
                    h-5
                    bg-slate-800
                  "
                />

                <span
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    h-[2px]
                    w-5
                    bg-slate-800
                  "
                />

              </div>

            </div>


            {/* Brand */}

            <div className="text-left">

              <h1
                className="
                  text-[20px]
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                MediAI
              </h1>

              <p
                className="
                  text-[10px]
                  text-slate-400
                  mt-0.5
                "
              >
                Personal health companion
              </p>

            </div>

          </button>

        </div>


        {/* ================================================= */}
        {/* NAVIGATION */}
        {/* ================================================= */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-4
            pb-5
          "
        >

          {sections.map((section) => (

            <div
              key={section.title}
              className="mb-7"
            >

              <p
                className="
                  px-3
                  mb-2
                  text-[11px]
                  uppercase
                  tracking-[0.14em]
                  font-semibold
                  text-slate-400
                "
              >
                {section.title}
              </p>


              <div className="space-y-1">

                {section.items.map((item) => {

                  const active =
                    location.pathname === item.path;

                  const Icon = item.icon;


                  return (

                    <button
                      type="button"
                      key={item.path}
                      onClick={() =>
                        navigateTo(item.path)
                      }
                      className={`
                        relative
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-3
                        rounded-[14px]
                        text-left
                        transition-all
                        duration-200
                        group

                        ${
                          active
                            ? `
                              bg-white
                              text-slate-900
                              shadow-[0_3px_12px_rgba(0,0,0,0.07)]
                              border
                              border-slate-200/70
                            `
                            : `
                              text-slate-500
                              hover:text-slate-900
                              hover:bg-white/70
                            `
                        }
                      `}
                    >

                      {/* Icon */}

                      <span
                        className={`
                          w-9
                          h-9
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                          transition

                          ${
                            active
                              ? "bg-slate-100 text-slate-900"
                              : "text-slate-400 group-hover:text-slate-700"
                          }
                        `}
                      >

                        <Icon />

                      </span>


                      {/* Label */}

                      <span
                        className={`
                          text-[16px]
                          ${
                            active
                              ? "font-semibold"
                              : "font-medium"
                          }
                        `}
                      >
                        {item.label}
                      </span>


                      {/* Badge */}

                      {item.badge && (

                        <span
                          className="
                            ml-auto
                            text-[9px]
                            font-bold
                            text-blue-600
                            bg-blue-50
                            px-1.5
                            py-0.5
                            rounded-md
                          "
                        >
                          {item.badge}
                        </span>

                      )}


                      {/* Active arrow */}

                      {active && (

                        <span
                          className="
                            ml-auto
                            text-slate-400
                          "
                        >
                          ›
                        </span>

                      )}

                    </button>

                  );

                })}

              </div>

            </div>

          ))}

        </nav>


        {/* ================================================= */}
        {/* BOTTOM */}
        {/* ================================================= */}

        <div
          className="
            px-4
            pb-5
          "
        >

          {/* AI Card */}

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-[18px]
              p-4
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                mb-3
              "
            >

              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                "
              >
                ✦
              </div>


              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-emerald-600
                  bg-emerald-50
                  px-2
                  py-1
                  rounded-full
                "
              >
                Online
              </span>

            </div>


            <p
              className="
                text-xs
                font-semibold
                text-slate-800
              "
            >
              MediAI Assistant
            </p>


            <p
              className="
                text-[10px]
                text-slate-400
                leading-4
                mt-1
              "
            >
              Ask questions about your
              health anytime.
            </p>


            <button
              type="button"
              onClick={() =>
                navigateTo("/chat")
              }
              className="
                w-full
                mt-3
                py-2
                rounded-xl
                bg-slate-900
                text-white
                text-[11px]
                font-semibold
                hover:bg-slate-800
                transition
              "
            >
              Start consultation
            </button>

          </div>


          <p
            className="
              text-[9px]
              text-slate-400
              text-center
              mt-4
            "
          >
            MediAI • Your health companion
          </p>

        </div>

      </aside>

    </>
  );
}


/* ============================================================
   ICON SYSTEM
============================================================ */

function IconBase({ children }) {

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );

}


function DashboardIcon() {

  return (
    <IconBase>

      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />

    </IconBase>
  );

}


function ChatIcon() {

  return (
    <IconBase>

      <path
        d="
          M20 11.5
          a8 8 0 0 1-8 8
          9 9 0 0 1-4-.9
          L4 20l1.5-3.8
          A8 8 0 1 1 20 11.5Z
        "
      />

      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />

    </IconBase>
  );

}


function ActivityIcon() {

  return (
    <IconBase>

      <path
        d="
          M3 12h4l2-7
          4 14 2-7h6
        "
      />

    </IconBase>
  );

}


function ReportIcon() {

  return (
    <IconBase>

      <path
        d="
          M6 3h8l4 4v14H6z
        "
      />

      <path d="M14 3v5h5" />

      <path d="M9 13h6" />
      <path d="M9 17h4" />

    </IconBase>
  );

}


function MedicineIcon() {

  return (
    <IconBase>

      <path
        d="
          M6.5 4.5
          a4 4 0 0 1 5.7 0l7.3 7.3
          a4 4 0 0 1-5.7 5.7
          L6.5 10.2
          a4 4 0 0 1 0-5.7Z
        "
      />

      <path d="m9 7 8 8" />

    </IconBase>
  );

}


function PrescriptionIcon() {

  return (
    <IconBase>

      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2"
      />

      <path d="M9 7h6" />
      <path d="M9 11h6" />
      <path d="M9 15h3" />

    </IconBase>
  );

}


function HistoryIcon() {

  return (
    <IconBase>

      <path
        d="
          M3 12
          a9 9 0 1 0 3-6.7
        "
      />

      <path d="M3 4v5h5" />

      <path d="M12 7v5l3 2" />

    </IconBase>
  );

}


export default Sidebar;