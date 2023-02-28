import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'


const Overview = props => {

  const {connectedCluster, sessionClusters} = props;
  // Eventual props to use...
  // {clusterName, clusterVersion, brokerNumber, topicNumber, partitionNumber, messageNumber, production, consumption} = props

  // Values are hard coded and should be updated to prop values

  function createData(
    clusterName: string,
    version: number,
    brokers: number,
    partitions: number,
    topics: number,
    production: string
  ) {
    return { clusterName, version, brokers, partitions, topics, production };
  }

  interface DataRow {
    clusterName: string;
    version: number;
    brokers: number;
    partitions: number;
    topics: number;
    production: string;
  }
  
  const rows : DataRow[]= [];

  //this for loop will push new row into the table whenever there is a new cluster added
  //data for each row will need to follow the order of createData above

  for( let i = 0; i < sessionClusters.length; i++) {
    rows.push(createData(sessionClusters[i],1,1,1,1,'0bytes'))
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Cluster name</TableCell>
            <TableCell align="right">Version</TableCell>
            <TableCell align="right">Brokers count</TableCell>
            <TableCell align="right">Partitions</TableCell>
            <TableCell align="right">Topics</TableCell>
            <TableCell align="right">Production</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.clusterName}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.clusterName}
              </TableCell>
              <TableCell align="right">{row.version}</TableCell>
              <TableCell align="right">{row.brokers}</TableCell>
              <TableCell align="right">{row.partitions}</TableCell>
              <TableCell align="right">{row.topics}</TableCell>
              <TableCell align="right">{row.production}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


    //  <div className="mt-10 w-min m-auto flex flex-col">
    //   <div className="stats shadow mb-10">
    //     <div className="stat">
    //       <div className="stat-title">Name</div>
    //       <div className="stat-value">{connectedCluster}</div>
    //     </div>

    //     <div className="stat">
    //       <div className="stat-title">Version</div>
    //       <div className="stat-value">v1.0</div>
    //     </div>

    //     <div className="stat">
    //       <div className="stat-title">Brokers</div>
    //       <div className="stat-value">3</div>
    //       <div className="stat-actions">
    //         <button className="btn btn-sm">Go to brokers</button>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="stats shadow mb-10">
    //     <div className="stat">
    //       <div className="stat-title">Topics</div>
    //       <div className="stat-value">50</div>
    //       <div className="stat-actions">
    //         <button className="btn btn-sm">Go to topics</button>
    //       </div>
    //     </div>

    //     <div className="stat">
    //       <div className="stat-title">Partitions</div>
    //       <div className="stat-value">200</div>
    //     </div>

    //     <div className="stat">
    //       <div className="stat-title">Events</div>
    //       <div className="stat-value">1000</div>
    //     </div>
    //   </div>

    //   <div className="stats shadow">
    //     <div className="stat">
    //       <div className="stat-title">Production</div>
    //       <div className="stat-value">1000000 bytes</div>
    //       <div className="stat-actions">
    //         <button className="btn btn-sm">Go to production</button>
    //       </div>
    //     </div>

    //     <div className="stat">
    //       <div className="stat-title">Consumption</div>
    //       <div className="stat-value">1000000 bytes</div>
    //       <div className="stat-actions">
    //         <button className="btn btn-sm">Go to consumption</button>
    //       </div>
    //     </div>
    //   </div>
    // </div> 

export default Overview;
