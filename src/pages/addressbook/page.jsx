import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

// Sample addresses data
const sampleAddresses = [
  {
    id: 1,
    name: "John Doe",
    phone: "+91 9876543210",
    type: "home",
    address: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    isDefault: true,
  },
  {
    id: 2,
    name: "John Doe",
    phone: "+91 9876543211",
    type: "work",
    address: "Tech Park, Building A, Floor 5",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    isDefault: false,
  },
  {
    id: 3,
    name: "John Doe",
    phone: "+91 9876543212",
    type: "other",
    address: "456 Oak Avenue, Near Central Park",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    isDefault: false,
  },
];

const AddressBookPage = () => {
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState(sampleAddresses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    type: "home",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddAddress = () => {
    const address = {
      ...newAddress,
      id: Date.now(),
      isDefault: addresses.length === 0 ? true : newAddress.isDefault,
    };
    
    if (address.isDefault) {
      setAddresses(
        addresses.map((addr) => ({ ...addr, isDefault: false })).concat(address)
      );
    } else {
      setAddresses([...addresses, address]);
    }
    
    setNewAddress({
      name: "",
      phone: "",
      type: "home",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditAddress = () => {
    if (!selectedAddress) return;

    let updatedAddresses = addresses.map((addr) =>
      addr.id === selectedAddress.id ? selectedAddress : addr
    );

    if (selectedAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) =>
        addr.id === selectedAddress.id
          ? addr
          : { ...addr, isDefault: false }
      );
    }

    setAddresses(updatedAddresses);
    setIsEditDialogOpen(false);
    setSelectedAddress(null);
  };

  const handleDeleteAddress = () => {
    if (!selectedAddress) return;

    const remainingAddresses = addresses.filter(
      (addr) => addr.id !== selectedAddress.id
    );

    // If deleted address was default, make the first one default
    if (selectedAddress.isDefault && remainingAddresses.length > 0) {
      remainingAddresses[0].isDefault = true;
    }

    setAddresses(remainingAddresses);
    setIsDeleteDialogOpen(false);
    setSelectedAddress(null);
  };

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
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
        return "Home";
      case "work":
        return "Work";
      default:
        return "Other";
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
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/settings">Settings</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Address Book</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 transition-all duration-500",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
                  Address Book
                </h1>
                <p className="text-muted-foreground">
                  Manage your delivery addresses
                </p>
              </div>
            </div>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="transition-all duration-300 hover:shadow-lg group">
                <Plus className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPinned className="w-5 h-5 text-primary" />
                  Add New Address
                </DialogTitle>
                <DialogDescription>
                  Add a new delivery address to your account
                </DialogDescription>
              </DialogHeader>
              <AddressForm
                address={newAddress}
                setAddress={setNewAddress}
                onSubmit={handleAddAddress}
                submitLabel="Add Address"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Address List */}
        {addresses.length === 0 ? (
          <Card
            className={cn(
              "text-center py-16 transition-all duration-500 delay-200",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <CardContent>
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                <MapPin className="absolute inset-0 m-auto w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                No Addresses Yet
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You haven't added any delivery addresses yet. Add your first
                address to make checkout faster!
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                size="lg"
                className="transition-all duration-300 hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
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
                  address.isDefault && "ring-2 ring-primary/50"
                )}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Default
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
                            : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
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
                        {address.address}, {address.city}, {address.state} -{" "}
                        {address.pincode}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 shrink-0" />
                      <p>{address.phone}</p>
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
                        Edit
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
                        Delete
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
                        Set as Default
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
                  : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${(addresses.length + 1) * 100}ms` }}
              onClick={() => setIsAddDialogOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground group-hover:text-primary transition-colors duration-300">
                <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-all duration-300 mb-4">
                  <Plus className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" />
                </div>
                <p className="font-medium">Add New Address</p>
                <p className="text-sm">Click to add a new delivery address</p>
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
                Edit Address
              </DialogTitle>
              <DialogDescription>
                Update your delivery address details
              </DialogDescription>
            </DialogHeader>
            {selectedAddress && (
              <AddressForm
                address={selectedAddress}
                setAddress={setSelectedAddress}
                onSubmit={handleEditAddress}
                submitLabel="Save Changes"
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
                Delete Address
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this address? This action cannot
                be undone.
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
                      Default
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
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAddress}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Address
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
  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="Enter full name"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Address Type</Label>
        <Select
          value={address.type}
          onValueChange={(value) => setAddress({ ...address, type: value })}
        >
          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20">
            <SelectValue placeholder="Select address type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </div>
            </SelectItem>
            <SelectItem value="work">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Work
              </div>
            </SelectItem>
            <SelectItem value="other">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Other
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Street Address</Label>
        <Textarea
          id="address"
          placeholder="Enter street address, apartment, building, etc."
          value={address.address}
          onChange={(e) => setAddress({ ...address, address: e.target.value })}
          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 min-h-[80px]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Enter city"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="Enter state"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">PIN Code</Label>
          <Input
            id="pincode"
            placeholder="Enter PIN code"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
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
