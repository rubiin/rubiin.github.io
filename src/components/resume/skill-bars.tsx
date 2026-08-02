import { Progress } from '@/components/ui/progress'
import type { SkillCategory } from '@/types'

/** Compact static skill bars for the printable resume. */
export function SkillBars({ categories }: { categories: SkillCategory[] }) {
  return (
    <section aria-labelledby="resume-skills" className="mt-10">
      <h2 id="resume-skills" className="text-xl font-semibold tracking-tight">
        Skills
      </h2>
      <div className="mt-4 grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category.name}>
            <h3 className="text-sm font-semibold text-muted-foreground">{category.name}</h3>
            <div className="mt-3 flex flex-col gap-2.5">
              {category.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{skill.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-1.5" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
