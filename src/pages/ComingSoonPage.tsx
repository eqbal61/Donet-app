import React from 'react';
import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md mb-8">
        This feature is currently under development. We are working hard to bring this to you soon.
      </p>
      <Link 
        to="/" 
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
