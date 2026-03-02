import { z } from 'zod';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function createResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function successResponse<T>(data?: T, message?: string, status = 200): Response {
  return createResponse({ success: true, data, message }, status);
}

export function errorResponse(error: string, status = 400): Response {
  return createResponse({ success: false, error }, status);
}

export async function validateRequest<T extends z.ZodType>(
  schema: T,
  data: unknown
): Promise<{ success: true; data: z.infer<T> } | { success: false; error: string }> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return { success: false, error: firstError?.message || 'Validation failed' };
  }

  return { success: true, data: result.data };
}

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.email('Invalid email format'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
