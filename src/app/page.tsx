import { Hero } from "@/components/hero";
import { ContactAssemble } from "@/components/motion/contact-assemble";
import BlurFade from "@/components/magicui/blur-fade";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { ScrollTimeline } from "@/components/motion/scroll-timeline";
import { SectionHeading } from "@/components/motion/section-heading";
import { SplitText } from "@/components/motion/split-text";
import { TiltCard } from "@/components/motion/tilt-card";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";

const half = Math.ceil(DATA.skills.length / 2);
const SKILL_ROWS = [DATA.skills.slice(0, half), DATA.skills.slice(half)];

export default function Page() {
  return (
    <main className="flex min-h-[100dvh] flex-col space-y-20">
      <Hero />

      <section id="about" className="space-y-5">
        <SectionHeading title="À propos" />
        <ScrollRevealText
          text={DATA.summary}
          className="text-base leading-relaxed md:text-lg"
        />
      </section>

      <section id="work" className="space-y-5">
        <SectionHeading title="Expériences" />
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
        <SectionHeading title="Parcours scolaire" />
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
        <SectionHeading title="Compétences" />
        <div>
          {SKILL_ROWS.map((row, i) => (
            <BlurFade key={i} delay={i * 0.15} inView>
              <VelocityMarquee
                baseVelocity={i === 0 ? -1.5 : 1.5}
                className="py-1"
              >
                {row.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex h-14 min-w-0 flex-1 items-center justify-center sm:h-16"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          data-marquee-pause
                          role="img"
                          aria-label={skill.name}
                          className="group p-2"
                        >
                          <skill.icon
                            color={skill.color}
                            className="size-10 transition-transform duration-300 group-hover:scale-110 sm:size-12"
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{skill.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </VelocityMarquee>
            </BlurFade>
          ))}
        </div>
      </section>

      <section id="projects" className="space-y-8">
        <SectionHeading title="Projets" />
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

      <ContactAssemble />
    </main>
  );
}
