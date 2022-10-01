import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import SubmitButton from '../common/SubmitButton';

interface AddFeedProps {
  addFeedLoading: boolean;
  onSubmit: (feedUrl: string) => void;
}

export const AddFeed = ({addFeedLoading, onSubmit}: AddFeedProps) => {
  const [url, setUrl] = useState('');
  return (
    <div className="py-3 d-flex flex-row">
      <Form.Control
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSubmit(e.currentTarget.value)}
      />
      <SubmitButton
        className="mx-2 text-nowrap"
        isLoading={addFeedLoading}
        onClick={() => onSubmit(url)}>
        Add Feed
      </SubmitButton>
    </div>
  );
};
