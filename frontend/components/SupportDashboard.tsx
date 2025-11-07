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

interface SupportDashboardProps {
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

export default function SupportDashboard({ user, token, logout }: SupportDashboardProps) {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<"OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED">("IN_PROGRESS");
  const [newComment, setNewComment] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  const fetchAssignedTickets = async () => {
    if (!token) {
      console.error("No token available");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(
        "http://localhost:8080/api/tickets/assigned",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTickets(data.content || []);
      } else if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
      } else {
        toast.error("Failed to fetch assigned tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch assigned tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: number, status: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/tickets/${ticketId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast.success("Ticket status updated successfully!");
        fetchAssignedTickets();
        setShowStatusModal(false);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        toast.error(errorData.error || "Failed to update ticket status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  const addComment = async (ticketId: number) => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/tickets/${ticketId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (response.ok) {
        toast.success("Comment added successfully!");
        setNewComment("");
        setShowCommentModal(false);
        fetchAssignedTickets();
      } else {
        toast.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const assignedTickets = tickets.filter(t => t.assignee?.id === user.id);
  const inProgressTickets = assignedTickets.filter(t => t.status === "IN_PROGRESS");
  const resolvedTickets = assignedTickets.filter(t => t.status === "RESOLVED");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Support Agent Dashboard
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900">Assigned to Me</h3>
            <p className="text-3xl font-bold text-blue-600">{assignedTickets.length}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-600">{inProgressTickets.length}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900">Resolved</h3>
            <p className="text-3xl font-bold text-green-600">{resolvedTickets.length}</p>
          </div>
        </div>

        {/* Assigned Tickets Queue */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">My Assigned Tickets</h3>
          {assignedTickets.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No tickets assigned to you yet.
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
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedTickets.map((ticket) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
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
                            setShowCommentModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Add Comment
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setNewStatus(ticket.status);
                            setShowStatusModal(true);
                          }}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          Change Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Status Update Modal */}
      {showStatusModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Change Ticket Status
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                className="input-field w-full"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  updateTicketStatus(selectedTicket.id, newStatus);
                }}
                className="btn-primary flex-1"
              >
                Update Status
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false);
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

      {/* Add Comment Modal */}
      {showCommentModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Comment to Ticket
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                className="input-field w-full"
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => addComment(selectedTicket.id)}
                className="btn-primary flex-1"
              >
                Add Comment
              </button>
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedTicket(null);
                  setNewComment("");
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

