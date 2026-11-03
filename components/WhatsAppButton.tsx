import { HOME_VISIT_URL } from "@/lib/brand";
import Icon from "./Icon";

export default function WhatsAppButton() {
  return (
    <a className="wa-float" href={HOME_VISIT_URL} target="_blank" rel="noopener noreferrer">
      <Icon name="whatsapp" size={20} />
      <span>Home Tailoring</span>
    </a>
  );
}
