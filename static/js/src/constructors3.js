var SS = SS || {};
SS.constructors = {};
SS.preview = {};
SS.modifier = {};

SS.GeomNodeUpdater = function(geomNode) {
    var geomNode = geomNode, that = this;

    evented(this);

    var updateTreeview = function() {
        Object.keys(geomNode.origin).map(function(key) {
            $('#' + key).val(geomNode.origin[key]);
        });
        Object.keys(geomNode.parameters).map(function(key) {
            $('#' + key).val(geomNode.parameters[key]);
        });
    }

    var updateFromTreeView = function() {
        Object.keys(geomNode.origin).map(function(key) {
            geomNode.origin[key] = parseFloat($('#' + key).val());
        });
        Object.keys(geomNode.parameters).map(function(key) {
            geomNode.parameters[key] = parseFloat($('#' + key).val());
        });
        that.fire({type: 'updatedFromTree'});
    }

    this.setOrigin = function(origin) {
        geomNode.origin = {x: origin.x, y:origin.y, z:origin.z};
	updateTreeview();
        that.fire({type: 'updatedFromCursoid'});
    }

    this.setParams = function(params, extra) {
        Object.keys(params).map(function(key) {
            geomNode.parameters[key] = params[key];
        });
        geomNode.extra = extra;

	updateTreeview();
        that.fire({type: 'updatedFromCursoid'});
    }

    this.setMeta = function(meta) {
        geomNode.meta = meta;
        that.fire({type: 'updatedFromCursoid'});
    }

    var init = function() {
        Object.keys(geomNode.origin).map(function(key) {
            $('#' + key).change(updateFromTreeView);
        });
        Object.keys(geomNode.parameters).map(function(key) {
            $('#' + key).change(updateFromTreeView);
        });
        updateTreeview();
    }
    
    init();
}

SS.modifier.Origin = function(spec) {
    var geomNode = spec.geomNode, updater = spec.updater, cursoid = spec.cursoid;
    
    var setOrigin = function(event) {
	updater.setOrigin({x: event.position.x,
                           y: event.position.y,
                           z: event.position.z});
    }

    var setCursoid = function() {
        cursoid.setPosition(geomNode.origin);
    }

    this.dispose = function() {
	cursoid.off('cursoidUpdated', setOrigin);
        updater.off('updatedFromTree', setCursoid);
    }

    var init = function() {
        cursoid.on('cursoidUpdated', setOrigin);
        updater.on('updatedFromTree', setCursoid);
        setCursoid();
    }

    init();
}

SS.modifier.Radius = function(spec) {
    var geomNode = spec.geomNode, updater = spec.updater, cursoid = spec.cursoid;
    
    var setR = function(event) {
        var dx = event.position.x - geomNode.origin.x;
        var dy = event.position.y - geomNode.origin.y;
        var angle = Math.atan2(dy, dx);
	var r  = parseFloat(Math.sqrt(dx*dx + dy*dy).toFixed(3));
	updater.setParams({r: r}, {angle: angle});
    }

    var setCursoid = function() {
        var angle = (geomNode.extra && geomNode.extra.angle) || 0;
        var position = {x: geomNode.origin.x + geomNode.parameters.r*Math.cos(angle),
		        y: geomNode.origin.y + geomNode.parameters.r*Math.sin(angle),
		        z: geomNode.origin.z};
        cursoid.setPosition(position, 'no_z');
    }

    this.dispose = function() {
	cursoid.off('cursoidUpdated', setR);
        updater.off('updatedFromTree', setCursoid);
    }

    var init = function() {
        cursoid.on('cursoidUpdated', setR);
        updater.on('updatedFromTree', setCursoid);
        setCursoid();
    }
    init();
}

