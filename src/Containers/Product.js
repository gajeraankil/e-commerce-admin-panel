import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as yup from "yup";
import { Formik, Form, useFormik } from "formik";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import SearchIcon from "@mui/icons-material/Search";

const Product = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dOpen, setDOpen] = useState(false);
  const [did, setDid] = useState("");
  const [update, setUpdate] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [deleteAll, setDeleteAll] = useState(false);
  const [filterData, setFilterData] = useState([]);

  const loadData = () => {
    let localData = JSON.parse(localStorage.getItem("product"));
    if (localData !== null) {
      setData(localData);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickDOpen = () => {
    setDOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDOpen(false);
    resetForm();
    setUpdate(false);
    setDeleteAll(false);
  };

  const handleInsert = (values) => {
    let localData = JSON.parse(localStorage.getItem("product"));

    let data = { id: new Date().getTime().toString(), ...values };

    if (localData) {
      localData.push(data);
      localStorage.setItem("product", JSON.stringify(localData));
    } else {
      localStorage.setItem("product", JSON.stringify([data]));
    }

    loadData();
    handleClose();
  };

  const handleDelete = () => {
    let localData = JSON.parse(localStorage.getItem("product"));

    let fData;
    if (deleteAll) {
      fData = localData.filter((v) => !selectionModel.includes(v.id));
    } else {
      fData = localData.filter((v) => v.id !== did);
    }

    localStorage.setItem("product", JSON.stringify(fData));

    loadData();
    handleClose();
  };

  const handleUpdate = (values) => {
    let localData = JSON.parse(localStorage.getItem("product"));

    const updateData = localData.map((v) => {
      if (v.id === values.id) {
        return values;
      } else {
        return v;
      }
    });

    localStorage.setItem("product", JSON.stringify(updateData));

    loadData();
    handleClose();
  };

  const handleEdit = (params) => {
    handleClickOpen();
    setValues(params.row);
    setUpdate(true);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 183,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Product Name",
      width: 183,
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Category",
      width: 183,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price (₹)",
      width: 183,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 183,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "action",
      headerName: "Action",
      width: 183,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={3}>
          <IconButton
            aria-label="edit"
            onClick={() => {
              handleEdit(params);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => {
              handleClickDOpen();
              setDid(params.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  let schema = yup.object().shape({
    name: yup.string().required("Please Enter Name"),
    category: yup.string().required("Please Select Category"),
    price: yup
      .number()
      .required("Please Enter Price")
      .positive("Price must be a positive number")
      .typeError("Price must be a number"),
    quantity: yup
      .number()
      .required("Please Enter Quantity")
      .positive("Quantity must be a positive number")
      .integer("Quantity must be an Integer")
      .typeError("Quantity must be a number"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      price: "",
      quantity: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (update) {
        handleUpdate(values);
      } else {
        handleInsert(values);
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    resetForm,
    setValues,
  } = formik;

  const handleSearch = (val) => {
    let localData = JSON.parse(localStorage.getItem("product"));

    let sData = localData.filter((s) => {
      return (
        s.name.toLowerCase().includes(val.toLowerCase()) ||
        s.category.toLowerCase().includes(val.toLowerCase()) ||
        s.price.toString().includes(val) ||
        s.quantity.toString().includes(val)
      );
    });
    setFilterData(sData);
  };

  const finalData = filterData.length > 0 ? filterData : data;

  return (
    <>
      <Container maxWidth="lg">
        <Stack spacing={2} direction="row" sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add Product
          </Button>
          <Button
            disabled={selectionModel.length === 0}
            variant="outlined"
            color="error"
            onClick={() => {
              handleClickDOpen();
              setDeleteAll(true);
            }}
          >
            Delete
          </Button>
        </Stack>
        <TextField
          sx={{ mb: 3 }}
          fullWidth
          id="search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Add Prouct</DialogTitle>
          <Formik values={formik}>
            <Form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
                  margin="dense"
                  name="name"
                  id="name"
                  label="Product Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                  value={values.name}
                  onBlur={handleBlur}
                />
                {errors.name && touched.name ? (
                  <div style={{ color: "red" }}>{errors.name}</div>
                ) : null}
                <FormControl margin="dense" fullWidth variant="standard">
                  <InputLabel id="category">category</InputLabel>
                  <Select
                    labelId="category"
                    onChange={handleChange}
                    value={values.category}
                    onBlur={handleBlur}
                    id="category"
                    name="category"
                    label="category"
                  >
                    <MenuItem value="Digital Product">Digital Product</MenuItem>
                    <MenuItem value="Fashion">Fashion</MenuItem>
                    <MenuItem value="Mobile">Mobile</MenuItem>
                    <MenuItem value="Electric">Electric</MenuItem>
                  </Select>
                </FormControl>
                {errors.category && touched.category ? (
                  <div style={{ color: "red" }}>{errors.category}</div>
                ) : null}
                <TextField
                  margin="dense"
                  id="price"
                  label="Price"
                  onChange={handleChange}
                  value={values.price}
                  onBlur={handleBlur}
                  name="price"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  fullWidth
                  variant="standard"
                />
                {errors.price && touched.price ? (
                  <div style={{ color: "red" }}>{errors.price}</div>
                ) : null}
                <TextField
                  margin="dense"
                  id="quantity"
                  label="Quantity"
                  onChange={handleChange}
                  value={values.quantity}
                  onBlur={handleBlur}
                  name="quantity"
                  fullWidth
                  variant="standard"
                />
                {errors.quantity && touched.quantity ? (
                  <div style={{ color: "red" }}>{errors.quantity}</div>
                ) : null}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {update ? (
                  <Button type="submit">Update</Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </DialogActions>
            </Form>
          </Formik>
        </Dialog>
        <Dialog
          open={dOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {deleteAll
              ? "Are you sure to Delete Selected Rows?"
              : "Are you sure to Delete?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Box style={{ height: 560, width: "100%" }}>
          <DataGrid
            rows={finalData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
            {...data}
          />
        </Box>
      </Container>
    </>
  );
};

export default Product;
