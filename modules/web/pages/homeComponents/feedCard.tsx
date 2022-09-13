import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import {FaExternalLinkAlt} from 'react-icons/fa';
import {FeedItem} from '../api/graphql/models/types';

interface FeedCardProps {
  item: FeedItem;
  onItemClick: (item: FeedItem) => void;
}

const FeedCard = ({item, onItemClick}: FeedCardProps) => {
  return (
    <Col key={item.url}>
      <Card
        className="p-3"
        style={{borderWidth: '0.3rem', cursor: 'pointer'}}
        border={`${item?.isRead ? '' : 'info'}`}
        onClick={() => onItemClick(item)}>
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
          <a href={item.url}>
            <FaExternalLinkAlt />
          </a>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default FeedCard;
