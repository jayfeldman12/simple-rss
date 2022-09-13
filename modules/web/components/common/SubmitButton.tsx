import Spinner from 'react-bootstrap/Spinner';
import Button, {ButtonProps} from 'react-bootstrap/Button';

export interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const SubmitButton = ({isLoading, children, ...rest}: SubmitButtonProps) => {
  return (
    <Button {...rest}>
      {isLoading ? (
        <Spinner
          as="span"
          variant="light"
          size="sm"
          role="status"
          aria-hidden="true"
          animation="border"
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
