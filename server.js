// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk memverifikasi token
const verifyToken = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session;
    
      if (!sessionCookie) {
      // Redirect jika tidak ada sesi
      return res.redirect('/signin');
    }

    // Verify session cookie
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.user = decodedClaims;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Token tidak valid' });
  }
};

// Middleware untuk redirect jika sudah login
const redirectIfAuthenticated = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session;
    
    if (sessionCookie) {
      // Verify session cookie
      await admin.auth().verifySessionCookie(sessionCookie, true);
      // Jika valid, redirect ke dashboard
      return res.redirect('/dashboard');
    }
    
    next();
  } catch (error) {
    // Jika session tidak valid, lanjutkan ke halaman login
    next();
  }
};

// Route untuk halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route untuk halaman login - dengan redirect check
app.get('/signin', redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

// Route untuk check session (untuk redirect otomatis)
app.get('/check-session', async (req, res) => {
  try {
    const sessionCookie = req.cookies.session;
    
    if (!sessionCookie) {
      return res.status(401).json({ error: 'Tidak ada sesi aktif' });
    }

    // Verify session cookie
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    res.json({ success: true, user: decodedClaims });
  } catch (error) {
    console.error('Session check error:', error);
    res.status(401).json({ error: 'Sesi tidak valid' });
  }
});

// Route untuk signin - Membuat session cookie
app.post('/signin', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ 
        error: 'ID token diperlukan',
        code: 'MISSING_TOKEN'
      });
    }

    // Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user data from Firebase Auth
    const userRecord = await admin.auth().getUser(uid);
    
    // Check if email is allowed
    const allowedEmail = 'Evsyafely@gmail.com';
    if (userRecord.email !== allowedEmail) {
      return res.status(403).json({ 
        error: 'Access Denied! Unauthorized email, please contact developer',
        code: 'EMAIL_NOT_ALLOWED',
        email: userRecord.email
      });
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Prepare user data for database
    const userData = {
      uid: uid,
      name: userRecord.displayName,
      email: userRecord.email,
      picture: userRecord.photoURL,
      lastLogin: admin.database.ServerValue.TIMESTAMP,
      createdAt: admin.database.ServerValue.TIMESTAMP
    };

    // Save user data to Realtime Database (update jika sudah ada)
    const userRef = db.ref(`users/${uid}`);
    const userSnapshot = await userRef.once('value');

    if (userSnapshot.exists()) {
      // User sudah ada, update lastLogin saja
      await userRef.update({
        lastLogin: admin.database.ServerValue.TIMESTAMP
      });
    } else {
      // User baru, simpan semua data
      await userRef.set(userData);
    }

    // Set HTTP-only cookie
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS di production
      sameSite: 'strict'
    };

    res.cookie('session', sessionCookie, options);

    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        uid: uid,
        name: userRecord.displayName,
        email: userRecord.email,
        picture: userRecord.photoURL
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    
    // Handle different types of errors
    if (error.code === 'auth/id-token-expired') {
      res.status(401).json({ 
        error: 'Token kedaluwarsa. Silakan coba lagi.',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.code === 'auth/id-token-revoked') {
      res.status(401).json({ 
        error: 'Token tidak valid. Silakan coba lagi.',
        code: 'TOKEN_REVOKED'
      });
    } else {
      res.status(500).json({ 
        error: 'Gagal membuat sesi login',
        code: 'INTERNAL_ERROR'
      });
    }
  }
});

// Route untuk signout
app.post('/signout', (req, res) => {
  try {
    // Clear session cookie
    res.clearCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ success: true, message: 'Logout berhasil' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Gagal logout' });
  }
});

// Route untuk logout redirect
app.get('/logout', (req, res) => {
  res.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.redirect('/signin');
});

// Route untuk dashboard (protected)
app.get('/dashboard', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Route untuk mendapatkan data user (protected)
app.get('/api/user', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    
    // Get user data from database
    const snapshot = await db.ref(`users/${uid}`).once('value');
    const userData = snapshot.val();
    
    if (!userData) {
      return res.status(404).json({ error: 'Data user tidak ditemukan' });
    }
    
    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Gagal mengambil data user' });
  }
});

// Route untuk update user data (protected)
app.put('/api/user', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name } = req.body;
    
    // Update user data in database
    await db.ref(`users/${uid}`).update({
      name: name,
      lastUpdated: admin.database.ServerValue.TIMESTAMP
    });
    
    res.json({ success: true, message: 'Data user berhasil diupdate' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Gagal mengupdate data user' });
  }
});

// Route untuk mendapatkan semua users (protected - admin only)
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    // Anda bisa tambahkan check admin role di sini
    const snapshot = await db.ref('users').once('value');
    const users = snapshot.val();
    
    res.json({ success: true, users: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Gagal mengambil data users' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan server' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Halaman tidak ditemukan' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});