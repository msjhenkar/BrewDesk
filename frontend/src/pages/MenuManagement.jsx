import React, { useState, useEffect } from 'react'
import { useMenuItems } from '../hooks/useMenuItems';
import "../styles/MenuManagement.css"
import MenuTable from '../components/Menu/MenuTable';
import MenuForm from '../components/Menu/MenuForm';
import DeleteConfirm from '../components/Menu/DeleteConfirm';
import Toast from '../components/UI/Toast'
import { Navigate, useNavigate } from 'react-router-dom';


const CATEGORIES = ['All', 'Beverages', 'Cold Drinks', 'Quick Bites', 'Desserts', 'Meals'];

const MenuManagement = () => {
  // Everything about menu data lives in the hook

  const navigate = useNavigate(); 
  const {
    menuItems, loading, error,
    editingItem, isFormOpen, setIsFormOpen,
    deleteConfirm, setDeleteConfirm,
    toast, setToast,
    handleSearch, handleCreate, handleUpdate,
    handleDelete, openEditForm, openCreateForm,
    pageNo, setPageNo, isLastPage, setPageSize,
    sortBy, setSortBy, sortDir, setSortDir
  } = useMenuItems();

  useEffect(() => {
    setPageSize(10);
  }, [setPageSize]);



  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = categoryFilter == 'All' || item.category === categoryFilter;
    const matchesPrice =
      priceFilter === 'all' ? true :
        priceFilter === 'low' ? item.price < 100 :
          priceFilter === 'medium' ? item.price >= 100 && item.price < 300 :
            priceFilter === 'high' ? item.price >= 300 : true;
    return matchesCategory && matchesPrice;
  })

  const handleDeleteClick = (itemId, itemName) => {
    setDeleteConfirm({ open: true, itemId, itemName });
  };

  const handleFormSubmit = (formData) => {
    if (editingItem) handleUpdate(formData);
    else handleCreate(formData);
  };

  return (
    <div className='menu-management-page'>


      {/* --SIDEBAR + MAIN LAYOUT-- */}

      <div className="dashboard-layout">


        {/* SIDEBAR */}
        <aside className='sidebar'>

          <div className="sidebar-logo-section">
            <div className="sidebar-logo-content">
              <span className="logo-icon">☕</span>

              <div className="logo-text-group">
                <p className="logo-title">CafeAdmin</p>
                <p className="logo-subtitle">BrewDesk</p>
              </div>
            </div>
          </div>

          <button className="sidebar-nav-item active-nav">
            <span>🗒️</span> Menu Items
          </button>

          <button className="sidebar-nav-item" onClick={() => navigate("/admin/orders")}>
            <span>📦</span> Orders
          </button>

          <button className="sidebar-nav-item">
            <span>👥</span> Customers
          </button>

          <button className="sidebar-nav-item">
            <span>📊</span> Reports
          </button>

          <button className="sidebar-nav-item">
            <span>⚙️</span> Settings
          </button>
        </aside>


        {/* MAIN CONTENT */}
        <main className="main-content">

          {/* HEADER */}
          <div className="page-header">

            <div className="header-text-section">
              <h1 className="page-title">Menu Management</h1>

              <p className="page-subtitle">
                Menu Items information
              </p>
            </div>


            <button className="add-menu-btn" onClick={openCreateForm}>
              <span className="add-icon">+</span>
              Add Menu Item
            </button>
          </div>

          {/* FILTER BAR */}
          <div className="filter-bar">

            {/* SEARCH */}
            <div className="search-container">

              <span className="search-icon">🔍</span>


              <input
                type="text"
                value={searchValue}
                className="search-input" placeholder='Search menu items...'
                onChange={e => {
                  setSearchValue(e.target.value);
                  handleSearch(e.target.value);
                  //Calls the API Search as user types
                }}
              />
            </div>

            <div className="category-filter-group">

              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`category-btn ${categoryFilter === category ? 'active-category' : ''}`}>
                  {category}
                </button>
              ))}

            </div>

            {/* PRICE FILTER */}
            <select
              value={priceFilter}
              onChange={e => setPriceFilter(e.target.value)}
              className="price-filter-dropdown">
              <option value="all">All Prices</option>
              <option value="low">Under ₹100</option>
              <option value="medium">₹100 – ₹300</option>
              <option value="high">₹300+</option>
            </select>

            {/* SORT BY */}
            <select
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value);
                setPageNo(1);
              }}
              className="price-filter-dropdown">
              <option value="id">Sort by ID</option>
              <option value="itemName">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
            </select>

            {/* SORT DIRECTION */}
            <select
              value={sortDir}
              onChange={e => {
                setSortDir(e.target.value);
                setPageNo(1);
              }}
              className="price-filter-dropdown">
              <option value="asc">Ascending ⬆</option>
              <option value="desc">Descending ⬇</option>
            </select>

          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}


          {/* TABLE SECTION */}
          <div className="table-container">
            <MenuTable
              items={filteredItems}
              loading={loading}
              onEdit={openEditForm}
              onDelete={handleDeleteClick}
            />

            {/* Pagination Controls */}
            {!searchValue.trim() && (
              <div className="pagination-bar">
                <button 
                  className="pagination-btn"
                  onClick={() => setPageNo(prev => Math.max(1, prev - 1))}
                  disabled={pageNo === 1}
                >
                  ◀ Previous
                </button>
                <span className="pagination-info">
                  Page <strong>{pageNo}</strong>
                </span>
                <button 
                  className="pagination-btn"
                  onClick={() => setPageNo(prev => prev + 1)}
                  disabled={isLastPage}
                >
                  Next ▶
                </button>
              </div>
            )}
          </div>

        </main>

      </div>

      <MenuForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
      />

      <DeleteConfirm
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, itemId: null })}
        onConfirm={handleDelete}
        itemName={deleteConfirm.itemName}
      />

      <Toast
        toast={toast}
        onClose={() => setToast({ show: false, message: '', type: '' })}
      />


    </div>
  )
}

export default MenuManagement
