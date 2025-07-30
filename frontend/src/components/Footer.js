import React from 'react';

const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="font-bold text-lg mb-2">BlinkStore.AI</h4>
                    <p className="text-gray-400 text-sm">Fastest delivery in town.</p>
                </div>
                <div>
                    <h4 className="font-bold mb-2">Quick Links</h4>
                    <ul className="space-y-1 text-gray-300">
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Contact</a></li>
                        <li><a href="#" className="hover:text-white">FAQs</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-2">Legal</h4>
                    <ul className="space-y-1 text-gray-300">
                        <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-2">Follow Us</h4>
                    {/* Social Icons would go here */}
                </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} BlinkStore.AI. All rights reserved.
            </div>
        </div>
    </footer>
);

export default Footer;