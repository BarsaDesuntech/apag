import {
  FETCHING_PARKHOUSES,
  FETCHING_PARKHOUSES_SUCCESS,
  FETCHING_PARKHOUSES_FAILURE,
  FETCHING_PARKHOUSE,
  FETCHING_PARKHOUSE_FAILURE,
  FETCHING_PARKHOUSE_SUCCESS,
} from './constants';
import { api, pmsapi } from '../../env';

export function getParkhouses() {
  return {
    type: FETCHING_PARKHOUSES,
  };
}

export function getParkhousesSuccess(data) {
  return {
    type: FETCHING_PARKHOUSES_SUCCESS,
    parkhouses: data,
  };
}

export function getParkhousesFailure() {
  return {
    type: FETCHING_PARKHOUSES_FAILURE,
  };
}

export function fetchParkhouses(params) {
  return (dispatch, getState) => {
    dispatch(getParkhouses());
    return fetch(pmsapi + '/api/v1/parkobjects/usage', {
      headers: {
        Authorization:
          'Bearer SFMyNTY.g2gDbQAAAAExbgYAIrQzaY0BYiWYBgA.2B29Ge7e9zVzty_mBR_ZcEujJlFnOgF60GV5QOKKsc4',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (typeof responseJson.code === typeof undefined) {
          return dispatch(
            getParkhousesSuccess(Object.values(responseJson?.data)),
          );
        } else {
          return dispatch(getParkhousesFailure());
        }
      })
      .catch(() => {
        return dispatch(getParkhousesFailure());
      });
  };
}

export function getParkhouse(params) {
  return {
    type: FETCHING_PARKHOUSE,
  };
}

export function getParkhouseSuccess(data) {
  console.log('data ......', data);

  return {
    type: FETCHING_PARKHOUSE_SUCCESS,
    parkhouse: data,
  };
}

export function getParkhouseFailure() {
  return {
    type: FETCHING_PARKHOUSE_FAILURE,
  };
}

export function fetchParkhouse(params) {
  return (dispatch, getState) => {
    dispatch(getParkhouse());
    return fetch(api + 'parkobjekt/' + params)
      .then(response => response.json())
      .then(responseJson => {
        if (typeof responseJson.code === typeof undefined) {
          return dispatch(getParkhouseSuccess(responseJson));
        } else {
          return dispatch(getParkhouseFailure());
        }
      })
      .catch(() => {
        return dispatch(getParkhouseFailure());
      });
  };
}
