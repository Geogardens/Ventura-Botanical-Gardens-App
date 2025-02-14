﻿// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.11/esri/copyright.txt for details.
//>>built
define("st/arcgis/utils", "require dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/Deferred dojo/_base/json dojo/_base/url dojo/on dojo/DeferredList dojo/dom-construct ../kernel ../config ../lang ../request ../SpatialReference ../map ../urlUtils ../geometry/ScreenPoint ../geometry/Extent ../geometry/webMercatorUtils ../symbols/jsonUtils ../renderers/jsonUtils ../dijit/PopupTemplate ../dijit/Popup ../tasks/query ../tasks/GeometryService ../layers/ArcGISTiledMapServiceLayer ../layers/FeatureLayer dojo/i18n!../nls/jsapi".split(" "),
    function ($, l, g, u, s, G, mb, xa, B, nb, F, H, k, x, y, ob, ya, za, C, pb, D, Aa, Ba, qb, rb, sb, tb, z, aa) {
        function E(a) {
            return x({
                url: q.arcgisUrl + "/" + a.itemId + "/data",
                content: {
                    f: "json"
                },
                callbackParamName: "callback"
            }, {
                disableIdentityLookup: !0,
                _preLookup: !0
            })
        }

        function ba(a, f) {
            var b = {
                f: "json"
            };
            f && (b.token = f);
            return x({
                url: a,
                content: b,
                callbackParamName: "callback"
            }, {
                disableIdentityLookup: !0
            })
        }

        function ca(a) {
            a.itemProperties.layerDefinition && (a.layerDefinition ? (a.layerDefinition.drawingInfo || (a.layerDefinition.drawingInfo = a.itemProperties.layerDefinition.drawingInfo),
                k.isDefined(a.layerDefinition.definitionExpression) || (a.layerDefinition.definitionExpression = a.itemProperties.layerDefinition.definitionExpression), k.isDefined(a.layerDefinition.minScale) || (a.layerDefinition.minScale = a.itemProperties.layerDefinition.minScale), k.isDefined(a.layerDefinition.maxScale) || (a.layerDefinition.maxScale = a.itemProperties.layerDefinition.maxScale)) : a.layerDefinition = a.itemProperties.layerDefinition);
            a.itemProperties.popupInfo && (!a.popupInfo && !a.disablePopup) && (a.popupInfo = a.itemProperties.popupInfo);
            k.isDefined(a.itemProperties.showLabels) && !k.isDefined(a.showLabels) && (a.showLabels = a.itemProperties.showLabels);
            k.isDefined(a.itemProperties.showLegend) && !k.isDefined(a.showLegend) && (a.showLegend = a.itemProperties.showLegend);
            k.isDefined(a.itemProperties.refreshInterval) && !k.isDefined(a.refreshInterval) && (a.refreshInterval = a.itemProperties.refreshInterval)
        }

        function Ca(a) {
            ca(a);
            a.itemProperties.layerDefinition && a.layerDefinition && (!k.isDefined(a.layerDefinition.maximumTrackPoints) && k.isDefined(a.itemProperties.layerDefinition.maximumTrackPoints) &&
                (a.layerDefinition.maximumTrackPoints = a.itemProperties.layerDefinition.maximumTrackPoints), !a.layerDefinition.definitionGeometry && a.itemProperties.layerDefinition.definitionGeometry && (a.layerDefinition.definitionGeometry = a.itemProperties.layerDefinition.definitionGeometry));
            a.itemProperties.purgeOptions && !a.purgeOptions && (a.purgeOptions = a.itemProperties.purgeOptions)
        }

        function I(a, f) {
            var b = new s,
                d = a.itemData,
                e = [],
                c = [];
            g.forEach(d.operationalLayers, function (a) {
                if (a.itemId && !a.type) {
                    var d = a.url.toLowerCase(); -1 < d.indexOf("/featureserver") || -1 < d.indexOf("/mapserver/") ? (c.push(a), e.push(E(a))) : -1 < d.indexOf("/mapserver") && -1 === d.indexOf("/mapserver/") && (!a.layers || !k.isDefined(a.minScale) && !k.isDefined(a.maxScale)) ? (c.push(a), e.push(E(a))) : -1 < d.indexOf("/imageserver") && !k.isDefined(a.minScale) && !k.isDefined(a.maxScale) ? (c.push(a), e.push(E(a))) : -1 < d.indexOf("/streamserver") && (c.push(a), e.push(E(a)))
                }
            });
            d.baseMap && d.baseMap.baseMapLayers && g.forEach(d.baseMap.baseMapLayers, function (a) {
                a.itemId && (c.push(a),
                    e.push(E(a)))
            });
            if (0 < e.length) {
                var h = {};
                (new B(e)).addCallback(function (d) {
                    g.forEach(c, function (a, c) {
                        var b = d[c][1];
                        if (b && !(b instanceof Error) && (h[a.itemId] = b, !a.type)) {
                            var e = a.url.toLowerCase();
                            if ((-1 < e.indexOf("/featureserver") || -1 < e.indexOf("/mapserver/")) && b.layers) g.forEach(b.layers, function (c) {
                                if (e.endsWith("/featureserver/" + c.id) || e.endsWith("/mapserver/" + c.id)) a.itemProperties = c, ca(a)
                            });
                            else if (-1 < e.indexOf("/streamserver")) a.itemProperties = b, Ca(a);
                            else if (-1 < e.indexOf("/mapserver")) b.layers &&
                                !a.layers && (a.layers = b.layers), k.isDefined(b.minScale) && !k.isDefined(a.minScale) && (a.minScale = b.minScale), k.isDefined(b.maxScale) && !k.isDefined(a.maxScale) && (a.maxScale = b.maxScale), k.isDefined(b.refreshInterval) && !k.isDefined(a.refreshInterval) && (a.refreshInterval = b.refreshInterval);
                            else if (-1 < e.indexOf("/imageserver") && (k.isDefined(b.minScale) && !k.isDefined(a.minScale) && (a.minScale = b.minScale), k.isDefined(b.maxScale) && !k.isDefined(a.maxScale) && (a.maxScale = b.maxScale), k.isDefined(b.refreshInterval) &&
                                    !k.isDefined(a.refreshInterval) && (a.refreshInterval = b.refreshInterval), b.popupInfo && (!a.popupInfo && !a.disablePopup) && (a.popupInfo = b.popupInfo), b.renderingRule && !a.renderingRule && (a.renderingRule = b.renderingRule, b.renderingRule.functionName && (a.renderingRule.rasterFunction = b.renderingRule.functionName)), b.bandIds && !a.bandIds && (a.bandIds = b.bandIds), b.mosaicRule && !a.mosaicRule && (a.mosaicRule = b.mosaicRule), b.format && !a.format && (a.format = b.format), k.isDefined(b.compressionQuality) && !k.isDefined(a.compressionQuality) &&
                                    (a.compressionQuality = b.compressionQuality), b.layerDefinition && b.layerDefinition.definitionExpression && (!k.isDefined(a.layerDefinition) || !k.isDefined(a.layerDefinition.definitionExpression)))) a.layerDefinition = a.layerDefinition || {}, a.layerDefinition.definitionExpression = b.layerDefinition.definitionExpression
                        }
                    });
                    a.relatedItemsData = h;
                    b.callback(a)
                })
            } else b.callback(a);
            return b
        }

        function ub(a, f) {
            var b = new s,
                d = a.itemData,
                e = d.baseMap.baseMapLayers[0];
            if ("BingMapsAerial" === e.type || "BingMapsRoad" === e.type ||
                "BingMapsHybrid" === e.type)
                if (e.portalUrl && F.id) delete f.bingMapsKey, F.id.checkSignInStatus(ya.urlToObject(q.arcgisUrl).path).then(l.hitch(null, function (a, c, b, d, f) {
                    ba(e.portalUrl, f.token).then(l.hitch(null, da, a, c, b, d), l.hitch(null, J, a, c, b, d))
                }, a, f, d, b), l.hitch(null, function (a, c, b, d, f) {
                    ba(e.portalUrl).then(l.hitch(null, da, a, c, b, d), l.hitch(null, J, a, c, b, d))
                }, a, f, d, b));
                else if (f.bingMapsKey) {
                    var c = new t({
                        bingMapsKey: f.bingMapsKey,
                        mapStyle: t.MAP_STYLE_AERIAL
                    });
                    u.connect(c, "onLoad", l.hitch(this, function () {
                        b.callback([a,
                            f
                        ])
                    }));
                    u.connect(c, "onError", function (c) {
                        delete f.bingMapsKey;
                        a.itemData = K(d);
                        e = a.itemData.baseMap.baseMapLayers[0];
                        e.errors = [];
                        e.errors.push({
                            message: "The owner of the application has not provided a valid Bing Key for the Bing Map it includes. Switching to Esri layers."
                        });
                        b.callback([a, f])
                    })
                } else a.itemData = K(d), e = a.itemData.baseMap.baseMapLayers[0], e.errors = [], e.errors.push({
                    message: "The owner of the application has not provided a Bing Key for the Bing Map it includes. Switching to Esri layers."
                }),
                    b.callback([a, f]);
            else b.callback([a, f]);
            return b
        }

        function da(a, f, b, d, e) {
            e.bingKey ? (f.bingMapsKey = e.bingKey, e = new t({
                bingMapsKey: f.bingMapsKey,
                mapStyle: t.MAP_STYLE_AERIAL
            }), u.connect(e, "onLoad", l.hitch(this, function () {
                d.callback([a, f])
            })), u.connect(e, "onError", function (c) {
                delete f.bingMapsKey;
                a.itemData = K(b);
                c = a.itemData.baseMap.baseMapLayers[0];
                c.errors = [];
                c.errors.push({
                    message: "The owner of the map has not provided a valid Bing Key for the Bing Map it includes. Switching to Esri layers."
                });
                d.callback([a,
                    f
                ])
            })) : J(a, f, b, d)
        }

        function J(a, f, b, d) {
            delete f.bingMapsKey;
            a.itemData = K(b);
            b = a.itemData.baseMap.baseMapLayers[0];
            b.errors = [];
            b.errors.push({
                message: "The owner of the map has not provided a Bing Key for the Bing Map it includes. Switching to Esri layers."
            });
            d.callback([a, f])
        }

        function K(a) {
            a.baseMap = "BingMapsAerial" === a.baseMap.baseMapLayers[0].type ? {
                title: "Imagery",
                baseMapLayers: [{
                    id: "World_Imagery_2017",
                    visibility: !0,
                    opacity: 1,
                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                }]
            } :
                "BingMapsRoad" === a.baseMap.baseMapLayers[0].type ? {
                    title: "Streets",
                    baseMapLayers: [{
                        id: "World_Street_Map_8421",
                        opacity: 1,
                        visibility: !0,
                        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
                    }]
                } : {
                    title: "Imagery with Labels",
                    baseMapLayers: [{
                        id: "World_Imagery_6611",
                        opacity: 1,
                        visibility: !0,
                        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                    }, {
                        id: "World_Boundaries_and_Places_1145",
                        isReference: !0,
                        opacity: 1,
                        visibility: !0,
                        url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer"
                    }]
                };
            return a
        }

        function ea(a, f, b, d) {
            var e = a.dynamicLayerInfos || a.layerInfos,
                c = f.layers;
            if (c && e)
                if (d.usePopupManager) {
                    var h;
                    g.forEach(e, function (a) {
                        var d = a.id;
                        if (!a.subLayerIds)
                            for (a = 0; a < c.length; a++) {
                                var e = c[a];
                                if (e.id === d && e.popupInfo) {
                                    h || (h = {});
                                    h[d] = {
                                        infoTemplate: new b(e.popupInfo),
                                        layerUrl: e.layerUrl
                                    };
                                    break
                                }
                            }
                    });
                    h && a.setInfoTemplates(h)
                } else {
                    var m = [],
                        r = [],
                        n = [],
                        p = [],
                        v = [],
                        Da = [];
                    g.forEach(e, function (b) {
                        var d = b.id;
                        if (!b.subLayerIds && -1 !== g.indexOf(a.visibleLayers, d))
                            for (b = 0; b < c.length; b++) {
                                var e = c[b];
                                if (e.id ===
                                    d) {
                                    r.push(d);
                                    m.push(e.popupInfo);
                                    n.push(e.layerUrl || "");
                                    e.layerDefinition && e.layerDefinition.definitionExpression ? p.push(e.layerDefinition.definitionExpression) : p.push("");
                                    v.push(k.isDefined(e.minScale) ? e.minScale : null);
                                    Da.push(k.isDefined(e.maxScale) ? e.maxScale : null);
                                    break
                                }
                            }
                    });
                    m.length && (a.__popups = m, a.__popupIds = r, a.__popupUrls = n, a.__popupWhereClauses = p, a.__popupMinScales = v, a.__popupMaxScales = Da, a.__resourceInfo = f.resourceInfo)
                }
        }

        function fa(a) {
            if (!a) return !1;
            var f = (new mb(q.arcgisUrl)).authority;
            return -1 !== a.indexOf(".arcgis.com/") || -1 !== a.indexOf(f)
        }

        function Ea(a) {
            return !a ? !1 : -1 !== a.indexOf("/services.arcgisonline.com/") || -1 !== a.indexOf("/server.arcgisonline.com/")
        }

        function A(a) {
            if ("https:" === location.protocol && (fa(a) || Ea(a))) a = a.replace("http:", "https:");
            return a
        }

        function ga(a, f, b) {
            var d = [],
                e;
            a.displayLevels || (d = g.map(a.resourceInfo.tileInfo.lods, function (a) {
                return a.level
            }));
            a.exclusionAreas && (e = l.clone(a.exclusionAreas), e = g.map(e, function (a) {
                a.geometry = new C(a.geometry);
                return a
            }));
            d =
                new tb(A(a.url), {
                    resourceInfo: a.resourceInfo,
                    opacity: a.opacity,
                    visible: a.visibility,
                    displayLevels: a.displayLevels || d,
                    id: a.id,
                    minScale: a.minScale,
                    maxScale: a.maxScale,
                    refreshInterval: a.refreshInterval,
                    exclusionAreas: e
                });
            b.ignorePopups || ea(d, a, f, b);
            return d
        }

        function ha(a, f) {
            if (!a || !f || 0 === f.length) return [];
            var b = "," + f + ",",
                d = [],
                e, c = ",";
            for (e = 0; e < a.length; e++)
                if (null !== a[e].subLayerIds) {
                    if (-1 === b.indexOf("," + a[e].id + ",") || -1 < c.indexOf("," + a[e].id + ",")) c += a[e].subLayerIds.toString() + ","
                } else -1 < b.indexOf("," +
                    a[e].id + ",") && -1 === c.indexOf("," + a[e].id + ",") && d.push(a[e].id);
            return d
        }

        function Fa(a, f, b) {
            var d = new Ga;
            d.format = "png24";
            a.resourceInfo && (a.resourceInfo.supportedImageFormatTypes && -1 < a.resourceInfo.supportedImageFormatTypes.indexOf("PNG32")) && (d.format = "png32");
            var d = new Ha(A(a.url), {
                resourceInfo: a.resourceInfo,
                opacity: a.opacity,
                visible: a.visibility,
                id: a.id,
                imageParameters: d,
                minScale: a.minScale,
                maxScale: a.maxScale,
                refreshInterval: a.refreshInterval
            }),
                e = a.visibleLayers;
            if (!a.visibleLayers) {
                var c = "";
                g.forEach(d.layerInfos, function (a) {
                    a.defaultVisibility && (c += (0 < c.length ? "," : "") + a.id)
                });
                e = c
            }
            if (a.layers && 0 < a.layers.length) {
                var h = [],
                    m = [],
                    r, n = [],
                    p, v;
                g.forEach(a.layers, function (b) {
                    b.layerDefinition && b.layerDefinition.definitionExpression && (h[b.id] = b.layerDefinition.definitionExpression);
                    if (b.layerDefinition && b.layerDefinition.source) {
                        r = null;
                        v = b.layerDefinition.source;
                        if ("mapLayer" === v.type) {
                            var c = g.filter(a.resourceInfo.layers, function (a) {
                                return a.id === v.mapLayerId
                            });
                            c.length && (r = l.mixin(c[0], b))
                        } else r =
                            l.mixin({}, b);
                        r && (r.source = v, delete r.popupInfo, r = new Ia(r), a.visibleLayers && (c = "string" == typeof a.visibleLayers ? a.visibleLayers.split(",") : a.visibleLayers, -1 < g.indexOf(c, b.id) ? r.defaultVisibility = !0 : r.defaultVisibility = !1), m.push(r))
                    }
                    b.layerDefinition && (b.layerDefinition.source && b.layerDefinition.drawingInfo) && (p = new Ja(b.layerDefinition.drawingInfo), n[b.id] = p)
                }, this);
                0 < h.length && d.setLayerDefinitions(h);
                0 < m.length ? (d.setDynamicLayerInfos(m, !0), 0 < n.length && d.setLayerDrawingOptions(n, !0)) : (e = ha(d.layerInfos,
                    e), d.setVisibleLayers(e))
            } else e = ha(d.layerInfos, e), d.setVisibleLayers(e);
            b.ignorePopups || ea(d, a, f, b);
            return d
        }

        function vb(a, f, b) {
            var d = new Ka;
            d.bandIds = a.bandIds;
            null != a.format && (d.format = a.format, null != a.compressionQuality && (d.compressionQuality = a.compressionQuality));
            if (a.renderingRule && a.renderingRule.rasterFunction) {
                var e = new La(a.renderingRule);
                d.renderingRule = e
            }
            a.mosaicRule && (e = new Ma(a.mosaicRule), d.mosaicRule = e);
            k.isDefined(a.noData) && (d.noData = a.noData);
            k.isDefined(a.noDataInterpretation) &&
                (d.noDataInterpretation = a.noDataInterpretation);
            k.isDefined(a.interpolation) && (d.interpolation = a.interpolation);
            d = new Na(A(a.url), {
                resourceInfo: a.resourceInfo,
                opacity: a.opacity,
                visible: a.visibility,
                id: a.id,
                imageServiceParameters: d,
                minScale: a.minScale,
                maxScale: a.maxScale,
                refreshInterval: a.refreshInterval
            });
            a.layerDefinition && a.layerDefinition.definitionExpression && d.setDefinitionExpression(a.layerDefinition.definitionExpression, !0);
            !b.ignorePopups && a.popupInfo && d.setInfoTemplate(new f(a.popupInfo));
            return d
        }

        function ia(a, f, b) {
            var d = [102113, 102100, 3857],
                e = b || new y(f[0].layerObject.fullExtent.spatialReference),
                c = new y(a.resourceInfo.fullExtent.spatialReference);
            return e.wkt == c.wkt && (e.wkid == c.wkid || k.isDefined(e.latestWkid) && e.latestWkid == c.wkid || k.isDefined(c.latestWkid) && e.wkid == c.latestWkid || k.isDefined(e.latestWkid) && e.latestWkid == c.latestWkid) || e.wkid && c.wkid && g.some(d, function (a) {
                return a === c.wkid
            }) && g.some(d, function (a) {
                return a === e.wkid
            }) ? !0 : !1
        }

        function ja(a, f) {
            if (!f[0].layerObject.tileInfo) return !1;
            var b = [];
            g.forEach(f, function (a) {
                a.baseMapLayer && a.layerObject.tileInfo && (b = b.concat(g.map(a.layerObject.tileInfo.lods, function (a) {
                    return a.scale
                })))
            });
            return g.some(a.resourceInfo.tileInfo.lods, function (a) {
                return g.some(b, function (b) {
                    return b === a.scale
                })
            })
        }

        function ka(a, f, b, d, e) {
            var c, h = b._clazz;
            if ("OpenStreetMap" === a.type) c = new Oa({
                id: a.id,
                opacity: a.opacity,
                visible: null !== a.visibility && void 0 !== a.visibility ? a.visibility : !0
            });
            else if ("WMS" === a.type) {
                var m = [],
                    r = [];
                g.forEach(a.layers, function (a) {
                    r.push(new Pa({
                        name: a.name,
                        title: a.title,
                        legendURL: a.legendURL
                    }));
                    m.push(a.name)
                }, this);
                a.visibleLayers && (m = a.visibleLayers);
                d = {
                    extent: new C(a.extent[0][0], a.extent[0][1], a.extent[1][0], a.extent[1][1], new y({
                        wkid: 4326
                    })),
                    layerInfos: r,
                    version: a.version,
                    maxWidth: a.maxWidth,
                    maxHeight: a.maxHeight,
                    getMapURL: a.mapUrl,
                    spatialReferences: a.spatialReferences,
                    title: a.title,
                    copyright: a.copyright,
                    minScale: a.minScale || 0,
                    maxScale: a.maxScale || 0,
                    format: a.format
                };
                c = new Qa(a.url, {
                    id: a.id,
                    visibleLayers: m,
                    format: "png",
                    transparent: a.baseMapLayer ?
                        !1 : !0,
                    opacity: a.opacity,
                    visible: null !== a.visibility ? a.visibility : !0,
                    resourceInfo: d,
                    refreshInterval: a.refreshInterval
                });
                c.spatialReference.wkid = d.spatialReferences[0]
            } else if ("KML" === a.type) {
                b = a.url;
                if (F.id && (h = F.id.findCredential(ya.urlToObject(q.arcgisUrl).path))) {
                    var n = q.arcgisUrl.substring(q.arcgisUrl.indexOf("//") + 2, q.arcgisUrl.indexOf("/", q.arcgisUrl.indexOf("//") + 3)),
                        p = n.split("."),
                        p = p[p.length - 2] + "." + p[p.length - 1];
                    f = b.indexOf(p); -1 < f && (b = "https://" + n + b.substring(f + p.length), b += "?token\x3d" +
                        h.token)
                }
                c = new Ra(b, {
                    id: a.id,
                    visible: null !== a.visibility ? a.visibility : !0,
                    outSR: d,
                    refreshInterval: a.refreshInterval
                });
                u.connect(c, "onLoad", function () {
                    (a.opacity || 0 === a.opacity) && c.setOpacity(a.opacity);
                    k.isDefined(a.minScale) && k.isDefined(a.maxScale) && c.setScaleRange(a.minScale, a.maxScale);
                    a.visibleFolders && g.forEach(c.folders, function (b) {
                        -1 < g.indexOf(a.visibleFolders, b.id) ? c.setFolderVisibility(b, !0) : c.setFolderVisibility(b, !1)
                    }, this)
                })
            } else "WebTiledLayer" === a.type ? (c = new Sa(a.templateUrl, {
                id: a.id,
                visible: null !== a.visibility ? a.visibility : !0,
                opacity: a.opacity,
                copyright: a.copyright,
                fullExtent: a.fullExtent && new C(a.fullExtent),
                initialExtent: a.fullExtent && new C(a.fullExtent),
                subDomains: a.subDomains,
                tileInfo: a.tileInfo ? new Ta(a.tileInfo) : null,
                refreshInterval: a.refreshInterval
            }), u.connect(c, "onLoad", function () {
                (k.isDefined(a.minScale) || k.isDefined(a.maxScale)) && c.setScaleRange(a.minScale, a.maxScale)
            })) : "GeoRSS" === a.type ? (c = new Ua(a.url, {
                id: a.id,
                opacity: a.opacity,
                outSpatialReference: d,
                refreshInterval: a.refreshInterval
            }),
                u.connect(c, "onLoad", function () {
                    !1 === a.visibility && c.hide();
                    k.isDefined(a.minScale) && k.isDefined(a.maxScale) && c.setScaleRange(a.minScale, a.maxScale);
                    var b = c.getFeatureLayers();
                    g.forEach(b, function (d) {
                        a.pointSymbol && "esriGeometryPoint" === d.geometryType ? (d.renderer.symbol = D.fromJson(a.pointSymbol), 1 === b.length && (c.pointSymbol = D.fromJson(a.pointSymbol))) : a.lineSymbol && "esriGeometryPolyline" === d.geometryType ? (d.renderer.symbol = D.fromJson(a.lineSymbol), 1 === b.length && (c.polylineSymbol = D.fromJson(a.lineSymbol))) :
                            a.polygonSymbol && "esriGeometryPolygon" === d.geometryType && (d.renderer.symbol = D.fromJson(a.polygonSymbol), 1 === b.length && (c.polygonSymbol = D.fromJson(a.polygonSymbol)))
                    })
                })) : "CSV" == a.type && a.url ? (d = {
                    layerDefinition: a.layerDefinition,
                    columnDelimiter: a.columnDelimiter,
                    id: a.id ? a.id : null,
                    visible: null !== a.visibility ? a.visibility : !0,
                    opacity: a.opacity,
                    refreshInterval: a.refreshInterval
                }, a.locationInfo && (d.latitudeFieldName = a.locationInfo.latitudeFieldName, d.longitudeFieldName = a.locationInfo.longitudeFieldName),
                b.ignorePopups || (d.infoTemplate = new Ba(a.popupInfo ? a.popupInfo : Va.generateDefaultPopupInfo(a))), c = new Wa(a.url, d)) : a.layerDefinition && !a.url ? (d = G.fromJson(G.toJson(a)), delete d.id, delete d.opacity, delete d.visibility, c = new z(d, {
                    id: a.id,
                    opacity: a.opacity,
                    visible: a.visibility,
                    outFields: ["*"],
                    autoGeneralize: !0
                }), !b.ignorePopups && d.popupInfo && c.setInfoTemplate(new h(d.popupInfo))) : "BingMapsAerial" === a.type || "BingMapsRoad" === a.type || "BingMapsHybrid" === a.type ? b.bingMapsKey ? (d = t.MAP_STYLE_AERIAL_WITH_LABELS,
                "BingMapsAerial" === a.type ? d = t.MAP_STYLE_AERIAL : "BingMapsRoad" === a.type && (d = t.MAP_STYLE_ROAD), c = new t({
                    bingMapsKey: b.bingMapsKey,
                    mapStyle: d,
                    opacity: a.opacity,
                    id: a.id
                }), u.connect(c, "onError", l.hitch(this, function (a) {
                    a.errors = a.errors || [];
                    a.errors.push({
                        message: "This application does not have a valid Bing Key for the Bing layer that is included in this map. [type:" + a.type + "]"
                    })
                }, a))) : (a.errors = a.errors || [], a.errors.push({
                    message: "This application does not provide a Bing Key for the Bing layer that is included in this map. [type:" +
                        a.type + "]"
                })) : a.resourceInfo && a.resourceInfo.mapName ? c = !0 === a.resourceInfo.singleFusedMapCache && (a.baseMapLayer || ia(a, f, d) && ja(a, e)) ? ga(a, h, b) : Fa(a, h, b) : a.resourceInfo && a.resourceInfo.pixelSizeX ? c = !0 === a.resourceInfo.singleFusedMapCache && (a.baseMapLayer || ia(a, f, d) && ja(a, e)) ? ga(a, h, b) : vb(a, h, b) : a.resourceInfo && "Feature Layer" === a.resourceInfo.type ? (a.capabilities && (a.resourceInfo.capabilities = a.capabilities), c = new z(A(a.url), {
                    resourceInfo: a.resourceInfo,
                    opacity: a.opacity,
                    visible: a.visibility,
                    id: a.id,
                    mode: fa(a.url) ? z.MODE_AUTO : k.isDefined(a.mode) ? a.mode : z.MODE_ONDEMAND,
                    editable: !1 === b.editable ? !1 : void 0,
                    outFields: ["*"],
                    autoGeneralize: !0,
                    refreshInterval: a.refreshInterval
                }), !b.ignorePopups && a.popupInfo && c.setInfoTemplate(new h(a.popupInfo)), a.layerDefinition && (a.layerDefinition.drawingInfo && a.layerDefinition.drawingInfo.renderer && (d = Aa.fromJson(a.layerDefinition.drawingInfo.renderer), d.isMaxInclusive = !0, c.setRenderer(d)), a.layerDefinition.drawingInfo && a.layerDefinition.drawingInfo.labelingInfo &&
                (d = g.map(a.layerDefinition.drawingInfo.labelingInfo, function (a) {
                    return new Xa(a)
                }), c.setLabelingInfo(d)), a.layerDefinition.definitionExpression && c.setDefinitionExpression(a.layerDefinition.definitionExpression), k.isDefined(a.layerDefinition.minScale) && c.setMinScale(a.layerDefinition.minScale), k.isDefined(a.layerDefinition.maxScale) && c.setMaxScale(a.layerDefinition.maxScale))) : a.resourceInfo && a.resourceInfo.streamUrls && (d = {
                    resourceInfo: a.resourceInfo,
                    opacity: a.opacity,
                    visible: a.visibility,
                    id: a.id
                },
                a.layerDefinition && (p = a.layerDefinition.drawingInfo, a.layerDefinition.definitionGeometry && (n = n || {}, n.geometry = a.layerDefinition.definitionGeometry), k.isDefined(a.layerDefinition.definitionExpression) && (n = n || {}, n.where = a.layerDefinition.definitionExpression), k.isDefined(a.layerDefinition.maximumTrackPoints) && (d.maximumTrackPoints = a.layerDefinition.maximumTrackPoints)), n && (d.filter = n), a.purgeOptions && (d.purgeOptions = a.purgeOptions), c = new Ya(A(a.url), d), p && p.renderer && (d = p.renderer, c.setRenderer(Aa.fromJson(d))), !b.ignorePopups && a.popupInfo && c.setInfoTemplate(new h(a.popupInfo)), xa.once(c, "error", function (b) {
                    a.errors.push({
                        message: "Error loading stream layer. Check websocket url"
                    })
                }));
            c && (c.arcgisProps = {
                title: a.title
            }, a.baseMapLayer && (c._basemapGalleryLayerType = a.isReference ? "reference" : "basemap"));
            return c
        }

        function la(a, f, b, d) {
            g.forEach(a, function (c, e) {
                if (c.url && !c.type) {
                    if (0 === e || a[0].layerObject) c.layerObject = ka(c, a, f, b, d)
                } else c.layerObject = ka(c, a, f, b, d)
            });
            var e = g.filter(a, function (a) {
                return !a.isReference
            }),
                c = g.filter(a, function (a) {
                    return !!a.isReference
                });
            return a = e.concat(c)
        }

        function ma(a) {
            var f = null;
            a = a[0];
            a.url && !a.type ? a.resourceInfo.spatialReference && (f = new y, a.resourceInfo.spatialReference.wkid && (f.wkid = a.resourceInfo.spatialReference.wkid), a.resourceInfo.spatialReference.wkt && (f.wkt = a.resourceInfo.spatialReference.wkt)) : -1 < a.type.indexOf("BingMaps") || "OpenStreetMap" == a.type ? f = new y({
                wkid: 102100
            }) : "WMS" == a.type && (f = new y({
                wkid: a.spatialReferences[0]
            }));
            return f
        }

        function Za(a, f, b, d, e, c, h) {
            g.forEach(f,
                function (b, c) {
                    b.url && !b.type && (b.resourceInfo = a[b.deferredsPos][1], delete b.deferredsPos)
                });
            c = c || ma(f);
            f = la(f, b, c, h);
            e.callback(f);
            return e
        }

        function $a(a, f) {
            var b = A(a);
            return x({
                url: b,
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                error: function (a, e) {
                    a.message = a.message ? a.message + (" [url:" + b + "]") : "[url:" + b + "]";
                    f.push(a);
                    H.defaults.io.errorHandler(a, e)
                }
            })
        }

        function ab(a) {
            var f = q.arcgisUrl + "/" + a.itemId + "/data";
            return x({
                url: f,
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                error: function (b, d) {
                    b.message =
                        b.message ? b.message + (" [url:" + f + "]") : "[url:" + f + "]";
                    a.errors = a.errors || [];
                    a.errors.push(b);
                    H.defaults.io.errorHandler(b, d)
                }
            })
        }

        function bb(a, f, b) {
            var d = new s;
            if ((!b.featureCollection || !b.featureCollection.layers) && !b.layers) return console.log("Invalid Feature Collection item data [item id: " + a.itemId + "]: ", b), a.errors = a.errors || [], a.errors.push({
                message: "Invalid Feature Collection item data. [item id: " + a.itemId + "]"
            }), d.errback(), d;
            b.layers && (b.featureCollection = {
                layers: b.layers
            }, delete b.layers, k.isDefined(b.showLegend) &&
                (b.featureCollection.showLegend = b.showLegend, delete b.showLegend));
            cb(a, b.featureCollection, f).then(function (e) {
                b.featureCollection = e;
                a.featureCollection && a.featureCollection.layers ? g.forEach(b.featureCollection.layers, function (b, d) {
                    var e = a.featureCollection.layers[d];
                    if (!e.poupInfo && !e.layerDefinition) e.popupInfo = b.popupInfo, e.layerDefinition = b.layerDefinition;
                    else if (e.layerDefinition) {
                        if (k.isDefined(e.layerDefinition.minScale) && k.isDefined(e.layerDefinition.maxScale) && (e.layerDefinition.minScale !==
                                b.layerDefinition.minScale || e.layerDefinition.maxScale !== b.layerDefinition.maxScale)) delete b.layerDefinition.minscale, delete b.layerDefinition.maxScale;
                        e.layerDefinition.drawingInfo && G.toJson(e.layerDefinition.drawingInfo) !== G.toJson(b.layerDefinition.drawingInfo) && delete b.layerDefinition.drawingInfo;
                        e.layerDefinition.showLegend !== b.layerDefinition.showLegend && delete b.layerDefinition.showLegend;
                        e.layerDefinition = l.mixin(e.layerDefinition, b.layerDefinition)
                    } else e.layerDefinition = b.layerDefinition;
                    e.featureSet = b.featureSet;
                    e.nextObjectId = b.nextObjectId
                }) : (a.featureCollection = a.featureCollection || {}, a.featureCollection = l.mixin(a.featureCollection, b.featureCollection));
                d.callback(a)
            });
            return d
        }

        function cb(a, f, b) {
            var d = new s;
            $(["./csv"], function (e) {
                var c = [];
                g.forEach(f.layers, function (a) {
                    a.featureSet && (a.featureSet.features && a.featureSet.features.length && a.featureSet.features[0].geometry && a.featureSet.features[0].geometry.spatialReference) && (a.deferredsPos = c.length, c.push(e.projectFeatureCollection(a,
                        b, a.featureSet.features[0].geometry.spatialReference)))
                });
                (new B(c)).addCallback(function () {
                    g.forEach(f.layers, function (b) {
                        k.isDefined(b.deferredsPos) && (c[b.deferredsPos].results && c[b.deferredsPos].results.length ? b = c[b.deferredsPos].results[0] : (console.log("Errors projecting feature collection. [" + a.title + " - " + b.layerDefinition.name + "]"), b.errors = b.errors || [], b.errors.push({
                            message: "Errors projecting feature collection. [" + a.title + " - " + b.layerDefinition.name + "]"
                        })), delete b.deferredsPos)
                    });
                    d.callback(f)
                })
            });
            return d
        }

        function L(a, f, b, d) {
            var e = new s,
                c = new s,
                h = [],
                m;
            g.forEach(a.operationalLayers, function (a) {
                a.itemId && "Feature Collection" == a.type && h.push(ab(a).then(l.hitch(null, bb, a, b)))
            });
            0 === h.length ? db(a, f, b, d, c) : (m = new B(h), m.addCallback(function (e) {
                db(a, f, b, d, c)
            }));
            c.then(function (a) {
                h = [];
                g.forEach(a, function (a) {
                    a = a.layerObject;
                    if (a instanceof z && !a.loaded && !a.loadError) {
                        var b = new s;
                        xa.once(a, "load, error", function () {
                            b.callback(a)
                        });
                        h.push(b)
                    }
                });
                if (h.length) {
                    var b = new s;
                    m = new B(h);
                    m.addCallback(function () {
                        b.callback(a)
                    });
                    return b.promise
                }
                return a
            }).then(function (a) {
                var b = [];
                g.forEach(a, function (a) {
                    if (a.layerObject instanceof z) {
                        var c = a.layerObject;
                        c.loaded && (c.labelingInfo && (a.showLabels || c._collection)) && b.push(c)
                    }
                });
                b.length ? $(["../layers/LabelLayer"], function (c) {
                    var d = new c;
                    g.forEach(b, function (a) {
                        d.addFeatureLayer(a)
                    });
                    a.push({
                        layerObject: d
                    });
                    e.callback(a)
                }) : e.callback(a)
            });
            return e
        }

        function db(a, f, b, d, e) {
            var c = [],
                h = [],
                m = [];
            g.forEach(a.operationalLayers, function (a, b) {
                a.featureCollection ? g.forEach(a.featureCollection.layers,
                    function (c, d) {
                        var e = !0;
                        a.visibleLayers && -1 == g.indexOf(a.visibleLayers, d) && (e = !1);
                        c.visibility = a.visibility && e;
                        c.opacity = a.opacity;
                        c.id = (a.id || "operational" + b) + "_" + d;
                        m.push(c)
                    }, this) : m.push(a)
            });
            g.forEach(a.baseMap.baseMapLayers, function (a, b) {
                a.baseMapLayer = !0;
                a.id = a.id || "base" + b;
                c.push(a)
            });
            g.forEach(m, function (a, b) {
                a.id = a.id || "operational" + b;
                c.push(a)
            });
            g.forEach(c, function (a) {
                a.url && !a.type && (a.deferredsPos = h.length, a.errors = a.errors || [], h.push($a(a.url, a.errors)))
            });
            0 === h.length ? (b = b || ma(c), c =
                la(c, f, b, d), e.callback(c)) : (new B(h)).addCallback(function (a) {
                    Za(a, c, f, h, e, b, d)
                });
            return e
        }

        function M(a, f, b, d) {
            var e = a.minScale,
                c = a.maxScale;
            if (10.1 >= b.version && f)
                for (a = f.length - 1; 0 <= a; a--) {
                    if (f[a].id == d)
                        if (0 == e && 0 < f[a].minScale ? e = f[a].minScale : 0 < e && 0 == f[a].minScale ? e = b.minScale : 0 < e && 0 < f[a].minScale && (e = Math.min(e, f[a].minScale)), c = Math.max(b.maxScale || 0, f[a].maxScale || 0), b.setScaleRange(e, c), -1 < f[a].parentLayerId) d = f[a].parentLayerId;
                        else break
                } else 10.1 < b.version && (g.forEach(a.layerInfos, function (a) {
                    a.id ==
                        d && (0 == e && 0 < a.minScale ? e = a.minScale : 0 < e && 0 == a.minScale || 0 < e && 0 < a.minScale && (e = Math.min(e, a.minScale)), c = Math.max(c || 0, a.maxScale || 0))
                }), b.setScaleRange(e, c))
        }

        function N(a, f, b, d) {
            var e = a.url,
                c = a.__popupIds,
                h = a.__popupUrls,
                m = a.__popupWhereClauses,
                r = a.__popupMinScales,
                n = a.__popupMaxScales,
                p = a.__resourceInfo,
                v = [];
            g.forEach(a.__popups, function (d, l) {
                if (d) {
                    var q, s = [];
                    g.forEach(d.fieldInfos, function (a) {
                        "shape" !== a.fieldName.toLowerCase() && s.push(a.fieldName)
                    });
                    if (a.dynamicLayerInfos && 0 < a.dynamicLayerInfos.length) {
                        var t =
                            g.filter(a.dynamicLayerInfos, function (a) {
                                return c[l] == a.id
                            })[0].source;
                        q = new z(e + "/dynamicLayer", {
                            id: a.id + "_" + c[l],
                            source: t,
                            outFields: s,
                            mode: z.MODE_SELECTION,
                            infoTemplate: d && new b(d),
                            drawMode: !1,
                            visible: a.visible,
                            autoGeneralize: !0
                        });
                        var w = function (b, d) {
                            0 < m[b].length && d.setDefinitionExpression(m[b]);
                            if (!k.isDefined(r[b]) && !k.isDefined(n[b])) M(a, f || p.layers, d, c[b]);
                            else if (k.isDefined(a.minScale) || k.isDefined(a.maxScale)) {
                                var e = a.minScale,
                                    h = a.maxScale;
                                0 == e && 0 < r[b] ? e = r[b] : 0 < e && 0 == r[b] || 0 < e && 0 < r[b] &&
                                    (e = Math.min(e, r[b]));
                                h = Math.max(h || 0, n[b] || 0);
                                d.setScaleRange(e, h)
                            } else d.setScaleRange(r[b], n[b])
                        };
                        q.loaded ? w(l, q) : u.connect(q, "onLoad", function (a) {
                            w(l, q)
                        })
                    } else {
                        var x = null,
                            y = e + "/" + c[l];
                        if (h[l].length) y = h[l];
                        else if (f)
                            for (t = 0; t < f.length; t++)
                                if (f[t].id === c[l]) {
                                    x = f[t];
                                    break
                                }
                        q = new z(A(y), {
                            id: a.id + "_" + c[l],
                            outFields: s,
                            mode: z.MODE_SELECTION,
                            infoTemplate: d && new b(d),
                            drawMode: !1,
                            visible: a.visible,
                            resourceInfo: x,
                            autoGeneralize: !0
                        });
                        q.loaded ? (0 < m[l].length && q.setDefinitionExpression(m[l]), M(a, f || p.layers,
                            q, c[l])) : u.connect(q, "onLoad", function (b) {
                                0 < m[l].length && q.setDefinitionExpression(m[l]);
                                M(a, f || p.layers, b, c[l])
                            })
                    }
                    v.push(q)
                }
            });
            0 < v.length && (u.connect(a, "onVisibilityChange", l.hitch(this, function (a, b) {
                g.forEach(a, function (a) {
                    b ? a.show() : a.hide()
                })
            }, v)), u.connect(d, "onLayerRemove", l.hitch(this, function (a, b, c) {
                a.id === c.id && g.forEach(b, function (a) {
                    d.removeLayer(a)
                })
            }, a, v)));
            delete a.__popups;
            delete a.__popupIds;
            delete a.__popupUrls;
            delete a.__popupWhereClauses;
            delete a.__popupMinScales;
            delete a.__popupMaxScales;
            delete a.__resourceInfo;
            return v
        }

        function eb(a) {
            return x({
                url: A(a.url + "/layers"),
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                error: function () { }
            })
        }

        function fb(a, f, b) {
            var d = [];
            g.forEach(a, function (a) {
                var b = a.__popups;
                b && (1 < b.length && 10 <= a.version) && (a.__deferredsPos = d.length, d.push(eb(a)))
            });
            var e = [];
            0 < d.length ? (new B(d)).addCallback(function (c) {
                g.forEach(a, function (a) {
                    a.__popups && 0 < a.__popups.length && (a.__deferredsPos || 0 === a.__deferredsPos ? (e = e.concat(N(a, c[a.__deferredsPos][1].layers, b, f)), delete a.__deferredsPos) :
                        e = e.concat(N(a, null, b, f)))
                });
                f.addLayers(e)
            }) : (g.forEach(a, function (a) {
                a.__popups && 0 < a.__popups.length && (e = e.concat(N(a, null, b, f)))
            }), f.addLayers(e))
        }

        function gb(a) {
            g.forEach(a, function (a) {
                var b = a.layer;
                b.toJson && (a = b.toJson(), a.featureSet && (b.name && -1 < b.name.indexOf("Text")) && g.forEach(a.featureSet.features, function (a, e) {
                    if (a.attributes.TEXT) {
                        var c = b.graphics[e];
                        c.symbol.setText(a.attributes.TEXT);
                        a.symbol.horizontalAlignment && (c.symbol.align = a.symbol.horizontalAlignment);
                        c.setSymbol(c.symbol);
                        c.setAttributes(a.attributes)
                    }
                },
                    this))
            })
        }

        function hb(a) {
            var f = 6;
            g.forEach(a, function (a) {
                if (a = a.renderer) "esri.renderer.SimpleRenderer" === a.declaredClass ? ((a = a.symbol) && a.xoffset && (f = Math.max(f, Math.abs(a.xoffset))), a && a.yoffset && (f = Math.max(f, Math.abs(a.yoffset)))) : ("esri.renderer.UniqueValueRenderer" === a.declaredClass || "esri.renderer.ClassBreaksRenderer" === a.declaredClass) && g.forEach(a.infos, function (a) {
                    (a = a.symbol) && a.xoffset && (f = Math.max(f, Math.abs(a.xoffset)));
                    a && a.yoffset && (f = Math.max(f, Math.abs(a.yoffset)))
                })
            });
            return f
        }

        function na(a) {
            var f =
                this,
                b = f.infoWindow,
                d = a.graphic;
            if (f.loaded) {
                b.hide();
                b.clearFeatures();
                var e = [];
                g.forEach(f.graphicsLayerIds, function (a) {
                    if ((a = f.getLayer(a)) && -1 !== a.declaredClass.indexOf("FeatureLayer") && a.loaded && a.visible) a.clearSelection(), a.infoTemplate && !a.suspended && e.push(a)
                });
                g.forEach(f.layerIds, function (a) {
                    (a = f.getLayer(a)) && (-1 !== a.declaredClass.indexOf("ArcGISImageServiceLayer") && a.loaded && a.visible && a.infoTemplate) && e.push(a)
                });
                d = d && d.getInfoTemplate() ? d : null;
                if (e.length || d) {
                    var c = hb(e),
                        h = a.screenPoint,
                        m = f.toMap(new za(h.x - c, h.y + c)),
                        c = f.toMap(new za(h.x + c, h.y - c)),
                        m = new C(m.x, m.y, c.x, c.y, f.spatialReference),
                        k = new rb;
                    k.geometry = m;
                    k.timeExtent = f.timeExtent;
                    var n = !0,
                        m = g.map(e, function (b) {
                            var c; -1 !== b.declaredClass.indexOf("ArcGISImageServiceLayer") ? (k.geometry = a.mapPoint, n = !1, c = b.queryVisibleRasters(k, {
                                rasterAttributeTableFieldPrefix: "Raster.",
                                returnDomainValues: !0
                            }), c.addCallback(function () {
                                return b.getVisibleRasters()
                            })) : (c = b.selectFeatures(k), c.addCallback(function () {
                                return b.getSelectedFeatures()
                            }));
                            return c
                        });
                    d && (c = new s, c.callback([d]), m.splice(0, 0, c));
                    if (!g.some(m, function (a) {
                            return -1 === a.fired
                    })) {
                        var p = d ? 1 : 0;
                        g.forEach(e, function (a) {
                            p = -1 !== a.declaredClass.indexOf("ArcGISImageServiceLayer") ? p + a.getVisibleRasters().length : p + a.getSelectedFeatures().length
                        });
                        if (!p) return
                    }
                    b.setFeatures(m);
                    b.show(a.mapPoint, {
                        closestFirst: n
                    })
                }
            }
        }

        function wb(a, f) {
            var b = f.mapOptions || {},
                d;
            b.infoWindow || (d = new qb({
                visibleWhenEmpty: !1
            }, nb.create("div")), b.infoWindow = d);
            !k.isDefined(b.showInfoWindowOnClick) && !f.usePopupManager &&
                (b.showInfoWindowOnClick = !1);
            b = new ob(a, b);
            u.connect(b, "onLayersAddResult", gb);
            return b
        }

        function w(a, f, b, d, e, c) {
            var h, m, k, n;
            d.map ? (h = d.map, m = d.clickEventHandle, k = d.clickEventListener, n = d.errors) : (h = wb(d, e), !e.ignorePopups && (!e.disableClickBehavior && !e.usePopupManager) && (m = u.connect(h, "onClick", na), k = na));
            h.addLayers(a);
            !e.ignorePopups && !e.usePopupManager && fb(a, h, e._clazz);
            var p = n || [];
            g.forEach(f, function (a) {
                a.errors && (p = p.concat(a.errors))
            }, this);
            h.loaded ? c.callback({
                map: h,
                itemInfo: b,
                errors: p,
                clickEventHandle: m,
                clickEventListener: k
            }) : u.connect(h, "onLoad", function () {
                c.callback({
                    map: h,
                    itemInfo: b,
                    errors: p,
                    clickEventHandle: m,
                    clickEventListener: k
                })
            })
        }

        function O(a, f, b, d, e) {
            var c = [];
            g.forEach(e, function (a) {
                l.isArray(a.layerObject) ? g.forEach(a.layerObject, function (a) {
                    c.push(a)
                }) : c.push(a.layerObject)
            });
            if ("BingMapsAerial" === e[0].type || "BingMapsRoad" === e[0].type || "BingMapsHybrid" === e[0].type) var h = setInterval(function () {
                if (e[0].layerObject && e[0].layerObject.loaded) clearInterval(h), ib(a, f, b, d, e, c);
                else if (e[0].errors) {
                    clearInterval(h);
                    var g = "";
                    e[0].errors && e[0].errors.length && (g = " (" + e[0].errors[0].message + ")");
                    d.errback(Error(aa.arcgis.utils.baseLayerError + g))
                }
            }, 10);
            else if (!c[0] && e[0].baseMapLayer) {
                var m = "";
                e[0].errors && e[0].errors.length && (m = " (" + e[0].errors[0].message + ")");
                d.errback(Error(aa.arcgis.utils.baseLayerError + m))
            } else ib(a, f, b, d, e, c)
        }

        function ib(a, f, b, d, e, c) {
            try {
                var h = b.mapOptions || {};
                b.mapOptions = h;
                var m = a.item;
                c = g.filter(c, k.isDefined);
                if (m)
                    if (m.extent && m.extent.length)
                        if (h.extent) w(c, e, a, f, b, d);
                        else {
                            var l = new C(m.extent[0][0],
                                    m.extent[0][1], m.extent[1][0], m.extent[1][1], new y({
                                        wkid: 4326
                                    })),
                                n = c[0].spatialReference;
                            4326 === n.wkid ? (h.extent = l, w(c, e, a, f, b, d)) : 102100 === n.wkid || 102113 === n.wkid || 3857 === n.wkid ? (l.xmin = Math.max(l.xmin, -180), l.xmax = Math.min(l.xmax, 180), l.ymin = Math.max(l.ymin, -89.99), l.ymax = Math.min(l.ymax, 89.99), h.extent = pb.geographicToWebMercator(l), w(c, e, a, f, b, d)) : b.geometryServiceURL || H.defaults.geometryService ? (b.geometryServiceURL ? new sb(b.geometryServiceURL) : H.defaults.geometryService).project([l], n, function (g) {
                                g =
                                    g[0];
                                h.extent = h.extent || g;
                                w(c, e, a, f, b, d)
                            }, function () {
                                w(c, e, a, f, b, d)
                            }) : d.errback(Error(aa.arcgis.utils.geometryServiceError))
                        } else w(c, e, a, f, b, d);
                else w(c, e, a, f, b, d)
            } catch (p) {
                d.errback(p)
            }
        }

        function jb(a) {
            var f = [];
            a = a.baseMap.baseMapLayers.concat(a.operationalLayers);
            g.forEach(a, function (a) {
                var d = {};
                if (a.featureCollection && "CSV" !== a.type) !0 === a.featureCollection.showLegend && g.forEach(a.featureCollection.layers, function (c) {
                    !1 !== c.showLegend && (d = {
                        layer: c.layerObject,
                        title: a.title,
                        defaultSymbol: c.renderer &&
                            c.renderer.defaultSymbol && c.renderer.defaultLabel ? !0 : !1
                    }, 1 < a.featureCollection.layers.length && (d.title += " - " + c.layerDefinition.name), f.push(d))
                });
                else if (a.baseMapLayer && !0 === a.showLegend && a.layerObject || !a.baseMapLayer && !1 !== a.showLegend && a.layerObject) {
                    var e = a.layerObject.renderer,
                        c = a.layerObject.declaredClass,
                        e = !e || e && e.defaultSymbol && e.defaultLabel ? !0 : !1;
                    if (10.1 > a.layerObject.version && ("esri.layers.ArcGISDynamicMapServiceLayer" === c || "esri.layers.ArcGISTiledMapServiceLayer" === c) || "esri.layers.ArcGISImageServiceLayer" ===
                        c) e = !0;
                    d = {
                        layer: a.layerObject,
                        title: a.title,
                        defaultSymbol: e
                    };
                    a.layers && (c = g.map(g.filter(a.layers, function (a) {
                        return !1 === a.showLegend
                    }), function (a) {
                        return a.id
                    }), c.length && (d.hideLayers = c));
                    f.push(d)
                }
            });
            return f
        }

        function xb(a, f) {
            var b = new s,
                d = a.itemData,
                e = [];
            d.baseMap && d.baseMap.baseMapLayers && (e = e.concat(d.baseMap.baseMapLayers));
            d.operationalLayers && (e = e.concat(d.operationalLayers));
            for (var d = g.map(e, function (a) {
                    return a && a.layerType
            }), c = [], e = !1, h = 0; h < d.length; h++) {
                switch (d[h]) {
                    case "ArcGISFeatureLayer":
                        -1 ===
                            g.indexOf(c, P) && c.push(P);
                        break;
                    case "ArcGISImageServiceLayer":
                        -1 === g.indexOf(c, Q) && (c.push(Q), c.push(oa), c.push(pa), c.push(qa));
                        break;
                    case "ArcGISMapServiceLayer":
                        -1 === g.indexOf(c, R) && (c.push(R), c.push(ra), c.push(sa), c.push(ta));
                        break;
                    case "ArcGISStreamLayer":
                        -1 === g.indexOf(c, S) && c.push(S);
                        break;
                    case "ArcGISTiledImageServiceLayer":
                    case "ArcGISTiledMapServiceLayer":
                        break;
                    case "BingMapsAerial":
                    case "BingMapsHybrid":
                    case "BingMapsRoad":
                        -1 === g.indexOf(c, T) && c.push(T);
                        break;
                    case "CSV":
                        -1 === g.indexOf(c,
                            U) && (c.push(U), c.push(ua));
                        break;
                    case "GeoRSS":
                        -1 === g.indexOf(c, V) && c.push(V);
                        break;
                    case "KML":
                        -1 === g.indexOf(c, W) && c.push(W);
                        break;
                    case "OpenStreetMap":
                        -1 === g.indexOf(c, X) && c.push(X);
                        break;
                    case "WebTiledLayer":
                        -1 === g.indexOf(c, Y) && (c.push(Y), c.push(va));
                        break;
                    case "WMS":
                        -1 === g.indexOf(c, Z) && (c.push(Z), c.push(wa));
                        break;
                    default:
                        e = !0
                }
                if (e) break
            }
            e && (c = yb);
            c.length ? $(c, function () {
                var a = arguments;
                g.forEach(c, function (b, c) {
                    switch (b) {
                        case R:
                            Ha = a[c];
                            break;
                        case Q:
                            Na = a[c];
                            break;
                        case ua:
                            Va = a[c];
                            break;
                        case U:
                            Wa =
                                a[c];
                            break;
                        case ra:
                            Ia = a[c];
                            break;
                        case V:
                            Ua = a[c];
                            break;
                        case sa:
                            Ga = a[c];
                            break;
                        case oa:
                            Ka = a[c];
                            break;
                        case W:
                            Ra = a[c];
                            break;
                        case P:
                            Xa = a[c];
                            break;
                        case ta:
                            Ja = a[c];
                            break;
                        case pa:
                            Ma = a[c];
                            break;
                        case X:
                            Oa = a[c];
                            break;
                        case qa:
                            La = a[c];
                            break;
                        case S:
                            Ya = a[c];
                            break;
                        case va:
                            Ta = a[c];
                            break;
                        case T:
                            t = a[c];
                            break;
                        case Y:
                            Sa = a[c];
                            break;
                        case Z:
                            Qa = a[c];
                            break;
                        case wa:
                            Pa = a[c]
                    }
                });
                b.resolve()
            }) : b.resolve();
            return b
        }

        function kb(a, f, b, d) {
            xb(d, f).then(function () {
                ub(d, f).then(function (e) {
                    var c = e[0],
                        d = e[1];
                    if (!c.itemData.operationalLayers ||
                        0 === c.itemData.operationalLayers.length) I(c, d).addCallback(function (c) {
                            L(c.itemData, d).addCallback(l.hitch(null, O, c, a, d, b))
                        });
                    else {
                        var f = new s,
                            k = c.itemData.baseMap.baseMapLayers.slice(),
                            n = g.filter(c.itemData.baseMap.baseMapLayers, function (a) {
                                return !a.isReference
                            });
                        e = {
                            item: c.item,
                            itemData: {
                                baseMap: {
                                    baseMapLayers: n
                                }
                            }
                        };
                        c.itemData.baseMap.baseMapLayers = g.filter(c.itemData.baseMap.baseMapLayers, function (a) {
                            return a.isReference
                        });
                        I(e, d).addCallback(function (b) {
                            L(b.itemData, d).addCallback(l.hitch(null, O,
                                b, a, d, f))
                        });
                        f.then(function (a) {
                            I(c, d).addCallback(function (c) {
                                L(c.itemData, d, a.map.spatialReference, n).addCallback(function (e) {
                                    c.itemData.baseMap.baseMapLayers = k;
                                    O(c, a, d, b, e)
                                })
                            })
                        }, l.hitch(b, b.errback))
                    }
                })
            })
        }

        function lb(a) {
            q._arcgisUrl && 0 < q._arcgisUrl.length && (q.arcgisUrl = q._arcgisUrl);
            var f = q.arcgisUrl + "/" + a,
                b = {},
                d = new s;
            x({
                url: f,
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                load: function (a) {
                    b.item = a;
                    x({
                        url: f + "/data",
                        content: {
                            f: "json"
                        },
                        callbackParamName: "callback",
                        load: function (a) {
                            b.itemData = a;
                            d.callback(b)
                        },
                        error: function (a) {
                            d.errback(a)
                        }
                    })
                },
                error: function (a) {
                    d.errback(a)
                }
            });
            return d
        }
        String.prototype.endsWith = function (a) {
            return this.match(a + "$") == a
        };
        var q, Ha, Na, Va, Wa, Ia, Ua, Ga, Ka, Ra, Xa, Ja, Ma, Oa, La, Ya, Ta, t, Sa, Qa, Pa, R = "../layers/ArcGISDynamicMapServiceLayer",
            Q = "../layers/ArcGISImageServiceLayer",
            ua = "./csv",
            U = "../layers/CSVLayer",
            ra = "../layers/DynamicLayerInfo",
            V = "../layers/GeoRSSLayer",
            sa = "../layers/ImageParameters",
            oa = "../layers/ImageServiceParameters",
            W = "../layers/KMLLayer",
            P = "../layers/LabelClass",
            ta = "../layers/LayerDrawingOptions",
            pa = "../layers/MosaicRule",
            X = "../layers/OpenStreetMapLayer",
            qa = "../layers/RasterFunction",
            S = "../layers/StreamLayer",
            va = "../layers/TileInfo",
            T = "../virtualearth/VETiledLayer",
            Y = "../layers/WebTiledLayer",
            Z = "../layers/WMSLayer",
            wa = "../layers/WMSLayerInfo",
            yb = [R, Q, ua, U, ra, V, sa, oa, W, P, ta, pa, X, qa, S, va, T, Y, Z, wa];
        q = {
            arcgisUrl: "http://www.arcgis.com/sharing/rest/content/items",
            getItem: lb,
            createMap: function (a, f, b) {
                var d = new s;
                b = b || {};
                var e = b.infoTemplateClass;
                b._clazz =
                    e && (l.isObject(e) ? e : l.getObject(e)) || Ba;
                l.isString(a) ? lb(a).addCallback(l.hitch(null, kb, f, b, d)).addErrback(l.hitch(d, d.errback)) : kb(f, b, d, a);
                return d
            },
            getLegendLayers: function (a) {
                return a && a.itemInfo && a.itemInfo.itemData ? jb(a.itemInfo.itemData) : []
            },
            _arcgisUrl: null,
            _getItemProps: I,
            _getItemData: E,
            _getBingKey: ba,
            _portalUrlResponse: da,
            _portalUrlFailure: J,
            _processFSItemProperties: ca,
            _processSSItemProperties: Ca,
            _getLayers: L,
            _preBuildLayerObjects: Za,
            _buildLayerObjects: la,
            _preCreateMap: O,
            _getMapSR: ma,
            _createMap: w,
            _addSelectionLayers: fb,
            _createSelectionFeatureLayers: N,
            _getServiceInfo: $a,
            _getFeatureCollectionItem: ab,
            _mergeFeatureCollectionItem: bb,
            _projectFeatureCollection: cb,
            _getLayersInfo: eb,
            _initLayer: ka,
            _loadAsCached: ga,
            _loadAsDynamic: Fa,
            _processPopups: ea,
            _onLayersAddResult: gb,
            _sameSpatialReferenceAsBasemap: ia,
            _sameTilingSchemeAsBasemap: ja,
            _showPopup: na,
            _calculateClickTolerance: hb,
            _getVisibleFeatureLayers: ha,
            _updateLayerScaleInfo: M,
            _checkUrl: A,
            _isHostedService: fa,
            _isAgolService: Ea,
            _getLegendLayers: jb
        };
        l.setObject("arcgis.utils",
            q, F);
        return q
    });