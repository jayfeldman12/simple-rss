import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';
import Form from 'react-bootstrap/Form';
import SubmitButton from '../components/common/SubmitButton';
import {Background} from '../components/common/background';
import {PageHead} from '../components/common/pageHead';
import {graphqlRequest} from '../graphqlRequest';
import {useTokenContext} from '../hooks/tokenProvider';
import {MutationLoginArgs} from '../pages/api/graphql/models/types';
import {Login} from '../queries/userQueries';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const {setNewToken} = useTokenContext();

  const onLoginSuccess = useCallback(() => {
    router.push('feeds');
  }, [router]);
  const onCreateUserPress = useCallback(() => {
    router.push('createAccount');
  }, [router]);

  const {
    mutate: login,
    isLoading,
    error,
  } = useMutation((variables: MutationLoginArgs) =>
    graphqlRequest(Login, {...variables}),
  );

  const onLogin = useCallback(async () => {
    if (!username || !password) return;
    login(
      {username, password},
      {
        onSuccess: ({login: {token}}) => {
          if (token) {
            setNewToken(token);
            onLoginSuccess();
          } else {
            throw new Error('Token missing from login');
          }
        },
      },
    );
  }, [login, onLoginSuccess, password, setNewToken, username]);

  return (
    <div>
      <PageHead />
      <Background>
        <div className="px-4 py-3">
          <h1>Simple Rss</h1>
          <Form.Label className="py-3">Username</Form.Label>
          <Form.Control
            id="username"
            title="Username"
            onChange={e => setUsername(e.target.value)}></Form.Control>
          <Form.Label className="py-3">Password</Form.Label>
          <Form.Control
            id="password"
            type="password"
            title="Password"
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onLogin()}></Form.Control>
          <SubmitButton
            className="col-sm-6 my-4"
            isLoading={isLoading}
            disabled={!username || !password}
            onClick={onLogin}>
            Log In
          </SubmitButton>

          {error ? (
            <h5 className="text-danger">
              Error logging in, try another username or password, or create an
              account below
            </h5>
          ) : null}

          <div className="py-2"></div>
          <SubmitButton className="col-sm-4 my-4" onClick={onCreateUserPress}>
            Create new account
          </SubmitButton>
        </div>
      </Background>
    </div>
  );
};

export default LoginPage;
