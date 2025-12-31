import { useState } from "react"
import { Button } from "@/components/ui/button"
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
} from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "sonner";
import AvatarIcon from "./avatar-icon";
import { decrypt } from "@/utils/crypt";

function AvatarMenu({ name, img, user }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3">
                <AvatarIcon name={name} img={img} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2 w-72">
                <DropdownMenuItem className="py-3">
                    <AvatarIcon name={name} img={img} />
                    <div className="ml-1 flex flex-col">
                        <p className="text-sm font-medium">{decrypt(user.name)}</p>
                        <p className="text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="mr-1" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <ShoppingCart className="mr-1" /> Cart
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <ShoppingBag className="mr-1" /> Orders
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings2 className="mr-1" /> Preferences
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    // sign out user
                    toast.promise(
                        () => new Promise((resolve, reject) => {
                            api.actions.logOut().then(() => {
                                resolve("Signed Out Successfully");
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            }).catch((err) => {
                                reject(err);
                            });
                        }),
                        {
                            loading: "Signing Out...",
                            success: (msg) => `${msg}`,
                            error: (err) => `Log-out failed: ${err.response.data.message || err.message || "Unknown error"}`,
                        }
                    )
                }}>
                    <LogOut className="mr-1" /> Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AvatarMenu;