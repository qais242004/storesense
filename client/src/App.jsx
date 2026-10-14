import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-blue-700">StoreSense</h1>
      <p className="text-gray-600">Dukaan ka hisaab kitaab</p>
      <button
        onClick={() => setCount(count + 1)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Clicked {count} times
      </button>
    </div>
  );
}

export default App;