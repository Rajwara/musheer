import Link from "next/link";
import TextPage from "@/components/TextPage";

export default function NotFound() {
  return (
    <TextPage title="Page not found">
      <p>
        That page does not exist.{" "}
        <Link href="/" style={{ borderBottom: "1px solid" }}>
          Back to the shop
        </Link>
      </p>
    </TextPage>
  );
}
