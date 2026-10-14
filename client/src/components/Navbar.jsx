import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/login') {
    return null;
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkClass = (path) =>
    location.pathname === path
      ? 'font-semibold text-blue-700'
      : 'text-gray-600 hover:text-blue-700';

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-8 py-3">
        <span className="text-lg font-bold text-blue-700">StoreSense</span>

        <div className="flex items-center gap-5">
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            Dashboard
          </Link>
          <Link to="/products" className={linkClass('/products')}>
            Maal
          </Link>
          <Link to="/sales" className={linkClass('/sales')}>
            Sale
          </Link>
          <button
            onClick={logout}
            className="rounded-lg bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;