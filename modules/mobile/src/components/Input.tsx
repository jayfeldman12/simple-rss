import {TextInputProps} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';

interface InputProps extends TextInputProps {}

const StyledInput = styled.TextInput`
  background-color: ${colors.white};
  padding-vertical: 2px;
  padding-horizontal: 5px;
  border-radius: 5px;
  min-width: 80%;
  min-height: 35px;
`;

const Input = (props: InputProps) => {
  return <StyledInput {...props} />;
};

export default Input;
