import http from "../http-common";

const get = id => {
  return http.get(`/ordens/${id}`);
};

const findByPlaca = (placa, params) => {
    return http.get(`/ordens/veiculo/${placa}`, params);
  };

  const findByFuncionario = (codFuncionario, params) => {
    return http.get(`/ordens/fucionario/${codFuncionario}`, params);
  };

const create = (codFuncionario, placa) => {
  return http.post(`/ordens/${codFuncionario}/${placa}`);
};

const remove = id => {
  return http.delete(`/ordem/${id}`);
};


const OrdemService = {
  get,
  create,
  remove,
  findByPlaca,
  findByFuncionario
};

export default OrdemService;