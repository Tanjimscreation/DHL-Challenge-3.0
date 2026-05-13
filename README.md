# ResolvIQ - DHL Incident Management System

An AI-Enhanced Incident Reporting & Resolution System for DHL logistics operations, built with Next.js 14 and Supabase.

## Features

- **Authentication**: Secure login/signup with Supabase Auth
- **Dashboard**: Real-time incident statistics and management
- **Incident Reporting**: AI-powered incident creation with file attachments
- **Status Tracking**: Complete incident lifecycle management
- **Role-based Access**: Reporter, Resolver, and Admin roles
- **Modern UI**: DHL-branded interface with Tailwind CSS
- **Animations**: Smooth transitions with Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resolviq
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your Supabase project:
- Create a new Supabase project
- Run the SQL schema provided below
- Update your environment variables with your Supabase credentials

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id uuid references auth.users(id) primary key,
  name text,
  email text,
  role text check (role in ('Reporter', 'Resolver', 'Admin')),
  employee_id text,
  created_at timestamp default now()
);

-- Incidents table
CREATE TABLE incidents (
  id text primary key,
  title text not null,
  description text not null,
  department text not null,
  severity text check (severity in ('Low', 'Medium', 'High', 'Critical')),
  status text check (status in ('Open', 'Assigned', 'In Progress', 'Resolved', 'Closed')),
  reporter_name text not null,
  reporter_role text not null,
  reporter_id uuid references profiles(id),
  recommended_action text,
  attachments text[] default '{}',
  duplicate boolean default false,
  created_at timestamp default now(),
  date text not null
);

-- Incident history table
CREATE TABLE incident_history (
  id uuid primary key default gen_random_uuid(),
  incident_id text references incidents(id) on delete cascade,
  status text not null,
  actor text not null,
  timestamp text not null,
  created_at timestamp default now()
);

-- Logs table
CREATE TABLE logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  file_name text,
  status text not null,
  message text,
  created_at timestamp default now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view all incidents" ON incidents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Reporters can create incidents" ON incidents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Resolvers and admins can update incidents" ON incidents FOR UPDATE USING (
  auth.role() = 'authenticated' AND (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Resolver', 'Admin'))
  )
);
CREATE POLICY "Admins can delete incidents" ON incidents FOR DELETE USING (
  auth.role() = 'authenticated' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
);

CREATE POLICY "Users can view all incident history" ON incident_history FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create history" ON incident_history FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all logs" ON logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create logs" ON logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## Demo Accounts

- **Admin**: admin@dhl.com / admin123
- **Resolver**: resolver@dhl.com / resolver123  
- **Reporter**: reporter@dhl.com / reporter123

## Deployment

### Render Deployment

1. Connect your repository to Render
2. Create a new Web Service
3. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables: Add your Supabase credentials

The `render.yaml` file is included for automatic deployment configuration.

## Project Structure

```
resolviq/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── incident/
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── incidents/route.ts
│   │   ├── incidents/[id]/route.ts
│   │   ├── profile/route.ts
│   │   └── logs/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Sidebar.tsx
│   ├── DhlLogo.tsx
│   ├── StatusBadge.tsx
│   ├── SeverityBadge.tsx
│   ├── StatCard.tsx
│   ├── Toast.tsx
│   ├── LoadingSpinner.tsx
│   └── ConfirmModal.tsx
├── lib/
│   ├── supabase.ts
│   └── supabaseServer.ts
├── middleware.ts
├── render.yaml
├── next.config.js
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary to DHL. All rights reserved.
