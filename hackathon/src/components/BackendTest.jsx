import { useEffect, useState } from 'react';
import axios from 'axios';

function BackendTest() {
  const [status, setStatus] = useState('Checking...');
  const [details, setDetails] = useState({});

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
        setDetails({
          configuredUrl: apiUrl,
          isDev: !import.meta.env.PROD,
          isProd: import.meta.env.PROD,
          hasEnvVar: !!import.meta.env.VITE_SERVER_URL
        });

        const response = await axios.get('/api/test');
        if (response.data.message === 'API is working') {
          setStatus('✅ Backend Connected!');
        } else {
          setStatus('⚠️ Backend responded but with unexpected data');
        }
      } catch (error) {
        setStatus('❌ Backend Not Connected');
        setDetails(prev => ({
          ...prev,
          error: error.message,
          errorDetails: error.response?.data || 'No response from server'
        }));
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 max-w-md z-50">
      <h3 className="font-bold text-lg mb-2">Backend Status</h3>
      <p className="mb-2">{status}</p>
      <details className="text-xs">
        <summary className="cursor-pointer font-semibold mb-1">Details</summary>
        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto">
          {JSON.stringify(details, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default BackendTest;
