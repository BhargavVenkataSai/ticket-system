import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

interface Ticket {
  id: number;
  subject: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  owner: {
    id: number;
    fullName: string;
    email: string;
  };
  assignee?: {
    id: number;
    fullName: string;
  };
}

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: "USER" | "SUPPORT_AGENT" | "ADMIN";
}

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  totalUsers: number;
}

interface AdminDashboardProps {
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: "USER" | "SUPPORT_AGENT" | "ADMIN";
  };
  token: string;
  logout: () => void;
}

export default function AdminDashboard({
  user,
  token,
  logout,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"tickets" | "users">("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [supportAgents, setSupportAgents] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showForceStatusModal, setShowForceStatusModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Form states
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    role: "USER" as "USER" | "SUPPORT_AGENT" | "ADMIN",
  });
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<number | null>(
    null
  );
  const [forceStatus, setForceStatus] = useState<
    "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  >("OPEN");

  useEffect(() => {
    fetchStats();
    fetchTickets();
    fetchUsers();
    fetchSupportAgents();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [searchTerm, statusFilter, priorityFilter]);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchTickets = async () => {
    try {
      let url = `http://localhost:8080/api/admin/tickets?page=0&size=100`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (priorityFilter) url += `&priority=${priorityFilter}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data.content || []);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const fetchSupportAgents = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSupportAgents(data.filter((u: User) => u.role === "SUPPORT_AGENT"));
      }
    } catch (error) {
      console.error("Error fetching support agents:", error);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        toast.success("User created successfully!");
        setShowAddUserModal(false);
        setNewUser({
          username: "",
          password: "",
          fullName: "",
          email: "",
          role: "USER",
        });
        fetchUsers();
        fetchSupportAgents();
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        toast.error(errorData.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };

  const updateUserRole = async (
    userId: number,
    newRole: "USER" | "SUPPORT_AGENT" | "ADMIN"
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (response.ok) {
        toast.success("User role updated successfully!");
        fetchUsers();
        fetchSupportAgents();
      } else {
        toast.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("User deleted successfully!");
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const assignTicket = async (ticketId: number) => {
    if (!selectedAssigneeId) {
      toast.error("Please select an assignee");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/tickets/${ticketId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assigneeId: selectedAssigneeId }),
        }
      );

      if (response.ok) {
        toast.success("Ticket assigned successfully!");
        setShowAssignModal(false);
        setSelectedTicket(null);
        fetchTickets();
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        toast.error(errorData.error || "Failed to assign ticket");
      }
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast.error("Failed to assign ticket");
    }
  };

  const forceUpdateStatus = async (ticketId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/tickets/${ticketId}/force-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: forceStatus }),
        }
      );

      if (response.ok) {
        toast.success("Ticket status updated successfully!");
        setShowForceStatusModal(false);
        setSelectedTicket(null);
        fetchTickets();
        fetchStats();
      } else {
        toast.error("Failed to update ticket status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.fullName}</span>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Global Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900">
                Total Tickets
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalTickets}
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900">Open</h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.openTickets}
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900">In Progress</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.inProgressTickets}
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900">Resolved</h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.resolvedTickets}
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900">Closed</h3>
              <p className="text-3xl font-bold text-gray-600">
                {stats.closedTickets}
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
              <p className="text-3xl font-bold text-purple-600">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("tickets")}
              className={`${
                activeTab === "tickets"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Ticket Management
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              User Management
            </button>
          </nav>
        </div>

        {/* Ticket Management Tab */}
        {activeTab === "tickets" && (
          <div>
            {/* Filters */}
            <div className="card mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Search by subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="input-field w-full"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    className="input-field w-full"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* All Tickets Table */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                All Tickets
              </h3>
              {tickets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No tickets found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.subject}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ticket.description.substring(0, 50)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {ticket.owner.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {ticket.assignee
                              ? ticket.assignee.fullName
                              : "Unassigned"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                ticket.status
                              )}`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => {
                                setSelectedTicket(ticket);
                                router.push(`/tickets/${ticket.id}`);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setShowAssignModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              Reassign
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setForceStatus(ticket.status);
                                setShowForceStatusModal(true);
                              }}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Force Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === "users" && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="btn-primary"
              >
                Add User
              </button>
            </div>

            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                All Users
              </h3>
              {users.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No users found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Full Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((userItem) => (
                        <tr key={userItem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {userItem.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {userItem.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {userItem.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <select
                              className="input-field"
                              value={userItem.role}
                              onChange={(e) =>
                                updateUserRole(
                                  userItem.id,
                                  e.target.value as
                                    | "USER"
                                    | "SUPPORT_AGENT"
                                    | "ADMIN"
                                )
                              }
                            >
                              <option value="USER">User</option>
                              <option value="SUPPORT_AGENT">
                                Support Agent
                              </option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteUser(userItem.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add New User
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="input-field w-full"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={newUser.fullName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input-field w-full"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="input-field w-full"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as
                        | "USER"
                        | "SUPPORT_AGENT"
                        | "ADMIN",
                    })
                  }
                >
                  <option value="USER">User</option>
                  <option value="SUPPORT_AGENT">Support Agent</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={createUser} className="btn-primary flex-1">
                Create User
              </button>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUser({
                    username: "",
                    password: "",
                    fullName: "",
                    email: "",
                    role: "USER",
                  });
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Ticket Modal */}
      {showAssignModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Reassign Ticket
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Support Agent
              </label>
              <select
                className="input-field w-full"
                value={selectedAssigneeId || ""}
                onChange={(e) => setSelectedAssigneeId(Number(e.target.value))}
              >
                <option value="">Select an agent...</option>
                {supportAgents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.fullName} ({agent.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => assignTicket(selectedTicket.id)}
                className="btn-primary flex-1"
              >
                Assign
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedTicket(null);
                  setSelectedAssigneeId(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Force Status Modal */}
      {showForceStatusModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Force Update Ticket Status
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                className="input-field w-full"
                value={forceStatus}
                onChange={(e) =>
                  setForceStatus(
                    e.target.value as
                      | "OPEN"
                      | "IN_PROGRESS"
                      | "RESOLVED"
                      | "CLOSED"
                  )
                }
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => forceUpdateStatus(selectedTicket.id)}
                className="btn-primary flex-1"
              >
                Update Status
              </button>
              <button
                onClick={() => {
                  setShowForceStatusModal(false);
                  setSelectedTicket(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
