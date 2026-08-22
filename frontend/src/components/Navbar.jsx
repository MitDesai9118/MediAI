import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";


function Navbar({ onMenuClick }) {

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loggingOut, setLoggingOut] =
    useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);


  // ============================================================
  // USER
  // ============================================================

  const firstName =
    user?.name?.split(" ")[0] || "User";


  const initials =
    user?.name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";


  // ============================================================
  // PAGE TITLES
  // ============================================================

  const titles = {

    "/dashboard": [
      "Dashboard",
      "Your health at a glance",
    ],

    "/chat": [
      "AI Medical Chat",
      "Your personal health conversation",
    ],

    "/symptoms": [
      "Symptom Checker",
      "Understand your symptoms",
    ],

    "/reports": [
      "Medical Reports",
      "Analyze and manage your reports",
    ],

    "/medicines": [
      "Medicines",
      "Manage your medications",
    ],

    "/prescription": [
      "Prescriptions",
      "Your prescription records",
    ],

    "/history": [
      "Health History",
      "Your recent health activity",
    ],

    "/profile": [
      "Profile",
      "Manage your personal information",
    ],

  };


  const current =
    titles[location.pathname] ||
    titles["/dashboard"];


  // ============================================================
  // SEARCH PAGES
  // ============================================================

  const searchPages = [

    {
      name: "Dashboard",
      description: "Your health overview",
      path: "/dashboard",
    },

    {
      name: "AI Medical Chat",
      description: "Talk with MediAI",
      path: "/chat",
    },

    {
      name: "Symptom Checker",
      description: "Check your symptoms",
      path: "/symptoms",
    },

    {
      name: "Medical Reports",
      description: "Upload and analyze reports",
      path: "/reports",
    },

    {
      name: "Medicines",
      description: "Manage your medicines",
      path: "/medicines",
    },

    {
      name: "Prescriptions",
      description: "View prescriptions",
      path: "/prescription",
    },

    {
      name: "Health History",
      description: "View your health history",
      path: "/history",
    },

    {
      name: "Profile",
      description: "Manage your profile",
      path: "/profile",
    },

  ];


  const filteredPages =
    searchQuery.trim() === ""
      ? searchPages
      : searchPages.filter((page) =>
          `${page.name} ${page.description}`
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )
        );


  // ============================================================
  // CLOSE SEARCH / PROFILE
  // ============================================================

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }


      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // ============================================================
  // SEARCH KEYBOARD
  // ============================================================

  const handleSearchKeyDown = (event) => {

    if (event.key === "Escape") {

      setSearchOpen(false);
      setSearchQuery("");

      return;

    }


    if (
      event.key === "Enter" &&
      filteredPages.length > 0
    ) {

      navigate(
        filteredPages[0].path
      );

      setSearchOpen(false);
      setSearchQuery("");

    }

  };


  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = async () => {

    try {

      setLoggingOut(true);

      await api.post(
        "/auth/logout"
      );

      navigate(
        "/login",
        {
          replace: true,
        }
      );

      window.location.reload();

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    } finally {

      setLoggingOut(false);

    }

  };


  return (

    <header
      className="
        h-[82px]
        flex
        items-center
        justify-between
        px-5
        sm:px-7
        lg:px-9
        bg-[#f7f7f5]
        border-b
        border-slate-200/70
        flex-shrink-0
      "
    >

      {/* ================================================= */}
      {/* LEFT */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        {/* MOBILE MENU */}

        <button
          type="button"
          onClick={onMenuClick}
          className="
            lg:hidden
            w-10
            h-10
            rounded-xl
            bg-white
            border
            border-slate-200
            flex
            items-center
            justify-center
            text-slate-600
            shadow-sm
          "
        >

          <MenuIcon />

        </button>


        <div>

          <h1
            className="
              text-xl
              sm:text-2xl
              font-semibold
              tracking-tight
              text-slate-900
            "
          >
            {current[0]}
          </h1>

          <p
            className="
              hidden
              sm:block
              text-xs
              text-slate-400
              mt-1
            "
          >
            {current[1]}
          </p>

        </div>

      </div>


      {/* ================================================= */}
      {/* RIGHT */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        {/* ================================================= */}
        {/* SEARCH */}
        {/* ================================================= */}

        <div
          ref={searchRef}
          className="
            relative
          "
        >

          <div
            className="
              flex
              items-center
              h-10
              w-[170px]
              sm:w-[210px]
              rounded-xl
              bg-white
              border
              border-slate-200
              px-3
              gap-2
              focus-within:border-blue-400
              focus-within:ring-2
              focus-within:ring-blue-50
              transition
            "
          >

            <SearchIcon />


            <input
              type="text"
              value={searchQuery}
              onFocus={() =>
                setSearchOpen(true)
              }
              onChange={(event) => {

                setSearchQuery(
                  event.target.value
                );

                setSearchOpen(true);

              }}
              onKeyDown={
                handleSearchKeyDown
              }
              placeholder="Search"
              className="
                flex-1
                min-w-0
                bg-transparent
                outline-none
                text-xs
                text-slate-700
                placeholder:text-slate-400
              "
            />


            <span
              className="
                hidden
                sm:block
                text-[9px]
                text-slate-300
                border
                border-slate-200
                rounded
                px-1.5
                py-0.5
              "
            >
              /
            </span>

          </div>


          {/* SEARCH RESULTS */}

          {searchOpen && (

            <div
              className="
                absolute
                right-0
                top-12
                w-[280px]
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                p-2
                z-[100]
              "
            >

              <div
                className="
                  px-3
                  py-2
                  text-[10px]
                  uppercase
                  tracking-wider
                  font-semibold
                  text-slate-400
                "
              >
                {searchQuery
                  ? "Search results"
                  : "Quick navigation"}
              </div>


              {filteredPages.length > 0 ? (

                <div className="space-y-1">

                  {filteredPages.map(
                    (page) => (

                      <button
                        key={page.path}
                        type="button"
                        onClick={() => {

                          navigate(
                            page.path
                          );

                          setSearchOpen(
                            false
                          );

                          setSearchQuery(
                            ""
                          );

                        }}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          text-left
                          p-2.5
                          rounded-xl
                          hover:bg-slate-50
                          transition
                        "
                      >

                        <div
                          className="
                            w-9
                            h-9
                            rounded-lg
                            bg-slate-100
                            flex
                            items-center
                            justify-center
                            text-slate-500
                            flex-shrink-0
                          "
                        >
                          <SearchResultIcon />
                        </div>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              text-xs
                              font-semibold
                              text-slate-800
                            "
                          >
                            {page.name}
                          </p>

                          <p
                            className="
                              text-[10px]
                              text-slate-400
                              mt-0.5
                            "
                          >
                            {page.description}
                          </p>

                        </div>


                        <span
                          className="
                            text-slate-300
                          "
                        >
                          →
                        </span>

                      </button>

                    )
                  )}

                </div>

              ) : (

                <div
                  className="
                    py-7
                    text-center
                  "
                >

                  <div
                    className="
                      text-2xl
                      mb-2
                    "
                  >
                    🔎
                  </div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      text-slate-700
                    "
                  >
                    Nothing found
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-slate-400
                      mt-1
                    "
                  >
                    Try another search
                  </p>

                </div>

              )}

            </div>

          )}

        </div>


        {/* ================================================= */}
        {/* PROFILE */}
        {/* ================================================= */}

        <div
          ref={profileRef}
          className="relative"
        >

          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                !profileOpen
              )
            }
            className="
              flex
              items-center
              gap-2
              h-10
              px-1.5
              pr-3
              rounded-xl
              bg-white
              border
              border-slate-200
              hover:bg-slate-50
              transition
            "
          >

            <div
              className="
                w-8
                h-8
                rounded-lg
                bg-slate-900
                text-white
                flex
                items-center
                justify-center
                text-[10px]
                font-semibold
              "
            >
              {initials}
            </div>


            <span
              className="
                hidden
                sm:block
                text-xs
                font-semibold
                text-slate-700
              "
            >
              {firstName}
            </span>


            <ChevronIcon />

          </button>


          {/* PROFILE DROPDOWN */}

          {profileOpen && (

            <div
              className="
                absolute
                right-0
                top-12
                w-56
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-xl
                p-2
                z-[100]
              "
            >

              <div
                className="
                  p-3
                  rounded-xl
                  bg-slate-50
                  mb-1
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                  "
                >
                  {user?.name || "User"}
                </p>

                <p
                  className="
                    text-xs
                    text-slate-400
                    mt-1
                    truncate
                  "
                >
                  {user?.email || ""}
                </p>

              </div>


              <button
                type="button"
                onClick={() => {

                  setProfileOpen(false);

                  navigate("/profile");

                }}
                className="
                  w-full
                  text-left
                  px-3
                  py-2.5
                  rounded-xl
                  text-sm
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                Profile
              </button>


              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
                className="
                  w-full
                  text-left
                  px-3
                  py-2.5
                  rounded-xl
                  text-sm
                  text-red-600
                  hover:bg-red-50
                  disabled:opacity-50
                "
              >
                {loggingOut
                  ? "Signing out..."
                  : "Sign out"}
              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );

}


/* ============================================================
   ICONS
============================================================ */

function MenuIcon() {

  return (

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >

      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />

    </svg>

  );

}


function SearchIcon() {

  return (

    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >

      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />

    </svg>

  );

}


function SearchResultIcon() {

  return (

    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >

      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />

    </svg>

  );

}


function ChevronIcon() {

  return (

    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="m6 9 6 6 6-6" />

    </svg>

  );

}


export default Navbar;