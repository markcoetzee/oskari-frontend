/**
 * @classOskari.mapframework.bundle.mapmodule.request.GetUserLocationRequestHandler
 * Handles MapModulePlugin.GetUserLocationRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.GetUserLocationRequestHandler', function (sandbox, mapmodule) {
    this.sandbox = sandbox;
    this.mapmodule = mapmodule;
    this._log = Oskari.log('GetUserLocationRequestHandler');
}, {
    handleRequest: function (core, request) {
        this._log.debug('Get user location');
        var mapmodule = this.mapmodule;
        var cb;
        // if request.getCenterMap() is truthy: also move map
        if (request.getCenterMap()) {
            cb = function (lon, lat) {
                if (!lon || !lat) {
                    // error getting location
                    return;
                }
                // move map to coordinates
                mapmodule.centerMap({ lon: lon, lat: lat }, 6);
            };
        }
        // call the getUserLocation() function to trigger an event with or without the cb
        mapmodule.getUserLocation(cb);
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
