import http from "../http-common";

const getAll = (params) => {
  return http.get("/funcionarios",{ params });
};

const get = id => {
  return http.get(`/funcionario/${id}`);
};

const create = data => {
  return http.post("/funcionario", data);
};

const remove = id => {
  return http.delete(`/funcionario/${id}`);
};

const findByNome = nome => {
  return http.get(`/funcionarios?nome=${nome}`);
};

const FuncionarioService = {
  getAll,
  get,
  create,
  remove,
  findByNome
};

export default FuncionarioService;