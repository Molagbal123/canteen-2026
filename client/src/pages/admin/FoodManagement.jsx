import { useState, useEffect, useCallback } from 'react';
import { foodAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './FoodManagement.module.css';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

const emptyForm = { name: '', price: '', description: '', category: '', image: null };

const FoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      const res = await foodAPI.getAll({ limit: 100 });
      setFoods(res.data);
    } catch (err) {
      showToast('Tải danh sách món ăn thất bại', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchFoods(); }, [fetchFoods]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImagePreview('');
    setShowModal(true);
  };

  const openEdit = (food) => {
    setEditing(food);
    setForm({
      name: food.name,
      price: food.price,
      description: food.description || '',
      category: food.category,
      image: null,
    });
    const imgUrl = food.image?.startsWith('http') ? food.image : `http://localhost:5000${food.image}`;
    setImagePreview(imgUrl);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.[0]) {
      setForm({ ...form, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        name: form.name,
        price: form.price,
        description: form.description,
        category: form.category,
      };
      if (form.image) data.image = form.image;

      if (editing) {
        await foodAPI.update(editing.id, data);
        showToast('Cập nhật món ăn thành công', 'success');
      } else {
        await foodAPI.create(data);
        showToast('Thêm món ăn thành công', 'success');
      }
      setShowModal(false);
      fetchFoods();
    } catch (err) {
      showToast(err.message || 'Thao tác thất bại', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await foodAPI.delete(deleteTarget.id);
      showToast('Đã xóa món ăn', 'success');
      setDeleteTarget(null);
      fetchFoods();
    } catch (err) {
      showToast(err.message || 'Xóa thất bại', 'error');
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.foodPage}>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Quản Lý Món Ăn</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Thêm Món Ăn
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Món Ăn</th>
              <th>Danh Mục</th>
              <th>Giá</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id}>
                <td>
                  <div className={styles.foodRow}>
                    <img
                      className={styles.foodThumb}
                      src={getImageUrl(food.image)}
                      alt={food.name}
                      onError={(e) => { e.target.src = 'https://placehold.co/88x88/f1f3f6/9ca3af?text=Food'; }}
                    />
                    <span className={styles.foodName}>{food.name}</span>
                  </div>
                </td>
                <td><span className="badge badge-cooking">{food.category}</span></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatPrice(food.price)}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={() => openEdit(food)} title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => setDeleteTarget(food)} title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {foods.length === 0 && (
          <div className="empty-state" style={{ padding: '40px' }}>
            <h3>Chưa có món ăn nào</h3>
            <p>Hãy thêm món ăn đầu tiên của bạn</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editing ? 'Cập Nhật Món Ăn' : 'Thêm Món Ăn Mới'}</h2>
              <button className="btn-icon btn-ghost btn-sm" onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form className={styles.modalBody} onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên Món</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Giá (VNĐ)</label>
                <input className="form-input" name="price" type="number" step="1000" min="0" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Danh Mục</label>
                <input className="form-input" name="category" value={form.category} onChange={handleChange} required placeholder="Vd: Cơm, Mì, Nước uống" />
              </div>
              <div className="form-group">
                <label className="form-label">Mô Tả</label>
                <textarea className="form-input" name="description" rows="3" value={form.description} onChange={handleChange} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Hình Ảnh</label>
                <input className="form-input" name="image" type="file" accept="image/*" onChange={handleChange} />
                {imagePreview && (
                  <img className={styles.imagePreview} src={imagePreview} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                )}
              </div>
              <div className={styles.modalActions}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteModal}>
              <h2 className={styles.deleteTitle}>Xóa Món Ăn</h2>
              <p className={styles.deleteText}>
                Bạn có chắc chắn muốn xóa món <strong>{deleteTarget.name}</strong> không?
                Hành động này không thể hoàn tác.
              </p>
              <div className={styles.deleteActions}>
                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Hủy</button>
                <button className="btn btn-danger" onClick={handleDelete}>Xóa</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodManagement;
