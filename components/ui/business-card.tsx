"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/site.config";
import "./business-card.css";

export function BusinessCard() {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // No-scroll fit guard (progressive enhancement): scale the card down if it's
    // taller than the viewport. The card is already visible without this.
    const fitCard = () => {
      const natural = card.offsetHeight; // unscaled (transforms don't affect offsetHeight)
      if (!natural) return;
      const baseScale =
        parseFloat(getComputedStyle(card).getPropertyValue("--base-scale")) || 1;
      const avail = window.innerHeight - 32;
      let fit = Math.min(1, avail / (natural * baseScale));
      fit = Math.max(0.5, fit);
      card.style.setProperty("--fit", fit.toFixed(4));
    };

    fitCard();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitCard).catch(() => {});
    }
    window.addEventListener("resize", fitCard);
    window.addEventListener("load", fitCard);

    return () => {
      window.removeEventListener("resize", fitCard);
      window.removeEventListener("load", fitCard);
    };
  }, []);

  return (
    <div className="card-scope">
      <article ref={cardRef} className="card">
        {/* Banner — radial gradient behind the avatar */}
        <div className="card__banner" />

        {/* Body — solid dark for legibility */}
        <div className="card__body">
          <div className="card__avatar-wrap">
            <div
              className="avatar"
              role="img"
              aria-label={siteConfig.name}
              style={{ backgroundImage: `url(${siteConfig.avatar})` }}
            />
          </div>

          <h1 className="name">
            {siteConfig.name}
            <span className="verified" aria-label="Verified" role="img">
              <svg viewBox="0 0 22 22" aria-hidden="true" focusable="false">
                <path
                  fill="var(--accent)"
                  d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z"
                />
                <path
                  fill="#fff"
                  d="M9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                />
              </svg>
            </span>
          </h1>
          <p className="handle">@{siteConfig.handle}</p>

          <p className="bio">{siteConfig.bio}</p>

          {siteConfig.ventures.length > 0 && (
            <nav className="ventures" aria-label="Ventures">
              {siteConfig.ventures.map((venture) => (
                <a
                  key={venture.name}
                  className="venture"
                  href={venture.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="venture__row">
                    <span className="venture__name">{venture.name}</span>
                    <span className="venture__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                  <span className="venture__desc">{venture.description}</span>
                </a>
              ))}
            </nav>
          )}

          <nav className="socials" aria-label="Social links">
            {siteConfig.socials.x && (
              <a
                className="social"
                href={siteConfig.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
              </a>
            )}
            {siteConfig.socials.telegram && (
              <a
                className="social"
                href={siteConfig.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <path
                    d="M21.5 3.5 11.25 13.75M21.5 3.5l-6.4 18-3.85-7.75L3.5 9.9l18-6.4z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
            {siteConfig.socials.instagram && (
              <a
                className="social"
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <rect
                    x="2.5"
                    y="2.5"
                    width="19"
                    height="19"
                    rx="5.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.4" cy="6.6" r="1.25" fill="currentColor" />
                </svg>
              </a>
            )}
            {siteConfig.socials.linkedin && (
              <a
                className="social"
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.25 8h4.5v14H.25V8zm7.13 0h4.31v1.92h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.5v-6.18c0-1.47-.03-3.37-2.05-3.37-2.06 0-2.37 1.6-2.37 3.26V22H7.38z"
                  />
                </svg>
              </a>
            )}
            {siteConfig.socials.github && (
              <a
                className="social"
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
                  />
                </svg>
              </a>
            )}
            {siteConfig.email && (
              <a
                className="social"
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <rect
                    x="2.5"
                    y="4.75"
                    width="19"
                    height="14.5"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M3.5 6.5l8.5 6.25L20.5 6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </nav>
        </div>
      </article>
    </div>
  );
}
