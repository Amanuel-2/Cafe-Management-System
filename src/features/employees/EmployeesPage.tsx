import { Users, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Table, TableBody, TableHeader, Td, Th } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { employeeService } from '../../services/employeeService';

export function EmployeesPage() {
  const employees = employeeService.list();
  const activeCount = employees.filter((e) => e.status === 'active').length;
  const totalEmployees = employees.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">Employee Management</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Manage staff profiles, roles, shifts, and access.</p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total staff" value={String(totalEmployees)} change="Team members" Icon={Users} />
        <StatCard label="Active" value={String(activeCount)} change="On shift today" Icon={UserCheck} />
        <StatCard label="Off duty" value={String(totalEmployees - activeCount)} change="Not scheduled" Icon={UserX} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <Th>Employee</Th>
                <Th>Role</Th>
                <Th>Email</Th>
                <Th>Status</Th>
              </tr>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={employee.name} />
                      <span className="font-medium text-stone-950 dark:text-stone-50">{employee.name}</span>
                    </div>
                  </Td>
                  <Td>{employee.role}</Td>
                  <Td>{employee.email}</Td>
                  <Td>
                    <Badge variant={employee.status === 'active' ? 'success' : 'neutral'}>
                      {employee.status}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
