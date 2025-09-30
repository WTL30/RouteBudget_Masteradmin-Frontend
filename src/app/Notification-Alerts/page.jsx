// 'use client'

// import { useEffect, useState } from 'react'
// import { motion } from 'framer-motion'
// import { AlertCircle, ShieldAlert, Calendar, Settings } from 'lucide-react'

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState([])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const newNotification = {
//         id: Date.now(),
//         type: 'URGENT: Cab Breakdown Detected',
//         message:
//           'Cab ID: CAB-2028-098 | Driver: John Smith\nLocation: 40.7128° N, 74.0060° W\nEst. Repair Time: 45 minutes',
//         bgColor: 'bg-red-900',
//         borderColor: 'border-red-600',
//         icon: <AlertCircle size={24} className="text-red-400 animate-pulse" />
//       }

//       setNotifications((prev) => [newNotification, ...prev])
//       playNotificationSound()
//     }, 15000)

//     return () => clearInterval(interval)
//   }, [])

//   const playNotificationSound = () => {
//     const audio = new Audio('../img/notify-6-313751.mp3')
//     audio.play()
//   }

//   return (
//     <div className="bg-gray-900 md:ml-60 min-h-screen text-white p-4 md:p-6 flex flex-col gap-4 md:gap-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
//         className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
//       >
//         <h1 className="text-2xl md:text-3xl font-extrabold">Notifications & Alerts</h1>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="bg-gray-800 px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-gray-700 text-sm md:text-base"
//         >
//           <Settings size={18} /> Settings
//         </motion.button>
//       </motion.div>

//       {/* Notifications List */}
//       <div className="space-y-4 md:space-y-6 overflow-y-auto flex-1">
//         {/* Dynamic Notifications */}
//         {notifications.map((notification) => (
//           <motion.div
//             key={notification.id}
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
//             whileHover={{
//               scale: [1, 0.98, 1.02, 1],
//               transition: { duration: 0.5, ease: 'easeInOut' }
//             }}
//             className={`${notification.bgColor} p-4 md:p-5 rounded-lg border ${notification.borderColor} shadow-lg transition`}
//           >
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
//               <div className="flex-1">
//                 <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
//                   {notification.icon} {notification.type}
//                 </h2>
//                 <p className="text-xs md:text-sm text-gray-300 whitespace-pre-line">
//                   {notification.message}
//                 </p>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-red-700 px-3 py-2 text-sm md:text-base rounded-lg shadow-lg hover:bg-red-600 w-full md:w-auto"
//               >
//                 Notify Tow Service
//               </motion.button>
//             </div>
//           </motion.div>
//         ))}

//         {/* Static Notifications */}
//         <motion.div
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           whileHover={{
//             scale: [1, 0.98, 1.02, 1],
//             transition: { duration: 0.5, ease: 'easeInOut' }
//           }}
//           className="bg-red-900 p-4 rounded-lg border border-red-500 shadow-lg"
//         >
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//             <div className="flex-1">
//               <h2 className="text-lg font-bold flex items-center gap-2">
//                 <AlertCircle size={20} className="text-red-400" /> URGENT: Cab Breakdown Detected
//               </h2>
//               <p className="text-xs md:text-sm text-gray-300">Cab ID: CAB-2028-098 | Driver: John Smith</p>
//               <p className="text-xs md:text-sm text-gray-400">Est. Repair Time: 45 minutes</p>
//             </div>
//             <button className="bg-red-700 px-3 py-2 text-sm md:text-base rounded-lg w-full md:w-auto">Notify Tow Service</button>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//           whileHover={{
//             scale: [1, 0.98, 1.02, 1],
//             transition: { duration: 0.5, ease: 'easeInOut' }
//           }}
//           className="bg-purple-900 p-4 rounded-lg border border-purple-500 shadow-lg"
//         >
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//             <div className="flex-1">
//               <h2 className="text-lg font-bold flex items-center gap-2">
//                 <ShieldAlert size={20} className="text-purple-400" /> SECURITY ALERT: Unauthorized Access Attempt
//               </h2>
//               <p className="text-xs md:text-sm text-gray-300">Multiple failed login attempts detected</p>
//             </div>
//             <button className="bg-purple-700 px-3 py-2 text-sm md:text-base rounded-lg w-full md:w-auto mt-2 md:mt-0">Review Logs</button>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.7 }}
//           whileHover={{
//             scale: [1, 0.98, 1.02, 1],
//             transition: { duration: 0.5, ease: 'easeInOut' }
//           }}
//           className="bg-blue-900 p-4 rounded-lg border border-blue-500 shadow-lg"
//         >
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//             <div className="flex-1">
//               <h2 className="text-lg font-bold flex items-center gap-2">
//                 <Calendar size={20} className="text-blue-400" /> Scheduled Maintenance Notice
//               </h2>
//               <p className="text-xs md:text-sm text-gray-300">Maintenance on March 15, 2025 | Downtime: 30 mins</p>
//             </div>
//             <button className="bg-blue-700 px-3 py-2 text-sm md:text-base rounded-lg w-full md:w-auto mt-2 md:mt-0">View Details</button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }




"use client";

import { useState, useEffect } from "react";
import { Send, ChevronDown, Settings } from "lucide-react";
import axios from "axios";

export default function NotificationsPage() {
  const [trialAdmins, setTrialAdmins] = useState([]);
  const [paidAdmins, setPaidAdmins] = useState([]);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [selectedPaid, setSelectedPaid] = useState(null);
  const [message, setMessage] = useState("");
  const [isTrialDropdownOpen, setIsTrialDropdownOpen] = useState(false);
  const [isPaidDropdownOpen, setIsPaidDropdownOpen] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);

  // ✅ Fetch Trial + Paid sub-admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const trialRes = await axios.get(
          "https://masteradmin.routebudget.com/api/admin/get-free-trial-subAdmins"
        );
        const paidRes = await axios.get(
          "https://masteradmin.routebudget.com/api/admin/get-paid-subAdmins"
        );

        if (trialRes.data.success) setTrialAdmins(trialRes.data.subAdmins);
        if (paidRes.data.success) setPaidAdmins(paidRes.data.subAdmins);
      } catch (error) {
        console.error("Failed to fetch sub-admins", error);
      }
    };
    fetchAdmins();
  }, []);

  // ✅ Fetch Sent Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "https://masteradmin.routebudget.com/api/notifications/list"
        );
        if (res.data.success) {
          setSentNotifications(res.data.notifications);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    fetchNotifications();
  }, []);

  // ✅ Send notification API call
  const handleSend = async () => {
    try {
      let recipientId = null;
      let recipientType = null;

      if (selectedTrial) {
        recipientId = selectedTrial.id;
        recipientType = "trial";
      } else if (selectedPaid) {
        recipientId = selectedPaid.id;
        recipientType = "paid";
      }

      if (!recipientId || !message) {
        alert("Please select a sub-admin and enter a message");
        return;
      }

      const res = await axios.post(
        "https://masteradmin.routebudget.com/api/notifications/send",
        {
          recipientId,
          recipientType,
          message,
        }
      );

      if (res.data.success) {
        alert("✅ Notification sent!");
        // push new notification into UI without refresh
        setSentNotifications([res.data.notification, ...sentNotifications]);
        setMessage("");
        setSelectedTrial(null);
        setSelectedPaid(null);
      }
    } catch (error) {
      console.error("Send notification failed", error);
      alert("❌ Failed to send notification");
    }
  };

  return (
    <div className="bg-gray-900 md:ml-60 text-white min-h-screen p-2 sm:p-4 overflow-x-hidden">
      <div className="flex-1 flex">
        {/* Left Panel */}
        <div className="flex-1 p-8">
          <div className="bg-slate-800 rounded-lg p-6 h-full">
            <h2 className="text-xl font-semibold mb-2">Send Manual Notification</h2>
            <p className="text-slate-400 text-sm mb-6">
              Compose and send a message to your sub-admins.
            </p>

            <div className="space-y-6">
              {/* Trial Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Trial Sub-Admins
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsTrialDropdownOpen(!isTrialDropdownOpen)}
                    className="w-full bg-slate-700 px-4 py-3 rounded-lg flex justify-between"
                  >
                    <span>
                      {selectedTrial
                        ? `${selectedTrial.name} (${selectedTrial.email})`
                        : "Select trial sub-admin"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isTrialDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 rounded-lg shadow-lg z-10">
                      <div className="p-2 max-h-40 overflow-y-auto">
                        {trialAdmins.map((admin) => (
                          <div
                            key={admin.id}
                            className="px-3 py-2 hover:bg-slate-600 cursor-pointer"
                            onClick={() => {
                              setSelectedTrial(admin);
                              setSelectedPaid(null);
                              setIsTrialDropdownOpen(false);
                            }}
                          >
                            {admin.name} ({admin.email})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Paid Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Paid Sub-Admins
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsPaidDropdownOpen(!isPaidDropdownOpen)}
                    className="w-full bg-slate-700 px-4 py-3 rounded-lg flex justify-between"
                  >
                    <span>
                      {selectedPaid
                        ? `${selectedPaid.name} (${selectedPaid.email})`
                        : "Select paid sub-admin"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isPaidDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 rounded-lg shadow-lg z-10">
                      <div className="p-2 max-h-40 overflow-y-auto">
                        {paidAdmins.map((admin) => (
                          <div
                            key={admin.id}
                            className="px-3 py-2 hover:bg-slate-600 cursor-pointer"
                            onClick={() => {
                              setSelectedPaid(admin);
                              setSelectedTrial(null);
                              setIsPaidDropdownOpen(false);
                            }}
                          >
                            {admin.name} ({admin.email})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your notification here..."
                  className="w-full bg-slate-700 px-4 py-3 rounded-lg resize-none"
                  rows={6}
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 p-8 pl-0">
          <div className="bg-slate-800 rounded-lg p-6 h-full">
            <h2 className="text-xl font-semibold mb-2">Sent Notifications</h2>
            <p className="text-slate-400 text-sm mb-6">
              A log of previously sent notifications.
            </p>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sentNotifications.length > 0 ? (
                sentNotifications.map((n) => (
                  <div key={n.id} className="p-3 bg-slate-700 rounded-lg text-sm">
                    <p className="font-medium">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      To: {n.recipient?.name} ({n.recipient?.email}) •{" "}
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">
                  No notifications sent yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Automated Notifications */}
      <div className="bg-slate-800 rounded-lg p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Automated Notifications</h3>
            <p className="text-slate-400 text-sm">Set up automated messages.</p>
          </div>
          <Settings className="w-5 h-5 text-slate-400" />
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
          <div>
            <h4 className="font-medium">Welcome New Sub-Admins</h4>
            <p className="text-slate-400 text-sm">
              Automatically send a welcome message when a new sub-admin is added.
            </p>
          </div>
          <input type="checkbox" />
        </div>
      </div>
    </div>
  );
}








