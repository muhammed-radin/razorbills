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
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm sm:text-base font-semibold">Loading Categories</p>
        </div>
      </div>
    );
  }

  const totalProducts = Object.values(productCounts).reduce(
    (n, c) => n + Number(c ?? 0),
    0,
  );

  const kpis = [
    {
      title: "Categories",
      value: categories.length,
      icon: Tags,
      tile: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      title: "Categorized products",
      value: totalProducts,
      icon: Plus,
      tile: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="container mx-auto p-0 space-y-4 sm:space-y-6 max-w-6xl">
        {loadError && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <span className="flex-1 text-destructive">{loadError}</span>
            <Button onClick={fetchAll} variant="outline" size="sm">Retry</Button>
          </div>
        )}
        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {categories.length} categories · live from database
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={fetchAll}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={openCreate}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> New category
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 max-w-xl">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <Card key={k.title}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${k.tile}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{k.title}</p>
                      <p className="text-lg sm:text-2xl font-bold tabular-nums">{k.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
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
                    <TableCell colSpan={5} className="text-center py-10 sm:py-12">
                      <p className="font-semibold text-base sm:text-lg">No categories found</p>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1">Create your first category to organize products.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow key={cat.id ?? cat._id}>
                      <TableCell className="font-mono text-primary font-semibold whitespace-nowrap">{cat.id}</TableCell>
                      <TableCell className="font-semibold whitespace-nowrap">{cat.name}</TableCell>
                      <TableCell className="tabular-nums">{productCounts[cat.id] ?? productCounts[cat.name] ?? 0}</TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">{cat.description || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end flex-wrap gap-2">
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-md max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update the category details below." : "Create a new product category."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={save} disabled={saving} className="w-full sm:w-auto">{saving ? "Saving…" : editing ? "Save Changes" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
