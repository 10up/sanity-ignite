'use server';

import { ActionResponse } from "./types";
import * as v from 'valibot';

const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Please enter your email.'),
  v.email('The email is badly formatted.'),
);

const subscribeAction = async (formData: FormData): Promise<ActionResponse> => {
  'use server';

  try {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const email = v.parse(EmailSchema, formData.get('email'));

    // Add your newsletter signup logic here

    return {
      status: 'success',
      error: null,
    }
  } catch (error: unknown) {
    if (v.isValiError(error)) {
      return {
        status: 'error',
        error: error.message
      }
    }

    return {
      status: 'error',
      error: 'An unknown error occurred.'
    }
  }
}

export default subscribeAction;