SS.modifier.MajorMinorRadii = function(spec) {
    var geomNode = spec.geomNode, updater = spec.updater, cursoid = spec.cursoid;
    
    var setR1R2 = function(event) {
	var r1 = event.position.x - geomNode.origin.x;
	var r2 = event.position.y - geomNode.origin.y;
	updater.setParams({r1: r1, r2:r2});
    }

    var setCursoid = function() {
        var position = {x: geomNode.origin.x + geomNode.parameters.r1,
		        y: geomNode.origin.y + geomNode.parameters.r2,
		        z: geomNode.origin.z};
        cursoid.setPosition(position, 'no_z');
    }

    this.dispose = function() {
	cursoid.off('cursoidUpdated', setR1R2);
        updater.off('updatedFromTree', setCursoid);
    }

    var init = function() {
        cursoid.on('cursoidUpdated', setR1R2);
        updater.on('updatedFromTree', setCursoid);
        setCursoid();
    }
    init();
}


SS.preview.dimTextMaterial 
    = new THREE.MeshBasicMaterial({ color: 0x66A1D2, opacity: 0.8, wireframe: false } );
SS.preview.dimLineMaterial 
    = new THREE.LineBasicMaterial({ color: 0x66A1D2, opacity: 0.5, wireframe : true });
SS.preview.arrowMaterial 
    = new THREE.MeshBasicMaterial({ color: 0x66A1D2, opacity: 0.5 });

SS.preview.createDimArrow = function(value, angle) {
    var r1DimensionGeom = new THREE.Geometry();
    r1DimensionGeom.vertices.push(
	new THREE.Vertex(new THREE.Vector3(0,0,0)));
    r1DimensionGeom.vertices.push(
	new THREE.Vertex(new THREE.Vector3(value, 0, 0)));
    var line = new THREE.Line(r1DimensionGeom, SS.constructors.lineMaterial);
    
    var arrowGeometry = new THREE.Geometry();
    arrowGeometry.vertices.push(
	new THREE.Vertex(new THREE.Vector3(0, 0, 0)));
    arrowGeometry.vertices.push(
	new THREE.Vertex(new THREE.Vector3(-3, 1, 0)));
    arrowGeometry.vertices.push(
	new THREE.Vertex(new THREE.Vector3(-3, -1, 0)));
    
    var arrowFace = new THREE.Face3(0,1,2);
    arrowGeometry.faces.push(arrowFace);
    arrowGeometry.computeCentroids();
    arrowGeometry.computeFaceNormals();
    
    var arrowFace = new THREE.Face3(0,1,2);
    arrowGeometry.faces.push(arrowFace);
    arrowGeometry.computeCentroids();
    arrowGeometry.computeFaceNormals();
    var arrow =  new THREE.Mesh(arrowGeometry, SS.preview.arrowMaterial);
    arrow.position.x = value;
    arrow.doubleSided = true;
    
    var text = SS.preview.createDimText(value);
    var normalisedAngle = (angle + 2*Math.PI) % (2*Math.PI);
    if ((normalisedAngle > Math.PI/4) && (normalisedAngle < Math.PI*5/4)) {
	text.position.x = value/2;
	text.position.y = 1;

    } else {
	text.position.x = value/2;
	text.position.y = -1;
	text.rotation.z = Math.PI;
    }

    var dimObject = new THREE.Object3D();
    dimObject.addChild(line);
    dimObject.addChild(arrow);
    dimObject.addChild(text);

    dimObject.rotation.z = angle;

    return dimObject;
}

SS.preview.createDimText = function(value) {
    var textGeo = new THREE.TextGeometry('' + value, {
	size: 2, height: 0.01, curveSegments: 6,
	font: 'helvetiker', weight: 'normal', style: 'normal',
	bezelEnabled: false});
    return new THREE.Mesh( textGeo, SS.preview.dimTextMaterial );
}

SS.constructors.anchorGeometry = new THREE.CubeGeometry(1.0, 1.0, 1.0);
SS.constructors.anchorMaterial = new THREE.MeshBasicMaterial( { color: 0x66a1d1, opacity: 0.8, wireframe: false } );


