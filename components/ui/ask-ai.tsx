"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/site.config";
import "./ask-ai.css";

// Pre-filled question built from site.config.ts, URL-encoded once.
const ventureList = siteConfig.ventures
  .map((v) => `${v.name} (${v.url.replace(/^https?:\/\//, "")})`)
  .join(" and ");
const PROMPT =
  `Tell me about ${siteConfig.name} (@${siteConfig.handle})` +
  (ventureList ? `, involved with ${ventureList}` : "") +
  `. Check the site ${siteConfig.siteUrl.replace(/^https?:\/\//, "")} for more on them and what they are building.`;
const Q = encodeURIComponent(PROMPT);

const MODELS = [
  { name: "ChatGPT", url: `https://chatgpt.com/?q=${Q}`, Logo: ChatGPTLogo },
  { name: "Perplexity", url: `https://www.perplexity.ai/search?q=${Q}`, Logo: PerplexityLogo },
  { name: "Google AI", url: `https://www.google.com/search?udm=50&q=${Q}`, Logo: GoogleAiLogo },
];

export function AskAi() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const closePopup = useCallback(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      setOpen(false);
      setClosing(false);
      buttonRef.current?.focus();
    };
    if (reduced) {
      finish();
      return;
    }
    setClosing(true);
    window.setTimeout(finish, 200);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
        return;
      }
      if (e.key === "Tab") {
        const pills = Array.from(
          overlayRef.current?.querySelectorAll<HTMLElement>("[data-pill]") ?? []
        );
        if (!pills.length) return;
        const first = pills[0];
        const last = pills[pills.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    // focus the first pill once it's painted
    const raf = window.requestAnimationFrame(() => {
      overlayRef.current?.querySelector<HTMLElement>("[data-pill]")?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      window.cancelAnimationFrame(raf);
    };
  }, [open, closePopup]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="askai-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setClosing(false);
          setOpen(true);
        }}
      >
        Ask AI
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={overlayRef}
              className={`askai-overlay${closing ? " askai-overlay--closing" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-label={`Ask an AI about ${siteConfig.name}`}
              onClick={(e) => {
                if (e.target === e.currentTarget) closePopup();
              }}
            >
              <div className="askai-list">
                {MODELS.map((m, i) => {
                  const Logo = m.Logo;
                  return (
                    <a
                      key={m.name}
                      data-pill=""
                      className="askai-pill"
                      style={{ animationDelay: `${250 + i * 70}ms` }}
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => closePopup()}
                    >
                      <Logo />
                      <span>{m.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

/* --- Model logos ---
   All three are the official SVGs supplied in the project, inlined verbatim.
   ChatGPT/OpenAI uses `currentColor` (monochrome); Perplexity and Google are
   full color. */

function ChatGPTLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  );
}

function PerplexityLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z"
        fill="#22B8CD"
        fillRule="nonzero"
      />
    </svg>
  );
}

// Official Google "G" (google-color.svg), inlined verbatim. width/height dropped
// so the pill CSS sizes it like the other logos.
function GoogleAiLogo() {
  return (
    <svg viewBox="-3 0 262 262" aria-hidden="true">
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </svg>
  );
}
