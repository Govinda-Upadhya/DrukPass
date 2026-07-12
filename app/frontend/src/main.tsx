import ReactDOM from 'react-dom/client';
import App from './App';

import { SolanaProvider } from './components/walletprovider';
import { Buffer } from 'buffer';
import { BrowserRouter } from 'react-router-dom';
globalThis.Buffer = Buffer;
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <SolanaProvider>
      <App />
    </SolanaProvider>
  </BrowserRouter>,
);
