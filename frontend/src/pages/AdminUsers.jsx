import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2, UserCircle, Shield, Search } from "lucide-react";
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
    } catch (error) {
      console.error("Error deleting user", error);
      alert("Failed to delete user");
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
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              handleDelete(user.userId, user.userName)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  );
};

export default AdminUsers;
