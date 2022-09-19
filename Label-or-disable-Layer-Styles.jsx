(function () {
	// Update this number to the label you want for layers with Layer Styles.
	// 4 corresponds to Pink in the default layer styles, but may not if you've
	// customized the label colors.
	var labelForLayerStyledLayers = 4;

	// Local globals
	var keyState = ScriptUI.environment.keyboardState;
	var modKeyHeld = keyState.metaKey || keyState.ctrlKey;
	var comp =app.project.activeItem instanceof CompItem
		? app.project.activeItem
		: null;

	if (!comp) {
		alert("Please select or open a composition containing layers with layer styles.");
		return 1;
	}

	function forAllItemsInArray(itemArray, doSomething) {
		for (var i = 0, il = itemArray.length; i < il; i++) {
			var thisItem = itemArray[i];
			doSomething(thisItem);
		}
	}

	function forAllLayersOfComp(thisComp, doSomething) {
		for (var i = 1, il = thisComp.layers.length; i <= il; i++) {
			var thisLayer = thisComp.layers[i];
			doSomething(thisLayer);
		}
	}

	function forAllSelectedLayersElseAll(thisComp, doSomething) {
		if (thisComp.selectedLayers.length === 0) {
			forAllLayersOfComp(thisComp, doSomething);
		} else {
			forAllItemsInArray(thisComp.selectedLayers, doSomething);
		}
	}

	function layerHasEnabledLayerStyles(aLayer) {
		return (
			aLayer.property("ADBE Layer Styles").canSetEnabled &&
			aLayer.property("ADBE Layer Styles").enabled
		);
	}

	if (modKeyHeld) {
		app.beginUndoGroup("Disable Layer Styles");
	} else {
		app.beginUndoGroup("Label Layer Styles an Obnoxious Color");
	}

	forAllSelectedLayersElseAll(comp, function (eachLayer) {
		try {
			if (layerHasEnabledLayerStyles(eachLayer)) {
				if (modKeyHeld) {
					eachLayer.property("ADBE Layer Styles").enabled = false;
				} else {
					eachLayer.label = labelForLayerStyledLayers;
				}
			}
		} catch (e) {
			// Log a message that a layer was skipped, probably because it
			// does't have a Layer Styles group e.g. a Camera layer.
			writeLn("Skipped layer: " + eachLayer.name);
		}
	});

	app.endUndoGroup();

	if (app.activeViewer) {
		app.activeViewer.setActive();
	}
})();
