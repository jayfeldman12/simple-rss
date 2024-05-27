import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../colors';

interface TitleProps {
  children?: React.ReactNode;
}

const TitleText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.white};
`;

const Title = ({children}: TitleProps) => {
  return <TitleText>{children}</TitleText>;
};

export default Title;
