import {
  Route,
  HashRouter as Router,
  Routes,
} from 'react-router-dom';
import { App } from './App';
import BigCalendar from './components/BigCalendar/BigCalendar';

export const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<BigCalendar />} />
        <Route path="calendar" element={<BigCalendar />} />
        <Route path="*" element={<p>Not found page</p>} />
      </Route>
    </Routes>
  </Router>
);
