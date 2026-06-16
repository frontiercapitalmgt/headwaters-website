import Link from "next/link";

type Variant = "primary" | "secondary" | "accent";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-navy-900 text-white border border-navy-900 hover:bg-navy-800 hover:border-navy-800",
  secondary:
    "bg-white text-navy-900 border border-navy-300 hover:bg-navy-50 hover:border-navy-400",
  accent:
    "bg-gold-600 text-navy-900 border border-gold-600 hover:bg-gold-500 hover:border-gold-500",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-5 text-[13px]",
  md: "h-11 px-6 text-[14px]",
  lg: "h-[52px] px-7 text-[15px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  onClick,
  children,
  className = "",
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold tracking-[0.03em] uppercase rounded transition-colors duration-150 cursor-pointer";
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
