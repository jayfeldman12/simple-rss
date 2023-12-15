import Image from 'next/image';
import {Spinner} from '../common/Spinner';

const Icon = ({icon, title}: {icon: string; title: string}) => {
  if (icon) {
    return (
      <Image
        src={icon}
        alt={`Icon for ${title}`}
        width="25"
        height="25"
        className="me-2"
      />
    );
  }
  return <div style={{height: 25, width: 25}} className="me-2" />;
};

interface SidebarIconProps {
  icon: string;
  isActive: boolean;
  title: string;
  unreadCount: number;
  isLoading: boolean;
}

export const SidebarIcon = ({
  icon,
  isActive,
  title,
  unreadCount,
  isLoading,
}: SidebarIconProps) => {
  return (
    <div
      className="d-flex flex-row my-1 align-self-stretch align-items-center justify-content-between"
      style={{cursor: 'pointer'}}>
      <div className="d-flex flex-row align-items-center">
        {isLoading ? (
          <div style={{height: 25, width: 25}} className="me-2">
            <Spinner />
          </div>
        ) : (
          <Icon icon={icon} title={title} />
        )}
        <p
          className="text-start mb-0"
          style={{
            fontWeight: isActive ? 'bold' : 'normal',
          }}>
          {title}
        </p>
      </div>
      {unreadCount ? (
        <p className="mb-0 text-info ms-2">{unreadCount}</p>
      ) : null}
    </div>
  );
};
