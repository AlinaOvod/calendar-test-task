import { EventsProvider } from './context/EventContext';
import { Root } from './Root';

export const AppWithContext = () => {
  return (
    <EventsProvider>
        <Root />
    </EventsProvider>
  );
};
