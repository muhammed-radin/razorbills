import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency } from "@/utils/currency";
import { Edit2, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function ListViewAdmin({
  Badge,
  products,
  handleDelete,
  getStockStatus,
  formatCurrency,
}) {
  return (
    <Card className="overflow-auto">
      <div>
        <Table className="border-t px-6">
          <TableHeader>
            <TableRow className="*:py-3 *:first:ps-6 *:last:pe-6">
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              return (
                <TableRow
                  className="*:py-3 *:first:ps-6 *:last:pe-6"
                  key={product.title}
                >
                  <TableCell>
                    <div className="flex items-start justify-start gap-2">
                      <div className="h-10 w-10 min-h-10 max-w-10 rounded-md overflow-hidden">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-full w-full rounded-md object-cover"
                        />
                      </div>
                      <span className="ml-2">{product.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>{currency(product.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/auth/admin/products/${product.id}/edit`}
                        className="cursor-pointer"
                      >
                        <Button variant="outline">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default ListViewAdmin;
