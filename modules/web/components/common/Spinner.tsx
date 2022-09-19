import {default as RNBSpinner} from 'react-bootstrap/Spinner';

export const Spinner = () => {
  return (
    <RNBSpinner
      as="span"
      variant="light"
      size="sm"
      role="status"
      aria-hidden="true"
      animation="border"
    />
  );
};
