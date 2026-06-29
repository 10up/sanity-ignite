'use server';

import { z } from 'zod';
import type { ActionResponse } from './types';

const EmailSchema = z
  .string()
  .min(1, 'Please enter your email.')
  .email('The email is badly formatted.');

export const subscribeAction = async (
  formData: FormData
): Promise<ActionResponse> => {
  'use server';

  try {
    // biome-ignore lint/correctness/noUnusedVariables: starter code
    const email = EmailSchema.parse(formData.get('email'));

    // Add your newsletter signup logic here

    return {
      status: 'success',
      error: null,
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        status: 'error',
        error: error.issues[0]?.message ?? 'Invalid input.',
      };
    }

    return {
      status: 'error',
      error: 'An unknown error occurred.',
    };
  }
};
