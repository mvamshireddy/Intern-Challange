import React, { useState } from "react";

// The theme object is now defined directly in the component
// to remove the external file dependency.
const theme = {
  primary: "#2E4057",
  accent: "#FFD166",
  background: "#F6F7FB",
  card: "#FFFFFF",
  text: "#22223B",
  error: "#E63946",
  green: "#38B000",
  border: "#E0E1E6",
};

// The 'useNavigate' hook and API service were unresolvable.
// They are replaced with mock functions and console logs to ensure
// the component is self-contained and runnable.
const mockNavigate = (path) => {
  console.log(`Navigating to: ${path}`);
  // In a real app, this would redirect the user.
  alert(`Redirecting to ${path}`);
};

// Mock user data to simulate a database
const mockUsers = {
  "admin@example.com": { password: "Password1!", role: "admin" },
  "owner@example.com": { password: "Password1!", role: "owner" },
  "user@example.com": { password: "Password1!", role: "user" },
};

// CSS styles are converted to inline style objects to remove
// the dependency on the 'styled-components' library.
const styles = {
  container: {
    minHeight: "100vh",
    background: theme.background,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
  },
  card: {
    background: theme.card,
    boxShadow: "0 2px 16px rgba(46, 64, 87, 0.10)",
    padding: "2.5rem 2rem",
    borderRadius: "14px",
    width: "340px",
  },
  title: {
    color: theme.primary,
    textAlign: "center",
    marginBottom: "1.7rem",
    fontSize: "2rem",
    fontWeight: "700",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.75rem 1rem",
    marginBottom: "1.1rem",
    border: `1.5px solid ${theme.border}`,
    borderRadius: "6px",
    fontSize: "1rem",
    background: theme.background,
  },
  button: {
    width: "100%",
    background: theme.primary,
    color: "#fff",
    padding: "0.9rem",
    border: "none",
    borderRadius: "6px",
    fontSize: "1.1rem",
    fontWeight: "600",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    marginBottom: "0.8rem",
  },
  buttonHover: {
    background: theme.accent,
    color: theme.primary,
  },
  error: {
    color: theme.error,
    marginBottom: "1.1rem",
    textAlign: "center",
  },
  linkText: {
    color: theme.primary,
    cursor: "pointer",
    fontWeight: 500
  },
  footerText: {
    textAlign: "center",
    fontSize: "0.98rem"
  }
};


export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // Mocking the API call
    const user = mockUsers[form.email];
    if (user && user.password === form.password) {
      console.log("Login successful!", { token: "mock_token", role: user.role });
      // In a real app, you would save the token.
      // localStorage.setItem("token", "mock_token");
      // localStorage.setItem("role", user.role);

      // Navigate based on role
      if (user.role === "admin") mockNavigate("/admin/dashboard");
      else if (user.role === "owner") mockNavigate("/owner/dashboard");
      else mockNavigate("/stores");
    } else {
      setErr("Invalid email or password");
      console.error("Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {err && <div style={styles.error}>{err}</div>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="email"
            placeholder="Email"
            type="email"
            required
            autoFocus
            value={form.email}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            name="password"
            placeholder="Password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            style={isHovered ? {...styles.button, ...styles.buttonHover} : styles.button}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Log In
          </button>
        </form>
        <div style={styles.footerText}>
          New user?{" "}
          <span
            style={styles.linkText}
            onClick={() => mockNavigate("/signup")}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}
