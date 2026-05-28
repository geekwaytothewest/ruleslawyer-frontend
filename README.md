This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Deployment

Deployed to AWS ECS via the **Build and Deploy** GitHub Action (manual `workflow_dispatch`; choose `nonprod` or `prod`). It builds the Docker image (baking in `NEXT_PUBLIC_API_URL` as a build arg), pushes it to the `ruleslawyer-frontend` ECR repo, and updates the `ruleslawyer-frontend` ECS service on the `geekway-{env}` cluster using `.aws/taskdefinition-{env}.json`.

See the full guide: [ruleslawyer-backend/DEPLOYMENT.md](https://github.com/geekwaytothewest/ruleslawyer-backend/blob/main/DEPLOYMENT.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
