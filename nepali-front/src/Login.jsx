import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Text, Input } from '@chakra-ui/react';
import { AuthContext } from './AuthContext';
import { getToken } from './api';

function Login() {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const token = await getToken({ username, password });
      localStorage.setItem('accessToken', token);
      navigate('/product');
    } catch (error) {
      setErrorMessage('Invalid username or password');
      console.error('Login failed: ', error);
    }
  };

  return (
    <Box id='login' className="p-5">
      <Text as="h1" id="loghead">Login</Text>
      <Box id="logcontainer">
        <Box>
          <Text>Username:</Text>
          <Input
            placeholder='Enter username' 
            onChange={e => setUsername(e.target.value)}
            value={username}
          />
        </Box>
        <Box>
          <Text>Password:</Text>
          <Input
            placeholder='Enter password'
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </Box>
        {errorMessage && (
          <Text color='red'>
            {errorMessage}
          </Text>
        )}
        <Box mt="3">
          <Button id="btn" onClick={submit}>Login</Button>
        </Box>
        <Link id="sign" to='/signup'>Sign Up</Link>
      </Box>
    </Box>
  );
};

export default Login;
