# CM_Bierdeckel
A simple order management tool that has multiple pages that are intended to be used by the different stations of the ordering process. It uses Sockets to sync status upders acros multible consumers without the need for constand refresehing. 

## Architecture
### Backend
The backend is using a Quakrus Java Application that is accessed via a REST API

### Frontend
React + Vite is used to create all components and functionality. The styling is done using Material UI and does not follow any established UI/UX guidelines.

## Deployment
You can compile the Project using the included GitHub action file. Or follow the steps in the README files for FE and BE respectively.
A finised docker container ca be found on [DockerHub](https://hub.docker.com/r/voxel7/cm-bierdeckel) and srted after adding the nessesary information into the provided docker-compose.yaml file.
