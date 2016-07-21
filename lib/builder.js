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
    scriptsToBuild: [],
    imagesPaths: [],
    imagesSourcePath: [],
    fontsPaths: [],
    extraParams: {}
};

function buildFromDist(currentItem) {
    data.packagesDistPath.push(currentItem.dist);
}

function buildFromImgPath(currentItem) {
    if (!currentItem.imgPath) {
        return;
    }

    data.packagesDistPathWithoutImageDir.push(path.join(currentItem.dist, '*'));
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

    var j = currentItem.jsfiles.length;
    while (j--) {
        var item = currentItem.jsfiles[j];

        data.scriptsSourcePath = data.scriptsSourcePath.concat(item.sources);

        var k = item.sources.length;
        while (k--) {
            var sourceDirname = path.dirname(item.sources[k]);
            if (data.scriptsSourcePathWithoutFile.indexOf(sourceDirname) === -1) {
                data.scriptsSourcePathWithoutFile.push(sourceDirname);
            }
        }

        data.scriptsToBuild.push({
            module: currentItem.module,
            package: currentItem.package || null,
            sources: item.sources,
            dest: path.dirname(item.dist),
            concatFilename: path.basename(item.dist)
        });
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

function buildFromExtraParams(currentItem) {
    if (!currentItem.extraParams) {
        return;
    }

    if (currentItem.package) {
        data.extraParams[currentItem.package] = currentItem.extraParams;
    } else {
        data.extraParams[currentItem.module] = currentItem.extraParams;
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
        buildFromExtraParams(currentItem);
    }

    return data;
};
