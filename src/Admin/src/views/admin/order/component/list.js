import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Menu, MenuItem, CircularProgress, Pagination, Typography, Alert, Stack, Collapse, Box, Avatar, Backdrop,
} from "@mui/material";
import {
    MoreVert as MoreVertIcon,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@mui/icons-material";

import { getAllPayment } from "services/payment";
import { formatDate } from "Client/src/components/format";
import Progress from "Admin/src/components/processbar";
import exportToPDF from "Admin/src/components/export/pdf";


const OrderList = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [Orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [searchName, setSearchName] = useState('');
    const [openRow, setOpenRow] = useState({});


    const OrderData = async (page = 1, limit = 5, searchName = '') => {
        try {
            const data = await getAllPayment(page, limit, searchName);
            setOrders(data.payment);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.log("Không tìm thấy dữ liệu");
        }
    };

    const useDebouncedValue = (value, delay = 500) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const timer = setTimeout(() => setDebouncedValue(value), delay);
            return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
    };

    const debouncedSearchName = useDebouncedValue(searchName);

    useEffect(() => {
        OrderData(currentPage, limit, debouncedSearchName);
    }, [currentPage, limit, debouncedSearchName]);

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const handleSearchChange = (e) => {
        setSearchName(e.target.value);
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
        setCurrentPage(1);
    };

    const toggleRow = (id) => {
        setOpenRow((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const calculateDaysLeft = (expiryDate) => {
        const today = new Date();
        const expDate = new Date(expiryDate);
        const timeDifference = expDate - today;
        return Math.ceil(timeDifference / (1000 * 3600 * 24));
    };

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <div className="flex-grow">
                    <TextField
                        variant="outlined"
                        className="w-64"
                        value={searchName}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: "40px",
                                textAlign: 'center'
                            },
                        }}
                    />
                </div>
            </div>

            {Orders?.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#18181b" }}>
                                    <TableCell sx={{ color: "white" }}>#</TableCell>
                                    <TableCell sx={{ color: "white" }}>Username</TableCell>
                                    <TableCell sx={{ color: "white" }}>Email</TableCell>
                                    <TableCell sx={{ color: "white" }}>Service</TableCell>
                                    <TableCell sx={{ color: "white" }}>Price</TableCell>
                                    <TableCell sx={{ color: "white" }}>Payment method</TableCell>
                                    <TableCell sx={{ color: "white" }}>Date of purchase</TableCell>
                                    <TableCell sx={{ color: "white" }}>Expiration date</TableCell>
                                    <TableCell sx={{ color: "white" }}>Status</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Orders.map((order, index) => (
                                    <React.Fragment key={order.payment_id}>
                                        <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                                            <TableCell>
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{order.username || "No ordername"}</TableCell>
                                            <TableCell>{order.email || "No ordername"}</TableCell>
                                            <TableCell><p className="bg-yellow-500 text-white text-[14px] font-bold px-2 py-1 rounded shrink-0 w-[75px]">{"Premium"}</p> </TableCell>
                                            <TableCell>{order.amount / 100} USD</TableCell>
                                            <TableCell>{'Online payment'}</TableCell>
                                            <TableCell>{formatDate(order.subscription_date)}</TableCell>

                                            <TableCell>{formatDate(order.expiry_date)}</TableCell>
                                            <TableCell>
                                                <Progress level={calculateDaysLeft(order.expiry_date)} />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => toggleRow(order.payment_id)}
                                                >
                                                    {openRow[order.payment_id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                                <Collapse in={openRow[order.payment_id]} timeout="auto" unmountOnExit>
                                                    <Box margin={1}>
                                                        <Typography variant="h6" gutterBottom component="div">
                                                            <div className="flex mr-2">
                                                                Additional Information
                                                                <button className="bg-green-500 text-white p-2 rounded-md transition hover:bg-green-600 ml-3 w-[100px] h-[40px] text-[16px]"
                                                                onClick={()=>{exportToPDF(order.username,order.amount / 100,formatDate(order.subscription_date),formatDate(order.expiry_date))}}
                                                                >
                                                                    Export PDF
                                                                </button >
                                                            </div>
                                                        </Typography>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="limit">Show items:</label>
                            <select id="limit" value={limit} onChange={handleLimitChange} className="border border-gray-300 rounded p-1">
                                <option value={5}>Show 5</option>
                                <option value={10}>Show 10</option>
                                <option value={15}>Show 15</option>
                            </select>
                        </div>
                        <div>
                            <Stack spacing={2}>
                                <Pagination
                                    count={totalPages || 1}
                                    page={currentPage}
                                    onChange={handleChangePage}
                                    color="primary"
                                    variant="outlined"
                                    shape="rounded"
                                />
                            </Stack>
                        </div>
                    </div>
                </>
            ) : (
                <Alert severity="warning">No country found matching the search keyword.</Alert>
            )}
        </div>
    );
};

export default OrderList;

