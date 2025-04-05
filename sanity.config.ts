'use client';

/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/studio/schema';
import { structure } from './src/studio/structure';
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation';
import { assist } from '@sanity/assist';
import { clientEnv } from '@/env/clientEnv';

// resolveHref() is a convenience function that resolves the URL
// path for different document types and used in the presentation tool.
function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'category':
      return slug ? `/category/${slug}` : undefined;
    case 'person':
      return slug ? `/author/${slug}` : undefined;
    case 'post':
      return slug ? `/blog/${slug}` : undefined;
    case 'page':
      return slug ? `/${slug}` : undefined;
    default:
      console.warn('Invalid document type:', documentType);
      return undefined;
  }
}

// Main Sanity configuration
export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'Sanity Ignite',
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  plugins: [
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        // origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/blog/:slug',
            filter: `_type == "post" && slug.current == $slug || _id == $slug`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          blogPage: defineLocations({
            select: {
              name: 'name',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Blog Page',
                  href: '/blog',
                },
              ],
            }),
          }),
          category: defineLocations({
            select: {
              name: 'firstName' + 'lastName',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href: resolveHref('category', doc?.slug)!,
                },
              ],
            }),
          }),
          page: defineLocations({
            select: {
              name: 'name',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href: resolveHref('page', doc?.slug)!,
                },
              ],
            }),
          }),
          person: defineLocations({
            select: {
              firstName: 'firstName',
              lastName: 'lastName',
              slug: 'slug.current',
            },
            resolve: (doc) => {
              const firstName = doc?.firstName ?? '';
              const lastName = doc?.lastName ?? '';
              return {
                locations: [
                  {
                    title: firstName || lastName ? `${firstName} ${lastName}` : 'Untitled',
                    href: resolveHref('person', doc?.slug)!,
                  },
                ],
              };
            },
          }),
          post: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('post', doc?.slug)!,
                },
                {
                  title: 'Blog page',
                  href: '/blog',
                },
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
          settings: defineLocations({
            locations: [
              {
                title: 'Home',
                href: '/',
              },
            ],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    assist(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
