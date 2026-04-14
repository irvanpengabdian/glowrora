import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters"),
  description: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      return val;
    },
    z
      .string()
      .trim()
      .max(2000, "Description must be at most 2000 characters")
      .optional(),
  ),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const updateCampaignSchema = createCampaignSchema.extend({
  campaignId: z.string().uuid("Invalid campaign"),
});

export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
