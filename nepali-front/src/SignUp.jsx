import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from './api';
import { toast } from 'react-toastify';
import { Box, Button, Text, Input } from '@chakra-ui/react';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await createUser({ username, email, password, firstName, lastName });
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
    }
  };

  return (
    <Box id='signup' className="p-5">
      <Text as="h1" id="loghead">Create User</Text>
      <Box id="logcontainer" 
        bg="#f9f9f9"
        p="20px"
        borderRadius="8px"
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
      >
        <Box mb="4">
          <Text>Username:</Text>
          <Input
            placeholder='Enter username'
            onChange={e => setUsername(e.target.value)}
            value={username}
            type='username'
          />
        </Box>
        <Box mb="4">
          <Text>Email Address:</Text>
          <Input
            placeholder='Enter email'
            onChange={e => setEmail(e.target.value)}
            value={email}
            autoComplete="email"
            type='email'
          />
        </Box>
        <Box mb="4">
          <Text>Password:</Text>
          <Input
            placeholder='Enter password'
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            autoComplete="new-password"
          />
        </Box>
        <Box mb="4">
          <Text>First Name:</Text>
          <Input
            placeholder='Enter first name'
            onChange={e => setFirstName(e.target.value)}
            value={firstName}
            autoComplete="given-name"
          />
        </Box>
        <Box mb="4">
          <Text>Last Name:</Text>
          <Input
            placeholder='Enter last name'
            onChange={e => setLastName(e.target.value)}
            value={lastName}
            autoComplete="family-name"
          />
        </Box>
        <Box mt="20">
          <Button id="btn" onClick={submit}>Sign Up</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;

