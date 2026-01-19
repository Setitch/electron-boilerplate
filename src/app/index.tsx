import App from '@/app/app';
import '@/app/styles/globals.css';

import { createRoot } from 'react-dom/client';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(<App />);
