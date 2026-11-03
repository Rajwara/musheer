import type { Metadata } from "next";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = { title: "Stores" };

export default function StoresPage() {
  return (
    <TextPage title="Stores">
      <p>Add shop addresses, hours and map links here, or remove this page if the store is online only.</p>
    </TextPage>
  );
}
