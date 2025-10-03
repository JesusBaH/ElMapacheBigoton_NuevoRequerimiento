import axios from 'axios';
const URL_BASE = "http://localhost:8080/sucursales";

class SucursalService {
    findAll(){
        return axios.get(URL_BASE);
    }
    findById(idSucursal : number){
        return axios.get(URL_BASE +'/'+ idSucursal);
    }

    create(sucursal: object){
        return axios.post(URL_BASE, sucursal);
    }
    update(idSucursal: number, sucursal: object){
        return axios.put(URL_BASE + '/' + idSucursal, sucursal);
    }
    delete(idSucursal: number){
        return axios.delete(URL_BASE + '/' + idSucursal);
    }

}
export default new SucursalService();

