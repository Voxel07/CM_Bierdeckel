import React, { useEffect, useState, useRef } from 'react'

//Form
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import axios from 'axios'

//MUI
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Container, Typography, Box } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Stack from "@mui/material/Stack";
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { createTheme, ThemeProvider } from '@mui/material';

//Feedback
import { AlertsManager, AlertsContext } from '../../utils/AlertsManager';

const pCategory = [
    { label: 'Essen', id: 'Food' },
    { label: 'Trinken', id: 'Drink' },
    { label: 'Extras', id: 'Extra' }
]

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, rgba(9, 12, 17, 0.98) 0%, rgba(4, 6, 8, 0.99) 100%)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(25, 152, 161, 0.25)',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
    p: 4,
    borderRadius: '20px',
    width: '95%',
    maxWidth: '520px',
    boxSizing: 'border-box',
    color: '#F5F0F3',
};

const customTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1998a1',
        },
        background: {
            paper: '#090c11',
            default: '#040608',
        },
        text: {
            primary: '#F5F0F3',
            secondary: '#a0aec0',
        }
    },
    components: {
        MuiTextField: {
            defaultProps: {
                fullWidth: true,
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: '#F5F0F3',
                    backgroundColor: 'rgba(4, 6, 8, 0.5)',
                    borderRadius: '8px',
                    '& fieldset': {
                        borderColor: 'rgba(25, 152, 161, 0.2)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(25, 152, 161, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#1998a1',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#a0aec0',
                    '&.Mui-focused': {
                        color: '#1998a1',
                    },
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                clearIndicator: {
                    color: 'rgba(255, 0, 0, 0.7)',
                    '&:hover': {
                        color: 'red',
                    }
                },
                popupIndicator: {
                    color: '#F5F0F3',
                },
                paper: {
                    backgroundColor: '#090c11',
                    border: '1px solid rgba(25, 152, 161, 0.3)',
                    borderRadius: '8px',
                },
                option: {
                    color: '#F5F0F3',
                    borderBottom: '1px solid rgba(13, 84, 89, 0.2)',
                    '&[aria-selected="true"]': {
                        backgroundColor: 'rgba(25, 152, 161, 0.2)',
                        color: '#1998a1',
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'rgba(25, 152, 161, 0.1)',
                    }
                },
            },
        },
    },
});

const chipStyle = {
    margin: '2px',
    backgroundColor: 'rgba(4, 6, 8, 0.6)',
    border: '1px solid rgba(25, 152, 161, 0.4)',
    color: '#fff',
    borderRadius: '6px',
    '&:hover': {
        backgroundColor: 'rgba(4, 6, 8, 0.8)',
    },
    '& .MuiChip-deleteIcon': {
        color: 'rgba(255, 0, 0, 0.7)',
        '&:hover': {
            color: 'red',
        },
    }
};

