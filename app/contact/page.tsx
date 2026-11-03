import type { Metadata } from "next";
import PlaceholderForm from "@/components/PlaceholderForm";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <TextPage title="Contact">
      <p>Add Musheer&apos;s phone, email and opening hours here.</p>
      <PlaceholderForm notice="Connect this form to an email or form service before launch.">
        <input placeholder="Name" aria-label="Name" required />
        <input type="email" placeholder="Email" aria-label="Email" required />
        <textarea rows={5} placeholder="Message" aria-label="Message" required />
        <button className="btn">Send message</button>
      </PlaceholderForm>
    </TextPage>
  );
}
