import type {NextPage} from 'next';
import {Background} from '../components/common/background';
import RouteOnLoad from './RouteOnLoad';

const Home: NextPage = () => {
  return (
    <>
      <Background />
      <RouteOnLoad />
    </>
  );
};

export default Home;
