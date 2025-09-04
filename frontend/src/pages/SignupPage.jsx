import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import api from '../services/api';
import { theme } from '../services/theme';
// 👇 Import your validation functions
import { validateName, validateEmail, validatePassword, validateAddress } from '../validator';

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
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
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
  margin-top: 10px;
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

const FieldError = styled.p`
  color: #d93025;
  font-size: 0.875rem;
  margin-top: 6px;
  padding-left: 5px;
  text-align: left;
`;

const GeneralError = styled(FieldError)`
    text-align: center;
    margin-top: 15px;
`;

const RedirectLink = styled(Link)`
  color: ${theme.primary};
  text-align: center;
  display: block;
  margin-top: 25px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", address: "" });
  // 👇 State to hold specific errors for each field
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors on a new submission attempt

    // --- Frontend Validation Logic ---
    const validationErrors = {};
    if (!validateName(formData.name)) {
      validationErrors.name = "Name must be between 20 and 60 characters.";
    }
    if (!validateEmail(formData.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }
    if (!validatePassword(formData.password)) {
      validationErrors.password = "Password must be 8-16 chars, with one uppercase letter and one special character (e.g., !@#$%).";
    }
    if (!validateAddress(formData.address)) {
      validationErrors.address = "Address is required and can be up to 400 characters.";
    }

    // If there are any validation errors, update state and stop the submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop the function here
    }
    // --- End of Validation ---

    try {
      await api.post("/auth/signup", formData);
      alert("Signup successful! You will now be redirected to the login page.");
      navigate("/login");
    } catch (err) {
      // Handle errors from the server, like "email already in use"
      const serverError = err.response?.data?.error || "An unknown error occurred.";
      setErrors({ form: serverError });
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Create an Account</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </InputGroup>

          <InputGroup>
            <Input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </InputGroup>

          <InputGroup>
            <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </InputGroup>

          <InputGroup>
            <Input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            {errors.address && <FieldError>{errors.address}</FieldError>}
          </InputGroup>

          <Button type="submit">Sign Up</Button>
          {errors.form && <GeneralError>{errors.form}</GeneralError>}
        </Form>
        <RedirectLink to="/login">Already have an account? Log In</RedirectLink>
      </FormWrapper>
    </Container>
  );
};

export default SignupPage;