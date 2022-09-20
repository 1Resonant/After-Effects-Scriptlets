/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
Script for Adobe After Effects
Run with a File > Run Script..., KBar, Quickmenu, etc.

How To Use:
Select a Shape layer or Shape groups in the Timeline and run the script to 
remove any groups that don't contain a path (parametric or bezier) will be
removed. If you have selected Shape groups instead a layer, empty groups
will only be removed from the selected groups.

Disclaimer: This script is provided "as is," without warranty of any kind, expressed or implied.
In no event shall the author be held liable for any damages arising in any way from the use of this script.

By John Colombo
Email: john@1resonant.com
version 1.0     May 22, 2018
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

(function () {
    var comp = getActiveComp();

    if (comp) {
        app.beginUndoGroup("Delete Empty Groups")
        findAndRemoveEmptyGroups(comp);
        app.endUndoGroup();
        if (app.activeViewer) {
            app.activeViewer.setActive();
        }
    }
    
    function findAndRemoveEmptyGroups(comp) {
        forAllItemsInArray(comp.selectedLayers, function (layer) {
            if (layer instanceof ShapeLayer) {
                if (layer.selectedProperties.length == 0) {
                    markEmptyGroups(layer);
                } else {
                    forAllItemsInArray(layer.selectedProperties, function (prop) {
                        if (isPropGroup(prop) && prop.matchName == "ADBE Vector Group") {
                            if (!groupContainsPath(prop)) {
                                prop.name = prop.name + "deletethisgroup";
                            }
                            markEmptyGroups(prop);
                        } else {
                            markEmptyGroups(prop);
                        }
                    });
                }
                removeMarkedShapeGroups(layer);
            }
        });
    }

    function markEmptyGroups(sourcePropGroup) {
        forAllPropsInGroup(sourcePropGroup, function (prop) {
            if (isPropGroup(prop)) {
                if (prop.matchName == "ADBE Vector Group") {
                    if (!groupContainsPath(prop)) {
                        prop.name = prop.name + "deletethisgroup";
                    }
                    markEmptyGroups(prop);
                } else {
                    markEmptyGroups(prop);
                }
            }
        });
    }

    function groupContainsPath(group) {
        var containsPath,
            findNames = [
                "ADBE Vector Shape - Rect",     //parametric rectangle
                "ADBE Vector Shape - Ellipse",  //parametric ellipse
                "ADBE Vector Shape - Star",     //parametric polygon/star
                "ADBE Vector Shape - Group",    //path group
                "ADBE Vector Shape"             //path
            ];

        if (group("Contents").numProperties === 0) {
            containsPath = false;
        } else {
            for (var i = 1, il = group("Contents").numProperties; i <= il; i++) {
                var prop = group("Contents")(i);

                if (prop.matchName == "ADBE Vector Group") {
                    containsPath = (groupContainsPath(prop))
                    if (containsPath) {
                        break;
                    }
                } else {
                    if (arrayIndexOf(findNames, prop.matchName) == -1) {
                        containsPath = false;
                    } else {
                        containsPath = true;
                        break;
                    }
                }
            }
        }
        return containsPath;
    }

    function removeMarkedShapeGroups(sourcePropGroup) {
        for (var i = 1; i <= sourcePropGroup.numProperties; i++) {
            var prop = sourcePropGroup(i);

            if (isPropGroup(prop)) {
                if (prop.name.match("deletethisgroup")) {
                    prop.remove();
                    i--;
                } else {
                    removeMarkedShapeGroups(prop);
                }
            }
        }
    }

    // HELPER FUNCTIONS from Zack Lovatt //

    function isComp (item) {
		return item instanceof CompItem;
	}

    function getActiveComp () {
		var thisComp = app.project.activeItem;
		if (thisComp === null || !(isComp(thisComp))){
			alert("Please select a composition!");
			return null;
		}
		return thisComp;
	}

    function forAllPropsInGroup(propGroup, doSomething) {
        for (var i = 1, il = propGroup.numProperties; i <= il; i++) {
            var thisProp = propGroup.property(i);
            doSomething(thisProp);
        }
    }

    function isPropGroup(prop) {
        if (prop.propertyType === PropertyType.INDEXED_GROUP ||
            prop.propertyType === PropertyType.NAMED_GROUP ||
            prop.dimensionsSeparated)
            return true;
        return false;
    }

    function forAllItemsInArray(itemArray, doSomething) {
        for (var i = 0, il = itemArray.length; i < il; i++) {
            var thisItem = itemArray[i];
            doSomething(thisItem);
        }
    }

    function arrayIndexOf(arr, searchElement, fromIndex) {
        var k;
        if (arr === null) throw new TypeError('"this" is null or not defined');
        var o = Object(arr);
        var len = o.length >>> 0;
        if (len === 0) return -1;
        var n = fromIndex | 0;
        if (n >= len) return -1;
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in o && o[k] === searchElement) return k;
            k++;
        }
        return -1;
    }
})();