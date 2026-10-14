import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const loadSummary = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboard/summary', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const data = await res.json();
        setSummary(data);
      } catch (err) {
        setError('Server se rabta nahi ho saka');
      }
    };

    loadSummary();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-blue-700">Dashboard</h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 px-3 py-2 text-red-700">{error}</p>
        )}

        {!summary && !error && <p className="text-gray-600">Loading...</p>}

        {summary && (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-white p-5 shadow">
                <p className="text-sm text-gray-500">Aaj ki kamai</p>
                <p className="text-2xl font-bold text-green-700">
                  Rs {summary.todayAmount}
                </p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow">
                <p className="text-sm text-gray-500">Aaj bike piece</p>
                <p className="text-2xl font-bold">{summary.todayItems}</p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow">
                <p className="text-sm text-gray-500">Aaj ki sales</p>
                <p className="text-2xl font-bold">{summary.todaySalesCount}</p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow">
                <p className="text-sm text-gray-500">Kul maal</p>
                <p className="text-2xl font-bold">{summary.totalProducts}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-white p-5 shadow">
              <h2 className="mb-3 text-lg font-semibold text-red-700">
                Kam stock wala maal
              </h2>
              {summary.lowStock.length === 0 ? (
                <p className="text-gray-600">Sab maal ka stock theek hai.</p>
              ) : (
                <ul>
                  {summary.lowStock.map((p) => (
                    <li key={p._id} className="flex justify-between border-b py-2">
                      <span>{p.name}</span>
                      <span className="font-semibold">{p.stock} bacha</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;