"use client";
import { useState, useEffect } from "react";
import { Settings, X, Search, ArrowLeft } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SystemSettingsPage() {
  const router = useRouter();

  // State for the selected sub-admin
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);

  // For the initial search box (only used if no sub-admin is selected)
  const [subAdminName, setSubAdminName] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Track whether the user has logged out
  const [loggedOut, setLoggedOut] = useState(false);

  // For animative message when a setting is changed after logout or in settings
  const [notification, setNotification] = useState("");

  // Sub Admin toggles
  const [subAdmin, setSubAdmin] = useState({
    dashboard: false,
    subAdmin: true,
    driverManagement: false,
    cabManagement: true,
    rides: false,
    expenseManagement: true,
    analytics: false,
  });

  // Settings Drawer visibility
  const [openSettings, setOpenSettings] = useState(false);

  // Settings toggles
  const [settings, setSettings] = useState({
    multiLanguage: false,
    googleMap: true,
    paymentGateway: false,
    darkMode: false,
  });

  // Load selected sub-admin from localStorage on component mount
  useEffect(() => {
    try {
      const storedSubAdmin = localStorage.getItem("selectedSubAdmin");
      if (storedSubAdmin) {
        const parsedSubAdmin = JSON.parse(storedSubAdmin);
        setSelectedSubAdmin(parsedSubAdmin);
        setSubAdminName(parsedSubAdmin.name);
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Error loading selected sub-admin:", error);
    }
  }, []);

  // Helper to render a Switch with label
  const renderToggle = (label, checked, onChange) => {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="font-medium">{label}</span>
        <Switch.Root
          checked={checked}
          onCheckedChange={onChange}
          className="w-11 h-6 bg-gray-300 rounded-full relative transition-colors data-[state=checked]:bg-blue-500"
        >
          <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
        </Switch.Root>
      </div>
    );
  };

  // Handle sub-admin name search
  const handleSearch = () => {
    if (subAdminName.trim()) {
      setHasSearched(true);
      setLoggedOut(false);
    }
  };

  // Handle back button to return to sub-admin management
  const handleBack = () => {
    router.push("/sub-admin-management");
  };

  // Handle logout in settings: resets search box and sets loggedOut to true
  const handleLogout = () => {
    setHasSearched(false);
    setLoggedOut(true);
    setSubAdminName("");
    setSelectedSubAdmin(null);
    setOpenSettings(false);
    localStorage.removeItem("selectedSubAdmin");
  };

  // Handle toggles in the Settings drawer.
  // All notification messages now appear on the left side.
  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setNotification(
      `${subAdminName || "User"}: ${key} changed to ${
        value ? "Enabled" : "Disabled"
      }`
    );
    setTimeout(() => setNotification(""), 2000);
  };

  // Handle sub-admin toggle changes.
  const handleSubAdminToggleChange = (key, value) => {
    setSubAdmin((prev) => ({ ...prev, [key]: value }));
    setNotification(
      `${subAdminName || "User"}: ${key} changed to ${
        value ? "Enabled" : "Disabled"
      }`
    );
    setTimeout(() => setNotification(""), 2000);
  };

  useEffect(() => {
    const subDetail = JSON.parse(localStorage.getItem("selectedSubAdmin"));

    if (!subDetail || !subDetail._id) return; // Ensure subDetail exists

    const updatePermissions = async () => {
      try {
        const response = await axios.post(
          "https://api.routebudget.com/api/subAdminPermissions/sub-admin",
          {
            subAdminId: subDetail._id,
            name: subDetail.name,
            permissions: subAdmin,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Permissions updated:", response.data);
      } catch (error) {
        console.error(
          "Error updating permissions:",
          error.response ? error.response.data : error.message
        );
      }
    };

    updatePermissions();
  }, [subAdmin]); // ✅ Runs only when `subAdmin` state changes

  return (
    <div className="min-h-screen md:ml-60 h-full bg-gray-900 text-white p-6 relative overflow-hidden">
      {/* Back button to return to sub-admin management */}
      {selectedSubAdmin && (
        <button
          onClick={handleBack}
          className="fixed top-4 left-4 p-2 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 z-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}

      {/* Animated Notification Message (Always on Left) */}
      {notification && (
        <div className="fixed top-20 left-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fadeIn z-50">
          {notification}
        </div>
      )}

      {/* If user hasn't searched sub-admin name yet, show search box */}
      {!hasSearched && (
        <div className="flex flex-col items-center justify-center mt-10">
          <h1 className="text-xl mb-4">Enter Sub Admin Name</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Sub Admin name..."
                className="pl-8 pr-2 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none border border-gray-700"
                value={subAdminName}
                onChange={(e) => setSubAdminName(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Main content only shows if user has searched */}
      {hasSearched && (
        <>
          {/* Animated Settings Button (Top Right) */}
          <button
            className="fixed top-4 right-4 p-2 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 z-50 hover:rotate-90"
            onClick={() => setOpenSettings(true)}
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Overlay (dims background when settings open) */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
              openSettings ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setOpenSettings(false)}
          />

          {/* Settings Drawer (Slides in from the right) */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-gray-800 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              openSettings ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Settings</h2>
              <button
                className="p-1 hover:text-gray-300"
                onClick={() => setOpenSettings(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Display the searched sub-admin name */}
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-sm text-gray-400">
                Logged in as:{" "}
                <span className="font-semibold">{subAdminName}</span>
              </p>
            </div>
            <div className="p-4 space-y-4">
              <h3 className="font-bold text-lg">Features</h3>
              {renderToggle("Multi-Language", settings.multiLanguage, (val) =>
                handleSettingChange("multiLanguage", val)
              )}
              {renderToggle("Google Map", settings.googleMap, (val) =>
                handleSettingChange("googleMap", val)
              )}
              {renderToggle("Payment Gateway", settings.paymentGateway, (val) =>
                handleSettingChange("paymentGateway", val)
              )}
              {renderToggle("Dark Mode", settings.darkMode, (val) =>
                handleSettingChange("darkMode", val)
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Main Content: Two columns on large screens, stacked on small screens */}
          <div className="container mx-auto mt-10 opacity-100 transition-opacity duration-700">
            {/* Display selected sub-admin info */}
            {selectedSubAdmin && (
              <div className="mb-6 bg-gray-800 p-4 rounded-md shadow-lg">
                <h2 className="text-xl font-semibold mb-2">
                  Settings for subAdmin: {selectedSubAdmin.name}
                </h2>
                <div className="flex flex-wrap gap-4">
                  <div className="text-sm text-gray-300">
                    <span className="text-gray-400">Email:</span>{" "}
                    {selectedSubAdmin.email}
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="text-gray-400">Role:</span>{" "}
                    {selectedSubAdmin.role}
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="text-gray-400">Status:</span>{" "}
                    {selectedSubAdmin.status}
                  </div>
                </div>
              </div>
            )}

            {/* Sub Admin Section */}
            <div className="flip-360 bg-gray-800 p-6 rounded-md shadow-2xl transform transition-all duration-1500">
              <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2 text-center">
                Sub Admin
              </h2>
              <div className="space-y-2">
                {renderToggle("Dashboard", subAdmin.dashboard, (val) =>
                  handleSubAdminToggleChange("dashboard", val)
                )}
                {renderToggle("Sub Admin", subAdmin.subAdmin, (val) =>
                  handleSubAdminToggleChange("subAdmin", val)
                )}
                {renderToggle(
                  "Driver Management",
                  subAdmin.driverManagement,
                  (val) => handleSubAdminToggleChange("driverManagement", val)
                )}
                {renderToggle("Cab Management", subAdmin.cabManagement, (val) =>
                  handleSubAdminToggleChange("cabManagement", val)
                )}
                {renderToggle("Rides", subAdmin.rides, (val) =>
                  handleSubAdminToggleChange("rides", val)
                )}
                {renderToggle(
                  "Expense Management",
                  subAdmin.expenseManagement,
                  (val) => handleSubAdminToggleChange("expenseManagement", val)
                )}
                {renderToggle("Analytics", subAdmin.analytics, (val) =>
                  handleSubAdminToggleChange("analytics", val)
                )}
              </div>
            </div>
          </div>
          {/* </div> */}
        </>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s forwards;
        }
      `}</style>
    </div>
  );
}
