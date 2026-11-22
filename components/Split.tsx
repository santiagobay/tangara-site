import { Fragment, type ElementType } from "react";

/**
 * Splits a headline into masked words for GSAP reveals.
 * Syntax: words separated by spaces, `*word*` = serif italic accent, `|` = line break.
 */
export default function Split({
  text,
  tag = "h2",
  className = "",
  mode = "rise",
}: {
  text: string;
  tag?: ElementType;
  className?: string;
  mode?: "rise" | "intro";
}) {
  const Tag = tag;
  const plain = text.replace(/[*|]/g, "").replace(/\s+/g, " ").trim();
  return (
    <Tag className={`split ${className}`} data-split={mode} aria-label={plain}>
      {text.split(" ").map((w, i) =>
        w === "|" ? (
          <br key={i} aria-hidden="true" />
        ) : (
          <Fragment key={i}>
            <span className="w" aria-hidden="true">
              <span className="wi">{w.startsWith("*") ? <em>{w.replace(/\*/g, "")}</em> : w}</span>
            </span>{" "}
          </Fragment>
        ),
      )}
    </Tag>
  );
}

/** Paragraph whose words light up as you scroll (animated by <Motion />). */
export function ScrubWords({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`scrub ${className}`} data-scrub-words>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((w, i) => (
        <span className="sw" key={i} aria-hidden="true">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
