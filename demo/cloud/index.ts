import publishMessages from './producer';
import consumeMessages from './consumer';

// run the producer and consumer
setInterval(publishMessages, 5000);
setInterval(consumeMessages, 5000);