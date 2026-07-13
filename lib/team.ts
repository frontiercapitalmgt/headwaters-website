export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  role2?: string; // optional second title line
  excerpt: string; // short line for the About card
  bio: string[]; // full bio, one entry per paragraph
  linkedin?: string;
  photo?: string; // optional path in /public; falls back to initials
}

export const team: TeamMember[] = [
  {
    slug: "graham-conran",
    name: "Graham Conran",
    role: "Managing Director, Frontier Angels and Frontier Funds 3-5",
    role2: "Fund Manager, Headwaters Seed Stage Fund I",
    photo: "/team/graham-conran.png",
    linkedin: "https://www.linkedin.com/in/grahamconran/",
    excerpt:
      "Managing Director of Frontier Angels, blending startup leadership with over a decade of corporate finance at JPMorgan and Nomura.",
    bio: [
      "Graham Conran is Managing Director of Frontier Angels. He joined Frontier Angels and Frontier Fund 5 after four years with a Bozeman-based technology company where, initially as CFO and then as Co-CEO, he guided the firm through its first commercial product launch and positioned it for sale to a private equity firm.",
      "Before that, he co-founded TAG Asia, a boutique investment advisory firm that became part of the Alberleen Group, an impact investment platform backed by U.S. and international family offices. Earlier, he spent over a decade in corporate finance at JPMorgan and Nomura in the Financial Sponsors and Leveraged Finance groups, structuring and syndicating leveraged buyout financing for global private equity firms in the U.S. and Asia.",
      "Graham brings a blend of startup and corporate finance experience along with a broad network of senior executives across investment banking, private equity, and venture capital.",
    ],
  },
  {
    slug: "isaac-henslee",
    name: "Isaac Henslee",
    role: "Founder, Ennoble Design",
    excerpt:
      "Founder of Ennoble Design, with two decades leading first-principles product development in scientific instrumentation.",
    bio: [
      "Isaac Henslee is the founder of Ennoble Design, a Bozeman-based engineering firm focused on scientific instrumentation and advanced technical products. He has spent two decades leading first-principles-driven product development, supporting early-stage technology companies including Montana Instruments and Blackmore Analytics.",
      "With a background in mechanical engineering, Isaac's domain expertise includes technical product architecture, scientific instrumentation design, and technical startup management, including building and mentoring high-performing technical teams. His technical specialties span electron microscopy, nano-positioning systems, cryogenics (optical, low-vibration, and measurement integration), photonics integration, and high-voltage system design.",
      "His network and his firm's technical expertise can support portfolio companies with design, prototyping, product architecture reviews, and productization of core IP to accelerate time-to-market.",
    ],
  },
  {
    slug: "gene-kuntz",
    name: "Gene Kuntz",
    role: "General Manager, Montana Instruments",
    excerpt:
      "Technology executive with 35+ years scaling and turning around engineering businesses; General Manager of Montana Instruments.",
    linkedin: "https://www.linkedin.com/in/gene-kuntz-73412066",
    bio: [
      "Gene Kuntz is a technology executive with over 35 years of leadership experience across engineering, operations, product management, and P&L responsibility. He currently serves as General Manager of Montana Instruments (part of the Atlas Copco Group) in Bozeman, MT, leading all aspects of the business following its acquisition.",
      "He specializes in turning around and scaling technology businesses: at Montana Instruments he increased revenue from $10M to nearly $16M in 18 months (CAGR >20%) by rebuilding the leadership team, overhauling operations, relaunching the ERP system, and strengthening culture and processes. Previously, as General Manager at MKS Instruments, he grew the business from $33M to $45M (CAGR >10%) through product strategy and global expansion.",
      "His expertise includes strategic planning, M&A integration, international sales, new product development, operational excellence, and building high-performing teams. He holds an MBA in Management/Finance from Utah State University and a B.S. in Electrical Engineering from Montana State University, where he also served as Adjunct Professor.",
    ],
  },
  {
    slug: "john-neumeier",
    name: "John Neumeier",
    role: "Professor & Department Head, MSU Physics",
    excerpt:
      "Professor and Department Head of Physics at Montana State University, and a Fellow of the American Physical Society.",
    linkedin: "https://www.linkedin.com/in/john-j-neumeier-a578272ab",
    bio: [
      "John Neumeier has been a Professor of Physics at Montana State University since 2002 and currently serves as Department Head. He received his Ph.D. from UC San Diego in 1990 for work on high-temperature superconductivity and has held appointments at the University of Munich, Los Alamos National Laboratory, Florida Atlantic University, Argonne National Laboratory, and the University of São Paulo.",
      "His research focuses on the synthesis of novel materials, single-crystal growth, and the study of their physical properties — including crystal and magnetic structures, electrical and thermal transport, superconductivity, and thermodynamic properties such as magnetism, specific heat, and thermal expansion. He is a Fellow of the American Physical Society.",
    ],
  },
  {
    slug: "justin-simmonds",
    name: "Justin Simmonds",
    role: "Manufacturing Specialist",
    excerpt:
      "Machinist and first employee of Montana Instruments, with a hands-on eye for evaluating early-stage technology.",
    bio: [
      "Justin Simmonds is a machinist and manufacturing specialist who was the first employee of Montana Instruments, where he helped develop novel manufacturing techniques and implement them in production. He led the machine shop and served as the company's safety officer.",
      "His skills include SolidWorks modeling, design, sheet-metal design, and welding. A graduate of Bozeman High School, Justin brings a hands-on manufacturing perspective and a practical eye for evaluating early-stage technology.",
    ],
  },
  {
    slug: "michael-simmonds",
    name: "Michael Simmonds",
    role: "Physicist & Founder",
    excerpt:
      "Condensed-matter physicist, holder of twenty patents, and founder of six companies including Quantum Design.",
    linkedin: "https://www.linkedin.com/in/michael-simmonds-38a404142",
    bio: [
      "Michael B. Simmonds holds a Ph.D. in Condensed Matter Physics from the University of California and completed postdoctoral work at NIST Boulder. He has authored twelve journal articles in superconductivity and precision instrumentation and holds twenty patents in cryogenics, quantum interference, and physical-property measurement.",
      "He has founded six companies, including Quantum Design, Inc., which sold for $200M. His honors include the 2016 IEEE Award for Significant Contributions in the Field of Applied Superconductivity and a 2023 R&D 100 Award for the FusionScope SEM/AFM instrument.",
    ],
  },
];

export function getMember(slug: string): TeamMember | undefined {
  return team.find((m) => m.slug === slug);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}
