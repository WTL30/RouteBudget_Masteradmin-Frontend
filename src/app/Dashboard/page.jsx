// "use client";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion"; // for animations
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// import axios from "axios";

// export default function MasterAdminDashboardBlackTheme() {
//   const [drivers, setDrivers] = useState([]);
//   const [loading, setLoading] = useState(true); // Loading state for API call
//   const [error, setError] = useState(null); // Error state
//   const [cabs, setCabs] = useState([]);
//   const [subAdmin, setSubAdmin] = useState([]);

//   // Expense data state
//   const [expenseData, setExpenseData] = useState([]);
//   const [totalExpense, setTotalExpense] = useState(0);
//   const [expenseBreakdown, setExpenseBreakdown] = useState([]);
//   const [expenseLoading, setExpenseLoading] = useState(true);

//   // Recent activity state
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [activityLoading, setActivityLoading] = useState(true);

//   // sub-admin
//   useEffect(() => {
//     const fetchSubAdmin = async () => {
//       try {
//         const response = await axios.get(
//           "https://api.routebudget.com/api/admin/sub-admin-count"
//         );
//         console.log("API Response:", response.data); // Debugging log

//         // Check if response is an object with count property
//         if (response.data && typeof response.data.count === "number") {
//           setSubAdmin(response.data.count); // Store count directly
//         } else {
//           console.error("Unexpected API response format:", response.data);
//           setError("Invalid API response format");
//         }
//       } catch (error) {
//         console.error("Error fetching sub-admin:", error);
//         setError("Failed to fetch sub-admin");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubAdmin();
//   }, []);

//   const totalSubAdmin = subAdmin; // Since we now store the count directly

//   // driver
//   useEffect(() => {
//     const fetchDrivers = async () => {
//       try {
//         const response = await axios.get(
//           "https://api.routebudget.com/api/admin/driver-count"  //https://api.routebudget.com
//         ); // Ensure correct backend URL
//         console.log("API Response:", response.data); // Debugging log
//         console.log("hello");

//         if (response.data && typeof response.data.count === "number") {
//           setDrivers(response.data.count);
//         } else {
//           console.error("Unexpected API response format:", response.data);
//           setError("Invalid API response format");
//         }
//       } catch (error) {
//         console.error("Error fetching drivers:", error);
//         setError("Failed to fetch drivers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDrivers();
//   }, []);

//   const totalDrivers = drivers;

//   // cab
//   useEffect(() => {
//     const fetchCabs = async () => {
//       try {
//         const response = await axios.get(
//           "https://api.routebudget.com/api/admin/cab-count"
//         ); // Ensure correct backend URL
//         console.log("API Response:", response.data); // Debugging log
//         if (response.data && typeof response.data.count === "number") {
//           setCabs(response.data.count);
//         } else {
//           console.error("Unexpected API response format:", response.data);
//           setError("Invalid API response format");
//         }
//       } catch (error) {
//         console.error("Error fetching cabs:", error);
//         setError("Failed to fetch cabs");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCabs();
//   }, []);

//   const totalCabs = cabs;

//   // Fetch expense data from the API
//   useEffect(() => {
//     const fetchExpenseData = async () => {
//       try {
//         setExpenseLoading(true);
//         const response = await axios.get(
//           "https://api.routebudget.com/api/admin/getExpense"
//         );

//         if (response.data.success && Array.isArray(response.data.data)) {
//           const expenses = response.data.data;
//           setExpenseData(expenses);

//           // Calculate total expense across all cabs
//           const total = expenses.reduce(
//             (sum, expense) => sum + expense.totalExpense,
//             0
//           );
//           setTotalExpense(total);

//           // Process data for charts
//           processExpenseBreakdown(expenses);

//           // Fetch recent activities
//           fetchRecentActivities(expenses);
//         } else {
//           throw new Error("Invalid expense data format from API");
//         }
//       } catch (error) {
//         console.error("Error fetching expense data:", error);
//         // Set mock data for testing if API fails
//         setMockExpenseData();
//       } finally {
//         setExpenseLoading(false);
//       }
//     };

