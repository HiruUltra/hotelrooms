# SereneStay Hotel

SereneStay Hotel is a production-oriented Next.js hotel booking and management system for a boutique property. It includes a public hotel website, customer accounts, admin operations, room availability checks, bookings, extra charges, invoice snapshots, and PDF invoice downloads.

## Features

- Public homepage, rooms, room details, availability search, and booking flow.
- Credentials-based Auth.js login for customers and administrators.
- Role-protected admin dashboard with server-side authorization.
- Room CRUD with status, AC/type filters, amenities, images, and inactive handling.
- Server-side booking conflict prevention using `newCheckIn < existingCheckOut && newCheckOut > existingCheckIn`.
- Website, walk-in, phone, and admin booking sources.
- Extra charges, payments, invoice builder, finalized invoice locking, and A4 PDF route.
- Hotel settings for name, logo URL, contact details, currency, tax, service charge, prefixes, times, timezone, policy, and footer.
- Mongoose models with enums, indexes, timestamps, and relationships.
- Seed script with admin, customers, 10 rooms, extras, bookings, charges, payment-ready invoices.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Auth.js/NextAuth credentials, MongoDB Atlas, Mongoose, bcrypt, Zod, React Hook Form-ready forms, Cloudinary upload route, jsPDF, date-fns, Lucide React, Recharts-ready dashboard structure, and Sonner.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `MONGODB_URI`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_APP_URL`

## Local Setup

```bash
npm install
npm run seed
npm run dev
```

Open `http://localhost:3000`.

## MongoDB Atlas

Create a free Atlas cluster, add a database user, allow your IP for local development, copy the connection string into `MONGODB_URI`, and keep the database name as `serenestay` or change it in `lib/db.ts`.

## Cloudinary

Create a Cloudinary account, copy the cloud name, API key, and API secret into `.env.local`. The upload API validates file type and size and stores room images under `serenestay/rooms`.

## Admin Account

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then run `npm run seed`. The seed script reads those values and never hard-codes admin credentials.

## Workflow

Customers register, search availability, create a pending website booking, and view their booking in the account area. Admins confirm bookings, create walk-in or phone bookings, add charges, record paid amounts through invoice generation, finalize invoices, download PDFs, and update room or hotel settings.

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add all environment variables from `.env.example`.
4. Ensure MongoDB Atlas allows Vercel connections.
5. Deploy, then run the seed script locally or through a secure one-off job using the same environment variables.

## Verification

Run:

```bash
npm run test
npm run build
```

## Troubleshooting

- Missing `MONGODB_URI`: database pages need a configured MongoDB Atlas connection.
- Login fails: confirm `AUTH_SECRET`, `NEXTAUTH_URL`, and seeded credentials.
- Images fail to upload: confirm Cloudinary variables and accepted JPG, PNG, or WebP file under 5MB.
- PDF fails: the invoice must exist before using the download route.

## Optional Future Improvements

Add payment gateway integration, a richer drag-and-drop calendar, granular admin permissions, email notifications, and a visual Cloudinary uploader component with progress bars.
