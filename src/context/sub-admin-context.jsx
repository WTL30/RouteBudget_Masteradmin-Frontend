"use client"
import { createContext, useContext, useState, useEffect } from "react"

const SubAdminContext = createContext(undefined)

export const SubAdminProvider = ({ children }) => {
  const [subAdmins, setSubAdmins] = useState([])
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null)

  // Fetch sub-admins from API
  const fetchSubAdmins = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/getAllSubAdmins")
      if (response.ok) {
        const data = await response.json()
        // Add default settings to each sub-admin
        const subAdminsWithSettings = data.subAdmins.map((admin) => ({
          ...admin,
          settings: {
            dashboard: false,
            subAdmin: true,
            driverManagement: false,
            cabManagement: true,
            rides: false,
            expenseManagement: true,
            analytics: false,
          },
          isDisabled: admin.status === "Inactive",
        }))
        setSubAdmins(subAdminsWithSettings)
      }
    } catch (error) {
      console.error("Error fetching sub-admins:", error)
    }
  }

  // Search for a sub-admin by name
  const searchSubAdmin = (name) => {
    const foundSubAdmin = subAdmins.find(
      (admin) => admin.name.toLowerCase() === name.toLowerCase()
    )
    if (foundSubAdmin) {
      setSelectedSubAdmin(foundSubAdmin)
      return foundSubAdmin
    }
    return null
  }

  // Update a sub-admin's settings
  const updateSubAdminSettings = (id, settings) => {
    setSubAdmins((prevSubAdmins) =>
      prevSubAdmins.map((admin) =>
        admin._id === id ? { ...admin, settings: { ...admin.settings, ...settings } } : admin
      )
    )

    if (selectedSubAdmin && selectedSubAdmin._id === id) {
      setSelectedSubAdmin((prev) => (prev ? { ...prev, settings: { ...prev.settings, ...settings } } : null))
    }
  }

  // Load sub-admins on mount
  useEffect(() => {
    fetchSubAdmins()
  }, [])

  return (
    <SubAdminContext.Provider
      value={{
        subAdmins,
        setSubAdmins,
        selectedSubAdmin,
        setSelectedSubAdmin,
        fetchSubAdmins,
        searchSubAdmin,
        updateSubAdminSettings,
      }}
    >
      {children}
    </SubAdminContext.Provider>
  )
}

export const useSubAdmin = () => {
  const context = useContext(SubAdminContext)
  console.log("SubAdminContext Value:", context) // Debugging log
  if (context === undefined) {
    throw new Error("useSubAdmin must be used within a SubAdminProvider")
  }
  return context
}
