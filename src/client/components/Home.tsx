
import Hero from './splashPages/Hero';
import Features from './splashPages/Features';
import Team from './splashPages/Team';
import Footer from './splashPages/Footer';

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
        textAlign: 'center'
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
