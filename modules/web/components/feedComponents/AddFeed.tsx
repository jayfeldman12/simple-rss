'use client';

import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import SubmitButton from '../common/SubmitButton';

interface AddFeedProps {
  addFeedLoading: boolean;
  error: boolean;
  onSubmit: (feedUrl: string) => void;
}

export const AddFeed = ({addFeedLoading, error, onSubmit}: AddFeedProps) => {
  const [url, setUrl] = useState('');
  return (
    <>
      <div className="py-3 d-flex flex-row add-feed">
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
      {error ? (
        <h5 className="text-danger">
          Error adding feed, make sure URL has an RSS feed and is not already a
          subscription
        </h5>
      ) : null}
    </>
  );
};
