import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, Edit, Trash2, Tag, Flag, AlertCircle, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState("brands"); // 'brands' or 'status'

    const [brands, setBrands] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
    const [editingItem, setEditingItem] = useState(null);

    // Generic Form Data
    const [formData, setFormData] = useState({ name: "" });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [brandsRes, statusesRes] = await Promise.all([
                api.get("/CarBrands"),
                api.get("/CarStatus"),
            ]);
            setBrands(brandsRes.data);
            setStatuses(statusesRes.data);
        } catch (err) {
            console.error("Error fetching admin settings data", err);
            setError("Failed to load reference data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Modal Handlers
    const openModal = (mode, item = null) => {
        setModalMode(mode);
        setFormError(null);
        if (mode === "edit" && item) {
            setEditingItem(item);
            setFormData({ name: activeTab === "brands" ? item.brandName : item.statusName });
        } else {
            setEditingItem(null);
            setFormData({ name: "" });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: "" });
    };

    const handleInputChange = (e) => {
        setFormData({ name: e.target.value });
    };

    // Submit Handler for Both Tabs
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setFormError("Name field is required.");
            return;
        }

        setFormLoading(true);
        setFormError(null);

        const isBrand = activeTab === "brands";
        const endpoint = isBrand ? "/CarBrands" : "/CarStatus";
        const payload = isBrand ? { brandName: formData.name } : { statusName: formData.name };

        try {
            if (modalMode === "create") {
                await api.post(endpoint, payload);
            } else {
                const id = isBrand ? editingItem.brandId : editingItem.statusId;
                await api.put(`${endpoint}/${id}`, payload);
            }
            await fetchData(); // Refresh list
            closeModal();
        } catch (err) {
            console.error("Save error", err);
            if (err.response?.data?.message) {
                setFormError(err.response.data.message);
            } else {
                setFormError(`Failed to save ${isBrand ? 'brand' : 'status'}.`);
            }
        } finally {
            setFormLoading(false);
        }
    };

    // Delete Handler
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This might fail if records exist using it.`)) {
            return;
        }

        const endpoint = isBrand ? "/CarBrands" : "/CarStatus";

        try {
            await api.delete(`${endpoint}/${id}`);
            await fetchData();
        } catch (err) {
            console.error("Delete error", err);
            alert(`Failed to delete. It might be referenced by existing cars.`);
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={fetchData}>Retry</Button>
            </div>
        );
    }

    const isBrand = activeTab === "brands";
    const currentList = isBrand ? brands : statuses;
    const entityLabel = isBrand ? "Brand" : "Status";

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h1 className="text-3xl font-black tracking-tight">System Settings</h1>
                <p className="text-muted-foreground">Manage platform reference data like vehicle brands and statuses.</p>
            </div>

            <div className="flex space-x-2 border-b">
                <button
                    onClick={() => setActiveTab("brands")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "brands"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                >
                    <Tag className="h-4 w-4" />
                    Car Brands
                </button>
                <button
                    onClick={() => setActiveTab("status")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "status"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                >
                    <Flag className="h-4 w-4" />
                    Car Statuses
                </button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle>{isBrand ? "Vehicle Brands" : "Listing Statuses"}</CardTitle>
                        <CardDescription>
                            {isBrand
                                ? `Manage the ${brands.length} available manufacturers dropdown.`
                                : `Manage the ${statuses.length} vehicle tracking statuses.`}
                        </CardDescription>
                    </div>
                    <Button onClick={() => openModal("create")} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add {entityLabel}
                    </Button>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : currentList.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>{entityLabel} Name</TableHead>
                                        <TableHead>Created Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentList.map((item) => {
                                        const id = isBrand ? item.brandId : item.statusId;
                                        const name = isBrand ? item.brandName : item.statusName;
                                        return (
                                            <TableRow key={id}>
                                                <TableCell className="font-medium text-muted-foreground">#{id}</TableCell>
                                                <TableCell className="font-bold">{name}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(item.createdDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openModal("edit", item)}
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(id, name)}
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground border rounded-md border-dashed">
                            <div className="flex justify-center mb-4">
                                {isBrand ? <Tag className="h-8 w-8 opacity-20" /> : <Flag className="h-8 w-8 opacity-20" />}
                            </div>
                            <p>No {activeTab} found in the database.</p>
                            <Button variant="link" onClick={() => openModal("create")}>
                                Create your first {entityLabel.toLowerCase()}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reusable Modal for Forms */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-card/95 border border-border/45 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col premium-glow-primary animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-5 border-b border-border/40">
                            <h2 className="text-base font-bold text-foreground/90">
                                {modalMode === "create" ? `Add New ${entityLabel}` : `Edit ${entityLabel}`}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={closeModal} className="h-8 w-8 rounded-full hover:bg-muted/80">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-5 space-y-4">
                            <form id="settings-form" onSubmit={handleSubmit} className="space-y-4">
                                {formError && (
                                    <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/35 rounded-xl">
                                        {formError}
                                    </div>
                                )}
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-semibold text-foreground/80">{entityLabel} Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={`Enter ${entityLabel.toLowerCase()} name`}
                                        autoFocus
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-border/40 bg-muted/15 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={closeModal} disabled={formLoading} className="font-bold">
                                Cancel
                            </Button>
                            <Button type="submit" form="settings-form" disabled={formLoading} className="font-bold">
                                {formLoading ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
