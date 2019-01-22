'use strict';

const path = require('path');
const extend = require('extend');

const data = {
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
    let [sources] = currentItem.cssfiles[0].sources;
    if (currentItem.cssfiles[0].sources.length > 1) {
      sources = `{${currentItem.cssfiles[0].sources.join(',')}}`;
    }

    currentItem.cssfiles[0].sources = path.join(currentItem.sources, sources);
  }

  const stylesPaths = extend(true, {}, currentItem.cssfiles[0]);
  stylesPaths.module = currentItem.module;
  stylesPaths.package = currentItem.package || null;

  data.stylesSourcePath.push(currentItem.cssfiles[0].sources);
  data.stylesPaths.push(stylesPaths);
}

function buildFromJsFiles(currentItem) {
  if (!currentItem.jsfiles) {
    return;
  }

  const transpiling = !!currentItem.transpiledjs;

  let i = currentItem.jsfiles.length;
  while (i--) {
    const item = currentItem.jsfiles[i];
    let sources;

    const bundle = {
      module: currentItem.module,
      package: currentItem.package || null,
      sources: item.sources,
      dest: path.dirname(item.dist),
      concatFilename: path.basename(item.dist),
      transpiling
    };

    if (transpiling) {
      sources = [];

      const transpiledPath = path.join(currentItem.sources, currentItem.transpiledjs);

      for (let j = 0, l = item.sources.length; j < l; j++) {
        const diff = item.sources[j].replace(currentItem.sources, '');
        const source = path.join(transpiledPath, diff);

        sources.push(source);

        const dirname = path.dirname(item.sources[j]);
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
      ({ sources } = item);
    }

    data.scriptsToBuild.push(bundle);

    data.scriptsSourcePath = data.scriptsSourcePath.concat(sources);

    let k = sources.length;
    while (k--) {
      const sourceDirname = path.dirname(sources[k]);
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

  let i = currentItem.otherpaths.length;
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

  const packageName = currentItem.package || currentItem.module;
  data.extraParams[packageName] = extend({}, currentItem.extraParams);

  if (data.extraParams[packageName].customPaths) {
    for (const key in data.extraParams[packageName].customPaths) {
      const item = data.extraParams[packageName].customPaths[key];

      const customPath = {
        dev: path.join(currentItem.sources, item.dist),
        dist: path.join(currentItem.dist, item.dist)
      };

      customPath.sources = item.sources.map(source => path.join(currentItem.sources, source));

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

  for (let i = 0, l = data.packages.length; i < l; i++) {
    const currentItem = data.packages[i];

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
