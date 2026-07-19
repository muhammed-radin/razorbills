import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function GridViewAdmin({
  products,
  handleDelete,
  getStockStatus,
  formatCurrency,
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const stockStatus = getStockStatus(product.stock);
        return (
          <Card
            key={product.id}
            className="group overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Discount Badge */}
              {product.originalPrice > product.price && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-destructive text-destructive-foreground border-0 shadow-lg">
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100,
                    )}
                    % OFF
                  </Badge>
                </div>
              )}
              {/* Stock Status Indicator */}
              <div className="absolute top-3 right-3">
                <div
                  className={`h-3 w-3 rounded-full ${stockStatus.color} ring-2 ring-background shadow-lg`}
                ></div>
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="shadow-lg"
                    asChild
                  >
                    <Link to={`/product/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="shadow-lg"
                    asChild
                  >
                    <Link to={`/admin/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="shadow-lg"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="text-xs font-normal">
                  {product.category}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {product.sku}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              </div>
              <div className="flex items-end justify-between pt-2 border-t">
                <div>
                  <div className="text-xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-2 w-2 rounded-full ${stockStatus.color}`}
                    ></div>
                    <span className="text-sm font-medium">{product.stock}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {stockStatus.label}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default GridViewAdmin;
