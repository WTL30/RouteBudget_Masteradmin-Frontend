"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Car, ChevronDown, Download } from "lucide-react"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("expenses")
  const [analyticsData, setAnalyticsData] = useState([])
  const [revenueData, setRevenueData] = useState(null)
  const [expenseData, setExpenseData] = useState([])
  const [companyExpenses, setCompanyExpenses] = useState([])
  const [totalExpense, setTotalExpense] = useState(0)
  const [expenseLoading, setExpenseLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState("month") // Default to month
  const [isBrowser, setIsBrowser] = useState(false)
  const [totalCabs, setTotalCabs] = useState(0)
  const [totalDrivers, setTotalDrivers] = useState(0)

  // Check if we're in the browser
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Fetch revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get("https://masteradmin.routebudget.com/api/revenue")
        console.log("Revenue Data:", response.data)
        setRevenueData(response.data)
      } catch (error) {
        console.error("Error fetching revenue data:", error)
        // Set default revenue data if API fails
        setRevenueData({
          totalRevenue: 0,
          monthlyData: [],
        })
      }
    }

    if (isBrowser) {
      fetchRevenueData()
    }
  }, [isBrowser])

  // Fetch expense data and aggregate by company
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        setExpenseLoading(true)
        const response = await axios.get("https://masteradmin.routebudget.com/api/admin/subadmin-expenses")

        console.log("Expense API Response:", response.data)

        if (response.data.success && Array.isArray(response.data.data)) {
          // Store the raw expense data
          setExpenseData(response.data.data)

          // Calculate total expense
          const total = response.data.data.reduce((sum, expense) => sum + expense.totalExpense, 0)
          setTotalExpense(total)

          // Aggregate expenses by company name
          setCompanyExpenses(response.data.data.map(item => ({
            company: item.SubAdmin,
            amount: item.totalExpense,
            totalDrivers: item.totalDrivers,
            totalCabs: item.totalCabs
          })))
        } else {
          throw new Error("Invalid expense data format from API")
        }
      } catch (error) {
        console.error("Error fetching expense data:", error)
        setExpenseData([])
        setCompanyExpenses([])
        setTotalExpense(0)
      } finally {
        setExpenseLoading(false)
      }
    }

    if (isBrowser) {
      fetchExpenseData()
    }
  }, [isBrowser])

  // Export data to Excel
  const exportToExcel = () => {
    if (!isBrowser) return

    if (companyExpenses.length === 0) {
      alert("No data to export!")
      return
    }

    try {
      // Format Data for company expenses
      const formattedData = companyExpenses.map((expense, index) => ({
        ID: index + 1,
        "Company Name": expense.company,
        "Total Cabs": expense.totalCabs,
        "Total Drivers": expense.totalDrivers,
        "Total Expense (₹)": expense.amount
      }))

      // Add a row for totals
      formattedData.push({
        ID: "",
        "Company Name": "Totals",
        "Total Expense (₹)": totalExpense,
      })

      // Convert JSON to Worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData)

      // Create Workbook and add Worksheet
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, `Company Expenses (${timePeriod})`)

      // Convert to Blob & Trigger Download
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      saveAs(data, `CompanyExpensesReport_${timePeriod}.xlsx`)

      alert("Export successful!")
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Failed to export data: " + (error.message || "Unknown error"))
    }
  }

  // Generate pie chart data from company expenses
  const generatePieChartData = () => {
    if (companyExpenses.length === 0) {
      return [
        { name: "1st Qtr", value: 45 },
        { name: "2nd Qtr", value: 30 },
        { name: "3rd Qtr", value: 15 },
        { name: "4th Qtr", value: 10 },
      ]
    }

    // Take top 4 companies, combine the rest as "Others"
    const topCompanies = companyExpenses.slice(0, 4)
    const otherCompanies = companyExpenses.slice(4)

    const pieData = topCompanies.map(item => ({
      name: item.company,
      value: item.amount
    }))

    if (otherCompanies.length > 0) {
      const otherTotal = otherCompanies.reduce((sum, item) => sum + item.amount, 0)
      pieData.push({
        name: "Others",
        value: otherTotal
      })
    }

    return pieData
  }

  // Bar chart data
  const barData = [
    { name: "Category 1", series1: 4.2, series2: 2.3, series3: 2.5 },
    { name: "Category 2", series1: 4.3, series2: 2.0, series3: 3.0 },
    { name: "Category 3", series1: 3.5, series2: 1.8, series3: 2.2 },
    { name: "Category 4", series1: 4.5, series2: 3.0, series3: 3.8 },
  ]

  // Colors for pie chart
  const COLORS = ["#4169E1", "#FF7F50", "#A9A9A9", "#FFD700", "#8A2BE2", "#20B2AA"]

  // Custom Card component
  const Card = ({ children, className = "" }) => (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${className} animate-fadeIn`}
    >
      {children}
    </div>
  )

  // Custom CardHeader component
  const CardHeader = ({ children, className = "" }) => <div className={`p-4 pb-2 ${className}`}>{children}</div>

  // Custom CardTitle component
  const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-base font-medium ${className}`}>{children}</h3>
  )

  // Custom CardContent component
  const CardContent = ({ children, className = "" }) => <div className={`p-4 pt-0 ${className}`}>{children}</div>

  // Custom Button component
  const Button = ({ children, variant = "default", className = "", ...props }) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"

    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-700 bg-transparent hover:bg-gray-800 text-white",
      link: "text-blue-500 underline-offset-4 hover:underline p-0 h-auto",
    }

    return (
      <button className={`${baseClasses} ${variantClasses[variant]} ${className} animate-fadeIn`} {...props}>
        {children}
      </button>
    )
  }

  // If not in browser yet, return null or a loading state
  if (!isBrowser) {
    return null
  }

  return (
    <div className="min-h-screen md:ml-60 bg-black text-white p-4 md:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row mt-8 justify-between items-start md:items-center mb-6 animate-fadeIn">
          <h1 className="text-2xl font-bold animate-fadeIn">Reports & Analytics</h1>
          <div className="flex items-center gap-3 mt-4 md:mt-0 animate-fadeIn">
            <div className="relative">
              <select
                className="h-10 px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white appearance-none pr-8"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              >
                <option value="month">Monthly</option>
              </select>
              <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            <Button className="h-10 px-4 py-2" onClick={exportToExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeIn">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">₹{totalExpense}</span>
              </div>
              <div className="mt-1">
                <Car className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-green-500">₹{totalExpense}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Title */}
        <h2 className="text-xl font-semibold mb-6 animate-fadeIn">Expense Distribution</h2>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fadeIn">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company Expense Distribution</CardTitle>
              <div className="flex space-x-2 mt-2">
                <button className="px-3 py-1 text-xs rounded border border-gray-700 bg-gray-800 text-white">
                  Monthly
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generatePieChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={1500}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {generatePieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`₹${value}`, 'Amount']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Expense Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="series1"
                      name="Series 1"
                      fill="#4169E1"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                    <Bar
                      dataKey="series2"
                      name="Series 2"
                      fill="#A9A9A9"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                    <Bar
                      dataKey="series3"
                      name="Series 3"
                      fill="#FF7F50"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Tab Section */}
        <div className="mb-4 animate-fadeIn">
          <div>

            <Card>
              <CardHeader>
                <CardTitle>Expenses Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {expenseLoading ? (
                  <p className="text-gray-400">Loading expense data...</p>
                ) : companyExpenses.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-red-500">Total Expenses: ₹{totalExpense}</p>
                    </div>
                    <ul className="divide-y divide-gray-700">
                      {companyExpenses.map((item, index) => (
                        <li key={index} className="py-3 flex justify-between items-center">
                          <div>
                            <p className="text-gray-300 font-medium">
                              {item.company}
                            </p>
                            {/* <p className="text-gray-400 text-sm">Cabs: {item.totalCabs} | Drivers: {item.totalDrivers}</p> */}
                          </div>
                          <p className="text-red-400 font-semibold">₹{item.amount}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-400">No expense data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard