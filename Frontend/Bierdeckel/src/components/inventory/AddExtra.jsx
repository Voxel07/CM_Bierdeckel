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
import { createTheme, ThemeProvider } from '@mui/material';

//Feedback
import { AlertsManager , AlertsContext } from '../../utils/AlertsManager';

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
                outlined: {
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
    backgroundColor: '#383838',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px',
    color:'#4fcdb9'
  };



const AddExtra = ((props) =>
{
    const alertsManagerRef =  useRef(AlertsContext);
    const [open, setOpen] = useState(false);
    const descriptionRef = useRef();

    const handleSubmit = async(formData, { resetForm }) =>{

        await axios.post('http://localhost:8080/extras',
        {
            name: formData.description,
            price: formData.price,
            stock: formData.stock,
            consumption: formData.consumption,
        })
        .then(response => {//handels only status code 200-300?
            console.log(JSON.stringify(response.data))
            alertsManagerRef.current.showAlert('success', response.data);
            props.onSubmitSuccess(); // Re Fetch data
            resetForm(); // reset Form
    
        })
        .catch(error => {//handle response codes over 400 here
            console.log("Error:"+ error.response.data)
            alertsManagerRef.current.showAlert('error', error.response.data);

        });
    
    }

    const handleOpen = () => {
        setOpen(true);
        };
    
    const handleClose = () => {
        setOpen(false);
        };

    const validationSchema = yup.object({
        description: yup.string().required("Pflichtfeld").min(4, "min. 4 Zeichen").max(20, "max. 20 Zeichen"),
        price: yup.number("Numerischer Wert").min(0, "Nope").required("Pflichtfeld"),
        stock: yup.number("Numerischer Wert").min(0, "Nope").required("Pflichtfeld"),
        consumption: yup.number("Numerischer Wert").min(0, "Nope").required("Pflichtfeld")
    })

    const FormikWithRef = React.forwardRef((props, ref) => (
        <Formik {...props} />
      ));

    return(
        <div>
        <AlertsManager ref={alertsManagerRef} />
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpen}>Neues Extra hinzufügen</Button >
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border:"solid 2px" }}
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
            {
                description: '',
                price: '',
                stock:'',
                consumption: 0,
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
                <div style={{ marginBottom: '35px' }}>
                    <Typography >Neues Extra hinzufügen</Typography>
                </div>

                <Form className="Form-Container" sx={{...style}} >
                    <Grid container direction="row" alignItems="center" spacing={1}>
                    <ThemeProvider theme={theme}>
                        <Grid item xs={8}>
                            <Field inputRef={descriptionRef}  autoFocus variant="outlined" label="Bezeichung" name="description" type="input" error={!!errors.description && !!touched.description} helperText={!!touched.description && !!errors.description ? String(errors.description): ' '} as={TextField} />
                        </Grid>
                        <Grid  item xs={4}>
                            <Field autoComplete='off' variant="outlined" label="Preis" name="price" type="tel" error={!!errors.price && !!touched.price} helperText={!!touched.price && !!errors.price ? String(errors.price):' '} as={TextField}  InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment>,}}/>
                        </Grid>
                        <Grid  item xs={6}>
                            <Field autoComplete='off' variant="outlined" label="Stück" name="stock" type="tel" error={!!errors.stock && !!touched.stock} helperText={!!touched.stock && !!errors.stock ? String(errors.stock):' '} as={TextField} />
                        </Grid>
                        <Grid  item xs={6}>
                            <Field  autoComplete='off' variant="outlined" label="Verbraucht" name="consumption" type="tel" error={!!errors.consumption && !!touched.consumption} helperText={!!touched.consumption && !!errors.consumption ? String(errors.consumption):' '} as={TextField} />
                        </Grid>
                        <Grid container spacing={1} sx={{ flexGrow: 1 }} justify="space-between" >
                        <Grid item xs={8} md={6} >
                            <Button variant="outlined" color='success' disabled={isSubmitting || !errors } type='submit' startIcon={<SaveIcon />}> Hinzufügen </Button>
                        </Grid>
                        <Grid item xs={8} md={6}>
                            <Button variant="outlined" color='error' disabled={isSubmitting || !errors } onClick={handleClose}  startIcon={<SaveIcon />}> Abbrechen </Button>
                        </Grid>
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

export default AddExtra