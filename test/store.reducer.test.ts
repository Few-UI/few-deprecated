/* eslint-env jest */

/**
 * For given action we have variation below:
 * - scope-path-value
 *   { scope: scope, path: path, value: undefined }
 *   { scope: scope, path: path, value: primitive }
 *   { scope: scope, path: path, value: object }
 *   { scope: scope, path: path.subpath, value }
 *   { scope: scope.subscope, path: path, value }
 *   { scope: scope.subscope, path: path.subpath, value }
 *
 * - path-value
 *   { path: path, value: undefined }
 *   { path: path, value: primitive }
 *   { path: path, value: object }
 *   { path: path.subpath, value }
 *
 * - scope-value
 *   { scope: scope, value: undefined }
 *   { scope: scope, value: primitive }
 *   { scope: scope, value: object }
 *   { scope: scope.subscope, value: object }
 *   { scope: scope.subscope, value: { path.subpath: val, path1.subpath1: val1 } }
 *
 * - value only
 *   { value: undefined }
 *   { value: primitive }
 *   { value: object }
 *   { value: { path.subpath: val, path1.subpath1: val1 } }
 *
 * - scope = ''
 *   { scope: '', value: undefined }
 *   { scope: '', value: primitive }
 *   { scope: '', value: object }
 *   { scope: '', path: path, value: object }
 *   { scope: '', path: path.subPath, value: object }
 *
 * - path = ''
 *   { path: '', value: undefined }
 *   { path: '', value: primitive }
 *   { path: '', value: object }
 *   { scope: '', path: '', value: object }
 *   { scope: scope, path: '', value: undefined }
 *   { scope: scope, path: '', value: primitive }
 *   { scope: scope, path: '', value: object }
 *   { scope: scope.subScope, path: '', value: object }
 *
 * - nagetive case
 *   undefined
 *   primitive
 *   object which is not action
 *   undefined data
 *   primitive data
 */

import { reducer } from '../src/store';
import { DataStore } from '../src/types';

describe( 'Test reducer for scope-path-value', () => {
    it( 'Test reducer with { scope: scope, path: path, value: undefined } (unchanged, not exist)', () => {
        const data = {
            a: {}
        };
        expect( reducer( data, { scope: 'a', path: 'a1', value: undefined } ) ).toBe( data );
    } );

    it( 'Test reducer with { scope: scope, path: path, value: undefined } (unchanged)', () => {
        const data = {
            a: {
                a1: undefined
            }
        };
        expect( reducer( data, { scope: 'a', path: 'a1', value: undefined } ) ).toBe( data );
    } );

    it( 'Test reducer with { scope: scope, path: path, value: undefined } (changed)', () => {
        const data = {
            a: {
                a1: { b: 3 }
            }
        };
        expect( reducer( data, { scope: 'a', path: 'a1', value: undefined } ) ).toStrictEqual( { a: {} } );
    } );

    it( 'Test reducer with { scope: scope, path: path, value: primitive } (unchanged)', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: 'a', path: 'a1', value: 3 } ) ).toBe( data );
    } );

    it( 'Test reducer with { scope: scope, path: path, value: primitive } (changed)', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: 'a', path: 'a1', value: 4 } ) ).toStrictEqual( { a: { a1: 4 }, b: { b1: 6 } } );
    } );

    it( 'Test reducer with { scope: scope, path: path, value: primitive } (new path)', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: 'a', path: 'a2', value: 4 } ) ).toStrictEqual( { a: { a1: 3, a2: 4 }, b: { b1: 6 } } );
    } );

    it( 'Test reducer with { scope: scope, path: path, value: object } (mutable change)', () => {
        const obj = { a11: 4 };
        const data = {
            a: {
                a1: obj
            },
            b: {
                b1: 6
            }
        };
        obj.a11 = 9;
        expect( reducer( data, { scope: 'a', path: 'a1', value: obj } ) ).toBe( data );
    } );

    it( 'Test reducer with { scope: scope, path: path, value: object } (immutable change)', () => {
        const obj = { a11: 4 };
        const data = {
            a: {
                a1: obj
            },
            b: {
                b1: 6
            }
        };
        const output = reducer( data, { scope: 'a', path: 'a1', value: { ...obj } } );
        expect( output ).not.toBe( data );
        expect( output ).toStrictEqual( data );
    } );

    it( 'Test reducer with { scope: scope, path: path.subPath, value }', () => {
        const data = {
            a: {
                a1: {
                    a11: 3
                }
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: 'a', path: 'a1.a11', value: 4 } ) ).toStrictEqual( {
            a: {
                a1: {
                    a11: 4
                }
            },
            b: {
                b1: 6
            }
        } );
    } );

    it( 'Test reducer with { scope: scope.subscope, path: path, value }', () => {
        const data = {
            a: {
                a1: {
                    a11: 3
                }
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: 'a.a1', path: 'a11', value: 4 } ) ).toStrictEqual( {
            a: {
                a1: {
                    a11: 4
                }
            },
            b: {
                b1: 6
            }
        } );
    } );

    it( 'Test reducer with { scope: scope.subscope, path: path.subpath, value }', () => {
        const data = {
            a: {
                a1: {
                    a11: {
                        a111: 4
                    }
                }
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: 'a.a1', path: 'a11.a111', value: 5 } ) ).toStrictEqual( {
            a: {
                a1: {
                    a11: {
                        a111: 5
                    }
                }
            },
            b: {
                b1: 6
            }
        } );
    } );
} );

