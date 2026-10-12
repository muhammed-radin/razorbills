import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tags, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { categoriesApi, productsApi } from "@/services/shop";

const emptyForm = { id: "", name: "", icon: "", Logo: "", description: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const [cats, prods] = await Promise.allSettled([
        // realtime: bypass server memory cache + browser 304s after writes.
        categoriesApi.list({ realtime: "true" }),
        productsApi.list({ limit: 500, realtime: "true" }),
      ]);
      if (cats.status === "fulfilled") {
        const list = Array.isArray(cats.value) ? cats.value : (cats.value?.categories ?? []);
        setCategories(Array.isArray(list) ? list : []);
      } else {
        throw cats.reason;
      }
      if (prods.status === "fulfilled") {
        const list = prods.value?.products ?? (Array.isArray(prods.value) ? prods.value : []);
        const counts = {};
        for (const p of list) {
          const c = p?.category ?? "uncategorized";
          counts[c] = (counts[c] ?? 0) + 1;
        }
        setProductCounts(counts);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setLoadError(
        error?.response?.status === 403
          ? "Admin access required to view categories."
          : "Could not load categories. Check the connection and retry.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      id: cat.id ?? "",
      name: cat.name ?? "",
      icon: cat.icon ?? "",
      Logo: cat.Logo ?? "",
      description: cat.description ?? "",
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.id.trim() || !form.name.trim()) {
      toast.error("ID and name are required");
      return;
    }
    if (saving) return;
    try {
      setSaving(true);
      if (editing) {
        await categoriesApi.update(editing.id, {
          name: form.name.trim(),
          icon: form.icon,
          Logo: form.Logo,
          description: form.description,
        });
        toast.success("Category updated");
      } else {
        await categoriesApi.create({
          id: form.id.trim().toLowerCase().replace(/\s+/g, "-"),
          name: form.name.trim(),
          icon: form.icon,
          Logo: form.Logo,
          description: form.description,
        });
        toast.success("Category created");
      }
      setDialogOpen(false);
      await fetchAll();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error?.response?.data?.error ?? "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (cat) => {
    const refs = productCounts[cat.id] ?? productCounts[cat.name] ?? 0;
    if (refs > 0 && !window.confirm(`"${cat.name}" is referenced by ${refs} product(s). Delete anyway?`)) return;
    if (refs === 0 && !window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      setDeletingId(cat.id);
      await categoriesApi.remove(cat.id);
      toast.success("Category deleted");
      await fetchAll();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error?.response?.data?.error ?? "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="font-semibold">Loading Categories</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {loadError && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <span className="flex-1 text-destructive">{loadError}</span>
            <Button onClick={fetchAll} variant="outline" size="sm">Retry</Button>
          </div>
        )}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600 p-4 sm:p-6 md:p-8 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Tags className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
                <p className="text-white/80 text-sm mt-1">{categories.length} categories · live from database</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={fetchAll} className="bg-white/20 text-white hover:bg-white/30 border-0">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <Button onClick={openCreate} className="bg-white text-purple-700 hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" /> New Category
              </Button>
            </div>
          </div>
        </div>

        <Card className="border-2 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Products</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <p className="font-semibold text-lg">No categories found</p>
                      <p className="text-muted-foreground text-sm">Create your first category to organize products.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow key={cat.id ?? cat._id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-primary font-semibold">{cat.id}</TableCell>
                      <TableCell className="font-semibold">{cat.name}</TableCell>
                      <TableCell>{productCounts[cat.id] ?? productCounts[cat.name] ?? 0}</TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">{cat.description || "—"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(cat)}>
                          <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={deletingId === cat.id}
                          onClick={() => remove(cat)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          {deletingId === cat.id ? "Deleting…" : "Delete"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update the category details below." : "Create a new product category."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>ID {editing && "(locked)"}</Label>
                <Input
                  value={form.id}
                  disabled={!!editing}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  placeholder="e.g. microcontrollers"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Microcontrollers"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Icon</Label>
                  <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="icon name/url" />
                </div>
                <div className="space-y-1.5">
                  <Label>Logo</Label>
                  <Input value={form.Logo} onChange={(e) => setForm({ ...form, Logo: e.target.value })} placeholder="logo url" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What belongs in this category?" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Save Changes" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
