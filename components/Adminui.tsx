

export const P = ({ t, s }: { t: string; s?: string }) => (
  <div className="mb-[26px]">
    <h1 className="text-[20px] font-semibold text-[#111] m-0 leading-tight">
      {t}
    </h1>
    {s && <p className="text-[16px] text-[#888] mt-1 m-0">{s}</p>}
  </div>
);

export const Card = ({
  children,
  className,
  dir
}: {
  children: React.ReactNode;
  className?: string;
  dir?: string;
}) => (
  <div
    dir={dir}
    className={`bg-white rounded-lg border border-[#e8e8e8] p-6 ${className || ""}`}
  >
    {children}
  </div>
);


export const Sec = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[16px] font-bold text-[#aaa]  uppercase mb-[14px] mt-0">
    {children}
  </p>
);

const inputClasses =
  "w-full h-[38px] border border-[#0f1117] rounded-[6px] px-[11px] text-[16px] text-[#fff] bg-[#0f1117] outline-none box-border focus:border-[#0f1117] transition-colors";

export function Input({
  label,
  className,
  ...p
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="mb-3">
      {label && (
        <label className="text-[16px] text-[#666] block mb-1">{label}</label>
      )}
      <input className={`${inputClasses} ${className || ""}`} {...p} />
    </div>
  );
}

export function Textarea({
  label,
  className,
  ...p
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div className="mb-3">
      {label && (
        <label className="text-[16px] text-[#666] block mb-1">{label}</label>
      )}
      <textarea
        className={`${inputClasses} h-[80px] py-[9px] resize-vertical ${className || ""}`}
        {...p}
      />
    </div>
  );
}

export function Select({
  label,
  options,
  className,
  ...p
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string | number; label: string }[];
}) {
  return (
    <div className="mb-3">
      {label && (
        <label className="text-[16px] text-[#666] block mb-1">{label}</label>
      )}
      <select
        className={`${inputClasses} cursor-pointer ${className || ""}`}
        {...p}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Btn({
  children,
  variant = "primary",
  loading,
  className,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  loading?: boolean;
}) {

  const variants = {
    primary: "bg-[#111] text-white border-none",
    ghost: "bg-white text-[#111] border border-[#ddd]",
    danger: "bg-[#dc2626] text-white border-none",
  };

  return (
    <button
      disabled={loading}
      className={`
        ${variants[variant]}
         px-5  rounded-[6px] text-[16px] font-medium transition-opacity
        ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer active:opacity-80"}
        ${className || ""}
      `}
      {...p}
    >
      {loading ? "جارٍ التحميل..." : children}
    </button>
  );
}

export function Toast({
  msg,
  type,
}: {
  msg: string;
  type: "success" | "error";
}) {
  if (!msg) return null;
  return (
    <div
      className={`
        p-[10px_13px] rounded-[6px] text-[16px] mb-[14px] border
        ${
          type === "success"
            ? "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]"
            : "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]"
        }
      `}
    >
      {msg}
    </div>
  );
}
