import {ConnectionContainerProps} from '../types';
import Connect from './Connect';
import Client from './Client';

const ConnectionContainer = (props: ConnectionContainerProps) => {
  const {
    selectedClient,
    setSelectedClient,
    connectedClient,
    setConnectedClient,
    storedClients,
    setStoredClients,
    isConnectionLoading,
    isConnectionError,
  } = props;

  // if a client is selected, render client view; otherwise render connect view
  return selectedClient ? (
    <Client
      selectedClient={selectedClient}
      setConnectedClient={setConnectedClient}
      connectedClient={connectedClient}
      storedClients={storedClients}
      isLoading={isConnectionLoading}
      isError={isConnectionError}
    />
  ) : (
    <Connect
      setSelectedClient={setSelectedClient}
      storedClients={storedClients}
      setStoredClients={setStoredClients}
    />
  );
};

export default ConnectionContainer;
