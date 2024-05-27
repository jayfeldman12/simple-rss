import {router} from 'expo-router';
import {useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Title from '../../components/Title';

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

export default function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  //   const {isPending, mutate: createAccount, error} = useCreateAccount()

  const onPressBackToLogin = () => {
    router.back();
  };

  const onPressCreateAccount = () => {
    if (!username || !password || !confirmPassword) {
      setError('Please fill out all fields');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      // createAccount({username, password})
    }
  };

  return (
    <Container>
      <Title>Create Account</Title>
      <ContentContainer />

      <InputLabel>Username</InputLabel>
      <Input value={username} onChangeText={setUsername} />

      <ElementSeparator />
      <InputLabel>Password</InputLabel>
      <Input secureTextEntry value={password} onChangeText={setPassword} />

      <ElementSeparator />
      <InputLabel>Confirm Password</InputLabel>
      <Input
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <ElementSeparator />
      <Button onPress={onPressCreateAccount}>Create Account</Button>
      {error ? <ErrorText>{error}</ErrorText> : null}

      <ElementSeparator />
      <ElementSeparator />
      <Button onPress={onPressBackToLogin}>Back to login</Button>
    </Container>
  );
}
