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
import { Container, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { createTheme, ThemeProvider } from '@mui/material';
import Stack from "@mui/material/Stack";
import Autocomplete from '@mui/material/Autocomplete';
import { IconButton } from '@mui/material/';


//Feedback
import { AlertsManager , AlertsContext } from '../../utils/AlertsManager';

const pCategory = [
    { label: 'Essen', id: 1 },
    { label: 'Trinken', id: 2 },
    { label: 'Extra', id: 3 }
]

const theme = createTheme({
    components: {
        MuiTextField: { 
          styleOverrides: {
            root: { 
              '& .MuiInputLabel-root': { color: '#DDDDDD' },
              '& .MuiOutlinedInput-root': { 
                color: '#DDDDDD',
                '& > fieldset': { borderColor: '#DDDDDD' },
              },
            },
          },
        },
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                color: 'lightblue', 
              },
            },
        },
      },
    });
  
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#090c11',
    boxShadow: "24 red",
    border: '2px solid #090c11',
    p: 4,
    borderRadius: '20px',
    color:'#DDDDDD'
  };

const AddProduct = (({onSubmitSuccess, category, action, prductToModify}) =>
{
    console.log(prductToModify);
    const alertsManagerRef =  useRef();
    const [open, setOpen] = useState(false);
    const descriptionRef = useRef();

    const handleSubmit = async(formData, { resetForm }) =>{

        const url = 'products';
        const data = {
            name: formData.description,
            price: formData.price,
            stock: formData.stock,
            consumption: formData.consumption,
            category: category
        };

        const request = action === 'add' ? axios.post(url, data) : axios.put(url, data);

        await request
        .then(response => {
            console.log(JSON.stringify(response.data))
            alertsManagerRef.current.showAlert('success', response.data);
           onSubmitSuccess();
            resetForm();
    
        })
        .catch(error => {
            if (error.response.data.length !== 0) {
                alertsManagerRef.current.showAlert('error',  error.response.data);
            }
            else
            {
                alertsManagerRef.current.showAlert('error', `Error: ${error.response.status}`);
            }
        });
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
        // shortInfo: yup.string().min(10, "min. 10 Zeichen"),
        // detailedInfo: yup.string().min(30, "min. 30 Zeichen")
    })

    const FormikWithRef = React.forwardRef((props, ref) => (
        <Formik {...props} />
      ));

    return(
        <div>
        <AlertsManager ref={alertsManagerRef} />
        {
            action == "add" ?
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpen}>Neues Produkt hinzufügen</Button >
            :
            <IconButton variant="contained" color="warning" onClick={handleOpen}><EditIcon/></IconButton>
        }
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border:"solid 2px" }}
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <FormikWithRef
        validateOnChange={true}
        initialValues={
            prductToModify ? {
                description: prductToModify.name,
                price: prductToModify.price,
                stock: prductToModify.stock,
                consumption: prductToModify.consumption
            } : {
                description: '',
                price: '',
                stock: '',
                consumption: '' 
            }
        }
        validationSchema={validationSchema}
        onSubmit={async(data, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                //Post From
                await handleSubmit(data, { resetForm }); //async call
                setSubmitting(false);
            }
        }
        //end Formik
        >  
        {
            ({ values, errors, isSubmitting, touched }) => {
                
                useEffect(() => {
                    if (!isSubmitting) {
                        descriptionRef.current.focus();
                    }
                }, [isSubmitting])

                return(
                <Container className="Form-Container" sx={{...style, width:'500px'}} >
                    {
                         action == "add" ?
                         <Typography  sx={{ marginBottom: '35px' }}>Neues Produkt hinzufügen</Typography>
                         :
                         <Typography  sx={{ marginBottom: '35px' }}>Produkt aktualisieren</Typography>
                    }

                <Form className="Form-Container" >
                    <Grid container direction="row" alignItems="center" spacing={1}>
                        <ThemeProvider theme={theme}>
                        <Grid item xs={8}>
                            <Field  autoComplete="off" inputRef={descriptionRef} variant="outlined" label="Bezeichung" name="description" type="input" error={!!errors.description && !!touched.description} helperText={!!touched.description && !!errors.description ? String(errors.description): ' '  } as={TextField}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Field autoComplete='off' variant="outlined" label="Preis" name="price" type="tel" error={!!errors.price && !!touched.price} helperText={!!touched.price && !!errors.price ? String(errors.price):' '} as={TextField}  InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment>,}}/>
                        </Grid>
                        <Grid item xs={6}>
                            <Field autoComplete='off' variant="outlined" label="Stück" name="stock" type="tel" error={!!errors.stock && !!touched.stock} helperText={!!touched.stock && !!errors.stock ? String(errors.stock):' '} as={TextField} />
                        </Grid>
                        <Grid item xs={6}>
                            <Field autoComplete='off' variant="outlined" label="Verbraucht" name="consumption" type="tel" error={!!errors.consumption && !!touched.consumption} helperText={!!touched.consumption && !!errors.consumption ? String(errors.consumption):' '} as={TextField} />
                        </Grid>
                        {/* <Grid item xs={6}>
                            <Field autoComplete='off' variant="outlined" label="KurzInfo" name="info" type="input" error={!!errors.shortInfo && !!touched.shortInfo} helperText={!!touched.shortInfo && !!errors.shortInfo ? String(errors.shortInfo):' '} as={TextField} />
                        </Grid>
                        <Grid item xs={6}>
                            <Field autoComplete='off' variant="outlined" label="Allergietabelle" name="detailedInfo" type="input" error={!!errors.detailedInfo && !!touched.detailedInfo} helperText={!!touched.detailedInfo && !!errors.detailedInfo ? String(errors.detailedInfo):' '} as={TextField} />
                        </Grid> */}
                        {action == "add" ? null:
                        <Grid  item xs={6}>
                        <Autocomplete
                            disablePortal
                            id="ac_category_update_product"
                            defaultValue={prductToModify.category}
                            options={pCategory}
                            name="category"
                            renderInput={(params) => <TextField {...params} label="Kategorie" />}
                            />
                        </Grid>
                        }
                        <Grid item xs={12}>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ marginTop:'35px' }}>
                          {action == "add" ? 
                          <Button variant="outlined" color='success' disabled={isSubmitting || !errors } type='submit' startIcon={<SaveIcon />}> Hinzufügen </Button>: 
                          <Button variant="outlined" color='success' disabled={isSubmitting || !errors } type='submit' startIcon={<SaveIcon />}> Aktualisieren </Button>}
                        <Button variant="outlined" color='error' disabled={isSubmitting || !errors } onClick={handleClose}  startIcon={<SaveIcon />}> Abbrechen </Button>

                        </Stack>

                        </Grid>
                     
                        </ThemeProvider>

                    </Grid>
                </Form>
                </Container>
                );

            }
        }
    </FormikWithRef>
    </Modal>
    </div>
    );
})

export default AddProduct