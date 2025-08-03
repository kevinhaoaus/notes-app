# 📝 Notes App

A modern, full-featured personal notes application built with Next.js and Firebase. Create, organize, and manage your notes with real-time synchronization, authentication, and a beautiful user interface.

![Notes App Screenshot](https://via.placeholder.com/800x400?text=Notes+App+Screenshot)

## ✨ Features

### 🔐 **Authentication**
- Email/password user registration and login
- Password reset functionality via email
- Protected routes with automatic redirects
- User profile management

### 📋 **Notes Management**
- Create, edit, and delete notes
- Real-time synchronization across devices
- Rich text content support
- Color-coded notes (6 color options)
- Pin/unpin important notes
- Tag system for organization

### 🔍 **Search & Organization**
- Full-text search across title, content, and tags
- Filter notes by color
- Sort by title, creation date, or last modified
- Advanced filtering options

### 🎨 **User Experience**
- Responsive design for mobile and desktop
- Clean, modern interface with Tailwind CSS
- Toast notifications for user feedback
- Loading states and error handling
- Smooth animations and transitions

## 🚀 Live Demo

[View Live Demo](https://your-notes-app-url.com) *(Add your deployment URL here)*

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19
- **Backend**: Firebase (Firestore Database, Authentication)
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API + useReducer
- **Routing**: Next.js App Router
- **Notifications**: React Hot Toast
- **Date Formatting**: date-fns
- **Deployment**: Vercel (recommended)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### 1. Clone the Repository
```bash
git clone https://github.com/kevinhaoaus/notes-app.git
cd notes-app
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

#### Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Configure authorized domains if needed

#### Set up Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Choose "Start in test mode" (or production mode with custom rules)
3. Select a location for your database

#### Create Required Firestore Index
The app requires a composite index for efficient querying:
1. Go to **Firestore Database** → **Indexes**
2. Create a composite index with:
   - **Collection ID**: `notes`
   - **Fields**:
     - `userId` (Ascending)
     - `updatedAt` (Descending)

#### Get Firebase Configuration
1. Go to **Project Settings** → **General**
2. Scroll down to "Your apps"
3. Click "Web app" icon and register your app
4. Copy the configuration object

### 4. Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**⚠️ Important**: Never commit your `.env.local` file to version control!

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Firestore Security Rules
For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Notes are private to each user
    match /notes/{noteId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 📱 Usage

### Getting Started
1. **Register**: Create a new account with email and password
2. **Verify Email**: Check your inbox for verification email
3. **Login**: Sign in with your credentials
4. **Create Notes**: Click "New Note" to start writing

### Managing Notes
- **Edit**: Click on any note to view and edit
- **Pin**: Use the pin icon to mark important notes
- **Delete**: Click the delete icon and confirm
- **Search**: Use the search bar to find specific notes
- **Filter**: Use color and tag filters to organize

### Keyboard Shortcuts
- `Ctrl/Cmd + Enter`: Save note (in edit mode)
- `Escape`: Cancel editing

## 🏗️ Project Structure

```
notes-app/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Main dashboard
│   │   ├── create/            # Create note page
│   │   └── note/[id]/         # Note detail page
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── notes/             # Notes-related components
│   │   ├── layout/            # Layout components
│   │   └── common/            # Reusable components
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.js     # Authentication state
│   │   └── NotesContext.js    # Notes state management
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js         # Authentication hook
│   │   └── useNotes.js        # Notes operations hook
│   ├── services/              # External services
│   │   ├── firebase/          # Firebase configuration
│   │   └── api/               # API functions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── .env.example              # Environment template
└── package.json              # Dependencies
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
- **Netlify**: Supports Next.js with plugins
- **Firebase Hosting**: Native integration
- **Railway**: Easy deployment with environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Firebase](https://firebase.google.com/) - Backend and authentication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications
- [date-fns](https://date-fns.org/) - Date utility library

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Contact: [your-email@example.com](mailto:your-email@example.com)

---

**Made with ❤️ by [Kevin Hao](https://github.com/kevinhaoaus)**
