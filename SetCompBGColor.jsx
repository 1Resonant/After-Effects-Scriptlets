/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
Set Composition Background Script for Adobe After Effects
Designed for use with KBar - https://aescripts.com/kbar/

Description:
Change the background of the active composition in After Effects with one click.
Assign this script to a KBar button and hold modifier keys to select a background color.

Functions: ( by default )
	No Mod Keys Held:
		Sets composition background to 50% grey
	Ctrl/Cmd Held:
		Sets composition background to black
	Alt/Option Held:
		Sets composition background to white
	Shift Held:
		Toggles transparency for active composition viewer
		Hold Alt/Option to toggle all open views for a composition

Feel free to set your own colors in the "colorOptions" object by changing the "name" and "rgbArray" parameters.

Disclaimer: This script is provided "as is," without warranty of any kind, expressed or implied.
In no event shall the author be held liable for any damages arising in any way from the use of this script.

By John Colombo
Email: john@1resonant.com
version 2.0     Nov 26, 2018
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

( function setCompBackground() {
	// Check for held keyboard modifiers
	var keyState = ScriptUI.environment.keyboardState;

	// Get the activeItem if it's a composition
	var comp = ( app.project.activeItem instanceof CompItem ) ? app.project.activeItem : null;

	// If there is no active composition, alert the user and exit this script
	if ( !comp ) {
		alert( "Please select a composition before attempting to set a background color." );
		return null;
	}

	// Set Colors Here
	var colorOptions = {
		"defaultColor": {
			"name": "50% Grey",
			"rgbArray": [ .5, .5, .5 ]
		},
		"ctrlCmdColor": {
			"name": "Black",
			"rgbArray": [ 0, 0, 0 ]
		},
		"altOptColor": {
			"name": "White",
			"rgbArray": [ 1, 1, 1 ]
		}
	}

	/**
	 * Function to set the composition's background 
	 *
	 * @param { object } colorObj - an object containing a string and an array of RGB values between 0 and 1.
	 * @param { CompItem } comp - a composition to back its background modified
	 */
	function setCompBG( colorObj, comp ) {
		app.activeViewer.views[ app.activeViewer.activeViewIndex ].options.checkerboards = false;
		app.beginUndoGroup( "Change Composition Background to " + colorObj.name + "" );
		comp.bgColor = colorObj.rgbArray;
		app.endUndoGroup();
	}

	/**
	 * Function to toggle the transparency of the active viewer ( or all viewers with Alt/Option held )
	 *
	 * @param { Keyboard state object } keystate - an object reporting the active state of the keyboard at any time
	 */
	function toggleTransparency( keystate ) {
		var viewer = app.activeViewer;
		var allViews = viewer.views;
		var activeIndex = viewer.activeViewIndex;

		if ( keyState.altKey ) {
			var activeTransp = allViews[ activeIndex ].options.checkerboards;
			var i = -1;

			while ( ++i < allViews.length ) {
				allViews[ i ].options.checkerboards = !activeTransp;
			}
		} else {
			allViews[ activeIndex ].options.checkerboards = !allViews[ activeIndex ].options.checkerboards;
		}
	}

	/* DO STUFF */

	// Set background based on which modifier key is held
	if ( keyState.shiftKey ) {
		toggleTransparency( keyState )
	} else if ( keyState.metaKey || keyState.ctrlKey ) {
		setCompBG( colorOptions.ctrlCmdColor, comp )
	} else if ( keyState.altKey ) {
		setCompBG( colorOptions.altOptColor, comp )
	} else {
		setCompBG( colorOptions.defaultColor, comp )
	}

	// Give the viewer focus
	if ( app.activeViewer ) {
		app.activeViewer.setActive();
	}

} )();