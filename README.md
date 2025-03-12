# Sanity Ignite by Fueled

A Sanity.io starter kit providing modern, clean designs for your content-driven websites. Built with Next.js and Tailwind CSS.

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

### 1. Clone the Repository

```bash
git clone git@github.com:10up/sanity-ignite.git
```

### 2. Install Dependencies

Navigate to the project directory using `cd <project-name>`, switch to the correct Node.js version using `nvm use`, and install the dependencies using `npm i`.

```bash
nvm use # Use the correct Node.js version
npm i # Install dependencies
```

### 3. Set Up Environment Variables

Duplicate the `.env.example` file and rename it to `.env.local`. Fill in the required environment variables.

```bash
cp .env.example .env.local
```

Replace the placeholders with your own Sanity API key, project ID and dataset name.

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Project and sign in to Sanity

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
│ │ ├── 📂 ui               # Presentational UI components with no side effects
│ │ ├── 📂 modules          # Components that receive Sanity data and may call server actions
│ │ ├── 📂 sections         # Page builder sections
│ │ ├── 📂 templates        # Page templates
│ │ ├── 📂 icons            # Custom SVG/icon components
│ ├── 📂 actions            # Server-side actions and utility functions
│ ├── 📂 env                # Environment-specific Next.js pages
│ ├── 📂 lib                # Shared libraries and integrations
│ │ ├── 📂 sanity           # Sanity CMS integration
│ │ │ ├── 📂 queries        # Sanity GraphQL/GROQ queries
│ │ │ ├── 📂 client         # Sanity client configuration
│ │ ├── 📂 (example)        # Every integration (e.g., CRM, Newsletter SDKs) gets its own subfolder
│ ├── 📂 utils              # Utility functions and TypeScript types
│ ├── 📂 studio             # Sanity Studio configuration
│ │ ├── 📂 schemas          # Schema definitions for Sanity content models
│ │ ├── 📂 components       # Custom Sanity components
│ │ ├── 📂 plugins          # Custom Sanity plugins
│ │ ├── 📂 structure        # Custom Sanity structure definitions
├── 📄 .env.local           # Local environment variables
├── 📄 .env.example         # Template for `.env.local`
├── 📄 .env.test            # Environment variables used in unit tests
├── 📄 .eslintrc.json       # ESLint configuration
├── 📄 .eslintignore        # Files ignored by ESLint
├── 📄 .gitignore           # Files ignored by Git
├── 📄 .prettierignore      # Files ignored by Prettier
├── 📄 .prettierrc          # Prettier configuration
├── 📄 next-env.d.ts        # TypeScript declarations for Next.js
├── 📄 postcss.config.mts   # PostCSS configuration
├── 📄 Readme.md            # Project documentation
├── 📄 sanity-typegen.json  # Sanity TypeScript type generator config
├── 📄 sanity.cli.ts        # Sanity CLI configuration
├── 📄 sanity.config.ts     # Sanity project configuration
├── 📄 tsconfig.json        # TypeScript configuration
├── 📄 watch-typegen.ts     # Script for watching Sanity type generation

```

## 📝 Folder Descriptions

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

  - Higher-level layout structures for different types of pages.

- **`icons/` - Custom SVG/Icon Components**
  - Collection of SVG-based components used throughout the UI.

---

### 📂 `src/lib` - Shared Libraries & Integrations

- **`sanity/` - Sanity CMS Integration**

  - **`queries/`** → Contains all Sanity **GROQ queries** used in the frontend.
  - **`client/`** → Configures the Sanity client and SanityLive client used for API calls

- **`(example)/` - External Service Integrations**
  - Each external service (e.g., CRM, Newsletter SDKs) should have its own **subfolder** under `lib/`.
  - Example: `/lib/newsletter/` for newsletter subscriptions, `/lib/crm/` for CRM integrations.

---

### 📂 `src/studio` - Sanity Studio Configuration

This folder contains everything needed to **configure and customize Sanity Studio**, the headless CMS used in this project.

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

---

## ✅ Best Practices

1. **Keep It Up to Date** - Update this documentation when the folder structure changes.
2. **Follow Conventions** - Maintain clear separation of concerns between folders.
3. **Avoid Mixing Concerns** - UI components should stay isolated from data logic.
4. **Use Subfolders When Needed** - Keep `lib/`, `components/`, and `studio/` organized wi

### Sanity Studio

The Sanity Studio is available at [http://localhost:3000/studio](http://localhost:3000/studio). You'll need to:

1. Create a Sanity.io account if you haven't already
2. Configure your project settings in the Sanity dashboard
3. Add content through the Studio interface

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity.io Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)

```

```
