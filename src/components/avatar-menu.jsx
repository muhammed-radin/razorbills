import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AvatarIcon from "./avatar-icon";
import { Separator } from "./ui/separator";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { set } from "zod";

function AvatarMenu({ name, img }) {

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="link" aria-label="Open menu" size="icon-sm">
                    <AvatarIcon name={name} img={img} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuLabel>Quik Actions</DropdownMenuLabel>
                <Separator />
                <DropdownMenuGroup>
                    <DropdownMenuItem >
                        My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem >
                        Cart
                    </DropdownMenuItem>
                    <DropdownMenuItem >
                        Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem >
                        Settings
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem className="text-red w-full" onClick={() => {
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
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}

export default AvatarMenu;