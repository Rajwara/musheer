import "./btn.css";

type IconKind = "arrow" | "back" | "whatsapp" | "search" | "bag";

const PATHS: Record<IconKind, React.ReactNode> = {
  arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
  back: <path d="M20 12H4M10 6l-6 6 6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  bag: <path d="M5 8h14l1.5 13h-17zM8.5 8V6a3.5 3.5 0 0 1 7 0v2" />,
  whatsapp: (
    <>
      <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
      <path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1-1.2 1.8.8-.3 1.4c-3.5.5-7.7-3.7-7.2-7.2l1.4-.3.8 1.8z" />
    </>
  ),
};

/**
 * Inside of a site button, as on the home page: the label rolls up on hover
 * and a round icon (an arrow by default) sits at the end and turns. Put it in
 * any element with className="btn am-btn" (add am-light on dark backgrounds,
 * am-line for an outlined button, am-back to put the icon first).
 */
export default function BtnContent({ label, icon = "arrow" }: { label: string; icon?: IconKind }) {
  return (
    <>
      <span className="am-roll">
        <span data-t={label}>{label}</span>
      </span>
      <span className={icon === "arrow" || icon === "back" ? "am-ico" : "am-ico am-ico-still"} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {PATHS[icon]}
        </svg>
      </span>
    </>
  );
}
