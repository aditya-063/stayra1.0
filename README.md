# 🏨 Stayra - Luxury Hotel Booking Platform

> The intelligent hotel aggregator that finds you the perfect stay at the lowest price across every booking platform.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔐 Multi-Method Authentication
- **Email + Password** - Traditional secure login
- **Email + OTP** - One-time password via email
- **Mobile + Password** - Login with mobile number
- **Mobile + OTP** - SMS-based authentication
- **Google OAuth** - Sign in with Google account

### 👤 User Profile Management
- Complete CRUD operations for user profiles
- Edit personal information (name, DOB, address, city, country)
- Profile picture support (UI ready)
- Mobile number verification
- Email verification
- Change password functionality
- Secure logout

### 🌍 Worldwide Destination Search
- 90+ popular cities worldwide
- Real-time autocomplete
- Fuzzy search (case-insensitive)
- Popular destination badges
- Smart fallback to trending locations

### 🎨 Premium UI/UX
- Glassmorphism 3D design
- Purple-Gold premium theme
- Golden dust celebration animation on login
- Smooth Framer Motion transitions
- Fully responsive (mobile-first)
- Dynamic navigation bar with user dropdown

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- SQLite (for development) or PostgreSQL (for production)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Google OAuth (Get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-32-char-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
# Run Prisma migrations
npx prisma migrate dev

# Seed destinations database (90+ cities)
npx prisma db seed --script=seed-destinations
```

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📊 Demo Account

```
📧 Email: demo@stayra.com
🔐 Password: demo1234
```

## 🔧 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth Client ID**
5. Configure OAuth consent screen if needed
6. Set up credentials:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret** to your `.env` file

## 📧 Email Configuration (Optional)

For OTP and password reset emails, configure SMTP in `.env`:

### Option 1: Gmail
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-16-char-app-password"
SMTP_FROM="Stayra <noreply@stayra.com>"
```

Get Gmail App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)

### Option 2: Production Services
- **SendGrid** (12,000 free emails/month)
- **Mailgun** (5,000 free emails/month)
- **Amazon SES** (62,000 free emails/month for 12 months)

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Prisma ORM (SQLite dev, PostgreSQL production)
- **Authentication**: NextAuth.js + Custom JWT
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React + React Icons
- **Email**: Nodemailer
- **SMS**: Twilio (optional)

## 📁 Project Structure

```
frontend/
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed-destinations.ts  # Seed 90+ cities
│   └── seed-demo-user.ts     # Demo account
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── profile/      # Profile management
│   │   │   └── destinations/ # Search API
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   ├── profile/          # User profile page
│   │   ├── change-password/  # Password change
│   │   └── auth/callback/    # OAuth callback
│   ├── components/
│   │   ├── Navbar.tsx        # Dynamic navigation
│   │   ├── SearchBar.tsx     # Destination search
│   │   ├── GoogleSignInButton.tsx
│   │   ├── GoldenDustEffect.tsx
│   │   └── AuthProvider.tsx  # NextAuth wrapper
│   ├── lib/
│   │   ├── auth.ts           # Auth utilities
│   │   ├── mailer.ts         # Email service
│   │   └── sms.ts            # SMS service
│   └── types/
│       └── next-auth.d.ts    # NextAuth types
├── .env                      # Environment variables
├── .env.example              # Template
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Multi-method login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/send-otp` - OTP generation
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Complete password reset
- `POST /api/auth/change-password` - Change password (authenticated)
- `GET/POST /api/auth/[...nextauth]` - NextAuth Google OAuth

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Search
- `GET /api/destinations?q=query` - Search destinations

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
   - Connect GitHub repository
   - Configure environment variables
   - Deploy!

3. **Production Environment Variables**
   - Update `NEXTAUTH_URL` to your production URL
   - Update `NEXT_PUBLIC_APP_URL`
   - Add Google OAuth production redirect URIs
   - Configure production database (PostgreSQL recommended)
   - Set strong JWT_SECRET and NEXTAUTH_SECRET

### Database Migration
```bash
npx prisma migrate deploy
```

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev    # Run migrations
npx prisma generate  # Generate Prisma Client
```

## 🎨 Design System

**Colors:**
- Primary: `#4a044e` (Deep Purple)
- Secondary: `#b45309` (Gold)
- Accent: `#a21caf` (Magenta)

**Typography:**
- Sans: Geist Sans
- Mono: Geist Mono

**Effects:**
- Glassmorphism with backdrop blur
- Gradient overlays
- Smooth animations via Framer Motion

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ CSRF protection via NextAuth
- ✅ Rate limiting for OTP requests
- ✅ Secure password reset flow
- ✅ Email enumeration prevention
- ✅ Server-side validation
- ✅ Environment variable protection

## 🧪 Testing

Test credentials:
- Email: `demo@stayra.com`
- Password: `demo1234`

Test checklist:
- [ ] Email + Password login
- [ ] Email + OTP login
- [ ] Google OAuth login
- [ ] Profile editing
- [ ] Password change
- [ ] Password reset flow
- [ ] Destination search
- [ ] Mobile responsiveness

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Future Enhancements

- [ ] Profile picture upload
- [ ] Booking management
- [ ] User settings page
- [ ] Email templates customization
- [ ] Two-factor authentication
- [ ] Social login (Facebook, Apple)
- [ ] Multi-language support
- [ ] Dark mode toggle

## 🆘 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation in `/docs`

---

Built with ❤️ using Next.js 14 and modern web technologies
