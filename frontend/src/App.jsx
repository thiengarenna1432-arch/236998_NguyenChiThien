import { useEffect, useState } from 'react';
import './App.css';

const emptyForm = {
  foodId: '',
  name: '',
  category: '',
  cuisine: '',
  ingredients: '',
  price: '',
  quantity: '',
  description: '',
  imageUrl: '',
};

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function foodToForm(food) {
  return {
    ...food,
    ingredients: food.ingredients.join(', '),
  };
}

function App() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function request(url, options = {}) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const details = Array.isArray(data.details) ? `: ${data.details.join(', ')}` : '';
      throw new Error(`${data.error || 'Yêu cầu thất bại'}${details}`);
    }
    return data;
  }

  async function loadFoods(keyword = search) {
    setLoading(true);
    setError('');
    try {
      const suffix = keyword.trim() ? `?search=${encodeURIComponent(keyword.trim())}` : '';
      setFoods(await request(`/api/foods${suffix}`));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods('');
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedFood(null);
    setError('');
  }

  function startEdit(food) {
    setEditingId(food._id);
    setForm(foodToForm(food));
    setSelectedFood(null);
    setError('');
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    const payload = {
      ...form,
      ingredients: form.ingredients.split(',').map((item) => item.trim()).filter(Boolean),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };
    try {
      const saved = await request(editingId ? `/api/foods/${editingId}` : '/api/foods', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      setMessage(editingId ? 'Đã cập nhật món ăn.' : 'Đã thêm món ăn.');
      setSelectedFood(saved);
      startCreate();
      await loadFoods();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteFood(food) {
    if (!window.confirm(`Xóa món "${food.name}"?`)) return;
    setError('');
    setMessage('');
    try {
      await request(`/api/foods/${food._id}`, { method: 'DELETE' });
      setMessage('Đã xóa món ăn.');
      if (selectedFood?._id === food._id) setSelectedFood(null);
      if (editingId === food._id) startCreate();
      await loadFoods();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function submitSearch(event) {
    event.preventDefault();
    loadFoods();
  }

  function clearSearch() {
    setSearch('');
    loadFoods('');
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">QUẢN LÝ ẨM THỰC VIỆT</p>
          <h1>Kho món ngon mỗi ngày</h1>
          <p>Tra cứu, thêm mới và quản lý thực đơn của bạn.</p>
        </div>
        <button className="primary-button" onClick={startCreate}>+ Thêm món ăn</button>
      </header>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <section className="toolbar">
        <form onSubmit={submitSearch} className="search-form">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tên, loại hoặc vùng miền..." />
          <button className="primary-button" type="submit">Tìm kiếm</button>
          <button className="secondary-button" type="button" onClick={clearSearch}>Xóa bộ lọc</button>
        </form>
      </section>

      <div className="content-grid">
        <section>
          <div className="section-heading">
            <h2>Danh sách món ăn</h2>
            <span>{foods.length} món</span>
          </div>
          {loading ? <p className="muted">Đang tải dữ liệu...</p> : (
            <div className="food-list">
              {foods.map((food) => (
                <article className="food-card" key={food._id} onClick={() => setSelectedFood(food)}>
                  <div>
                    <span className="food-id">{food.foodId}</span>
                    <h3>{food.name}</h3>
                    <p>{food.category} · {food.cuisine}</p>
                  </div>
                  <div className="food-meta">
                    <strong>{formatPrice(food.price)}</strong>
                    <span>Còn {food.quantity}</span>
                  </div>
                  <div className="card-actions">
                    <button className="link-button" onClick={(event) => { event.stopPropagation(); startEdit(food); }}>Sửa</button>
                    <button className="link-button danger-text" onClick={(event) => { event.stopPropagation(); deleteFood(food); }}>Xóa</button>
                  </div>
                </article>
              ))}
              {!foods.length && <p className="muted">Không tìm thấy món ăn.</p>}
            </div>
          )}
        </section>

        <aside className="side-panel">
          {selectedFood ? (
            <div className="detail-panel">
              <div className="section-heading"><h2>Chi tiết món</h2><button className="close-button" onClick={() => setSelectedFood(null)}>×</button></div>
              {selectedFood.imageUrl && <img className="food-image" src={selectedFood.imageUrl} alt={selectedFood.name} />}
              <h3>{selectedFood.name}</h3>
              <p>{selectedFood.description || 'Chưa có mô tả.'}</p>
              <dl>
                <dt>Mã món</dt><dd>{selectedFood.foodId}</dd>
                <dt>Loại</dt><dd>{selectedFood.category}</dd>
                <dt>Ẩm thực</dt><dd>{selectedFood.cuisine}</dd>
                <dt>Giá</dt><dd>{formatPrice(selectedFood.price)}</dd>
                <dt>Số lượng</dt><dd>{selectedFood.quantity}</dd>
                <dt>Nguyên liệu</dt><dd>{selectedFood.ingredients.join(', ')}</dd>
              </dl>
            </div>
          ) : (
            <form className="form-panel" onSubmit={submitForm}>
              <div className="section-heading"><h2>{editingId ? 'Cập nhật món' : 'Thêm món mới'}</h2>{editingId && <button className="close-button" type="button" onClick={startCreate}>×</button>}</div>
              {['foodId', 'name', 'category', 'cuisine', 'ingredients', 'price', 'quantity', 'imageUrl'].map((field) => (
                <label key={field}>{field === 'foodId' ? 'Mã món' : field === 'ingredients' ? 'Nguyên liệu (cách nhau bằng dấu phẩy)' : field}
                  <input name={field} value={form[field]} onChange={updateField} required={!['imageUrl'].includes(field)} type={['price', 'quantity'].includes(field) ? 'number' : 'text'} min={field === 'price' || field === 'quantity' ? 0 : undefined} />
                </label>
              ))}
              <label>Mô tả<textarea name="description" value={form.description} onChange={updateField} rows="3" /></label>
              <div className="form-actions"><button className="primary-button" type="submit">{editingId ? 'Lưu thay đổi' : 'Thêm món'}</button>{editingId && <button className="secondary-button" type="button" onClick={startCreate}>Hủy</button>}</div>
            </form>
          )}
        </aside>
      </div>
    </main>
  );
}

export default App;
