import { Boxes, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Table, TableBody, TableHeader, Td, Th } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { inventory, suppliers } from '../../mock/data';
import { useMemo } from 'react';

export function InventoryPage() {
  const supplierMap = useMemo(() => new Map(suppliers.map((s) => [s.id, s])), []);
  const lowStockCount = inventory.filter((item) => item.stock < item.parLevel).length;
  const totalItems = inventory.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">Inventory</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Track stock, par levels, suppliers, and purchasing needs.</p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total items" value={String(totalItems)} change="Inventory items tracked" Icon={Package} />
        <StatCard label="Low stock" value={String(lowStockCount)} change="Needs attention" Icon={AlertTriangle} />
        <StatCard label="Suppliers" value={String(suppliers.length)} change="Active vendors" Icon={Boxes} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <Th>Item</Th>
                <Th>Category</Th>
                <Th>Stock</Th>
                <Th>Par Level</Th>
                <Th>Supplier</Th>
                <Th>Status</Th>
              </tr>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const supplier = supplierMap.get(item.supplierId);
                const isLow = item.stock < item.parLevel;
                return (
                  <tr key={item.id}>
                    <Td className="font-medium text-stone-950 dark:text-stone-50">{item.name}</Td>
                    <Td>{item.category}</Td>
                    <Td>{item.stock} {item.unit}</Td>
                    <Td>{item.parLevel} {item.unit}</Td>
                    <Td>{supplier?.name || 'Unknown'}</Td>
                    <Td>
                      <Badge variant={isLow ? 'warning' : 'success'}>
                        {isLow ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </Td>
                  </tr>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}