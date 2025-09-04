import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { theme } from '../services/theme';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
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
`;

const Button = styled.button`
  padding: 15px;
  background-color: ${theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 15px;
  color: ${props => (props.error ? '#d93025' : '#1a73e8')};
`;

const UserProfilePage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.put('/users/password', { password });
      setMessage("Password updated successfully!");
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password.");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Update Your Password</Title>
        <Form onSubmit={handleSubmit}>
          <Input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <Button type="submit">Update Password</Button>
          {error && <Message error>{error}</Message>}
          {message && <Message>{message}</Message>}
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default UserProfilePage;