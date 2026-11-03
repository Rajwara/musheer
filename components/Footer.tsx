import Link from "next/link";
import { footerNav } from "@/lib/navigation";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="cols">
          <div>
            <span className="logo">Musheer</span>
            <p style={{ marginTop: 12, maxWidth: 320 }}>Arabic menswear for daily wear and special occasions.</p>
          </div>
          {footerNav.map((col) => (
            <div key={col.heading}>
              <h4>{col.heading}</h4>
              {col.links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="legal">&copy; {new Date().getFullYear()} Musheer. All rights reserved.</div>
      </div>
    </footer>
  );
}
