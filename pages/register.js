import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../lib/authenticate'; 
import { Alert, Button, Form } from 'react-bootstrap';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); 
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await registerUser(username, password, password2);
      router.push('/login'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
      </Form.Group>
      <Button type="submit">Register</Button>
    </Form>
  );
};

export default Register;
