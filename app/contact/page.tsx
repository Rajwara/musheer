import type { Metadata } from "next";
import Link from "next/link";
import { Socials } from "@/components/Footer";
import Icon from "@/components/Icon";
import PlaceholderForm from "@/components/PlaceholderForm";
import PageBanner from "@/components/PageBanner";
import { HOME_VISIT_URL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/lib/brand";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageBanner image="images/pages/contact" eyebrow="We are here to help" title="Contact us" />
      <div className="wrap narrow">
      <div className="contact-list">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" /> <span>WhatsApp {PHONE_DISPLAY}</span>
        </a>
        <a href={`tel:${PHONE_TEL}`}>
          <Icon name="phone" /> <span>Call {PHONE_DISPLAY}</span>
        </a>
        <Link href="/branches">
          <Icon name="pin" /> <span>Visit one of our 13 branches</span>
        </Link>
        <a href={HOME_VISIT_URL} target="_blank" rel="noopener noreferrer">
          <Icon name="home" /> <span>Book a home tailoring visit</span>
        </a>
      </div>
      <div style={{ margin: "6px 0 30px" }}>
        <Socials />
      </div>
      <h2 style={{ fontSize: 26, marginBottom: 14 }}>Send us a message</h2>
      <PlaceholderForm notice="Connect this form to an email or form service before launch. Until then, please message us on WhatsApp.">
        <input placeholder="Name" aria-label="Name" required />
        <input type="email" placeholder="Email" aria-label="Email" required />
        <textarea rows={5} placeholder="Message" aria-label="Message" required />
        <button className="btn">Send message</button>
      </PlaceholderForm>
      </div>
    </>
  );
}
