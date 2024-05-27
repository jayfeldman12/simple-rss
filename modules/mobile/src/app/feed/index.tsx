import styled from 'styled-components/native';
import Title from '../../components/Title';

const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
`;

export default function Login() {
  return (
    <Container>
      <Title>Your feeds</Title>
    </Container>
  );
}
