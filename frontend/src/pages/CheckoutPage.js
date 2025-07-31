import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';

// --- Helper & Sub-Components ---
const CheckoutStep = ({ title, stepNumber, isActive, isComplete, onHeaderClick, children }) => {
    const headerClasses = isComplete ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-slate-400';
    const borderClasses = isComplete ? 'border-green-600 bg-green-50' : isActive ? 'border-blue-600 bg-blue-50' : 'border-slate-200';

    return (
        <div className={`bg-white border-2 rounded-xl shadow-sm transition-all ${borderClasses}`}>
            <div className="p-6 cursor-pointer" onClick={onHeaderClick}>
                <div className="flex justify-between items-center">
                    <h2 className={`text-lg font-bold ${headerClasses}`}>{stepNumber}. {title}</h2>
                    {isComplete && (
                        <span className="text-sm font-medium text-green-700">✓ Completed</span>
                    )}
                </div>
            </div>
            {isActive && (
                <div className="p-6 border-t-2 border-dashed">
                    {children}
                </div>
            )}
        </div>
    );
};

const SummaryItem = ({ item }) => (
    <div className="flex items-center gap-4">
        <img src={item.imageUrl || `https://placehold.co/48x48/E0E7FF/4F46E5?text=${item.name.charAt(0)}`} alt={item.name} className="w-12 h-12 rounded-lg bg-slate-100 object-cover"></img>
        <div className="flex-grow">
            <p className="font-semibold text-sm text-slate-700">{item.name}</p>
            <p className="text-xs text-slate-500">{item.quantity} x ₹{item.price.toFixed(2)}</p>
        </div>
        <p className="font-semibold text-sm text-slate-800">₹{(item.quantity * item.price).toFixed(2)}</p>
    </div>
);

// --- Main Checkout Component ---
const CheckoutPage = ({ onNavigate }) => {
    const { cart, clearCart } = useCart();
    const { getToken } = useAuth();
    const { user } = useUser();

    const [activeStep, setActiveStep] = useState(1);
    const [addressInfo, setAddressInfo] = useState({
        name: user ? `${user.firstName} ${user.lastName}` : '',
        phone: '',
        address1: '',
        address2: '',
        pincode: '',
        city: 'Mumbai',
    });
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setAddressInfo(prev => ({ ...prev, [id]: value }));
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        // Simple validation
        if (addressInfo.name && addressInfo.phone && addressInfo.address1 && addressInfo.pincode) {
            setActiveStep(2);
        } else {
            alert("Please fill in all address fields.");
        }
    };

    const handlePlaceOrder = async () => {
        if (activeStep !== 2) return;
        setIsLoading(true);
        setError('');

        const fullAddress = `${addressInfo.address1}, ${addressInfo.address2}, ${addressInfo.city}, ${addressInfo.pincode}`;
        
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const token = await getToken();
            await axios.post(
                'http://localhost:8080/api/v1/orders',
                { deliveryAddress: fullAddress, paymentMethod: paymentMethod },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            clearCart();
            onNavigate('orders');
        } catch (err) {
            setError('Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const { subtotal, deliveryFee, total } = useMemo(() => {
        const sub = cart ? cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
        const fee = sub > 500 || sub === 0 ? 0 : 40;
        return { subtotal: sub, deliveryFee: fee, total: sub + fee };
    }, [cart]);

    return (
        <div className="bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
                    <button onClick={() => onNavigate('home')} className="text-sm font-medium text-blue-600 hover:underline">&larr; Continue Shopping</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <CheckoutStep 
                            title="Delivery Information" 
                            stepNumber={1} 
                            isActive={activeStep === 1} 
                            isComplete={activeStep > 1}
                            onHeaderClick={() => setActiveStep(1)}
                        >
                            <form onSubmit={handleSaveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                                    <input type="text" id="name" value={addressInfo.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300" required />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Mobile Number</label>
                                    <input type="tel" id="phone" value={addressInfo.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="address1" className="block text-sm font-medium text-slate-700">Flat, House no., Building</label>
                                    <input type="text" id="address1" value={addressInfo.address1} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="address2" className="block text-sm font-medium text-slate-700">Area, Street, Sector</label>
                                    <input type="text" id="address2" value={addressInfo.address2} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300" required />
                                </div>
                                <div>
                                    <label htmlFor="pincode" className="block text-sm font-medium text-slate-700">Pincode</label>
                                    <input type="text" id="pincode" value={addressInfo.pincode} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300" required />
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
                                    <input type="text" id="city" value={addressInfo.city} className="mt-1 block w-full rounded-md border-slate-300 bg-slate-100" readOnly />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="mt-4 w-full md:w-auto bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                                        Save and Continue
                                    </button>
                                </div>
                            </form>
                        </CheckoutStep>

                        <CheckoutStep 
                            title="Payment Method" 
                            stepNumber={2} 
                            isActive={activeStep === 2} 
                            isComplete={false}
                            onHeaderClick={() => { if (activeStep > 1) setActiveStep(2) }}
                        >
                            <div className="space-y-4">
                                {['UPI', 'Credit/Debit Card', 'Cash on Delivery'].map(method => (
                                    <label key={method} className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500">
                                        <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="h-4 w-4 text-blue-600" />
                                        <span className="ml-4 font-semibold text-slate-700">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </CheckoutStep>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Order Summary</h2>
                            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                {cart?.items.map(item => <SummaryItem key={item.productId} item={item} />)}
                            </div>
                            
                            <div className="mt-6 pt-4 border-t">
                                <div className="flex justify-between items-center text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-slate-600 mt-2">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-medium">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold text-slate-800 mt-4">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

                            <button 
                                onClick={handlePlaceOrder}
                                className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                disabled={activeStep !== 2 || isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
