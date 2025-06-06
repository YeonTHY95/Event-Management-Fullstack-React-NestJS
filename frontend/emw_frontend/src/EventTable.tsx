import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import TextField from '@mui/material/TextField';
import { visuallyHidden } from '@mui/utils';
import { useQuery } from '@tanstack/react-query';
import axiosWithCredentials from './axiosWithCredentials';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { UserContext } from './UserContext';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import axiosWithLocalStorage from './axiosWithLocalStorage';

interface Data {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  status: "Ongoing" | "Completed",
  thumbnail: string;
  location: string;
}

function createData(
    id: number,
    name: string,
    startDate: Date,
    endDate: Date,
    status: "Ongoing" | "Completed",
    thumbnail: string,
    location: string
): Data {
  return {
    id,
    name,
    startDate,
    endDate,
    status,
    thumbnail,
    location
  };
}

const rows = [
  createData(1, 'Star', new Date("2025-05-30"), new Date("2025-06-30"), "Ongoing", "https://example.com/star.jpg", "New York"),
    createData(2, 'Moon', new Date("2025-07-01"), new Date("2025-08-01"), "Ongoing", "https://example.com/moon.jpg", "Los Angeles"),
    createData(3, 'Sun', new Date("2025-09-01"), new Date("2025-10-01"), "Completed", "https://example.com/sun.jpg", "Chicago"),
    createData(4, 'Earth', new Date("2025-11-01"), new Date("2025-12-01"), "Ongoing", "https://example.com/earth.jpg", "Houston"),
    createData(5, 'Mars', new Date("2025-01-01"), new Date("2025-02-01"), "Ongoing", "https://example.com/mars.jpg", "Phoenix"),
    createData(6, 'Venus', new Date("2025-03-01"), new Date("2025-04-01"), "Completed", "https://example.com/venus.jpg", "Philadelphia"),
    createData(7, 'Jupiter', new Date("2025-05-01"), new Date("2025-06-01"), "Ongoing", "https://example.com/jupiter.jpg", "San Antonio"),
    createData(8, 'Saturn', new Date("2025-07-01"), new Date("2025-08-01"), "Ongoing", "https://example.com/saturn.jpg", "San Diego"),
    createData(9, 'Uranus', new Date("2025-09-01"), new Date("2025-10-01"), "Completed", "https://example.com/uranus.jpg", "Dallas"),
    createData(10, 'Neptune', new Date("2025-11-01"), new Date("2025-12-01"), "Ongoing", "https://example.com/neptune.jpg", "San Jose"),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | Date},
  b: { [key in Key]: number | string | Date},
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Event Name',
  },
  {
    id: 'startDate',
    numeric: true,
    disablePadding: false,
    label: 'Start Date',
  },
  {
    id: 'endDate',
    numeric: true,
    disablePadding: false,
    label: 'End Date',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'thumbnail',
    numeric: false,
    disablePadding: false,
    label: 'Thumbnail',
  },
  {
    id: 'location',
    numeric: false,
    disablePadding: false,
    label: 'Location',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align= "center" // {headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
interface EnhancedTableToolbarProps {
  numSelected: number;
  filter: string;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selected: readonly number[];
  handleClickOpen: () => void;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected , filter, onFilterChange, selected, handleClickOpen} = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          // display: 'flex',
          // justifyContent: 'space-between',
          // flexWrap: 'wrap',
          // gap: 2,
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          // sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Events
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => {

            // alert(`Delete ${numSelected} selected events ID ${selected.join(', ')}`);
            handleClickOpen();
            }
          }>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
      {numSelected === 0 && (
        <TextField
          label="Search by name"
          variant="outlined"
          size="small"
          value={filter}
          onChange={onFilterChange}
        />
      )}
    </Toolbar>
  );
}
export default function EventTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('startDate');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [filter, setFilter] = React.useState('');

  const {user} = React.useContext(UserContext);

  const navigate = useNavigate();

  const { data, isPending, error,refetch} = useQuery({
    queryKey: ['fetchAllEvents'],
    queryFn: async () => {

      try {
        // const response = await axiosWithCredentials.get('http://localhost:8000/event/getAllEvents');
        const response = await axiosWithLocalStorage.get('http://localhost:8000/event/getAllEvents');
        if (!response) {
          throw new Error('Network response was not ok');
        }
  
        console.log("Response from getAllEvents: ", response.data);
        return response.data;

      }
      catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching events:", error.message);
          if (error.response?.status === 401 && error.response?.data?.message === "Failed to refresh tokens") {
            // Handle unauthorized access, e.g., redirect to login
            navigate("/");
          }
          throw new Error(error.response?.data?.message || "An error occurred while fetching events.");
        } else {
          console.error("Unexpected error:", error);
          throw error;
        }
      }
    },
    gcTime : 0,
    
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  type eventType = {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    status: "Ongoing" | "Completed";
    thumbnail: string;
    mimeType: string; 
    location: string;
  }

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  // const filteredRows = rows.filter(row => row.name.toLowerCase().includes(filter.toLowerCase()));
  const filteredRows = data.filter((row: eventType) => row.name?.toLowerCase().includes(filter.toLowerCase()));
  const visibleRows = [...filteredRows].sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

