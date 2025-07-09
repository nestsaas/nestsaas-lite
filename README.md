This is [NestSaaS](https://nestsaas.com) Lite project, a modern SaaS framework for building AI SaaS applications.

## Features

- Authentication & Authorization - Authentication, authorization with Auth.js, Comprehensive user roles and permissions, and user management
- Payment Processing with Stripe - Subscription and one-time purchase, including webhooks and subscriptions management, following Stripe best practices
- Credits Support - Subscription-based and one-time purchase credits, consume credits to use AI services
- Modern Tech Stack - Built with Next.js, React, Tailwind CSS, PostgreSQL/Prisma, Shadcn UI, Auth.js, Resend
- Responsive Design - Beautiful UI that works on all devices
- Blog / Documentation - A polished blog system powered by Content Collections and Markdown — designed to help you showcase your product and rank higher on search engines
- SEO Optimization - Built-in tools for better search engine visibility
- File Upload & Storage - A powerful File Upload, Storage support Local, Cloud Storage like AWS S3, Cloudflare R2, and more
- Admin Panel - Manage media library, users, payments, subscriptions, and more — all from a centralized Super Admin Panel


## Getting Started

First, run the development server:

1. Copy .env.example to .env and fill in the values

2. Run the following commands:

```bash
npx prisma db push

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Stripe local development

stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
