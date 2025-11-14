"use client";
// pages/subscriptions.js or app/subscriptions/page.js (depending on your Next.js version)
import React, { useState, useEffect } from 'react';

const SubscriptionsPage = () => {
  const [trialSubscriptions, setTrialSubscriptions] = useState([]);
  const [paidSubscriptions, setPaidSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trial subscriptions
  const fetchTrialSubscriptions = async () => {
    try {
      const response = await fetch('https://api.routebudget.com/api/admin/get-free-trial-subAdmins');
      const data = await response.json();
      
      if (data.success) {
        // Transform the data to match the UI format
        const transformedData = data.subAdmins.map(subAdmin => ({
          id: subAdmin.id,
          name: subAdmin.name || subAdmin.firstName + ' ' + (subAdmin.lastName || ''),
          email: subAdmin.email,
          trialEndDate: formatDate(subAdmin.subscription?.endDate),
          daysLeft: `${subAdmin.subscription?.daysLeft || 0} days left`,
          progress: calculateProgress(subAdmin.subscription?.startDate, subAdmin.subscription?.endDate),
          status: subAdmin.subscription?.status,
          rawSubscription: subAdmin.subscription
        }));
        setTrialSubscriptions(transformedData);
      } else {
        setError('Failed to fetch trial subscriptions');
      }
    } catch (err) {
      setError('Error fetching trial subscriptions: ' + err.message);
    }
  };

  // Fetch paid subscriptions
  const fetchPaidSubscriptions = async () => {
    try {
      const response = await fetch('https://api.routebudget.com/api/admin/get-paid-subAdmins');
      const data = await response.json();
      
      if (data.success) {
        // Transform the data to match the UI format
        const transformedData = data.subAdmins.map(subAdmin => ({
          id: subAdmin.id,
          name: subAdmin.name || subAdmin.firstName + ' ' + (subAdmin.lastName || ''),
          email: subAdmin.email,
          plan: getPlanName(subAdmin.subscription?.type, subAdmin.subscription?.price),
          endDate: formatDate(subAdmin.subscription?.endDate),
          daysLeft: `${subAdmin.subscription?.daysLeft || 0} days left`,
          status: subAdmin.subscription?.status,
          price: subAdmin.subscription?.price,
          rawSubscription: subAdmin.subscription
        }));
        setPaidSubscriptions(transformedData);
      } else {
        setError('Failed to fetch paid subscriptions');
      }
    } catch (err) {
      setError('Error fetching paid subscriptions: ' + err.message);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to calculate progress for trial subscriptions
  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    const totalDuration = end - start;
    const elapsed = now - start;
    
    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;
    
    return Math.round((elapsed / totalDuration) * 100);
  };

  // Helper function to get plan name
  const getPlanName = (type, price) => {
    if (type === 'paid') {
      if (price && price > 0) {
        return `$${price} Plan`;
      }
      return '1 Year Plan';
    }
    return 'Unknown Plan';
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTrialSubscriptions(),
        fetchPaidSubscriptions()
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Refresh data function
  const refreshData = () => {
    fetchTrialSubscriptions();
    fetchPaidSubscriptions();
  };

  if (loading) {
    return (
      <div className="flex">
        <div className="w-64 bg-[#1e2139] min-h-screen">
          {/* Sidebar content remains the same */}
          <div className="p-6">
            <h2 className="text-white text-lg font-semibold mb-8">Master Admin</h2>
            <nav className="space-y-2">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span className="text-sm">Dashboard</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Sub-Admins</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span className="text-sm">Live Fleet</span>
              </div>
              <div className="flex items-center space-x-3 text-white bg-[#2a2d3e] p-2 rounded">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z" />
                </svg>
                <span className="text-sm">Subscriptions</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" />
                </svg>
                <span className="text-sm">Expense Management</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm">Analytics</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-sm">Notifications</span>
              </div>
            </nav>
          </div>
        </div>

        <div className="flex-1 bg-[#2a2d3e] min-h-screen flex items-center justify-center">
          <div className="text-white text-lg">Loading subscriptions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e2139] min-h-screen">
        <div className="p-6">
          <h2 className="text-white text-lg font-semibold mb-8">Master Admin</h2>
          <nav className="space-y-2">
            <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-sm">Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Sub-Admins</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="text-sm">Live Fleet</span>
            </div>
            <div className="flex items-center space-x-3 text-white bg-[#2a2d3e] p-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z" />
              </svg>
              <span className="text-sm">Subscriptions</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" />
              </svg>
              <span className="text-sm">Expense Management</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm">Analytics</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-sm">Notifications</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#2a2d3e] min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium mb-2 text-white">Subscriptions</h1>
              <p className="text-sm text-gray-400">Overview of trial and paid subscriptions for sub-admins.</p>
            </div>
            <button 
              onClick={refreshData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              Refresh Data
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-600 text-white p-4 rounded">
              {error}
            </div>
          )}

          {/* Trial Subscriptions Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-medium mb-2 text-white">Trial Subscriptions</h2>
                <p className="text-sm text-gray-400">Sub-admins currently on a trial plan.</p>
              </div>
              <div className="text-sm text-gray-400">
                Total: {trialSubscriptions.length}
              </div>
            </div>

            {/* Trial Table */}
            <div className="mb-8">
              {trialSubscriptions.length > 0 ? (
                <>
                  {/* Table Header */}
                  <div className="grid grid-cols-[300px_200px_150px_200px] gap-8 px-6 py-4 text-sm text-gray-400 font-medium border-b border-gray-600">
                    <div>Name</div>
                    <div>Trial End Date</div>
                    <div>Days Left</div>
                    <div>Progress</div>
                  </div>

                  {/* Table Rows */}
                  {trialSubscriptions.map((subscription, index) => (
                    <div key={subscription.id || index} className="grid grid-cols-[300px_200px_150px_200px] gap-8 px-6 py-6 border-b border-gray-600 last:border-b-0 items-center">
                      <div className="flex flex-col">
                        <div className="font-medium text-white mb-1">{subscription.name}</div>
                        <div className="text-sm text-gray-400">{subscription.email}</div>
                        {subscription.status === 'expired' && (
                          <div className="text-xs text-red-400 mt-1">Expired</div>
                        )}
                      </div>
                      <div className="text-sm text-white">{subscription.trialEndDate}</div>
                      <div className={`text-sm ${subscription.status === 'expired' ? 'text-red-400' : 'text-white'}`}>
                        {subscription.daysLeft}
                      </div>
                      <div className="flex items-center">
                        <div className="w-48 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              subscription.status === 'expired' ? 'bg-red-500' : 
                              subscription.progress > 75 ? 'bg-red-500' :
                              subscription.progress > 50 ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${subscription.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">{subscription.progress}%</span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No trial subscriptions found.
                </div>
              )}
            </div>
          </div>

          {/* Paid Subscriptions Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-medium mb-2 text-white">Paid Subscriptions</h2>
                <p className="text-sm text-gray-400">Sub-admins with an active paid plan.</p>
              </div>
              <div className="text-sm text-gray-400">
                Total: {paidSubscriptions.length}
              </div>
            </div>

            {/* Paid Table */}
            <div>
              {paidSubscriptions.length > 0 ? (
                <>
                  {/* Table Header */}
                  <div className="grid grid-cols-[300px_150px_200px_150px] gap-8 px-6 py-4 text-sm text-gray-400 font-medium border-b border-gray-600">
                    <div>Name</div>
                    <div>Plan</div>
                    <div>End Date</div>
                    <div>Days Left</div>
                  </div>

                  {/* Table Rows */}
                  {paidSubscriptions.map((subscription, index) => (
                    <div key={subscription.id || index} className="grid grid-cols-[300px_150px_200px_150px] gap-8 px-6 py-6 border-b border-gray-600 last:border-b-0 items-center">
                      <div className="flex flex-col">
                        <div className="font-medium text-white mb-1">{subscription.name}</div>
                        <div className="text-sm text-gray-400">{subscription.email}</div>
                        {subscription.status === 'expired' && (
                          <div className="text-xs text-red-400 mt-1">Expired</div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className={`text-white text-xs font-medium px-3 py-1 rounded-sm ${
                          subscription.status === 'expired' ? 'bg-red-600' : 'bg-green-600'
                        }`}>
                          {subscription.plan}
                        </span>
                      </div>
                      <div className="text-sm text-white">{subscription.endDate}</div>
                      <div className={`text-sm ${subscription.status === 'expired' ? 'text-red-400' : 'text-white'}`}>
                        {subscription.daysLeft}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No paid subscriptions found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;