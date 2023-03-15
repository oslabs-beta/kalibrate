import ashlee from '../assets/ashlee.png';
import jonah from '../assets/jonah.png';
import julien from '../assets/julien.png';
import rebecca from '../assets/rebecca.png';
import jihui from '../assets/jihui.png';
import githubImg from '../assets/github.svg';
import linkedinImg from '../assets/linkedin.svg';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import {Typography} from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../../theme';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));

  const names = ['Ashlee Gafaru', 'Jonah Hammond', 'Julien Devlin', 'Rebecca Kwong', 'Jihui Xue'];
  const sources = [ashlee, jonah, julien, rebecca, jihui];
  const github = [
    'https://github.com/ashleegaf',
    'https://github.com/jdhammond',
    'https://github.com/juliendevlin',
    'https://github.com/rebegnowk',
    'https://github.com/jihuixue',
  ];
  const linkedin = [
    'https://www.linkedin.com/in/ashlee-gafaru/',
    'https://www.linkedin.com/in/jdhammond/',
    'https://www.linkedin.com/in/juliendevlin/',
    'https://www.linkedin.com/in/rebeccakwong/',
    'https://www.linkedin.com/in/jihuixue/',
  ];
  const team = names.map((name, i) => (
    <Grid xs={4} key={i}>
      <CardMedia component="img" alt="team member" image={sources[i]} sx={{borderRadius: '5px'}} />
      <Item>
        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
          {names[i]}
        </Typography>
        <Typography variant="subtitle2">Software Engineer</Typography>
        <Box sx={{marginTop: '.5rem', display: 'flex', justifyContent: 'center', gap: '4px'}}>
          <a href={github[i]}>
            <img src={githubImg} />
          </a>
          <a href={linkedin[i]}>
            <img src={linkedinImg} />
          </a>
        </Box>
      </Item>
    </Grid>
  ));

  return (
    <>
      <Box sx={{flexGrow: 1, width: '56rem'}}>
        <h3 style={{fontSize: '1.5rem', color: colors.primary[900]}}>Meet the Team</h3>
        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: 'center',
            justifyItems: 'center',
            alignContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          {team}
        </Grid>
      </Box>
    </>
  );
};

export default Team;
