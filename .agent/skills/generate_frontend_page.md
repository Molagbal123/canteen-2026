---
name: Generate Frontend Page
description: Generate a React page component for the customer-facing cafeteria app
---

# Generate Frontend Page

## When to Use
When creating a new customer-facing page in the React frontend (e.g., Menu, Cart, Order History, Profile).

## Input Required
- **Page name** (e.g., `Menu`, `Cart`, `OrderHistory`)
- **Data it displays** and its API endpoint
- **User interactions** (add to cart, place order, filter, search)

## Steps

1. **Create the page** at `src/pages/<PageName>/<PageName>.jsx`.

2. **Create associated styles** at `src/pages/<PageName>/<PageName>.module.css`.

3. **Follow this template**:

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './<PageName>.module.css';
import { resourceService } from '../../services/<resource>.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';

const PageName = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await resourceService.getAll({ page, limit: 12 });
      setData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page Title</h1>
      {/* Page content here */}
      <div className={styles.grid}>
        {data.map((item) => (
          <div key={item._id} className={styles.card}>
            {/* Card content */}
          </div>
        ))}
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default PageName;
```

4. **API Service** at `src/services/<resource>.service.js`:

```javascript
import api from './api'; // Axios instance with base URL & interceptors

export const resourceService = {
  getAll: (params) => api.get('/resources', { params }),
  getById: (id) => api.get(`/resources/${id}`),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
};
```

5. **Register the route** in `src/App.jsx` or `src/routes.jsx`:
```jsx
<Route path="/page-name" element={<PageName />} />
```

## Design Rules
- Use **CSS Modules** for styling isolation.
- Implement **loading states** and **error states** for every page.
- Make pages **responsive** with mobile-first design.
- Use reusable components from `components/common/` (Buttons, Cards, Modals).
- Provide **empty state** UI when no data is returned.

## Checklist
- [ ] Page component created in `src/pages/`
- [ ] CSS module created alongside component
- [ ] API service created/updated in `src/services/`
- [ ] Route registered in app router
- [ ] Loading, error, and empty states handled
- [ ] Responsive design implemented
- [ ] Reusable components utilized
