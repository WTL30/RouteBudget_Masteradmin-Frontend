'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, ShieldAlert, Calendar, Settings } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: 'URGENT: Cab Breakdown Detected',
        message:
          'Cab ID: CAB-2028-098 | Driver: John Smith\nLocation: 40.7128° N, 74.0060° W\nEst. Repair Time: 45 minutes',
        bgColor: 'bg-red-900',
        borderColor: 'border-red-600',
        icon: <AlertCircle size={24} className="text-red-400 animate-pulse" />
      }

      setNotifications((prev) => [newNotification, ...prev])
      playNotificationSound()
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const playNotificationSound = () => {
    const audio = new Audio('../img/notify-6-313751.mp3')
    audio.play()
  }

  return (
    <div className="bg-gray-900 md:ml-60 min-h-screen text-white p-4 md:p-6 flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <h1 className="text-2xl md:text-3xl font-extrabold">Notifications & Alerts</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-800 px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-gray-700 text-sm md:text-base"
        >
          <Settings size={18} /> Settings
        </motion.button>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-4 md:space-y-6 overflow-y-auto flex-1">
        {/* Dynamic Notifications */}
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
            whileHover={{
              scale: [1, 0.98, 1.02, 1],
              transition: { duration: 0.5, ease: 'easeInOut' }
            }}
            className={`${notification.bgColor} p-4 md:p-5 rounded-lg border ${notification.borderColor} shadow-lg transition`}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  {notification.icon} {notification.type}
                </h2>
                <p className="text-xs md:text-sm text-gray-300 whitespace-pre-line">
                  {notification.message}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-700 px-3 py-2 text-sm md:text-base rounded-lg shadow-lg hover:bg-red-600 w-full md:w-auto"
              >
                Notify Tow Service
              </motion.button>
            </div>
          </motion.div>
        ))}

        {/* Static Notifications */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{
            scale: [1, 0.98, 1.02, 1],
            transition: { duration: 0.5, ease: 'easeInOut' }
          }}
          className="bg-red-900 p-4 rounded-lg border border-red-500 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <AlertCircle size={20} className="text-red-400" /> URGENT: Cab Breakdown Detected
              </h2>
              <p className="text-xs md:text-sm text-gray-300">Cab ID: CAB-2028-098 | Driver: John Smith</p>
              <p className="text-xs md:text-sm text-gray-400">Est. Repair Time: 45 minutes</p>
            </div>
            <button className="bg-red-700 px-3 py-2 text-sm md:text-base rounded-lg w-full md:w-auto">Notify Tow Service</button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{
            scale: [1, 0.98, 1.02, 1],
            transition: { duration: 0.5, ease: 'easeInOut' }
          }}
          className="bg-purple-900 p-4 rounded-lg border border-purple-500 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert size={20} className="text-purple-400" /> SECURITY ALERT: Unauthorized Access Attempt
              </h2>
              <p className="text-xs md:text-sm text-gray-300">Multiple failed login attempts detected</p>
            </div>
            <button className="bg-purple-700 px-3 py-2 text-sm md:text-base rounded-lg w-full md:w-auto mt-2 md:mt-0">Review Logs</button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          whileHover={{
            scale: [1, 0.98, 1.02, 1],
            transition: { duration: 0.5, ease: 'easeInOut' }
          }}
          className="bg-blue-900 p-4 rounded-lg border border-blue-500 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar size={20} className="text-blue-400" /> Scheduled Maintenance Notice
              </h2>
              <p className="text-xs md:text-sm text-gray-300">Maintenance on March 15, 2025 | Downtime: 30 mins</p>
            </div>
            <button className="bg-blue-700 px-3 py-2 text-sm md:text-base rounded-lg w-full md:w-auto mt-2 md:mt-0">View Details</button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}