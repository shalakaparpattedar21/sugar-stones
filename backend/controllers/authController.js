import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createToken = user =>
  jwt.sign(
    { id: user._id.toString(), name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const isText = value => typeof value === 'string';

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};
    // typeof checks also block NoSQL operator injection like { "email": { "$ne": null } }
    if (!isText(name) || !isText(email) || !isText(password) || !name.trim() || !email.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (!EMAIL_RE.test(email.trim())) return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (password.length < 6 || password.length > 72) {
      return res.status(400).json({ message: 'Password must be between 6 and 72 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashed,
      phone: isText(phone) ? phone.trim() : ''
    });

    res.status(201).json({
      message: 'Signup successful',
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    res.status(500).json({ message: 'Could not create the account.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!isText(email) || !isText(password)) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      message: 'Login successful',
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ message: 'Could not sign in.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone });
  } catch (error) {
    res.status(500).json({ message: 'Could not load your profile.' });
  }
};
