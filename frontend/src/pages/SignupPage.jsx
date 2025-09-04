import React, { useState } from "react";
import styled from "styled-components";
import api from '../services/api';
import { theme } from '../services/theme'; // Corrected: Use named import
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: ${theme.card};
  box-shadow: 0 2px 16px rgba(46, 64, 87, 0.10);
  padding: 2.5rem 2rem;
  border-radius: 14px;
  width: 340px;
`;

const Title = styled.h2`
  color: ${theme.primary};
  text-align: center;
  margin-bottom: 1.7rem;
  font-size: 2rem;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.1rem;
  border: 1.5px solid ${theme.border};
  border-radius: 6px;
  font-size: 1rem;
  background: ${theme.background};
`;

const Button = styled.button`
  width: 100%;
  background: ${theme.primary};
  color: #fff;
  padding: 0.9rem;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  margin-bottom: 0.8rem;
  &:hover {
    background: ${theme.accent};
    color: ${theme.primary};
  }
`;

const Error = styled.div`
  color: ${theme.error};
  margin-bottom: 1.1rem;
  text-align: center;
`;

const validate = ({ name, email, password, address }) => {
  if (!name || name.length < 20 || name.length > 60) return "Name: 20-60 chars";
  if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) return "Invalid email";
  if (!address || address.length > 400) return "Address: max 400 chars";
  if (!password || password.length < 8 || password.length > 16) return "Password: 8-16 chars";
  if (!/[A-Z]/.test(password)) return "Password: must have uppercase";
  if (!/[!@#$%^&*]/.test(password)) return "Password: must have special char";
  return "";
};

export default function SignupPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const [err, setErr] = useState("");
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    if (v) return setErr(v);
    setErr("");
    try {
      await api.post("/auth/signup", form);
      nav("/login");
    } catch (e) {
      setErr(e.response?.data?.error || "Signup failed");
    }
  };
  return (
    <Container>
      <Card>
        <Title>Sign Up</Title>
        {err && <Error>{err}</Error>}
        <form onSubmit={handleSubmit}>
          <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
          <Input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} />
          <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <Input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
          <Button type="submit">Create Account</Button>
        </form>
        <div style={{ textAlign: "center", fontSize: "0.98rem" }}>
          Already have an account?{" "}
          <span
            style={{ color: theme.primary, cursor: "pointer", fontWeight: 500 }}
            onClick={() => nav("/login")}
          >
            Login
          </span>
        </div>
      </Card>
    </Container>
  );
}
