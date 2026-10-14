import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sales() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadProducts = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Server se rabta nahi ho saka');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    loadProducts();
  }, [navigate]);

  const handleSell = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: Number(quantity),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Sale nahi ho saki');
        return;
      }

      setMessage(`Sale ho gayi. Kul raqam: Rs ${data.total}`);
      setQuantity('');
      loadProducts();
    } catch (err) {
      setError('Server se rabta nahi ho saka');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold text-blue-700">Sale likhein</h1>

        <form onSubmit={handleSell} className="rounded-xl bg-white p-6 shadow">
          {message && (
            <p className="mb-4 rounded bg-green-100 px-3 py-2 text-sm text-green-700">
              {message}
            </p>
          )}
          {error && (
            <p className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <label className="mb-1 block text-sm text-gray-700">Maal</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mb-4 w-full rounded border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Maal chunein</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (Rs {p.price}, stock {p.stock})
              </option>
            ))}
          </select>

          <label className="mb-1 block text-sm text-gray-700">Kitne piece</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mb-6 w-full rounded border border-gray-300 px-3 py-2"
            min="1"
            required
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700"
          >
            Becho
          </button>
        </form>
      </div>
    </div>
  );
}

export default Sales;