import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { orders as mockOrders } from "@/pages/orderhistory/data/order-history-1-data"
import { useOrderStore } from '@/stores/shop'
import { toast } from 'sonner'

// Accepts backend order docs; falls back to showcase rows when empty.
export function OrderHistory1({ orders: orderDocs, loading }) {
  const navigate = useNavigate();
  const cancelOrder = useOrderStore((s) => s.cancel);
  const requestReturn = useOrderStore((s) => s.requestReturn);
  const [actingId, setActingId] = useState(null);

  const hasServerOrders = Array.isArray(orderDocs) && orderDocs.length > 0;

  const handleCancel = async (id) => {
    const reason = window.prompt("Cancel reason (optional)") ?? "";
    setActingId(id);
    try {
      await cancelOrder(id, reason);
      toast.success("Cancellation requested");
    } catch {
      toast.error("Failed to request cancellation");
    } finally {
      setActingId(null);
    }
  };

  const handleReturn = async (id) => {
    const reason = window.prompt("Return reason") ?? "";
    if (!reason) return;
    setActingId(id);
    try {
      await requestReturn(id, reason);
      toast.success("Return requested");
    } catch {
      toast.error("Failed to request return");
    } finally {
      setActingId(null);
    }
  };

  if (!hasServerOrders && !loading) {
    return <ShowcaseOrders orders={mockOrders} navigate={navigate} />;
  }

  const orders = orderDocs ?? [];
  const totalAmount = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);

  return (
    <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
      <Card>
        <CardHeader className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-x-6'>
          <div>
            <CardTitle className='text-2xl'>Order History</CardTitle>
            <CardDescription className='text-balance'>View your past orders and their status</CardDescription>
          </div>
          <div className='text-muted-foreground text-end text-sm max-sm:text-start'>
            <p>Total Orders: {orders.length}</p>
            <p>Total Spent: ₹{totalAmount.toFixed(2)}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='font-semibold'>Order</TableHead>
                <TableHead className='hidden sm:table-cell text-end font-semibold'>Date</TableHead>
                <TableHead className='hidden md:table-cell text-end font-semibold'>Status</TableHead>
                <TableHead className='text-end font-semibold'>Total</TableHead>
                <TableHead className='text-end font-semibold'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id ?? order._id}>
                  <TableCell className='flex flex-col sm:flex-row sm:items-center gap-3 py-3'>
                    {(order.products?.[0]?.thumbnail) && (
                      <img
                        src={order.products[0].thumbnail}
                        alt={order.products[0].title ?? 'Product'}
                        className='w-16 h-16 rounded-md object-cover shrink-0'
                      />
                    )}
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium truncate'>{order.id ?? order._id}</p>
                      <p className='text-muted-foreground text-sm truncate'>
                        {(order.products ?? []).length} item(s)
                        {order.products?.[0]?.title ? ` • ${order.products[0].title}` : ''}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-end'>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell className='hidden md:table-cell text-end'>
                    <Badge variant='secondary'>{order.status ?? 'pending'}</Badge>
                  </TableCell>
                  <TableCell className='text-end'>₹{(order.totalAmount ?? 0).toFixed(2)}</TableCell>
                  <TableCell className='text-end'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => navigate(`/order-status?id=${order.id ?? order._id}`)}
                      >
                        Track
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        disabled={actingId === (order.id ?? order._id)}
                        onClick={() => handleCancel(order.id ?? order._id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        disabled={actingId === (order.id ?? order._id)}
                        onClick={() => handleReturn(order.id ?? order._id)}
                      >
                        Return
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className='bg-transparent'>
              <TableRow className='font-semibold hover:bg-transparent'>
                <TableCell colSpan={3}></TableCell>
                <TableCell className='text-end'>{`₹${totalAmount.toFixed(2)}`}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function ShowcaseOrders({ orders, navigate }) {
  const totalAmount = orders.reduce((sum, order) => sum + order.price, 0);

  return (
    <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
      <Card>
        <CardHeader className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-x-6'>
          <div>
            <CardTitle className='text-2xl'>Order History</CardTitle>
            <CardDescription className='text-balance'>You have no orders yet — showing a preview</CardDescription>
          </div>
          <div className='text-muted-foreground text-end text-sm max-sm:text-start'>
            <p>Total Orders: {orders.length}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='font-semibold'>Item</TableHead>
                <TableHead className='hidden sm:table-cell text-end font-semibold'>Order Date</TableHead>
                <TableHead className='hidden md:table-cell text-end font-semibold'>Quantity</TableHead>
                <TableHead className='text-end font-semibold'>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.name}>
                  <TableCell className='flex flex-col sm:flex-row sm:items-center gap-3 py-3'>
                    <img src={order.image} alt={order.name} className='w-16 h-16 rounded-md object-cover shrink-0' />
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium truncate'>{order.name}</p>
                      <p className='text-muted-foreground text-sm truncate'>{`Color: ${order.color} • Size: ${order.size}`}</p>
                      <p className='text-muted-foreground text-xs sm:hidden mt-1'>{order.orderDate}</p>
                    </div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-end'>{order.orderDate}</TableCell>
                  <TableCell className='hidden md:table-cell text-end'>{order.quantity}</TableCell>
                  <TableCell className='text-end'>${order.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className='bg-transparent'>
              <TableRow className='font-semibold hover:bg-transparent hidden md:table-row'>
                <TableCell colSpan={2}></TableCell>
                <TableCell className='text-end'>{`$${totalAmount.toFixed(2)}`}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter className='flex flex-wrap gap-4 border-t-0 bg-transparent pt-0'>
          <Button variant='default' className='h-9 px-4 py-2 cursor-pointer' onClick={() => navigate('/search')}>
            Start Shopping
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OrderHistory1