//     fetchExpenseData();
//   }, []);

//   // Fetch recent expense activities from the API
//   const fetchRecentActivities = async (expenses) => {
//     try {
//       setActivityLoading(true);

//       // Fetch recent expense activities from the API
//       const response = await axios.get("https://api.routebudget.com/api/expenses");

//       if (response.data && Array.isArray(response.data)) {
//         // Format the activities data
//         const activities = response.data.slice(0, 5).map((expense) => {
//           // Format date to relative time (e.g., "2 hours ago")
//           const expenseDate = new Date(expense.date);
//           const now = new Date();
//           const diffInMs = now - expenseDate;
//           const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
//           const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

//           let timeAgo;
//           if (diffInHours > 24) {
//             timeAgo = `${Math.floor(diffInHours / 24)} days ago`;
//           } else if (diffInHours > 0) {
//             timeAgo = `${diffInHours} hours ago`;
//           } else {
//             timeAgo = `${diffInMinutes} minutes ago`;
//           }

//           return {
//             id: expense._id,
//             text: `Cab ${expense.cabNumber} expense: ${expense.type} - ₹${expense.amount}`,
//             time: timeAgo,
//             driver: expense.driver,
//           };
//         });

//         setRecentActivities(activities);
//       } else {
//         // If API fails or returns unexpected format, generate activities from expense data
//         generateActivitiesFromExpenseData(expenses);
//       }
//     } catch (error) {
//       console.error("Error fetching recent activities:", error);
//       // Generate activities from expense data if API fails
//       generateActivitiesFromExpenseData(expenses);
//     } finally {
//       setActivityLoading(false);
//     }
//   };

//   // Generate activities from expense data if API fails
//   const generateActivitiesFromExpenseData = (expenses) => {
//     if (!expenses || expenses.length === 0) {
//       setRecentActivities([
//         { text: "No recent expense activities", time: "N/A" },
//       ]);
//       return;
//     }

//     // Sort expenses by amount (in a real app, you'd sort by date)
//     const sortedExpenses = [...expenses].sort(
//       (a, b) => b.totalExpense - a.totalExpense
//     );

//     const activities = sortedExpenses.slice(0, 5).map((expense, index) => {
//       // Generate random time ago for demonstration
//       const hours = [0, 1, 3, 6, 12, 24];
//       const randomHour = hours[index % hours.length];
//       const timeAgo =
//         randomHour === 0
//           ? "Just now"
//           : randomHour === 1
//           ? "1 hour ago"
//           : `${randomHour} hours ago`;

//       return {
//         id: index,
//         text: `Cab ${expense.cabNumber} expense updated: ₹${expense.totalExpense}`,
//         time: timeAgo,
//         breakdown: Object.entries(expense.breakdown)
//           .filter(([_, value]) => value > 0)
//           .map(([key, value]) => `${key}: ₹${value}`)
//           .join(", "),
//       };
//     });

//     setRecentActivities(activities);
//   };

//   // Set mock expense data for testing if API fails
//   const setMockExpenseData = () => {
//     const mockExpenses = [
//       {
//         cabNumber: "MH12X222",
//         totalExpense: 3180,
//         breakdown: {
//           fuel: 1700,
//           fastTag: 500,
//           tyrePuncture: 180,
//           otherProblems: 800,
//         },
//       },
//       {
//         cabNumber: "MH120000",
//         totalExpense: 3180,
//         breakdown: {
//           fuel: 1700,
//           fastTag: 500,
//           tyrePuncture: 180,
//           otherProblems: 800,
//         },
//       },
//       {
//         cabNumber: "MH12X129",
//         totalExpense: 1240,
//         breakdown: {
//           fuel: 200,
//           fastTag: 400,
//           tyrePuncture: 140,
//           otherProblems: 500,
//         },
//       },
//     ];
//     setExpenseData(mockExpenses);

//     // Calculate total expense
//     const total = mockExpenses.reduce(
//       (sum, expense) => sum + expense.totalExpense,
//       0
//     );
//     setTotalExpense(total);

//     // Process data for charts
//     processExpenseBreakdown(mockExpenses);

