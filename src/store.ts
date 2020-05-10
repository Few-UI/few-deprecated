/* eslint-env es6 */

import lodashSet from 'lodash/set';
import lodashUnset from 'lodash/unset';

import {
    DataStore,
    Action
} from './types';

import {
    getValue,
    parseDataPath,
    isObject
} from './utils';


/**
 * Get data patch based on dispatch action
 * action could be:
 * {
 *     scope: 'data.myApp',
 *     path: 'prop.value',
 *     value: 'myValue'
 * }
 * or:
 * {
 *     scope: 'data.myApp',
 *     value: {
 *         'prop.value': 'myValue',
 *         'prop.title': 'myTitle'
 *     }
 * }
 * @param data scope for evaluation
 * @param action dispatch action input
 * @returns patch
 */
export function getPatch( data: DataStore, action: Action ): DataStore {
    let res = {};
    if( action.path === undefined ) {
        const scope = action.scope;
        if( typeof action.value === 'object' ) {
            for( let path in action.value ) {
                const value = action.value[ path ];
                path = scope ? `${scope}.${path}` : path;
                if( getValue( data, path ) !== value ) {
                    res[ path ] = value;
                }
            }
        }
    } else {
        const path = action.scope && action.path ? `${action.scope}.${action.path}` : action.scope || action.path;
        const value = action.value;
        if( path ) {
            if( getValue( data, path ) !== value ) {
                res[ path ] = value;
            }
        } else if( path === '' && typeof value === 'object' ) {
            res = data !== value ? value : {};
        } else {
            // logically if path is always string this is not needed
            throw Error( 'getPatch: Invalid path!' );
        }
    }
    return res;
}

/**
 * Update data by specific path
 * @param patch patch on data like { 'a.b': 3, 'c': 4 }
 * @param data data for patching to like { a: { b: 2 }, c: 1 }
 * @returns updated data as mutation result
 */
export const patchData = ( patch: DataStore, data: DataStore ): DataStore =>
    Object.entries( patch ).reduce( ( data, [ path, value ] ) =>
        value === undefined ? lodashUnset( data, path ) && data || data : lodashSet( data, path, value )
    , data );


/**
 * Update data. Only works for immutable framework
 * action could be:
 * {
 *     path: 'prop.uiValue',
 *     value: 'myValue'
 * }
 * or:
 * {
 *     value: {
 *         'prop.value': 'my name',
 *         'prop.internal_value': 'my_name'
 *     }
 * }
 * @param updateFn view update function
 * @returns updateFn accepts data and action
 */
export const createReducer = ( updateFn ) => ( data, action ): DataStore => {
    const patch = getPatch( data, action );
    return  Object.keys( patch ).length > 0  ? updateFn( patch, data ) : data;
};

/**
 * reducer for react Reducer hook, return 'immutable' object when value change
 * @param data data object
 * @param action action as { path, value }
 * @returns reducer function used for react hook
 */
export const reducer = createReducer( ( patch, data ) => ( { ...patchData( patch, data ) } ) );

/**
 * compose key-dispatch function map to one dispatch function
 * @param {object} dispatchFnMap dispatch function map as { ctx: updateCtx, data: updateData }
 * @returns {object} function pair dispatch and getDispatch
 */
export const composeDispatch = ( dispatchFnMap ): any => {
    const getDispatch = ( dataPath, updateFn = ( action?: any ) => null ) => {
        const { scope, path } = parseDataPath( dataPath );
        // TODO: error out for last branch
        updateFn = updateFn || dispatchFnMap[ scope ];

        return path ? ( action ) => {
            action.scope = action.scope ? `${path}.${action.scope}` : path;
            return updateFn( action );
        } : updateFn;
    };

    const dispatch = action => {
        const actions: any[] = [];
        if( action.scope ) {
            // this is needed for { scope: 'data.test', value: { path1: value1, path2: value2 } }
            actions.push( action );
        } else if( action.path === undefined ) {
            // re-assemble value to data and ctx
            // TODO: we can be more smart to identify the scope cluster more accurately
            // for eample if we have data.a.b and data.a.c, can we set the scope to data.a so that we can
            // save more performance
            const values = action.value;
            const patchMap = Object.entries( values ).reduce(  ( res, [ dataPath, value ] ) => {
                const { scope, path } = parseDataPath( dataPath );
                res[ scope ] = res[ scope ] || {};
                res[ scope ][ path ] = value;
                return res;
            }, {} );
            Object.entries( patchMap ).forEach( ( [ scope, value ] ) => actions.push( { scope, value } ) );
        } else {
            // re-evaluate scope to get data or ctx. Actually if scope has value we dont' have to
            const value = action.value;
            const dataPath = action.scope && action.path ? `${action.scope}.${action.path}` : action.scope || action.path;
            const { scope, path } = parseDataPath( dataPath );
            // path should be exist in this else branch, need to maintain that intention
            actions.push( { scope, path : path || '', value } );
        }
        actions.forEach( action => getDispatch( action.scope )( { ...action, scope: undefined } ) );
    };


    return { dispatch, getDispatch };
};
