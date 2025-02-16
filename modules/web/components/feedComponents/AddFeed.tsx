'use client';

import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import SubmitButton from '../common/SubmitButton';

interface AddFeedProps {
  addFeedLoading: boolean;
  error: boolean;
  onSubmit: (feedUrl: string) => void;
}

export const AddFeed = ({addFeedLoading, error, onSubmit}: AddFeedProps) => {
  const [url, setUrl] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    onSubmit(url);
    setShowModal(false);
    setUrl('');
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <Button
        variant="primary"
        className="sidebar-button"
        style={{height: '2.5rem', marginLeft: 0}}
        onClick={() => setShowModal(true)}>
        Add Feed
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Feed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter feed URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleEnter}
          />
          {error && (
            <div className="text-danger mt-2">
              Error adding feed, make sure URL has an RSS feed and is not
              already a subscription
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <SubmitButton isLoading={addFeedLoading} onClick={handleSubmit}>
            Add Feed
          </SubmitButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};
