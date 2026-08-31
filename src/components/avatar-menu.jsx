import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  User,
  MapPin,
} from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "sonner";
import AvatarIcon from "./avatar-icon";
import { decrypt } from "@/utils/crypt";
import React, { useMemo, useCallback } from "react";

const AvatarMenu = ({ name, img, user, decrypted }) => {
  const decryptedUserName = useMemo(() => {
    if (decrypted == false) return user.name;
    try {
      return decrypt(user.name) ? decrypt(user.name) : user.name; // fallback to original name if decryption fails
    } catch (e) {
      console.error("Failed to decrypt user name:", e);
      return user.name;
    }
  }, [user.name]);

  const handleLogout = useCallback(() => {
    toast.promise(
      () =>
        new Promise((resolve, reject) => {
          api.actions
            .logOut()
            .then(() => {
              resolve("Signed Out Successfully");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            })
            .catch((err) => {
              reject(err);
            });
        }),
      {
        loading: "Signing Out...",
        success: (msg) => `${msg}`,
        error: (err) =>
          `Log-out failed: ${err.response?.data?.message || err.message || "Unknown error"}`,
      },
    );
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3">
        <AvatarIcon name={name} img={img} decrypted={decrypted} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 w-72">
        <DropdownMenuItem className="py-3">
          <AvatarIcon name={name} img={img} decrypted={decrypted} />
          <div className="ml-1 flex flex-col">
            <p className="text-sm font-medium">{decryptedUserName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-1" /> My Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/cart">
            <ShoppingCart className="mr-1" /> Cart
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/order">
            <ShoppingBag className="mr-1" /> Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings2 className="mr-1" /> Preferences
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/addressbook">
            <MapPin className="mr-1" /> Addresses
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-1" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default React.memo(AvatarMenu);