//     // Generate activities from mock data
//     generateActivitiesFromExpenseData(mockExpenses);
//   };

//   // Process expense data for the breakdown chart
//   const processExpenseBreakdown = (expenses) => {
//     // Aggregate all breakdown values across all cabs
//     const totalBreakdown = expenses.reduce(
//       (acc, expense) => {
//         acc.fuel += expense.breakdown.fuel || 0;
//         acc.fastTag += expense.breakdown.fastTag || 0;
//         acc.tyrePuncture += expense.breakdown.tyrePuncture || 0;
//         acc.otherProblems += expense.breakdown.otherProblems || 0;
//         return acc;
//       },
//       { fuel: 0, fastTag: 0, tyrePuncture: 0, otherProblems: 0 }
//     );

//     // Convert to array format for the chart with colors
//     const breakdownData = [
//       { name: "Fuel", value: totalBreakdown.fuel, color: "#6366F1" }, // Indigo
//       { name: "FastTag", value: totalBreakdown.fastTag, color: "#10B981" }, // Green
//       {
//         name: "Tyre Puncture",
//         value: totalBreakdown.tyrePuncture,
//         color: "#F59E0B",
//       }, // Amber
//       {
//         name: "Other Problems",
//         value: totalBreakdown.otherProblems,
//         color: "#EF4444",
//       }, // Red
//     ];

//     setExpenseBreakdown(breakdownData);
//   };

//   // Custom tooltip for the pie chart
//   const CustomPieTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-gray-800 p-2 rounded shadow-lg border border-gray-700">
//           <p className="font-medium">{payload[0].name}</p>
//           <p className="text-sm">₹{payload[0].value}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <motion.div
//       // Fade in the entire page
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.7 }}
//       className="bg-gray-900 text-white min-h-screen h-[102%]"
//     >
//       {/* Top Header */}
//       <header className="flex flex-col md:flex-row justify-between items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
//         <h1 className="text-xl font-semibold">
//           {new Date().toLocaleDateString("en-US", {
//             month: "long",
//             day: "numeric",
//             year: "numeric",
//           })}
//         </h1>
//         <div className="mt-3 md:mt-0 flex items-center gap-4"></div>
//       </header>

//       <main className="px-4 py-4 md:ml-64 max-w-7xl mx-auto">
//         {/* Stats Row */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//           {/* Sub-Admins */}
//           <motion.div
//             className="bg-gray-800 rounded-md p-4 shadow group transition-all duration-300 hover:shadow-indigo-500/30"
//             whileHover={{ scale: 1.03 }}
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//           >
//             <p className="text-sm text-gray-400">Total SubAdmin</p>
//             <div className="flex items-center justify-between mt-2">
//               {loading ? (
//                 <p>Loading...</p>
//               ) : error ? (
//                 <p className="text-red-400">{error}</p>
//               ) : (
//                 <>
//                   <h2 className="text-2xl font-bold">{totalSubAdmin}</h2>
//                   <span className="text-green-400 text-sm">
//                     {Math.floor(totalSubAdmin * 0.7)} Active
//                   </span>
//                 </>
//               )}
//             </div>
//           </motion.div>

//           {/* Drivers */}
//           <motion.div
//             className="bg-gray-800 rounded-md p-4 shadow group transition-all duration-300 hover:shadow-indigo-500/30"
//             whileHover={{ scale: 1.03 }}
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//           >
//             <p className="text-sm text-gray-400">Total Drivers</p>
//             <div className="flex items-center justify-between mt-2">
//               {loading ? (
//                 <p>Loading...</p>
//               ) : error ? (
//                 <p className="text-red-400">{error}</p>
//               ) : (
//                 <>
//                   <h2 className="text-2xl font-bold">{totalDrivers}</h2>
//                   <span className="text-green-400 text-sm">
//                     {Math.floor(totalDrivers * 0.7)} Active
//                   </span>
//                 </>
//               )}
//             </div>
//           </motion.div>

