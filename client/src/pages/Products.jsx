import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const loadProducts = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [navigate]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || 'Maal add nahi ho saka');
        return;
      }

      setProducts([data, ...products]);
      setName('');
      setPrice('');
      setStock('');
    } catch (err) {
      setFormError('Server se rabta nahi ho saka');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-blue-700">Maal ki list</h1>

        <form
          onSubmit={handleAdd}
          className="mb-6 rounded-xl bg-white p-5 shadow"
        >
          <h2 className="mb-3 text-lg font-semibold">Naya maal add karein</h2>

          {formError && (
            <p className="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              type="text"
              placeholder="Naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Qeemat"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2"
              min="0"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2"
              min="0"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>

        {error && (
          <p className="mb-4 rounded bg-red-100 px-3 py-2 text-red-700">{error}</p>
        )}

        {loading && <p className="text-gray-600">Loading...</p>}

        {!loading && !error && (
          <div className="rounded-xl bg-white p-5 shadow">
            {products.length === 0 ? (
              <p className="text-gray-600">Abhi koi maal nahi hai.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="py-2">Naam</th>
                    <th className="py-2">Qeemat</th>
                    <th className="py-2">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b">
                      <td className="py-2">{p.name}</td>
                      <td className="py-2">Rs {p.price}</td>
                      <td className="py-2">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;