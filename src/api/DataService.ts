import Axios from 'axios-observable';
import { timeout, retry } from 'rxjs/operators';

const axiosObs = Axios.create({
  baseURL: 'api/',
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

const DataService = {
  request: (endPoint: string, body: any) => {
    const rOptions = { url: endPoint, data: null };
    rOptions.data = body ? rOptions.data : body;

    return axiosObs.request(rOptions).pipe(
      timeout(3000), // after 3s abort
      retry(2), // retry 2x.
    );
  }
};

Object.freeze(DataService);
export default DataService;