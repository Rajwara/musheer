import BtnContent from "@/components/ui/BtnContent";
import type { Metadata } from "next";
import PlaceholderForm from "@/components/PlaceholderForm";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <TextPage title="Account">
      <PlaceholderForm notice="Accounts need a store platform or backend before they can work.">
        <input type="email" placeholder="Email" aria-label="Email" required />
        <input type="password" placeholder="Password" aria-label="Password" required />
        <button className="btn am-btn"><BtnContent label="Sign in" /></button>
      </PlaceholderForm>
    </TextPage>
  );
}
