"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RidesPage() {
  // Data for the line chart
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 7000, 6000, 8000, 9000, 7500, 8500],
        borderColor: "rgba(79, 70, 229, 0.8)", // Indigo color for the line
        backgroundColor: "rgba(79, 70, 229, 0.2)", // Light indigo for the fill
        fill: true,
        tension: 0.4, // Smooth line
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff", // White text for the legend
        },
      },
      title: {
        display: true,
        text: "Annual Revenue",
        color: "#fff", // White text for the title
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          color: "#fff", // White text for x-axis labels
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Light grid lines for y-axis
        },
        ticks: {
          color: "#fff", // White text for y-axis labels
        },
      },
    },
  };

  // Recent rides data
  const recentRides = [
    {
      id: "#RD8294",
      cabNo: "CAB-2023",
      driver: "John Smith",
      pickup: "Downtown",
      dropOff: "Airport",
      fare: "$45.00",
      status: "Completed",
    },
    {
      id: "#RD8295",
      cabNo: "CAB-2024",
      driver: "Sarah Johnson",
      pickup: "Mall",
      dropOff: "Station",
      fare: "$25.00",
      status: "In Progress",
    },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 mt-6">Rides</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Rides */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-200">Total Rides</h2>
          <p className="text-3xl font-bold mt-2 text-white">2,451</p>
          <p className="text-sm text-green-400">+12.5% from last month</p>
        </div>

        {/* Active Rides */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-200">Active Rides</h2>
          <p className="text-3xl font-bold mt-2 text-white">18</p>
          <p className="text-sm text-gray-400">Currently in progress</p>
        </div>

        {/* Completed Today */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-200">Completed Today</h2>
          <p className="text-3xl font-bold mt-2 text-white">145</p>
          <p className="text-sm text-green-400">+8% from yesterday</p>
        </div>
      </div>

      {/* Annual Revenue Graph */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Annual Revenue</h2>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Rides Table */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Recent Rides</h2>
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-left text-sm font-semibold text-gray-200">
                  RIDE ID
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-200">
                  CAB NO.
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-200">
                  DRIVER
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-200">
                  PICKUP
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-200">
                  DROP-OFF
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-200">
                  FARE
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-200">
                  STATUS
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-200">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {recentRides.map((ride) => (
                <tr key={ride.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-3 text-sm text-gray-300">{ride.id}</td>
                  <td className="p-3 text-sm text-gray-300">{ride.cabNo}</td>
                  <td className="p-3 text-sm text-gray-300">{ride.driver}</td>
                  <td className="p-3 text-sm text-gray-300">{ride.pickup}</td>
                  <td className="p-3 text-sm text-gray-300">{ride.dropOff}</td>
                  <td className="p-3 text-sm text-gray-300">{ride.fare}</td>
                  <td className="p-3 text-sm text-gray-300">
                    {ride.status === "Completed" ? (
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                        In Progress
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-300">
                    <button className="text-indigo-400 hover:text-indigo-300">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-400">
            Showing 2 of 2,451 rides
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-700">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
