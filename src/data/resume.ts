import type { ResumeData } from '@/types'
import { profile } from './profile'
import { experience } from './experience'
import { education } from './education'
import { certifications } from './certifications'
import { awards } from './awards'
import { skillCategories } from './skills'

export const resumeData: ResumeData = {
  profile,
  experience,
  education,
  certifications,
  awards,
  skills: skillCategories,
}
