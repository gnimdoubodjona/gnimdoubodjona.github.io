import { Hero } from "@/components/hero";
import { Icons } from "@/components/icons";
import BlurFade from "@/components/magicui/blur-fade";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { ScrollTimeline } from "@/components/motion/scroll-timeline";
import { SectionHeading } from "@/components/motion/section-heading";
import { SplitText } from "@/components/motion/split-text";
import { TiltCard } from "@/components/motion/tilt-card";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";

const half = Math.ceil(DATA.skills.length / 2);
const SKILL_ROWS = [DATA.skills.slice(0, half), DATA.skills.slice(half)];

export default function Page() {
  return (
    <main className="flex min-h-[100dvh] flex-col space-y-20">
      <Hero />

      <section id="about" className="space-y-5">
        <SectionHeading index="01" title="À propos" />
        <ScrollRevealText
          text={DATA.summary}
          className="text-base leading-relaxed md:text-lg"
        />
      </section>

      <section id="work" className="space-y-5">
        <SectionHeading index="02" title="Expériences" />
        <ScrollTimeline>
          {DATA.work.map((work) => (
            <BlurFade key={work.company} inView>
              <ResumeCard
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                badges={work.badges}
                period={`${work.start} - ${work.end}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </ScrollTimeline>
      </section>

      <section id="education" className="space-y-5">
        <SectionHeading index="03" title="Parcours scolaire" />
        <ScrollTimeline>
          {DATA.education.map((education) => (
            <BlurFade key={education.school} inView>
              <ResumeCard
                href={education.href}
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                subtitle={education.degree}
                period={`${education.start} - ${education.end}`}
              />
            </BlurFade>
          ))}
        </ScrollTimeline>
      </section>

      <section id="skills" className="space-y-5">
        <SectionHeading index="04" title="Compétences" />
        <div className="space-y-2">
          {SKILL_ROWS.map((row, i) => (
            <VelocityMarquee key={i} baseVelocity={i === 0 ? -2 : 2}>
              {row.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="glass whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium"
                >
                  {skill}
                </Badge>
              ))}
            </VelocityMarquee>
          ))}
        </div>
      </section>

      <section id="projects" className="space-y-8">
        <SectionHeading index="05" title="Projets" />
        <div className="space-y-3">
          <SplitText
            as="h2"
            trigger="view"
            text="Quelques-uns de mes travaux"
            className="font-display text-3xl font-bold leading-tight sm:text-4xl"
          />
          <BlurFade inView>
            <p className="text-pretty text-muted-foreground md:text-lg/relaxed">
              Du site vitrine à l&apos;application web complète, en passant par
              le mobile et les API : voici les projets dont je suis le plus
              fier.
            </p>
          </BlurFade>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DATA.projects.map((project) => (
            <TiltCard key={project.title}>
              <ProjectCard
                href={project.href}
                title={project.title}
                description={project.description}
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
              />
            </TiltCard>
          ))}
        </div>
      </section>

      <section id="contact" className="pb-24">
        <BlurFade inView>
          <div className="glass rounded-3xl px-5 py-12 text-center sm:px-10">
            <span className="font-mono text-xs text-muted-foreground">
              06 · Contact
            </span>
            <SplitText
              as="h2"
              trigger="view"
              text="Parlons de votre projet"
              className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl"
            />
            <p className="mx-auto mt-4 max-w-[460px] text-pretty text-muted-foreground md:text-lg/relaxed">
              Une idée, une mission freelance ou simplement une question ?
              Écrivez-moi, je réponds rapidement.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href={DATA.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                <Icons.whatsapp className="size-4" />
                WhatsApp
              </Link>
              <Link
                href={`mailto:${DATA.contact.email}`}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "glass glass-interactive min-w-0 gap-2 px-4"
                )}
              >
                <Icons.email className="size-4 shrink-0" />
                <span className="truncate">{DATA.contact.email}</span>
              </Link>
            </div>
          </div>
        </BlurFade>
      </section>
    </main>
  );
}
