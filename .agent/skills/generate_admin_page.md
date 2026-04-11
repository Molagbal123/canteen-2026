---
name: Generate Admin Page
description: Generate a React admin dashboard page with table, CRUD operations, and modals
---

# Generate Admin Page

## When to Use
When creating an admin-only management page (e.g., Manage Products, Manage Orders, Manage Users).

## Input Required
- **Resource name** (e.g., `Product`, `User`, `Order`)
- **Table columns** to display
- **CRUD operations** available to admin
- **Filters and search** fields

## Steps

1. **Create the page** at `src/pages/admin/<ResourceName>Management/<ResourceName>Management.jsx`.

2. **Create styles** at `src/pages/admin/<ResourceName>Management/<ResourceName>Management.module.css`.

3. **Follow this template**:

```jsx
import { useState, useEffect, useCallback } from 'react';
import styles from './<ResourceName>Management.module.css';
import { resourceService } from '../../../services/<resource>.service';
import DataTable from '../../../components/admin/DataTable';
import SearchBar from '../../../components/admin/SearchBar';
import CreateEditModal from '../../../components/admin/CreateEditModal';
import DeleteConfirmModal from '../../../components/admin/DeleteConfirmModal';
import { useToast } from '../../../hooks/useToast';

const ResourceManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showToast } = useToast();

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions' },
  ];

  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await resourceService.getAll({
        page, limit: 20, search,
      });
      setData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (formData) => {
    await resourceService.create(formData);
    showToast('Created successfully', 'success');
    setShowCreateModal(false);
    fetchData();
  };

  const handleUpdate = async (formData) => {
    await resourceService.update(selectedItem._id, formData);
    showToast('Updated successfully', 'success');
    setSelectedItem(null);
    fetchData();
  };

  const handleDelete = async () => {
    await resourceService.delete(selectedItem._id);
    showToast('Deleted successfully', 'success');
    setShowDeleteModal(false);
    setSelectedItem(null);
    fetchData();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Resources</h1>
        <button
          className={styles.createBtn}
          onClick={() => setShowCreateModal(true)}
        >
          + Add New
        </button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search..." />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        onPageChange={(p) => fetchData(p)}
        onEdit={(item) => setSelectedItem(item)}
        onDelete={(item) => {
          setSelectedItem(item);
          setShowDeleteModal(true);
        }}
      />

      {(showCreateModal || selectedItem) && (
        <CreateEditModal
          item={selectedItem}
          onSave={selectedItem ? handleUpdate : handleCreate}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          itemName={selectedItem?.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ResourceManagement;
```

4. **Register** under admin routes (requires `admin` role):
```jsx
<Route path="/admin/resources" element={
  <ProtectedRoute roles={['admin']}>
    <ResourceManagement />
  </ProtectedRoute>
} />
```

## Admin-Specific Components
Ensure these shared admin components exist in `src/components/admin/`:
- `DataTable` — sortable, paginated table
- `SearchBar` — debounced search input
- `CreateEditModal` — form modal for create/edit
- `DeleteConfirmModal` — confirmation dialog
- `AdminSidebar` — navigation sidebar
- `StatsCard` — dashboard metric cards

## Checklist
- [ ] Page created in `src/pages/admin/`
- [ ] Wrapped with `ProtectedRoute` requiring admin role
- [ ] DataTable with pagination, sorting, and actions
- [ ] Create/Edit modal with form validation
- [ ] Delete confirmation modal
- [ ] Toast notifications for success/error
- [ ] Search and filter functionality
- [ ] Responsive layout for admin panel
