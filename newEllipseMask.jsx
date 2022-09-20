/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
Script for Adobe After Effects
Run with a File > Run Script..., KBar, Quickmenu, etc.

How To Use:
Run on a selected layer or layers to create a new ellipse mask. This is equivalent to
using the Reset option in the Mask dialog while the shape is set to Ellipse.

Disclaimer: This script is provided "as is," without warranty of any kind, expressed or implied.
In no event shall the author be held liable for any damages arising in any way from the use of this script.

By John Colombo
Email: john@1resonant.com
version 1.0     March 12, 2018
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

(function newEllipseMask (){
    var comp = getActiveComp();
    
    app.beginUndoGroup("Add - Mask Ellipse");
    
    forAllSelectedLayers (comp, function (layer) {
            var deepestProp = null;
        
            deepestProp = findDeepestProp(layer);
            
            var useSourceRect = (layer instanceof TextLayer || layer instanceof ShapeLayer) ? true : false;
            var sourceRectDimensions = (useSourceRect) ? layer.sourceRectAtTime(comp.time, false) : null;
            
            var ratio = .5523;
            var t = (useSourceRect) ? sourceRectDimensions.top : 0;
            var l = (useSourceRect) ? sourceRectDimensions.left : 0;
            var h = (useSourceRect) ? sourceRectDimensions.width * .5 : layer.width * .5;
            var v = (useSourceRect) ? sourceRectDimensions.height * .5 : layer.height * .5;
            var th = h*ratio;
            var tv = v*ratio;
        
            var newMask;    
        
            if (deepestProp != null && deepestProp.matchName == "ADBE Mask Atom") {
                newMask = deepestProp;
            } else {
                newMask = layer.Masks.addProperty("ADBE Mask Atom");
                newMask.maskMode = MaskMode.ADD;
            }
            
            var myProperty = newMask.property("ADBE Mask Shape");
            var myShape = myProperty.value;
            myShape.vertices = [[l+h,t],[l,t+v],[l+h,t+(2*v)],[l+(2*h),t+v]];
            myShape.inTangents = [[th,0], [0,-tv], [-th,0], [0,tv]];
            myShape.outTangents = [[-th,0], [0,tv], [th,0], [0,-tv]];
            myShape.closed = true;
            myProperty.setValue(myShape);
        });
    
    app.endUndoGroup();
    
    if (app.activeViewer) {
        app.activeViewer.setActive();
    }
        
    function isComp (item) {
		return item instanceof CompItem;
	}
    
    /**
    * gets active composition
    * from Zack Lovatt
    * @param 
    * @returns 
    */
    function getActiveComp () {
        var thisComp = app.project.activeItem;
        if (thisComp === null || !(isComp(thisComp))){
            alert("Please select a composition!");
            return null;
        }
        return thisComp;
    }
    
    /**
    * loops through all selected layers in active comp
    * from Zack Lovatt
    * @param
    * @returns 
    */
    function forAllSelectedLayers (thisComp, doSomething) {
        if (thisComp.selectedLayers.length === 0)
            alert("Please select a layer!")
        else
            forAllItemsInArray(thisComp.selectedLayers, doSomething);
    }
    
    /**
    * loops through all items in array
    * from Zack Lovatt
    * @param
    * @returns 
    */
    function forAllItemsInArray (itemArray, doSomething) {
		for (var i = 0, il = itemArray.length; i < il; i++){
			var thisItem = itemArray[i];
			doSomething(thisItem);
		}
	}
    
    function findDeepestProp (layer) {
        var itemDepth = 0;
        var numberProps = layer.selectedProperties.length;
        var item;
        
        for (var i = 0, il = numberProps; i < il; i++) {
            if (layer.selectedProperties[i].propertyDepth > itemDepth) {
                itemDepth = layer.selectedProperties[i].propertyDepth;
                item = layer.selectedProperties[i];
            } else {
                continue;
            }
        }
        
        return item;
    }
    
})();