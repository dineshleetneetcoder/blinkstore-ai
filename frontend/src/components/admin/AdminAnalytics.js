import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../../api'; // Import our new API client

const AdminAnalytics = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { getToken } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsLoading(true);
        setResponse('');
        try {
            const token = await getToken();
            const res = await apiClient.post('/api/v1/admin/ai/analytics', { query }, { headers: { Authorization: `Bearer ${token}` } });
            setResponse(res.data);
        } catch (error) {
            console.error("Failed to get analytics:", error);
            setResponse("Sorry, an error occurred while fetching analytics.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">AI Business Analyst</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="mb-4 text-slate-600">Ask a question about your sales or inventory. Try: "What are my top 3 best-selling products?" or "Which products are low in stock (less than 80 units)?"</p>
                <form onSubmit={handleSubmit}>
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask Jarvis..." className="w-full p-3 border rounded-lg" />
                    <button type="submit" disabled={isLoading} className="mt-4 w-full bg-blue-600 text-white font-bold py-3 rounded-lg disabled:bg-blue-300">
                        {isLoading ? 'Analyzing...' : 'Get Insights'}
                    </button>
                </form>
                {response && (
                    <div className="mt-6 p-4 bg-slate-50 border rounded-lg">
                        <h3 className="font-bold mb-2">Jarvis says:</h3>
                        <p className="text-slate-700 whitespace-pre-wrap">{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAnalytics;