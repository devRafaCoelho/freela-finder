import * as yup from 'yup';

export const searchSchema = yup.object({
  includeTech: yup
    .array()
    .of(yup.string().trim().min(1))
    .min(1, 'Informe ao menos uma tecnologia')
    .required(),
  excludeTech: yup.array().of(yup.string().trim()),
  intentTerms: yup.array().of(yup.string().trim()),
  keyword: yup.string().trim(),
  strictMode: yup.boolean().default(true),
  region: yup.string().nullable(),
  maxAgeDays: yup.number().min(1).max(90).default(14),
  sources: yup.array().of(yup.string()),
  minMatchScore: yup.number().min(0).max(100).default(25),
  pitchTemplate: yup.string().trim(),
});
