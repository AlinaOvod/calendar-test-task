import {
  Route,
  HashRouter as Router,
  Routes,
} from 'react-router-dom';
import { App } from './App';
import BigCalendar from './components/BigCalendar/BigCalendar';
import { NotReadyPage } from './components/NotReadyPage/NotReadyPage';

export const Root = () => (
<Router>
  <Routes>
    <Route path="/" element={<App />}>
      <Route index element={<BigCalendar />} /> 
      <Route path="calendar" element={<BigCalendar />} /> 
      <Route path="*" element={<NotReadyPage />} /> 
    </Route>
  </Routes>
</Router>
);