const AddProduct = (({ onSubmitSuccess, category, action, productToModify, extras }) => {
    const alertsManagerRef = useRef();
    const [open, setOpen] = useState(false);
    const descriptionRef = useRef();
    const [newCategory, setNewCategory] = useState(category)

    const handleSubmit = async (formData, { resetForm }) => {
        console.log(formData);
        console.log(productToModify);
        const url = 'products';
        const data = {
            id: productToModify ? productToModify.id : null,
            name: formData.description,
            price: String(formData.price).replace(",", "."),
            stock: formData.stock,
            consumption: formData.consumption,
            category: newCategory,
            compatibleExtras: formData.extras.map(extra => extra)
        };

        const request = action === 'add' ? axios.post(url, data) : axios.put(url, data);

        try {
            const response = await request;
            console.log(JSON.stringify(response.data))
            alertsManagerRef.current.showAlert('success', response.data);
            onSubmitSuccess();
            resetForm();
        } catch (error) {
            if (error.response.data.length !== 0) {
                alertsManagerRef.current.showAlert('error', error.response.data);
            } else {
                alertsManagerRef.current.showAlert('error', `Error: ${error.response.status}`);
            }
        }
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const validationSchema = yup.object().shape({
        description: yup.string().required("Pflichtfeld").min(4, "min. 4 Zeichen").max(20, "max. 20 Zeichen"),
        price: yup.number()
            .typeError("Muss eine Zahl sein")
            .transform((value, originalValue) => {
                let replaced = String(originalValue).replace(",", ".");
                return isNaN(replaced) ? value : parseFloat(replaced);
            })
            .required("Pflichtfeld")
            .positive("Muss eine positive Zahl sein")
            .min(0.01, "Muss größer als 0 sein"),
        stock: yup.number()
            .required("Pflichtfeld")
            .integer("Ganze Zahlen")
            .typeError("Numerischer Wert")
            .min(1, "min. 1"),
        consumption: yup.number("Numerischer Wert").integer("Ganze Zahlen").typeError("Numerischer Wert")
            .min(0, "<= 0")
            .required("Pflichtfeld")
    })

    const FormikWithRef = React.forwardRef((props, ref) => (
        <Formik {...props} />
    ));

    return (
        <ThemeProvider theme={customTheme}>
            <div>
                <AlertsManager ref={alertsManagerRef} />
                {
                    action === "add" ? (
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleOpen}
                            sx={{
                                borderRadius: '8px',
                                borderColor: 'rgba(25, 152, 161, 0.4)',
                                color: '#1998a1',
                                textTransform: 'none',
                                fontWeight: 500,
                                px: 2,
                                py: 1,
                                '&:hover': {
                                    borderColor: '#1998a1',
                                    backgroundColor: 'rgba(25, 152, 161, 0.08)',
                                    boxShadow: '0 0 10px rgba(25, 152, 161, 0.25)',
                                }
                            }}
                        >
                            Neues Produkt hinzufügen!
                        </Button >
                    ) : (
                        <IconButton
                            onClick={handleOpen}
                            sx={{
                                color: '#e65100', // Warning color orange
                                border: '1px solid rgba(230, 81, 0, 0.3)',
                                borderRadius: '8px',
                                p: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(230, 81, 0, 0.08)',
                                    color: '#ff9800',
                                    borderColor: '#ff9800',
                                }
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    )
                }
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                            sx: { backgroundColor: 'rgba(4, 6, 8, 0.85)' }
                        },
                    }}
                >
                    <FormikWithRef
                        validateOnChange={true}
                        initialValues={
                            productToModify ? {
                                description: productToModify.name,
                                price: productToModify.price,
                                stock: productToModify.stock,
                                consumption: productToModify.consumption,
                                category: productToModify.category || '',
                                extras: productToModify.compatibleExtras || []
                            } : {
                                description: '',
                                price: '',
                                stock: '',
                                consumption: '',
                                category: '',
                                extras: []
                            }
                        }
                        validationSchema={validationSchema}
                        onSubmit={async (data, { setSubmitting, resetForm }) => {
                            setSubmitting(true);
                            await handleSubmit(data, { resetForm }); //async call
                            setSubmitting(false);
                            handleClose(); // Close modal on submit success
                        }
                        }
                    >
                        {
                            ({ values, errors, isSubmitting, touched, setFieldValue }) => {

                                useEffect(() => {
                                    if (!isSubmitting && open) {
                                        descriptionRef.current?.focus();
                                    }
                                }, [isSubmitting, open])

                                const isAdd = action === "add";
                                const colDesignation = isAdd ? 5 : 3;
                                const colPrice = isAdd ? 2 : 2;
                                const colStock = isAdd ? 2.5 : 2.25;
                                const colConsumption = isAdd ? 2.5 : 2.25;
                                const colCategory = 2.5;

                                return (
                                    <Box sx={style}>
                                        <Typography variant="h5" sx={{ marginBottom: '24px', fontWeight: 600, color: '#1998a1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {action === "add" ? "Neues Produkt hinzufügen" : "Produkt aktualisieren"}
                                        </Typography>

                                        <Form style={{ display: 'block', width: '100%' }}>
                                            <Grid container spacing={2.5}>
                                                <Grid item xs={colDesignation}>
                                                    <Field
                                                        autoComplete="off"
                                                        inputRef={descriptionRef}
                                                        variant="outlined"
                                                        label="Bezeichnung"
                                                        name="description"
                                                        type="input"
                                                        fullWidth
                                                        error={!!errors.description && !!touched.description}
                                                        helperText={!!touched.description && !!errors.description ? String(errors.description) : ' '}
                                                        as={TextField}
                                                    />
                                                </Grid>
                                                <Grid item xs={colPrice}>
                                                    <Field
                                                        autoComplete='off'
                                                        variant="outlined"
                                                        label="Preis"
                                                        name="price"
                                                        type="tel"
                                                        fullWidth
                                                        error={!!errors.price && !!touched.price}
                                                        helperText={!!touched.price && !!errors.price ? String(errors.price) : ' '}
                                                        as={TextField}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="end">€</InputAdornment>
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={colStock}>
                                                    <Field
                                                        autoComplete='off'
                                                        variant="outlined"
                                                        label="Bestand"
                                                        name="stock"
                                                        type="tel"
                                                        fullWidth
                                                        error={!!errors.stock && !!touched.stock}
                                                        helperText={!!touched.stock && !!errors.stock ? String(errors.stock) : ' '}
                                                        as={TextField}
                                                    />
                                                </Grid>
                                                <Grid item xs={colConsumption}>
                                                    <Field
                                                        autoComplete='off'
                                                        variant="outlined"
                                                        label="Verbraucht"
                                                        name="consumption"
                                                        type="tel"
                                                        fullWidth
                                                        error={!!errors.consumption && !!touched.consumption}
                                                        helperText={!!touched.consumption && !!errors.consumption ? String(errors.consumption) : ' '}
                                                        as={TextField}
                                                    />
                                                </Grid>

                                                {action !== "add" && (
                                                    <Grid item xs={colCategory}>
                                                        <Autocomplete
                                                            disablePortal
                                                            id="ac_category_update_product"
                                                            fullWidth
                                                            defaultValue={pCategory.find(item => item.id === productToModify.category)}
                                                            options={pCategory}
                                                            getOptionLabel={(option) => option.label || ''}
                                                            isOptionEqualToValue={(option, val) => option.id === val.id}
                                                            onChange={(event, value) => {
                                                                setNewCategory(value ? value.id : '');
                                                            }}
                                                            renderInput={(params) => <TextField {...params} label="Kategorie" />}
                                                        />
                                                    </Grid>
                                                )}

                                                {/* Fourth Row: Kompatible Extras (only rendered if extras are available) */}
                                                {Array.isArray(extras) && extras.length > 0 && (
                                                    <Grid item xs={12}>
                                                        <Autocomplete
                                                            multiple
                                                            id="extras-tags"
                                                            fullWidth
                                                            options={extras.filter(
                                                                extra => !values.extras.some(selectedExtra => selectedExtra.id === extra.id)
                                                            )}
                                                            getOptionLabel={(option) => option.name}
                                                            value={values.extras}
                                                            onChange={(event, newValue) => {
                                                                setFieldValue('extras', newValue);
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    variant="outlined"
                                                                    label="Kompatible Extras"
                                                                    placeholder="Wähle Extras"
                                                                />
                                                            )}
                                                            renderTags={(value, getTagProps) =>
                                                                value.map((option, index) => {
                                                                    const { key, ...tagProps } = getTagProps({ index });
                                                                    return (
                                                                        <Chip
                                                                            key={key}
                                                                            deleteIcon={<ClearIcon />}
                                                                            variant="outlined"
                                                                            label={option.name}
                                                                            {...tagProps}
                                                                            sx={chipStyle}
                                                                        />
                                                                    );
                                                                })
                                                            }
                                                        />
                                                    </Grid>
                                                )}

                                                {/* Fifth Row: Action Buttons */}
                                                <Grid item xs={12}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={2}
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        sx={{ mt: 4 }}>
                                                        <Button
                                                            variant="contained"
                                                            disabled={isSubmitting}
                                                            type="submit"
                                                            startIcon={<SaveIcon />}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #1998a1 0%, #0d5459 100%)',
                                                                color: '#fff',
                                                                borderRadius: '8px',
                                                                px: 3.5,
                                                                height: '56px',
                                                                boxSizing: 'border-box',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #1ebdca 0%, #11686f 100%)',
                                                                    boxShadow: '0 0 12px rgba(25, 152, 161, 0.4)',
                                                                }
                                                            }}
                                                        >
                                                            {action === "add" ? "Hinzufügen" : "Aktualisieren"}
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            disabled={isSubmitting}
                                                            onClick={handleClose}
                                                            startIcon={<CloseIcon />}
                                                            sx={{
                                                                borderRadius: '8px',
                                                                borderColor: 'rgba(211, 47, 47, 0.5)',
                                                                color: '#ff8a80',
                                                                px: 3.5,
                                                                height: '56px',
                                                                boxSizing: 'border-box',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                '&:hover': {
                                                                    borderColor: '#d32f2f',
                                                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                                                    boxShadow: '0 0 12px rgba(211, 47, 47, 0.2)',
                                                                    color: '#fff'
                                                                }
                                                            }}
                                                        >
                                                            Abbrechen
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Form>
                                    </Box>
                                );

                            }
                        }
                    </FormikWithRef>
                </Modal>
            </div>
        </ThemeProvider>
    );
})

export default AddProduct