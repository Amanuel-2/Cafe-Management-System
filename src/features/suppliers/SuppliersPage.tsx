import { Truck, Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Table, TableBody, TableHeader, Td, Th } from '../../components/ui/Table';
import { suppliers } from '../../mock/data';

export function SuppliersPage() {
  const totalSuppliers = suppliers.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">Suppliers</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Maintain supplier contacts and purchase history.</p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Suppliers" value={String(totalSuppliers)} change="Active vendors" Icon={Truck} />
        <StatCard label="Last purchase" value="Today" change="Recent activity" Icon={Phone} />
        <StatCard label="Active contracts" value="3" change="Current agreements" Icon={User} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Directory</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <Th>Supplier</Th>
                <Th>Contact</Th>
                <Th>Phone</Th>
              </tr>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <Td className="font-medium text-stone-950 dark:text-stone-50">{supplier.name}</Td>
                  <Td>{supplier.contact}</Td>
                  <Td>{supplier.phone}</Td>
                </tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}