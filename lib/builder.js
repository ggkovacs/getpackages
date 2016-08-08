'use strict';

var path = require('path');
var extend = require('extend');

var data = {
    packages: {},
    packagesDistPath: [],
    packagesDistPathWithoutImageDir: [],
    stylesPaths: [],
    stylesSourcePath: [],
    scriptsSourcePath: [],
    scriptsSourcePathWithoutFile: [],
    scriptsSourcePathBeforeTranspiling: [],
    scriptsToBuild: [],
    scriptsToTranspiling: [],
    imagesPaths: [],
    imagesSourcePath: [],
    fontsPaths: [],
    otherPaths: [],
    extraParams: {},
    customPaths: {}
};

function buildFromDist(currentItem) {
    data.packagesDistPath.push(currentItem.dist);
}

function buildFromImgPath(currentItem) {
    data.packagesDistPathWithoutImageDir.push(path.join(currentItem.dist, '*'));

    if (!currentItem.imgPath) {
        return;
    }

    data.packagesDistPathWithoutImageDir.push(path.join('!', currentItem.dist, currentItem.imgPath));

    data.imagesPaths.push({
        module: currentItem.module,
        package: currentItem.package || null,
        sources: path.join(currentItem.sources, currentItem.imgPath),
        dest: path.join(currentItem.dist, currentItem.imgPath)
    });

    data.imagesSourcePath.push(path.join(currentItem.sources, currentItem.imgPath));
}

function buildFromCssFiles(currentItem) {
    if (!currentItem.cssfiles) {
        return;
    }

    if (Array.isArray(currentItem.cssfiles[0].sources)) {
        var sources = currentItem.cssfiles[0].sources[0];
        if (currentItem.cssfiles[0].sources.length > 1) {
            sources = '{' + currentItem.cssfiles[0].sources.join(',') + '}';
        }

        currentItem.cssfiles[0].sources = path.join(currentItem.sources, sources);
    }

    var stylesPaths = extend(true, {}, currentItem.cssfiles[0]);
    stylesPaths.module = currentItem.module;
    stylesPaths.package = currentItem.package || null;

    data.stylesSourcePath.push(currentItem.cssfiles[0].sources);
    data.stylesPaths.push(stylesPaths);
}

function buildFromJsFiles(currentItem) {
    if (!currentItem.jsfiles) {
        return;
    }

    var transpiling = !!currentItem.transpiledjs;

    var i = currentItem.jsfiles.length;
    while (i--) {
        var item = currentItem.jsfiles[i];
        var sources;

        var bundle = {
            module: currentItem.module,
            package: currentItem.package || null,
            sources: item.sources,
            dest: path.dirname(item.dist),
            concatFilename: path.basename(item.dist),
            transpiling: transpiling
        };

        if (transpiling) {
            sources = [];

            var transpiledPath = path.join(currentItem.sources, currentItem.transpiledjs);

            for (var j = 0, l = item.sources.length; j < l; j++) {
                var diff = item.sources[j].replace(currentItem.sources, '');
                var source = path.join(transpiledPath, diff);

                sources.push(source);

                var dirname = path.dirname(item.sources[j]);
                if (data.scriptsSourcePathBeforeTranspiling.indexOf(dirname) === -1) {
                    data.scriptsSourcePathBeforeTranspiling.push(dirname);

                    data.scriptsToTranspiling.push({
                        module: currentItem.module,
                        package: currentItem.package || null,
                        sources: dirname,
                        dest: path.join(currentItem.sources, currentItem.transpiledjs, path.dirname(diff))
                    });
                }
            }
        } else {
            sources = item.sources;
        }

        data.scriptsToBuild.push(bundle);

        data.scriptsSourcePath = data.scriptsSourcePath.concat(sources);

        var k = sources.length;
        while (k--) {
            var sourceDirname = path.dirname(sources[k]);
            if (data.scriptsSourcePathWithoutFile.indexOf(sourceDirname) === -1) {
                data.scriptsSourcePathWithoutFile.push(sourceDirname);
            }
        }
    }
}

function buildFromFontPath(currentItem) {
    if (!currentItem.fontPath) {
        return;
    }

    data.fontsPaths.push({
        module: currentItem.module,
        package: currentItem.package || null,
        sources: path.join(currentItem.sources, currentItem.fontPath),
        dest: path.join(currentItem.dist, currentItem.fontPath)
    });
}

function buildFromOtherPaths(currentItem) {
    if (!currentItem.otherpaths) {
        return;
    }

    var i = currentItem.otherpaths.length;
    while (i--) {
        data.otherPaths.push({
            module: currentItem.module,
            package: currentItem.package || null,
            sources: path.join(currentItem.sources, currentItem.otherpaths[i]),
            dest: path.join(currentItem.dist, currentItem.otherpaths[i])
        });
    }
}

function buildFromExtraParams(currentItem) {
    if (!currentItem.extraParams) {
        return;
    }

    var packageName = currentItem.package || currentItem.module;
    data.extraParams[packageName] = extend({}, currentItem.extraParams);

    if (data.extraParams[packageName].customPaths) {
        for (var key in data.extraParams[packageName].customPaths) {
            var item = data.extraParams[packageName].customPaths[key];

            var customPath = {
                dev: path.join(currentItem.sources, item.dist),
                dist: path.join(currentItem.dist, item.dist)
            };

            customPath.sources = item.sources.map(function(source) {
                return path.join(currentItem.sources, source);
            });

            if (item.params) {
                customPath.params = item.params;
            }

            if (Array.isArray(data.customPaths[key])) {
                data.customPaths[key].push(customPath);
            } else {
                data.customPaths[key] = [customPath];
            }
        }

        delete data.extraParams[packageName].customPaths;
    }
}

module.exports = function(packages) {
    data.packages = packages;

    if (data.packages.length === 0) {
        return data;
    }

    for (var i = 0, l = data.packages.length; i < l; i++) {
        var currentItem = data.packages[i];

        buildFromDist(currentItem);
        buildFromImgPath(currentItem);
        buildFromCssFiles(currentItem);
        buildFromJsFiles(currentItem);
        buildFromFontPath(currentItem);
        buildFromOtherPaths(currentItem);
        buildFromExtraParams(currentItem);
    }

    return data;
};
