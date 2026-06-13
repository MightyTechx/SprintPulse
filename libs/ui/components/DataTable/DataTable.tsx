import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useStyles } from './styles';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  title?: string;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  onDelete?: (selectedRows: T[]) => void;
  onBulkAction?: (action: string, selectedRows: T[]) => void;
  searchable?: boolean;
  initialRowsPerPage?: number;
  elevation?: number;
  activeRowKey?: T[keyof T];
  pinnedRows?: T[];
}

type Order = 'asc' | 'desc';

// ─── Memoized Table Row ────────────────────────────────────────────────────────

interface TableRowCellProps<T> {
  column: Column<T>;
  value: unknown;
  row: T;
}

const TableRowCell = <T extends object>({ column, value, row }: TableRowCellProps<T>) => {
  return (
    <TableCell
      align='center'
      sx={{
        py: 1,
        px: 0.75,
        textAlign: 'center',
        '& p': { fontSize: '13px', textAlign: 'center' },
      }}
    >
      {column.format
        ? (column.format as (value: unknown, row: T) => React.ReactNode)(value, row)
        : String(value ?? '')}
    </TableCell>
  );
};

TableRowCell.displayName = 'TableRowCell';

// ─── Main DataTable Component ──────────────────────────────────────────────────

export function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  title,
  selectable = false,
  onRowClick,
  onDelete,
  searchable = true,
  initialRowsPerPage = 10,
  elevation = 1,
  activeRowKey,
}: DataTableProps<T>) {
  const { classes, cx } = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [orderBy, setOrderBy] = useState<keyof T | string>('');
  const [order, setOrder] = useState<Order>('asc');
  const [selected, setSelected] = useState<Set<T[keyof T]>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Reset to first page when data changes
  useEffect(() => {
    setPage(0);
  }, [data]);

  // Memoized callbacks with stable references
  const handleRequestSort = useCallback((property: keyof T | string) => {
    setOrderBy((prev) => {
      const isAsc = prev === property;
      setOrder(isAsc ? 'desc' : 'asc');
      return property;
    });
  }, []);

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = new Set(data.map((row) => row[rowKey]));
        setSelected(newSelected);
        return;
      }
      setSelected(new Set());
    },
    [data, rowKey],
  );

  const handleClick = useCallback(
    (row: T) => {
      if (selectable) {
        const id = row[rowKey];
        setSelected((prev) => {
          const newSelected = new Set(prev);
          if (newSelected.has(id)) {
            newSelected.delete(id);
          } else {
            newSelected.add(id);
          }
          return newSelected;
        });
      }
      if (onRowClick) {
        onRowClick(row);
      }
    },
    [selectable, rowKey, onRowClick],
  );

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [],
  );

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      const selectedRows = data.filter((row) => selected.has(row[rowKey]));
      onDelete(selectedRows);
      setSelected(new Set());
    }
  }, [onDelete, data, selected, rowKey]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0);
  }, []);

  // Memoized derived state
  const isSelected = useCallback((id: T[keyof T]) => selected.has(id), [selected]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.id as keyof T];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      }),
    );
  }, [data, searchQuery, columns]);

  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy as keyof T];
      const bValue = b[orderBy as keyof T];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return order === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, order, orderBy]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // Memoized header cells
  const headerCells = useMemo(
    () =>
      columns.map((column) => (
        <TableCell
          key={String(column.id)}
          align='center'
          className={classes.tableCell}
          style={column.minWidth ? { minWidth: column.minWidth } : undefined}
        >
          {column.sortable !== false ? (
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={() => handleRequestSort(column.id)}
              sx={{
                justifyContent: 'center',
                '& .MuiTableSortLabel-icon': {
                  ml: 0.5,
                },
              }}
            >
              {column.label}
            </TableSortLabel>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              {column.label}
            </Box>
          )}
        </TableCell>
      )),
    [columns, classes.tableCell, orderBy, order, handleRequestSort],
  );

  // Memoized row data for rendering
  const rowKeys = useMemo(() => new Set(data.map((row) => String(row[rowKey]))), [data, rowKey]);

  return (
    <Paper elevation={elevation} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {(title || selectable || searchable) && (
        <Toolbar className={cx(selected.size > 0 ? classes.toolbarSelected : classes.toolbar)}>
          {selected.size > 0 ? (
            <Typography
              className={classes.title}
              color='inherit'
              variant='subtitle1'
              component='div'
            >
              {selected.size} selected
            </Typography>
          ) : (
            <Typography className={classes.title} variant='h6' id='tableTitle' component='div'>
              {title}
            </Typography>
          )}

          {searchable && selected.size === 0 && (
            <TextField
              size='small'
              placeholder='Search...'
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              className={classes.searchField}
            />
          )}

          {selected.size > 0 ? (
            <>
              {onDelete && (
                <Tooltip title='Delete'>
                  <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </>
          ) : (
            <Tooltip title='Filter list'>
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      )}

      <TableContainer>
        <MuiTable stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell
                  padding='checkbox'
                  sx={{ textAlign: 'center', justifyContent: 'center' }}
                >
                  <Checkbox
                    indeterminate={selected.size > 0 && selected.size < data.length}
                    checked={data.length > 0 && selected.size === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {headerCells}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const rowKeyValue = row[rowKey];
              const isItemSelected = isSelected(rowKeyValue);
              const isActive = activeRowKey !== undefined && rowKeyValue === activeRowKey;

              return (
                <TableRow
                  hover
                  onClick={() => handleClick(row)}
                  role='checkbox'
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={String(rowKeyValue)}
                  selected={isItemSelected}
                  sx={{
                    cursor: onRowClick || selectable ? 'pointer' : 'default',
                    transition: 'background 0.25s ease',
                    '& td': {
                      textAlign: 'center',
                      justifyContent: 'center',
                    },
                    ...(isActive
                      ? {
                          '@keyframes rowFlash': {
                            '0%': { backgroundColor: 'rgba(30,66,159,0.32)' },
                            '60%': { backgroundColor: 'rgba(30,66,159,0.14)' },
                            '100%': { backgroundColor: 'transparent' },
                          },
                          animation: 'rowFlash 0.55s ease-out',
                        }
                      : {}),
                  }}
                >
                  {selectable && (
                    <TableCell
                      padding='checkbox'
                      sx={{ textAlign: 'center', justifyContent: 'center' }}
                    >
                      <Checkbox checked={isItemSelected} />
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = row[column.id as keyof T];
                    return (
                      <TableRowCell
                        key={String(column.id)}
                        column={column}
                        value={value}
                        row={row}
                      />
                    );
                  })}
                </TableRow>
              );
            })}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align='center'
                  sx={{ padding: 4, textAlign: 'center' }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component='div'
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
