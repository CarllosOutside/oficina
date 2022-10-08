import http from "../http-common";

const findByCnpj = cnpj => {
  return http.get(`/juridicas/${cnpj}`);
};

const create = (cnpj, pessoa) =>{
    return http.post(`/juridicas?cnpj=${cnpj}`, pessoa);
};

const JuridicaServices = {
  findByCnpj,
  create
};

export default JuridicaServices;