import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Menu, MenuItem, CircularProgress, Pagination, Typography, Alert, Stack, Collapse, Box, Avatar, Backdrop,
} from "@mui/material";
import {
    MoreVert as MoreVertIcon,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@mui/icons-material";
import { MdEdit, MdDelete } from 'react-icons/md';
import { getGenres } from "../../../../../../services/genres";
import { UploadFile } from "../../../../../../config";
import DeleteGenre from "./delete";


const GenreList = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null); // Quản lý anchorEl cho menu
    const [selectedGenre, setSelectedGenre] = useState(null); // Quản lý genre được chọn
    const [openRow, setOpenRow] = useState({});
    const [Genres, setGenres] = useState([]);
    const [genreToDelete, setGenreToDelete] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(false);


    useEffect(() => {
        GenreData();
    }, []);

    const GenreData = async () => {
        try {
            const data = await getGenres();
            setGenres(data);
        } catch (error) {
            console.log("Không tìm thấy dữ liệu");
        }
    };


    const handleOpenMenu = (event, genre) => {
        setAnchorEl(event.currentTarget);
        setSelectedGenre(genre); // Cập nhật genre được chọn
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedGenre(null); // Đóng menu khi không chọn
    };


    const handleDeleteGenre = (genreId) => {
        setGenres(prevGenres => prevGenres.filter(genre => genre.id !== genreId));
    };

    const handleOpenDeleteModal = (genre) => {
        setGenreToDelete(genre);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setGenreToDelete(null);
    };

    const toggleRow = (genreId) => {
        setOpenRow((prevState) => ({
            ...prevState,
            [genreId]: !prevState[genreId],
        }));
    };

    const getInitials = (username) => {
        if (!username) return "";
        const names = username.split(" ");
        return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
    };



    const getColorFromName = (name) => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[(name.charCodeAt(i % name.length) + i) % 16]; // Dùng tên của subgenre để tạo màu cố định
        }
        return color;
    };

    const handleAddGenre = () => {
        navigate("/admin/genre/add");
    };
    const handleEditGenre = (id) => {
        navigate(`/admin/genre/edit/${id}`);
    };
    return (
        <div className="p-4">
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="flex justify-between mb-4">
                <div className="flex-grow">
                    <TextField
                        label="Search"
                        variant="outlined"


                        className="w-64"
                        placeholder="Search..."
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 justify-end">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
                        onClick={handleAddGenre}
                    >
                        + Add genre
                    </button>

                    <div className="relative w-full md:w-auto">
                        <button
                            className="border px-4 py-2 rounded-md flex items-center w-full md:w-auto"
                            onClick={() => setShowActionMenu(!showActionMenu)}
                        >
                            Actions <i className="fas fa-chevron-down ml-2"></i>
                        </button>

                        {showActionMenu && (
                            <div className="absolute right-0 mt-2 w-full md:w-48 bg-white rounded-md shadow-lg z-10">
                                <button
                                    onClick={() => console.log("Mass edit")}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Mass edit
                                </button>
                                <button
                                    onClick={() => console.log("Delete all")}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Delete all
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {Genres?.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#18181b" }}>
                                    <TableCell />
                                    <TableCell sx={{ color: "white" }}>#</TableCell>
                                    <TableCell sx={{ color: "white" }}>Country category</TableCell>
                                    <TableCell sx={{ color: "white" }}>Image</TableCell>
                                    <TableCell sx={{ color: "white" }}>Description</TableCell>
                                    <TableCell sx={{ width: "70px", color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Genres.map((genre, index) => (
                                    <>
                                        <TableRow key={genre.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => toggleRow(genre.id)}
                                                >
                                                    {openRow[genre.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                {index + 1 }
                                            </TableCell>
                                            <TableCell>{genre.name || "No genrename"}</TableCell>
                                            <TableCell>
                                                {genre.image ? (
                                                    <img src={`${UploadFile}/${genre.image}`} alt={genre.name || "Avatar"} className="w-10 h-10 rounded-full" />
                                                ) : (
                                                    <Avatar>{getInitials(genre.name)}</Avatar>
                                                )}
                                            </TableCell>
                                            <TableCell>{genre.description}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={(event) => handleOpenMenu(event, genre)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl) && selectedGenre?.id === genre.id}
                                                    onClose={handleCloseMenu}

                                                >
                                                    <MenuItem onClick={() => {
                                                        handleCloseMenu();
                                                        handleEditGenre(genre.id);
                                                    }
                                                    } >
                                                        <MdEdit style={{ marginRight: '8px', color: 'blue' }} /> {/* Icon sửa */}
                                                        <span style={{ color: 'blue' }}>Edit</span>
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            handleCloseMenu();
                                                            handleOpenDeleteModal(genre);
                                                        }}
                                                    >
                                                        <MdDelete style={{ marginRight: '8px', color: "red" }} />
                                                        <span style={{ color: 'red' }}>Delete</span>
                                                    </MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                                <Collapse in={openRow[genre.id]} timeout="auto" unmountOnExit>
                                                    <Box margin={1}>
                                                        <Typography variant="h6" gutterBottom component="div">
                                                            Additional Information for {genre.name}
                                                        </Typography>
                                                        <Typography variant="body1">Subcategory:</Typography>
                                                        {Array.isArray(genre.subgenres) ? (
                                                            <div className="flex flex-wrap">
                                                                {genre.subgenres.map((subgenre, index) => (
                                                                    <Typography
                                                                        key={subgenre.id || subgenre.name}
                                                                        variant="body2"
                                                                        component="div"
                                                                        style={{
                                                                            backgroundColor: getColorFromName(subgenre.name),
                                                                            color: '#fff',
                                                                            padding: '4px 12px',
                                                                            marginRight: '8px',
                                                                            marginBottom: '4px',
                                                                            borderRadius: '16px',
                                                                        }}
                                                                    >
                                                                        {subgenre.name}
                                                                    </Typography>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <Typography variant="body2" component="div">
                                                                {typeof genre.subgenres === 'object'
                                                                    ? JSON.stringify(genre.subgenres)
                                                                    : genre.subgenres}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className="mt-4 flex justify-end items-center">
                        <Stack spacing={2}>
                            <Pagination
                                // count={data.totalPages || 1} // Tính số trang từ data
                                // page={page}
                                // onChange={handleChangePage}
                                color="primary"
                                variant="outlined"
                                shape="rounded"
                            />
                        </Stack>
                    </div>
                </>
            ) : (
                <Alert severity="warning">No genre found matching the search keyword.</Alert>
            )}

            {/* Modal xóa */}
            {openDeleteModal && (
                <DeleteGenre
                    onClose={handleCloseDeleteModal}
                    GenreToDelete={genreToDelete}
                    onDelete={handleDeleteGenre}
                />
            )}
        </div>
    );
};

export default GenreList;

