'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';

export default function TestCreateUser() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Sales'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔧 Firebase Debug Info:', {
        hasAuth: !!auth,
        hasDb: !!db,
        authApp: auth?.app?.options?.projectId || 'N/A',
        dbApp: db?.app?.options?.projectId || 'N/A'
      });

      // Create user account
      console.log('Creating user account with email:', formData.email);
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCred.user.uid;
      console.log('User account created successfully with UID:', userId);

      // Save user data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        company: 'ProdSync Inc.',
        createdAt: new Date()
      };

      console.log('Saving user data to Firestore:', { userId, userData });
      await setDoc(doc(db, "users", userId), userData);
      console.log('User data saved to Firestore successfully');

      // Verify the user was saved
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        console.log('✅ User data verified in Firestore:', userDoc.data());
        setResult({
          success: true,
          userId,
          userData: userDoc.data(),
          message: 'User created and verified successfully!'
        });
      } else {
        throw new Error('User data could not be verified in Firestore');
      }

    } catch (err) {
      console.error('Error creating user:', err);
      setError({
        code: err.code,
        message: err.message,
        stack: err.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test User Creation</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating User...' : 'Create User'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium">Error:</h3>
            <p className="text-red-700">{error.message}</p>
            {error.code && <p className="text-red-600 text-sm">Code: {error.code}</p>}
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-green-800 font-medium">Success:</h3>
            <p className="text-green-700">{result.message}</p>
            <p className="text-green-600 text-sm">User ID: {result.userId}</p>
            <p className="text-green-600 text-sm">Role: {result.userData.role}</p>
          </div>
        )}
      </div>
    </div>
  );
}
