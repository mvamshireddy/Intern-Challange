import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import api from '../services/api';
import { theme } from '../services/theme';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${theme.background};
`;

const FormWrapper = styled.div`
  padding: 40px;
  background-color: ${theme.card};
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
`;

const Title = styled.h2`
  color: ${theme.primary};
  margin-bottom: 25px;
  text-align: center;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${theme.primary};
  }
`;

const Button = styled.button`
  padding: 15px;
  background-color: ${theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #1c2a3a;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

const RedirectLink = styled(Link)`
  color: ${theme.primary};
  text-align: center;
  display: block;
  margin-top: 20px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const { data } = await api.post("/auth/login", formData);

      // Store token and user details in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.id,
        name: data.name,
        role: data.role,
      }));

      // Redirect based on user role
      switch (data.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "owner":
          navigate("/owner/dashboard");
          break;
        case "user":
          navigate("/stores");
          break;
        default:
          navigate("/"); // Fallback to a default page
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during login.");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Login to Your Account</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit">Log In</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
        <RedirectLink to="/signup">Don't have an account? Sign Up</RedirectLink>
      </FormWrapper>
    </Container>
  );
};

export default LoginPage;