describe( 'Test reducer for path-value', () => {
    it( 'Test reducer with { path: path, value: undefined }', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        expect( reducer( data, { path: 'a' } ) ).toStrictEqual( {} );
    } );

    it( 'Test reducer with { path: path, value: primitive } (unchanged)', () => {
        const data = { a: 5 };
        expect( reducer( data, { path: 'a', value: 5 } ) ).toBe( data );
    } );

    it( 'Test reducer with { path: path, value: primitive } (changed)', () => {
        const data = { a: 5 };
        expect( reducer( data, { path: 'a', value: 6 } ) ).toStrictEqual( { a: 6 } );
    } );

    it( 'Test reducer with { path: path, value: primitive } (new path)', () => {
        expect( reducer( { a: 5 }, { path: 'b', value: 6 } ) ).toStrictEqual( { a: 5, b: 6 } );
    } );

    it( 'Test reducer with { path: path, value: object } (mutable change)', () => {
        const obj = { b: 5 };
        const data: DataStore = {
            a: obj
        };
        data.c = 3;
        expect( reducer( data, { path: 'a', value: obj } ) ).toBe( data );
    } );

    it( 'Test reducer with { path: path, value: object } (immutable change)', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        const output = reducer( data, { path: 'a', value: { ...obj } } );
        expect( output ).not.toBe( data );
        expect( output ).toStrictEqual( data );
    } );

    it( 'Test reducer with { path: path.subpath, value } (unchanged)', () => {
        const data = {
            a: {
                b: 5
            }
        };
        expect( reducer( data, { path: 'a.b', value: 5 } ) ).toBe( data );
    } );

    it( 'Test reducer with { path: path.subpath, value } (changed)', () => {
        const data = {
            a: {
                b: 5
            }
        };
        expect( reducer( data, { path: 'a.b', value: 6 } ) ).toStrictEqual( {
            a: {
                b: 6
            }
        } );
    } );
} );

describe( 'Test reducer for scope-value', () => {
    it( 'Test reducer with { scope: scope, value: undefined }', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        expect( reducer( data, { scope: 'a' } ) ).toBe( data );
    } );

    it( 'Test reducer with { scope: scope, value: primitive }', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        expect( reducer( data, { scope: 'a', value: 5 } ) ).toBe( data );
    } );

    // Test as doc
    xit( 'Test reducer with { scope: scope, value: string }', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        const output = reducer( data, { scope: 'a', value: 'bc' } );
        expect( output ).not.toBe( data );
        expect( output ).toStrictEqual( {
            a: {
                b: 5,
                0: 'b',
                1: 'c'
            }

        } );
    } );

    it( 'Test reducer with { scope: scope, value: object } (unchanged)', () => {
        const data = {
            a: {
                a1: 3,
                a2: 4
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: 'a', value: { a1: 3, a2: 4 } } ) ).toBe( data );
    } );

    it( 'Test reducer with { scope: scope, value: object } (changed)', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: 'a', value: { a1: 3, a2: 4, a3: 5 } } ) ).toStrictEqual( {
            a: {
                a1: 3,
                a2: 4,
                a3: 5
            },
            b: {
                b1: 6
            }
        } );
    } );

    it( 'Test reducer with { scope: scope.subscope, value: object } (changed)', () => {
        const data = {
            a: {
                a1: {
                    a11: 3
                }
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: 'a.a1', value: { a11: 3, a12: 4, a13: 5 } } ) ).toStrictEqual( {
            a: {
                a1: {
                    a11: 3,
                    a12: 4,
                    a13: 5
                }
            },
            b: {
                b1: 6
            }
        } );
    } );

    it( 'Test reducer with { scope: scope.subscope, value: { path.subpath: val } } (changed)', () => {
        const data = {
            a: {
                a1: {
                    a11: {
                        a111: 3,
                        a112: 4
                    }
                }
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: 'a.a1', value: { 'a11.a111': 3, 'a11.a112': 5 } } ) ).toStrictEqual( {
            a: {
                a1: {
                    a11: {
                        a111: 3,
                        a112: 5
                    }
                }
            },
            b: {
                b1: 6
            }
        } );
    } );
} );

