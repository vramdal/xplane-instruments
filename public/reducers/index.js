import { combineReducers } from 'redux';
import { dataIndex } from './dataIndex';
import { connectionState } from './connectionState';
import { dataRef } from './dataRef';

export default combineReducers({dataIndex, connectionState, dataRef});
