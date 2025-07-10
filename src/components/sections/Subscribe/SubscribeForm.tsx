'use client';

import { useActionState } from 'react';
import { subscribeAction } from '@/actions/subscribeAction';
import type { ActionResponse } from '@/actions/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { SubscribeSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

const SubscribeForm = ({ section }: { section: SubscribeSectionFragmentType }) => {
  const [state, formAction, pending] = useActionState<Partial<ActionResponse>, FormData>(
    (state, formData) => {
      return subscribeAction(formData);
    },
    {},
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <form className="flex flex-col md:flex-row gap-4 justify-center w-full" action={formAction}>
        <div className="flex-grow max-w-md">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full py-3 px-4 bg-transparent bg-opacity-20 text-white placeholder-gray-100 border border-white border-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            required
          />
        </div>
        <Button type="submit" variant={'outline'} size={'xl'} disabled={pending}>
          {section.buttonText}
        </Button>
      </form>

      {!pending && state.status === 'success' && (
        <Badge variant="default" className="text-white bg-green-500">
          Success
        </Badge>
      )}

      {!pending && state.status === 'error' && (
        <Badge variant="default" className="text-white bg-red-500">
          {state.error}
        </Badge>
      )}
    </div>
  );
};

export default SubscribeForm;
