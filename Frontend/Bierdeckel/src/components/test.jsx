import React, { useContext, useState } from 'react'

//Form
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import axios from 'axios'

//MUI
import TextField from '@material-ui/core/TextField';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

//Feedback
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { IconButton } from '@material-ui/core';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const FormikWithRef = React.forwardRef((props, ref) => (
<Formik ref={ref} {...props} />
));
  
function BasicForm()
{

    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ resCode: null, resData: null });
    const handleSubmit = async(formData) =>{

        await axios.put('http://localhost:8080/user',
        {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            userName: formData.userName,
            password: formData.password
        })
        .then(response => {//handels only status code 200-300?
            console.log(JSON.stringify(response.data))
            setState({resCode:response.status, resData:response.data})
            navigate("/Regestrieren/Erfolgreich", {replace: true});
    
    
        })
        .catch(error => {//handle response codes over 400 here
            console.log("fuck")
            console.log(error.response)
            setState({resCode:error.response.status, resData:error.response.data})
        });
    
    }

    const handleOpen = () => {
        setOpen(true);
        };
    
    const handleClose = () => {
        setOpen(false);
        };

    const validationSchema = yup.object({
        description: yup.string().required("Pflichtfeld").min(3).max(20, "Max Länge 20"),
        price: yup.string().required("Pflichtfeld").min(3,"Min. 3 Zeichen").max(20, "Max 20 Zeichen"),
        stock: yup.string().required("Pflichtfeld").max(20, "Max Länge 20"),
        consumption: yup.string().required("Pflichtfeld").min(8, "Passwort muss min. 8 Zeichen haben").max(256, "Password darf max. 256 Zeichen haben"),

    })

    const {resCode, resData} = state;
    
    return(
        <div>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal

        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background:"white", border:"solid 2px" }}
        open={open}
        onClose={handleClose}
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
                consumption:'',
            }
        }
        validationSchema={validationSchema}
        onSubmit={async(data, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                //Post From
                await handleSubmit(data); //async call
                setSubmitting(false);
                // resetForm(true);

            }
        }

    >
        {
            ({ values, errors, isSubmitting, touched }) => (
                <Form className="Form-Container"  >
                    <Grid container direction="row" alignItems="center" spacing={2}>
                        <Grid xs={2}>
                            <Field variant="outlined" label="Bezeichung" name="description" type="input" error={!!errors.description && !!touched.description} helperText={!!touched.description && !!errors.description && String(errors.description)} as={TextField} />
                        </Grid>
                        <Grid  xs={2}>
                            <Field variant="outlined" label="Preis" name="price" type="number" error={!!errors.price && !!touched.price} helperText={!!touched.price && !!errors.price && String(errors.price)} as={TextField} />
                        </Grid>
                        <Grid  xs={2}>
                            <Field variant="outlined" label="Stück" name="stock" type="number" error={!!errors.stock && !!touched.stock} helperText={!!touched.stock && !!errors.stock && String(errors.stock)} as={TextField} />
                        </Grid>
                        <Grid  xs={2}>
                            <Field variant="outlined" label="Verbraucht" name="consumption" type="number" error={!!errors.consumption && !!touched.consumption} helperText={!!touched.consumption && !!errors.consumption && String(errors.consumption)} as={TextField} />
                        </Grid>
                        <Grid  xs={1}>
                            <IconButton  disabled={isSubmitting || !errors} type='submit'> <AddIcon sx={{ color: 'green' }}/> </IconButton>
                        </Grid>
                    </Grid>
                </Form>
            )
        }
    </FormikWithRef>
    </Modal>
    </div>
    )
}

export default BasicForm