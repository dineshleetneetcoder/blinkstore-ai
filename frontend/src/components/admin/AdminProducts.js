import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../../api'; // Import our new API client

const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState(product || { name: '', category: '', price: 0, stock: 0, imageUrl: '', description: '', tags: [] });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'tags' ? value.split(',').map(t => t.trim()) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">{product ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded" required />
                    <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded" required />
                    <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" required />
                    <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" className="w-full p-2 border rounded" required />
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded"></textarea>
                    <input name="tags" value={formData.tags.join(', ')} onChange={handleChange} placeholder="Tags (comma-separated)" className="w-full p-2 border rounded" />
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-slate-300 py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { getToken } = useAuth();

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await apiClient.get('/api/v1/products', { headers: { Authorization: `Bearer ${token}` } });
            setProducts(response.data);
        } catch (error) { console.error("Failed to fetch products:", error); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, [getToken]);

    const handleSave = async (productData) => {
        const token = await getToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const url = productData.id ? `/api/v1/admin/products/${productData.id}` : '/api/v1/admin/products';
        const method = productData.id ? 'put' : 'post';

        try {
            await apiClient[method](url, productData, config);
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const token = await getToken();
                await apiClient.delete(`/api/v1/admin/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchProducts();
            } catch (error) {
                console.error("Failed to delete product:", error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Manage Products</h1>
                <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Add New Product</button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <table className="w-full">
                    <thead><tr className="border-b"><th className="text-left p-2">Name</th><th className="text-left p-2">Category</th><th className="text-left p-2">Price</th><th className="text-left p-2">Stock</th><th className="text-left p-2">Actions</th></tr></thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-b hover:bg-slate-50">
                                <td className="p-2">{p.name}</td>
                                <td className="p-2">{p.category}</td>
                                <td className="p-2">₹{p.price.toFixed(2)}</td>
                                <td className="p-2">{p.stock}</td>
                                <td className="p-2">
                                    <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="text-blue-600 mr-2">Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ProductModal product={editingProduct} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};

export default AdminProducts;

