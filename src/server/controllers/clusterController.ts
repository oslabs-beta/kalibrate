import {controller} from './../types';
import {PrismaClient} from '@prisma/client';
// import Cache

const prisma = new PrismaClient();

const clusterController: controller = {};

// read cluster connection details upon logging in
// or when connecting to a cluster from dashboard
clusterController.getConnectionDetails = async (req, res, next) => {
  const {email} = res.locals.user;

  // query database for a list of user's cluster connection details
  const result = await prisma.user.findMany({
    where: {
      email: `${email}`,
    },
  });

  // some users may not have connected to a cluster during an active session
  // so no error handling is used for an empty result array

  // save connection details to cache and res.locals
  if (result.length) {
    const {clusters} = result;
    cache.storage = clusters;
    res.locals.clusters = clusters;
  }

  return next();
};

// store cluster connection details 
// when user connects to a cluster from dashboard
clusterController.storeConnectionDetails = async (req, res, next) => {
  // 
  const {email} = res.locals.user;
  // if connection details are not stored in database
  // update user's info to store connection details
  const updateUser = await prisma.user.update({
    where: {
      email: 'viola@prisma.io',
    },
  });
  // store in database
  // save them in res.locals and return to frontend
  return next();
};

export default clusterController;
