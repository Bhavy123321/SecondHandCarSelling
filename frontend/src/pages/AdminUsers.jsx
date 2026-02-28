import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2, UserCircle, Shield, Search, Plus, X, Pencil } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [editingUserId, setEditingUserId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "", // Only used for create
    phone: "",
    role: "Buyer",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/User");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`))
      return;

    try {
      await api.delete(`/User/${userId}`);
      setUsers(users.filter((u) => u.userId !== userId));
      alert(`User "${userName}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingUserId(null);
    setFormData({ userName: "", email: "", password: "", phone: "", role: "Buyer" });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setEditingUserId(user.userId);
    setFormData({
      userName: user.userName,
      email: user.email,
      password: "", // Not updated directly here, or kept empty
      phone: user.phone || "",
      role: user.role,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      if (modalMode === "create") {
        await api.post("/User", formData);
        // Refetch to get the new user with the generated ID
        await fetchUsers();
      } else {
        const payload = {
          userName: formData.userName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role
        };
        await api.put(`/User/${editingUserId}`, payload);
        await fetchUsers(); // Refresh to reflect changes
      }
      closeModal();
    } catch (error) {
      console.error("Error saving user", error);
      if (error.response && error.response.data && error.response.data.message) {
        setFormError(error.response.data.message);
      } else {
        setFormError("Failed to save user. Please check your inputs.");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return <Badge variant="destructive">Admin</Badge>;
      case "Seller":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          >
            Seller
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="border-green-200 text-green-700 bg-green-50 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
          >
            Buyer
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage platform users and roles.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={openCreateModal} className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add User</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>
            Total {users.length} registered accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserCircle className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-medium">{user.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span>{user.email}</span>
                            <span className="text-muted-foreground text-xs">
                              {user.phone || "No phone"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.createdDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => openEditModal(user)}
                              title="Edit User"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                handleDelete(user.userId, user.userName)
                              }
                              title="Delete User"
                              disabled={user.role === "Admin" && user.userName === "admin"} // Prevent deleting root admin
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No users found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Modal for Create/Edit using Tailwind */}
      {
        isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">
                  {modalMode === "create" ? "Add New User" : "Edit User"}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeModal} className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto">
                <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {formError}
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Username</label>
                    <Input
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      required
                      placeholder="johndoe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  {modalMode === "create" && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Password</label>
                      <Input
                        name="password"
                        type="text"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Secure password"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Buyer">Buyer</option>
                      <option value="Seller">Seller</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="p-4 border-t bg-muted/20 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeModal} disabled={formLoading}>
                  Cancel
                </Button>
                <Button type="submit" form="user-form" disabled={formLoading}>
                  {formLoading ? "Saving..." : "Save User"}
                </Button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default AdminUsers;