describe( 'Test getPatch for value only', () => {
    it( 'Test reducer with { value: undefined }', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { value: undefined } ) ).toBe( data );
    } );

    it( 'Test reducer with { value: primitive }', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { value: true } ) ).toBe( data );
    } );

    // test as doc
    xit( 'Test reducer with { value: string }', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        const output = reducer( data, { value: 'ab' } );
        expect( output ).not.toBe( data );
        expect( output ).toStrictEqual( {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            },
            0: 'a',
            1: 'b'
        } );
    } );

    it( 'Test reducer with { value: object } (unchanged)', () => {
        const data = {
            a: 5,
            b: 6
        };
        expect( reducer( data, { value: { a: 5, b: 6 } } ) ).toBe( data );
    } );

    it( 'Test reducer with { value: object } (changed)', () => {
        const data = {
            a: 5,
            b: 6
        };
        expect( reducer( data, { value: { a: 4, b: 5 } } ) ).toStrictEqual( { a: 4, b: 5 } );
    } );

    it( 'Test reducer with { value: object } (partial update)', () => {
        const data = {
            a: 5,
            b: 6
        };
        expect( reducer( data, { value: { a: 5, b: 5 } } ) ).toStrictEqual( { a: 5, b: 5 } );
    } );

    it( 'Test reducer with { value: { path.subpath: val, path1.subpath1: val1 } }', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { value: { 'a.a1': 3, 'b.b1': undefined } } ) ).toStrictEqual( { a: { a1: 3 }, b: {} } );
    } );
} );

describe( 'Test reducer for scope = \'\'', () => {
    it( 'Test reducer with { scope = \'\', value: undefined }', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: '', value: undefined } ) ).toBe( data );
    } );

    it( 'Test reducer with { scope = \'\', value: primitive }', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: '', value: true } ) ).toBe( data );
    } );

    it( 'Test reducer with { scope = \'\', value: object } (unchanged)', () => {
        const data = {
            a: 5,
            b: 6
        };
        expect( reducer( data, { scope: '', value: { a: 5, b: 6 } } ) ).toBe( data );
    } );

    it( 'Test reducer with { scope = \'\', value: object } (changed)', () => {
        const data = {
            a: 5,
            b: 6
        };
        expect( reducer( data, { scope: '', value: { a: 4, b: 5 } } ) ).toStrictEqual( { a: 4, b: 5 } );
    } );

    it( 'Test reducer with { scope = \'\', value: object } (partial update)', () => {
        const data = {
            a: 5,
            b: 6
        };
        expect( reducer( data, { scope: '', value: { a: 5, b: 5 } } ) ).toStrictEqual( { a: 5, b: 5 } );
    } );

    it( 'Test reducer with { scope = \'\', value: { path.subpath: val, path1.subpath1: val1 } }', () => {
        const data = {
            a: {
                a1: 3
            },
            b: {
                b1: 6
            }
        };
        expect( reducer( data, { scope: '', value: { 'a.a1': 3, 'b.b1': undefined } } ) ).toStrictEqual( {
            a: {
                a1: 3
            },
            b: {}
        } );
    } );
} );

describe( 'Test reducer for path = \'\'', () => {
    xit( 'Test reducer with {  path: \'\', value: undefined }', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        expect( reducer( data, { path: '', value: undefined } ) ).toBe( data );
    } );

    xit( 'Test reducer with {  path: \'\', value: primitive }', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        expect( reducer( data, { path: '', value: 3 } ) ).toBe( data );
    } );

    it( 'Test reducer with { path: \'\', value: object } (mutable change)', () => {
        const obj = { b: 5 };
        const data: DataStore = {
            a: obj
        };
        data.c = 3;
        expect( reducer( data, { path: '', value: data } ) ).toBe( data );
    } );

    it( 'Test reducer with { path: \'\', value: object } (immutable change)', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        const output = reducer( data, { path: '', value: { ...data } } );
        expect( output ).not.toBe( data );
        expect( output ).toStrictEqual( data );
    } );

    // revisitme -pengw
    // HINT: This use case has side effect - it will make { 'a.a1': 3 } to { a: { a1: 3 } }
    // to achieve it 100% same, we may need { '': { 'a.a1': 3 } }
    // but for use case { 'a.a1': 3 }, event _.get will have side effect
    // For now leave it  as it is
    it( 'Test reducer with { path: \'\', value: { path.subpath: val } }', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        expect( reducer( data, { path: '', value: { 'a.a1': 3 } } ) ).toStrictEqual( {
            a: {
                a1: 3,
                b: 5
            }
        } );
    } );

    // This case is ambiguous...test as doc for now
    it( 'Test reducer with { scope: scope, path: \'\', value: undefined }', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        expect( reducer( data, { scope: 'a', path: '', value: undefined } ) ).toStrictEqual( {} );
    } );

    // This case is ambiguous...test as doc for now
    it( 'Test reducer with { scope: scope, path: \'\', value: primitive }', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        expect( reducer( data, { scope: 'a', path: '', value: 5 } ) ).toStrictEqual( { a: 5 } );
    } );

    it( 'Test reducer with { scope: scope, path: \'\', value: object }', () => {
        const obj = { b: 5 };
        const data = {
            a: obj
        };
        const output = reducer( data, { scope: 'a', path: '', value: { ...obj } } );
        expect( output ).not.toBe( data );
        expect( output ).toStrictEqual( data );
    } );

    it( 'Test reducer with { scope: scope.subscope, path: \'\', value: object }', () => {
        const obj = { b: 5 };
        const data = {
            a: {
                a1: obj
            }
        };
        const output = reducer( data, { scope: 'a.a1', path: '', value: { ...obj } } );
        expect( output ).not.toBe( data );
        expect( output ).toStrictEqual( data );
    } );
} );
