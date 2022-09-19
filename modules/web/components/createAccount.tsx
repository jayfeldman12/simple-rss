import {useCallback, useState} from 'react';
import {Background} from './common/background';
import {PageHead} from './common/pageHead';
import SubmitButton from './common/SubmitButton';
import {useMutation} from '@tanstack/react-query';
import {MutationCreateUserArgs} from '../pages/api/graphql/models/types';
import {graphqlRequest} from '../graphqlRequest';
import {CreateUser} from '../queries/userQueries';
import {TOKEN_LOCAL_STORAGE} from '../pages/api/graphql/consts';
import Form from 'react-bootstrap/Form';

export interface CreateAccountProps {
  onLoginPress: () => void;
  onCreateAccountSuccess: () => void;
}

export const CreateAccount = ({
  onLoginPress,
  onCreateAccountSuccess,
}: CreateAccountProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const {
    mutate: createAccount,
    isLoading,
    error,
  } = useMutation((variables: MutationCreateUserArgs) =>
    graphqlRequest(CreateUser, {...variables}),
  );

  const onCreateAccount = useCallback(async () => {
    if (!username || !password) return;
    if (password !== confirmPassword) {
      setConfirmError('Passwords must match');
      return;
    }
    if (confirmError) setConfirmError('');
    createAccount(
      {username, password},
      {
        onSuccess: ({createUser: {token}}) => {
          if (token) {
            localStorage.setItem(TOKEN_LOCAL_STORAGE, token);
            onCreateAccountSuccess();
          } else {
            throw new Error('Token missing from create account');
          }
        },
      },
    );
  }, [
    confirmError,
    confirmPassword,
    createAccount,
    onCreateAccountSuccess,
    password,
    username,
  ]);

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
          onChange={e => setPassword(e.target.value)}></Form.Control>
        <Form.Label className="py-3">Password</Form.Label>
        <Form.Control
          id="confirmPassword"
          type="password"
          title="confirmPassword"
          onChange={e => setConfirmPassword(e.target.value)}
          onKeyDown={e =>
            e.key === 'Enter' && onCreateAccount()
          }></Form.Control>
        {confirmError ? (
          <h5 className="py-2 text-danger">{confirmError}</h5>
        ) : null}
        <SubmitButton
          className="col-sm-6 my-4"
          isLoading={isLoading}
          disabled={!username || !password || !confirmPassword}
          onClick={onCreateAccount}>
          Create Account
        </SubmitButton>

        {error ? (
          <h5 className="text-danger">
            Error creating account. Make sure your password is at least 8
            characters and has one letter and one number. If that is already
            met, try another username
          </h5>
        ) : null}

        <div className="py-2"></div>
        <SubmitButton className="col-sm-4 my-4" onClick={onLoginPress}>
          Already have an account?
        </SubmitButton>
      </Background>
    </div>
  );
};
