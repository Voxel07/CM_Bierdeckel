import React, { useEffect, useState, useRef } from 'react'

//Form
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import axios from 'axios'

//MUI
import TextField from '@material-ui/core/TextField';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { Container, Typography } from '@mui/material';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveIcon from '@mui/icons-material/Save';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
//Feedback
import { AlertsManager , AlertsContext } from '../../utils/AlertsManager';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
      '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
        '& input:-webkit-autofill': {
            WebkitBoxShadow: "0px  0px  24px  0px rgba(0,  0,  0,  0.75)"
          }
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



const AddProduct = ((props) =>
{
    const alertsManagerRef =  useRef(AlertsContext);
    const [open, setOpen] = useState(false);
    const descriptionRef = useRef();

    const handleSubmit = async(formData, { resetForm }) =>{

        await axios.post('http://localhost:8080/products',
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
        consumption: yup.number("Numerischer Wert").min(0, "Nope").required("Pflichtfeld"),
        shortInfo: yup.string().min(10, "min. 10 Zeichen")
        detailedInfo: yup.string().min(30, "min. 30 Zeichen")
    })

    const classes = useStyles();

    const FormikWithRef = React.forwardRef((props, ref) => (
        <Formik {...props} />
      ));

    return(
        <div>
        <AlertsManager ref={alertsManagerRef} />
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpen}>Neues Produkt hinzufügen</Button >
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
                    <Typography >Neues Produkt hinzufügen</Typography>
                </div>

                <Form className="Form-Container" sx={{...style}} >
                    <Grid container direction="row" alignItems="center" spacing={1}>
                        <Grid xs={8}>
                            <Field inputRef={descriptionRef}  autoFocus variant="outlined" label="Bezeichung" name="description" type="input" error={!!errors.description && !!touched.description} helperText={!!touched.description && !!errors.description ? String(errors.description): ' '} as={TextField} />
                        </Grid>
                        <Grid  xs={4}>
                            <Field className={classes.root} variant="outlined" label="Preis" name="price" type="tel" error={!!errors.price && !!touched.price} helperText={!!touched.price && !!errors.price ? String(errors.price):' '} as={TextField}  InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment>,}}/>
                        </Grid>
                        <Grid  xs={6}>
                            <Field className={classes.root} variant="outlined" label="Stück" name="stock" type="tel" error={!!errors.stock && !!touched.stock} helperText={!!touched.stock && !!errors.stock ? String(errors.stock):' '} as={TextField} />
                        </Grid>
                        <Grid  xs={6}>
                            <Field  className={classes.root} variant="outlined" label="Verbraucht" name="consumption" type="tel" error={!!errors.consumption && !!touched.consumption} helperText={!!touched.consumption && !!errors.consumption ? String(errors.consumption):' '} as={TextField} />
                        </Grid>
                        <Grid  xs={6}>
                            <Field  className={classes.root} variant="outlined" label="KurzInfo" name="info" type="input" error={!!errors.shortInfo && !!touched.shortInfo} helperText={!!touched.shortInfo && !!errors.shortInfo ? String(errors.shortInfo):' '} as={TextField} />
                        </Grid>
                        <Grid  xs={6}>
                            <Field  className={classes.root} variant="outlined" label="Allergietabelle" name="detailedInfo" type="input" error={!!errors.detailedInfo && !!touched.detailedInfo} helperText={!!touched.detailedInfo && !!errors.detailedInfo ? String(errors.detailedInfo):' '} as={TextField} />
                        </Grid>
                        <Grid container spacing={1} sx={{ flexGrow: 1 }} justify="space-between" >
                        <Grid xs={8} md={6} >
                            <Button variant="outlined" color='success' disabled={isSubmitting || !errors } type='submit' startIcon={<SaveIcon />}> Hinzufügen </Button>
                        </Grid>
                        <Grid xs={8} md={6}>
                            <Button variant="outlined" color='error' disabled={isSubmitting || !errors } onClick={handleClose}  startIcon={<SaveIcon />}> Abbrechen </Button>
                        </Grid>
                        <Grid>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            >
                            Upload file
                            <VisuallyHiddenInput type="file" />
                        </Button>
                        </Grid>
                        </Grid>
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