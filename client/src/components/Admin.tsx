import axios from "axios";
import React, { useState } from "react";

const Admin = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
    image: null as File | null,
    category: "",
  });

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price.toString());
    data.append("stock", formData.stock.toString());
    if (formData.image) {
      data.append("image", formData.image);
    }
    data.append("category", formData.category);

    axios.post("http://localhost:5555/products", data).catch((err) => {
      console.error("Form submission error: ", err);
    });
  };

  return (
    <form
      className="text-black"
      encType="multipart/form-data"
      onSubmit={submitForm}
    >
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => {
          setFormData({
            ...formData,
            name: e.target.value,
          });
        }}
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={(e) => {
          setFormData({
            ...formData,
            price: parseInt(e.target.value),
          });
        }}
      />
      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={(e) => {
          setFormData({
            ...formData,
            stock: parseInt(e.target.value),
          });
        }}
      />
      <input
        type="file"
        name="image"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          setFormData({
            ...formData,
            image: file,
          });
        }}
      />
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={(e) => {
          setFormData({
            ...formData,
            category: e.target.value,
          });
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Admin;
