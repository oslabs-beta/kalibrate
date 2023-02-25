const ProducersDisplay = props => {
  // placeholder for eventual props

  // once backdata data shape received, maybe refactor to loop like:
  // const displayElements = [];
  // for (const el of props.producerData) {
  //   displayElements.push(<td>producerData[el]</td>)
  // }

  return (
    <div className="wrapper">
      <div className="display-table">
        <table style={{width: '100vw'}}>
          <tr>
            <th>Topic Name</th>
            <th>Topic Role</th>
            <th>Offset</th>
          </tr>
          <tr>{/*displayElements*/}</tr>
        </table>
      </div>
    </div>
  );
};

export default ProducersDisplay;
