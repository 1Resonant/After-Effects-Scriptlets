/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
Script for Adobe After Effects
Run with a File > Run Script..., KBar, Quickmenu, etc.

How To Use:
For adding tasteful noise to your comp. Creates a comp-size Shape layer filled with 50% grey,
set to the Overlay blend mode with a Noise HLS Auto effect applied. The Shape layer's Opacity
is set to 10% and its PSR are locked to help avoid accidental shifting. The Noise HSL Auto is
set to the comp's framerate with all the noise in the Lightness channel.

After running the script, hit 'SS' to reveal the Shape's Opacity and dial in the amount of noise.

Disclaimer: This script is provided "as is," without warranty of any kind, expressed or implied.
In no event shall the author be held liable for any damages arising in any way from the use of this script.

By John Colombo
Email: john@1resonant.com
version 1.0     March 2, 2018
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

(function addNoiseLayer () {
    
    app.beginUndoGroup("Add Noise Layer");
	addingNoiseLayer();
	app.endUndoGroup();
    if (app.activeViewer) {
        app.activeViewer.setActive();
    }
    
    function addingNoiseLayer () {
        var comp = getActiveComp();
        var shapeLayer = comp.layers.addShape();  
        var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");  
        var myShape = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect"); 
        myShape.property("ADBE Vector Rect Size").setValue([comp.width, comp.height]);

        shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");  
        shapeGroup.property("Contents").property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([.5,.5,.5,1]);
        
        var myScale = shapeLayer.property("ADBE Transform Group").property("ADBE Scale").valueAtTime(comp.time, false).toString();
        var myScaExp = "[" + myScale + "]";

        var myPos = shapeLayer.property("ADBE Transform Group").property("ADBE Position").valueAtTime(comp.time, false).toString();
        var myPosExp = "[" + myPos + "]";

        var myRota = shapeLayer.property("ADBE Transform Group").property("ADBE Rotate Z").valueAtTime(comp.time, false).toString();
        var myRotaExp = "[" + myRota + "]";

        shapeLayer.property("ADBE Transform Group").property("ADBE Scale").expression = myScaExp;
        shapeLayer.property("ADBE Transform Group").property("ADBE Position").expression = myPosExp;
        shapeLayer.property("ADBE Transform Group").property("ADBE Rotate Z").expression = myRotaExp;              
        
        var noiseEffect = shapeLayer.effect.addProperty("ADBE Noise HLS Auto2");
        noiseEffect.property(3).setValue(100);
        noiseEffect.property(6).expression = "1/thisComp.frameDuration;";
        
        shapeLayer.blendingMode = BlendingMode.OVERLAY;
        shapeLayer.name = "Noise HSL Overlay";
        shapeLayer.label = 0;
        shapeLayer.property("ADBE Transform Group").property("ADBE Opacity").setValue(10);
        shapeLayer.property("ADBE Transform Group").property("ADBE Opacity").selected = true;
    }
    
    
    //HELPER FUNCTIONS from Zack Lovatt//
    
    function getActiveComp () {
		var thisComp = app.project.activeItem;
		if (thisComp === null || !(isComp(thisComp))){
			alert("Please select a composition!");
			return null;
		}
		return thisComp;
	}
    
    function isComp (item) {
		return item instanceof CompItem;
	}
    
})();