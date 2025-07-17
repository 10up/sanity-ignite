'use server';

import * as v from 'valibot';
import type { ActionResponse } from './types';

const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Please enter your email.'),
  v.email('The email is badly formatted.'),
);

export const subscribeAction = async (formData: FormData): Promise<ActionResponse> => {
  'use server';

  try {
    // biome-ignorelint/correctness/noUnusedVariables: starter code
    const email = v.parse(EmailSchema, formData.get('email'));

    // Add your newsletter signup logic here

    return {
      status: 'success',
      error: null,
    };
  } catch (error: unknown) {
    if (v.isValiError(error)) {
      return {
        status: 'error',
        error: error.message,
      };
    }

    return {
      status: 'error',
      error: 'An unknown error occurred.',
    };
  }
};
