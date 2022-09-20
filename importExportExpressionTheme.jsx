/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
Import & Export Expression Editor Themes for Adobe After Effects

Description:
Import and export syntax highlighting themes for the Adobe After Effects expression editor
added in version 16.1.

Themes are exported as JSON files with colors in either hex or RGB format.

To use imported themes, you will need to restart After Effects after importing.

I'm unsure if this script will function correctly in languages other than English.
Feel free to reach out about translations.

Themes are stored as text in the preference file:
	Win: %appdata%/Adobe/After Effects/<version>
	Mac: ~/Library/Preferences/Adobe/After Effects/<version>

Note: this script contains a polyfill for JSON stringify and parse.

Disclaimer: This script is provided "as is," without warranty of any kind, expressed or implied.
In no event shall the author be held liable for any damages arising in any way from the use of this script.

By John Colombo
Email: john@1resonant.com
version 2.0     June 3, 2019
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

( function ( thisObj ) {
	if ( typeof JSON !== 'object' ) {
		JSON = {};
	}
	( function () {
		'use strict';

		function f( n ) {
			// Format integers to have at least two digits.
			return n < 10 ? '0' + n : n;
		}
		if ( typeof Date.prototype.toJSON !== 'function' ) {
			Date.prototype.toJSON = function () {
				return isFinite( this.valueOf() ) ?
					this.getUTCFullYear() + '-' +
					f( this.getUTCMonth() + 1 ) + '-' +
					f( this.getUTCDate() ) + 'T' +
					f( this.getUTCHours() ) + ':' +
					f( this.getUTCMinutes() ) + ':' +
					f( this.getUTCSeconds() ) + 'Z' :
					null;
			};
			String.prototype.toJSON =
				Number.prototype.toJSON =
				Boolean.prototype.toJSON = function () {
					return this.valueOf();
				};
		}
		var cx, escapable, gap, indent, meta, rep;

		function quote( string ) {
			// If the string contains no control characters, no quote characters, and no
			// backslash characters, then we can safely slap some quotes around it.
			// Otherwise we must also replace the offending characters with safe escape
			// sequences.
			escapable.lastIndex = 0;
			return escapable.test( string ) ? '"' + string.replace( escapable, function ( a ) {
				var c = meta[ a ];
				return typeof c === 'string' ?
					c :
					'\\u' + ( '0000' + a.charCodeAt( 0 ).toString( 16 ) ).slice( -4 );
			} ) + '"' : '"' + string + '"';
		}

		function str( key, holder ) {
			// Produce a string from holder[key].
			var i, // The loop counter.
				k, // The member key.
				v, // The member value.
				length, mind = gap,
				partial, value = holder[ key ];
			// If the value has a toJSON method, call it to obtain a replacement value.
			if ( value && typeof value === 'object' &&
				typeof value.toJSON === 'function' ) {
				value = value.toJSON( key );
			}
			// If we were called with a replacer function, then call the replacer to
			// obtain a replacement value.
			if ( typeof rep === 'function' ) {
				value = rep.call( holder, key, value );
			}
			// What happens next depends on the value's type.
			switch ( typeof value ) {
				case 'string':
					return quote( value );
				case 'number':
					// JSON numbers must be finite. Encode non-finite numbers as null.
					return isFinite( value ) ? String( value ) : 'null';
				case 'boolean':
				case 'null':
					// If the value is a boolean or null, convert it to a string. Note:
					// typeof null does not produce 'null'. The case is included here in
					// the remote chance that this gets fixed someday.
					return String( value );
					// If the type is 'object', we might be dealing with an object or an array or
					// null.
				case 'object':
					// Due to a specification blunder in ECMAScript, typeof null is 'object',
					// so watch out for that case.
					if ( !value ) {
						return 'null';
					}
					// Make an array to hold the partial results of stringifying this object value.
					gap += indent;
					partial = [];
					// Is the value an array?
					if ( Object.prototype.toString.apply( value ) === '[object Array]' ) {
						// The value is an array. Stringify every element. Use null as a placeholder
						// for non-JSON values.
						length = value.length;
						for ( i = 0; i < length; i += 1 ) {
							partial[ i ] = str( i, value ) || 'null';
						}
						// Join all of the elements together, separated with commas, and wrap them in
						// brackets.
						v = partial.length === 0 ?
							'[]' :
							gap ?
							'[\n' + gap + partial.join( ',\n' + gap ) + '\n' + mind + ']' :
							'[' + partial.join( ',' ) + ']';
						gap = mind;
						return v;
					}
					// If the replacer is an array, use it to select the members to be stringified.
					if ( rep && typeof rep === 'object' ) {
						length = rep.length;
						for ( i = 0; i < length; i += 1 ) {
							if ( typeof rep[ i ] === 'string' ) {
								k = rep[ i ];
								v = str( k, value );
								if ( v ) {
									partial.push( quote( k ) + ( gap ? ': ' : ':' ) + v );
								}
							}
						}
					} else {
						// Otherwise, iterate through all of the keys in the object.
						for ( k in value ) {
							if ( Object.prototype.hasOwnProperty.call( value, k ) ) {
								v = str( k, value );
								if ( v ) {
									partial.push( quote( k ) + ( gap ? ': ' : ':' ) + v );
								}
							}
						}
					}
					// Join all of the member texts together, separated with commas,
					// and wrap them in braces.
					v = partial.length === 0 ?
						'{}' :
						gap ?
						'{\n' + gap + partial.join( ',\n' + gap ) + '\n' + mind + '}' :
						'{' + partial.join( ',' ) + '}';
					gap = mind;
					return v;
			}
		}
		// If the JSON object does not yet have a stringify method, give it one.
		if ( typeof JSON.stringify !== 'function' ) {
			escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
			meta = {
				'\b': '\\b',
				'\t': '\\t',
				'\n': '\\n',
				'\f': '\\f',
				'\r': '\\r',
				'"': '\\"',
				'\\': '\\\\'
			};
			JSON.stringify = function ( value, replacer, space ) {
				// The stringify method takes a value and an optional replacer, and an optional
				// space parameter, and returns a JSON text. The replacer can be a function
				// that can replace values, or an array of strings that will select the keys.
				// A default replacer method can be provided. Use of the space parameter can
				// produce text that is more easily readable.
				var i;
				gap = '';
				indent = '';
				// If the space parameter is a number, make an indent string containing that
				// many spaces.
				if ( typeof space === 'number' ) {
					for ( i = 0; i < space; i += 1 ) {
						indent += ' ';
					}
					// If the space parameter is a string, it will be used as the indent string.
				} else if ( typeof space === 'string' ) {
					indent = space;
				}
				// If there is a replacer, it must be a function or an array.
				// Otherwise, throw an error.
				rep = replacer;
				if ( replacer && typeof replacer !== 'function' &&
					( typeof replacer !== 'object' ||
						typeof replacer.length !== 'number' ) ) {
					throw new Error( 'JSON.stringify' );
				}
				// Make a fake root object containing our value under the key of ''.
				// Return the result of stringifying the value.
				return str( '', {
					'': value
				} );
			};
		}
		// If the JSON object does not yet have a parse method, give it one.
		if ( typeof JSON.parse !== 'function' ) {
			cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
			JSON.parse = function ( text, reviver ) {
				// The parse method takes a text and an optional reviver function, and returns
				// a JavaScript value if the text is a valid JSON text.
				var j;

				function walk( holder, key ) {
					// The walk method is used to recursively walk the resulting structure so
					// that modifications can be made.
					var k, v, value = holder[ key ];
					if ( value && typeof value === 'object' ) {
						for ( k in value ) {
							if ( Object.prototype.hasOwnProperty.call( value, k ) ) {
								v = walk( value, k );
								if ( v !== undefined ) {
									value[ k ] = v;
								} else {
									delete value[ k ];
								}
							}
						}
					}
					return reviver.call( holder, key, value );
				}
				// Parsing happens in four stages. In the first stage, we replace certain
				// Unicode characters with escape sequences. JavaScript handles many characters
				// incorrectly, either silently deleting them, or treating them as line endings.
				text = String( text );
				cx.lastIndex = 0;
				if ( cx.test( text ) ) {
					text = text.replace( cx, function ( a ) {
						return '\\u' +
							( '0000' + a.charCodeAt( 0 ).toString( 16 ) ).slice( -4 );
					} );
				}
				// In the second stage, we run the text against regular expressions that look
				// for non-JSON patterns. We are especially concerned with '()' and 'new'
				// because they can cause invocation, and '=' because it can cause mutation.
				// But just to be safe, we want to reject all unexpected forms.
				// We split the second stage into 4 regexp operations in order to work around
				// crippling inefficiencies in IE's and Safari's regexp engines. First we
				// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
				// replace all simple value tokens with ']' characters. Third, we delete all
				// open brackets that follow a colon or comma or that begin the text. Finally,
				// we look to see that the remaining characters are only whitespace or ']' or
				// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
				if ( /^[\],:{}\s]*$/
					.test( text.replace( /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@' )
						.replace( /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']' )
						.replace( /(?:^|:|,)(?:\s*\[)+/g, '' ) ) ) {
					// In the third stage we use the eval function to compile the text into a
					// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
					// in JavaScript: it can begin a block or an object literal. We wrap the text
					// in parens to eliminate the ambiguity.
					j = eval( '(' + text + ')' );
					// In the optional fourth stage, we recursively walk the new structure, passing
					// each name/value pair to a reviver function for possible transformation.
					return typeof reviver === 'function' ?
						walk( {
							'': j
						}, '' ) :
						j;
				}
				// If the text is not JSON parseable, then a SyntaxError is thrown.
				throw new SyntaxError( 'JSON.parse' );
			};
		}
	}() );

	scriptBuildUI( thisObj );

	/* UI Builder Functions */
	function scriptBuildUI( thisObj ) {

		var uiStrings = {
			titleBar: "Import & Export Expression Editor Themes",
			themesListBoxTitle: "Current Themes:",
			refreshThemesListBtnText: "Refresh Theme List",
			importBtnText: "Import Theme(s)",
			importBtnToopTip: "Import color themes from .json files. You will need to restart After Effects in order to use newly-imported themes.",
			exportBtnText: "Export Selected Theme(s)",
			exportBtnToolTip: "Exported selected themes from the list. If only one file is selected, you may rename the file before exporting. If more than one theme is selected, each .json file will have the same name as the theme.",
			exportAsTitleText: "Export Theme As: ",
			exportAsRgbText: "RGB",
			exportAsHexText: "Hex",
		};

		var win = ( thisObj instanceof Panel ) ? thisObj : new Window( "palette", uiStrings.titleBar, undefined, {
			resizeable: true
		} );

		win.alignChildren = [ "fill", "fill" ];
		win.spacing = 10;
		win.orientation = "row"

		var themesListBoxGroup = win.add( "group" );
		themesListBoxGroup.alignChildren = [ "fill", "fill" ];
		themesListBoxGroup.orientation = "column";
		themesListBoxGroup.spacing = 5;

		var themesListBoxTitle = themesListBoxGroup.add( "statictext", undefined, uiStrings.themesListBoxTitle );
		themesListBoxTitle.alignment = "left";

		var themesListBox = themesListBoxGroup.add( "listbox", undefined, getThemes(), {
			multiselect: true
		} );
		themesListBox.selection = 0;

		var btnGroup = win.add( "group" );
		btnGroup.alignChildren = [ "fill", "fill" ];
		btnGroup.orientation = "column"

		var importThemesBtn = btnGroup.add( "button", undefined, uiStrings.importBtnText );
		importThemesBtn.helpTip = uiStrings.importBtnToopTip;

		importThemesBtn.onClick = function () {
			importThemes();

			this.active = true;
			this.active = false;

			var fetchThemes = getThemes();

			themesListBox.removeAll();

			for ( var i = 0, il = fetchThemes.length; i < il; i++ ) {
				themesListBox.add( "item", fetchThemes[ i ] );
			}

			themesListBox.revealItem( themesListBox.items.length - 1 );
		};

		var exportThemesBtn = btnGroup.add( "button", undefined, uiStrings.exportBtnText );
		exportThemesBtn.helpTip = uiStrings.exportBtnToolTip;

		exportThemesBtn.onClick = function () {
			exportThemes( themesListBox.selection, exportAsRgbRadio.value );

			this.active = true;
			this.active = false;
		};

		var exportAsRadioGrp = btnGroup.add( "group" );
		exportAsRadioGrp.orientation = "column"

		var exportAsTitle = exportAsRadioGrp.add( "statictext", undefined, uiStrings.exportAsTitleText );
		themesListBoxTitle.alignment = "left";

		var exportRadioGrp = exportAsRadioGrp.add( "group" );

		var exportAsRgbRadio = exportRadioGrp.add( "radiobutton", undefined, uiStrings.exportAsRgbText );
		exportAsRgbRadio.value = true;
		var exportAsHexRadio = exportRadioGrp.add( "radiobutton", undefined, uiStrings.exportAsHexText );

		win.onResizing = win.onResize = function () {
			this.layout.resize();
		};

		if ( win instanceof Window ) {
			win.center();
			win.show();
		} else {
			win.layout.layout( true );
			win.layout.resize();
		}
	}

	/* Main Functions */
	function exportThemes( themeListBoxSelection, exportRgb ) {
		var exportStrings = {
			forWriteFilesCheck: "Exporting a theme",
			forSaveDialog: "Choose a location to save your exported theme(s).",
			forSaveDialogAllThemes: "All themes will be saved here as .json"
		}

		if ( !writingFilesEnabled( exportStrings.forWriteFilesCheck ) ) {
			return null;
		}

		// Hard-coded starting in the user Documents folder here, not ideal
		var fileForSave = new File( [
			"~",
			"Documents",
			( themeListBoxSelection.length > 1 ) ? exportStrings.forSaveDialogAllThemes : themeListBoxSelection[ 0 ].text + ".json",
		].join( "/" ) );

		var saveLocation = fileForSave.saveDlg( exportStrings.forSaveDialog )

		var themeColorValuePrefs = [
			"Syntax Highlighting - Color - BraceBad B",
			"Syntax Highlighting - Color - BraceBad G",
			"Syntax Highlighting - Color - BraceBad R",
			"Syntax Highlighting - Color - BraceLight B",
			"Syntax Highlighting - Color - BraceLight G",
			"Syntax Highlighting - Color - BraceLight R",
			"Syntax Highlighting - Color - Comment B",
			"Syntax Highlighting - Color - Comment G",
			"Syntax Highlighting - Color - Comment R",
			"Syntax Highlighting - Color - Identifier B",
			"Syntax Highlighting - Color - Identifier G",
			"Syntax Highlighting - Color - Identifier R",
			"Syntax Highlighting - Color - IndentGuide B",
			"Syntax Highlighting - Color - IndentGuide G",
			"Syntax Highlighting - Color - IndentGuide R",
			"Syntax Highlighting - Color - Keyword B",
			"Syntax Highlighting - Color - Keyword G",
			"Syntax Highlighting - Color - Keyword R",
			"Syntax Highlighting - Color - LineNumbers B",
			"Syntax Highlighting - Color - LineNumbers G",
			"Syntax Highlighting - Color - LineNumbers R",
			"Syntax Highlighting - Color - Number B",
			"Syntax Highlighting - Color - Number G",
			"Syntax Highlighting - Color - Number R",
			"Syntax Highlighting - Color - Operator B",
			"Syntax Highlighting - Color - Operator G",
			"Syntax Highlighting - Color - Operator R",
			"Syntax Highlighting - Color - Selection Back A",
			"Syntax Highlighting - Color - Selection Back B",
			"Syntax Highlighting - Color - Selection Back G",
			"Syntax Highlighting - Color - Selection Back R",
			"Syntax Highlighting - Color - String B",
			"Syntax Highlighting - Color - String G",
			"Syntax Highlighting - Color - String R",
			"Theme - Color - Background B",
			"Theme - Color - Background G",
			"Theme - Color - Background R",
			"Theme - Color - Default B",
			"Theme - Color - Default G",
			"Theme - Color - Default R",
		];

		var themeToExport;
		var themeSectionName;
		var themeColorValues;
		var themeColorsObj;
		var rgbArray;
		var splitPrefName;
		var syntaxType;
		var colorChannel;
		var themeNameForFile;

		for ( var t = 0, tl = themeListBoxSelection.length; t < tl; t++ ) {
			themeToExport = themeListBoxSelection[ t ].text;

			themeSectionName = [
				"Expression Editor Theme (v9)",
				themeToExport,
			].join( " - " );

			themeColorValues = [];

			for ( var i = themeColorValuePrefs.length - 1; i >= 0; i-- ) {
				themeColorValues.push(
					app.preferences.getPrefAsFloat(
						themeSectionName,
						themeColorValuePrefs[ i ],
						PREFType.PREF_Type_MACHINE_SPECIFIC,
					)
				)
			}

			themeColorValues.reverse();

			themeColorsObj = {
				ThemeName: themeToExport,
			};

			rgbArray = [];

			for ( var j = themeColorValuePrefs.length - 1; j >= 0; j-- ) {
				splitPrefName = themeColorValuePrefs[ j ].split( " " ).reverse();
				syntaxType = ( splitPrefName[ 1 ] === "Back" ) ? "Selection" : splitPrefName[ 1 ];
				colorChannel = splitPrefName[ 0 ];

				addToObject( themeColorsObj, [ syntaxType, colorChannel ], themeColorValues[ j ] );
			}

			if ( !exportRgb ) { // Export as hex values instead
				themeColorsObjHex = {};

				for ( var k in themeColorsObj ) {
					if ( k === "ThemeName" ) {
						themeColorsObjHex[ k ] = themeColorsObj[ k ];
						continue;
					}

					if ( themeColorsObj[ k ].hasOwnProperty( "A" ) ) {
						themeColorsObjHex[ k ] = {
							color: rgbToHex(
								themeColorsObj[ k ].R,
								themeColorsObj[ k ].G,
								themeColorsObj[ k ].B,
							),
							alpha: themeColorsObj[ k ].A,
						}
						continue;
					}

					themeColorsObjHex[ k ] = rgbToHex(
						themeColorsObj[ k ].R,
						themeColorsObj[ k ].G,
						themeColorsObj[ k ].B,
					);
				}

				themeColorsObj = themeColorsObjHex;
			}

			themeNameForFile = [
				themeToExport,
				".json",
			].join( "" );

			writeToFile(
				( themeListBoxSelection.length > 1 ) ? new File( [ saveLocation.parent, themeNameForFile, ].join( "/" ) ) : saveLocation,
				JSON.stringify( themeColorsObj, null, "\t" ),
				"w",
			);
		}
	}

	function importThemes() {
		var importStrings = {
			forWriteFilesCheck: "Importing a theme",
			forImportDialog: "Select a theme to import.",
			existingThemeHeader: "Overwrite Existing Theme?",
			existingThemeErrA: "A color theme named",
			existingThemeErrB: "already exists. Overwrite?",
		}

		if ( !writingFilesEnabled( importStrings.forWriteFilesCheck ) ) {
			return null;
		}

		var importThemesObj = {};
		var existingThemes = getThemes();

		existingThemes.unshift( "Custom" );

		var fileFilter = ( system.osName === "MacOS" ) ? null : "All files:*.*";

		var themeImportFiles = File.openDialog( importStrings.forImportDialog, fileFilter, true );

		for ( var i = 0, il = themeImportFiles.length; i < il; i++ ) {
			var themeFile = themeImportFiles[ i ];

			themeFile.open( "r" );

			var readTheme = themeFile.read();

			var themeObj = JSON.parse( readTheme );

			themeFile.close();

			var themeName = themeObj.ThemeName;

			var overwriteExistingTheme = true;
			var importedThemeIsHex = typeof themeObj.Default === "string";

			if ( arrayIndexOf( existingThemes, themeName ) !== -1 ) {
				overwriteExistingTheme = confirm( [
					importStrings.existingThemeErrA,
					"\"" + themeName + "\"",
					importStrings.existingThemeErrB,
				].join( " " ), true, importStrings.existingThemeHeader );
			}

			var rgbObj;

			if ( overwriteExistingTheme ) {
				importThemesObj[ themeName ] = {};

				for ( var k in themeObj ) {
					if ( k !== "ThemeName" ) {
						if ( importedThemeIsHex ) {
							if ( k === "Selection" ) {
								rgbObj = hexToRgb( themeObj[ k ].color );

								addToObject( importThemesObj, [ themeName, k, "A", ], themeObj[ k ].alpha );
							} else {
								rgbObj = hexToRgb( themeObj[ k ] )
							}

							addToObject( importThemesObj, [ themeName, k, "R", ], rgbObj.r );
							addToObject( importThemesObj, [ themeName, k, "G", ], rgbObj.g );
							addToObject( importThemesObj, [ themeName, k, "B", ], rgbObj.b );
						} else {
							importThemesObj[ themeName ][ k ] = themeObj[ k ];
						}
					}
				}
			}
		}

		var prefsColorStringPrefixA = "Syntax Highlighting - Color -";
		var prefsColorStringPrefixB = "Theme - Color -";

		var appendThemes = existingThemes;

		var themeSection;
		var themeSectionName;
		var themeKeyValues;
		var themeKeyName;

		for ( var m in importThemesObj ) {
			themeSection = m;

			if ( arrayIndexOf( existingThemes, themeSection ) === -1 ) {
				appendThemes.push( themeSection );
			}

			themeSectionName = [
				"Expression Editor Theme (v9)",
				themeSection,
			].join( " - " );

			for ( var n in importThemesObj[ m ] ) {
				themeKeyValues = importThemesObj[ m ][ n ];

				for ( var p in themeKeyValues ) {
					if ( n === "Default" || n === "Background" ) {
						themeKeyName = [
							prefsColorStringPrefixB,
							n,
							p,
						].join( " " )
					} else if ( n === "Selection" ) {
						themeKeyName = [
							prefsColorStringPrefixA,
							[
								n,
								"Back"
							].join( " " ),
							p,
						].join( " " );
					} else {
						themeKeyName = [
							prefsColorStringPrefixA,
							n,
							p,
						].join( " " );
					}

					app.preferences.savePrefAsString(
						themeSectionName,
						themeKeyName,
						themeKeyValues[ p ].toFixed( 6 ),
						PREFType.PREF_Type_MACHINE_SPECIFIC );
				}
			}
		}

		app.preferences.savePrefAsString(
			"Expression Editor Settings (v9)",
			"Expression Theme List",
			appendThemes.join( "\u001F" ),
			PREFType.PREF_Type_MACHINE_SPECIFIC, );

		app.preferences.saveToDisk();
		app.preferences.reload();
	}

	/* Helper Functions */
	function getThemes() {
		var themeList = app.preferences.getPrefAsString(
			"Expression Editor Settings (v9)",
			"Expression Theme List",
			PREFType.PREF_Type_MACHINE_SPECIFIC, ).split( "\u001F" );

		themeList.shift();

		return themeList;
	}

	function addToObject( obj, arr, val ) {

		if ( typeof arr === 'string' )
			arr = arr.split( "." );

		obj[ arr[ 0 ] ] = obj[ arr[ 0 ] ] || {};

		var tmpObj = obj[ arr[ 0 ] ];

		if ( arr.length > 1 ) {
			arr.shift();
			addToObject( tmpObj, arr, val );
		} else
			obj[ arr[ 0 ] ] = val;

		return obj;
	}

	function componentToHex( c ) {
		var hex = c.toString( 16 );
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex( r, g, b ) {
		return "#" + componentToHex( r * 255 ) + componentToHex( g * 255 ) + componentToHex( b * 255 );
	}

	function hexToRgb( hex ) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
		return result ? {
			b: preciseRound( parseInt( result[ 3 ], 16 ) / 255, 6 ),
			g: preciseRound( parseInt( result[ 2 ], 16 ) / 255, 6 ),
			r: preciseRound( parseInt( result[ 1 ], 16 ) / 255, 6 ),
		} : null;
	}

	function preciseRound( value, decimals ) {
		return Number( Math.round( value + 'e' + decimals ) + 'e-' + decimals );
	}

	function writeToFile( fileObj, fileContent, writeType, encoding ) {
		encoding = ( encoding !== undefined ) ? encoding : "utf-8";
		fileObj = ( fileObj instanceof File ) ? fileObj : new File( fileObj );

		var parentFolder = fileObj.parent;

		if ( !parentFolder.exists && !parentFolder.create() ) {
			var noParentErr = "Cannot create file in path "; // needs localization

			throw new Error( [
				noParentErr,
				fileObj.fsName
			].join( "" ) );
		}

		fileObj.encoding = encoding;
		fileObj.open( writeType, "TEXT" );
		fileObj.seek( 0, 2 );
		fileObj.writeln( fileContent );
		fileObj.close();

		return fileObj;
	}

	function writingFilesEnabled( attemptedActionString ) {
		var errStrings = {
			errLineOne: [
				attemptedActionString,
				"requires the scripting security preference to be set."
			].join( " " ),
			errLineTwoStart: "Go to the",
			errLineTwoEnd: "section of your application preferences, and make sure that \"Allow Scripts to Write Files and Access Network\" is checked.",
			sectionGeneral: "\"General\"",
			sectionScripting: "\"Scripting & Expressions\""
		}

		var version12Check = (
			parseFloat( app.version ) > 12.0 ||
			( parseFloat( app.version ) === 12.0 &&
				app.buildNumber >= 264 ) ||
			app.version.substring( 0, 5 ) !== "12.0x" );

		var mainSectionStr = ( version12Check ) ? "Main Pref Section v2" : "Main Pref Section";

		var version16Check = ( parseFloat( app.version ) > 16.0 );

		var securitySetting = app.preferences.getPrefAsLong( mainSectionStr, "Pref_SCRIPTING_FILE_NETWORK_SECURITY" );

		var errSecuritySetting = [
			errStrings.errLineOne,
			[ errStrings.errLineTwoStart, ( version16Check ) ? errStrings.sectionScripting : errStrings.sectionGeneral, errStrings.errLineTwoEnd ].join( " " )
		].join( "\n" )

		if ( securitySetting === 0 ) {
			alert( errSecuritySetting );
			( version16Check ) ? app.executeCommand( 3131 ): app.executeCommand( 2359 );
		}

		return ( securitySetting === 1 );
	}

	function arrayIndexOf( arr, searchElement, fromIndex ) {
		var k;
		if ( arr === null ) throw new TypeError( '"this" is null or not defined' );
		var o = Object( arr );
		var len = o.length >>> 0;
		if ( len === 0 ) return -1;
		var n = fromIndex | 0;
		if ( n >= len ) return -1;
		k = Math.max( n >= 0 ? n : len - Math.abs( n ), 0 );
		while ( k < len ) {
			if ( k in o && o[ k ] === searchElement ) return k;
			k++;
		}
		return -1;
	}

} )( this );