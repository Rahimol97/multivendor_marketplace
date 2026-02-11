import { useEffect, useState } from "react";
import api from "../../../api";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/admin/contact");
      setMessages(res.data);
    } catch (err) {
      console.error("Error loading messages");
    }
  };

  const markRead = async (id) => {
    await api.put(`/admin/contact/${id}/read`);
    fetchMessages();
  };

  const deleteMsg = async (id) => {
    if (window.confirm("Delete this message?")) {
      await api.delete(`/admin/contact/${id}`);
      fetchMessages();
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-6 bg-(--light-bg) min-h-screen">
      <h1 className="text-2xl font-bold text-(--dark-teal) mb-6">Contact Messages</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-(--mid-teal) text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg._id} className="border-b last:border-0 border-b-slate-100 hover:bg-gray-50 text-center">
                <td className="p-3">{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.subject}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
                    msg.status === "new" ? "bg-red-100 text-red-600" :
                    msg.status === "read" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {msg.status}
                  </span>
                </td>
                <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => markRead(msg._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={() => deleteMsg(msg._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {messages.length === 0 && (
          <p className="text-center p-6 text-gray-500">No messages yet</p>
        )}
      </div>
    </div>
  );
}
