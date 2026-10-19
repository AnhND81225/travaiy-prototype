import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './features/travel/travel.css';
import { TravelProvider } from './features/travel/TravelContext';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <TravelProvider><App /></TravelProvider>
  </BrowserRouter>
);
