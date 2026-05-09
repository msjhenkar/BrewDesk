import React, { useState } from 'react'
import { useMenuItems } from '../hooks/useMenuItems';
import "../styles/MenuManagement.css"
import MenuTable from '../components/Menu/MenuTable';


const CATEGORIES = ['All', 'Beverages', 'Cold Drinks', 'Quick Bites', 'Desserts', 'Meals'];

const MenuManagement = () => {
  // Everything about menu data lives in the hook
  const {
    menuItems, loading, error,
    editingItem, isFormOpen, setIsFormOpen,
    deleteConfirm, setDeleteConfirm,
    toast, setToast,
    handleSearch, handleCreate, handleUpdate,
    handleDelete, openEditForm, openCreateForm
  } = useMenuItems();


 
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = categoryFilter == 'All' || item.category ===categoryFilter;
    const matchesPrice = 
      priceFilter === 'all'    ? true :
      priceFilter === 'low'    ? item.price < 100 :
      priceFilter === 'medium' ? item.price >= 100 && item.price < 300 :
      priceFilter === 'high'   ? item.price >= 300 : true;
    return matchesCategory && matchesPrice;
  })

  const handleDeleteClick = (itemId, itemName) => {
    setDeleteConfirm({open:true, itemId, itemName});
  };

  const handleFormSubmit = (formData) => {
    if (editingItem) handleUpdate(formData);
    else handleCreate(formData);
  };

  return (
    <div className='menu-management-page'>
      <h2>Menu Management</h2>

      {/* --SIDEBAR + MAIN LAYOUT-- */}

      <div className="dashboard-layout">


        {/* SIDEBAR */}
        <aside className='sidebar'>

          <div className="sidebar-logo-section">
            <div className="sidebar-logo-content">
              <span className="logo-icon">☕</span>

              <div className="logo-text-group">
                <p className="logo-title">CafeAdmin</p>
                <p className="logo-subtitle">Management System</p>
              </div>
            </div>
          </div>

          <button className="sidebar-nav-item active-nav">
            <span>🗒️</span> Menu Items
          </button>

          <button className="sidebar-nav-item">
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
              className="category-btn">
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
            </div>

        </main>

      </div>

      
    </div>
  )
}

export default MenuManagement
