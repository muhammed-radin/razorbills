import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

function HeroHeader({
  title,
  description,
  actionButtonText,
  actionButtonLink,
}) {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground shadow-2xl">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl"></div>
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Products</h1>
          <p className="text-primary-foreground/80 text-lg">
            Manage your product inventory and listings
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
        >
          <Link to="/auth/admin/products/new">
            <Plus className="mr-2 h-5 w-5" />
            Add Product
          </Link>
        </Button>
      </div>
    </header>
  );
}

export default HeroHeader;
