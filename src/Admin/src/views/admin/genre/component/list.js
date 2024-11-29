import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Pagination,
  Typography,
  Alert,
  Stack,
  Collapse,
  Box,
  Avatar,
  Backdrop,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { MdEdit, MdDelete } from "react-icons/md";
import { getGenres } from "../../../../../../services/genres";
import DeleteGenre from "./delete";
import { getCountry } from "services/country";

const GenreList = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [Genres, setGenres] = useState([]);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [Country, setCountry] = useState([]);
  const [searchName, setSearchName] = useState("");
  const filterMenuRef = useRef(null);

  const GenreData = async (
    page = 1,
    limit = 5,
    countryIDs = [],
    search = ""
  ) => {
    const data = await getGenres(page, limit, countryIDs, search);
    setGenres(data.genres || []);
    setTotalPages(data.totalPages);
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
    GenreData(currentPage, limit, selectedCountries, debouncedSearchName);
  }, [currentPage, limit, selectedCountries, debouncedSearchName]);

  const handleFilterChange = (event, countryId) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedCountries((prev) => [...prev, countryId]);
    } else {
      setSelectedCountries((prev) => prev.filter((id) => id !== countryId));
    }
  };
  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const filterCountriesWithGenres = (countries, genres) => {
    return countries.filter((country) =>
      genres.some((genre) => genre.country === country.name)
    );
  };

  const CountryData = async () => {
    try {
      const countryData = await getCountry();
      const genreData = await getGenres();
      const filteredCountries = filterCountriesWithGenres(
        countryData.countries,
        genreData.genres
      );
      setCountry(filteredCountries);
    } catch (error) {
      console.log("Có lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    CountryData();
  }, []);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleOpenMenu = (event, genre) => {
    setAnchorEl(event.currentTarget);
    setSelectedGenre(genre);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedGenre(null); // Đóng menu khi không chọn
  };

  const handleDeleteGenre = (id) => {
    setGenres((prevGenres) => prevGenres.filter((genre) => genre.id !== id));
  };

  const handleOpenDeleteModal = (genre) => {
    setGenreToDelete(genre);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setGenreToDelete(null);
  };

  const handleClickOutside = (event) => {
    if (
      filterMenuRef.current &&
      !filterMenuRef.current.contains(event.target)
    ) {
      setShowFilterMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (username) => {
    if (!username) return "";
    const names = username.split(" ");
    return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
  };

  const handleAddGenre = () => {
    navigate("/admin/genre/add");
  };
  const handleEditGenre = (id) => {
    navigate(`/admin/genre/edit/${id}`);
  };
  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div className="flex-grow">
          <TextField
            label="Search"
            variant="outlined"
            value={searchName}
            onChange={handleSearchChange}
            className="w-64"
            placeholder="Search..."
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
              },
            }}
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
              className="border px-4 py-2 rounded-md flex items-center w-full md:w-auto bg-[#823ad5] text-white"
              onClick={() => setShowFilterMenu((prev) => !prev)}
            >
              Filter <i className="fas fa-chevron-down ml-2"></i>
            </button>
            {showFilterMenu && (
              <div
                ref={filterMenuRef}
                className="absolute right-0 mt-2 w-full md:w-48 bg-white rounded-md shadow-lg z-10"
              >
                {Country.map((country) => (
                  <label
                    key={country.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country.id)}
                      onChange={(e) => handleFilterChange(e, country.id)}
                      className="mr-2"
                    />
                    {country.name}
                  </label>
                ))}
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
                  <TableCell sx={{ color: "white" }}>#</TableCell>
                  <TableCell sx={{ color: "white" }}>Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Image</TableCell>
                  <TableCell sx={{ color: "white" }}>Country</TableCell>
                  <TableCell sx={{ width: "70px", color: "white" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Genres.map((genre, index) => (
                  <React.Fragment key={genre.id}>
                    <TableRow
                      sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                    >
                      <TableCell>
                        {(currentPage - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell>{genre.name || "No genrename"}</TableCell>
                      <TableCell>
                        {genre.image ? (
                          <img
                            src={`${genre.image}`}
                            alt={genre.name}
                            className="w-10 h-10 rounded-md"
                          />
                        ) : (
                          <Avatar>{getInitials(genre.name)}</Avatar>
                        )}
                      </TableCell>
                      <TableCell>{genre.country}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleOpenMenu(event, genre)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={
                            Boolean(anchorEl) && selectedGenre?.id === genre.id
                          }
                          onClose={handleCloseMenu}
                        >
                          <MenuItem
                            onClick={() => {
                              handleCloseMenu();
                              handleEditGenre(genre.id);
                            }}
                          >
                            <MdEdit
                              style={{ marginRight: "8px", color: "blue" }}
                            />{" "}
                            {/* Icon sửa */}
                            <span style={{ color: "blue" }}>Edit</span>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleCloseMenu();
                              handleOpenDeleteModal(genre);
                            }}
                          >
                            <MdDelete
                              style={{ marginRight: "8px", color: "red" }}
                            />
                            <span style={{ color: "red" }}>Delete</span>
                          </MenuItem>
                        </Menu>
                      </TableCell>
                      {/* <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => toggleRow(genre.id)}
                                                >
                                                    {openRow[genre.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                </IconButton>
                                            </TableCell> */}
                    </TableRow>
                    {/* <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                                <Collapse in={openRow[genre.id]} timeout="auto" unmountOnExit>
                                                    <Box margin={1}>
                                                        <Typography variant="h6" gutterBottom component="div">
                                                            Additional Information for {genre.name}
                                                        </Typography>
                                                        <Typography variant="body1" className="pb-2">Subcategory:</Typography>
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
                                        </TableRow> */}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label htmlFor="limit">Show items:</label>
              <select
                id="limit"
                value={limit}
                onChange={handleLimitChange}
                className="border border-gray-300 rounded p-1"
              >
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
        <Alert severity="warning">
          No genre found matching the search keyword.
        </Alert>
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
