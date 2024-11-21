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
import { MdEdit, MdDelete } from 'react-icons/md';
import { getCountry } from "../../../../../../services/country";
import DeleteCountry from "./delete";


const CountryList = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [Country, setCountry] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countryToDelete, setCountryToDelete] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [searchName, setSearchName] = useState('');

    const CountryData = async (page = 1, limit = 5,searchName='') => {
        try {
            const data = await getCountry(page, limit,searchName);
            setCountry(data.countries);
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
        CountryData(currentPage, limit,debouncedSearchName);
    }, [currentPage, limit,debouncedSearchName]);

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

    const handleOpenMenu = (event, country) => {
        setAnchorEl(event.currentTarget);
        setSelectedCountry(country);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedCountry(null); // Đóng menu khi không chọn
    };


    const handleDeleteCountry = (countryId) => {
        setCountry(prevcountrys => prevcountrys.filter(country => country.id !== countryId));
    };

    const handleOpenDeleteModal = (country) => {
        setCountryToDelete(country);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setCountryToDelete(null);
    };

    const handleAddCountry = () => {
        navigate("/admin/countries/add");
    };
    const handleEditCountry = (id) => {
        navigate(`/admin/countries/edit/${id}`);
    };
    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <div className="flex-grow">
                    <TextField
                        label="Search"
                        variant="outlined"
                        className="w-64"
                        value={searchName}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 justify-end">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
                        onClick={handleAddCountry}
                    >
                        + Add country
                    </button>
                </div>
            </div>

            {Country?.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#18181b" }}>
                                    <TableCell sx={{ color: "white" }}>#</TableCell>
                                    <TableCell sx={{ color: "white" }}>Name</TableCell>
                                    <TableCell sx={{ width: "70px", color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Country.map((country, index) => (
                                    <React.Fragment key={country.id}>
                                        <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                                            <TableCell>
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{country.name || "No countryname"}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={(event) => handleOpenMenu(event, country)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl) && selectedCountry?.id === country.id}
                                                    onClose={handleCloseMenu}
                                                >
                                                    <MenuItem onClick={() => {
                                                        handleCloseMenu();
                                                        handleEditCountry(country.id);
                                                    }
                                                    } >
                                                        <MdEdit style={{ marginRight: '8px', color: 'blue' }} /> {/* Icon sửa */}
                                                        <span style={{ color: 'blue' }}>Edit</span>
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            handleCloseMenu();
                                                            handleOpenDeleteModal(country);
                                                        }}
                                                    >
                                                        <MdDelete style={{ marginRight: '8px', color: "red" }} />
                                                        <span style={{ color: 'red' }}>Delete</span>
                                                    </MenuItem>
                                                </Menu>
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

            {/* Modal xóa */}
            {openDeleteModal && (
                <DeleteCountry
                    onClose={handleCloseDeleteModal}
                    CountryDelete={countryToDelete}
                    onDelete={handleDeleteCountry}
                />
            )}
        </div>
    );
};

export default CountryList;

