import Fetchr from 'fetchr';
import { test } from 'eater/runner';
import assert from 'power-assert';
import { createStore } from './lib/storeUtils';
import { isSameObject } from './lib/assertUtils';
import { INITIAL_STATE, loadAllMasters, loadHairColorMaster } from '../modules/masters';
import Immutable from 'seamless-immutable';

/**
 * mock loadMaster service
 */
let hairColorMaster = ['black', 'brown', 'blond'];
const services = [
  {
    name: 'areaMaster',
    read(req, resource, params, config, cb) {
      cb(null, ['tokyo', 'saitama', 'kanagawa']);
    },
  },
  {
    name: 'hairColorMaster',
    read(req, resource, params, config, cb) {
      cb(null, hairColorMaster);
    },
  },
  {
    name: 'genderMaster',
    read(req, resource, params, config, cb) {
      cb(null, ['male', 'female']);
    },
  },
  {
    name: 'hairLengthMaster',
    read(req, resource, params, config, cb) {
      cb(null, ['long', 'short', 'middle']);
    },
  },
  {
    name: 'menuContentMaster',
    read(req, resource, params, config, cb) {
      cb(null, ['menu']);
    },
  },
];

services.forEach(Fetchr.registerService);

test('master: hairColorMaster success', () => {
  const loadAllMastersAction = loadAllMasters();
  const loadHairColorMasterAction = loadHairColorMaster();
  const initialState = Immutable({ masters: INITIAL_STATE });
  const store = createStore({
    initialState,
  });
  let prevMastersState = {};
  store.dispatch(loadAllMastersAction).then(() => {
    prevMastersState = store.getState().masters;
    hairColorMaster = ['white', 'purple'];
    return store.dispatch(loadHairColorMasterAction);
  }).then(() => {
    const mastersState = store.getState().masters;
    assert.deepEqual(mastersState.hairColorMaster, {
      loading: false,
      loaded: true,
      items: hairColorMaster,
    });
    isSameObject(prevMastersState, mastersState, ['hairColorMaster']);
  });
});