//   const visibleRows = React.useMemo(
//     () =>
//       [...rows]
//         .sort(getComparator(order, orderBy))
//         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
//     [order, orderBy, page, rowsPerPage],
//   );

  

  const editEvent = (row : eventType) => {
      navigate(`/edit-event/${row.id}`, { state: { eventData: row } });
      // alert(`Edit Event : ${row.name}`);
    }
  
  // Dialog for Deleting Event


  return (

    data.length === 0 ? (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">No events available</Typography>
      </Box>
    ) : 
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
      <EnhancedTableToolbar
        numSelected={selected.length}
        filter={filter}
        onFilterChange={(e) => setFilter(e.target.value)}
        selected={selected}
        handleClickOpen={handleClickOpen}
      />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              // rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <Button onClick={()=> editEvent(row)}>
                        <EditIcon/>
                      </Button>
                      
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.startDate.split("T")[0]}</TableCell>
                    <TableCell align="center">{row.endDate.split("T")[0]}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    {/* <TableCell align="center"><img src={`data:image/jpeg;base64,${row.thumbnail}`} alt="Event thumbnail" /></TableCell> */}
                    <TableCell align="center"><img src={row.thumbnail}  alt="Event thumbnail" width={200} height={200}/></TableCell>
                    <TableCell align="center">{row.location}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length} //{rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      {/* For Deleting Event */}
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              // const formJson = Object.fromEntries((formData as any).entries());
              // const email = formJson.email;
              const password = formData.get('password');
              // Handle the form submission logic here

              try {
                // const deleteEventResponse = await axiosWithCredentials.post(`http://localhost:8000/event/delete`, {
                const deleteEventResponse = await axiosWithLocalStorage.post(`http://localhost:8000/event/delete`, {
                  password,
                  email : user?.email,
                  selectedEvents: selected,
                } );
  
                console.log("Delete Event Response: ", deleteEventResponse);
                // queryClient.invalidateQueries(['fetchAllEvents']); 
                refetch();
                handleClose();
              }
              catch (error) {
                if (axios.isAxiosError(error)) {
                  console.error("Error deleting event:", error.message);
                  alert(error.response?.data?.message || "An error occurred while deleting the event.");
                  
                  if (error.response?.status === 401 && error.response?.data?.message === "Failed to refresh tokens") {
                    // Handle unauthorized access, e.g., redirect to login
                    navigate("/");
                  }
                  
                } else {
                  console.error("Unexpected error:", error);
                }
              }
              
            },
          },
        }}
      >
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To delete the event, please enter your password here for validation.
          </DialogContentText>
          <TextField
            // autoFocus
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}