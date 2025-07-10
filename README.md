# Ignite for Sanity

A Sanity starter kit providing modern, clean designs for your content-driven websites. Built with Next.js and Tailwind CSS.

Out of the box it includes schema for pages, posts, categories, authors, and global settings. Pages are structured with a page builder that lets you compose a number of components: hero, CTA, post list, subscribe, content, etc.

## Key Dependencies

- Next.js
- Sanity
- Tailwind CSS
- Shadcn/ui
- React
- TypeScript
- Vitest

## Getting Started

### 1. Initialize template with Sanity CLI

```bash
npm create sanity@latest -- --template 10up/sanity-ignite
```

This will install your NPM dependencies and populate the `.env.local` file.

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Open the Project and sign in to Sanity

Open the next app locally at [http://localhost:3000](http://localhost:3000) and the Sanity Studio at [http://localhost:3000/studio](http://localhost:3000/studio).

## Folder Structure

```

🔥 sanity-ignite
├── 📂 src                  # Main source code directory
│ ├── 📂 app                # Next.js application
│ │ ├── 📂 (frontend)       # Frontend routes
│ │ ├── 📂 studio           # Sanity Studio route
│ │ ├── 📂 api              # API routes (Next.js route handlers)
│ ├── 📂 components         # UI components and icons
│ │ ├── 📂 icons            # Custom SVG/icon components
│ │ ├── 📂 ui               # Presentational UI components with no side effects
│ │ ├── 📂 modules          # Components that receive Sanity data and may call server actions
│ │ ├── 📂 sections         # Page builder sections
│ │ ├── 📂 templates        # Page templates
│ ├── 📂 hooks              # Custom react hooks
│ ├── 📂 actions            # Server-side actions
│ ├── 📂 env                # Environment specific functions and `.env` validation
│ ├── 📂 lib                # Shared libraries and integrations
│ │ ├── 📂 sanity           # Sanity integration
│ │ │ ├── 📂 queries        # Sanity GraphQL/GROQ queries
│ │ │ ├── 📂 client         # Sanity client configuration
│ │ ├── 📂 (example)        # Every integration (e.g., CRM, Newsletter SDKs) gets its own subfolder
│ ├── 📂 studio             # Sanity Studio configuration
│ │ ├── 📂 schemas          # Schema definitions for Sanity content models
│ │ ├── 📂 components       # Custom Sanity components
│ │ ├── 📂 plugins          # Custom Sanity plugins
│ │ ├── 📂 structure        # Custom Sanity structure definitions
│ ├── 📂 utils              # Utility functions and TypeScript types
```

### 📂 `src/components` - UI Component Structure

- **`ui/` - Presentational UI Components**

  - This folder contains **pure UI components** that have **no side effects**.
  - Components here can be used **both in client and server components**.
  - **🚫 Do not use:** Sanity types, data fetching, or global state within these components.

- **`modules/` - Components that Accept Sanity Data**

  - These components receive **data from Sanity queries** and might contain logic to manipulate or render that data.
  - No direct data fetching should happen inside these components.
  - They can, however, call **server actions** that fetch or modify data.

- **`sections/` - Page Builder Sections**

  - Large, structured UI sections that form reusable parts of pages.
  - Used to assemble pages dynamically in a CMS-driven way.

- **`templates/` - Page Templates**

  - Higher-level layout structures that can be shared between multiple routes.

- **`icons/` - Custom SVG/Icon Components**
  - Collection of SVG-based components used throughout the UI.
  - Icons should be stored as SVG files and imported as React components. Icons should NOT be added as React components directly.

---

### 📂 `src/lib` - Shared Libraries & Integrations

- **`sanity/` - Sanity Integration**

  - **`queries/`** → Contains all Sanity **GROQ queries** used in the frontend.
  - **`client/`** → Configures the Sanity client and SanityLive client used for API calls

- **`(example)/` - External Service Integrations**
  - Each external service (e.g., CRM, Newsletter SDKs) should have its own **subfolder** under `lib/`.
  - Example: `/lib/newsletter/` for newsletter subscriptions, `/lib/crm/` for CRM integrations.

---

### 📂 `src/studio` - Sanity Studio Configuration

This folder contains everything needed to **configure and customize Sanity Studio**, the headless content operating system used in this project.

- **`schemas/` - Content Models**

  - Defines the schema of content in Sanity (e.g., `Post`, `Author`, `Category`).

- **`components/` - Custom Sanity Components**

  - Custom React components that enhance the Sanity Studio interface.
  - These might include **custom inputs, preview components, or UI overrides**.

- **`plugins/` - Sanity Plugins**

  - Third-party or custom plugins that **extend Sanity’s functionality**.
  - Examples: AI-powered content suggestions, media management, or real-time collaboration tools.

- **`structure/` - Custom Studio Structure**
  - Defines how content is **organized** inside the Sanity Studio UI.
  - Custom menus, navigation rules, and UI layouts are configured here.

## 🌍 Environment Variables (`.env` Files)

The project uses **environment variables** to store **configuration values** that differ between environments (e.g., local development, testing, and production). These variables are stored in `.env` files, which Next.js loads automatically. Read more on the Nex.js Docs [here](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables).

### 📂 Available `.env` Files

| File               | Purpose                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **`.env.local`**   | Stores **local** environment variables. This file is **git-ignored** and should not be committed. |
| **`.env.example`** | A **template** for environment variables. It lists required variables without actual values.      |
| **`.env.test`**    | Contains environment variables used specifically for running **unit tests**.                      |

---

## 🛠️ How to Use `.env` Files

### 1️⃣ **Setting Up Your Local Environment**

Before running the project locally, copy `.env.example` and create a `.env.local` file:

```sh
cp .env.example .env.local
```

Then, **fill in the required values** based on your local setup.

### 2️⃣ **Validation of Environment Variables**

This project uses **valibot** for schema validation of environment variables.
To add a new environment variable:

1. Update the `.env.example` file
2. Add the new variable to the `envSchema` object in `src/env/serverEnv.ts` or `src/env/clientEnv.ts`

### 3️⃣ **Accessing Environment Variables in Code**

All environment variables should be accessed using the `serverEnv` or `clientEnv` objects.

Example:

```ts
const projectId = serverEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;
```

💡 **Public vs. Private Variables:**

- Variables **prefixed with `NEXT_PUBLIC_`** are **exposed to the browser** and can be used in client-side code. Validation of these variables is done in `src/env/clientEnv.ts`.
- Variables **without `NEXT_PUBLIC_`** remain **server-only**. Validation of these variables is done in `src/env/serverEnv.ts`.

### 4️⃣ **Testing with `.env.test`**

When running unit or integration tests, the `.env.test` file is loaded automatically.

---

### 🔒 Best Practices

✔️ **Never commit `.env.local`!** It's ignored by `.gitignore`.  
✔️ **Use `.env.example`** to document required variables without exposing secrets.  
✔️ **Keep private keys and API secrets out of `NEXT_PUBLIC_` variables.**

---

## Linter and Code Formatting

This project uses ESLint and Prettier for code linting and formatting. Run the following commands to lint and format your code:

```bash
npm run lint # Lint the code
```

### Custom ESLint Configurations

This project has custom ESLint rules configured for the following scenarios:

- Sanity Studio
  - `next-sanity` package cannot be imported into the studio. This is a frontend only package.
- Next.js Frontend
  - Assets from the sanity studio or from studio related packages cannot be imported into the frontend. They can only be used in the `sanity.config.ts` file or in the `src/studio` folder. This is to prevent the frontend from loading unoptimized studio assets.

### Analyze Bundle Sizes

Sanity Ignite uses the `@next/bundle-analyzer` plugin to analyze the bundle sizes of the project. To run the bundle analyzer, run the following command:

```bash
ANALYZE=true npm run next:build
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
