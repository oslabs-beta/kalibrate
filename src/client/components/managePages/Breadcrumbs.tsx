import {useNavigate} from 'react-router-dom';
import {Breadcrumbs, Typography} from '@mui/material';
import {createBrowserHistory} from 'history';
import {BreadcrumbProps} from '../../types';

const Breadcrumb = ({topicName, topicComp}: BreadcrumbProps) => {
  const navigate = useNavigate();
  const history = createBrowserHistory();

  // get the path names, split to list in breadcrumbs
  const homePath =
    '/' +
    history.location.pathname
      .split('/')
      .filter(x => x)
      .slice(0, 2)
      .join('/') +
    '/topics';

  // removes the extra crumbs after going back to topics grid
  const subCrumb = history.location.pathname === homePath ? [] : [topicName, topicComp];

  return (
    <Breadcrumbs>
      <Typography sx={{cursor: 'pointer'}} onClick={() => navigate(homePath)}>
        Topics
      </Typography>
      {subCrumb.map((path, idx) => (
        <Typography key={idx}>{path.toLowerCase()}</Typography>
      ))}
    </Breadcrumbs>
  );
};
export default Breadcrumb;
