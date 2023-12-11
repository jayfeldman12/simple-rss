import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import {FaExternalLinkAlt} from 'react-icons/fa';
import {FeedItem} from '../../app/api/graphql/models/types';

interface FeedCardProps {
  item: FeedItem;
  onItemClick: (item: FeedItem) => void;
}

const FeedCard = ({item, onItemClick}: FeedCardProps) => {
  return (
    <Col key={item.url}>
      <a
        href={item.url}
        className="no-text-change"
        onClick={e => {
          // If user presses the meta key, it will naturally open in the background tab (good)
          // Otherwise, it will replace the current tab with their new press,
          // but we want it to open in a new window instead
          // So prevent the default and manually open the new window
          const openLinkManually = !e.metaKey;
          if (openLinkManually) {
            e.preventDefault();
            window.open(item.url);
          }
          onItemClick(item);
        }}>
        <Card
          className="p-3"
          style={{borderWidth: '0.3rem', cursor: 'pointer'}}
          border={`${item.isRead ? '' : 'info'}`}>
          {item.image ? (
            <Card.Img
              variant="top"
              src={item.image}
              style={{
                maxHeight: '10rem',
                minHeight: '8rem',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{minHeight: '8rem'}} />
          )}
          <Card.Text className="my-2">{item.title?.slice(0, 200)}</Card.Text>
          <Card.Subtitle className="text-secondary small my-1">
            {item.description?.slice(0, 200)}
          </Card.Subtitle>
          <Card.Footer>
            <FaExternalLinkAlt />
          </Card.Footer>
        </Card>
      </a>
    </Col>
  );
};

export default FeedCard;
