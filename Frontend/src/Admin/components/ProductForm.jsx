import React, { useState } from "react";

function ProductForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", image);
    onSubmit(formData);
  };

  return (
    <div className="card p-4">
      <h4>Add New Product</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Product Image</label>
          <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="mb-3">
          <label>Product Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
}

export default ProductForm;