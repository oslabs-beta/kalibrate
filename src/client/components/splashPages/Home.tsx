import Hero from './Hero';
import Features from './Features';
import Team from './Team';
import Footer from './Footer';

const Home = () => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5rem',
          textAlign: 'center',
        }}
      >
        {<Hero />}
        {<Features />}
        {<Team />}
        {<Footer />}
      </div>
    </>
  );
};

export default Home;
