import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Breadcrumbs, Link, Typography} from '@mui/material';
import {createBrowserHistory} from 'history';
import path from 'path';
// import history from "history/browser";

const Breadcrumb = ({topicName, topicComp}) => {
  const navigate = useNavigate();
  const history = createBrowserHistory();

  //get the path names, split to list in breadcrumbs
  const homePath = '/' + history.location.pathname.split('/').filter(x => x)[0] + '/topics';

  //removes the extra crumbs after going back to topics grid
  const subCrumb = history.location.pathname === homePath ? [] : [topicName, topicComp];
  return (
    <Breadcrumbs>
      <Link onClick={() => navigate(homePath)}>Topics</Link>
      {subCrumb.map(path => (
        <Typography>{path}</Typography>
      ))}
    </Breadcrumbs>
  );
};
export default Breadcrumb;

/*
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            <Typography className="topicCrumb" onClick={() => navigate(-1)}>
              Topics
            </Typography>
            {selectedTopic && <div>{selectedTopic}</div>}
            {activeTopicsComponent && <div>{activeTopicsComponent}</div>}
          </Breadcrumbs>
          */
