import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from 'expo-router';
import {useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Title from '../../components/Title';
import {useLogin} from '../../queries/api';
import {TOKEN_LOCAL_STORAGE} from '../../queries/consts';
import {useAuthStore} from '../../store/authStore';

const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
`;
const ElementSeparator = styled.View`
  margin-top: 40px;
`;
const ContentContainer = styled.View`
  margin-top: 50px;
`;
const InputLabel = styled.Text`
  font-size: 18px;
  color: ${colors.white};
  margin-bottom: 5px;
`;
const ErrorText = styled.Text`
  font-size: 18px;
  color: ${colors.error};
  margin-top: 10px;
`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {isPending, mutate: logIn} = useLogin();
  const appLogIn = useAuthStore(state => state.logIn);

  const onPressLogin = () => {
    console.log('submitted with', username, password);
    setError('');
    logIn(
      {username, password},
      {
        onError: err => {
          console.log('error', err);
          setError(err.message);
        },
        onSuccess: async response => {
          const {token} = response.login;
          if (token) {
            await AsyncStorage.setItem(TOKEN_LOCAL_STORAGE, token);
            appLogIn();
          } else {
            setError('Token missing from login');
          }
        },
      },
    );
  };

  const onPressCreateAccount = () => {
    router.push('createAccount');
  };

  return (
    <Container>
      <Title>Login</Title>
      <ContentContainer />

      <InputLabel>Username</InputLabel>
      <Input value={username} onChangeText={setUsername} />
      <ElementSeparator />

      <InputLabel>Password</InputLabel>
      <Input secureTextEntry value={password} onChangeText={setPassword} />
      <ElementSeparator />

      <Button isLoading={isPending} disabled={isPending} onPress={onPressLogin}>
        Submit
      </Button>
      {error ? <ErrorText>{error}</ErrorText> : null}

      <ElementSeparator />
      <Button onPress={onPressCreateAccount}>Create Account</Button>
    </Container>
  );
}
