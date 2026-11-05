import type { Metadata } from "next";
import AccountForms from "@/components/account/AccountForms";
import AccountLinks from "@/components/account/AccountLinks";
import FieldwornShell from "@/components/FieldwornShell";
import PhotoHero from "@/components/search/PhotoHero";
import { imageSrc } from "@/lib/images";
import "../shop-brand.css";
import "@/components/account/account.css";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <FieldwornShell className="shop-fw">
      <PhotoHero label="My account" title="Your account" text="Sign in for your orders and saved measurements, or jump straight to your cart and saved pieces." image={imageSrc("images/content/story")} position="50% 40%" />
      <div className="wrap">
        <div className="ac">
          <AccountForms />
          <AccountLinks />
        </div>
      </div>
    </FieldwornShell>
  );
}
