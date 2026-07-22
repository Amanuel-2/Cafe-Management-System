import {
  Box,
  Card,
  CardHeader,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

function compareValues(left, right) {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true, sensitivity: 'base' });
}

export function DataTable({
  title,
  description,
  rows,
  columns,
  searchPlaceholder = 'Search records',
  emptyTitle = 'No records found',
  emptyDescription = 'Try changing your search or add a new record.',
  getRowId = (row) => row.id,
  initialSort,
  initialRowsPerPage = 5,
}) {
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState(initialSort?.field ?? columns[0]?.field ?? '');
  const [sortDirection, setSortDirection] = useState(initialSort?.direction ?? 'asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const filteredRows = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return rows;
    return rows.filter((row) => columns.some((column) => {
      if (column.searchable === false) return false;
      const value = column.getValue ? column.getValue(row) : row[column.field];
      return normalize(value).includes(normalizedQuery);
    }));
  }, [columns, query, rows]);

  const sortedRows = useMemo(() => {
    const column = columns.find((item) => item.field === sortField);
    if (!column) return filteredRows;
    return filteredRows
      .map((row, index) => ({ row, index }))
      .sort((left, right) => {
        const leftValue = column.getValue ? column.getValue(left.row) : left.row[column.field];
        const rightValue = column.getValue ? column.getValue(right.row) : right.row[column.field];
        const result = compareValues(leftValue, rightValue);
        return result === 0 ? left.index - right.index : sortDirection === 'asc' ? result : -result;
      })
      .map(({ row }) => row);
  }, [columns, filteredRows, sortDirection, sortField]);

  const lastPage = Math.max(0, Math.ceil(sortedRows.length / rowsPerPage) - 1);
  const safePage = Math.min(page, lastPage);
  const visibleRows = sortedRows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(0);
  };

  return (
    <Card variant="outlined">
      <CardHeader
        title={title}
        subheader={description}
        titleTypographyProps={{ variant: 'h6', fontWeight: 800 }}
        action={
          <TextField
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            size="small"
            slotProps={{
              htmlInput: { 'aria-label': searchPlaceholder },
              input: { startAdornment: <InputAdornment position="start"><Search size={18} aria-hidden="true" /></InputAdornment> },
            }}
            sx={{ width: { xs: '100%', sm: 280 } }}
          />
        }
        sx={{ alignItems: { xs: 'stretch', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, '& .MuiCardHeader-action': { m: 0 } }}
      />
      <TableContainer sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Table size="small" aria-label={title} sx={{ minWidth: 680 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} align={column.align} sx={{ minWidth: column.minWidth, fontWeight: 800, bgcolor: 'action.hover' }}>
                  {column.sortable === false ? column.header : (
                    <TableSortLabel
                      active={sortField === column.field}
                      direction={sortField === column.field ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.header}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length ? visibleRows.map((row) => (
              <TableRow hover key={getRowId(row)}>
                {columns.map((column) => {
                  const value = column.getValue ? column.getValue(row) : row[column.field];
                  return (
                    <TableCell key={column.field} align={column.align}>
                      {column.renderCell ? column.renderCell(value, row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box sx={{ py: 7, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800 }}>{emptyTitle}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{emptyDescription}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={sortedRows.length}
        page={safePage}
        onPageChange={(_event, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
