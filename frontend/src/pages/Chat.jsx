import { useState } from "react";

import {
  Send,
  User,
  Loader2,
  Sparkles,
  Stethoscope,
  HeartPulse,
  FileText,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import api from "../services/api";


function Chat() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [copiedIndex, setCopiedIndex] = useState(null);


  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const sendMessage = async (e) => {

    if (e) {
      e.preventDefault();
    }

    const text = message.trim();

    if (!text || loading) {
      return;
    }


    // Add user message immediately

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: text,
      },
    ]);


    setMessage("");

    setLoading(true);


    try {

      const response = await api.post(
        "/chat",
        {
          message: text,
        }
      );


      if (response.data.success) {

        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            content: response.data.response,
          },
        ]);

      } else {

        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            content:
              response.data.message ||
              "Unable to generate a response.",
          },
        ]);

      }

    } catch (error) {

      console.error(
        "Chat error:",
        error
      );


      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again.",
        },
      ]);

    } finally {

      setLoading(false);

    }

  };


  // ============================================================
  // NEW / CLEAR CHAT
  // ============================================================

  const clearChat = () => {

    setMessages([]);

    setMessage("");

  };


  // ============================================================
  // QUICK PROMPT
  // ============================================================

  const usePrompt = (text) => {

    setMessage(text);

  };


  // ============================================================
  // COPY MESSAGE
  // ============================================================

  const copyMessage = async (
    content,
    index
  ) => {

    try {

      await navigator.clipboard.writeText(
        content
      );

      setCopiedIndex(index);


      setTimeout(() => {

        setCopiedIndex(null);

      }, 1500);

    } catch (error) {

      console.error(
        "Copy error:",
        error
      );

    }

  };


  return (

    <main
      className="
        h-[calc(100vh-82px)]
        min-h-[600px]
        w-full
        flex
        flex-col
        bg-[#f8f9fb]
        overflow-hidden
      "
    >

      {/* ====================================================== */}
      {/* CHAT HEADER */}
      {/* ====================================================== */}

      <header
        className="
          h-[74px]
          shrink-0
          px-5
          sm:px-8
          lg:px-10
          bg-white
          border-b
          border-slate-200/80
          flex
          items-center
          justify-between
        "
      >

        {/* LEFT */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* MEDICAL AI ICON */}

          <div
            className="
              relative
              w-11
              h-11
              rounded-[14px]
              bg-gradient-to-br
              from-blue-600
              to-indigo-600
              text-white
              flex
              items-center
              justify-center
              shadow-[0_6px_18px_rgba(37,99,235,0.25)]
            "
          >

            <HeartPulse
              size={21}
              strokeWidth={2}
            />


            <div
              className="
                absolute
                -right-1
                -top-1
                w-4
                h-4
                rounded-full
                bg-white
                text-blue-600
                flex
                items-center
                justify-center
                shadow-sm
              "
            >

              <Sparkles
                size={9}
                strokeWidth={2.5}
              />

            </div>

          </div>


          {/* TITLE */}

          <div>

            <h1
              className="
                text-sm
                sm:text-base
                font-bold
                text-slate-900
              "
            >
              AI Medical Chat
            </h1>


            <div
              className="
                flex
                items-center
                gap-1.5
                mt-0.5
              "
            >

              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-emerald-500
                "
              />

              <p
                className="
                  text-[10px]
                  sm:text-xs
                  text-slate-400
                "
              >
                MediAI is ready to help
              </p>

            </div>

          </div>

        </div>


        {/* RIGHT */}

        {messages.length > 0 && (

          <button
            type="button"
            onClick={clearChat}
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-xl
              text-xs
              font-medium
              text-slate-500
              hover:text-red-600
              hover:bg-red-50
              transition
            "
          >

            <span>
              Clear chat
            </span>

            <span
              className="
                text-lg
                leading-none
              "
            >
              ×
            </span>

          </button>

        )}

      </header>


      {/* ====================================================== */}
      {/* CHAT CONTENT */}
      {/* ====================================================== */}

      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          scroll-smooth
        "
      >

        {messages.length === 0 ? (

          /* ==================================================== */
          /* EMPTY STATE */
          /* ==================================================== */

          <div
            className="
              min-h-full
              flex
              items-center
              justify-center
              px-5
              py-8
            "
          >

            <div
              className="
                w-full
                max-w-[850px]
                text-center
              "
            >

              {/* ================================================= */}
              {/* MAIN AI ICON */}
              {/* ================================================= */}

              <div
                className="
                  relative
                  w-[88px]
                  h-[88px]
                  mx-auto
                  mb-7
                "
              >

                {/* Glow */}

                <div
                  className="
                    absolute
                    inset-0
                    rounded-[28px]
                    bg-blue-100
                    scale-110
                    opacity-60
                  "
                />


                {/* Icon */}

                <div
                  className="
                    relative
                    w-[88px]
                    h-[88px]
                    rounded-[28px]
                    bg-gradient-to-br
                    from-blue-600
                    via-blue-600
                    to-indigo-600
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-[0_15px_35px_rgba(37,99,235,0.28)]
                  "
                >

                  <HeartPulse
                    size={34}
                    strokeWidth={1.8}
                  />


                  {/* AI sparkle */}

                  <div
                    className="
                      absolute
                      right-2
                      top-2
                      w-6
                      h-6
                      rounded-full
                      bg-white
                      text-blue-600
                      flex
                      items-center
                      justify-center
                      shadow-md
                    "
                  >

                    <Sparkles
                      size={12}
                      strokeWidth={2.5}
                    />

                  </div>

                </div>

              </div>


              {/* ================================================= */}
              {/* LABEL */}
              {/* ================================================= */}

              <p
                className="
                  text-[10px]
                  sm:text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-blue-600
                "
              >
                Your AI health companion
              </p>


              {/* ================================================= */}
              {/* TITLE */}
              {/* ================================================= */}

              <h2
                className="
                  mt-2
                  text-3xl
                  sm:text-4xl
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                How can I help you?
              </h2>


              {/* ================================================= */}
              {/* DESCRIPTION */}
              {/* ================================================= */}

              <p
                className="
                  max-w-[620px]
                  mx-auto
                  mt-3
                  text-sm
                  sm:text-base
                  leading-6
                  text-slate-500
                "
              >
                Ask MediAI about symptoms,
                medications, health reports,
                or general medical information.
              </p>


              {/* ================================================= */}
              {/* QUICK QUESTIONS */}
              {/* ================================================= */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-3
                  mt-8
                  text-left
                "
              >

                {/* CARD 1 */}

                <PromptCard
                  icon={
                    <Stethoscope
                      size={18}
                    />
                  }
                  title="Understand symptoms"
                  text="What are common causes of headaches?"
                  onClick={() =>
                    usePrompt(
                      "What are common causes of headaches?"
                    )
                  }
                />


                {/* CARD 2 */}

                <PromptCard
                  icon={
                    <HeartPulse
                      size={18}
                    />
                  }
                  title="Check health information"
                  text="What are symptoms of dehydration?"
                  onClick={() =>
                    usePrompt(
                      "What are symptoms of dehydration?"
                    )
                  }
                />


                {/* CARD 3 */}

                <PromptCard
                  icon={
                    <FileText
                      size={18}
                    />
                  }
                  title="General medical advice"
                  text="How can I improve my sleep quality?"
                  onClick={() =>
                    usePrompt(
                      "How can I improve my sleep quality?"
                    )
                  }
                />


                {/* CARD 4 */}

                <PromptCard
                  icon={
                    <MessageCircle
                      size={18}
                    />
                  }
                  title="Ask anything"
                  text="What should I know about a mild fever?"
                  onClick={() =>
                    usePrompt(
                      "What should I know about a mild fever?"
                    )
                  }
                />

              </div>

            </div>

          </div>

        ) : (

          /* ==================================================== */
          /* CONVERSATION */
          /* ==================================================== */

          <div
            className="
              w-full
              max-w-[1000px]
              mx-auto
              px-5
              sm:px-8
              lg:px-10
              py-8
            "
          >

            <div
              className="
                space-y-7
              "
            >

              {messages.map(
                (item, index) => (

                  <ChatMessage
                    key={index}
                    item={item}
                    index={index}
                    copiedIndex={copiedIndex}
                    onCopy={copyMessage}
                  />

                )
              )}


              {/* ================================================= */}
              {/* LOADING */}
              {/* ================================================= */}

              {loading && (

                <div
                  className="
                    flex
                    gap-3
                    animate-[fadeIn_0.25s_ease-out]
                  "
                >

                  {/* AI ICON */}

                  <div
                    className="
                      w-10
                      h-10
                      shrink-0
                      rounded-xl
                      bg-gradient-to-br
                      from-blue-600
                      to-indigo-600
                      text-white
                      flex
                      items-center
                      justify-center
                      shadow-sm
                    "
                  >

                    <HeartPulse
                      size={18}
                    />

                  </div>


                  {/* LOADING BUBBLE */}

                  <div
                    className="
                      bg-white
                      border
                      border-slate-200
                      rounded-2xl
                      rounded-tl-md
                      px-5
                      py-4
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <Loader2
                        size={17}
                        className="
                          animate-spin
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
                        MediAI is thinking...
                      </span>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        )}

      </div>


      {/* ====================================================== */}
      {/* INPUT / COMPOSER */}
      {/* ====================================================== */}

      <div
        className="
          shrink-0
          bg-gradient-to-t
          from-[#f8f9fb]
          via-[#f8f9fb]
          to-transparent
          px-4
          sm:px-6
          lg:px-10
          pb-5
          pt-3
        "
      >

        <form
          onSubmit={sendMessage}
          className="
            max-w-[1000px]
            mx-auto
          "
        >

          {/* ================================================= */}
          {/* INPUT BOX */}
          {/* ================================================= */}

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-[0_5px_25px_rgba(15,23,42,0.07)]
              p-2
              flex
              items-end
              gap-2
              focus-within:border-blue-300
              focus-within:ring-4
              focus-within:ring-blue-50
              transition
            "
          >

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {

                  e.preventDefault();

                  sendMessage(e);

                }

              }}
              placeholder="Ask MediAI anything..."
              disabled={loading}
              rows={1}
              className="
                flex-1
                min-w-0
                resize-none
                bg-transparent
                outline-none
                px-3
                py-3
                text-sm
                text-slate-800
                placeholder:text-slate-400
                max-h-32
              "
            />


            {/* SEND */}

            <button
              type="submit"
              disabled={
                loading ||
                !message.trim()
              }
              className="
                w-11
                h-11
                shrink-0
                rounded-xl
                bg-gradient-to-br
                from-blue-600
                to-indigo-600
                hover:from-blue-700
                hover:to-indigo-700
                text-white
                flex
                items-center
                justify-center
                transition
                duration-200
                hover:-translate-y-0.5
                active:scale-95
                disabled:opacity-40
                disabled:hover:translate-y-0
                disabled:cursor-not-allowed
              "
            >

              {loading ? (

                <Loader2
                  size={18}
                  className="animate-spin"
                />

              ) : (

                <Send
                  size={18}
                />

              )}

            </button>

          </div>


          {/* ================================================= */}
          {/* INPUT FOOTER */}
          {/* ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              px-2
              mt-2
            "
          >

            <p
              className="
                text-[10px]
                text-slate-400
              "
            >
              Enter to send · Shift + Enter for new line
            </p>


            <p
              className="
                hidden
                sm:block
                text-[10px]
                text-slate-400
              "
            >
              AI-generated information
            </p>

          </div>

        </form>

      </div>

    </main>

  );

}


/* ================================================================
   QUICK PROMPT CARD
================================================================ */

function PromptCard({
  icon,
  title,
  text,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className="
        group
        text-left
        p-4
        rounded-2xl
        bg-white
        border
        border-slate-200
        hover:border-blue-300
        hover:shadow-[0_8px_25px_rgba(37,99,235,0.08)]
        hover:-translate-y-0.5
        transition
        duration-200
      "
    >

      <div
        className="
          flex
          items-start
          gap-3
        "
      >

        {/* ICON */}

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
            shrink-0
            group-hover:bg-blue-600
            group-hover:text-white
            transition
          "
        >
          {icon}
        </div>


        {/* TEXT */}

        <div>

          <p
            className="
              text-xs
              font-semibold
              text-slate-800
            "
          >
            {title}
          </p>


          <p
            className="
              text-xs
              text-slate-500
              mt-1
              leading-5
            "
          >
            {text}
          </p>

        </div>

      </div>

    </button>

  );

}


/* ================================================================
   CHAT MESSAGE
================================================================ */

function ChatMessage({
  item,
  index,
  copiedIndex,
  onCopy,
}) {

  const isUser =
    item.role === "user";


  return (

    <div
      className={`
        flex
        gap-3
        ${
          isUser
            ? "justify-end"
            : "justify-start"
        }
        animate-[fadeIn_0.3s_ease-out]
      `}
    >

      {/* ======================================================= */}
      {/* AI AVATAR */}
      {/* ======================================================= */}

      {!isUser && (

        <div
          className="
            relative
            w-10
            h-10
            shrink-0
            rounded-xl
            bg-gradient-to-br
            from-blue-600
            to-indigo-600
            text-white
            flex
            items-center
            justify-center
            shadow-sm
          "
        >

          <HeartPulse
            size={18}
            strokeWidth={2}
          />


          <div
            className="
              absolute
              -right-1
              -top-1
              w-3.5
              h-3.5
              rounded-full
              bg-white
              text-blue-600
              flex
              items-center
              justify-center
              shadow-sm
            "
          >

            <Sparkles
              size={7}
            />

          </div>

        </div>

      )}


      {/* ======================================================= */}
      {/* MESSAGE */}
      {/* ======================================================= */}

      <div
        className={`
          group
          max-w-[88%]
          sm:max-w-[78%]
          flex
          flex-col
          ${
            isUser
              ? "items-end"
              : "items-start"
          }
        `}
      >

        <div
          className={`
            px-5
            py-4
            text-sm
            leading-7

            ${
              isUser
                ? `
                  bg-gradient-to-br
                  from-blue-600
                  to-indigo-600
                  text-white
                  rounded-2xl
                  rounded-tr-md
                  shadow-[0_5px_15px_rgba(37,99,235,0.16)]
                `
                : `
                  bg-white
                  text-slate-700
                  border
                  border-slate-200
                  rounded-2xl
                  rounded-tl-md
                  shadow-sm
                `
            }
          `}
        >

          <ReactMarkdown
            components={{

              h1: ({
                children,
              }) => (

                <h1
                  className={`
                    text-xl
                    font-bold
                    mt-2
                    mb-3
                    ${
                      isUser
                        ? "text-white"
                        : "text-slate-900"
                    }
                  `}
                >
                  {children}
                </h1>

              ),


              h2: ({
                children,
              }) => (

                <h2
                  className={`
                    text-lg
                    font-bold
                    mt-3
                    mb-2
                    ${
                      isUser
                        ? "text-white"
                        : "text-slate-900"
                    }
                  `}
                >
                  {children}
                </h2>

              ),


              h3: ({
                children,
              }) => (

                <h3
                  className={`
                    text-base
                    font-bold
                    mt-3
                    mb-2
                    ${
                      isUser
                        ? "text-white"
                        : "text-slate-900"
                    }
                  `}
                >
                  {children}
                </h3>

              ),


              p: ({
                children,
              }) => (

                <p
                  className="
                    mb-3
                    last:mb-0
                    leading-7
                  "
                >
                  {children}
                </p>

              ),


              ul: ({
                children,
              }) => (

                <ul
                  className="
                    list-disc
                    ml-5
                    mb-3
                    space-y-1
                  "
                >
                  {children}
                </ul>

              ),


              ol: ({
                children,
              }) => (

                <ol
                  className="
                    list-decimal
                    ml-5
                    mb-3
                    space-y-1
                  "
                >
                  {children}
                </ol>

              ),


              li: ({
                children,
              }) => (

                <li className="pl-1">
                  {children}
                </li>

              ),


              strong: ({
                children,
              }) => (

                <strong
                  className="
                    font-bold
                  "
                >
                  {children}
                </strong>

              ),

            }}
          >
            {item.content}
          </ReactMarkdown>

        </div>


        {/* ===================================================== */}
        {/* COPY */}
        {/* ===================================================== */}

        {!isUser && (

          <button
            type="button"
            onClick={() =>
              onCopy(
                item.content,
                index
              )
            }
            className="
              mt-1.5
              ml-1
              opacity-0
              group-hover:opacity-100
              flex
              items-center
              gap-1.5
              text-[10px]
              text-slate-400
              hover:text-blue-600
              transition
            "
          >

            {copiedIndex === index ? (

              <>
                <Check
                  size={12}
                />

                Copied
              </>

            ) : (

              <>
                <Copy
                  size={12}
                />

                Copy
              </>

            )}

          </button>

        )}

      </div>


      {/* ======================================================= */}
      {/* USER AVATAR */}
      {/* ======================================================= */}

      {isUser && (

        <div
          className="
            w-10
            h-10
            shrink-0
            rounded-xl
            bg-slate-900
            text-white
            flex
            items-center
            justify-center
            shadow-sm
          "
        >

          <User
            size={18}
          />

        </div>

      )}

    </div>

  );

}


export default Chat;