import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Building2,
  Briefcase,
  Check,
  Star,
  ArrowLeft,
  Phone,
  User,
  X,
  MapPinned,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAddressStore, AddressMold } from "@/stores/shop";
import { Preloader } from "@/components/LoaderScreen";

const normalizeAddress = (addr) => ({
  id: addr._id ?? addr.id,
  name: addr.name ?? "",
  phoneNumber: addr.phoneNumber ?? addr.phone ?? "",
  type: addr.type ?? "other",
  street: addr.address ?? addr.street ?? "",
  city: addr.city ?? "",
  state: addr.state ?? "",
  postalCode: addr.postalCode ?? addr.pincode ?? addr.pinCode ?? "",
  isDefault: Boolean(addr.isDefault),
  raw: addr,
});

const AddressBookPage = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const storeAddresses = useAddressStore((s) => s.addresses);
  const fetchAddresses = useAddressStore((s) => s.fetch);
  const addAddress = useAddressStore((s) => s.add);
  const isLoading = useAddressStore((s) => s.loading);
  const setDefaultAddress = useAddressStore((s) => s.setDefault);
  const [addresses, setAddresses] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phoneNumber: "",
    type: "home",
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    setMounted(true);
    fetchAddresses().catch(() => {});
  }, [fetchAddresses]);

  useEffect(() => {
    setAddresses(storeAddresses.map(normalizeAddress));
  }, [storeAddresses]);

  const handleAddAddress = async () => {
    try {
      await addAddress({
        ...newAddress,
      });
      toast.success(t("address.added", { defaultValue: "Address added" }));
    } catch {
      toast.error(t("common.error", { defaultValue: "Failed to add address" }));
      return;
    }
    setNewAddress({
      name: "",
      phoneNumber: "",
      type: "home",
      street: "",
      city: "",
      state: "",
      postalCode: "",
    });
    setIsAddDialogOpen(false);
    fetchAddresses().catch((err) => {
      toast.error(
        t("common.error", { defaultValue: "Failed to fetch addresses" }),
      );
    });
  };

  const handleEditAddress = () => {
    // Backend has no update-address endpoint yet — apply locally.
    if (!selectedAddress) return;

    let updatedAddresses = addresses.map((addr) =>
      addr.id === selectedAddress.id ? selectedAddress : addr,
    );

    setAddresses(updatedAddresses);
    setIsEditDialogOpen(false);
    setSelectedAddress(null);
    toast.promise(
      () =>
        new Promise((resolve, reject) => {
          useAddressStore
            .getState()
            .update(selectedAddress)
            .then(async () => {
              await useAddressStore.getState().fetch();
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        }),
      {
        loading: t("address.updating", { defaultValue: "Updating address..." }),
        success: t("address.updated", { defaultValue: "Address updated" }),
        error: t("common.error", { defaultValue: "Failed to update address" }),
      },
    );
  };

  const handleDeleteAddress = () => {
    // Backend has no delete-address endpoint yet — remove locally.
    if (!selectedAddress) return;

    const remainingAddresses = addresses.filter(
      (addr) => addr.id !== selectedAddress.id,
    );

    setIsDeleteDialogOpen(false);
    setSelectedAddress(null);
    toast.promise(
      () =>
        new Promise((resolve, reject) => {
          useAddressStore
            .getState()
            .delete(selectedAddress.id)
            .then(async () => {
              await useAddressStore.getState().fetch();
              resolve();
            })
            .catch((error) => {
              console.error("Error deleting address:", error);
              reject(error);
            });
        }),
      {
        loading: t("address.deleting", { defaultValue: "Deleting address..." }),
        success: t("address.deleted", { defaultValue: "Address deleted" }),
        error: t("common.error", { defaultValue: "Failed to delete address" }),
      },
    );
  };

  const handleSetDefault = async (id) => {
    const address = addresses.find((addr) => addr.id === id);
    if (!address) return;
    try {
      await setDefaultAddress(address.raw ?? address);
      await fetchAddresses();
      toast.success(
        t("address.defaultSet", { defaultValue: "Default address updated" }),
      );
    } catch {
      // Fall back to local state when the API call fails
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        })),
      );
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "home":
        return <Home className="w-4 h-4" />;
      case "work":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "home":
        return t("address.typeHome");
      case "work":
        return t("address.typeWork");
      default:
        return t("address.typeOther");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">{t("footer.home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/settings">{t("settings.title")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("address.title")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 transition-all duration-500",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {t("address.title")}
                </h1>
                <p className="text-muted-foreground">{t("address.subtitle")}</p>
              </div>
            </div>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="transition-all duration-300 hover:shadow-lg group">
                <Plus className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                {t("address.addNew")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPinned className="w-5 h-5 text-primary" />
                  {t("address.addNew")}
                </DialogTitle>
                <DialogDescription>{t("address.addNewDesc")}</DialogDescription>
              </DialogHeader>
              <AddressForm
                address={newAddress}
                setAddress={setNewAddress}
                onSubmit={handleAddAddress}
                submitLabel={t("address.submitAdd")}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Address List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Preloader />
          </div>
        ) : addresses.length === 0 ? (
          <Card
            className={cn(
              "text-center py-16 transition-all duration-500 delay-200",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            <CardContent>
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                <MapPin className="absolute inset-0 m-auto w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("address.noAddresses")}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t("address.noAddressesDesc")}
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                size="lg"
                className="transition-all duration-300 hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("address.addFirstAddress")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address, index) => (
              <Card
                key={address.id}
                className={cn(
                  "group relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:border-primary/30",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4",
                  address.isDefault && "ring-2 ring-primary/50",
                )}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {t("common.default")}
                    </div>
                  </div>
                )}

                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-all duration-300",
                          address.type === "home"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : address.type === "work"
                              ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                        )}
                      >
                        {getTypeIcon(address.type)}
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-1">
                          {getTypeLabel(address.type)}
                        </Badge>
                        <h3 className="font-semibold text-foreground">
                          {address.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>
                        {address.street}, {address.city}, {address.state} -{" "}
                        {address.postalCode}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 shrink-0" />
                      <p>{address.phoneNumber}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                        onClick={() => {
                          setSelectedAddress({ ...address });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        {t("common.edit")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                        onClick={() => {
                          setSelectedAddress(address);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        {t("common.delete")}
                      </Button>
                    </div>
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10 transition-all duration-300"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {t("address.setDefault")}
                      </Button>
                    )}
                  </div>
                </CardContent>

                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            ))}

            {/* Add New Address Card */}
            <Card
              className={cn(
                "group cursor-pointer border-dashed border-2 hover:border-primary transition-all duration-500 hover:shadow-md",
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
              style={{ transitionDelay: `${(addresses.length + 1) * 100}ms` }}
              onClick={() => setIsAddDialogOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground group-hover:text-primary transition-colors duration-300">
                <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-all duration-300 mb-4">
                  <Plus className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" />
                </div>
                <p className="font-medium">{t("address.addNew")}</p>
                <p className="text-sm">{t("address.addNewDesc")}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                {t("address.editAddress")}
              </DialogTitle>
              <DialogDescription>
                {t("address.editAddressDesc")}
              </DialogDescription>
            </DialogHeader>
            {selectedAddress && (
              <AddressForm
                address={selectedAddress}
                setAddress={setSelectedAddress}
                onSubmit={handleEditAddress}
                submitLabel={t("address.submitEdit")}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                {t("address.deleteAddress")}
              </DialogTitle>
              <DialogDescription>
                {t("address.deleteConfirm")}
              </DialogDescription>
            </DialogHeader>
            {selectedAddress && (
              <div className="my-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(selectedAddress.type)}
                  <span className="font-medium">
                    {getTypeLabel(selectedAddress.type)}
                  </span>
                  {selectedAddress.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      {t("common.default")}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.address}, {selectedAddress.city}
                </p>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button variant="destructive" onClick={handleDeleteAddress}>
                <Trash2 className="w-4 h-4 mr-2" />
                {t("address.deleteAddress")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Address Form Component
const AddressForm = ({ address, setAddress, onSubmit, submitLabel }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("address.fullName")}</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder={t("address.fullNamePlaceholder")}
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("address.phone")}</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder={t("address.phonePlaceholder")}
              value={address.phoneNumber}
              onChange={(e) =>
                setAddress({ ...address, phoneNumber: e.target.value })
              }
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">{t("address.addressType")}</Label>
        <Select
          value={address.type}
          onValueChange={(value) => setAddress({ ...address, type: value })}
        >
          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20">
            <SelectValue placeholder={t("address.selectType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                {t("address.typeHome")}
              </div>
            </SelectItem>
            <SelectItem value="work">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t("address.typeWork")}
              </div>
            </SelectItem>
            <SelectItem value="other">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {t("address.typeOther")}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t("address.streetAddress")}</Label>
        <Textarea
          id="address"
          placeholder={t("address.streetAddressPlaceholder")}
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 min-h-[80px]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">{t("address.city")}</Label>
          <Input
            id="city"
            placeholder={t("address.cityPlaceholder")}
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">{t("address.state")}</Label>
          <Input
            id="state"
            placeholder={t("address.statePlaceholder")}
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">{t("address.pinCode")}</Label>
          <Input
            id="pincode"
            placeholder={t("address.pinCodePlaceholder")}
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <DialogFooter className="pt-4">
        <Button
          type="submit"
          onClick={onSubmit}
          className="w-full sm:w-auto transition-all duration-300 hover:shadow-lg"
        >
          <Check className="w-4 h-4 mr-2" />
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AddressBookPage;
