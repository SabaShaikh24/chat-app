# Chat App (React + Supabase + Capacitor)

## 🚀 Features

* Email/password authentication using Supabase
* Chat list showing conversations
* Displays last message for each conversation
* Real-time messaging using Supabase Realtime
* Send & receive messages instantly
* Logout functionality
* Android APK build using Capacitor

---

## 🛠 Tech Stack

* React (Vite)
* Supabase (Auth + Database + Realtime)
* Capacitor (Android)

---

## ⚙️ Supabase Setup

1. Create a free project at: https://supabase.com

2. Create the following tables:

### conversations

* id (uuid, primary key)
* created_at (timestamp, default now())

### conversation_participants

* conversation_id (uuid)
* user_id (uuid)

### messages

* id (uuid, primary key)
* conversation_id (uuid)
* sender_id (uuid)
* content (text)
* created_at (timestamp, default now())

---

3. Enable Realtime:

* Go to **Database → Replication / Realtime**
* Enable Realtime for the `messages` table

---

4. Authentication Setup:

* Go to **Authentication → Providers**
* Enable Email/Password login
* Disable "Confirm email" (for testing)

---

## 💻 Run Locally

### 1. Clone Repository

```bash
git clone https://github.com/SabaShaikh24/chat-app
cd chat-app
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Create Environment File

Create a `.env` file in the root folder:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

### 4. Start Development Server

```bash
npm run dev
```

App will run at:
http://localhost:5173

---

## 📱 Build Android APK

### 1. Build Web App

```bash
npm run build
```

---

### 2. Copy to Capacitor

```bash
npx cap copy android
```

---

### 3. Open Android Studio

```bash
npx cap open android
```

---

### 4. Generate APK

In Android Studio:

* Go to **Build → Build APK(s)**
* Wait for build to complete

---

### 📦 APK Location

```
android/app/build/outputs/apk/debug/app-debug.apk
```

---



---

## 📌 Notes

* Email confirmation is disabled for easier testing
* This is a simple functional chat app as per assignment requirements
* No additional UI libraries used

---

## 👤 Author

Saba Shaikh
