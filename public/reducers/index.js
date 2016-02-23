import { combineReducers } from 'redux';
import { dataIndex } from './dataIndex';
import { connectionState } from './connectionState';

export default combineReducers({dataIndex, connectionState});
