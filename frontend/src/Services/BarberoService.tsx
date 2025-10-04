import axios from 'axios';

const URL_BASE = "http://localhost:8080/barberos";

class BarberoService {
    findAll(){
        return axios.get(URL_BASE);
    }

    findById(idBarbero: number){
        return axios.get(URL_BASE + '/' + idBarbero);
    }

    create(barbero: object, idSucursal: number){
        return axios.post(URL_BASE + '/sucursal/' + idSucursal, barbero);
    }

    update(idBarbero: number, barbero: object){
        return axios.put(URL_BASE + '/' + idBarbero, barbero);
    }

    delete(idBarbero: number){
        return axios.delete(URL_BASE + '/' + idBarbero);
    }


    findBySucursal(idSucursal: number){
        return axios.get(URL_BASE + '/sucursal/' + idSucursal);
    }
}

export default new BarberoService();