const consumersDisplay = () => {
  return (
    <div className="wrapper">
      <div className="display-table">
        <table style={{border: '1 solid  pink', width: '100vw'}}>
          <tr>
            <th style={{border: '5px double pink'}}>Consumer Head ID</th>
            <th style={{border: '5px double pink'}}>Topics Subscribed</th>
            <th style={{border: '5px double pink'}}>Records Lag (max)</th>
            <th style={{border: '5px double pink'}}>Status</th>
          </tr>
          <tr>
            <td>1234567890</td>
            <td>234</td>
            <td>suning</td>
            <td>3</td>
          </tr>
        </table>
      </div>
    </div>
  );
};
export default consumersDisplay;
