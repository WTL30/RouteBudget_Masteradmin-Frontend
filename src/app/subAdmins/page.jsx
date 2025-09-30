
"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import axios from "axios"
import { Eye, Edit2, Trash2, Search, Download, User, Image } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation"

const SubAdminManagementPage = () => {
  const router = useRouter()

  // State for sub-admins data
  const [subAdmins, setSubAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null) // Track which item is being deleted

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewSubAdmin, setViewSubAdmin] = useState(null)
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [formMode, setFormMode] = useState("add") // "add" or "edit"
  const [isSubmitting, setIsSubmitting] = useState(false) // Loading state for form submission
  const [formData, setFormData] = useState({
    // companyPrefix: "",
    name: "",
    email: "",
    role: "",
    status: "Active",
    phone: "",
    companyInfo: "",
  })

  // Store the actual file object separately
  const [profileImageFile, setProfileImageFile] = useState(null)
  // For preview purposes
  const [profileImagePreview, setProfileImagePreview] = useState("")

  // Store the actual file object separately
  const [companyLogoFile, setCompanyLogoFile] = useState(null)
  // For preview purposes
  const [companyLogoPreview, setCompanyLogoPreview] = useState("")

  // Store the actual file object separately
  const [signature, setSignature] = useState(null)
  // For preview purposes
  const [signaturePreview, setSignaturePreview] = useState("")

  // Function to handle opening settings for a specific sub-admin
  const handleOpenSettings = (subAdmin) => {
    localStorage.setItem("selectedSubAdmin", JSON.stringify(subAdmin))
    router.push("/SystemSettings")
  }

  // ✅ Optimized: Memoize fetch function to prevent recreation
  const fetchSubAdmins = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:5000/api/admin/getAllSubAdmins")
      if (response.status === 200) {
        setSubAdmins(response.data.subAdmins || [])
      }
    } catch (err) {
      console.error("Error fetching sub-admins:", err)
      setError("Failed to load sub-admins. Please try again later.")
      toast.error("Failed to load sub-admins")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load sub-admins on component mount
  useEffect(() => {
    fetchSubAdmins()
  }, [])

  // ✅ Optimized: Memoize filtered data to prevent recalculation on every render
  const filteredSubAdmins = useMemo(() => {
    return subAdmins.filter((sa) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        sa.name?.toLowerCase().includes(query) ||
        sa.email?.toLowerCase().includes(query) ||
        sa.role?.toLowerCase().includes(query) ||
        sa.status?.toLowerCase().includes(query)
      const matchesStatus = filterStatus === "All" || sa.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [subAdmins, searchQuery, filterStatus])

  // ✅ Optimized: Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalItems = filteredSubAdmins.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentSubAdmins = filteredSubAdmins.slice(startIndex, endIndex)
    return { totalItems, totalPages, startIndex, endIndex, currentSubAdmins }
  }, [filteredSubAdmins, currentPage, itemsPerPage])

  const { totalItems, totalPages, startIndex, endIndex, currentSubAdmins } = paginationData

  // ✅ Optimized: Memoize handlers to prevent recreation on every render
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }, [])

  const handleFilterChange = useCallback((e) => {
    setFilterStatus(e.target.value)
    setCurrentPage(1)
  }, [])

  // ✅ Optimized: Memoize export function
  const handleExport = useCallback(() => {
    // Convert data to CSV
    const headers = ["Name", "Email", "Role", "Status", "Phone"]
    const csvData = [
      headers.join(","),
      ...filteredSubAdmins.map((admin) =>
        [admin.name || "", admin.email || "", admin.role || "", admin.status || "", admin.phone || ""].join(","),
      ),
    ].join("\n")

    // Create blob and download
    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", "sub-admins.csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url) // ✅ Clean up memory
    toast.success("Export successful")
  }, [filteredSubAdmins])

  // ✅ Optimized: Memoize view modal handlers
  const handleView = useCallback((subAdmin) => {
    setViewSubAdmin(subAdmin)
    setIsViewModalOpen(true)
  }, [])

  const closeViewModal = useCallback(() => {
    setIsViewModalOpen(false)
    setViewSubAdmin(null)
  }, [])

  // ✅ Optimized: Fast block/unblock with optimistic updates
  const toggleBlockStatus = useCallback(async (id) => {
    try {
      // ✅ Optimistic update - update UI immediately
      const originalSubAdmins = [...subAdmins]
      setSubAdmins(prev => prev.map(sa => 
        sa.id === id 
          ? { ...sa, status: sa.status === "Active" ? "Inactive" : "Active" }
          : sa
      ))
      
      const res = await axios.put(`http://localhost:5000/api/admin/toggle-block/${id}`)
      if (res.status === 200) {
        toast.success(`Sub-admin ${res.data.status}`)
        // No need to fetch again - already updated optimistically
      } else {
        // Revert on failure
        setSubAdmins(originalSubAdmins)
        toast.error("Failed to update status")
      }
    } catch (error) {
      console.error("Error toggling status:", error)
      // Revert on error
      setSubAdmins(prev => prev.map(sa => 
        sa.id === id 
          ? { ...sa, status: sa.status === "Active" ? "Inactive" : "Active" }
          : sa
      ))
      toast.error("Failed to update status")
    }
  }, [subAdmins])

  // Add/Edit Modal
  const handleAddNewSubAdmin = () => {
    setFormMode("add")
    setIsSubmitting(false) // Reset loading state
    setFormData({
      // companyPrefix: "",
      name: "",
      email: "",
      role: "",
      status: "Active",
      phone: "",
      companyInfo: "",
    })
    setProfileImageFile(null)
    setProfileImagePreview("")
    setCompanyLogoFile(null)
    setCompanyLogoPreview("")
    setSignature(null)
    setSignaturePreview("")
    setIsAddEditModalOpen(true)
  }

  // ✅ Optimized: Memoize edit handler
  const handleEdit = useCallback((subAdmin) => {
    console.log("Editing subAdmin:", subAdmin) // Check what data we're starting with
    setFormMode("edit")
    setIsSubmitting(false) // Reset loading state
    setFormData({
      id: subAdmin.id || subAdmin._id || subAdmin.Id,
      name: subAdmin.name || "",
      email: subAdmin.email || "",
      role: subAdmin.role || "",
      status: subAdmin.status || "Active",
      phone: subAdmin.phone || "",
      companyInfo: subAdmin.companyInfo || "",
      companyPrefix: subAdmin.companyPrefix || "",
    })
    setIsAddEditModalOpen(true)
  }, [])

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImageFile(file)
      const previewUrl = URL.createObjectURL(file)
      setProfileImagePreview(previewUrl)
    }
  }

  const handleCompanyLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCompanyLogoFile(file)
      const previewUrl = URL.createObjectURL(file)
      setCompanyLogoPreview(previewUrl)
    }
  }

  const handleSignatureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSignature(file)
      const previewUrl = URL.createObjectURL(file)
      setSignaturePreview(previewUrl)
    }
  }

  // ✅ Optimized: Memoize form change handler
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  // ✅ Optimized: Fast form submission with loading state
  const handleFormSubmit = useCallback(async () => {
    // Validate required fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid Email Address");
      return;
    }

    const phoneRegex = /^\d+$/
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone must contain only digits")
      return
    }

    if (!formData.name || !formData.role) {
      toast.error("Please fill all required fields")
      return
    }

    setIsSubmitting(true) // Start loading

    try {
      // Create FormData object to handle file uploads
      const formDataToSend = new FormData()

      // Add text fields to FormData
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("role", formData.role)
      formDataToSend.append("status", formData.status)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("companyInfo", formData.companyInfo || "")
      formDataToSend.append("companyPrefix", formData.companyPrefix || "")

      // Add file fields to FormData if they exist
      if (profileImageFile) {
        formDataToSend.append("profileImage", profileImageFile)
      }

      if (companyLogoFile) {
        formDataToSend.append("companyLogo", companyLogoFile)
      }

      if (signature) {
        formDataToSend.append("signature", signature)
      }

      const endpoint =
        formMode === "add"
          ? "http://localhost:5000/api/admin/addNewSubAdmin"
          : `http://localhost:5000/api/admin/updateSubAdmin/${formData.id}`

      const response = await axios({
        method: formMode === "add" ? "post" : "put",
        url: endpoint,
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === (formMode === "add" ? 201 : 200)) {
        toast.success(`Sub-admin ${formMode === "add" ? "created" : "updated"} successfully!`)
        
        if (formMode === "add") {
          // ✅ Optimistic update for new admin - add to list immediately
          const newSubAdmin = response.data.subAdmin || {
            id: response.data.id || Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
          }
          setSubAdmins(prev => [newSubAdmin, ...prev])
        } else {
          // ✅ Optimistic update for edit - update existing item
          setSubAdmins(prev => prev.map(sa => 
            sa.id === formData.id ? { ...sa, ...formData } : sa
          ))
        }
        
        setIsAddEditModalOpen(false)
        // ✅ Fetch in background to sync with server (optional)
        fetchSubAdmins()
      }
    } catch (error) {
      console.error("Error:", error)
      let errorMessage = "An error occurred"

      if (error.response) {
        errorMessage = error.response.data.message || `Failed to ${formMode} sub-admin`
      } else if (error.request) {
        errorMessage = "No response from server"
      }

      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false) // Stop loading
    }
  }, [formData, formMode, profileImageFile, companyLogoFile, signature, fetchSubAdmins])

  // Reset form
  const handleFormReset = () => {
    if (formMode === "add") {
      setFormData({
        // companyPrefix: "",
        name: "",
        email: "",
        role: "",
        status: "Active",
        phone: "",
        companyInfo: "",
      })
      setProfileImageFile(null)
      setProfileImagePreview("")
      setCompanyLogoFile(null)
      setCompanyLogoPreview("")
      setSignature(null)
      setSignaturePreview("")
    } else {
      // For edit, reset to original values
      const original = subAdmins.find((sa) => sa.id === formData.id)
      if (original) {
        setFormData({
          ...original,
        })
        setProfileImageFile(null)
        setProfileImagePreview(original.profileImage || "")
        setCompanyLogoFile(null)
        setCompanyLogoPreview(original.companyLogo || "")
        setSignature(null)
        setSignaturePreview(original.signature || "")
      }
    }
  }

  // ✅ Optimized: Fast delete with optimistic updates
  const handleDelete = useCallback(async (subAdmin) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${subAdmin.name}?`)
    if (confirmDelete) {
      setDeletingId(subAdmin.id) // Show loading state for this specific item
      
      try {
        // ✅ Optimistic update - remove from UI immediately
        const originalSubAdmins = [...subAdmins]
        setSubAdmins(prev => prev.filter(sa => sa.id !== subAdmin.id))
        
        const response = await axios.delete(`http://localhost:5000/api/admin/deleteSubAdmin/${subAdmin.id}`)
        
        if (response.status === 200) {
          toast.success("Sub-admin deleted successfully!")
          // No need to fetch again - already updated optimistically
        } else {
          // Revert on failure
          setSubAdmins(originalSubAdmins)
          toast.error("Failed to delete sub-admin")
        }
      } catch (error) {
        console.error("Error deleting sub-admin:", error)
        // Revert on error
        setSubAdmins(prev => [...prev, subAdmin].sort((a, b) => a.id - b.id))
        toast.error("Failed to delete sub-admin")
      } finally {
        setDeletingId(null)
      }
    }
  }, [subAdmins])

  // ✅ Optimized: Memoize pagination handlers
  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }, [currentPage])

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }, [currentPage, totalPages])

  return (
    <div className="bg-gray-900 md:ml-60 text-white min-h-screen p-2 sm:p-4 h-[102%] bg-fixed bg-no-repeat overflow-x-hidden">
      <ToastContainer position="top-right" theme="dark" />

      {/* Title & Add Button - Stacked on mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 mt-2 sm:mt-4 gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">Sub Admin Management</h1>
        <button
          onClick={handleAddNewSubAdmin}
          className="bg-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
        >
          + Add New Sub Admin
        </button>
      </div>

      {/* Search, Filter & Export - Stacked on mobile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 sm:mb-4">
        {/* Filter dropdown - full width on mobile */}
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className="border border-gray-700 rounded-md px-3 py-1.5 bg-gray-800 text-white transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Export button - full width on mobile */}
        <button
          onClick={handleExport}
          className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 flex items-center justify-center gap-2 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
        >
          <Download className="text-white" size={16} />
          Export
        </button>

        {/* Search input - full width on mobile */}
        <div className="relative w-full sm:w-40">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            className="w-full pl-8 border border-gray-300 rounded-md px-3 py-1.5 bg-gray-800 text-white placeholder-gray-400 transition-all duration-300 text-sm sm:text-base"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-6 sm:py-8">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-800 text-white p-2 sm:p-3 rounded-md mb-2 sm:mb-3 text-xs sm:text-sm">{error}</div>
      )}

      {/* Table Container - card layout on mobile */}
      {!isLoading && !error && (
        <div className="sm:overflow-x-auto">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-2">
            {currentSubAdmins.map((subAdmin) => (
              <div
                key={subAdmin.id}
                className="bg-gray-800 rounded-lg p-3 shadow hover:bg-gray-750 transition-colors duration-150"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {subAdmin.profileImage ? (
                      <img
                        src={subAdmin.profileImage || "/placeholder.svg"}
                        alt={subAdmin.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        {subAdmin.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{subAdmin.name}</h3>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">{subAdmin.email}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${subAdmin.status === "Active" ? "bg-green-700" : "bg-red-700"
                      }`}
                  >
                    {subAdmin.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-400">Role</p>
                    <p>{subAdmin.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p>{subAdmin.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(subAdmin)}
                      className="p-1.5 bg-gray-700 rounded-md hover:bg-gray-600"
                    >
                      <Eye className="text-indigo-400" size={14} />
                    </button>
                    <button
                      onClick={() => handleEdit(subAdmin)}
                      className="p-1.5 bg-gray-700 rounded-md hover:bg-gray-600"
                    >
                      <Edit2 className="text-blue-400" size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(subAdmin)}
                      disabled={deletingId === subAdmin.id}
                      className={`p-1.5 rounded-md ${
                        deletingId === subAdmin.id 
                          ? "bg-gray-600 cursor-not-allowed" 
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {deletingId === subAdmin.id ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border border-red-400 border-t-transparent"></div>
                      ) : (
                        <Trash2 className="text-red-400" size={14} />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => toggleBlockStatus(subAdmin.id)}
                    className={`px-2 py-1 text-xs rounded-md ${subAdmin.status === "Active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                      }`}
                  >
                    {subAdmin.status === "Active" ? "Block" : "Unblock"}
                  </button>
                </div>
              </div>
            ))}
            {currentSubAdmins.length === 0 && (
              <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-400">No sub admins found</div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <table className="w-full text-left border-collapse bg-gray-800 overflow-x-auto">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="p-2 sm:p-3 text-sm">Name</th>
                  <th className="p-2 sm:p-3 text-sm">Email</th>
                  <th className="p-2 sm:p-3 text-sm">Role</th>
                  <th className="p-2 sm:p-3 text-sm">Status</th>
                  <th className="p-2 sm:p-3 text-sm">Actions</th>
                  <th className="p-2 sm:p-3 text-sm">Block/Unblock</th>
                  {/* <th className="p-2 sm:p-3 text-sm">Settings</th> */}
                </tr>
              </thead>
              <tbody>
                {currentSubAdmins.map((subAdmin) => (
                  <tr
                    key={subAdmin.id}
                    className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
                  >
                    <td className="p-2 sm:p-3 text-sm">{subAdmin.name}</td>
                    <td className="p-2 sm:p-3 text-sm truncate max-w-[120px]">{subAdmin.email}</td>
                    <td className="p-2 sm:p-3 text-sm">{subAdmin.role}</td>
                    <td className="p-2 sm:p-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${subAdmin.status === "Active" ? "bg-green-700" : "bg-red-700"
                          }`}
                      >
                        {subAdmin.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleView(subAdmin)}>
                          <Eye className="text-indigo-400 hover:text-indigo-300" size={16} />
                        </button>
                        <button onClick={() => handleEdit(subAdmin)}>
                          <Edit2 className="text-blue-400 hover:text-blue-300" size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(subAdmin)}
                          disabled={deletingId === subAdmin.id}
                          className={deletingId === subAdmin.id ? "cursor-not-allowed" : ""}
                        >
                          {deletingId === subAdmin.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border border-red-400 border-t-transparent"></div>
                          ) : (
                            <Trash2 className="text-red-400 hover:text-red-300" size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <button
                        onClick={() => toggleBlockStatus(subAdmin.id)}
                        className={`px-2 py-1 text-xs rounded-md ${subAdmin.status === "Active"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                          }`}
                      >
                        {subAdmin.status === "Active" ? "Block" : "Unblock"}
                      </button>
                    </td>
                    {/* <td className="p-2 sm:p-3">
                      <button
                        onClick={() => handleOpenSettings(subAdmin)}
                        className="px-2 py-1 text-xs rounded-md bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Settings size={12} />
                        Settings
                      </button>
                    </td> */}
                  </tr>
                ))}
                {currentSubAdmins.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-3 text-center text-gray-400 text-sm">
                      No sub admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-3 sm:mt-4 gap-2 sm:gap-0 max-w-full">
          <p className="text-xs sm:text-sm text-gray-300">
            Showing <span className="font-medium">{filteredSubAdmins.length > 0 ? startIndex + 1 : 0}</span> to{" "}
            <span className="font-medium">{Math.min(endIndex, filteredSubAdmins.length)}</span> of{" "}
            <span className="font-medium">{filteredSubAdmins.length}</span> entries
          </p>
          <div className="flex gap-1">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-2 py-1 border border-gray-600 rounded-md text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 text-xs sm:text-sm"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || filteredSubAdmins.length === 0}
              className="px-2 py-1 border border-gray-600 rounded-md text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 text-xs sm:text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ------------------ MODALS ------------------ */}
      {/* View Modal */}
      {isViewModalOpen && viewSubAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto mx-2">
            <div className="p-4 sm:p-6 relative">
              <button
                onClick={closeViewModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
              <div className="flex items-center gap-3 mb-4">
                {viewSubAdmin.profileImage ? (
                  <img
                    src={viewSubAdmin.profileImage || "/placeholder.svg"}
                    alt={viewSubAdmin.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
                    {viewSubAdmin.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">{viewSubAdmin.name}</h2>
                  <p className="text-sm text-gray-400">{viewSubAdmin.role}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Email</span>
                  <span>{viewSubAdmin.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Phone</span>
                  <span>{viewSubAdmin.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Status</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${viewSubAdmin.status === "Active" ? "bg-green-700" : "bg-red-700"
                      }`}
                  >
                    {viewSubAdmin.status}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Created</span>
                  <span>{new Date(viewSubAdmin.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto mx-2">
            <div className="p-4 sm:p-6 relative">
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                {formMode === "add" ? "Add New Sub Admin" : "Edit Sub Admin"}
              </h2>

              <div className="space-y-3">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium mb-1">Profile Image</label>
                  <div className="flex items-center gap-4">
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                        <User size={24} />
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-xs sm:text-sm" />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Company Name*</label>
                    <input
                      type="text"
                      name="name" // Must match formData key
                      value={formData.name || ""}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
                      placeholder="Full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
                      placeholder="Email address"
                      required
                    />
                    {/* {formData.email && !/@gmail\.com$/i.test(formData.email) && (
                      <p className="text-red-500 text-xs mt-1">Enter Valid Email </p>
                    )} */}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Company Address</label>
                    <input
                      type="text"
                      name="companyInfo"
                      value={formData.companyInfo || ""}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
                      placeholder="Company Info"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone*</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
                      placeholder="Phone number"
                      required
                    />
                    {/* {formData.phone && !/^\d{10}$/.test(formData.phone) && (
                      <p className="text-red-500 text-xs mt-1">Phone number must be exactly 10 digits</p>
                    )} */}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Role*</label>
                    <select
                      name="role"
                      value={formData.role || ""}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
                      required
                    >
                      <option value="">Select role</option>
                      <option value="subadmin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status || "Active"}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>



                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Company Logo</label>
                    <div className="flex items-center gap-4">
                      {companyLogoPreview ? (
                        <img
                          src={companyLogoPreview || "/placeholder.svg"}
                          alt="Company logo preview"
                          className="w-16 h-16 rounded object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-gray-700 flex items-center justify-center text-gray-400">
                          <Image size={24} />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCompanyLogoChange}
                        className="text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Company Signature</label>
                    <div className="flex items-center gap-4">
                      {signaturePreview ? (
                        <img
                          src={signaturePreview || "/placeholder.svg"}
                          alt="signature preview"
                          className="w-16 h-16 rounded object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-gray-700 flex items-center justify-center text-gray-400">
                          <Image size={24} />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSignatureChange}
                        className="text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={handleFormReset}
                  className="px-3 py-1.5 border border-gray-600 rounded-md hover:bg-gray-700 text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-600 rounded-md hover:bg-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 min-w-[80px] justify-center ${
                    isSubmitting 
                      ? "bg-indigo-400 cursor-not-allowed" 
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    formMode === "add" ? "Add" : "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default SubAdminManagementPage
