'use client';

import { useActionState } from 'react';
import { subscribeAction } from '@/actions/subscribeAction';
import type { ActionResponse } from '@/actions/types';

export const NewsletterSubscribe = () => {
  const [state, formAction, pending] = useActionState<
    Partial<ActionResponse>,
    FormData
  >((_, formData) => subscribeAction(formData), {});

  return (
    <section className="border-line border-y bg-paper py-11">
      <div className="mx-auto max-w-7xl px-5 lg:px-7">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="font-semibold text-purple text-xs uppercase tracking-widest">
              The Newsletter
            </div>
            <h3 className="font-display my-2.5 text-balance font-extrabold text-4xl leading-none tracking-tighter text-ink">
              Publisher tech,{' '}
              <span className="font-serif font-medium text-purple italic">
                every week.
              </span>
            </h3>
            <p className="max-w-md text-base leading-relaxed text-muted-ink">
              A single email per week with the most useful tools for teams
              building enterprise publishing platforms.
            </p>
            <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-muted-ink text-xs">
              <span>
                <strong className="font-semibold text-ink">38,420</strong>{' '}
                subscribers
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <form
              action={formAction}
              className="flex flex-col gap-2 sm:flex-row sm:gap-2"
            >
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@publisher.com"
                className="min-h-11 flex-1 rounded-lg border border-line bg-white px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-ink focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                disabled={pending}
                className="min-h-11 shrink-0 rounded-lg bg-ink px-5 py-3.5 font-semibold text-paper text-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50"
              >
                {pending ? 'Subscribing…' : 'Subscribe →'}
              </button>
            </form>
            {!pending && state.status === 'success' && (
              <div className="font-mono text-xs text-green-600">
                You're subscribed!
              </div>
            )}
            {!pending && state.status === 'error' && (
              <div className="font-mono text-xs text-red-500">
                {state.error}
              </div>
            )}
            {!state.status && (
              <div className="font-mono text-muted-ink text-xs">
                {' '}
                Free · Unsubscribe anytime
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
