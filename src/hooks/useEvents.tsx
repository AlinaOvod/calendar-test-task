import { useContext } from "react";
import { EventsContext } from "../context/EventContext";

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};