SS.constructors.Constructor = function(spec) {
    var that = this, scene = spec.scene, geomNode = spec.geomNode, updater = spec.updater;
    var cursoid = spec.cursoid;

    var sceneObjects = {};
    var activeAnchor;
    var specialisation = spec.specialisation;
    
    var updatePreview = function() {
        Object.keys(sceneObjects).map(function(key) {
            scene.removeObject(sceneObjects[key]);
        });
        sceneObjects = specialisation.createSceneObject(geomNode, activeAnchor);

	if (activeAnchor !== 'origin') {
            var originAnchor = new THREE.Mesh(SS.constructors.anchorGeometry, SS.constructors.anchorMaterial);
            originAnchor.name = {anchor: 'origin'};
            sceneObjects.originAnchor = originAnchor;
	}
    
	Object.keys(sceneObjects).map(function(key) {
	    sceneObjects[key].position.x = geomNode.origin.x;
	    sceneObjects[key].position.y = geomNode.origin.y;
	    sceneObjects[key].position.z = geomNode.origin.z;
	    scene.addObject(sceneObjects[key]);
	});

    }

    this.getAnchor = function(scene, camera, event) {
        var priorities = specialisation.anchorPriorities;

        var found = SS.selectInScene(scene, camera, event);
        var filtered = found.filter(function(obj) {
            return obj.object.name.anchor;
        });
	if (filtered.length == 0) {
	    return undefined;
	}
	var names = filtered.map(function(obj) {
	    return obj.object.name.anchor;
	});
	for (var key in priorities) {
	    if (names.indexOf(priorities[key]) !== -1) {
		return priorities[key];
	    }
	}
    };

    this.activateAnchor = function(anchorName) {
	var modifier;
	activeAnchor = anchorName;

	if (SS.modifier.active) {
	    SS.modifier.active.dispose();
	}

        var specialisationModifierClass = specialisation.getModifierForAnchor(anchorName);
        if (specialisationModifierClass) {
            modifier = new specialisationModifierClass({geomNode : geomNode,
                                                        cursoid  : sceneView.cursoid,
					                updater  : updater});
        } else if (anchorName === 'origin') {
	    modifier = new SS.modifier.Origin({geomNode : geomNode,
                                               cursoid  : sceneView.cursoid,
					       updater  : updater});
	}

	if(modifier) {
	    SS.modifier.active = modifier;
	}
	updatePreview();
    }

    this.deactivateAnchor = function() {
	SS.modifier.active.dispose();
	SS.modifier.active == null;
    }

    this.dispose = function() {
	cursoid.clear();
	Object.keys(sceneObjects).map(function(key) {
             scene.removeObject(sceneObjects[key]);
        });
        updater.off('updatedFromTree', updatePreview);
        updater.off('updatedFromCursoid', updatePreview);
        updater = null;
    }
    
    var init = function() {
        updater.on('updatedFromTree', updatePreview);
        updater.on('updatedFromCursoid', updatePreview);
        updatePreview();
    }
    
    init();
}

SS.constructors.editEllipse1d = function(geomNode) {
    var updater = new SS.GeomNodeUpdater(geomNode);
    SS.constructors.active = new SS.constructors.Constructor({geomNode : geomNode,
                                                              scene    : sceneView.scene,
                                                              cursoid  : sceneView.cursoid,
                                                              specialisation : new SS.constructors.Ellipse1d,
                                                              updater  : updater});
}

SS.constructors.createEllipse1d = function(geomNode) {
    var lastMousePosition = sceneView.workplane.getLastMousePosition();
    geomNode.origin.x = lastMousePosition.x;
    geomNode.origin.y = lastMousePosition.y;
    geomNode.parameters.r1 = 20;
    geomNode.parameters.r2 = 10;
    SS.constructors.editEllipse1d(geomNode);
}

SS.constructors.editSphere = function(geomNode) {
    var updater = new SS.GeomNodeUpdater(geomNode);
    SS.constructors.active = new SS.constructors.Constructor({geomNode : geomNode,
                                                              scene    : sceneView.scene,
                                                              cursoid  : sceneView.cursoid,
                                                              specialisation : new SS.constructors.Sphere,
                                                              updater  : updater});
}

