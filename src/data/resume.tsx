import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Gnimdou BODJONA",
  initials: "BG",
  // À remplacer par le nom de domaine une fois le site déployé
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  location: "Lomé, Togo",
  role: "Développeur Frontend",
  description:
    "Développeur frontend & freelance. Je transforme des idées en interfaces soignées, rapides et agréables à utiliser.",
  summary:
    "Étudiant en fin de cycle de Licence Professionnelle en Génie Logiciel à [IPNet Institute of Technology](https://ipnetuniversity.com/#/), je me concentre sur le développement frontend et la création d'interfaces web et mobiles. J'ai co-développé [DIGITALTAXE](#projects), une plateforme primée pour la digitalisation fiscale des mairies, conçu [AGRI_LINK](#projects) pour le secteur agricole et travaillé sur [Economiz+](https://economizplus.com/), une application de gestion de finances personnelles déjà en ligne. Je suis ouvert aux collaborations freelance pour transformer vos idées en produits numériques fonctionnels et efficaces.",
  avatarUrl: "/me1.png",
  cvUrl: "/cv-gnimdou-bodjona.pdf",
  skills: [
    "React",
    "Angular",
    "TypeScript",
    "Flutter",
    "Python",
    "Django",
    "Django REST Framework",
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "MySQL",
    "Git",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Accueil" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "gnimdoubodjona@gmail.com",
    whatsapp: "https://wa.me/22896007539",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/gnimdoubodjona",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/gnimdou-tr%C3%A9sor-bodjona-97aa65270/",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/Gnimdou_Tresor",
        icon: Icons.x,
        navbar: true,
      },
      WhatsApp: {
        name: "WhatsApp",
        url: "https://wa.me/22896007539",
        icon: Icons.whatsapp,
        navbar: true,
      },
      Email: {
        name: "Email",
        url: "mailto:gnimdoubodjona@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "GUPS",
      href: "",
      badges: ["Stage"],
      location: "Lomé, Togo",
      title: "Développeur d'applications",
      logoUrl: "",
      start: "Mars 2026",
      end: "Aujourd'hui",
      description:
        "Stage en tant que développeur d'applications : conception et développement de fonctionnalités web et mobiles au sein de l'équipe technique.",
    },
    {
      company: "Freelance · Cliente Denise",
      href: "",
      badges: ["Freelance"],
      location: "Lomé, Togo",
      title: "Développeur full-stack",
      logoUrl: "",
      start: "Déc 2024",
      end: "Mars 2025",
      description:
        "Première mission freelance : conception d'une application de mise en relation entre les acteurs du secteur agricole (éleveurs, prestataires et vétérinaires).",
    },
  ],

  education: [
    {
      school: "IPNet Institute of Technology",
      href: "https://ipnetuniversity.com/#/",
      degree: "Licence Professionnelle en Génie Logiciel",
      logoUrl: "/ipnet.webp",
      start: "2022",
      end: "Aujourd'hui",
    },
    {
      school: "Lycée Moderne de Sokodé",
      href: "https://www.facebook.com/lysoko/?locale=fr_FR",
      degree: "Baccalauréat deuxième partie, Série C4",
      logoUrl: "/lysoko.webp",
      start: "2019",
      end: "2022",
    },
  ],

  projects: [
    {
      title: "Economiz+",
      href: "https://economizplus.com/",
      dates: "En ligne",
      active: true,
      description:
        "Application de gestion de finances personnelles en FCFA : suivi des opérations, budgets, dettes et épargnes, avec rappels d'échéances et une offre Premium.",
      technologies: [],
      links: [
        {
          type: "Site web",
          href: "https://economizplus.com/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/economiz.png",
      video: "",
    },
    {
      title: "AGRI_LINK",
      href: "https://github.com/gnimdoubodjona/AgriLinkWebDeployement",
      dates: "Mai 2025 - Août 2025",
      active: true,
      description:
        "Solution numérique facilitant la mise en relation entre agriculteurs, éleveurs et vétérinaires.",
      technologies: ["Spring Boot", "Angular", "Flutter", "MySQL", "Cloudflare"],
      links: [
        {
          type: "Source",
          href: "https://github.com/gnimdoubodjona/AgriLinkWebDeployement",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://res.cloudinary.com/djt1pixgy/video/upload/v1760662337/agrilink_demo1_ypbif3.mp4",
    },
    {
      title: "DigitalTaxe",
      href: "https://github.com/gnimdoubodjona/GestionImpotsTaxes2",
      dates: "Oct 2023 - Sep 2024",
      active: true,
      description:
        "Plateforme web développée en binôme pour digitaliser la collecte des impôts et taxes des mairies. Projet récompensé lors de la journée portes ouvertes d'IPNet.",
      technologies: ["Django", "MySQL", "Bootstrap", "Git"],
      links: [
        {
          type: "Source",
          href: "https://github.com/gnimdoubodjona/GestionImpotsTaxes2",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/digitalTaxe.jpg",
      video: "",
    },
  ],
} as const;
