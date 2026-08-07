import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function ListViewAdmin({
  Badge,
  products,
  handleDelete,
  getStockStatus,
  formatCurrency,
}) {
  return (
    <Card className="overflow-hidden">
      <div className="divide-y">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <div
              key={product.id}
              className="flex items-center gap-6 p-4 hover:bg-muted/50 transition-colors group"
            >
              <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {product.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{product.brand}</span>
                  <span className="font-mono">{product.sku}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(product.price)}
                </div>
                {product.originalPrice > product.price && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${stockStatus.color}`}
                ></div>
                <div className="text-right">
                  <div className="font-medium">{product.stock}</div>
                  <div className="text-xs text-muted-foreground">
                    {stockStatus.label}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/product/${product.id}`}
                      className="flex items-center"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Product
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/auth/admin/products/${product.id}/edit`}
                      className="flex items-center"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Product
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Product
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default ListViewAdmin;