//           {/* Cabs */}
//           <motion.div
//             className="bg-gray-800 rounded-md p-4 shadow group transition-all duration-300 hover:shadow-indigo-500/30"
//             whileHover={{ scale: 1.03 }}
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             <p className="text-sm text-gray-400">Total Cabs</p>
//             <div className="flex items-center justify-between mt-2">
//               {loading ? (
//                 <p>Loading...</p>
//               ) : error ? (
//                 <p className="text-red-400">{error}</p>
//               ) : (
//                 <>
//                   <h2 className="text-2xl font-bold">{totalCabs}</h2>
//                   <span className="text-green-400 text-sm">
//                     {Math.floor(totalCabs * 0.7)} Active
//                   </span>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Middle Row: Revenue Overview + Recent Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           {/* Revenue Overview (Pie Chart) */}
//           <motion.div
//             className="bg-gray-800 rounded-md p-4 shadow group transition-all duration-300 hover:shadow-indigo-500/30"
//             whileHover={{ scale: 1.02 }}
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-lg font-semibold mb-2 group-hover:font-bold transition-all">
//               Expense Overview
//             </h2>
//             <div className="h-64">
//               {expenseLoading ? (
//                 <div className="flex justify-center items-center h-full">
//                   <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//               ) : (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={expenseBreakdown}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={50}
//                       outerRadius={80}
//                       labelLine={false}
//                       dataKey="value"
//                       label={({ name, value }) => `${name}: ₹${value}`}
//                     >
//                       {expenseBreakdown.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomPieTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               )}
//             </div>
//             <p className="text-center mt-2 text-sm text-gray-400 group-hover:font-semibold transition-all">
//               Total Expense: ₹{totalExpense}
//             </p>

//             {/* Legend for expense categories */}
//             <div className="flex flex-wrap justify-around mt-4 text-sm">
//               {expenseBreakdown.map((item, index) => (
//                 <div key={index} className="flex items-center gap-1 mb-1">
//                   <span
//                     className="w-3 h-3 rounded-sm"
//                     style={{ backgroundColor: item.color }}
//                   />
//                   {item.name}
//                 </div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Recent Activity - Now Dynamic */}
//           <motion.div
//             className="bg-gray-800 rounded-md p-4 shadow group transition-all duration-300 hover:shadow-indigo-500/30"
//             whileHover={{ scale: 1.02 }}
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//           >
//             <h2 className="text-lg font-semibold mb-2 group-hover:font-bold transition-all">
//               Recent Expense Activity
//             </h2>
//             {activityLoading || expenseLoading ? (
//               <div className="flex justify-center items-center h-32">
//                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : (
//               <ul className="space-y-4 text-sm">
//                 {recentActivities.length > 0 ? (
//                   recentActivities.map((activity, index) => (
//                     <li
//                       key={index}
//                       className="flex items-center justify-between group-hover:font-semibold transition-all"
//                     >
//                       <div>
//                         <span>{activity.text}</span>
//                         {activity.breakdown && (
//                           <p className="text-xs text-gray-400 mt-1">
//                             {activity.breakdown}
//                           </p>
//                         )}
//                         {activity.driver && (
//                           <p className="text-xs text-gray-400 mt-1">
//                             Driver: {activity.driver}
//                           </p>
//                         )}
//                       </div>
//                       <span className="text-gray-400 whitespace-nowrap ml-2">
//                         {activity.time}
//                       </span>
//                     </li>
//                   ))
//                 ) : (
//                   <li className="text-center text-gray-400">
//                     No recent activities found
//                   </li>
//                 )}

//                 {/* Additional expense stats */}
//                 <li className="pt-4 border-t border-gray-700">
//                   <div className="flex justify-between items-center">
//                     <span>Average Expense per Cab:</span>
//                     <span className="font-medium">
//                       ₹
//                       {expenseData.length > 0
//                         ? Math.round(totalExpense / expenseData.length)
//                         : 0}
//                     </span>
//                   </div>
//                 </li>
//                 <li>
//                   <div className="flex justify-between items-center">
//                     <span>Highest Expense Category:</span>
//                     <span className="font-medium">
//                       {expenseBreakdown.length > 0
//                         ? expenseBreakdown.reduce((max, item) =>
//                             max.value > item.value ? max : item
//                           ).name
//                         : "N/A"}
//                     </span>
//                   </div>
//                 </li>
//               </ul>
//             )}
//           </motion.div>
//         </div>
//       </main>
//     </motion.div>
//   );
// }




