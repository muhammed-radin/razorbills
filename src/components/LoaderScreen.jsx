import { LoaderPinwheel } from "lucide-react";

function LoaderScreen() {
    return <div className="w-screen h-screen z-40 top-0 left-0 fixed flex items-center justify-center bg-background"><LoaderPinwheel className="animate-spin" width={40} height={40}></LoaderPinwheel></div>;
}

function Preloader() {
    return <LoaderPinwheel className="animate-spin" width={40} height={40}></LoaderPinwheel>
}

export { LoaderScreen, Preloader }