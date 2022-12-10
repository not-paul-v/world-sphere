/**
 * Source: https://github.dev/mrdoob/three.js/blob/dev/examples/jsm/utils/BufferGeometryUtils.js
 */

import {
	BufferAttribute,
	BufferGeometry,
    InterleavedBufferAttribute,
} from 'three';

/**
 * @param  {Array<BufferGeometry>} geometries
 * @param  {Boolean} useGroups
 * @return {BufferGeometry}
 */
export function mergeBufferGeometries( geometries: BufferGeometry[], useGroups: boolean = false ): BufferGeometry {

	const isIndexed = geometries[ 0 ].index !== null;

	const attributesUsed = new Set( Object.keys( geometries[ 0 ].attributes ) );
	const morphAttributesUsed = new Set( Object.keys( geometries[ 0 ].morphAttributes ) );

	const attributes: {
        [name: string]: (BufferAttribute | InterleavedBufferAttribute)[]
    } = {};
	const morphAttributes: {
        [name: string]: (BufferAttribute | InterleavedBufferAttribute)[][]
    } = {};

	const morphTargetsRelative = geometries[ 0 ].morphTargetsRelative;

	const mergedGeometry = new BufferGeometry();

	let offset = 0;

	for ( let i = 0; i < geometries.length; ++ i ) {

		const geometry = geometries[ i ];
		let attributesCount = 0;

		// ensure that all geometries are indexed, or none

		if ( isIndexed !== ( geometry.index !== null ) ) {
			throw new Error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.' );
		}

		// gather attributes, exit early if they're different

		for ( const name in geometry.attributes ) {

			if ( ! attributesUsed.has( name ) ) {
				throw new Error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.' );
			}

            if (!attributes[name]) {
                attributes[name] = [];
            }

			attributes[name].push(geometry.attributes[name]);

			attributesCount ++;

		}

		// ensure geometries have the same number of attributes

		if ( attributesCount !== attributesUsed.size ) {

			throw new Error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. Make sure all geometries have the same number of attributes.' );
		}

		// gather morph attributes, exit early if they're different

		if ( morphTargetsRelative !== geometry.morphTargetsRelative ) {

			throw new Error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. .morphTargetsRelative must be consistent throughout all geometries.' );
		}

		for ( const name in geometry.morphAttributes ) {

			if ( ! morphAttributesUsed.has( name ) ) {

				throw new Error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '.  .morphAttributes must be consistent throughout all geometries.' );
			}

            if (!morphAttributes[name]) {
                morphAttributes[name] = [];
            }

			morphAttributes[name].push( geometry.morphAttributes[ name ] );

		}
	}

	// merge indices

	if ( isIndexed ) {

		let indexOffset = 0;
		const mergedIndex = [];

		for ( let i = 0; i < geometries.length; ++ i ) {

			const index = geometries[ i ].index;

            if (!index)
                continue;

			for ( let j = 0; j < index.count; ++ j ) {

				mergedIndex.push( index.getX( j ) + indexOffset );

			}

			indexOffset += geometries[ i ].attributes.position.count;

		}

		mergedGeometry.setIndex( mergedIndex );

	}

	// merge attributes

	for ( const name in attributes ) {
        let bufferAttributes;

        try {
            bufferAttributes = attributes[name] as BufferAttribute[];
        } catch (error) {
            throw new Error("Got invalid attribute type: Received InterleavedBufferAttribute, expected BufferAttribute");
        }

        const mergedAttribute = mergeBufferAttributes(bufferAttributes);

		if ( ! mergedAttribute ) {

			throw new Error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' attribute.' );
		}

		mergedGeometry.setAttribute( name, mergedAttribute );

	}

	// merge morph attributes

	for ( const name in morphAttributes ) {

		const numMorphTargets = morphAttributes[ name ][ 0 ].length;

		if ( numMorphTargets === 0 ) break;

		mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
		mergedGeometry.morphAttributes[ name ] = [];

		for ( let i = 0; i < numMorphTargets; ++ i ) {

			const morphAttributesToMerge = [];

			for ( let j = 0; j < morphAttributes[ name ].length; ++ j ) {

				morphAttributesToMerge.push( morphAttributes[ name ][ j ][ i ] );

			}

            let morphBufferAttributes;

            try {
                morphBufferAttributes = morphAttributesToMerge as BufferAttribute[];
            } catch (error) {
                throw new Error("Got invalid attribute type: Received InterleavedBufferAttribute, expected BufferAttribute");
            }

			const mergedMorphAttribute = mergeBufferAttributes(morphBufferAttributes);

			if ( ! mergedMorphAttribute ) {

				throw new Error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' morphAttribute.' );
			}

			mergedGeometry.morphAttributes[ name ].push( mergedMorphAttribute );

		}

	}

	return mergedGeometry;

}

/**
 * @param {Array<BufferAttribute>} attributes
 * @return {BufferAttribute}
 */
function mergeBufferAttributes( attributes: BufferAttribute[] ): BufferAttribute {

	let TypedArray: any;
	let itemSize: number | undefined;
	let normalized;
	let arrayLength = 0;

	for ( let i = 0; i < attributes.length; ++ i ) {

		const attribute = attributes[ i ];
        if (('isInterleavedBufferAttribute' in attribute)) {
            throw new Error('THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.');
        }

		if ( TypedArray === undefined ) TypedArray = attribute.array.constructor as ArrayBufferConstructor;
		if ( TypedArray !== attribute.array.constructor ) {

			throw new Error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.' );
		}

		if ( itemSize === undefined ) itemSize = attribute.itemSize;
		if ( itemSize !== attribute.itemSize ) {

			throw new Error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.' );
		}

		if ( normalized === undefined ) normalized = attribute.normalized;
		if ( normalized !== attribute.normalized ) {

			throw new Error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.' );
		}

		arrayLength += attribute.array.length;

	}

    if (!TypedArray)
        throw new Error("TypedArray is undefined");

	const array = new TypedArray(arrayLength);
	let offset = 0;

	for ( let i = 0; i < attributes.length; ++ i ) {
		array.set( attributes[ i ].array, offset );
		offset += attributes[ i ].array.length;

	}

	return new BufferAttribute( array, itemSize ?? 0, normalized );

}