"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // for animations
import axios from "axios";

const MasterAdminDashboardBlackTheme =  () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [error, setError] = useState(null); // Error state
  const [cabs, setCabs] = useState([]);
  const [subAdmin, setSubAdmin] = useState([]);

  // Expense data state
  const [expenseData, setExpenseData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [expenseLoading, setExpenseLoading] = useState(true);

  // Recent activity state
  const [recentActivities, setRecentActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // sub-admin
  useEffect(() => {
    const fetchSubAdmin = async () => {
      try {
        const response = await axios.get(
          "https://api.routebudget.com/api/admin/sub-admin-count"
        );
        console.log("API Response:", response.data); // Debugging log

        // Check if response is an object with count property
        if (response.data && typeof response.data.count === "number") {
          setSubAdmin(response.data.count); // Store count directly
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching sub-admin:", error);
        setError("Failed to fetch sub-admin");
      } finally {
        setLoading(false);
      }
    };

    fetchSubAdmin();
  }, []);

  const totalSubAdmin = subAdmin; // Since we now store the count directly

  // driver
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(
          "https://api.routebudget.com/api/admin/driver-count"
        ); // Ensure correct backend URL
        console.log("API Response:", response.data); // Debugging log
        console.log("hello");

        if (response.data && typeof response.data.count === "number") {
          setDrivers(response.data.count);
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setError("Failed to fetch drivers");
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const totalDrivers = drivers;

  // cab
  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const response = await axios.get(
          "https://api.routebudget.com/api/admin/cab-count"
        ); // Ensure correct backend URL
        console.log("API Response:", response.data); // Debugging log
        if (response.data && typeof response.data.count === "number") {
          setCabs(response.data.count);
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching cabs:", error);
        setError("Failed to fetch cabs");
      } finally {
        setLoading(false);
      }
    };
    fetchCabs();
  }, []);

  const totalCabs = cabs;

  // Fetch expense data from the API
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        setExpenseLoading(true);
        const response = await axios.get(
          "https://api.routebudget.com/api/admin/getExpense"
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          const expenses = response.data.data;
          setExpenseData(expenses);

          // Calculate total expense across all cabs
          const total = expenses.reduce(
            (sum, expense) => sum + expense.totalExpense,
            0
          );
          setTotalExpense(total);

          // Process data for charts
          processExpenseBreakdown(expenses);

          // Fetch recent activities
          fetchRecentActivities(expenses);
        } else {
          throw new Error("Invalid expense data format from API");
        }
      } catch (error) {
        console.error("Error fetching expense data:", error);
        // Set mock data for testing if API fails
        setMockExpenseData();
      } finally {
        setExpenseLoading(false);
      }
    };

    fetchExpenseData();
  }, []);

  // Fetch recent expense activities from the API
  const fetchRecentActivities = async (expenses) => {
    try {
      setActivityLoading(true);

      // Fetch recent expense activities from the API
      const response = await axios.get("https://api.routebudget.com/api/expenses");

      if (response.data && Array.isArray(response.data)) {
        // Format the activities data
        const activities = response.data.slice(0, 5).map((expense) => {
          // Format date to relative time (e.g., "2 hours ago")
          const expenseDate = new Date(expense.date);
          const now = new Date();
          const diffInMs = now - expenseDate;
          const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
          const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

          let timeAgo;
          if (diffInHours > 24) {
            timeAgo = `${Math.floor(diffInHours / 24)} days ago`;
          } else if (diffInHours > 0) {
            timeAgo = `${diffInHours} hours ago`;
          } else {
            timeAgo = `${diffInMinutes} minutes ago`;
          }

          return {
            id: expense._id,
            text: `Cab ${expense.cabNumber} expense: ${expense.type} - ₹${expense.amount}`,
            time: timeAgo,
            driver: expense.driver,
          };
        });

        setRecentActivities(activities);
      } else {
        // If API fails or returns unexpected format, generate activities from expense data
        generateActivitiesFromExpenseData(expenses);
      }
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      // Generate activities from expense data if API fails
      generateActivitiesFromExpenseData(expenses);
    } finally {
      setActivityLoading(false);
    }
  };

  // Generate activities from expense data if API fails
  const generateActivitiesFromExpenseData = (expenses) => {
    if (!expenses || expenses.length === 0) {
      setRecentActivities([
        { text: "No recent expense activities", time: "N/A" },
      ]);
      return;
    }

    // Sort expenses by amount (in a real app, you'd sort by date)
    const sortedExpenses = [...expenses].sort(
      (a, b) => b.totalExpense - a.totalExpense
    );

    const activities = sortedExpenses.slice(0, 5).map((expense, index) => {
      // Generate random time ago for demonstration
      const hours = [0, 1, 3, 6, 12, 24];
      const randomHour = hours[index % hours.length];
      const timeAgo =
        randomHour === 0
          ? "Just now"
          : randomHour === 1
          ? "1 hour ago"
          : `${randomHour} hours ago`;

      return {
        id: index,
        text: `Cab ${expense.cabNumber} expense updated: ₹${expense.totalExpense}`,
        time: timeAgo,
        breakdown: Object.entries(expense.breakdown)
          .filter(([_, value]) => value > 0)
          .map(([key, value]) => `${key}: ₹${value}`)
          .join(", "),
      };
    });

    setRecentActivities(activities);
  };

  // Set mock expense data for testing if API fails
  const setMockExpenseData = () => {
    const mockExpenses = [
      {
        cabNumber: "MH12X222",
        totalExpense: 3180,
        breakdown: {
          fuel: 1700,
          fastTag: 500,
          tyrePuncture: 180,
          otherProblems: 800,
        },
      },
      {
        cabNumber: "MH120000",
        totalExpense: 3180,
        breakdown: {
          fuel: 1700,
          fastTag: 500,
          tyrePuncture: 180,
          otherProblems: 800,
        },
      },
      {
        cabNumber: "MH12X129",
        totalExpense: 1240,
        breakdown: {
          fuel: 200,
          fastTag: 400,
          tyrePuncture: 140,
          otherProblems: 500,
        },
      },
    ];
    setExpenseData(mockExpenses);

    // Calculate total expense
    const total = mockExpenses.reduce(
      (sum, expense) => sum + expense.totalExpense,
      0
    );
    setTotalExpense(total);

    // Process data for charts
    processExpenseBreakdown(mockExpenses);

    // Generate activities from mock data
    generateActivitiesFromExpenseData(mockExpenses);
  };

  // Process expense data for the breakdown chart
  const processExpenseBreakdown = (expenses) => {
    // Aggregate all breakdown values across all cabs
    const totalBreakdown = expenses.reduce(
      (acc, expense) => {
        acc.fuel += expense.breakdown.fuel || 0;
        acc.fastTag += expense.breakdown.fastTag || 0;
        acc.tyrePuncture += expense.breakdown.tyrePuncture || 0;
        acc.otherProblems += expense.breakdown.otherProblems || 0;
        return acc;
      },
      { fuel: 0, fastTag: 0, tyrePuncture: 0, otherProblems: 0 }
    );

    // Convert to array format for the chart with colors
    const breakdownData = [
      { name: "Fuel", value: totalBreakdown.fuel, color: "#6366F1" }, // Indigo
      { name: "FastTag", value: totalBreakdown.fastTag, color: "#10B981" }, // Green
      {
        name: "Tyre Puncture",
        value: totalBreakdown.tyrePuncture,
        color: "#F59E0B",
      }, // Amber
      {
        name: "Other Problems",
        value: totalBreakdown.otherProblems,
        color: "#EF4444",
      }, // Red
    ];

    setExpenseBreakdown(breakdownData);
  };

  return (
    <motion.div
      // Fade in the entire page
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="bg-gray-900 text-white min-h-screen h-[102%]"
    >
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-semibold">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h1>
        <div className="mt-3 md:mt-0 flex items-center gap-4"></div>
      </header>

      <main className="px-4 py-4 md:ml-64 max-w-7xl mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Sub-Admins */}
          <motion.div
            className="bg-gray-800 rounded-md p-4 shadow group transition-all duration-300 hover:shadow-indigo-500/30"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-gray-400">Total SubAdmin</p>
            <div className="flex items-center justify-between mt-2">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-400">{error}</p>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{totalSubAdmin}</h2>
                  <span className="text-green-400 text-sm">
                    {Math.floor(totalSubAdmin * 0.7)} Active
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {/* Drivers */}
          <motion.div
            className="bg-gray-800 rounded-md p-4 shadow group transition-all duration-300 hover:shadow-indigo-500/30"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-sm text-gray-400">Total Drivers</p>
            <div className="flex items-center justify-between mt-2">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-400">{error}</p>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{totalDrivers}</h2>
                  <span className="text-green-400 text-sm">
                    {Math.floor(totalDrivers * 0.7)} Active
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {/* Cabs */}
          <motion.div
            className="bg-gray-800 rounded-md p-4 shadow group transition-all duration-300 hover:shadow-indigo-500/30"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-sm text-gray-400">Total Cabs</p>
            <div className="flex items-center justify-between mt-2">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-400">{error}</p>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{totalCabs}</h2>
                  <span className="text-green-400 text-sm">
                    {Math.floor(totalCabs * 0.7)} Active
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Middle Row: Revenue Overview + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Revenue Overview (Table Format) */}
          <motion.div
            className="bg-gray-800 rounded-md p-4 shadow group transition-all duration-300 hover:shadow-indigo-500/30"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-lg font-semibold mb-4 group-hover:font-bold transition-all">
              Expense Overview
            </h2>
            {expenseLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="h-64">
                {/* Table */}
                <div className="overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-gray-700 rounded-t-md border-b border-gray-600">
                    <div className="text-sm font-medium text-gray-300">Category</div>
                    <div className="text-sm font-medium text-gray-300 text-right">Amount</div>
                  </div>
                  
                  {/* Table Rows */}
                  <div className="max-h-48 overflow-y-auto">
                    {expenseBreakdown.map((item, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 px-4 py-3 border-b border-gray-600 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-white">{item.name}</span>
                        </div>
                        <div className="text-sm text-white text-right font-medium">
                          ₹{item.value.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <p className="text-center mt-4 text-sm text-gray-400 group-hover:font-semibold transition-all border-t border-gray-600 pt-4">
              Total Expense: ₹{totalExpense.toLocaleString()}
            </p>
          </motion.div>

          {/* Recent Activity - Now Dynamic */}
          <motion.div
            className="bg-gray-800 rounded-md p-4 shadow group transition-all duration-300 hover:shadow-indigo-500/30"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold mb-2 group-hover:font-bold transition-all">
              Recent Expense Activity
            </h2>
            {activityLoading || expenseLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ul className="space-y-4 text-sm">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between group-hover:font-semibold transition-all"
                    >
                      <div>
                        <span>{activity.text}</span>
                        {activity.breakdown && (
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.breakdown}
                          </p>
                        )}
                        {activity.driver && (
                          <p className="text-xs text-gray-400 mt-1">
                            Driver: {activity.driver}
                          </p>
                        )}
                      </div>
                      <span className="text-gray-400 whitespace-nowrap ml-2">
                        {activity.time}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-400">
                    No recent activities found
                  </li>
                )}

                {/* Additional expense stats */}
                <li className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span>Average Expense per Cab:</span>
                    <span className="font-medium">
                      ₹
                      {expenseData.length > 0
                        ? Math.round(totalExpense / expenseData.length)
                        : 0}
                    </span>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between items-center">
                    <span>Highest Expense Category:</span>
                    <span className="font-medium">
                      {expenseBreakdown.length > 0
                        ? expenseBreakdown.reduce((max, item) =>
                            max.value > item.value ? max : item
                          ).name
                        : "N/A"}
                    </span>
                  </div>
                </li>
              </ul>
            )}
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}

export default MasterAdminDashboardBlackTheme;
