import { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', id: null });

  // Fetch all items
  const fetchItems = async () => {
    const res = await fetch('/api/data');
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const res = await fetch('/api/data', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: '', description: '', id: null });
      fetchItems();
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setForm(item);
  };

  // Delete item
  const handleDelete = async (id) => {
    const res = await fetch('/api/data', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchItems();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Neon CRUD App</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">{form.id ? 'Update' : 'Create'}</button>
        {form.id && <button onClick={() => setForm({ name: '', description: '', id: null })}>Cancel</button>}
      </form>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
