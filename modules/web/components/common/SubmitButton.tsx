import Button, {ButtonProps} from 'react-bootstrap/Button';
import {Spinner} from './Spinner';

export interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const SubmitButton = ({isLoading, children, ...rest}: SubmitButtonProps) => {
  return <Button {...rest}>{isLoading ? <Spinner /> : children}</Button>;
};

export default SubmitButton;
