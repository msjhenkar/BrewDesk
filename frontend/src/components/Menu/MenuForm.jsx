import React, { useEffect, useState } from 'react'
import "../../styles/MenuForm.css"

const MenuForm = ({ isOpen, onClose, onSubmit, editingItem }) => {

  const [formData, setFormData] = useState({
    itemName: '', description: '', price: '', category: '', imageUrl: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        itemName: editingItem.itemName || '',
        description: editingItem.description || '',
        price: editingItem.price || '',
        category: editingItem.category || '',
        imageUrl: editingItem.imageUrl || '',
      });
    } else {
      setFormData({
        itemName: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",

      });
    }
    setErrors({});
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const validate = () => {
    const newErrors = {};

    if (!formData.itemName.trim())
      newErrors.itemName = "Name is required";


    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);

     return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e) => {
    // IMPORTANT: Prevent default form submission (which would reload the page)
    e.preventDefault();
    if (!validate()) return;  // Stop if validation fails
    // Convert price to a number before sending (form inputs are always strings)
    onSubmit({ ...formData, price: parseFloat(formData.price) });
  };

  // If modal is not open, render nothing
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>

      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>
            {editingItem ? "Edit Menu Item" : "➕ Add New Item"}
          </h2>

          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="menu-form">

          {/* Name */}
          <div className="form-group">
            <label > Item Name *</label>

            <input
              type="text"
              name='itemName'
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g. Cappuccino"
              className={errors.itemName ? "input-error" : ""}
            />

            {errors.itemName && (
              <p className="error-text">{errors.itemName}</p>
            )}
          </div>

          {/* description */}
          <div className="form-group">
            <label >Description</label>

            <textarea name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder='Brief description...' />
          </div>

          {/* Price + Category */}
          <div className="two-column">

            <div className="form-group">
              <label>Price (₹) *</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="150"
                min="0"
                step="0.01"
                className={errors.price ? "input-error" : ""}
              />

              {errors.price && (
                <p className="error-text">{errors.price}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="">Category *</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? "input-error" : ""}
              >
                <option value="">Select...</option>
                <option value="Beverage">Beverage</option>
                <option value="Quick Bites">Quick Bites</option>
                <option value="Dessert">Dessert</option>

              </select>

              {errors.category && (
                <p className="error-text">{errors.category}</p>
              )}
            </div>
          </div>
          {/* Image URL */}
          <div className="form-group">
            <label>Image URL</label>

            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button

            type="submit"
            className="submit-btn">
              {editingItem ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>


      </div>

    </div>
  )
}

export default MenuForm
