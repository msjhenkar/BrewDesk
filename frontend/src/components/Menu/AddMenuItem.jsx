import { useState } from "react";
import { createMenuItem } from "../../services/api";
import "../../styles/form.css";
import { useNavigate } from "react-router-dom";

function AddMenuItem() {
  const [form, setForm] = useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMenuItem(form);
      alert("Item added successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add Menu Item</h2>

      <input name="itemName" placeholder="Item Name" onChange={handleChange} />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <input name="price" placeholder="Price" onChange={handleChange} />
      <input name="category" placeholder="Category" onChange={handleChange} />

      <button type="submit" onClick={() => navigate("/menu/add")}>Add Item </button>
    </form>
  );
}

export default AddMenuItem;