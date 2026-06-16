interface EyebrowProps {
  label: string;
  centered?: boolean;
  dark?: boolean;
}

export default function Eyebrow({ label, centered, dark }: EyebrowProps) {
  const lineColor = dark ? "bg-gold-500" : "bg-gold-600";
  const textColor = dark ? "text-gold-500" : "text-gold-700";
  return (
    <div className={`inline-flex items-center gap-[11px] ${centered ? "justify-center" : ""}`}>
      <span className={`w-[26px] h-px ${lineColor}`} />
      <span className={`text-[11px] font-bold tracking-[0.16em] uppercase ${textColor}`}>
        {label}
      </span>
      {centered && <span className={`w-[26px] h-px ${lineColor}`} />}
    </div>
  );
}
