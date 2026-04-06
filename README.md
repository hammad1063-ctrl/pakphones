# PakPhones - Mobile Phone Marketplace

A full-stack mobile phone marketplace for Pakistan, similar to PakWheels but for phones. Built with Next.js, MongoDB, and NextAuth.js.

## Features

- 🔐 User authentication and authorization
- 📱 Phone listings with detailed specifications
- 🔍 Advanced search and filtering
- 📸 Image uploads (Cloudinary integration)
- 👤 User profiles and seller information
- 📊 Admin dashboard
- 📧 Email notifications (planned)
- 💬 WhatsApp integration (planned)

## 🚀 Quick Deployment (Recommended)

Since local development has compatibility issues, deploy to **Vercel** (free):

### **Deploy to Vercel:**

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your Git repository** (or upload the project folder)
5. **Configure environment variables**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: Random secret (generate online)
   - `NEXTAUTH_URL`: Your deployment URL
6. **Click "Deploy"**

### **MongoDB Setup:**
- Use **MongoDB Atlas** (free): https://www.mongodb.com/atlas
- Create a free cluster
- Get connection string
- Add your IP address to whitelist

## Getting Started

### Option 1: Docker (Recommended - especially for macOS Monterey)

1. **Install Docker Desktop** for Mac from [docker.com](https://www.docker.com/products/docker-desktop)

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up MongoDB**:
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env.local`

3. **Configure environment**:
   - Update `NEXTAUTH_SECRET` in `.env.local`
   - Add Cloudinary credentials if using image uploads

4. **Start the application**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
pakphones-website/
├── components/          # Reusable React components
│   └── Layout.tsx      # Main layout with navigation
├── lib/                # Utility libraries
│   ├── auth.ts         # NextAuth configuration
│   └── mongodb.ts      # Database connection
├── models/             # Mongoose models
│   ├── User.ts         # User schema
│   └── Phone.ts        # Phone listing schema
├── pages/              # Next.js pages and API routes
│   ├── api/            # API endpoints
│   │   ├── auth/       # NextAuth API routes
│   │   ├── phones/     # Phone CRUD operations
│   │   └── users/      # User operations
│   ├── auth/           # Authentication pages
│   ├── phones/         # Phone-related pages
│   ├── _app.tsx        # App wrapper
│   └── index.tsx       # Home page
├── styles/             # Global styles
└── .env.local          # Environment variables
```

## API Routes

### Authentication
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signup` - Register new user

### Users
- `POST /api/users/register` - Register new user

### Phones
- `GET /api/phones` - Get all phones (with filtering)
- `POST /api/phones` - Create new phone listing
- `GET /api/phones/[id]` - Get phone by ID
- `PUT /api/phones/[id]` - Update phone listing
- `DELETE /api/phones/[id]` - Delete phone listing

## Database Models

### User
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- phone: String (required)
- city: String (required)
- role: String (enum: 'user', 'admin', default: 'user')
- profileImage: String
- isVerified: Boolean
- timestamps

### Phone
- title: String (required)
- brand: String (required)
- model: String (required)
- condition: String (enum: 'new', 'used', 'refurbished', required)
- price: Number (required)
- description: String (required)
- images: Array of Strings (required)
- location: Object { city, area } (required)
- specifications: Object { storage, ram, battery, camera, display, os } (required)
- seller: ObjectId (ref: User, required)
- isActive: Boolean (default: true)
- isSold: Boolean (default: false)
- views: Number (default: 0)
- timestamps

## Features in Development

- [ ] Image upload to Cloudinary
- [ ] Email notifications for new listings
- [ ] WhatsApp contact integration
- [ ] Advanced admin dashboard
- [ ] User profile management
- [ ] Phone comparison feature
- [ ] Favorites/watchlist
- [ ] Messaging system between buyers and sellers

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy**

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub.

---

Built with ❤️ for the Pakistani mobile phone community