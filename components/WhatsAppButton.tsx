const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l.6.952-1.001 3.648 3.737-.974zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
  </svg>
);

const WHATSAPP_NUMBER = "201009014597";
const MESSAGE = "Hey! I'd like to ask about a product 👋";

const WhatsAppButton = () => {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed bottom-8 right-5 z-[60]
        group
        flex items-center gap-2.5
        bg-[#0A0A0A] text-[#FAFAF7]
        border-3 border-[#0A0A0A]
        px-4 py-3
        text-[12px] font-black uppercase tracking-wide
        shadow-[4px_4px_0_0_#D4FF3D]
        hover:bg-[#25D366] hover:text-[#0A0A0A] hover:border-[#25D366]
        hover:shadow-[4px_4px_0_0_#0A0A0A]
        active:translate-x-[4px] active:translate-y-[4px]
        active:shadow-none
        transition-all duration-150
      "
      style={{ borderWidth: 3 }}
    >
      {/* pulse dot — replaces the rounded ping */}
      <span className="relative flex-shrink-0 w-2 h-2">
        <span className="absolute inset-0 bg-[#D4FF3D] animate-ping group-hover:bg-[#0A0A0A]" />
        <span className="relative block w-2 h-2 bg-[#D4FF3D] group-hover:bg-[#0A0A0A]" />
      </span>

      <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />

      <span className="hidden sm:block">WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
