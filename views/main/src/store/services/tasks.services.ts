import Axios from 'axios-observable';
import { map } from 'rxjs/operators';

/** Сервис получения списка задач */
export const getTasks = () => {
  return Axios.get('https://jsonplaceholder.typicode.com/todos?_limit=20')
    .pipe(map(data => data.data));
};