SS.constructors.createSphere = function(geomNode) {
    var lastMousePosition = sceneView.workplane.getLastMousePosition();
    geomNode.origin.x = lastMousePosition.x;
    geomNode.origin.y = lastMousePosition.y;
    geomNode.parameters.r = 10;
    SS.constructors.editSphere(geomNode);
}

SS.constructors.disposeActive = function() {
    if (SS.constructors.active) {
	SS.constructors.active.dispose();
	SS.constructors.active = undefined;
    }
}

SS.constructors.Ellipse1d = function() {

    this.createSceneObject = function(geomNode, activeAnchor) {
        
        var sceneObjects = {};
        
        var r1 = geomNode.parameters.r1;
        var r2 = geomNode.parameters.r2;
        if (r1) {
	    sceneObjects.r1Dim = SS.preview.createDimArrow(r1, 0);
	}

	if (r2) {
	    sceneObjects.r2Dim = SS.preview.createDimArrow(r2, Math.PI/2);
	}

	var ellipseObj = new THREE.Object3D();
        if (r1 && r2) {
	    var ellipseGeom = new THREE.Geometry();
	    for(var i = 0; i <= 50; ++i) {
	        var theta = Math.PI*2*i/50;
	        var dx = r1*Math.cos(theta);
	        var dy = r2*Math.sin(theta);
	        ellipseGeom.vertices.push(new THREE.Vertex(new THREE.Vector3(dx, dy, 0)));
	    }
	    var ellipse = new THREE.Line(ellipseGeom, SS.constructors.lineMaterial);
            ellipseObj.addChild(ellipse);
        }
        
        if (activeAnchor !== 'radii') {
            var radiiAnchor = new THREE.Mesh(SS.constructors.anchorGeometry, SS.constructors.anchorMaterial);
            radiiAnchor.position.x = r1;
            radiiAnchor.position.y = r2;
            radiiAnchor.name = {anchor: 'radii'};
            ellipseObj.addChild(radiiAnchor);
	}

        sceneObjects.ellipse = ellipseObj;
        return sceneObjects;
    }

    this.anchorPriorities = ['radii', 'origin'];

    this.getModifierForAnchor = function(anchorName) {
        if (anchorName === 'radii') {
	    return SS.modifier.MajorMinorRadii;
	}
        return null;
    }

}

SS.constructors.Sphere = function() {

    this.createSceneObject = function(geomNode, activeAnchor) {
        
        var sceneObjects = {};
        
        var r = geomNode.parameters.r;
        if (r) {
	    sceneObjects.rDim = SS.preview.createDimArrow(r, (geomNode.extra && geomNode.extra.angle) || 0);
	}

	var sphereObj = new THREE.Object3D();
        if (r) {
            var geometry = new THREE.SphereGeometry(r, 50, 10);
	    var sphere = new THREE.Mesh(geometry, SS.constructors.faceMaterial);
	    //sphereObj.addChild(sphere);

	    var circleGeom = new THREE.Geometry();
	    for(var i = 0; i <= 50; ++i) {
	        var theta = Math.PI*2*i/50;
	        var dx = r*Math.cos(theta);
	        var dy = r*Math.sin(theta);
	        circleGeom.vertices.push(new THREE.Vertex(new THREE.Vector3(dx, dy, 0)));
	    }
	    var circle = new THREE.Line(circleGeom, SS.constructors.lineMaterial);
	    sphereObj.addChild(circle);
        }

        if (activeAnchor !== 'radius') {
            var radiusAnchor = new THREE.Mesh(SS.constructors.anchorGeometry, SS.constructors.anchorMaterial);
            var angle = (geomNode.extra && geomNode.extra.angle) || 0;
            radiusAnchor.position.x = r*Math.cos(angle);
            radiusAnchor.position.y = r*Math.sin(angle);
            radiusAnchor.name = {anchor: 'radius'};
            sphereObj.addChild(radiusAnchor);
	}

        sceneObjects.sphere = sphereObj;
        return sceneObjects;
    }

    this.anchorPriorities = ['radius', 'origin'];

    this.getModifierForAnchor = function(anchorName) {
        if (anchorName === 'radius') {
	    return SS.modifier.Radius;
	}
        return null;
    }

}

