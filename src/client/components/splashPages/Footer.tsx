import crow from '../assets/crow2.png';
import githubImgGray from '../assets/github-gray.svg';
import linkedinImgGray from '../assets/linkedin-gray.svg';

const Footer = () => {
  return (
    <footer style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0px 5px', backgroundColor: '#EDF6F9'}}>
      <div style={{marginTop: '1rem'}}>
        <img src={crow} style={{width: '2.5rem'}}></img>
      </div>
      <p className='copyright' style={{fontWeight:'bold', color: '#006D77'}}>
        <span style={{paddingRight: '.5rem', borderRight: '2px solid black'}}>© Kalibrate 2023</span>
        <span style={{color: '#00363b', paddingLeft: '.5rem'}}>MIT License</span>
      </p>
      <div className='social-links' style={{marginTop: '.7rem'}}>
        <a href='https://github.com/oslabs-beta/kalibrate'>
          <img src={githubImgGray} alt='github'></img>
        </a>
        <a href='#'>
          <img src={linkedinImgGray} alt='linkedin'></img>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
