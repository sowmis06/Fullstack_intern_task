const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const emailPattern = /^\S+@\S+\.\S+$/;

function validateRegistration({ name, email, password }) {
  const errors = {};

  if (typeof name !== "string" || name.trim() === "") {
    errors.name = "Full name is required";
  } else if (name.trim().length > 100) {
    errors.name = "Name must be 100 characters or fewer";
  }

  if (typeof email !== "string" || email.trim() === "") {
    errors.email = "Email is required";
  } else if (!emailPattern.test(email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (typeof password !== "string" || password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (password.length > 72) {
    // bcrypt only uses the first 72 characters of a password.
    errors.password = "Password must be 72 characters or fewer";
  }

  return errors;
}

function validateLogin({ email, password }) {
  const errors = {};

  if (typeof email !== "string" || email.trim() === "") {
    errors.email = "Email is required";
  } else if (!emailPattern.test(email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (typeof password !== "string" || password === "") {
    errors.password = "Password is required";
  }

  return errors;
}

function toSafeUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};

    const errors = validateRegistration({ name, email, password });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Please fix the highlighted fields", errors });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await db("users").where({ email: normalizedEmail }).first();
    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
        errors: { email: "This email is already registered" },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [userId] = await db("users").insert({
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
    });

    res.status(201).json({
      message: "Account created",
      user: { id: userId, name: name.trim(), email: normalizedEmail },
    });
  } catch (error) {
    // Two requests with the same email can pass the check above at the same
    // time. The unique constraint on users.email catches that case.
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        message: "An account with this email already exists",
        errors: { email: "This email is already registered" },
      });
    }
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    const errors = validateLogin({ email, password });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Please fix the highlighted fields", errors });
    }

    const user = await db("users").where({ email: email.trim().toLowerCase() }).first();

    // The same message for an unknown email and a wrong password, so the
    // response does not reveal which emails are registered.
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: toSafeUser(user) });
  } catch (error) {
    next(error);
  }
}

  function getCurrentUser(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, getCurrentUser };
