import {ConnectionContainerProps} from '../../types';
import Connect from '../connectPages/Connect';
import Client from '../connectPages/Client';

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
    setIsConnectionError,
    isDeleteLoading,
    setIsDeleteLoading,
  } = props;

  // if a client is selected, render client view; otherwise render connect view
  return selectedClient ? (
    <Client
      selectedClient={selectedClient}
      setSelectedClient={setSelectedClient}
      setConnectedClient={setConnectedClient}
      connectedClient={connectedClient}
      storedClients={storedClients}
      setStoredClients={setStoredClients}
      isConnectionLoading={isConnectionLoading}
      isError={isConnectionError}
      setIsError={setIsConnectionError}
      isDeleteLoading={isDeleteLoading}
      setIsDeleteLoading={setIsDeleteLoading}
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
