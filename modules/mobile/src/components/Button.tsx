import {ActivityIndicator, PressableProps} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  children?: React.ReactNode;
  isLoading?: boolean;
}

const StyledButton = styled.Pressable`
  background-color: ${colors.primary};
  padding-vertical: 10px;
  padding-horizontal: 25px;
  border-radius: 5px;
  min-width: 120px;
  align-items: center;
`;
const ButtonText = styled.Text`
  color: ${colors.secondary};
  font-weight: 500;
  font-size: 18px;
`;

const Button = ({children, isLoading, ...props}: ButtonProps) => {
  return (
    <StyledButton {...props}>
      {isLoading ? (
        <ActivityIndicator color={colors.secondary} />
      ) : (
        <ButtonText>{children}</ButtonText>
      )}
    </StyledButton>
  );
};

export default Button;
