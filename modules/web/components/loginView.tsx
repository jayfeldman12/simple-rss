import {useCallback, useState} from 'react';
import {Background} from './common/background';
import {PageHead} from './common/pageHead';
import SubmitButton from './common/SubmitButton';
import {useMutation} from '@tanstack/react-query';
import {MutationLoginArgs} from '../pages/api/graphql/models/types';
import {graphqlRequest} from '../graphqlRequest';
import {Login} from '../queries/userQueries';
import {TOKEN_LOCAL_STORAGE} from '../pages/api/graphql/consts';
import Form from 'react-bootstrap/Form';

export interface LoginProps {
  onCreateUserPress: () => void;
  onLoginSuccess: () => void;
}

export const LoginView = ({onCreateUserPress, onLoginSuccess}: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
            localStorage.setItem(TOKEN_LOCAL_STORAGE, token);
            onLoginSuccess();
          } else {
            throw new Error('Token missing from login');
          }
        },
      },
    );
  }, [login, onLoginSuccess, password, username]);

  return (
    <div>
      <PageHead />
      <Background>
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
      </Background>
    </div>
  );
};
