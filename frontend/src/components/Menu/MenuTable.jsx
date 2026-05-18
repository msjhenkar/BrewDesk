import React from 'react'
import "../../styles/MenuTable.css"


const MenuTable = ({ items, onEdit, onDelete, loading }) => {

  // console.log(items)

  const categoryColors = {
    Coffee: "coffee-badge",
    Tea: "tea-badge",
    "Cold Drinks": "cold-badge",
    "Quick Bites": "quick-badge",
    Desserts: "dessert-badge",
  }

  if (loading) {
    return (
      <div className="loading-container">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-row"></div>
        ))}
      </div>
    )
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">☕</div>
        <p className="empty-title">No menu items found</p>
        <p className="empty-text">
          Add your first item to get started!
        </p>
      </div>
    );
  }
  return (
    <div className="table-container">

      <table className="menu-table">

        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th className="text-right">Price</th>
            {/* <th className="text-center">Status</th> */}
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>

              {/* Item Info */}
              <td>
                <div className="item-info">

                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.itemName}
                      className='item-image'
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="default-image">☕</div>
                  )}

                  <div>
                    <p className="item-name">{item.itemName}</p>

                    {item.description && (
                      <p className="item-description">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* caegory */}
              <td>
                <span
                  className={`category-badge ${categoryColors[item.category] || "default-badge"
                    }`}
                >{item.category}
                </span>
              </td>


              <td className="text-right price">
                ₹{parseFloat(item.price).toFixed(2)}
              </td>


              {/* Status
              <td className="text-center">
                <span
                  className={`status-badge ${item.available
                    ? "available"
                    : "unavailable"
                    }`}
                >
                  {item.available
                    ? "Available"
                    : "Unavailable"}
                </span>
              </td> */}


              {/* Actions */}
              <td>
                <div className="action-buttons">

                  <button
                    onClick={() =>{ 
                      // console.log("edit clicked")
                      onEdit(item)
                    
                    }}
                    className="edit-btn"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(item.id, item.name)
                    }
                    className="delete-btn"
                  >
                    Delete
                  </button>

                </div>
              </td>
            </tr>


          ))}
        </tbody>

      </table>
    </div>
  )
}

export default MenuTable
