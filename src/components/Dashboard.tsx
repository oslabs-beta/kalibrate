import React from 'react';

const Dashboard = props => {
  // Eventual props to use...
  // {clusterName, clusterVersion, brokerNumber, topicNumber, partitionNumber, messageNumber, production, consumption} = props

  // Values are hard coded and should be updated to prop values
  return (
    <div className="mt-10 w-min m-auto flex flex-col">
      <div className="stats shadow mb-10">
        <div className="stat">
          <div className="stat-title">Name</div>
          <div className="stat-value">myCluster</div>
        </div>

        <div className="stat">
          <div className="stat-title">Version</div>
          <div className="stat-value">v1.0</div>
        </div>

        <div className="stat">
          <div className="stat-title">Brokers</div>
          <div className="stat-value">3</div>
          <div className="stat-actions">
            <button className="btn btn-sm">Go to brokers</button>
          </div>
        </div>
      </div>

      <div className="stats shadow mb-10">
        <div className="stat">
          <div className="stat-title">Topics</div>
          <div className="stat-value">50</div>
          <div className="stat-actions">
            <button className="btn btn-sm">Go to topics</button>
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Partitions</div>
          <div className="stat-value">200</div>
        </div>

        <div className="stat">
          <div className="stat-title">Events</div>
          <div className="stat-value">1000</div>
        </div>
      </div>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Production</div>
          <div className="stat-value">1000000 bytes</div>
          <div className="stat-actions">
            <button className="btn btn-sm">Go to production</button>
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Consumption</div>
          <div className="stat-value">1000000 bytes</div>
          <div className="stat-actions">
            <button className="btn btn-sm">Go to consumption</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
