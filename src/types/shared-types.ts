import { ZodIssue } from 'zod';

export interface ResponseError {
  message?: string;
}

export interface ActionResponse {
  success: boolean;
  errors?: ZodIssue[];
  videoUrl?: string | null;
}
