import axios from "axios";

// wrapper around axios
// to support requests from server and client.
// todo: get fresh access tokens
export default req => {
  const options = {};
  if (req) {
    options.headers = { Cookie: req.headers.cookie };
    options.baseURL = `${req.protocol}://${req.get("Host")}/api/`;
  } else {
    options.baseURL = "api/";
  }
  return axios.create(options);
};

export const serialize = axiosResponse => axiosResponse.data;
