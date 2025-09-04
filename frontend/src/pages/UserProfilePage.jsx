import React, { useState } from "react";
import styled from "styled-components";
import api from '../services/api';
import { theme } from '../services/theme';

const Container = styled.div`
  background: ${theme.background};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: ${theme.card};
  padding: 2.5rem 2rem;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.07);
  width: 340px;
`;

const Title = styled.h2`
  color: ${theme.primary};
  margin-bottom: 2rem;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  margin-bottom: 1.15rem;
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
  transition: background 0.2s;
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

const Success = styled.div`
  color: ${theme.green};
  margin-bottom: 1.1rem;
  text-align: center;
`;

const validate = (password) => {
  if (!password || password.length < 8 || password.length > 16) return "Password: 8-16 chars";
  if (!/[A-Z]/.test(password)) return "Password: must have uppercase";
  if (!/[!@#$%^&*]/.test(password)) return "Password: must have special char";
  return "";
};

export default function UserProfilePage() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(password);
    if (v) return setErr(v);
    setErr(""); setSuccess("");
    try {
      await api.put("/users/password", { password });
      setSuccess("Password updated!");
      setPassword("");
    } catch (e) {
      setErr(e.response?.data?.error || "Failed");
    }
  };
  return (
    <Container>
      <Card>
        <Title>Update Password</Title>
        {err && <Error>{err}</Error>}
        {success && <Success>{success}</Success>}
        <form onSubmit={handleSubmit}>
          <Input name="password" placeholder="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit">Update</Button>
        </form>
      </Card>
    </Container>
  );
}