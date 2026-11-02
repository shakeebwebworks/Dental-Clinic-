import { MessageCircle, Phone } from "lucide-react";
import { clinic } from "../../data/clinicData";

export default function FloatingActions() {
  const message = encodeURIComponent("Hello, I would like to book a dental appointment.");
  return (
    <>
      <a
        href={`https://wa.me/${clinic.whatsapp}?text=${message}`}
        className="float-btn float-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
      <a href={`tel:${clinic.phoneLink}`} className="float-btn float-call" aria-label="Call the clinic">
        <Phone size={26} />
      </a>
    </>
  );
}
