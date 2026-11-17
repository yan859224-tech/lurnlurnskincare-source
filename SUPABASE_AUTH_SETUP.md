# Optional real customer authentication — Supabase Auth

The app runs in demo mode without credentials. You can replace browser-only demo identity with actual email/password authentication for testing by enabling Supabase Auth.

1. Create a Supabase project and enable email provider under Authentication → Providers.
2. Copy **Project URL** and **publishable/anon** key from project API settings.
3. Duplicate `.env.example` into `.env` in the project root.
4. Set `VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co` and `VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY`.
5. Run `npm.cmd run dev` again to pick up the variables.
6. Register an email and verify it if email confirmation is required. Login with password.

**Caution:** Only the authentication is connected. Orders and addresses are still local demo browser data. Do not interpret this as a production-ready store.

For production, build a real database schema, row-level security, ownership checks, role-protected admin, server-side product price and stock validation, inventory reservation, and order creation on a server. For online payments, integrate a sandbox checkout, confirm signed callbacks and payment status server-side, and only then mark an order paid.

Never place `service_role`, gateway secret, API key, or HMAC signing secret in frontend environment variables. `VITE_*` is public.
