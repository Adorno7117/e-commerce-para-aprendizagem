import { z } from "zod";

export const emailSchema = z.string().email().max(191).toLowerCase();

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: emailSchema,
  password: z.string().min(8).max(120)
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(120)
});

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(200),
  password: z.string().min(8).max(120)
});

export const checkoutSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: emailSchema,
  couponCode: z.string().trim().max(60).optional().or(z.literal(""))
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDescription: z.string().trim().min(10).max(255),
  description: z.string().trim().min(20),
  priceCents: z.coerce.number().int().min(100),
  imageUrl: z.string().url().max(500),
  fileKey: z.string().trim().min(3).max(500),
  categoryId: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE"])
});

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(255).optional().or(z.literal(""))
});
