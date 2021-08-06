import { CanvasTexture, LinearFilter, RepeatWrapping, Frustum, Matrix4 as Matrix4$1, Group, PlaneGeometry, Vector3 as Vector3$1, MeshBasicMaterial, DoubleSide, Mesh, ArrowHelper, Color, BoxGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, MeshStandardMaterial, Interpolant, Loader, LoaderUtils, FileLoader, SpotLight, PointLight, DirectionalLight, MeshPhysicalMaterial, Vector2 as Vector2$1, TangentSpaceNormalMap, ImageBitmapLoader, TextureLoader, InterleavedBuffer, InterleavedBufferAttribute, BufferAttribute, RGBFormat, LinearMipmapLinearFilter, PointsMaterial, Material, sRGBEncoding, PropertyBinding, BufferGeometry, SkinnedMesh, Line, LineLoop, Points, PerspectiveCamera, MathUtils, OrthographicCamera, InterpolateLinear, AnimationClip, Bone, Object3D, Skeleton, NearestFilter, NearestMipmapNearestFilter, LinearMipmapNearestFilter, NearestMipmapLinearFilter, ClampToEdgeWrapping, MirroredRepeatWrapping, InterpolateDiscrete, FrontSide, TriangleFanDrawMode, TriangleStripDrawMode, VectorKeyframeTrack, QuaternionKeyframeTrack, NumberKeyframeTrack, Box3, Sphere, ShaderMaterial, Float32BufferAttribute, Uint8BufferAttribute } from 'three';
import { GLTFLoader as GLTFLoader$2 } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function assert$7(condition, message) {
  if (!condition) {
    throw new Error(message || 'loader assertion failed.');
  }
}

const globals$2 = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document
};
const global_$2 = globals$2.global || globals$2.self || globals$2.window || {};
const isBrowser$2 = typeof process !== 'object' || String(process) !== '[object process]' || process.browser;
const matches$2 = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
const nodeVersion = matches$2 && parseFloat(matches$2[1]) || 0;

const VERSION$5 = "3.0.0-beta.3" ;

function assert$6(condition, message) {
  if (!condition) {
    throw new Error(message || 'loaders.gl assertion failed.');
  }
}

const globals$1 = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document
};
const global_$1 = globals$1.global || globals$1.self || globals$1.window || {};
const isBrowser$1 = typeof process !== 'object' || String(process) !== '[object process]' || process.browser;
const isWorker = typeof importScripts === 'function';
const isMobile = typeof window !== 'undefined' && typeof window.orientation !== 'undefined';
const matches$1 = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
matches$1 && parseFloat(matches$1[1]) || 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class WorkerJob {
  constructor(jobName, workerThread) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "workerThread", void 0);

    _defineProperty(this, "isRunning", void 0);

    _defineProperty(this, "result", void 0);

    _defineProperty(this, "_resolve", void 0);

    _defineProperty(this, "_reject", void 0);

    this.name = jobName;
    this.workerThread = workerThread;
    this.isRunning = true;

    this._resolve = () => {};

    this._reject = () => {};

    this.result = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  postMessage(type, payload) {
    this.workerThread.postMessage({
      source: 'loaders.gl',
      type,
      payload
    });
  }

  done(value) {
    assert$6(this.isRunning);
    this.isRunning = false;

    this._resolve(value);
  }

  error(error) {
    assert$6(this.isRunning);
    this.isRunning = false;

    this._reject(error);
  }

}

const workerURLCache = new Map();
function getLoadableWorkerURL(props) {
  assert$6(props.source && !props.url || !props.source && props.url);
  let workerURL = workerURLCache.get(props.source || props.url);

  if (!workerURL) {
    if (props.url) {
      workerURL = getLoadableWorkerURLFromURL(props.url);
      workerURLCache.set(props.url, workerURL);
    }

    if (props.source) {
      workerURL = getLoadableWorkerURLFromSource(props.source);
      workerURLCache.set(props.source, workerURL);
    }
  }

  assert$6(workerURL);
  return workerURL;
}

function getLoadableWorkerURLFromURL(url) {
  if (!url.startsWith('http')) {
    return url;
  }

  const workerSource = buildScriptSource(url);
  return getLoadableWorkerURLFromSource(workerSource);
}

function getLoadableWorkerURLFromSource(workerSource) {
  const blob = new Blob([workerSource], {
    type: 'application/javascript'
  });
  return URL.createObjectURL(blob);
}

function buildScriptSource(workerUrl) {
  return "try {\n  importScripts('".concat(workerUrl, "');\n} catch (error) {\n  console.error(error);\n  throw error;\n}");
}

function getTransferList(object, recursive = true, transfers) {
  const transfersSet = transfers || new Set();

  if (!object) ; else if (isTransferable(object)) {
    transfersSet.add(object);
  } else if (isTransferable(object.buffer)) {
    transfersSet.add(object.buffer);
  } else if (ArrayBuffer.isView(object)) ; else if (recursive && typeof object === 'object') {
    for (const key in object) {
      getTransferList(object[key], recursive, transfersSet);
    }
  }

  return transfers === undefined ? Array.from(transfersSet) : [];
}

function isTransferable(object) {
  if (!object) {
    return false;
  }

  if (object instanceof ArrayBuffer) {
    return true;
  }

  if (typeof MessagePort !== 'undefined' && object instanceof MessagePort) {
    return true;
  }

  if (typeof ImageBitmap !== 'undefined' && object instanceof ImageBitmap) {
    return true;
  }

  if (typeof OffscreenCanvas !== 'undefined' && object instanceof OffscreenCanvas) {
    return true;
  }

  return false;
}

const NOOP = () => {};

class WorkerThread {
  static isSupported() {
    return typeof Worker !== 'undefined';
  }

  constructor(props) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "source", void 0);

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "terminated", false);

    _defineProperty(this, "worker", void 0);

    _defineProperty(this, "onMessage", void 0);

    _defineProperty(this, "onError", void 0);

    _defineProperty(this, "_loadableURL", '');

    const {
      name,
      source,
      url
    } = props;
    assert$6(source || url);
    this.name = name;
    this.source = source;
    this.url = url;
    this.onMessage = NOOP;

    this.onError = error => console.log(error);

    this.worker = this._createBrowserWorker();
  }

  destroy() {
    this.onMessage = NOOP;
    this.onError = NOOP;
    this.worker.terminate();
    this.terminated = true;
  }

  get isRunning() {
    return Boolean(this.onMessage);
  }

  postMessage(data, transferList) {
    transferList = transferList || getTransferList(data);
    this.worker.postMessage(data, transferList);
  }

  _getErrorFromErrorEvent(event) {
    let message = 'Failed to load ';
    message += "worker ".concat(this.name, ". ");

    if (event.message) {
      message += "".concat(event.message, " in ");
    }

    if (event.lineno) {
      message += ":".concat(event.lineno, ":").concat(event.colno);
    }

    return new Error(message);
  }

  _createBrowserWorker() {
    this._loadableURL = getLoadableWorkerURL({
      source: this.source,
      url: this.url
    });
    const worker = new Worker(this._loadableURL, {
      name: this.name
    });

    worker.onmessage = event => {
      if (!event.data) {
        this.onError(new Error('No data received'));
      } else {
        this.onMessage(event.data);
      }
    };

    worker.onerror = error => {
      this.onError(this._getErrorFromErrorEvent(error));
      this.terminated = true;
    };

    worker.onmessageerror = event => console.error(event);

    return worker;
  }

}

class WorkerPool {
  constructor(props) {
    _defineProperty(this, "name", 'unnamed');

    _defineProperty(this, "source", void 0);

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "maxConcurrency", 1);

    _defineProperty(this, "maxMobileConcurrency", 1);

    _defineProperty(this, "onDebug", () => {});

    _defineProperty(this, "reuseWorkers", true);

    _defineProperty(this, "props", {});

    _defineProperty(this, "jobQueue", []);

    _defineProperty(this, "idleQueue", []);

    _defineProperty(this, "count", 0);

    _defineProperty(this, "isDestroyed", false);

    this.source = props.source;
    this.url = props.url;
    this.setProps(props);
  }

  destroy() {
    this.idleQueue.forEach(worker => worker.destroy());
    this.isDestroyed = true;
  }

  setProps(props) {
    this.props = { ...this.props,
      ...props
    };

    if (props.name !== undefined) {
      this.name = props.name;
    }

    if (props.maxConcurrency !== undefined) {
      this.maxConcurrency = props.maxConcurrency;
    }

    if (props.maxMobileConcurrency !== undefined) {
      this.maxMobileConcurrency = props.maxMobileConcurrency;
    }

    if (props.reuseWorkers !== undefined) {
      this.reuseWorkers = props.reuseWorkers;
    }

    if (props.onDebug !== undefined) {
      this.onDebug = props.onDebug;
    }
  }

  async startJob(name, onMessage = (job, type, data) => job.done(data), onError = (job, error) => job.error(error)) {
    const startPromise = new Promise(onStart => {
      this.jobQueue.push({
        name,
        onMessage,
        onError,
        onStart
      });
      return this;
    });

    this._startQueuedJob();

    return await startPromise;
  }

  async _startQueuedJob() {
    if (!this.jobQueue.length) {
      return;
    }

    const workerThread = this._getAvailableWorker();

    if (!workerThread) {
      return;
    }

    const queuedJob = this.jobQueue.shift();

    if (queuedJob) {
      this.onDebug({
        message: 'Starting job',
        name: queuedJob.name,
        workerThread,
        backlog: this.jobQueue.length
      });
      const job = new WorkerJob(queuedJob.name, workerThread);

      workerThread.onMessage = data => queuedJob.onMessage(job, data.type, data.payload);

      workerThread.onError = error => queuedJob.onError(job, error);

      queuedJob.onStart(job);

      try {
        await job.result;
      } finally {
        this.returnWorkerToQueue(workerThread);
      }
    }
  }

  returnWorkerToQueue(worker) {
    const shouldDestroyWorker = this.isDestroyed || !this.reuseWorkers || this.count > this._getMaxConcurrency();

    if (shouldDestroyWorker) {
      worker.destroy();
      this.count--;
    } else {
      this.idleQueue.push(worker);
    }

    if (!this.isDestroyed) {
      this._startQueuedJob();
    }
  }

  _getAvailableWorker() {
    if (this.idleQueue.length > 0) {
      return this.idleQueue.shift() || null;
    }

    if (this.count < this._getMaxConcurrency()) {
      this.count++;
      const name = "".concat(this.name.toLowerCase(), " (#").concat(this.count, " of ").concat(this.maxConcurrency, ")");
      return new WorkerThread({
        name,
        source: this.source,
        url: this.url
      });
    }

    return null;
  }

  _getMaxConcurrency() {
    return isMobile ? this.maxMobileConcurrency : this.maxConcurrency;
  }

}

const DEFAULT_PROPS$3 = {
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  onDebug: () => {},
  reuseWorkers: true
};
class WorkerFarm {
  static isSupported() {
    return WorkerThread.isSupported();
  }

  static getWorkerFarm(props = {}) {
    WorkerFarm._workerFarm = WorkerFarm._workerFarm || new WorkerFarm({});

    WorkerFarm._workerFarm.setProps(props);

    return WorkerFarm._workerFarm;
  }

  constructor(props) {
    _defineProperty(this, "props", void 0);

    _defineProperty(this, "workerPools", new Map());

    this.props = { ...DEFAULT_PROPS$3
    };
    this.setProps(props);
    this.workerPools = new Map();
  }

  destroy() {
    for (const workerPool of this.workerPools.values()) {
      workerPool.destroy();
    }
  }

  setProps(props) {
    this.props = { ...this.props,
      ...props
    };

    for (const workerPool of this.workerPools.values()) {
      workerPool.setProps(this._getWorkerPoolProps());
    }
  }

  getWorkerPool(options) {
    const {
      name,
      source,
      url
    } = options;
    let workerPool = this.workerPools.get(name);

    if (!workerPool) {
      workerPool = new WorkerPool({
        name,
        source,
        url
      });
      workerPool.setProps(this._getWorkerPoolProps());
      this.workerPools.set(name, workerPool);
    }

    return workerPool;
  }

  _getWorkerPoolProps() {
    return {
      maxConcurrency: this.props.maxConcurrency,
      maxMobileConcurrency: this.props.maxMobileConcurrency,
      reuseWorkers: this.props.reuseWorkers,
      onDebug: this.props.onDebug
    };
  }

}

_defineProperty(WorkerFarm, "_workerFarm", void 0);

const NPM_TAG = 'beta';
function getWorkerURL(worker, options = {}) {
  const workerOptions = options[worker.id] || {};
  const workerFile = "".concat(worker.id, "-worker.js");
  let url = workerOptions.workerUrl;

  if (options._workerType === 'test') {
    url = "modules/".concat(worker.module, "/dist/").concat(workerFile);
  }

  if (!url) {
    let version = worker.version;

    if (version === 'latest') {
      version = NPM_TAG;
    }

    const versionTag = version ? "@".concat(version) : '';
    url = "https://unpkg.com/@loaders.gl/".concat(worker.module).concat(versionTag, "/dist/").concat(workerFile);
  }

  assert$6(url);
  return url;
}

function validateWorkerVersion(worker, coreVersion = VERSION$5) {
  assert$6(worker, 'no worker provided');
  const workerVersion = worker.version;

  if (!coreVersion || !workerVersion) {
    return false;
  }

  return true;
}

const VERSION$4 = "3.0.0-beta.3" ;
const loadLibraryPromises = {};
async function loadLibrary(libraryUrl, moduleName = null, options = {}) {
  if (moduleName) {
    libraryUrl = getLibraryUrl(libraryUrl, moduleName, options);
  }

  loadLibraryPromises[libraryUrl] = loadLibraryPromises[libraryUrl] || loadLibraryFromFile(libraryUrl);
  return await loadLibraryPromises[libraryUrl];
}
function getLibraryUrl(library, moduleName, options) {
  if (library.startsWith('http')) {
    return library;
  }

  const modules = options.modules || {};

  if (modules[library]) {
    return modules[library];
  }

  if (!isBrowser$1) {
    return "modules/".concat(moduleName, "/dist/libs/").concat(library);
  }

  if (options.CDN) {
    assert$6(options.CDN.startsWith('http'));
    return "".concat(options.CDN, "/").concat(moduleName, "@").concat(VERSION$4, "/dist/libs/").concat(library);
  }

  if (isWorker) {
    return "../src/libs/".concat(library);
  }

  return "modules/".concat(moduleName, "/src/libs/").concat(library);
}

async function loadLibraryFromFile(libraryUrl) {
  if (libraryUrl.endsWith('wasm')) {
    const response = await fetch(libraryUrl);
    return await response.arrayBuffer();
  }

  if (!isBrowser$1) {
    return undefined && (await undefined(libraryUrl));
  }

  if (isWorker) {
    return importScripts(libraryUrl);
  }

  const response = await fetch(libraryUrl);
  const scriptSource = await response.text();
  return loadLibraryFromString(scriptSource, libraryUrl);
}

function loadLibraryFromString(scriptSource, id) {
  if (!isBrowser$1) {
    return undefined && undefined(scriptSource, id);
  }

  if (isWorker) {
    eval.call(global_$1, scriptSource);
    return null;
  }

  const script = document.createElement('script');
  script.id = id;

  try {
    script.appendChild(document.createTextNode(scriptSource));
  } catch (e) {
    script.text = scriptSource;
  }

  document.body.appendChild(script);
  return null;
}

function canParseWithWorker(loader, options) {
  if (!WorkerFarm.isSupported()) {
    return false;
  }

  return loader.worker && (options === null || options === void 0 ? void 0 : options.worker);
}
async function parseWithWorker(loader, data, options, context, parseOnMainThread) {
  const name = loader.id;
  const url = getWorkerURL(loader, options);
  const workerFarm = WorkerFarm.getWorkerFarm(options);
  const workerPool = workerFarm.getWorkerPool({
    name,
    url
  });
  options = JSON.parse(JSON.stringify(options));
  const job = await workerPool.startJob('process-on-worker', onMessage.bind(null, parseOnMainThread));
  job.postMessage('process', {
    input: data,
    options
  });
  const result = await job.result;
  return await result.result;
}

async function onMessage(parseOnMainThread, job, type, payload) {
  switch (type) {
    case 'done':
      job.done(payload);
      break;

    case 'error':
      job.error(payload.error);
      break;

    case 'process':
      const {
        id,
        input,
        options
      } = payload;

      try {
        const result = await parseOnMainThread(input, options);
        job.postMessage('done', {
          id,
          result
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error';
        job.postMessage('error', {
          id,
          error: message
        });
      }

      break;

    default:
      console.warn("parse-with-worker unknown message ".concat(type));
  }
}

function getFirstCharacters$1(data, length = 5) {
  if (typeof data === 'string') {
    return data.slice(0, length);
  } else if (ArrayBuffer.isView(data)) {
    return getMagicString$3(data.buffer, data.byteOffset, length);
  } else if (data instanceof ArrayBuffer) {
    const byteOffset = 0;
    return getMagicString$3(data, byteOffset, length);
  }

  return '';
}
function getMagicString$3(arrayBuffer, byteOffset, length) {
  if (arrayBuffer.byteLength <= byteOffset + length) {
    return '';
  }

  const dataView = new DataView(arrayBuffer);
  let magic = '';

  for (let i = 0; i < length; i++) {
    magic += String.fromCharCode(dataView.getUint8(byteOffset + i));
  }

  return magic;
}

function parseJSON(string) {
  try {
    return JSON.parse(string);
  } catch (_) {
    throw new Error("Failed to parse JSON from data starting with \"".concat(getFirstCharacters$1(string), "\""));
  }
}

function toArrayBuffer(data) {
  if (undefined) {
    data = undefined(data);
  }

  if (data instanceof ArrayBuffer) {
    return data;
  }

  if (ArrayBuffer.isView(data)) {
    return data.buffer;
  }

  if (typeof data === 'string') {
    const text = data;
    const uint8Array = new TextEncoder().encode(text);
    return uint8Array.buffer;
  }

  if (data && typeof data === 'object' && data._toArrayBuffer) {
    return data._toArrayBuffer();
  }

  throw new Error('toArrayBuffer');
}
function compareArrayBuffers(arrayBuffer1, arrayBuffer2, byteLength) {
  byteLength = byteLength || arrayBuffer1.byteLength;

  if (arrayBuffer1.byteLength < byteLength || arrayBuffer2.byteLength < byteLength) {
    return false;
  }

  const array1 = new Uint8Array(arrayBuffer1);
  const array2 = new Uint8Array(arrayBuffer2);

  for (let i = 0; i < array1.length; ++i) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}
function concatenateArrayBuffers(...sources) {
  const sourceArrays = sources.map(source2 => source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2);
  const byteLength = sourceArrays.reduce((length, typedArray) => length + typedArray.byteLength, 0);
  const result = new Uint8Array(byteLength);
  let offset = 0;

  for (const sourceArray of sourceArrays) {
    result.set(sourceArray, offset);
    offset += sourceArray.byteLength;
  }

  return result.buffer;
}
function sliceArrayBuffer(arrayBuffer, byteOffset, byteLength) {
  const subArray = byteLength !== undefined ? new Uint8Array(arrayBuffer).subarray(byteOffset, byteOffset + byteLength) : new Uint8Array(arrayBuffer).subarray(byteOffset);
  const arrayCopy = new Uint8Array(subArray);
  return arrayCopy.buffer;
}

function padToNBytes(byteLength, padding) {
  assert$7(byteLength >= 0);
  assert$7(padding > 0);
  return byteLength + (padding - 1) & ~(padding - 1);
}
function copyToArray(source, target, targetOffset) {
  let sourceArray;

  if (source instanceof ArrayBuffer) {
    sourceArray = new Uint8Array(source);
  } else {
    const srcByteOffset = source.byteOffset;
    const srcByteLength = source.byteLength;
    sourceArray = new Uint8Array(source.buffer || source.arrayBuffer, srcByteOffset, srcByteLength);
  }

  target.set(sourceArray, targetOffset);
  return targetOffset + padToNBytes(sourceArray.byteLength, 4);
}

function dirname(url) {
  const slashIndex = url && url.lastIndexOf('/');
  return slashIndex >= 0 ? url.substr(0, slashIndex) : '';
}

let pathPrefix = '';
const fileAliases = {};
function resolvePath(filename) {
  for (const alias in fileAliases) {
    if (filename.startsWith(alias)) {
      const replacement = fileAliases[alias];
      filename = filename.replace(alias, replacement);
    }
  }

  if (!filename.startsWith('http://') && !filename.startsWith('https://')) {
    filename = "".concat(pathPrefix).concat(filename);
  }

  return filename;
}

async function concatenateArrayBuffersAsync(asyncIterator) {
  const arrayBuffers = [];

  for await (const chunk of asyncIterator) {
    arrayBuffers.push(chunk);
  }

  return concatenateArrayBuffers(...arrayBuffers);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function getHiResTimestamp() {
  var timestamp;

  if (typeof window !== 'undefined' && window.performance) {
    timestamp = window.performance.now();
  } else if (typeof process !== 'undefined' && process.hrtime) {
    var timeParts = process.hrtime();
    timestamp = timeParts[0] * 1000 + timeParts[1] / 1e6;
  } else {
    timestamp = Date.now();
  }

  return timestamp;
}

var Stat = function () {
  function Stat(name, type) {
    _classCallCheck(this, Stat);

    this.name = name;
    this.type = type;
    this.sampleSize = 1;
    this.reset();
  }

  _createClass(Stat, [{
    key: "setSampleSize",
    value: function setSampleSize(samples) {
      this.sampleSize = samples;
      return this;
    }
  }, {
    key: "incrementCount",
    value: function incrementCount() {
      this.addCount(1);
      return this;
    }
  }, {
    key: "decrementCount",
    value: function decrementCount() {
      this.subtractCount(1);
      return this;
    }
  }, {
    key: "addCount",
    value: function addCount(value) {
      this._count += value;
      this._samples++;

      this._checkSampling();

      return this;
    }
  }, {
    key: "subtractCount",
    value: function subtractCount(value) {
      this._count -= value;
      this._samples++;

      this._checkSampling();

      return this;
    }
  }, {
    key: "addTime",
    value: function addTime(time) {
      this._time += time;
      this.lastTiming = time;
      this._samples++;

      this._checkSampling();

      return this;
    }
  }, {
    key: "timeStart",
    value: function timeStart() {
      this._startTime = getHiResTimestamp();
      this._timerPending = true;
      return this;
    }
  }, {
    key: "timeEnd",
    value: function timeEnd() {
      if (!this._timerPending) {
        return this;
      }

      this.addTime(getHiResTimestamp() - this._startTime);
      this._timerPending = false;

      this._checkSampling();

      return this;
    }
  }, {
    key: "getSampleAverageCount",
    value: function getSampleAverageCount() {
      return this.sampleSize > 0 ? this.lastSampleCount / this.sampleSize : 0;
    }
  }, {
    key: "getSampleAverageTime",
    value: function getSampleAverageTime() {
      return this.sampleSize > 0 ? this.lastSampleTime / this.sampleSize : 0;
    }
  }, {
    key: "getSampleHz",
    value: function getSampleHz() {
      return this.lastSampleTime > 0 ? this.sampleSize / (this.lastSampleTime / 1000) : 0;
    }
  }, {
    key: "getAverageCount",
    value: function getAverageCount() {
      return this.samples > 0 ? this.count / this.samples : 0;
    }
  }, {
    key: "getAverageTime",
    value: function getAverageTime() {
      return this.samples > 0 ? this.time / this.samples : 0;
    }
  }, {
    key: "getHz",
    value: function getHz() {
      return this.time > 0 ? this.samples / (this.time / 1000) : 0;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.time = 0;
      this.count = 0;
      this.samples = 0;
      this.lastTiming = 0;
      this.lastSampleTime = 0;
      this.lastSampleCount = 0;
      this._count = 0;
      this._time = 0;
      this._samples = 0;
      this._startTime = 0;
      this._timerPending = false;
      return this;
    }
  }, {
    key: "_checkSampling",
    value: function _checkSampling() {
      if (this._samples === this.sampleSize) {
        this.lastSampleTime = this._time;
        this.lastSampleCount = this._count;
        this.count += this._count;
        this.time += this._time;
        this.samples += this._samples;
        this._time = 0;
        this._count = 0;
        this._samples = 0;
      }
    }
  }]);

  return Stat;
}();

var Stats = function () {
  function Stats(_ref) {
    var id = _ref.id,
        stats = _ref.stats;

    _classCallCheck(this, Stats);

    this.id = id;
    this.stats = {};

    this._initializeStats(stats);

    Object.seal(this);
  }

  _createClass(Stats, [{
    key: "get",
    value: function get(name) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'count';
      return this._getOrCreate({
        name: name,
        type: type
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      for (var key in this.stats) {
        this.stats[key].reset();
      }

      return this;
    }
  }, {
    key: "forEach",
    value: function forEach(fn) {
      for (var key in this.stats) {
        fn(this.stats[key]);
      }
    }
  }, {
    key: "getTable",
    value: function getTable() {
      var table = {};
      this.forEach(function (stat) {
        table[stat.name] = {
          time: stat.time || 0,
          count: stat.count || 0,
          average: stat.getAverageTime() || 0,
          hz: stat.getHz() || 0
        };
      });
      return table;
    }
  }, {
    key: "_initializeStats",
    value: function _initializeStats() {
      var _this = this;

      var stats = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      stats.forEach(function (stat) {
        return _this._getOrCreate(stat);
      });
    }
  }, {
    key: "_getOrCreate",
    value: function _getOrCreate(stat) {
      if (!stat || !stat.name) {
        return null;
      }

      var name = stat.name,
          type = stat.type;

      if (!this.stats[name]) {
        if (stat instanceof Stat) {
          this.stats[name] = stat;
        } else {
          this.stats[name] = new Stat(name, type);
        }
      }

      return this.stats[name];
    }
  }, {
    key: "size",
    get: function get() {
      return Object.keys(this.stats).length;
    }
  }]);

  return Stats;
}();

const STAT_QUEUED_REQUESTS = 'Queued Requests';
const STAT_ACTIVE_REQUESTS = 'Active Requests';
const STAT_CANCELLED_REQUESTS = 'Cancelled Requests';
const STAT_QUEUED_REQUESTS_EVER = 'Queued Requests Ever';
const STAT_ACTIVE_REQUESTS_EVER = 'Active Requests Ever';
const DEFAULT_PROPS$2 = {
  id: 'request-scheduler',
  throttleRequests: true,
  maxRequests: 6
};
class RequestScheduler {
  constructor(props = {}) {
    _defineProperty(this, "props", void 0);

    _defineProperty(this, "stats", void 0);

    _defineProperty(this, "activeRequestCount", void 0);

    _defineProperty(this, "requestQueue", void 0);

    _defineProperty(this, "requestMap", void 0);

    _defineProperty(this, "_deferredUpdate", void 0);

    this.props = { ...DEFAULT_PROPS$2,
      ...props
    };
    this.requestQueue = [];
    this.activeRequestCount = 0;
    this.requestMap = new Map();
    this.stats = new Stats({
      id: props.id
    });
    this.stats.get(STAT_QUEUED_REQUESTS);
    this.stats.get(STAT_ACTIVE_REQUESTS);
    this.stats.get(STAT_CANCELLED_REQUESTS);
    this.stats.get(STAT_QUEUED_REQUESTS_EVER);
    this.stats.get(STAT_ACTIVE_REQUESTS_EVER);
    this._deferredUpdate = null;
  }

  scheduleRequest(handle, getPriority = () => 0) {
    if (!this.props.throttleRequests) {
      return Promise.resolve({
        done: () => {}
      });
    }

    if (this.requestMap.has(handle)) {
      return this.requestMap.get(handle);
    }

    const request = {
      handle,
      priority: 0,
      getPriority
    };
    const promise = new Promise(resolve => {
      request.resolve = resolve;
      return request;
    });
    this.requestQueue.push(request);
    this.requestMap.set(handle, promise);

    this._issueNewRequests();

    return promise;
  }

  _issueRequest(request) {
    const {
      handle,
      resolve
    } = request;
    let isDone = false;

    const done = () => {
      if (!isDone) {
        isDone = true;
        this.requestMap.delete(handle);
        this.activeRequestCount--;

        this._issueNewRequests();
      }
    };

    this.activeRequestCount++;
    return resolve ? resolve({
      done
    }) : Promise.resolve({
      done
    });
  }

  _issueNewRequests() {
    if (!this._deferredUpdate) {
      this._deferredUpdate = setTimeout(() => this._issueNewRequestsAsync(), 0);
    }
  }

  _issueNewRequestsAsync() {
    this._deferredUpdate = null;
    const freeSlots = Math.max(this.props.maxRequests - this.activeRequestCount, 0);

    if (freeSlots === 0) {
      return;
    }

    this._updateAllRequests();

    for (let i = 0; i < freeSlots; ++i) {
      if (this.requestQueue.length > 0) {
        const request = this.requestQueue.shift();

        this._issueRequest(request);
      }
    }
  }

  _updateAllRequests() {
    const requestQueue = this.requestQueue;

    for (let i = 0; i < requestQueue.length; ++i) {
      const request = requestQueue[i];

      if (!this._updateRequest(request)) {
        requestQueue.splice(i, 1);
        this.requestMap.delete(request.handle);
        i--;
      }
    }

    requestQueue.sort((a, b) => a.priority - b.priority);
  }

  _updateRequest(request) {
    request.priority = request.getPriority(request.handle);

    if (request.priority < 0) {
      request.resolve(null);
      return false;
    }

    return true;
  }

}

function getMeshBoundingBox(attributes) {
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  const positions = attributes.POSITION ? attributes.POSITION.value : [];
  const len = positions && positions.length;

  for (let i = 0; i < len; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    minX = x < minX ? x : minX;
    minY = y < minY ? y : minY;
    minZ = z < minZ ? z : minZ;
    maxX = x > maxX ? x : maxX;
    maxY = y > maxY ? y : maxY;
    maxZ = z > maxZ ? z : maxZ;
  }

  return [[minX, minY, minZ], [maxX, maxY, maxZ]];
}

const isBoolean = x => typeof x === 'boolean';

const isFunction = x => typeof x === 'function';

const isObject = x => x !== null && typeof x === 'object';
const isPureObject = x => isObject(x) && x.constructor === {}.constructor;
const isIterable = x => x && typeof x[Symbol.iterator] === 'function';
const isAsyncIterable = x => x && typeof x[Symbol.asyncIterator] === 'function';
const isResponse = x => typeof Response !== 'undefined' && x instanceof Response || x && x.arrayBuffer && x.text && x.json;
const isBlob = x => typeof Blob !== 'undefined' && x instanceof Blob;
const isReadableDOMStream = x => typeof ReadableStream !== 'undefined' && x instanceof ReadableStream || isObject(x) && isFunction(x.tee) && isFunction(x.cancel) && isFunction(x.getReader);
const isBuffer = x => x && typeof x === 'object' && x.isBuffer;
const isReadableNodeStream = x => isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
const isReadableStream = x => isReadableDOMStream(x) || isReadableNodeStream(x);

const DATA_URL_PATTERN = /^data:([-\w.]+\/[-\w.+]+)(;|,)/;
const MIME_TYPE_PATTERN = /^([-\w.]+\/[-\w.+]+)/;
function parseMIMEType(mimeString) {
  const matches = MIME_TYPE_PATTERN.exec(mimeString);

  if (matches) {
    return matches[1];
  }

  return mimeString;
}
function parseMIMETypeFromURL(url) {
  const matches = DATA_URL_PATTERN.exec(url);

  if (matches) {
    return matches[1];
  }

  return '';
}

const QUERY_STRING_PATTERN = /\?.*/;
function getResourceUrlAndType(resource) {
  if (isResponse(resource)) {
    const url = stripQueryString(resource.url || '');
    const contentTypeHeader = resource.headers.get('content-type') || '';
    return {
      url,
      type: parseMIMEType(contentTypeHeader) || parseMIMETypeFromURL(url)
    };
  }

  if (isBlob(resource)) {
    return {
      url: stripQueryString(resource.name || ''),
      type: resource.type || ''
    };
  }

  if (typeof resource === 'string') {
    return {
      url: stripQueryString(resource),
      type: parseMIMETypeFromURL(resource)
    };
  }

  return {
    url: '',
    type: ''
  };
}
function getResourceContentLength(resource) {
  if (isResponse(resource)) {
    return resource.headers['content-length'] || -1;
  }

  if (isBlob(resource)) {
    return resource.size;
  }

  if (typeof resource === 'string') {
    return resource.length;
  }

  if (resource instanceof ArrayBuffer) {
    return resource.byteLength;
  }

  if (ArrayBuffer.isView(resource)) {
    return resource.byteLength;
  }

  return -1;
}

function stripQueryString(url) {
  return url.replace(QUERY_STRING_PATTERN, '');
}

async function makeResponse(resource) {
  if (isResponse(resource)) {
    return resource;
  }

  const headers = {};
  const contentLength = getResourceContentLength(resource);

  if (contentLength >= 0) {
    headers['content-length'] = String(contentLength);
  }

  const {
    url,
    type
  } = getResourceUrlAndType(resource);

  if (type) {
    headers['content-type'] = type;
  }

  const initialDataUrl = await getInitialDataUrl(resource);

  if (initialDataUrl) {
    headers['x-first-bytes'] = initialDataUrl;
  }

  if (typeof resource === 'string') {
    resource = new TextEncoder().encode(resource);
  }

  const response = new Response(resource, {
    headers
  });
  Object.defineProperty(response, 'url', {
    value: url
  });
  return response;
}
async function checkResponse(response) {
  if (!response.ok) {
    const message = await getResponseError(response);
    throw new Error(message);
  }
}

async function getResponseError(response) {
  let message = "Failed to fetch resource ".concat(response.url, " (").concat(response.status, "): ");

  try {
    const contentType = response.headers.get('Content-Type');
    let text = response.statusText;

    if (contentType.includes('application/json')) {
      text += " ".concat(await response.text());
    }

    message += text;
    message = message.length > 60 ? "".concat(message.slice(60), "...") : message;
  } catch (error) {}

  return message;
}

async function getInitialDataUrl(resource) {
  const INITIAL_DATA_LENGTH = 5;

  if (typeof resource === 'string') {
    return "data:,".concat(resource.slice(0, INITIAL_DATA_LENGTH));
  }

  if (resource instanceof Blob) {
    const blobSlice = resource.slice(0, 5);
    return await new Promise(resolve => {
      const reader = new FileReader();

      reader.onload = event => {
        var _event$target;

        return resolve(event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.result);
      };

      reader.readAsDataURL(blobSlice);
    });
  }

  if (resource instanceof ArrayBuffer) {
    const slice = resource.slice(0, INITIAL_DATA_LENGTH);
    const base64 = arrayBufferToBase64(slice);
    return "data:base64,".concat(base64);
  }

  return null;
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

async function getErrorMessageFromResponse(response) {
  let message = "Failed to fetch resource ".concat(response.url, " (").concat(response.status, "): ");

  try {
    const contentType = response.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) {
      message += await response.text();
    } else {
      message += response.statusText;
    }
  } catch (error) {
    return message;
  }

  return message;
}

async function fetchFile(url, options) {
  if (typeof url === 'string') {
    url = resolvePath(url);
    let fetchOptions = options;

    if (options !== null && options !== void 0 && options.fetch && typeof (options === null || options === void 0 ? void 0 : options.fetch) !== 'function') {
      fetchOptions = options.fetch;
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok && options !== null && options !== void 0 && options.throws) {
      throw new Error(await getErrorMessageFromResponse(response));
    }

    return response;
  }

  return await makeResponse(url);
}

class NullLog {
  log() {
    return _ => {};
  }

  info() {
    return _ => {};
  }

  warn() {
    return _ => {};
  }

  error() {
    return _ => {};
  }

}
class ConsoleLog {
  constructor() {
    _defineProperty(this, "console", void 0);

    this.console = console;
  }

  log(...args) {
    return this.console.log.bind(this.console, ...args);
  }

  info(...args) {
    return this.console.info.bind(this.console, ...args);
  }

  warn(...args) {
    return this.console.warn.bind(this.console, ...args);
  }

  error(...args) {
    return this.console.error.bind(this.console, ...args);
  }

}

const DEFAULT_LOADER_OPTIONS = {
  fetch: null,
  CDN: 'https://unpkg.com/@loaders.gl',
  worker: true,
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  log: new ConsoleLog(),
  metadata: false,
  transforms: [],
  reuseWorkers: true,
  _workerType: '',
  attributeName: null,
  attributeType: null
};
const REMOVED_LOADER_OPTIONS = {
  dataType: '(no longer used)',
  uri: 'baseUri',
  method: 'fetch.method',
  headers: 'fetch.headers',
  body: 'fetch.body',
  mode: 'fetch.mode',
  credentials: 'fetch.credentials',
  cache: 'fetch.cache',
  redirect: 'fetch.redirect',
  referrer: 'fetch.referrer',
  referrerPolicy: 'fetch.referrerPolicy',
  integrity: 'fetch.integrity',
  keepalive: 'fetch.keepalive',
  signal: 'fetch.signal'
};
function getGlobalLoaderState() {
  global_$2.loaders = global_$2.loaders || {};
  const {
    loaders
  } = global_$2;
  loaders._state = loaders._state || {};
  return loaders._state;
}

const getGlobalLoaderOptions = () => {
  const state = getGlobalLoaderState();
  state.globalOptions = state.globalOptions || { ...DEFAULT_LOADER_OPTIONS
  };
  return state.globalOptions;
};
function normalizeOptions(options, loader, loaders, url) {
  loaders = loaders || [];
  loaders = Array.isArray(loaders) ? loaders : [loaders];
  validateOptions(options, loaders);
  return normalizeOptionsInternal(loader, options, url);
}
function getFetchFunction(options, context) {
  const globalOptions = getGlobalLoaderOptions();
  const fetchOptions = options || globalOptions;

  if (typeof fetchOptions.fetch === 'function') {
    return fetchOptions.fetch;
  }

  if (isObject(fetchOptions.fetch)) {
    return url => fetchFile(url, fetchOptions);
  }

  if (context && context.fetch) {
    return context.fetch;
  }

  return fetchFile;
}

function validateOptions(options, loaders, log = console) {
  validateOptionsObject(options, null, log, DEFAULT_LOADER_OPTIONS, REMOVED_LOADER_OPTIONS, loaders);

  for (const loader of loaders) {
    const idOptions = options && options[loader.id] || {};
    const loaderOptions = loader.options && loader.options[loader.id] || {};
    const deprecatedOptions = loader.defaultOptions && loader.defaultOptions[loader.id] || {};
    validateOptionsObject(idOptions, loader.id, log, loaderOptions, deprecatedOptions, loaders);
  }
}

function validateOptionsObject(options, id, log, defaultOptions, deprecatedOptions, loaders) {
  const loaderName = id || 'Top level';
  const prefix = id ? "".concat(id, ".") : '';

  for (const key in options) {
    const isSubOptions = !id && isObject(options[key]);

    if (!(key in defaultOptions) && !(key === 'baseUri' && !id)) {
      if (key in deprecatedOptions) {
        log.warn("".concat(loaderName, " loader option '").concat(prefix).concat(key, "' no longer supported, use '").concat(deprecatedOptions[key], "'"));
      } else if (!isSubOptions) {
        const suggestion = findSimilarOption(key, loaders);
        log.warn("".concat(loaderName, " loader option '").concat(prefix).concat(key, "' not recognized. ").concat(suggestion));
      }
    }
  }
}

function findSimilarOption(optionKey, loaders) {
  const lowerCaseOptionKey = optionKey.toLowerCase();
  let bestSuggestion = '';

  for (const loader of loaders) {
    for (const key in loader.options) {
      if (optionKey === key) {
        return "Did you mean '".concat(loader.id, ".").concat(key, "'?");
      }

      const lowerCaseKey = key.toLowerCase();
      const isPartialMatch = lowerCaseOptionKey.startsWith(lowerCaseKey) || lowerCaseKey.startsWith(lowerCaseOptionKey);

      if (isPartialMatch) {
        bestSuggestion = bestSuggestion || "Did you mean '".concat(loader.id, ".").concat(key, "'?");
      }
    }
  }

  return bestSuggestion;
}

function normalizeOptionsInternal(loader, options, url) {
  const loaderDefaultOptions = loader.options || {};
  const mergedOptions = { ...loaderDefaultOptions
  };
  addUrlOptions(mergedOptions, url);

  if (mergedOptions.log === null) {
    mergedOptions.log = new NullLog();
  }

  mergeNestedFields(mergedOptions, getGlobalLoaderOptions());
  mergeNestedFields(mergedOptions, options);
  return mergedOptions;
}

function mergeNestedFields(mergedOptions, options) {
  for (const key in options) {
    if (key in options) {
      const value = options[key];

      if (isPureObject(value) && isPureObject(mergedOptions[key])) {
        mergedOptions[key] = { ...mergedOptions[key],
          ...options[key]
        };
      } else {
        mergedOptions[key] = options[key];
      }
    }
  }
}

function addUrlOptions(options, url) {
  if (url && !('baseUri' in options)) {
    options.baseUri = url;
  }
}

function isLoaderObject(loader) {
  var _loader;

  if (!loader) {
    return false;
  }

  if (Array.isArray(loader)) {
    loader = loader[0];
  }

  const hasExtensions = Array.isArray((_loader = loader) === null || _loader === void 0 ? void 0 : _loader.extensions);
  return hasExtensions;
}
function normalizeLoader(loader) {
  assert$7(loader, 'null loader');
  assert$7(isLoaderObject(loader), 'invalid loader');
  let options;

  if (Array.isArray(loader)) {
    options = loader[1];
    loader = loader[0];
    loader = { ...loader,
      options: { ...loader.options,
        ...options
      }
    };
  }

  if (!loader.text) {
    loader.binary = true;
  }

  return loader;
}

const getGlobalLoaderRegistry = () => {
  const state = getGlobalLoaderState();
  state.loaderRegistry = state.loaderRegistry || [];
  return state.loaderRegistry;
};
function getRegisteredLoaders() {
  return getGlobalLoaderRegistry();
}

const DEFAULT_CHUNK_SIZE$2 = 1024 * 1024;
async function* makeBlobIterator(blob, options) {
  const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE$2;
  let offset = 0;

  while (offset < blob.size) {
    const end = offset + chunkSize;
    const chunk = await readFileSlice(blob, offset, end);
    offset = end;
    yield chunk;
  }
}
async function readFileSlice(file, offset, end) {
  return await new Promise((resolve, reject) => {
    const slice = file.slice(offset, end);
    const fileReader = new FileReader();

    fileReader.onload = event => {
      var _event$target;

      return resolve(event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.result);
    };

    fileReader.onerror = error => reject(error);

    fileReader.readAsArrayBuffer(slice);
  });
}

const EXT_PATTERN = /\.([^.]+)$/;
async function selectLoader(data, loaders = [], options, context) {
  let loader = selectLoaderSync(data, loaders, { ...options,
    nothrow: true
  }, context);

  if (loader) {
    return loader;
  }

  if (isBlob(data)) {
    data = await readFileSlice(data, 0, 10);
    loader = selectLoaderSync(data, loaders, options, context);
  }

  if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
    throw new Error(getNoValidLoaderMessage(data));
  }

  return loader;
}
function selectLoaderSync(data, loaders = [], options, context) {
  if (loaders && !Array.isArray(loaders)) {
    return normalizeLoader(loaders);
  }

  loaders = [...(loaders || []), ...getRegisteredLoaders()];
  normalizeLoaders(loaders);
  const {
    url,
    type
  } = getResourceUrlAndType(data);
  const testUrl = url || (context === null || context === void 0 ? void 0 : context.url);
  let loader = findLoaderByUrl(loaders, testUrl);
  loader = loader || findLoaderByContentType(loaders, type);
  loader = loader || findLoaderByExamingInitialData(loaders, data);

  if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
    throw new Error(getNoValidLoaderMessage(data));
  }

  return loader;
}

function getNoValidLoaderMessage(data) {
  const {
    url,
    type
  } = getResourceUrlAndType(data);
  let message = 'No valid loader found';

  if (data) {
    message += " data: \"".concat(getFirstCharacters(data), "\", contentType: \"").concat(type, "\"");
  }

  if (url) {
    message += " url: ".concat(url);
  }

  return message;
}

function normalizeLoaders(loaders) {
  for (const loader of loaders) {
    normalizeLoader(loader);
  }
}

function findLoaderByUrl(loaders, url) {
  const match = url && EXT_PATTERN.exec(url);
  const extension = match && match[1];
  return extension ? findLoaderByExtension(loaders, extension) : null;
}

function findLoaderByExtension(loaders, extension) {
  extension = extension.toLowerCase();

  for (const loader of loaders) {
    for (const loaderExtension of loader.extensions) {
      if (loaderExtension.toLowerCase() === extension) {
        return loader;
      }
    }
  }

  return null;
}

function findLoaderByContentType(loaders, mimeType) {
  for (const loader of loaders) {
    if (loader.mimeTypes && loader.mimeTypes.includes(mimeType)) {
      return loader;
    }

    if (mimeType === "application/x.".concat(loader.id)) {
      return loader;
    }
  }

  return null;
}

function findLoaderByExamingInitialData(loaders, data) {
  if (!data) {
    return null;
  }

  for (const loader of loaders) {
    if (typeof data === 'string') {
      if (testDataAgainstText(data, loader)) {
        return loader;
      }
    } else if (ArrayBuffer.isView(data)) {
      if (testDataAgainstBinary(data.buffer, data.byteOffset, loader)) {
        return loader;
      }
    } else if (data instanceof ArrayBuffer) {
      const byteOffset = 0;

      if (testDataAgainstBinary(data, byteOffset, loader)) {
        return loader;
      }
    }
  }

  return null;
}

function testDataAgainstText(data, loader) {
  if (loader.testText) {
    return loader.testText(data);
  }

  const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
  return tests.some(test => data.startsWith(test));
}

function testDataAgainstBinary(data, byteOffset, loader) {
  const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
  return tests.some(test => testBinary(data, byteOffset, loader, test));
}

function testBinary(data, byteOffset, loader, test) {
  if (test instanceof ArrayBuffer) {
    return compareArrayBuffers(test, data, test.byteLength);
  }

  switch (typeof test) {
    case 'function':
      return test(data, loader);

    case 'string':
      const magic = getMagicString$2(data, byteOffset, test.length);
      return test === magic;

    default:
      return false;
  }
}

function getFirstCharacters(data, length = 5) {
  if (typeof data === 'string') {
    return data.slice(0, length);
  } else if (ArrayBuffer.isView(data)) {
    return getMagicString$2(data.buffer, data.byteOffset, length);
  } else if (data instanceof ArrayBuffer) {
    const byteOffset = 0;
    return getMagicString$2(data, byteOffset, length);
  }

  return '';
}

function getMagicString$2(arrayBuffer, byteOffset, length) {
  if (arrayBuffer.byteLength < byteOffset + length) {
    return '';
  }

  const dataView = new DataView(arrayBuffer);
  let magic = '';

  for (let i = 0; i < length; i++) {
    magic += String.fromCharCode(dataView.getUint8(byteOffset + i));
  }

  return magic;
}

const DEFAULT_CHUNK_SIZE$1 = 256 * 1024;
function* makeStringIterator(string, options) {
  const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE$1;
  let offset = 0;
  const textEncoder = new TextEncoder();

  while (offset < string.length) {
    const chunkLength = Math.min(string.length - offset, chunkSize);
    const chunk = string.slice(offset, offset + chunkLength);
    offset += chunkLength;
    yield textEncoder.encode(chunk);
  }
}

const DEFAULT_CHUNK_SIZE = 256 * 1024;
function* makeArrayBufferIterator(arrayBuffer, options = {}) {
  const {
    chunkSize = DEFAULT_CHUNK_SIZE
  } = options;
  let byteOffset = 0;

  while (byteOffset < arrayBuffer.byteLength) {
    const chunkByteLength = Math.min(arrayBuffer.byteLength - byteOffset, chunkSize);
    const chunk = new ArrayBuffer(chunkByteLength);
    const sourceArray = new Uint8Array(arrayBuffer, byteOffset, chunkByteLength);
    const chunkArray = new Uint8Array(chunk);
    chunkArray.set(sourceArray);
    byteOffset += chunkByteLength;
    yield chunk;
  }
}

function makeStreamIterator(stream) {
  if (isBrowser$2 || nodeVersion >= 10) {
    if (typeof stream[Symbol.asyncIterator] === 'function') {
      return makeToArrayBufferIterator(stream);
    }

    if (typeof stream.getIterator === 'function') {
      return stream.getIterator();
    }
  }

  return isBrowser$2 ? makeBrowserStreamIterator(stream) : makeNodeStreamIterator(stream);
}

async function* makeToArrayBufferIterator(asyncIterator) {
  for await (const chunk of asyncIterator) {
    yield toArrayBuffer(chunk);
  }
}

async function* makeBrowserStreamIterator(stream) {
  const reader = stream.getReader();

  try {
    while (true) {
      const {
        done,
        value
      } = await reader.read();

      if (done) {
        return;
      }

      yield toArrayBuffer(value);
    }
  } catch (error) {
    reader.releaseLock();
  }
}

async function* makeNodeStreamIterator(stream) {
  stream = await stream;

  while (true) {
    const data = stream.read();

    if (data !== null) {
      yield toArrayBuffer(data);
      continue;
    }

    if (stream._readableState.ended) {
      return;
    }

    await onceReadable(stream);
  }
}

async function onceReadable(stream) {
  return new Promise(resolve => {
    stream.once('readable', resolve);
  });
}

function makeIterator(data, options) {
  if (typeof data === 'string') {
    return makeStringIterator(data, options);
  }

  if (data instanceof ArrayBuffer) {
    return makeArrayBufferIterator(data, options);
  }

  if (isBlob(data)) {
    return makeBlobIterator(data, options);
  }

  if (isReadableStream(data)) {
    return makeStreamIterator(data);
  }

  if (isResponse(data)) {
    const response = data;
    return makeStreamIterator(response.body);
  }

  throw new Error('makeIterator');
}

const ERR_DATA = 'Cannot convert supplied data type';
function getArrayBufferOrStringFromDataSync(data, loader) {
  if (loader.text && typeof data === 'string') {
    return data;
  }

  if (isBuffer(data)) {
    data = data.buffer;
  }

  if (data instanceof ArrayBuffer) {
    const arrayBuffer = data;

    if (loader.text && !loader.binary) {
      const textDecoder = new TextDecoder('utf8');
      return textDecoder.decode(arrayBuffer);
    }

    return arrayBuffer;
  }

  if (ArrayBuffer.isView(data)) {
    if (loader.text && !loader.binary) {
      const textDecoder = new TextDecoder('utf8');
      return textDecoder.decode(data);
    }

    let arrayBuffer = data.buffer;
    const byteLength = data.byteLength || data.length;

    if (data.byteOffset !== 0 || byteLength !== arrayBuffer.byteLength) {
      arrayBuffer = arrayBuffer.slice(data.byteOffset, data.byteOffset + byteLength);
    }

    return arrayBuffer;
  }

  throw new Error(ERR_DATA);
}
async function getArrayBufferOrStringFromData(data, loader) {
  const isArrayBuffer = data instanceof ArrayBuffer || ArrayBuffer.isView(data);

  if (typeof data === 'string' || isArrayBuffer) {
    return getArrayBufferOrStringFromDataSync(data, loader);
  }

  if (isBlob(data)) {
    data = await makeResponse(data);
  }

  if (isResponse(data)) {
    const response = data;
    await checkResponse(response);
    return loader.binary ? await response.arrayBuffer() : await response.text();
  }

  if (isReadableStream(data)) {
    data = makeIterator(data);
  }

  if (isIterable(data) || isAsyncIterable(data)) {
    return concatenateArrayBuffersAsync(data);
  }

  throw new Error(ERR_DATA);
}

function getLoaderContext(context, options, previousContext = null) {
  if (previousContext) {
    return previousContext;
  }

  context = {
    fetch: getFetchFunction(options, context),
    ...context
  };

  if (!Array.isArray(context.loaders)) {
    context.loaders = null;
  }

  return context;
}
function getLoaders(loaders, context) {
  if (!context && loaders && !Array.isArray(loaders)) {
    return loaders;
  }

  let candidateLoaders;

  if (loaders) {
    candidateLoaders = Array.isArray(loaders) ? loaders : [loaders];
  }

  if (context && context.loaders) {
    const contextLoaders = Array.isArray(context.loaders) ? context.loaders : [context.loaders];
    candidateLoaders = candidateLoaders ? [...candidateLoaders, ...contextLoaders] : contextLoaders;
  }

  return candidateLoaders && candidateLoaders.length ? candidateLoaders : null;
}

async function parse$3(data, loaders, options, context) {
  assert$6(!context || typeof context === 'object');

  if (loaders && !Array.isArray(loaders) && !isLoaderObject(loaders)) {
    context = undefined;
    options = loaders;
    loaders = undefined;
  }

  data = await data;
  options = options || {};
  const {
    url
  } = getResourceUrlAndType(data);
  const candidateLoaders = getLoaders(loaders, context);
  const loader = await selectLoader(data, candidateLoaders, options);

  if (!loader) {
    return null;
  }

  options = normalizeOptions(options, loader, candidateLoaders, url);
  context = getLoaderContext({
    url,
    parse: parse$3,
    loaders: candidateLoaders
  }, options, context);
  return await parseWithLoader(loader, data, options, context);
}

async function parseWithLoader(loader, data, options, context) {
  validateWorkerVersion(loader);
  data = await getArrayBufferOrStringFromData(data, loader);

  if (loader.parseTextSync && typeof data === 'string') {
    options.dataType = 'text';
    return loader.parseTextSync(data, options, context, loader);
  }

  if (canParseWithWorker(loader, options)) {
    return await parseWithWorker(loader, data, options, context, parse$3);
  }

  if (loader.parseText && typeof data === 'string') {
    return await loader.parseText(data, options, context, loader);
  }

  if (loader.parse) {
    return await loader.parse(data, options, context, loader);
  }

  assert$6(!loader.parseSync);
  throw new Error("".concat(loader.id, " loader - no parser found and worker is disabled"));
}

async function load(url, loaders, options, context) {
  if (!Array.isArray(loaders) && !isLoaderObject(loaders)) {
    options = loaders;
    loaders = undefined;
  }

  const fetch = getFetchFunction(options);
  let data = url;

  if (typeof url === 'string') {
    data = await fetch(url);
  }

  if (isBlob(url)) {
    data = await fetch(url);
  }

  return await parse$3(data, loaders, options);
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct$8() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct$8()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray$1(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread();
}

function assert$5(condition, message) {
  if (!condition) {
    throw new Error("math.gl assertion ".concat(message));
  }
}

var RADIANS_TO_DEGREES = 1 / Math.PI * 180;
var DEGREES_TO_RADIANS = 1 / 180 * Math.PI;
var config = {};
config.EPSILON = 1e-12;
config.debug = false;
config.precision = 4;
config.printTypes = false;
config.printDegrees = false;
config.printRowMajor = true;

function round(value) {
  return Math.round(value / config.EPSILON) * config.EPSILON;
}

function formatValue(value) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$precision = _ref.precision,
      precision = _ref$precision === void 0 ? config.precision || 4 : _ref$precision;

  value = round(value);
  return "".concat(parseFloat(value.toPrecision(precision)));
}
function isArray(value) {
  return Array.isArray(value) || ArrayBuffer.isView(value) && !(value instanceof DataView);
}

function duplicateArray(array) {
  return array.clone ? array.clone() : new Array(array.length);
}

function map$1(value, func, result) {
  if (isArray(value)) {
    result = result || duplicateArray(value);

    for (var i = 0; i < result.length && i < value.length; ++i) {
      result[i] = func(value[i], i, result);
    }

    return result;
  }

  return func(value);
}

function toRadians(degrees) {
  return radians(degrees);
}
function toDegrees(radians) {
  return degrees(radians);
}
function radians(degrees, result) {
  return map$1(degrees, function (degrees) {
    return degrees * DEGREES_TO_RADIANS;
  }, result);
}
function degrees(radians, result) {
  return map$1(radians, function (radians) {
    return radians * RADIANS_TO_DEGREES;
  }, result);
}
function clamp(value, min, max) {
  return map$1(value, function (value) {
    return Math.max(min, Math.min(max, value));
  });
}
function equals(a, b, epsilon) {
  var oldEpsilon = config.EPSILON;

  if (epsilon) {
    config.EPSILON = epsilon;
  }

  try {
    if (a === b) {
      return true;
    }

    if (isArray(a) && isArray(b)) {
      if (a.length !== b.length) {
        return false;
      }

      for (var i = 0; i < a.length; ++i) {
        if (!equals(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }

    if (a && a.equals) {
      return a.equals(b);
    }

    if (b && b.equals) {
      return b.equals(a);
    }

    if (Number.isFinite(a) && Number.isFinite(b)) {
      return Math.abs(a - b) <= config.EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
    }

    return false;
  } finally {
    config.EPSILON = oldEpsilon;
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _createSuper$7(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$7(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$7() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var MathArray = function (_Array) {
  _inherits(MathArray, _Array);

  var _super = _createSuper$7(MathArray);

  function MathArray() {
    _classCallCheck(this, MathArray);

    return _super.apply(this, arguments);
  }

  _createClass(MathArray, [{
    key: "clone",
    value: function clone() {
      return new this.constructor().copy(this);
    }
  }, {
    key: "from",
    value: function from(arrayOrObject) {
      return Array.isArray(arrayOrObject) ? this.copy(arrayOrObject) : this.fromObject(arrayOrObject);
    }
  }, {
    key: "fromArray",
    value: function fromArray(array) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] = array[i + offset];
      }

      return this.check();
    }
  }, {
    key: "to",
    value: function to(arrayOrObject) {
      if (arrayOrObject === this) {
        return this;
      }

      return isArray(arrayOrObject) ? this.toArray(arrayOrObject) : this.toObject(arrayOrObject);
    }
  }, {
    key: "toTarget",
    value: function toTarget(target) {
      return target ? this.to(target) : this;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      for (var i = 0; i < this.ELEMENTS; ++i) {
        array[offset + i] = this[i];
      }

      return array;
    }
  }, {
    key: "toFloat32Array",
    value: function toFloat32Array() {
      return new Float32Array(this);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.formatString(config);
    }
  }, {
    key: "formatString",
    value: function formatString(opts) {
      var string = '';

      for (var i = 0; i < this.ELEMENTS; ++i) {
        string += (i > 0 ? ', ' : '') + formatValue(this[i], opts);
      }

      return "".concat(opts.printTypes ? this.constructor.name : '', "[").concat(string, "]");
    }
  }, {
    key: "equals",
    value: function equals$1(array) {
      if (!array || this.length !== array.length) {
        return false;
      }

      for (var i = 0; i < this.ELEMENTS; ++i) {
        if (!equals(this[i], array[i])) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "exactEquals",
    value: function exactEquals(array) {
      if (!array || this.length !== array.length) {
        return false;
      }

      for (var i = 0; i < this.ELEMENTS; ++i) {
        if (this[i] !== array[i]) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "negate",
    value: function negate() {
      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] = -this[i];
      }

      return this.check();
    }
  }, {
    key: "lerp",
    value: function lerp(a, b, t) {
      if (t === undefined) {
        t = b;
        b = a;
        a = this;
      }

      for (var i = 0; i < this.ELEMENTS; ++i) {
        var ai = a[i];
        this[i] = ai + t * (b[i] - ai);
      }

      return this.check();
    }
  }, {
    key: "min",
    value: function min(vector) {
      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] = Math.min(vector[i], this[i]);
      }

      return this.check();
    }
  }, {
    key: "max",
    value: function max(vector) {
      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] = Math.max(vector[i], this[i]);
      }

      return this.check();
    }
  }, {
    key: "clamp",
    value: function clamp(minVector, maxVector) {
      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] = Math.min(Math.max(this[i], minVector[i]), maxVector[i]);
      }

      return this.check();
    }
  }, {
    key: "add",
    value: function add() {
      for (var _len = arguments.length, vectors = new Array(_len), _key = 0; _key < _len; _key++) {
        vectors[_key] = arguments[_key];
      }

      for (var _i = 0, _vectors = vectors; _i < _vectors.length; _i++) {
        var vector = _vectors[_i];

        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] += vector[i];
        }
      }

      return this.check();
    }
  }, {
    key: "subtract",
    value: function subtract() {
      for (var _len2 = arguments.length, vectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        vectors[_key2] = arguments[_key2];
      }

      for (var _i2 = 0, _vectors2 = vectors; _i2 < _vectors2.length; _i2++) {
        var vector = _vectors2[_i2];

        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] -= vector[i];
        }
      }

      return this.check();
    }
  }, {
    key: "scale",
    value: function scale(_scale) {
      if (Array.isArray(_scale)) {
        return this.multiply(_scale);
      }

      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] *= _scale;
      }

      return this.check();
    }
  }, {
    key: "sub",
    value: function sub(a) {
      return this.subtract(a);
    }
  }, {
    key: "setScalar",
    value: function setScalar(a) {
      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] = a;
      }

      return this.check();
    }
  }, {
    key: "addScalar",
    value: function addScalar(a) {
      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] += a;
      }

      return this.check();
    }
  }, {
    key: "subScalar",
    value: function subScalar(a) {
      return this.addScalar(-a);
    }
  }, {
    key: "multiplyScalar",
    value: function multiplyScalar(scalar) {
      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] *= scalar;
      }

      return this.check();
    }
  }, {
    key: "divideScalar",
    value: function divideScalar(a) {
      return this.scale(1 / a);
    }
  }, {
    key: "clampScalar",
    value: function clampScalar(min, max) {
      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] = Math.min(Math.max(this[i], min), max);
      }

      return this.check();
    }
  }, {
    key: "multiplyByScalar",
    value: function multiplyByScalar(scalar) {
      return this.scale(scalar);
    }
  }, {
    key: "check",
    value: function check() {
      if (config.debug && !this.validate()) {
        throw new Error("math.gl: ".concat(this.constructor.name, " some fields set to invalid numbers'"));
      }

      return this;
    }
  }, {
    key: "validate",
    value: function validate() {
      var valid = this.length === this.ELEMENTS;

      for (var i = 0; i < this.ELEMENTS; ++i) {
        valid = valid && Number.isFinite(this[i]);
      }

      return valid;
    }
  }, {
    key: "ELEMENTS",
    get: function get() {
      assert$5(false);
      return 0;
    }
  }, {
    key: "RANK",
    get: function get() {
      assert$5(false);
      return 0;
    }
  }, {
    key: "elements",
    get: function get() {
      return this;
    }
  }]);

  return MathArray;
}(_wrapNativeSuper(Array));

function validateVector(v, length) {
  if (v.length !== length) {
    return false;
  }

  for (var i = 0; i < v.length; ++i) {
    if (!Number.isFinite(v[i])) {
      return false;
    }
  }

  return true;
}
function checkNumber(value) {
  if (!Number.isFinite(value)) {
    throw new Error("Invalid number ".concat(value));
  }

  return value;
}
function checkVector(v, length) {
  var callerName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (config.debug && !validateVector(v, length)) {
    throw new Error("math.gl: ".concat(callerName, " some fields set to invalid numbers'"));
  }

  return v;
}
var map = {};
function deprecated(method, version) {
  if (!map[method]) {
    map[method] = true;
    console.warn("".concat(method, " has been removed in version ").concat(version, ", see upgrade guide for more information"));
  }
}

function _createSuper$6(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$6(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Vector = function (_MathArray) {
  _inherits(Vector, _MathArray);

  var _super = _createSuper$6(Vector);

  function Vector() {
    _classCallCheck(this, Vector);

    return _super.apply(this, arguments);
  }

  _createClass(Vector, [{
    key: "copy",
    value: function copy(vector) {
      assert$5(false);
      return this;
    }
  }, {
    key: "len",
    value: function len() {
      return Math.sqrt(this.lengthSquared());
    }
  }, {
    key: "magnitude",
    value: function magnitude() {
      return this.len();
    }
  }, {
    key: "lengthSquared",
    value: function lengthSquared() {
      var length = 0;

      for (var i = 0; i < this.ELEMENTS; ++i) {
        length += this[i] * this[i];
      }

      return length;
    }
  }, {
    key: "magnitudeSquared",
    value: function magnitudeSquared() {
      return this.lengthSquared();
    }
  }, {
    key: "distance",
    value: function distance(mathArray) {
      return Math.sqrt(this.distanceSquared(mathArray));
    }
  }, {
    key: "distanceSquared",
    value: function distanceSquared(mathArray) {
      var length = 0;

      for (var i = 0; i < this.ELEMENTS; ++i) {
        var dist = this[i] - mathArray[i];
        length += dist * dist;
      }

      return checkNumber(length);
    }
  }, {
    key: "dot",
    value: function dot(mathArray) {
      var product = 0;

      for (var i = 0; i < this.ELEMENTS; ++i) {
        product += this[i] * mathArray[i];
      }

      return checkNumber(product);
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var length = this.magnitude();

      if (length !== 0) {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] /= length;
        }
      }

      return this.check();
    }
  }, {
    key: "multiply",
    value: function multiply() {
      for (var _len = arguments.length, vectors = new Array(_len), _key = 0; _key < _len; _key++) {
        vectors[_key] = arguments[_key];
      }

      for (var _i = 0, _vectors = vectors; _i < _vectors.length; _i++) {
        var vector = _vectors[_i];

        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] *= vector[i];
        }
      }

      return this.check();
    }
  }, {
    key: "divide",
    value: function divide() {
      for (var _len2 = arguments.length, vectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        vectors[_key2] = arguments[_key2];
      }

      for (var _i2 = 0, _vectors2 = vectors; _i2 < _vectors2.length; _i2++) {
        var vector = _vectors2[_i2];

        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] /= vector[i];
        }
      }

      return this.check();
    }
  }, {
    key: "lengthSq",
    value: function lengthSq() {
      return this.lengthSquared();
    }
  }, {
    key: "distanceTo",
    value: function distanceTo(vector) {
      return this.distance(vector);
    }
  }, {
    key: "distanceToSquared",
    value: function distanceToSquared(vector) {
      return this.distanceSquared(vector);
    }
  }, {
    key: "getComponent",
    value: function getComponent(i) {
      assert$5(i >= 0 && i < this.ELEMENTS, 'index is out of range');
      return checkNumber(this[i]);
    }
  }, {
    key: "setComponent",
    value: function setComponent(i, value) {
      assert$5(i >= 0 && i < this.ELEMENTS, 'index is out of range');
      this[i] = value;
      return this.check();
    }
  }, {
    key: "addVectors",
    value: function addVectors(a, b) {
      return this.copy(a).add(b);
    }
  }, {
    key: "subVectors",
    value: function subVectors(a, b) {
      return this.copy(a).subtract(b);
    }
  }, {
    key: "multiplyVectors",
    value: function multiplyVectors(a, b) {
      return this.copy(a).multiply(b);
    }
  }, {
    key: "addScaledVector",
    value: function addScaledVector(a, b) {
      return this.add(new this.constructor(a).multiplyScalar(b));
    }
  }, {
    key: "x",
    get: function get() {
      return this[0];
    },
    set: function set(value) {
      this[0] = checkNumber(value);
    }
  }, {
    key: "y",
    get: function get() {
      return this[1];
    },
    set: function set(value) {
      this[1] = checkNumber(value);
    }
  }]);

  return Vector;
}(MathArray);

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create$4() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
}
/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2d} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2d(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat3} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat3$1(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat4$2(out, a, m) {
  var x = a[0];
  var y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$4();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
})();

function vec2_transformMat4AsVector(out, a, m) {
  var x = a[0];
  var y = a[1];
  var w = m[3] * x + m[7] * y || 1.0;
  out[0] = (m[0] * x + m[4] * y) / w;
  out[1] = (m[1] * x + m[5] * y) / w;
  return out;
}
function vec3_transformMat4AsVector(out, a, m) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
  return out;
}
function vec3_transformMat2(out, a, m) {
  var x = a[0];
  var y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  out[2] = a[2];
  return out;
}
function vec4_transformMat3(out, a, m) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  out[0] = m[0] * x + m[3] * y + m[6] * z;
  out[1] = m[1] * x + m[4] * y + m[7] * z;
  out[2] = m[2] * x + m[5] * y + m[8] * z;
  out[3] = a[3];
  return out;
}

function _createSuper$5(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$5(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Vector2 = function (_Vector) {
  _inherits(Vector2, _Vector);

  var _super = _createSuper$5(Vector2);

  function Vector2() {
    var _this;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vector2);

    _this = _super.call(this, 2);

    if (isArray(x) && arguments.length === 1) {
      _this.copy(x);
    } else {
      if (config.debug) {
        checkNumber(x);
        checkNumber(y);
      }

      _this[0] = x;
      _this[1] = y;
    }

    return _this;
  }

  _createClass(Vector2, [{
    key: "set",
    value: function set(x, y) {
      this[0] = x;
      this[1] = y;
      return this.check();
    }
  }, {
    key: "copy",
    value: function copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      return this.check();
    }
  }, {
    key: "fromObject",
    value: function fromObject(object) {
      if (config.debug) {
        checkNumber(object.x);
        checkNumber(object.y);
      }

      this[0] = object.x;
      this[1] = object.y;
      return this.check();
    }
  }, {
    key: "toObject",
    value: function toObject(object) {
      object.x = this[0];
      object.y = this[1];
      return object;
    }
  }, {
    key: "horizontalAngle",
    value: function horizontalAngle() {
      return Math.atan2(this.y, this.x);
    }
  }, {
    key: "verticalAngle",
    value: function verticalAngle() {
      return Math.atan2(this.x, this.y);
    }
  }, {
    key: "transform",
    value: function transform(matrix4) {
      return this.transformAsPoint(matrix4);
    }
  }, {
    key: "transformAsPoint",
    value: function transformAsPoint(matrix4) {
      transformMat4$2(this, this, matrix4);
      return this.check();
    }
  }, {
    key: "transformAsVector",
    value: function transformAsVector(matrix4) {
      vec2_transformMat4AsVector(this, this, matrix4);
      return this.check();
    }
  }, {
    key: "transformByMatrix3",
    value: function transformByMatrix3(matrix3) {
      transformMat3$1(this, this, matrix3);
      return this.check();
    }
  }, {
    key: "transformByMatrix2x3",
    value: function transformByMatrix2x3(matrix2x3) {
      transformMat2d(this, this, matrix2x3);
      return this.check();
    }
  }, {
    key: "transformByMatrix2",
    value: function transformByMatrix2(matrix2) {
      transformMat2(this, this, matrix2);
      return this.check();
    }
  }, {
    key: "ELEMENTS",
    get: function get() {
      return 2;
    }
  }]);

  return Vector2;
}(Vector);

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$3() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length$2(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize$2(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$2(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4$1(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat$1(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX$2(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY$2(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateZ$2(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot$2(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length$2;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$3();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
})();

function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var ORIGIN = [0, 0, 0];
var constants$2 = {};

var Vector3 = function (_Vector) {
  _inherits(Vector3, _Vector);

  var _super = _createSuper$4(Vector3);

  _createClass(Vector3, null, [{
    key: "ZERO",
    get: function get() {
      return constants$2.ZERO = constants$2.ZERO || Object.freeze(new Vector3(0, 0, 0, 0));
    }
  }]);

  function Vector3() {
    var _this;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, Vector3);

    _this = _super.call(this, -0, -0, -0);

    if (arguments.length === 1 && isArray(x)) {
      _this.copy(x);
    } else {
      if (config.debug) {
        checkNumber(x);
        checkNumber(y);
        checkNumber(z);
      }

      _this[0] = x;
      _this[1] = y;
      _this[2] = z;
    }

    return _this;
  }

  _createClass(Vector3, [{
    key: "set",
    value: function set(x, y, z) {
      this[0] = x;
      this[1] = y;
      this[2] = z;
      return this.check();
    }
  }, {
    key: "copy",
    value: function copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      return this.check();
    }
  }, {
    key: "fromObject",
    value: function fromObject(object) {
      if (config.debug) {
        checkNumber(object.x);
        checkNumber(object.y);
        checkNumber(object.z);
      }

      this[0] = object.x;
      this[1] = object.y;
      this[2] = object.z;
      return this.check();
    }
  }, {
    key: "toObject",
    value: function toObject(object) {
      object.x = this[0];
      object.y = this[1];
      object.z = this[2];
      return object;
    }
  }, {
    key: "angle",
    value: function angle$1(vector) {
      return angle(this, vector);
    }
  }, {
    key: "cross",
    value: function cross$1(vector) {
      cross(this, this, vector);
      return this.check();
    }
  }, {
    key: "rotateX",
    value: function rotateX(_ref) {
      var radians = _ref.radians,
          _ref$origin = _ref.origin,
          origin = _ref$origin === void 0 ? ORIGIN : _ref$origin;
      rotateX$2(this, this, origin, radians);
      return this.check();
    }
  }, {
    key: "rotateY",
    value: function rotateY(_ref2) {
      var radians = _ref2.radians,
          _ref2$origin = _ref2.origin,
          origin = _ref2$origin === void 0 ? ORIGIN : _ref2$origin;
      rotateY$2(this, this, origin, radians);
      return this.check();
    }
  }, {
    key: "rotateZ",
    value: function rotateZ(_ref3) {
      var radians = _ref3.radians,
          _ref3$origin = _ref3.origin,
          origin = _ref3$origin === void 0 ? ORIGIN : _ref3$origin;
      rotateZ$2(this, this, origin, radians);
      return this.check();
    }
  }, {
    key: "transform",
    value: function transform(matrix4) {
      return this.transformAsPoint(matrix4);
    }
  }, {
    key: "transformAsPoint",
    value: function transformAsPoint(matrix4) {
      transformMat4$1(this, this, matrix4);
      return this.check();
    }
  }, {
    key: "transformAsVector",
    value: function transformAsVector(matrix4) {
      vec3_transformMat4AsVector(this, this, matrix4);
      return this.check();
    }
  }, {
    key: "transformByMatrix3",
    value: function transformByMatrix3(matrix3) {
      transformMat3(this, this, matrix3);
      return this.check();
    }
  }, {
    key: "transformByMatrix2",
    value: function transformByMatrix2(matrix2) {
      vec3_transformMat2(this, this, matrix2);
      return this.check();
    }
  }, {
    key: "transformByQuaternion",
    value: function transformByQuaternion(quaternion) {
      transformQuat$1(this, this, quaternion);
      return this.check();
    }
  }, {
    key: "ELEMENTS",
    get: function get() {
      return 3;
    }
  }, {
    key: "z",
    get: function get() {
      return this[2];
    },
    set: function set(value) {
      this[2] = checkNumber(value);
    }
  }]);

  return Vector3;
}(Vector);

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Matrix = function (_MathArray) {
  _inherits(Matrix, _MathArray);

  var _super = _createSuper$3(Matrix);

  function Matrix() {
    _classCallCheck(this, Matrix);

    return _super.apply(this, arguments);
  }

  _createClass(Matrix, [{
    key: "toString",
    value: function toString() {
      var string = '[';

      if (config.printRowMajor) {
        string += 'row-major:';

        for (var row = 0; row < this.RANK; ++row) {
          for (var col = 0; col < this.RANK; ++col) {
            string += " ".concat(this[col * this.RANK + row]);
          }
        }
      } else {
        string += 'column-major:';

        for (var i = 0; i < this.ELEMENTS; ++i) {
          string += " ".concat(this[i]);
        }
      }

      string += ']';
      return string;
    }
  }, {
    key: "getElementIndex",
    value: function getElementIndex(row, col) {
      return col * this.RANK + row;
    }
  }, {
    key: "getElement",
    value: function getElement(row, col) {
      return this[col * this.RANK + row];
    }
  }, {
    key: "setElement",
    value: function setElement(row, col, value) {
      this[col * this.RANK + row] = checkNumber(value);
      return this;
    }
  }, {
    key: "getColumn",
    value: function getColumn(columnIndex) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Array(this.RANK).fill(-0);
      var firstIndex = columnIndex * this.RANK;

      for (var i = 0; i < this.RANK; ++i) {
        result[i] = this[firstIndex + i];
      }

      return result;
    }
  }, {
    key: "setColumn",
    value: function setColumn(columnIndex, columnVector) {
      var firstIndex = columnIndex * this.RANK;

      for (var i = 0; i < this.RANK; ++i) {
        this[firstIndex + i] = columnVector[i];
      }

      return this;
    }
  }]);

  return Matrix;
}(MathArray);

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create$2() {
  var out = new ARRAY_TYPE(9);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function transpose$1(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}
/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function invert$2(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

  var det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
/**
 * Calculates the determinant of a mat3
 *
 * @param {ReadonlyMat3} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant$1(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}
/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function multiply$2(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b00 = b[0],
      b01 = b[1],
      b02 = b[2];
  var b10 = b[3],
      b11 = b[4],
      b12 = b[5];
  var b20 = b[6],
      b21 = b[7],
      b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to translate
 * @param {ReadonlyVec2} v vector to translate by
 * @returns {mat3} out
 */

function translate$1(out, a, v) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      x = v[0],
      y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function rotate$1(out, a, rad) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/

function scale$3(out, a, v) {
  var x = v[0],
      y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Calculates a 3x3 matrix from the given quaternion
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat3} out
 */

function fromQuat$1(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var IDENTITY$1 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
var ZERO$1 = Object.freeze([0, 0, 0, 0, 0, 0, 0, 0, 0]);
var INDICES$1 = Object.freeze({
  COL0ROW0: 0,
  COL0ROW1: 1,
  COL0ROW2: 2,
  COL1ROW0: 3,
  COL1ROW1: 4,
  COL1ROW2: 5,
  COL2ROW0: 6,
  COL2ROW1: 7,
  COL2ROW2: 8
});
var constants$1 = {};

var Matrix3 = function (_Matrix) {
  _inherits(Matrix3, _Matrix);

  var _super = _createSuper$2(Matrix3);

  _createClass(Matrix3, [{
    key: "ELEMENTS",
    get: function get() {
      return 9;
    }
  }, {
    key: "RANK",
    get: function get() {
      return 3;
    }
  }, {
    key: "INDICES",
    get: function get() {
      return INDICES$1;
    }
  }], [{
    key: "IDENTITY",
    get: function get() {
      constants$1.IDENTITY = constants$1.IDENTITY || Object.freeze(new Matrix3(IDENTITY$1));
      return constants$1.IDENTITY;
    }
  }, {
    key: "ZERO",
    get: function get() {
      constants$1.ZERO = constants$1.ZERO || Object.freeze(new Matrix3(ZERO$1));
      return constants$1.ZERO;
    }
  }]);

  function Matrix3(array) {
    var _this;

    _classCallCheck(this, Matrix3);

    _this = _super.call(this, -0, -0, -0, -0, -0, -0, -0, -0, -0);

    if (arguments.length === 1 && Array.isArray(array)) {
      _this.copy(array);
    } else {
      _this.identity();
    }

    return _this;
  }

  _createClass(Matrix3, [{
    key: "copy",
    value: function copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      this[3] = array[3];
      this[4] = array[4];
      this[5] = array[5];
      this[6] = array[6];
      this[7] = array[7];
      this[8] = array[8];
      return this.check();
    }
  }, {
    key: "set",
    value: function set(m00, m10, m20, m01, m11, m21, m02, m12, m22) {
      this[0] = m00;
      this[1] = m10;
      this[2] = m20;
      this[3] = m01;
      this[4] = m11;
      this[5] = m21;
      this[6] = m02;
      this[7] = m12;
      this[8] = m22;
      return this.check();
    }
  }, {
    key: "setRowMajor",
    value: function setRowMajor(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      this[0] = m00;
      this[1] = m10;
      this[2] = m20;
      this[3] = m01;
      this[4] = m11;
      this[5] = m21;
      this[6] = m02;
      this[7] = m12;
      this[8] = m22;
      return this.check();
    }
  }, {
    key: "determinant",
    value: function determinant() {
      return determinant$1(this);
    }
  }, {
    key: "identity",
    value: function identity() {
      return this.copy(IDENTITY$1);
    }
  }, {
    key: "fromQuaternion",
    value: function fromQuaternion(q) {
      fromQuat$1(this, q);
      return this.check();
    }
  }, {
    key: "transpose",
    value: function transpose() {
      transpose$1(this, this);
      return this.check();
    }
  }, {
    key: "invert",
    value: function invert() {
      invert$2(this, this);
      return this.check();
    }
  }, {
    key: "multiplyLeft",
    value: function multiplyLeft(a) {
      multiply$2(this, a, this);
      return this.check();
    }
  }, {
    key: "multiplyRight",
    value: function multiplyRight(a) {
      multiply$2(this, this, a);
      return this.check();
    }
  }, {
    key: "rotate",
    value: function rotate(radians) {
      rotate$1(this, this, radians);
      return this.check();
    }
  }, {
    key: "scale",
    value: function scale(factor) {
      if (Array.isArray(factor)) {
        scale$3(this, this, factor);
      } else {
        scale$3(this, this, [factor, factor, factor]);
      }

      return this.check();
    }
  }, {
    key: "translate",
    value: function translate(vec) {
      translate$1(this, this, vec);
      return this.check();
    }
  }, {
    key: "transform",
    value: function transform(vector, result) {
      switch (vector.length) {
        case 2:
          result = transformMat3$1(result || [-0, -0], vector, this);
          break;

        case 3:
          result = transformMat3(result || [-0, -0, -0], vector, this);
          break;

        case 4:
          result = vec4_transformMat3(result || [-0, -0, -0, -0], vector, this);
          break;

        default:
          throw new Error('Illegal vector');
      }

      checkVector(result, vector.length);
      return result;
    }
  }, {
    key: "transformVector",
    value: function transformVector(vector, result) {
      deprecated('Matrix3.transformVector');
      return this.transform(vector, result);
    }
  }, {
    key: "transformVector2",
    value: function transformVector2(vector, result) {
      deprecated('Matrix3.transformVector');
      return this.transform(vector, result);
    }
  }, {
    key: "transformVector3",
    value: function transformVector3(vector, result) {
      deprecated('Matrix3.transformVector');
      return this.transform(vector, result);
    }
  }]);

  return Matrix3;
}(Matrix);

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
}

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity$1(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert$1(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply$1(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale$2(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX$1(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY$1(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ$1(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspective(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function ortho(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity$1(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$1() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function add$1(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */

function scale$1(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Calculates the length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate length of
 * @returns {Number} length of a
 */

function length$1(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength$1(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize$1(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Calculates the dot product of two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$1(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */

function lerp$1(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec4} out
 */

function transformQuat(out, a, q) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3]; // calculate quat * vec

  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$1();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var IDENTITY = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
var ZERO = Object.freeze([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
var INDICES = Object.freeze({
  COL0ROW0: 0,
  COL0ROW1: 1,
  COL0ROW2: 2,
  COL0ROW3: 3,
  COL1ROW0: 4,
  COL1ROW1: 5,
  COL1ROW2: 6,
  COL1ROW3: 7,
  COL2ROW0: 8,
  COL2ROW1: 9,
  COL2ROW2: 10,
  COL2ROW3: 11,
  COL3ROW0: 12,
  COL3ROW1: 13,
  COL3ROW2: 14,
  COL3ROW3: 15
});
var constants = {};

var Matrix4 = function (_Matrix) {
  _inherits(Matrix4, _Matrix);

  var _super = _createSuper$1(Matrix4);

  _createClass(Matrix4, [{
    key: "INDICES",
    get: function get() {
      return INDICES;
    }
  }, {
    key: "ELEMENTS",
    get: function get() {
      return 16;
    }
  }, {
    key: "RANK",
    get: function get() {
      return 4;
    }
  }], [{
    key: "IDENTITY",
    get: function get() {
      constants.IDENTITY = constants.IDENTITY || Object.freeze(new Matrix4(IDENTITY));
      return constants.IDENTITY;
    }
  }, {
    key: "ZERO",
    get: function get() {
      constants.ZERO = constants.ZERO || Object.freeze(new Matrix4(ZERO));
      return constants.ZERO;
    }
  }]);

  function Matrix4(array) {
    var _this;

    _classCallCheck(this, Matrix4);

    _this = _super.call(this, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0);

    if (arguments.length === 1 && Array.isArray(array)) {
      _this.copy(array);
    } else {
      _this.identity();
    }

    return _this;
  }

  _createClass(Matrix4, [{
    key: "copy",
    value: function copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      this[3] = array[3];
      this[4] = array[4];
      this[5] = array[5];
      this[6] = array[6];
      this[7] = array[7];
      this[8] = array[8];
      this[9] = array[9];
      this[10] = array[10];
      this[11] = array[11];
      this[12] = array[12];
      this[13] = array[13];
      this[14] = array[14];
      this[15] = array[15];
      return this.check();
    }
  }, {
    key: "set",
    value: function set(m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33) {
      this[0] = m00;
      this[1] = m10;
      this[2] = m20;
      this[3] = m30;
      this[4] = m01;
      this[5] = m11;
      this[6] = m21;
      this[7] = m31;
      this[8] = m02;
      this[9] = m12;
      this[10] = m22;
      this[11] = m32;
      this[12] = m03;
      this[13] = m13;
      this[14] = m23;
      this[15] = m33;
      return this.check();
    }
  }, {
    key: "setRowMajor",
    value: function setRowMajor(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      this[0] = m00;
      this[1] = m10;
      this[2] = m20;
      this[3] = m30;
      this[4] = m01;
      this[5] = m11;
      this[6] = m21;
      this[7] = m31;
      this[8] = m02;
      this[9] = m12;
      this[10] = m22;
      this[11] = m32;
      this[12] = m03;
      this[13] = m13;
      this[14] = m23;
      this[15] = m33;
      return this.check();
    }
  }, {
    key: "toRowMajor",
    value: function toRowMajor(result) {
      result[0] = this[0];
      result[1] = this[4];
      result[2] = this[8];
      result[3] = this[12];
      result[4] = this[1];
      result[5] = this[5];
      result[6] = this[9];
      result[7] = this[13];
      result[8] = this[2];
      result[9] = this[6];
      result[10] = this[10];
      result[11] = this[14];
      result[12] = this[3];
      result[13] = this[7];
      result[14] = this[11];
      result[15] = this[15];
      return result;
    }
  }, {
    key: "identity",
    value: function identity() {
      return this.copy(IDENTITY);
    }
  }, {
    key: "fromQuaternion",
    value: function fromQuaternion(q) {
      fromQuat(this, q);
      return this.check();
    }
  }, {
    key: "frustum",
    value: function frustum$1(_ref) {
      var left = _ref.left,
          right = _ref.right,
          bottom = _ref.bottom,
          top = _ref.top,
          near = _ref.near,
          far = _ref.far;

      if (far === Infinity) {
        Matrix4._computeInfinitePerspectiveOffCenter(this, left, right, bottom, top, near);
      } else {
        frustum(this, left, right, bottom, top, near, far);
      }

      return this.check();
    }
  }, {
    key: "lookAt",
    value: function lookAt$1(eye, center, up) {
      if (arguments.length === 1) {
        var _eye = eye;
        eye = _eye.eye;
        center = _eye.center;
        up = _eye.up;
      }

      center = center || [0, 0, 0];
      up = up || [0, 1, 0];
      lookAt(this, eye, center, up);
      return this.check();
    }
  }, {
    key: "ortho",
    value: function ortho$1(_ref2) {
      var left = _ref2.left,
          right = _ref2.right,
          bottom = _ref2.bottom,
          top = _ref2.top,
          _ref2$near = _ref2.near,
          near = _ref2$near === void 0 ? 0.1 : _ref2$near,
          _ref2$far = _ref2.far,
          far = _ref2$far === void 0 ? 500 : _ref2$far;
      ortho(this, left, right, bottom, top, near, far);
      return this.check();
    }
  }, {
    key: "orthographic",
    value: function orthographic(_ref3) {
      var _ref3$fovy = _ref3.fovy,
          fovy = _ref3$fovy === void 0 ? 45 * Math.PI / 180 : _ref3$fovy,
          _ref3$aspect = _ref3.aspect,
          aspect = _ref3$aspect === void 0 ? 1 : _ref3$aspect,
          _ref3$focalDistance = _ref3.focalDistance,
          focalDistance = _ref3$focalDistance === void 0 ? 1 : _ref3$focalDistance,
          _ref3$near = _ref3.near,
          near = _ref3$near === void 0 ? 0.1 : _ref3$near,
          _ref3$far = _ref3.far,
          far = _ref3$far === void 0 ? 500 : _ref3$far;

      if (fovy > Math.PI * 2) {
        throw Error('radians');
      }

      var halfY = fovy / 2;
      var top = focalDistance * Math.tan(halfY);
      var right = top * aspect;
      return new Matrix4().ortho({
        left: -right,
        right: right,
        bottom: -top,
        top: top,
        near: near,
        far: far
      });
    }
  }, {
    key: "perspective",
    value: function perspective$1() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$fovy = _ref4.fovy,
          fovy = _ref4$fovy === void 0 ? undefined : _ref4$fovy,
          _ref4$fov = _ref4.fov,
          fov = _ref4$fov === void 0 ? 45 * Math.PI / 180 : _ref4$fov,
          _ref4$aspect = _ref4.aspect,
          aspect = _ref4$aspect === void 0 ? 1 : _ref4$aspect,
          _ref4$near = _ref4.near,
          near = _ref4$near === void 0 ? 0.1 : _ref4$near,
          _ref4$far = _ref4.far,
          far = _ref4$far === void 0 ? 500 : _ref4$far;

      fovy = fovy || fov;

      if (fovy > Math.PI * 2) {
        throw Error('radians');
      }

      perspective(this, fovy, aspect, near, far);
      return this.check();
    }
  }, {
    key: "determinant",
    value: function determinant$1() {
      return determinant(this);
    }
  }, {
    key: "getScale",
    value: function getScale() {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [-0, -0, -0];
      result[0] = Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
      result[1] = Math.sqrt(this[4] * this[4] + this[5] * this[5] + this[6] * this[6]);
      result[2] = Math.sqrt(this[8] * this[8] + this[9] * this[9] + this[10] * this[10]);
      return result;
    }
  }, {
    key: "getTranslation",
    value: function getTranslation() {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [-0, -0, -0];
      result[0] = this[12];
      result[1] = this[13];
      result[2] = this[14];
      return result;
    }
  }, {
    key: "getRotation",
    value: function getRotation() {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [-0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0];
      var scaleResult = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var scale = this.getScale(scaleResult || [-0, -0, -0]);
      var inverseScale0 = 1 / scale[0];
      var inverseScale1 = 1 / scale[1];
      var inverseScale2 = 1 / scale[2];
      result[0] = this[0] * inverseScale0;
      result[1] = this[1] * inverseScale1;
      result[2] = this[2] * inverseScale2;
      result[3] = 0;
      result[4] = this[4] * inverseScale0;
      result[5] = this[5] * inverseScale1;
      result[6] = this[6] * inverseScale2;
      result[7] = 0;
      result[8] = this[8] * inverseScale0;
      result[9] = this[9] * inverseScale1;
      result[10] = this[10] * inverseScale2;
      result[11] = 0;
      result[12] = 0;
      result[13] = 0;
      result[14] = 0;
      result[15] = 1;
      return result;
    }
  }, {
    key: "getRotationMatrix3",
    value: function getRotationMatrix3() {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [-0, -0, -0, -0, -0, -0, -0, -0, -0];
      var scaleResult = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var scale = this.getScale(scaleResult || [-0, -0, -0]);
      var inverseScale0 = 1 / scale[0];
      var inverseScale1 = 1 / scale[1];
      var inverseScale2 = 1 / scale[2];
      result[0] = this[0] * inverseScale0;
      result[1] = this[1] * inverseScale1;
      result[2] = this[2] * inverseScale2;
      result[3] = this[4] * inverseScale0;
      result[4] = this[5] * inverseScale1;
      result[5] = this[6] * inverseScale2;
      result[6] = this[8] * inverseScale0;
      result[7] = this[9] * inverseScale1;
      result[8] = this[10] * inverseScale2;
      return result;
    }
  }, {
    key: "transpose",
    value: function transpose$1() {
      transpose(this, this);
      return this.check();
    }
  }, {
    key: "invert",
    value: function invert() {
      invert$1(this, this);
      return this.check();
    }
  }, {
    key: "multiplyLeft",
    value: function multiplyLeft(a) {
      multiply$1(this, a, this);
      return this.check();
    }
  }, {
    key: "multiplyRight",
    value: function multiplyRight(a) {
      multiply$1(this, this, a);
      return this.check();
    }
  }, {
    key: "rotateX",
    value: function rotateX(radians) {
      rotateX$1(this, this, radians);
      return this.check();
    }
  }, {
    key: "rotateY",
    value: function rotateY(radians) {
      rotateY$1(this, this, radians);
      return this.check();
    }
  }, {
    key: "rotateZ",
    value: function rotateZ(radians) {
      rotateZ$1(this, this, radians);
      return this.check();
    }
  }, {
    key: "rotateXYZ",
    value: function rotateXYZ(_ref5) {
      var _ref6 = _slicedToArray(_ref5, 3),
          rx = _ref6[0],
          ry = _ref6[1],
          rz = _ref6[2];

      return this.rotateX(rx).rotateY(ry).rotateZ(rz);
    }
  }, {
    key: "rotateAxis",
    value: function rotateAxis(radians, axis) {
      rotate(this, this, radians, axis);
      return this.check();
    }
  }, {
    key: "scale",
    value: function scale(factor) {
      if (Array.isArray(factor)) {
        scale$2(this, this, factor);
      } else {
        scale$2(this, this, [factor, factor, factor]);
      }

      return this.check();
    }
  }, {
    key: "translate",
    value: function translate$1(vec) {
      translate(this, this, vec);
      return this.check();
    }
  }, {
    key: "transform",
    value: function transform(vector, result) {
      if (vector.length === 4) {
        result = transformMat4(result || [-0, -0, -0, -0], vector, this);
        checkVector(result, 4);
        return result;
      }

      return this.transformAsPoint(vector, result);
    }
  }, {
    key: "transformAsPoint",
    value: function transformAsPoint(vector, result) {
      var length = vector.length;

      switch (length) {
        case 2:
          result = transformMat4$2(result || [-0, -0], vector, this);
          break;

        case 3:
          result = transformMat4$1(result || [-0, -0, -0], vector, this);
          break;

        default:
          throw new Error('Illegal vector');
      }

      checkVector(result, vector.length);
      return result;
    }
  }, {
    key: "transformAsVector",
    value: function transformAsVector(vector, result) {
      switch (vector.length) {
        case 2:
          result = vec2_transformMat4AsVector(result || [-0, -0], vector, this);
          break;

        case 3:
          result = vec3_transformMat4AsVector(result || [-0, -0, -0], vector, this);
          break;

        default:
          throw new Error('Illegal vector');
      }

      checkVector(result, vector.length);
      return result;
    }
  }, {
    key: "makeRotationX",
    value: function makeRotationX(radians) {
      return this.identity().rotateX(radians);
    }
  }, {
    key: "makeTranslation",
    value: function makeTranslation(x, y, z) {
      return this.identity().translate([x, y, z]);
    }
  }, {
    key: "transformPoint",
    value: function transformPoint(vector, result) {
      deprecated('Matrix4.transformPoint', '3.0');
      return this.transformAsPoint(vector, result);
    }
  }, {
    key: "transformVector",
    value: function transformVector(vector, result) {
      deprecated('Matrix4.transformVector', '3.0');
      return this.transformAsPoint(vector, result);
    }
  }, {
    key: "transformDirection",
    value: function transformDirection(vector, result) {
      deprecated('Matrix4.transformDirection', '3.0');
      return this.transformAsVector(vector, result);
    }
  }], [{
    key: "_computeInfinitePerspectiveOffCenter",
    value: function _computeInfinitePerspectiveOffCenter(result, left, right, bottom, top, near) {
      var column0Row0 = 2.0 * near / (right - left);
      var column1Row1 = 2.0 * near / (top - bottom);
      var column2Row0 = (right + left) / (right - left);
      var column2Row1 = (top + bottom) / (top - bottom);
      var column2Row2 = -1.0;
      var column2Row3 = -1.0;
      var column3Row2 = -2.0 * near;
      result[0] = column0Row0;
      result[1] = 0.0;
      result[2] = 0.0;
      result[3] = 0.0;
      result[4] = 0.0;
      result[5] = column1Row1;
      result[6] = 0.0;
      result[7] = 0.0;
      result[8] = column2Row0;
      result[9] = column2Row1;
      result[10] = column2Row2;
      result[11] = column2Row3;
      result[12] = 0.0;
      result[13] = 0.0;
      result[14] = column3Row2;
      result[15] = 0.0;
      return result;
    }
  }]);

  return Matrix4;
}(Matrix);

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 */

function multiply(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateX(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateY(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var by = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateZ(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bz = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate W component of
 * @returns {quat} out
 */

function calculateW(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate inverse of
 * @returns {quat} out
 */

function invert(out, a) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate conjugate of
 * @returns {quat} out
 */

function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 * @function
 */

var add = add$1;
/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {ReadonlyQuat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */

var scale = scale$1;
/**
 * Calculates the dot product of two quat's
 *
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot = dot$1;
/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 * @function
 */

var lerp = lerp$1;
/**
 * Calculates the length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate length of
 * @returns {Number} length of a
 */

var length = length$1;
/**
 * Calculates the squared length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength = squaredLength$1;
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize = normalize$1;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

var rotationTo = function () {
  var tmpvec3 = create$3();
  var xUnitVec3 = fromValues(1, 0, 0);
  var yUnitVec3 = fromValues(0, 1, 0);
  return function (out, a, b) {
    var dot = dot$2(a, b);

    if (dot < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
      normalize$2(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize(out, out);
    }
  };
}();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

(function () {
  var temp1 = create();
  var temp2 = create();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
})();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

(function () {
  var matr = create$2();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize(out, fromMat3(out, matr));
  };
})();

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var IDENTITY_QUATERNION = [0, 0, 0, 1];

var Quaternion = function (_MathArray) {
  _inherits(Quaternion, _MathArray);

  var _super = _createSuper(Quaternion);

  function Quaternion() {
    var _this;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    _classCallCheck(this, Quaternion);

    _this = _super.call(this, -0, -0, -0, -0);

    if (Array.isArray(x) && arguments.length === 1) {
      _this.copy(x);
    } else {
      _this.set(x, y, z, w);
    }

    return _this;
  }

  _createClass(Quaternion, [{
    key: "copy",
    value: function copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      this[3] = array[3];
      return this.check();
    }
  }, {
    key: "set",
    value: function set(x, y, z, w) {
      this[0] = x;
      this[1] = y;
      this[2] = z;
      this[3] = w;
      return this.check();
    }
  }, {
    key: "fromMatrix3",
    value: function fromMatrix3(m) {
      fromMat3(this, m);
      return this.check();
    }
  }, {
    key: "identity",
    value: function identity$1() {
      identity(this);
      return this.check();
    }
  }, {
    key: "fromAxisRotation",
    value: function fromAxisRotation(axis, rad) {
      setAxisAngle(this, axis, rad);
      return this.check();
    }
  }, {
    key: "setAxisAngle",
    value: function setAxisAngle(axis, rad) {
      return this.fromAxisRotation(axis, rad);
    }
  }, {
    key: "len",
    value: function len() {
      return length(this);
    }
  }, {
    key: "lengthSquared",
    value: function lengthSquared() {
      return squaredLength(this);
    }
  }, {
    key: "dot",
    value: function dot$1(a, b) {
      if (b !== undefined) {
        throw new Error('Quaternion.dot only takes one argument');
      }

      return dot(this, a);
    }
  }, {
    key: "rotationTo",
    value: function rotationTo$1(vectorA, vectorB) {
      rotationTo(this, vectorA, vectorB);
      return this.check();
    }
  }, {
    key: "add",
    value: function add$1(a, b) {
      if (b !== undefined) {
        throw new Error('Quaternion.add only takes one argument');
      }

      add(this, this, a);
      return this.check();
    }
  }, {
    key: "calculateW",
    value: function calculateW$1() {
      calculateW(this, this);
      return this.check();
    }
  }, {
    key: "conjugate",
    value: function conjugate$1() {
      conjugate(this, this);
      return this.check();
    }
  }, {
    key: "invert",
    value: function invert$1() {
      invert(this, this);
      return this.check();
    }
  }, {
    key: "lerp",
    value: function lerp$1(a, b, t) {
      lerp(this, a, b, t);
      return this.check();
    }
  }, {
    key: "multiplyRight",
    value: function multiplyRight(a, b) {
      assert$5(!b);
      multiply(this, this, a);
      return this.check();
    }
  }, {
    key: "multiplyLeft",
    value: function multiplyLeft(a, b) {
      assert$5(!b);
      multiply(this, a, this);
      return this.check();
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var length = this.len();
      var l = length > 0 ? 1 / length : 0;
      this[0] = this[0] * l;
      this[1] = this[1] * l;
      this[2] = this[2] * l;
      this[3] = this[3] * l;

      if (length === 0) {
        this[3] = 1;
      }

      return this.check();
    }
  }, {
    key: "rotateX",
    value: function rotateX$1(rad) {
      rotateX(this, this, rad);
      return this.check();
    }
  }, {
    key: "rotateY",
    value: function rotateY$1(rad) {
      rotateY(this, this, rad);
      return this.check();
    }
  }, {
    key: "rotateZ",
    value: function rotateZ$1(rad) {
      rotateZ(this, this, rad);
      return this.check();
    }
  }, {
    key: "scale",
    value: function scale$1(b) {
      scale(this, this, b);
      return this.check();
    }
  }, {
    key: "slerp",
    value: function slerp$1(start, target, ratio) {
      switch (arguments.length) {
        case 1:
          var _arguments$ = arguments[0];
          var _arguments$$start = _arguments$.start;
          start = _arguments$$start === void 0 ? IDENTITY_QUATERNION : _arguments$$start;
          target = _arguments$.target;
          ratio = _arguments$.ratio;
          break;

        case 2:
          var _arguments = Array.prototype.slice.call(arguments);

          target = _arguments[0];
          ratio = _arguments[1];
          start = this;
          break;
      }

      slerp(this, start, target, ratio);
      return this.check();
    }
  }, {
    key: "transformVector4",
    value: function transformVector4(vector) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : vector;
      transformQuat(result, vector, this);
      return checkVector(result, 4);
    }
  }, {
    key: "lengthSq",
    value: function lengthSq() {
      return this.lengthSquared();
    }
  }, {
    key: "setFromAxisAngle",
    value: function setFromAxisAngle(axis, rad) {
      return this.setAxisAngle(axis, rad);
    }
  }, {
    key: "premultiply",
    value: function premultiply(a, b) {
      return this.multiplyLeft(a, b);
    }
  }, {
    key: "multiply",
    value: function multiply(a, b) {
      return this.multiplyRight(a, b);
    }
  }, {
    key: "ELEMENTS",
    get: function get() {
      return 4;
    }
  }, {
    key: "x",
    get: function get() {
      return this[0];
    },
    set: function set(value) {
      this[0] = checkNumber(value);
    }
  }, {
    key: "y",
    get: function get() {
      return this[1];
    },
    set: function set(value) {
      this[1] = checkNumber(value);
    }
  }, {
    key: "z",
    get: function get() {
      return this[2];
    },
    set: function set(value) {
      this[2] = checkNumber(value);
    }
  }, {
    key: "w",
    get: function get() {
      return this[3];
    },
    set: function set(value) {
      this[3] = checkNumber(value);
    }
  }]);

  return Quaternion;
}(MathArray);

var _MathUtils = {
  EPSILON1: 1e-1,
  EPSILON2: 1e-2,
  EPSILON3: 1e-3,
  EPSILON4: 1e-4,
  EPSILON5: 1e-5,
  EPSILON6: 1e-6,
  EPSILON7: 1e-7,
  EPSILON8: 1e-8,
  EPSILON9: 1e-9,
  EPSILON10: 1e-10,
  EPSILON11: 1e-11,
  EPSILON12: 1e-12,
  EPSILON13: 1e-13,
  EPSILON14: 1e-14,
  EPSILON15: 1e-15,
  EPSILON16: 1e-16,
  EPSILON17: 1e-17,
  EPSILON18: 1e-18,
  EPSILON19: 1e-19,
  EPSILON20: 1e-20,
  PI_OVER_TWO: Math.PI / 2,
  PI_OVER_FOUR: Math.PI / 4,
  PI_OVER_SIX: Math.PI / 6,
  TWO_PI: Math.PI * 2
};

var WGS84_RADIUS_X$2 = 6378137.0;
var WGS84_RADIUS_Y$1 = 6378137.0;
var WGS84_RADIUS_Z$1 = 6356752.3142451793;

var noop = function noop(x) {
  return x;
};

var scratchVector$8 = new Vector3();
function fromCartographic(cartographic, result) {
  var map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  if (isArray(cartographic)) {
    result[0] = map(cartographic[0]);
    result[1] = map(cartographic[1]);
    result[2] = cartographic[2];
  } else if ('longitude' in cartographic) {
    result[0] = map(cartographic.longitude);
    result[1] = map(cartographic.latitude);
    result[2] = cartographic.height;
  } else {
    result[0] = map(cartographic.x);
    result[1] = map(cartographic.y);
    result[2] = cartographic.z;
  }

  return result;
}
function fromCartographicToRadians(cartographic) {
  var vector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scratchVector$8;
  return fromCartographic(cartographic, vector, config._cartographicRadians ? noop : toRadians);
}
function toCartographic(vector, cartographic) {
  var map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  if (isArray(cartographic)) {
    cartographic[0] = map(vector[0]);
    cartographic[1] = map(vector[1]);
    cartographic[2] = vector[2];
  } else if ('longitude' in cartographic) {
    cartographic.longitude = map(vector[0]);
    cartographic.latitude = map(vector[1]);
    cartographic.height = vector[2];
  } else {
    cartographic.x = map(vector[0]);
    cartographic.y = map(vector[1]);
    cartographic.z = vector[2];
  }

  return cartographic;
}
function toCartographicFromRadians(vector, cartographic) {
  return toCartographic(vector, cartographic, config._cartographicRadians ? noop : toDegrees);
}

var scratchVector$7 = new Vector3();
var scaleToGeodeticSurfaceIntersection = new Vector3();
var scaleToGeodeticSurfaceGradient = new Vector3();
function scaleToGeodeticSurface(cartesian, ellipsoid) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Vector3();
  var oneOverRadii = ellipsoid.oneOverRadii,
      oneOverRadiiSquared = ellipsoid.oneOverRadiiSquared,
      centerToleranceSquared = ellipsoid.centerToleranceSquared;
  scratchVector$7.from(cartesian);
  var positionX = cartesian.x;
  var positionY = cartesian.y;
  var positionZ = cartesian.z;
  var oneOverRadiiX = oneOverRadii.x;
  var oneOverRadiiY = oneOverRadii.y;
  var oneOverRadiiZ = oneOverRadii.z;
  var x2 = positionX * positionX * oneOverRadiiX * oneOverRadiiX;
  var y2 = positionY * positionY * oneOverRadiiY * oneOverRadiiY;
  var z2 = positionZ * positionZ * oneOverRadiiZ * oneOverRadiiZ;
  var squaredNorm = x2 + y2 + z2;
  var ratio = Math.sqrt(1.0 / squaredNorm);

  if (!Number.isFinite(ratio)) {
    return undefined;
  }

  var intersection = scaleToGeodeticSurfaceIntersection;
  intersection.copy(cartesian).scale(ratio);

  if (squaredNorm < centerToleranceSquared) {
    return intersection.to(result);
  }

  var oneOverRadiiSquaredX = oneOverRadiiSquared.x;
  var oneOverRadiiSquaredY = oneOverRadiiSquared.y;
  var oneOverRadiiSquaredZ = oneOverRadiiSquared.z;
  var gradient = scaleToGeodeticSurfaceGradient;
  gradient.set(intersection.x * oneOverRadiiSquaredX * 2.0, intersection.y * oneOverRadiiSquaredY * 2.0, intersection.z * oneOverRadiiSquaredZ * 2.0);
  var lambda = (1.0 - ratio) * cartesian.len() / (0.5 * gradient.len());
  var correction = 0.0;
  var xMultiplier;
  var yMultiplier;
  var zMultiplier;
  var func;

  do {
    lambda -= correction;
    xMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredX);
    yMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredY);
    zMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredZ);
    var xMultiplier2 = xMultiplier * xMultiplier;
    var yMultiplier2 = yMultiplier * yMultiplier;
    var zMultiplier2 = zMultiplier * zMultiplier;
    var xMultiplier3 = xMultiplier2 * xMultiplier;
    var yMultiplier3 = yMultiplier2 * yMultiplier;
    var zMultiplier3 = zMultiplier2 * zMultiplier;
    func = x2 * xMultiplier2 + y2 * yMultiplier2 + z2 * zMultiplier2 - 1.0;
    var denominator = x2 * xMultiplier3 * oneOverRadiiSquaredX + y2 * yMultiplier3 * oneOverRadiiSquaredY + z2 * zMultiplier3 * oneOverRadiiSquaredZ;
    var derivative = -2.0 * denominator;
    correction = func / derivative;
  } while (Math.abs(func) > _MathUtils.EPSILON12);

  return scratchVector$7.scale([xMultiplier, yMultiplier, zMultiplier]).to(result);
}

var EPSILON14 = 1e-14;
var scratchOrigin = new Vector3();
var VECTOR_PRODUCT_LOCAL_FRAME = {
  up: {
    south: 'east',
    north: 'west',
    west: 'south',
    east: 'north'
  },
  down: {
    south: 'west',
    north: 'east',
    west: 'north',
    east: 'south'
  },
  south: {
    up: 'west',
    down: 'east',
    west: 'down',
    east: 'up'
  },
  north: {
    up: 'east',
    down: 'west',
    west: 'up',
    east: 'down'
  },
  west: {
    up: 'north',
    down: 'south',
    north: 'down',
    south: 'up'
  },
  east: {
    up: 'south',
    down: 'north',
    north: 'up',
    south: 'down'
  }
};
var degeneratePositionLocalFrame = {
  north: [-1, 0, 0],
  east: [0, 1, 0],
  up: [0, 0, 1],
  south: [1, 0, 0],
  west: [0, -1, 0],
  down: [0, 0, -1]
};
var scratchAxisVectors = {
  east: new Vector3(),
  north: new Vector3(),
  up: new Vector3(),
  west: new Vector3(),
  south: new Vector3(),
  down: new Vector3()
};
var scratchVector1 = new Vector3();
var scratchVector2$1 = new Vector3();
var scratchVector3 = new Vector3();
function localFrameToFixedFrame(ellipsoid, firstAxis, secondAxis, thirdAxis, cartesianOrigin, result) {
  var thirdAxisInferred = VECTOR_PRODUCT_LOCAL_FRAME[firstAxis] && VECTOR_PRODUCT_LOCAL_FRAME[firstAxis][secondAxis];
  assert$5(thirdAxisInferred && (!thirdAxis || thirdAxis === thirdAxisInferred));
  var firstAxisVector;
  var secondAxisVector;
  var thirdAxisVector;
  var origin = scratchOrigin.copy(cartesianOrigin);
  var atPole = equals(origin.x, 0.0, EPSILON14) && equals(origin.y, 0.0, EPSILON14);

  if (atPole) {
    var sign = Math.sign(origin.z);
    firstAxisVector = scratchVector1.fromArray(degeneratePositionLocalFrame[firstAxis]);

    if (firstAxis !== 'east' && firstAxis !== 'west') {
      firstAxisVector.scale(sign);
    }

    secondAxisVector = scratchVector2$1.fromArray(degeneratePositionLocalFrame[secondAxis]);

    if (secondAxis !== 'east' && secondAxis !== 'west') {
      secondAxisVector.scale(sign);
    }

    thirdAxisVector = scratchVector3.fromArray(degeneratePositionLocalFrame[thirdAxis]);

    if (thirdAxis !== 'east' && thirdAxis !== 'west') {
      thirdAxisVector.scale(sign);
    }
  } else {
    var up = scratchAxisVectors.up,
        east = scratchAxisVectors.east,
        north = scratchAxisVectors.north;
    east.set(-origin.y, origin.x, 0.0).normalize();
    ellipsoid.geodeticSurfaceNormal(origin, up);
    north.copy(up).cross(east);
    var down = scratchAxisVectors.down,
        west = scratchAxisVectors.west,
        south = scratchAxisVectors.south;
    down.copy(up).scale(-1);
    west.copy(east).scale(-1);
    south.copy(north).scale(-1);
    firstAxisVector = scratchAxisVectors[firstAxis];
    secondAxisVector = scratchAxisVectors[secondAxis];
    thirdAxisVector = scratchAxisVectors[thirdAxis];
  }

  result[0] = firstAxisVector.x;
  result[1] = firstAxisVector.y;
  result[2] = firstAxisVector.z;
  result[3] = 0.0;
  result[4] = secondAxisVector.x;
  result[5] = secondAxisVector.y;
  result[6] = secondAxisVector.z;
  result[7] = 0.0;
  result[8] = thirdAxisVector.x;
  result[9] = thirdAxisVector.y;
  result[10] = thirdAxisVector.z;
  result[11] = 0.0;
  result[12] = origin.x;
  result[13] = origin.y;
  result[14] = origin.z;
  result[15] = 1.0;
  return result;
}

var scratchVector$6 = new Vector3();
var scratchNormal$3 = new Vector3();
var scratchK = new Vector3();
var scratchPosition$2 = new Vector3();
var scratchHeight = new Vector3();
var scratchCartesian = new Vector3();
var wgs84;

var Ellipsoid = function () {
  _createClass(Ellipsoid, null, [{
    key: "WGS84",
    get: function get() {
      wgs84 = wgs84 || new Ellipsoid(WGS84_RADIUS_X$2, WGS84_RADIUS_Y$1, WGS84_RADIUS_Z$1);
      return wgs84;
    }
  }]);

  function Ellipsoid() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;

    _classCallCheck(this, Ellipsoid);

    assert$5(x >= 0.0);
    assert$5(y >= 0.0);
    assert$5(z >= 0.0);
    this.radii = new Vector3(x, y, z);
    this.radiiSquared = new Vector3(x * x, y * y, z * z);
    this.radiiToTheFourth = new Vector3(x * x * x * x, y * y * y * y, z * z * z * z);
    this.oneOverRadii = new Vector3(x === 0.0 ? 0.0 : 1.0 / x, y === 0.0 ? 0.0 : 1.0 / y, z === 0.0 ? 0.0 : 1.0 / z);
    this.oneOverRadiiSquared = new Vector3(x === 0.0 ? 0.0 : 1.0 / (x * x), y === 0.0 ? 0.0 : 1.0 / (y * y), z === 0.0 ? 0.0 : 1.0 / (z * z));
    this.minimumRadius = Math.min(x, y, z);
    this.maximumRadius = Math.max(x, y, z);
    this.centerToleranceSquared = _MathUtils.EPSILON1;

    if (this.radiiSquared.z !== 0) {
      this.squaredXOverSquaredZ = this.radiiSquared.x / this.radiiSquared.z;
    }

    Object.freeze(this);
  }

  _createClass(Ellipsoid, [{
    key: "equals",
    value: function equals(right) {
      return this === right || Boolean(right && this.radii.equals(right.radii));
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.radii.toString();
    }
  }, {
    key: "cartographicToCartesian",
    value: function cartographicToCartesian(cartographic) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
      var normal = scratchNormal$3;
      var k = scratchK;

      var _cartographic = _slicedToArray(cartographic, 3),
          height = _cartographic[2];

      this.geodeticSurfaceNormalCartographic(cartographic, normal);
      k.copy(this.radiiSquared).scale(normal);
      var gamma = Math.sqrt(normal.dot(k));
      k.scale(1 / gamma);
      normal.scale(height);
      k.add(normal);
      return k.to(result);
    }
  }, {
    key: "cartesianToCartographic",
    value: function cartesianToCartographic(cartesian) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
      scratchCartesian.from(cartesian);
      var point = this.scaleToGeodeticSurface(scratchCartesian, scratchPosition$2);

      if (!point) {
        return undefined;
      }

      var normal = this.geodeticSurfaceNormal(point, scratchNormal$3);
      var h = scratchHeight;
      h.copy(scratchCartesian).subtract(point);
      var longitude = Math.atan2(normal.y, normal.x);
      var latitude = Math.asin(normal.z);
      var height = Math.sign(dot$2(h, scratchCartesian)) * length$2(h);
      return toCartographicFromRadians([longitude, latitude, height], result);
    }
  }, {
    key: "eastNorthUpToFixedFrame",
    value: function eastNorthUpToFixedFrame(origin) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Matrix4();
      return localFrameToFixedFrame(this, 'east', 'north', 'up', origin, result);
    }
  }, {
    key: "localFrameToFixedFrame",
    value: function localFrameToFixedFrame$1(firstAxis, secondAxis, thirdAxis, origin) {
      var result = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new Matrix4();
      return localFrameToFixedFrame(this, firstAxis, secondAxis, thirdAxis, origin, result);
    }
  }, {
    key: "geocentricSurfaceNormal",
    value: function geocentricSurfaceNormal(cartesian) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
      return scratchVector$6.from(cartesian).normalize().to(result);
    }
  }, {
    key: "geodeticSurfaceNormalCartographic",
    value: function geodeticSurfaceNormalCartographic(cartographic) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
      var cartographicVectorRadians = fromCartographicToRadians(cartographic);
      var longitude = cartographicVectorRadians[0];
      var latitude = cartographicVectorRadians[1];
      var cosLatitude = Math.cos(latitude);
      scratchVector$6.set(cosLatitude * Math.cos(longitude), cosLatitude * Math.sin(longitude), Math.sin(latitude)).normalize();
      return scratchVector$6.to(result);
    }
  }, {
    key: "geodeticSurfaceNormal",
    value: function geodeticSurfaceNormal(cartesian) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
      return scratchVector$6.from(cartesian).scale(this.oneOverRadiiSquared).normalize().to(result);
    }
  }, {
    key: "scaleToGeodeticSurface",
    value: function scaleToGeodeticSurface$1(cartesian, result) {
      return scaleToGeodeticSurface(cartesian, this, result);
    }
  }, {
    key: "scaleToGeocentricSurface",
    value: function scaleToGeocentricSurface(cartesian) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
      scratchPosition$2.from(cartesian);
      var positionX = scratchPosition$2.x;
      var positionY = scratchPosition$2.y;
      var positionZ = scratchPosition$2.z;
      var oneOverRadiiSquared = this.oneOverRadiiSquared;
      var beta = 1.0 / Math.sqrt(positionX * positionX * oneOverRadiiSquared.x + positionY * positionY * oneOverRadiiSquared.y + positionZ * positionZ * oneOverRadiiSquared.z);
      return scratchPosition$2.multiplyScalar(beta).to(result);
    }
  }, {
    key: "transformPositionToScaledSpace",
    value: function transformPositionToScaledSpace(position) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
      return scratchPosition$2.from(position).scale(this.oneOverRadii).to(result);
    }
  }, {
    key: "transformPositionFromScaledSpace",
    value: function transformPositionFromScaledSpace(position) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
      return scratchPosition$2.from(position).scale(this.radii).to(result);
    }
  }, {
    key: "getSurfaceNormalIntersectionWithZAxis",
    value: function getSurfaceNormalIntersectionWithZAxis(position) {
      var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
      var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 0];
      assert$5(equals(this.radii.x, this.radii.y, _MathUtils.EPSILON15));
      assert$5(this.radii.z > 0);
      scratchPosition$2.from(position);
      var z = scratchPosition$2.z * (1 - this.squaredXOverSquaredZ);

      if (Math.abs(z) >= this.radii.z - buffer) {
        return undefined;
      }

      return scratchPosition$2.set(0.0, 0.0, z).to(result);
    }
  }]);

  return Ellipsoid;
}();

class DoublyLinkedListNode {
  constructor(item, previous, next) {
    this.item = item;
    this.previous = previous;
    this.next = next;
  }

}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this._length = 0;
  }

  get length() {
    return this._length;
  }

  add(item) {
    const node = new DoublyLinkedListNode(item, this.tail, null);

    if (this.tail) {
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }

    ++this._length;
    return node;
  }

  remove(node) {
    if (!node) {
      return;
    }

    if (node.previous && node.next) {
      node.previous.next = node.next;
      node.next.previous = node.previous;
    } else if (node.previous) {
      node.previous.next = null;
      this.tail = node.previous;
    } else if (node.next) {
      node.next.previous = null;
      this.head = node.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    node.next = null;
    node.previous = null;
    --this._length;
  }

  splice(node, nextNode) {
    if (node === nextNode) {
      return;
    }

    this.remove(nextNode);

    this._insert(node, nextNode);
  }

  _insert(node, nextNode) {
    const oldNodeNext = node.next;
    node.next = nextNode;

    if (this.tail === node) {
      this.tail = nextNode;
    } else {
      oldNodeNext.previous = nextNode;
    }

    nextNode.next = oldNodeNext;
    nextNode.previous = node;
    ++this._length;
  }

}

function defined$5(x) {
  return x !== undefined && x !== null;
}

class TilesetCache {
  constructor() {
    _defineProperty(this, "_list", void 0);

    _defineProperty(this, "_sentinel", void 0);

    _defineProperty(this, "_trimTiles", void 0);

    this._list = new DoublyLinkedList();
    this._sentinel = this._list.add('sentinel');
    this._trimTiles = false;
  }

  reset() {
    this._list.splice(this._list.tail, this._sentinel);
  }

  touch(tile) {
    const node = tile._cacheNode;

    if (defined$5(node)) {
      this._list.splice(this._sentinel, node);
    }
  }

  add(tileset, tile, addCallback) {
    if (!defined$5(tile._cacheNode)) {
      tile._cacheNode = this._list.add(tile);

      if (addCallback) {
        addCallback(tileset, tile);
      }
    }
  }

  unloadTile(tileset, tile, unloadCallback) {
    const node = tile._cacheNode;

    if (!defined$5(node)) {
      return;
    }

    this._list.remove(node);

    tile._cacheNode = undefined;

    if (unloadCallback) {
      unloadCallback(tileset, tile);
    }
  }

  unloadTiles(tileset, unloadCallback) {
    const trimTiles = this._trimTiles;
    this._trimTiles = false;
    const list = this._list;
    const maximumMemoryUsageInBytes = tileset.maximumMemoryUsage * 1024 * 1024;
    const sentinel = this._sentinel;
    let node = list.head;

    while (node !== sentinel && (tileset.gpuMemoryUsageInBytes > maximumMemoryUsageInBytes || trimTiles)) {
      const tile = node.item;
      node = node.next;
      this.unloadTile(tileset, tile, unloadCallback);
    }
  }

  trim() {
    this._trimTiles = true;
  }

}

function calculateTransformProps(tileHeader, tile) {
  assert$7(tileHeader);
  assert$7(tile);
  const {
    rtcCenter,
    gltfUpAxis
  } = tile;
  const {
    computedTransform,
    boundingVolume: {
      center
    }
  } = tileHeader;
  let modelMatrix = new Matrix4(computedTransform);

  if (rtcCenter) {
    modelMatrix.translate(rtcCenter);
  }

  switch (gltfUpAxis) {
    case 'Z':
      break;

    case 'Y':
      const rotationY = new Matrix4().rotateX(Math.PI / 2);
      modelMatrix = modelMatrix.multiplyRight(rotationY);
      break;

    case 'X':
      const rotationX = new Matrix4().rotateY(-Math.PI / 2);
      modelMatrix = modelMatrix.multiplyRight(rotationX);
      break;
  }

  if (tile.isQuantized) {
    modelMatrix.translate(tile.quantizedVolumeOffset).scale(tile.quantizedVolumeScale);
  }

  const cartesianOrigin = new Vector3(center);
  tile.cartesianModelMatrix = modelMatrix;
  tile.cartesianOrigin = cartesianOrigin;
  const cartographicOrigin = Ellipsoid.WGS84.cartesianToCartographic(cartesianOrigin, new Vector3());
  const fromFixedFrameMatrix = Ellipsoid.WGS84.eastNorthUpToFixedFrame(cartesianOrigin);
  const toFixedFrameMatrix = fromFixedFrameMatrix.invert();
  tile.cartographicModelMatrix = toFixedFrameMatrix.multiplyRight(modelMatrix);
  tile.cartographicOrigin = cartographicOrigin;
  tile.modelMatrix = tile.cartographicModelMatrix;
}

var INTERSECTION = Object.freeze({
  OUTSIDE: -1,
  INTERSECTING: 0,
  INSIDE: 1
});

var scratchVector$5 = new Vector3();
var scratchNormal$2 = new Vector3();

(function () {
  function AxisAlignedBoundingBox() {
    var minimum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0];
    var maximum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    var center = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, AxisAlignedBoundingBox);

    center = center || scratchVector$5.copy(minimum).add(maximum).scale(0.5);
    this.center = new Vector3(center);
    this.halfDiagonal = new Vector3(maximum).subtract(this.center);
    this.minimum = new Vector3(minimum);
    this.maximum = new Vector3(maximum);
  }

  _createClass(AxisAlignedBoundingBox, [{
    key: "clone",
    value: function clone() {
      return new AxisAlignedBoundingBox(this.minimum, this.maximum, this.center);
    }
  }, {
    key: "equals",
    value: function equals(right) {
      return this === right || Boolean(right) && this.minimum.equals(right.minimum) && this.maximum.equals(right.maximum);
    }
  }, {
    key: "intersectPlane",
    value: function intersectPlane(plane) {
      var halfDiagonal = this.halfDiagonal;
      var normal = scratchNormal$2.from(plane.normal);
      var e = halfDiagonal.x * Math.abs(normal.x) + halfDiagonal.y * Math.abs(normal.y) + halfDiagonal.z * Math.abs(normal.z);
      var s = this.center.dot(normal) + plane.distance;

      if (s - e > 0) {
        return INTERSECTION.INSIDE;
      }

      if (s + e < 0) {
        return INTERSECTION.OUTSIDE;
      }

      return INTERSECTION.INTERSECTING;
    }
  }, {
    key: "distanceTo",
    value: function distanceTo(point) {
      return Math.sqrt(this.distanceSquaredTo(point));
    }
  }, {
    key: "distanceSquaredTo",
    value: function distanceSquaredTo(point) {
      var offset = scratchVector$5.from(point).subtract(this.center);
      var halfDiagonal = this.halfDiagonal;
      var distanceSquared = 0.0;
      var d;
      d = Math.abs(offset.x) - halfDiagonal.x;

      if (d > 0) {
        distanceSquared += d * d;
      }

      d = Math.abs(offset.y) - halfDiagonal.y;

      if (d > 0) {
        distanceSquared += d * d;
      }

      d = Math.abs(offset.z) - halfDiagonal.z;

      if (d > 0) {
        distanceSquared += d * d;
      }

      return distanceSquared;
    }
  }]);

  return AxisAlignedBoundingBox;
})();

var scratchVector$4 = new Vector3();
var scratchVector2 = new Vector3();

var BoundingSphere = function () {
  function BoundingSphere() {
    var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0];
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;

    _classCallCheck(this, BoundingSphere);

    this.radius = -0;
    this.center = new Vector3();
    this.fromCenterRadius(center, radius);
  }

  _createClass(BoundingSphere, [{
    key: "fromCenterRadius",
    value: function fromCenterRadius(center, radius) {
      this.center.from(center);
      this.radius = radius;
      return this;
    }
  }, {
    key: "fromCornerPoints",
    value: function fromCornerPoints(corner, oppositeCorner) {
      oppositeCorner = scratchVector$4.from(oppositeCorner);
      this.center = new Vector3().from(corner).add(oppositeCorner).scale(0.5);
      this.radius = this.center.distance(oppositeCorner);
      return this;
    }
  }, {
    key: "equals",
    value: function equals(right) {
      return this === right || Boolean(right) && this.center.equals(right.center) && this.radius === right.radius;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new BoundingSphere(this.center, this.radius);
    }
  }, {
    key: "union",
    value: function union(boundingSphere) {
      var leftCenter = this.center;
      var leftRadius = this.radius;
      var rightCenter = boundingSphere.center;
      var rightRadius = boundingSphere.radius;
      var toRightCenter = scratchVector$4.copy(rightCenter).subtract(leftCenter);
      var centerSeparation = toRightCenter.magnitude();

      if (leftRadius >= centerSeparation + rightRadius) {
        return this.clone();
      }

      if (rightRadius >= centerSeparation + leftRadius) {
        return boundingSphere.clone();
      }

      var halfDistanceBetweenTangentPoints = (leftRadius + centerSeparation + rightRadius) * 0.5;
      scratchVector2.copy(toRightCenter).scale((-leftRadius + halfDistanceBetweenTangentPoints) / centerSeparation).add(leftCenter);
      this.center.copy(scratchVector2);
      this.radius = halfDistanceBetweenTangentPoints;
      return this;
    }
  }, {
    key: "expand",
    value: function expand(point) {
      point = scratchVector$4.from(point);
      var radius = point.subtract(this.center).magnitude();

      if (radius > this.radius) {
        this.radius = radius;
      }

      return this;
    }
  }, {
    key: "intersectPlane",
    value: function intersectPlane(plane) {
      var center = this.center;
      var radius = this.radius;
      var normal = plane.normal;
      var distanceToPlane = normal.dot(center) + plane.distance;

      if (distanceToPlane < -radius) {
        return INTERSECTION.OUTSIDE;
      }

      if (distanceToPlane < radius) {
        return INTERSECTION.INTERSECTING;
      }

      return INTERSECTION.INSIDE;
    }
  }, {
    key: "transform",
    value: function transform(_transform) {
      this.center.transform(_transform);
      var scale = getScaling(scratchVector$4, _transform);
      this.radius = Math.max(scale[0], Math.max(scale[1], scale[2])) * this.radius;
      return this;
    }
  }, {
    key: "distanceSquaredTo",
    value: function distanceSquaredTo(point) {
      point = scratchVector$4.from(point);
      var delta = point.subtract(this.center);
      return delta.lengthSquared() - this.radius * this.radius;
    }
  }, {
    key: "distanceTo",
    value: function distanceTo(point) {
      return Math.sqrt(this.distanceSquaredTo(point));
    }
  }]);

  return BoundingSphere;
}();

var scratchVector$3 = new Vector3();
var scratchOffset = new Vector3();
var scratchVectorU = new Vector3();
var scratchVectorV = new Vector3();
var scratchVectorW = new Vector3();
var scratchCorner = new Vector3();
var scratchToCenter = new Vector3();
var fromOrientedBoundingBoxScratchU = new Vector3();
var fromOrientedBoundingBoxScratchV = new Vector3();
var fromOrientedBoundingBoxScratchW = new Vector3();
var MATRIX3 = {
  COLUMN0ROW0: 0,
  COLUMN0ROW1: 1,
  COLUMN0ROW2: 2,
  COLUMN1ROW0: 3,
  COLUMN1ROW1: 4,
  COLUMN1ROW2: 5,
  COLUMN2ROW0: 6,
  COLUMN2ROW1: 7,
  COLUMN2ROW2: 8
};

var OrientedBoundingBox = function () {
  function OrientedBoundingBox() {
    var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0];
    var halfAxes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0, 0, 0, 0, 0, 0, 0];

    _classCallCheck(this, OrientedBoundingBox);

    this.center = new Vector3().from(center);
    this.halfAxes = new Matrix3(halfAxes);
  }

  _createClass(OrientedBoundingBox, [{
    key: "fromCenterHalfSizeQuaternion",
    value: function fromCenterHalfSizeQuaternion(center, halfSize, quaternion) {
      var quaternionObject = new Quaternion(quaternion);
      var directionsMatrix = new Matrix3().fromQuaternion(quaternionObject);
      directionsMatrix[0] = directionsMatrix[0] * halfSize[0];
      directionsMatrix[1] = directionsMatrix[1] * halfSize[0];
      directionsMatrix[2] = directionsMatrix[2] * halfSize[0];
      directionsMatrix[3] = directionsMatrix[3] * halfSize[1];
      directionsMatrix[4] = directionsMatrix[4] * halfSize[1];
      directionsMatrix[5] = directionsMatrix[5] * halfSize[1];
      directionsMatrix[6] = directionsMatrix[6] * halfSize[2];
      directionsMatrix[7] = directionsMatrix[7] * halfSize[2];
      directionsMatrix[8] = directionsMatrix[8] * halfSize[2];
      this.center = new Vector3().from(center);
      this.halfAxes = directionsMatrix;
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new OrientedBoundingBox(this.center, this.halfAxes);
    }
  }, {
    key: "equals",
    value: function equals(right) {
      return this === right || Boolean(right) && this.center.equals(right.center) && this.halfAxes.equals(right.halfAxes);
    }
  }, {
    key: "getBoundingSphere",
    value: function getBoundingSphere() {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new BoundingSphere();
      var halfAxes = this.halfAxes;
      var u = halfAxes.getColumn(0, fromOrientedBoundingBoxScratchU);
      var v = halfAxes.getColumn(1, fromOrientedBoundingBoxScratchV);
      var w = halfAxes.getColumn(2, fromOrientedBoundingBoxScratchW);
      var cornerVector = scratchVector$3.copy(u).add(v).add(w);
      result.center.copy(this.center);
      result.radius = cornerVector.magnitude();
      return result;
    }
  }, {
    key: "intersectPlane",
    value: function intersectPlane(plane) {
      var center = this.center;
      var normal = plane.normal;
      var halfAxes = this.halfAxes;
      var normalX = normal.x;
      var normalY = normal.y;
      var normalZ = normal.z;
      var radEffective = Math.abs(normalX * halfAxes[MATRIX3.COLUMN0ROW0] + normalY * halfAxes[MATRIX3.COLUMN0ROW1] + normalZ * halfAxes[MATRIX3.COLUMN0ROW2]) + Math.abs(normalX * halfAxes[MATRIX3.COLUMN1ROW0] + normalY * halfAxes[MATRIX3.COLUMN1ROW1] + normalZ * halfAxes[MATRIX3.COLUMN1ROW2]) + Math.abs(normalX * halfAxes[MATRIX3.COLUMN2ROW0] + normalY * halfAxes[MATRIX3.COLUMN2ROW1] + normalZ * halfAxes[MATRIX3.COLUMN2ROW2]);
      var distanceToPlane = normal.dot(center) + plane.distance;

      if (distanceToPlane <= -radEffective) {
        return INTERSECTION.OUTSIDE;
      } else if (distanceToPlane >= radEffective) {
        return INTERSECTION.INSIDE;
      }

      return INTERSECTION.INTERSECTING;
    }
  }, {
    key: "distanceTo",
    value: function distanceTo(point) {
      return Math.sqrt(this.distanceSquaredTo(point));
    }
  }, {
    key: "distanceSquaredTo",
    value: function distanceSquaredTo(point) {
      var offset = scratchOffset.from(point).subtract(this.center);
      var halfAxes = this.halfAxes;
      var u = halfAxes.getColumn(0, scratchVectorU);
      var v = halfAxes.getColumn(1, scratchVectorV);
      var w = halfAxes.getColumn(2, scratchVectorW);
      var uHalf = u.magnitude();
      var vHalf = v.magnitude();
      var wHalf = w.magnitude();
      u.normalize();
      v.normalize();
      w.normalize();
      var distanceSquared = 0.0;
      var d;
      d = Math.abs(offset.dot(u)) - uHalf;

      if (d > 0) {
        distanceSquared += d * d;
      }

      d = Math.abs(offset.dot(v)) - vHalf;

      if (d > 0) {
        distanceSquared += d * d;
      }

      d = Math.abs(offset.dot(w)) - wHalf;

      if (d > 0) {
        distanceSquared += d * d;
      }

      return distanceSquared;
    }
  }, {
    key: "computePlaneDistances",
    value: function computePlaneDistances(position, direction) {
      var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [-0, -0];
      var minDist = Number.POSITIVE_INFINITY;
      var maxDist = Number.NEGATIVE_INFINITY;
      var center = this.center;
      var halfAxes = this.halfAxes;
      var u = halfAxes.getColumn(0, scratchVectorU);
      var v = halfAxes.getColumn(1, scratchVectorV);
      var w = halfAxes.getColumn(2, scratchVectorW);
      var corner = scratchCorner.copy(u).add(v).add(w).add(center);
      var toCenter = scratchToCenter.copy(corner).subtract(position);
      var mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      corner.copy(center).add(u).add(v).subtract(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      corner.copy(center).add(u).subtract(v).add(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      corner.copy(center).add(u).subtract(v).subtract(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      center.copy(corner).subtract(u).add(v).add(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      center.copy(corner).subtract(u).add(v).subtract(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      center.copy(corner).subtract(u).subtract(v).add(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      center.copy(corner).subtract(u).subtract(v).subtract(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      result[0] = minDist;
      result[1] = maxDist;
      return result;
    }
  }, {
    key: "getTransform",
    value: function getTransform() {}
  }, {
    key: "halfSize",
    get: function get() {
      var xAxis = this.halfAxes.getColumn(0);
      var yAxis = this.halfAxes.getColumn(1);
      var zAxis = this.halfAxes.getColumn(2);
      return [new Vector3(xAxis).len(), new Vector3(yAxis).len(), new Vector3(zAxis).len()];
    }
  }, {
    key: "quaternion",
    get: function get() {
      var xAxis = this.halfAxes.getColumn(0);
      var yAxis = this.halfAxes.getColumn(1);
      var zAxis = this.halfAxes.getColumn(2);
      var normXAxis = new Vector3(xAxis).normalize();
      var normYAxis = new Vector3(yAxis).normalize();
      var normZAxis = new Vector3(zAxis).normalize();
      return new Quaternion().fromMatrix3(new Matrix3([].concat(_toConsumableArray(normXAxis), _toConsumableArray(normYAxis), _toConsumableArray(normZAxis))));
    }
  }]);

  return OrientedBoundingBox;
}();

var scratchPosition$1 = new Vector3();
var scratchNormal$1 = new Vector3();

var Plane = function () {
  function Plane() {
    var normal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 1];
    var distance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Plane);

    this.normal = new Vector3();
    this.distance = -0;
    this.fromNormalDistance(normal, distance);
  }

  _createClass(Plane, [{
    key: "fromNormalDistance",
    value: function fromNormalDistance(normal, distance) {
      assert$5(Number.isFinite(distance));
      this.normal.from(normal).normalize();
      this.distance = distance;
      return this;
    }
  }, {
    key: "fromPointNormal",
    value: function fromPointNormal(point, normal) {
      point = scratchPosition$1.from(point);
      this.normal.from(normal).normalize();
      var distance = -this.normal.dot(point);
      this.distance = distance;
      return this;
    }
  }, {
    key: "fromCoefficients",
    value: function fromCoefficients(a, b, c, d) {
      this.normal.set(a, b, c);
      assert$5(equals(this.normal.len(), 1));
      this.distance = d;
      return this;
    }
  }, {
    key: "clone",
    value: function clone(plane) {
      return new Plane(this.normal, this.distance);
    }
  }, {
    key: "equals",
    value: function equals$1(right) {
      return equals(this.distance, right.distance) && equals(this.normal, right.normal);
    }
  }, {
    key: "getPointDistance",
    value: function getPointDistance(point) {
      return this.normal.dot(point) + this.distance;
    }
  }, {
    key: "transform",
    value: function transform(matrix4) {
      var normal = scratchNormal$1.copy(this.normal).transformAsVector(matrix4).normalize();
      var point = this.normal.scale(-this.distance).transform(matrix4);
      return this.fromPointNormal(point, normal);
    }
  }, {
    key: "projectPointOntoPlane",
    value: function projectPointOntoPlane(point) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
      point = scratchPosition$1.from(point);
      var pointDistance = this.getPointDistance(point);
      var scaledNormal = scratchNormal$1.copy(this.normal).scale(pointDistance);
      return point.subtract(scaledNormal).to(result);
    }
  }]);

  return Plane;
}();

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var faces = [new Vector3([1, 0, 0]), new Vector3([0, 1, 0]), new Vector3([0, 0, 1])];
var scratchPlaneCenter = new Vector3();
var scratchPlaneNormal$1 = new Vector3();
new Plane(new Vector3(1.0, 0.0, 0.0), 0.0);

var CullingVolume = function () {
  _createClass(CullingVolume, null, [{
    key: "MASK_OUTSIDE",
    get: function get() {
      return 0xffffffff;
    }
  }, {
    key: "MASK_INSIDE",
    get: function get() {
      return 0x00000000;
    }
  }, {
    key: "MASK_INDETERMINATE",
    get: function get() {
      return 0x7fffffff;
    }
  }]);

  function CullingVolume() {
    var planes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, CullingVolume);

    this.planes = planes;
    assert$5(this.planes.every(function (plane) {
      return plane instanceof Plane;
    }));
  }

  _createClass(CullingVolume, [{
    key: "fromBoundingSphere",
    value: function fromBoundingSphere(boundingSphere) {
      this.planes.length = 2 * faces.length;
      var center = boundingSphere.center;
      var radius = boundingSphere.radius;
      var planeIndex = 0;

      var _iterator = _createForOfIteratorHelper(faces),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var faceNormal = _step.value;
          var plane0 = this.planes[planeIndex];
          var plane1 = this.planes[planeIndex + 1];

          if (!plane0) {
            plane0 = this.planes[planeIndex] = new Plane();
          }

          if (!plane1) {
            plane1 = this.planes[planeIndex + 1] = new Plane();
          }

          var plane0Center = scratchPlaneCenter.copy(faceNormal).scale(-radius).add(center);
          var plane0Distance = -faceNormal.dot(plane0Center);
          plane0.fromPointNormal(plane0Center, faceNormal);
          var plane1Center = scratchPlaneCenter.copy(faceNormal).scale(radius).add(center);
          var negatedFaceNormal = scratchPlaneNormal$1.copy(faceNormal).negate();
          var plane1Distance = -negatedFaceNormal.dot(plane1Center);
          plane1.fromPointNormal(plane1Center, negatedFaceNormal);
          planeIndex += 2;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return this;
    }
  }, {
    key: "computeVisibility",
    value: function computeVisibility(boundingVolume) {
      assert$5(boundingVolume);
      var intersect = INTERSECTION.INSIDE;

      var _iterator2 = _createForOfIteratorHelper(this.planes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var plane = _step2.value;
          var result = boundingVolume.intersectPlane(plane);

          switch (result) {
            case INTERSECTION.OUTSIDE:
              return INTERSECTION.OUTSIDE;

            case INTERSECTION.INTERSECTING:
              intersect = INTERSECTION.INTERSECTING;
              break;

            default:
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return intersect;
    }
  }, {
    key: "computeVisibilityWithPlaneMask",
    value: function computeVisibilityWithPlaneMask(boundingVolume, parentPlaneMask) {
      assert$5(boundingVolume, 'boundingVolume is required.');
      assert$5(Number.isFinite(parentPlaneMask), 'parentPlaneMask is required.');

      if (parentPlaneMask === CullingVolume.MASK_OUTSIDE || parentPlaneMask === CullingVolume.MASK_INSIDE) {
        return parentPlaneMask;
      }

      var mask = CullingVolume.MASK_INSIDE;
      var planes = this.planes;

      for (var k = 0; k < this.planes.length; ++k) {
        var flag = k < 31 ? 1 << k : 0;

        if (k < 31 && (parentPlaneMask & flag) === 0) {
          continue;
        }

        var plane = planes[k];
        var result = boundingVolume.intersectPlane(plane);

        if (result === INTERSECTION.OUTSIDE) {
          return CullingVolume.MASK_OUTSIDE;
        } else if (result === INTERSECTION.INTERSECTING) {
          mask |= flag;
        }
      }

      return mask;
    }
  }]);

  return CullingVolume;
}();

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var scratchPlaneUpVector = new Vector3();
var scratchPlaneRightVector = new Vector3();
var scratchPlaneNearCenter = new Vector3();
var scratchPlaneFarCenter = new Vector3();
var scratchPlaneNormal = new Vector3();

var PerspectiveOffCenterFrustum = function () {
  function PerspectiveOffCenterFrustum() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PerspectiveOffCenterFrustum);

    options = _objectSpread$1({
      near: 1.0,
      far: 500000000.0
    }, options);
    this.left = options.left;
    this._left = undefined;
    this.right = options.right;
    this._right = undefined;
    this.top = options.top;
    this._top = undefined;
    this.bottom = options.bottom;
    this._bottom = undefined;
    this.near = options.near;
    this._near = this.near;
    this.far = options.far;
    this._far = this.far;
    this._cullingVolume = new CullingVolume([new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()]);
    this._perspectiveMatrix = new Matrix4();
    this._infinitePerspective = new Matrix4();
  }

  _createClass(PerspectiveOffCenterFrustum, [{
    key: "clone",
    value: function clone() {
      return new PerspectiveOffCenterFrustum({
        right: this.right,
        left: this.left,
        top: this.top,
        bottom: this.bottom,
        near: this.near,
        far: this.far
      });
    }
  }, {
    key: "equals",
    value: function equals(other) {
      return other && other instanceof PerspectiveOffCenterFrustum && this.right === other.right && this.left === other.left && this.top === other.top && this.bottom === other.bottom && this.near === other.near && this.far === other.far;
    }
  }, {
    key: "computeCullingVolume",
    value: function computeCullingVolume(position, direction, up) {
      assert$5(position, 'position is required.');
      assert$5(direction, 'direction is required.');
      assert$5(up, 'up is required.');
      var planes = this._cullingVolume.planes;
      up = scratchPlaneUpVector.copy(up).normalize();
      var right = scratchPlaneRightVector.copy(direction).cross(up).normalize();
      var nearCenter = scratchPlaneNearCenter.copy(direction).multiplyByScalar(this.near).add(position);
      var farCenter = scratchPlaneFarCenter.copy(direction).multiplyByScalar(this.far).add(position);
      var normal = scratchPlaneNormal;
      normal.copy(right).multiplyByScalar(this.left).add(nearCenter).subtract(position).cross(up);
      planes[0].fromPointNormal(position, normal);
      normal.copy(right).multiplyByScalar(this.right).add(nearCenter).subtract(position).cross(up).negate();
      planes[1].fromPointNormal(position, normal);
      normal.copy(up).multiplyByScalar(this.bottom).add(nearCenter).subtract(position).cross(right).negate();
      planes[2].fromPointNormal(position, normal);
      normal.copy(up).multiplyByScalar(this.top).add(nearCenter).subtract(position).cross(right);
      planes[3].fromPointNormal(position, normal);
      normal = new Vector3().copy(direction);
      planes[4].fromPointNormal(nearCenter, normal);
      normal.negate();
      planes[5].fromPointNormal(farCenter, normal);
      return this._cullingVolume;
    }
  }, {
    key: "getPixelDimensions",
    value: function getPixelDimensions(drawingBufferWidth, drawingBufferHeight, distance, result) {
      update$1(this);
      assert$5(Number.isFinite(drawingBufferWidth) && Number.isFinite(drawingBufferHeight));
      assert$5(drawingBufferWidth > 0);
      assert$5(drawingBufferHeight > 0);
      assert$5(distance > 0);
      assert$5(result);
      var inverseNear = 1.0 / this.near;
      var tanTheta = this.top * inverseNear;
      var pixelHeight = 2.0 * distance * tanTheta / drawingBufferHeight;
      tanTheta = this.right * inverseNear;
      var pixelWidth = 2.0 * distance * tanTheta / drawingBufferWidth;
      result.x = pixelWidth;
      result.y = pixelHeight;
      return result;
    }
  }, {
    key: "projectionMatrix",
    get: function get() {
      update$1(this);
      return this._perspectiveMatrix;
    }
  }, {
    key: "infiniteProjectionMatrix",
    get: function get() {
      update$1(this);
      return this._infinitePerspective;
    }
  }]);

  return PerspectiveOffCenterFrustum;
}();

function update$1(frustum) {
  assert$5(Number.isFinite(frustum.right) && Number.isFinite(frustum.left) && Number.isFinite(frustum.top) && Number.isFinite(frustum.bottom) && Number.isFinite(frustum.near) && Number.isFinite(frustum.far));
  var top = frustum.top,
      bottom = frustum.bottom,
      right = frustum.right,
      left = frustum.left,
      near = frustum.near,
      far = frustum.far;

  if (top !== frustum._top || bottom !== frustum._bottom || left !== frustum._left || right !== frustum._right || near !== frustum._near || far !== frustum._far) {
    assert$5(frustum.near > 0 && frustum.near < frustum.far, 'near must be greater than zero and less than far.');
    frustum._left = left;
    frustum._right = right;
    frustum._top = top;
    frustum._bottom = bottom;
    frustum._near = near;
    frustum._far = far;
    frustum._perspectiveMatrix = new Matrix4().frustum({
      left: left,
      right: right,
      bottom: bottom,
      top: top,
      near: near,
      far: far
    });
    frustum._infinitePerspective = new Matrix4().frustum({
      left: left,
      right: right,
      bottom: bottom,
      top: top,
      near: near,
      far: Infinity
    });
  }
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defined$4 = function defined(val) {
  return val !== null && typeof val !== 'undefined';
};

var PerspectiveFrustum = function () {
  function PerspectiveFrustum() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PerspectiveFrustum);

    options = _objectSpread({
      near: 1.0,
      far: 500000000.0,
      xOffset: 0.0,
      yOffset: 0.0
    }, options);
    this._offCenterFrustum = new PerspectiveOffCenterFrustum();
    this.fov = options.fov;
    this._fov = undefined;
    this._fovy = undefined;
    this._sseDenominator = undefined;
    this.aspectRatio = options.aspectRatio;
    this._aspectRatio = undefined;
    this.near = options.near;
    this._near = this.near;
    this.far = options.far;
    this._far = this.far;
    this.xOffset = options.xOffset;
    this._xOffset = this.xOffset;
    this.yOffset = options.yOffset;
    this._yOffset = this.yOffset;
  }

  _createClass(PerspectiveFrustum, [{
    key: "clone",
    value: function clone() {
      return new PerspectiveFrustum({
        aspectRatio: this.aspectRatio,
        fov: this.fov,
        near: this.near,
        far: this.far
      });
    }
  }, {
    key: "equals",
    value: function equals(other) {
      if (!defined$4(other) || !(other instanceof PerspectiveFrustum)) {
        return false;
      }

      update(this);
      update(other);
      return this.fov === other.fov && this.aspectRatio === other.aspectRatio && this.near === other.near && this.far === other.far && this._offCenterFrustum.equals(other._offCenterFrustum);
    }
  }, {
    key: "computeCullingVolume",
    value: function computeCullingVolume(position, direction, up) {
      update(this);
      return this._offCenterFrustum.computeCullingVolume(position, direction, up);
    }
  }, {
    key: "getPixelDimensions",
    value: function getPixelDimensions(drawingBufferWidth, drawingBufferHeight, distance, result) {
      update(this);
      return this._offCenterFrustum.getPixelDimensions(drawingBufferWidth, drawingBufferHeight, distance, result);
    }
  }, {
    key: "projectionMatrix",
    get: function get() {
      update(this);
      return this._offCenterFrustum.projectionMatrix;
    }
  }, {
    key: "infiniteProjectionMatrix",
    get: function get() {
      update(this);
      return this._offCenterFrustum.infiniteProjectionMatrix;
    }
  }, {
    key: "fovy",
    get: function get() {
      update(this);
      return this._fovy;
    }
  }, {
    key: "sseDenominator",
    get: function get() {
      update(this);
      return this._sseDenominator;
    }
  }]);

  return PerspectiveFrustum;
}();

function update(frustum) {
  assert$5(Number.isFinite(frustum.fov) && Number.isFinite(frustum.aspectRatio) && Number.isFinite(frustum.near) && Number.isFinite(frustum.far));
  var f = frustum._offCenterFrustum;

  if (frustum.fov !== frustum._fov || frustum.aspectRatio !== frustum._aspectRatio || frustum.near !== frustum._near || frustum.far !== frustum._far || frustum.xOffset !== frustum._xOffset || frustum.yOffset !== frustum._yOffset) {
    assert$5(frustum.fov >= 0 && frustum.fov < Math.PI);
    assert$5(frustum.aspectRatio > 0);
    assert$5(frustum.near >= 0 && frustum.near < frustum.far);
    frustum._aspectRatio = frustum.aspectRatio;
    frustum._fov = frustum.fov;
    frustum._fovy = frustum.aspectRatio <= 1 ? frustum.fov : Math.atan(Math.tan(frustum.fov * 0.5) / frustum.aspectRatio) * 2.0;
    frustum._near = frustum.near;
    frustum._far = frustum.far;
    frustum._sseDenominator = 2.0 * Math.tan(0.5 * frustum._fovy);
    frustum._xOffset = frustum.xOffset;
    frustum._yOffset = frustum.yOffset;
    f.top = frustum.near * Math.tan(0.5 * frustum._fovy);
    f.bottom = -f.top;
    f.right = frustum.aspectRatio * f.top;
    f.left = -f.right;
    f.near = frustum.near;
    f.far = frustum.far;
    f.right += frustum.xOffset;
    f.left += frustum.xOffset;
    f.top += frustum.yOffset;
    f.bottom += frustum.yOffset;
  }
}

new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Vector3();

new Matrix3();
new Matrix3();
new Matrix3();
new Matrix3();
new Matrix3();

new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Matrix3();
({
  diagonal: new Matrix3(),
  unitary: new Matrix3()
});

const scratchVector$2 = new Vector3();
const scratchPosition = new Vector3();
const cullingVolume = new CullingVolume([new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()]);
function getFrameState(viewport, frameNumber) {
  const {
    cameraDirection,
    cameraUp,
    height
  } = viewport;
  const {
    metersPerUnit
  } = viewport.distanceScales;
  const viewportCenterCartographic = [viewport.longitude, viewport.latitude, 0];
  const viewportCenterCartesian = Ellipsoid.WGS84.cartographicToCartesian(viewportCenterCartographic, new Vector3());
  const enuToFixedTransform = Ellipsoid.WGS84.eastNorthUpToFixedFrame(viewportCenterCartesian);
  const cameraPositionCartographic = viewport.unprojectPosition(viewport.cameraPosition);
  const cameraPositionCartesian = Ellipsoid.WGS84.cartographicToCartesian(cameraPositionCartographic, new Vector3());
  const cameraDirectionCartesian = new Vector3(enuToFixedTransform.transformAsVector(new Vector3(cameraDirection).scale(metersPerUnit))).normalize();
  const cameraUpCartesian = new Vector3(enuToFixedTransform.transformAsVector(new Vector3(cameraUp).scale(metersPerUnit))).normalize();
  commonSpacePlanesToWGS84(viewport, viewportCenterCartesian);
  return {
    camera: {
      position: cameraPositionCartesian,
      direction: cameraDirectionCartesian,
      up: cameraUpCartesian
    },
    viewport,
    height,
    cullingVolume,
    frameNumber,
    sseDenominator: 1.15
  };
}

function commonSpacePlanesToWGS84(viewport, viewportCenterCartesian) {
  const frustumPlanes = viewport.getFrustumPlanes();
  let i = 0;

  for (const dir in frustumPlanes) {
    const plane = frustumPlanes[dir];
    const distanceToCenter = plane.normal.dot(viewport.center);
    scratchPosition.copy(plane.normal).scale(plane.distance - distanceToCenter).add(viewport.center);
    const cartographicPos = viewport.unprojectPosition(scratchPosition);
    const cartesianPos = Ellipsoid.WGS84.cartographicToCartesian(cartographicPos, new Vector3());
    cullingVolume.planes[i++].fromPointNormal(cartesianPos, scratchVector$2.copy(viewportCenterCartesian).subtract(cartesianPos));
  }
}

const WGS84_RADIUS_X$1 = 6378137.0;
const WGS84_RADIUS_Y = 6378137.0;
const WGS84_RADIUS_Z = 6356752.3142451793;
const scratchVector$1 = new Vector3();
function getZoomFromBoundingVolume(boundingVolume) {
  const {
    halfAxes,
    radius,
    width,
    height
  } = boundingVolume;

  if (halfAxes) {
    const obbSize = getObbSize(halfAxes);
    return Math.log2(WGS84_RADIUS_Z / obbSize);
  } else if (radius) {
    return Math.log2(WGS84_RADIUS_Z / radius);
  } else if (height && width) {
    const zoomX = Math.log2(WGS84_RADIUS_X$1 / width);
    const zoomY = Math.log2(WGS84_RADIUS_Y / height);
    return (zoomX + zoomY) / 2;
  }

  return 1;
}

function getObbSize(halfAxes) {
  halfAxes.getColumn(0, scratchVector$1);
  const axeY = halfAxes.getColumn(1);
  const axeZ = halfAxes.getColumn(2);
  const farthestVertex = scratchVector$1.add(axeY).add(axeZ);
  const size = farthestVertex.len();
  return size;
}

const TILE_CONTENT_STATE = {
  UNLOADED: 0,
  LOADING: 1,
  PROCESSING: 2,
  READY: 3,
  EXPIRED: 4,
  FAILED: 5
};
const TILE_REFINEMENT = {
  ADD: 1,
  REPLACE: 2
};
const TILE_TYPE = {
  EMPTY: 'empty',
  SCENEGRAPH: 'scenegraph',
  POINTCLOUD: 'pointcloud',
  MESH: 'mesh'
};
const TILESET_TYPE = {
  I3S: 'I3S',
  TILES3D: 'TILES3D'
};
const LOD_METRIC_TYPE = {
  GEOMETRIC_ERROR: 'geometricError',
  MAX_SCREEN_THRESHOLD: 'maxScreenThreshold'
};
const TILE3D_OPTIMIZATION_HINT = {
  NOT_COMPUTED: -1,
  USE_OPTIMIZATION: 1,
  SKIP_OPTIMIZATION: 0
};

function defined$3(x) {
  return x !== undefined && x !== null;
}

const scratchScale = new Vector3();
const scratchNorthWest = new Vector3();
const scratchSouthEast = new Vector3();
new Matrix4();
function createBoundingVolume(boundingVolumeHeader, transform, result) {
  assert$7(boundingVolumeHeader, '3D Tile: boundingVolume must be defined');

  if (boundingVolumeHeader.box) {
    return createBox(boundingVolumeHeader.box, transform, result);
  }

  if (boundingVolumeHeader.region) {
    const [west, south, east, north, minHeight, maxHeight] = boundingVolumeHeader.region;
    const northWest = Ellipsoid.WGS84.cartographicToCartesian([degrees(west), degrees(north), minHeight], scratchNorthWest);
    const southEast = Ellipsoid.WGS84.cartographicToCartesian([degrees(east), degrees(south), maxHeight], scratchSouthEast);
    const centerInCartesian = new Vector3().addVectors(northWest, southEast).multiplyScalar(0.5);
    const radius = new Vector3().subVectors(northWest, southEast).len() / 2.0;
    return createSphere([centerInCartesian[0], centerInCartesian[1], centerInCartesian[2], radius], new Matrix4());
  }

  if (boundingVolumeHeader.sphere) {
    return createSphere(boundingVolumeHeader.sphere, transform, result);
  }

  throw new Error('3D Tile: boundingVolume must contain a sphere, region, or box');
}

function createBox(box, transform, result) {
  const center = new Vector3(box[0], box[1], box[2]);
  transform.transform(center, center);
  let origin = [];

  if (box.length === 10) {
    const halfSize = box.slice(3, 6);
    const quaternion = new Quaternion();
    quaternion.fromArray(box, 6);
    const x = new Vector3([1, 0, 0]);
    const y = new Vector3([0, 1, 0]);
    const z = new Vector3([0, 0, 1]);
    x.transformByQuaternion(quaternion);
    x.scale(halfSize[0]);
    y.transformByQuaternion(quaternion);
    y.scale(halfSize[1]);
    z.transformByQuaternion(quaternion);
    z.scale(halfSize[2]);
    origin = [...x.toArray(), ...y.toArray(), ...z.toArray()];
  } else {
    origin = [...box.slice(3, 6), ...box.slice(6, 9), ...box.slice(9, 12)];
  }

  const xAxis = transform.transformAsVector(origin.slice(0, 3));
  const yAxis = transform.transformAsVector(origin.slice(3, 6));
  const zAxis = transform.transformAsVector(origin.slice(6, 9));
  const halfAxes = new Matrix3([xAxis[0], xAxis[1], xAxis[2], yAxis[0], yAxis[1], yAxis[2], zAxis[0], zAxis[1], zAxis[2]]);

  if (defined$3(result)) {
    result.center = center;
    result.halfAxes = halfAxes;
    return result;
  }

  return new OrientedBoundingBox(center, halfAxes);
}

function createSphere(sphere, transform, result) {
  const center = new Vector3(sphere[0], sphere[1], sphere[2]);
  transform.transform(center, center);
  const scale = transform.getScale(scratchScale);
  const uniformScale = Math.max(Math.max(scale[0], scale[1]), scale[2]);
  const radius = sphere[3] * uniformScale;

  if (defined$3(result)) {
    result.center = center;
    result.radius = radius;
    return result;
  }

  return new BoundingSphere(center, radius);
}

new Vector3();
new Vector3();
new Matrix4();
new Vector3();
new Vector3();
new Vector3();
function fog(distanceToCamera, density) {
  const scalar = distanceToCamera * density;
  return 1.0 - Math.exp(-(scalar * scalar));
}
function getDynamicScreenSpaceError(tileset, distanceToCamera) {
  if (tileset.dynamicScreenSpaceError && tileset.dynamicScreenSpaceErrorComputedDensity) {
    const density = tileset.dynamicScreenSpaceErrorComputedDensity;
    const factor = tileset.dynamicScreenSpaceErrorFactor;
    const dynamicError = fog(distanceToCamera, density) * factor;
    return dynamicError;
  }

  return 0;
}
function getTiles3DScreenSpaceError(tile, frameState, useParentLodMetric) {
  const tileset = tile.tileset;
  const parentLodMetricValue = tile.parent && tile.parent.lodMetricValue || tile.lodMetricValue;
  const lodMetricValue = useParentLodMetric ? parentLodMetricValue : tile.lodMetricValue;

  if (lodMetricValue === 0.0) {
    return 0.0;
  }

  const distance = Math.max(tile._distanceToCamera, 1e-7);
  const {
    height,
    sseDenominator
  } = frameState;
  const {
    viewDistanceScale
  } = tileset.options;
  let error = lodMetricValue * height * (viewDistanceScale || 1.0) / (distance * sseDenominator);
  error -= getDynamicScreenSpaceError(tileset, distance);
  return error;
}

const WGS84_RADIUS_X = 6378137.0;
const qualityFactor = Math.PI / 2;
function lodJudge(tile, frameState) {
  const viewport = frameState.viewport;
  const metersPerPixel = viewport.metersPerPixel;
  const mbsLat = tile.header.mbs[1];
  const mbsLon = tile.header.mbs[0];
  const mbsZ = tile.header.mbs[2];
  const mbsR = tile.header.mbs[3];
  const {
    height,
    width,
    latitude,
    longitude
  } = viewport;
  const viewportCenter = [longitude, latitude];
  const mbsCenter = [mbsLon, mbsLat, mbsZ];
  const mbsLatProjected = [longitude, mbsLat];
  const mbsLonProjected = [mbsLon, latitude];
  const diagonalInMeters = Math.sqrt(height * height + width * width) * metersPerPixel[0];
  const distanceInMeters = getDistanceFromLatLon(viewportCenter, mbsCenter);
  const visibleHeight = height * 0.5 + mbsR / WGS84_RADIUS_X;
  const visibleWidth = width * 0.5 + mbsR / WGS84_RADIUS_X;

  if (distanceInMeters > diagonalInMeters + mbsR / WGS84_RADIUS_X) {
    return 'OUT';
  }

  if (getDistanceFromLatLon(viewportCenter, mbsLatProjected) > visibleHeight) {
    return 'OUT';
  }

  if (getDistanceFromLatLon(viewportCenter, mbsLonProjected) > visibleWidth) {
    return 'OUT';
  }

  if (tile.lodMetricValue === 0) {
    return 'DIG';
  }

  let screenSize = getI3ScreenSize(tile, frameState);
  screenSize *= qualityFactor;

  if (screenSize < 0.5) {
    return 'OUT';
  }

  if (!tile.header.children || screenSize <= tile.lodMetricValue) {
    return 'DRAW';
  } else if (tile.header.children) {
    return 'DIG';
  }

  return 'OUT';
}

function projectVertexToSphere([x, y, z]) {
  const azim = toRadians(x);
  const incl = toRadians(y);
  const radius = 1.0 + z / WGS84_RADIUS_X;
  const radCosInc = radius * Math.cos(incl);
  x = radCosInc * Math.cos(azim);
  y = radCosInc * Math.sin(azim);
  z = radius * Math.sin(incl);
  return [x, y, z];
}

function getDistanceFromLatLon(observer, center) {
  const [observerLon, observerLat, observerZ = 0.0] = observer;
  const [centerLon, centerLat, centerZ = 0.0] = center;
  const projectedCenter = projectVertexToSphere([centerLon, centerLat, centerZ]);
  const projectedObserver = projectVertexToSphere([observerLon, observerLat, observerZ]);
  const dx = projectedObserver[0] - projectedCenter[0];
  const dy = projectedObserver[1] - projectedCenter[1];
  const dz = projectedObserver[2] - projectedCenter[2];
  return dx * dx + dy * dy + dz * dz;
}

function getI3ScreenSize(tile, frameState) {
  const viewport = frameState.viewport;
  const mbsLat = tile.header.mbs[1];
  const mbsLon = tile.header.mbs[0];
  const mbsZ = tile.header.mbs[2];
  const mbsR = tile.header.mbs[3];
  const mbsCenter = [mbsLon, mbsLat, mbsZ];
  const cameraPositionCartographic = viewport.unprojectPosition(viewport.cameraPosition);
  const dSquared = getDistanceFromLatLon(cameraPositionCartographic, mbsCenter);
  const mbsRNormalized = mbsR / WGS84_RADIUS_X;
  const d = dSquared - mbsRNormalized * mbsRNormalized;
  const fltMax = 3.4028235e38;

  if (d <= 0.0) {
    return 0.5 * fltMax;
  }

  let screenSizeFactor = calculateScreenSizeFactor(tile, frameState);
  screenSizeFactor *= mbsRNormalized / Math.sqrt(d) / viewport.scale;
  return screenSizeFactor;
}

function calculateScreenSizeFactor(tile, frameState) {
  const {
    width,
    height,
    pixelProjectionMatrix
  } = frameState.viewport;
  const tanOfHalfVFAngle = Math.tan(Math.atan(Math.sqrt(1.0 / (pixelProjectionMatrix[0] * pixelProjectionMatrix[0]) + 1.0 / (pixelProjectionMatrix[5] * pixelProjectionMatrix[5]))));
  const screenCircleFactor = Math.sqrt(height * height + width * width) / tanOfHalfVFAngle;
  return screenCircleFactor;
}

function get3dTilesOptions(tileset) {
  return {
    assetGltfUpAxis: tileset.asset && tileset.asset.gltfUpAxis || 'Y'
  };
}

class ManagedArray {
  constructor(length = 0) {
    this._array = new Array(length);
    this._map = new Map();
    this._length = length;
  }

  get length() {
    return this._length;
  }

  set length(length) {
    this._length = length;

    if (length > this._array.length) {
      this._array.length = length;
    }
  }

  get values() {
    return this._array;
  }

  get(index) {
    assert$7(index < this._array.length);
    return this._array[index];
  }

  set(index, element) {
    assert$7(index >= 0);

    if (index >= this.length) {
      this.length = index + 1;
    }

    if (this._map.has(this._array[index])) {
      this._map.delete(this._array[index]);
    }

    this._array[index] = element;

    this._map.set(element, index);
  }

  delete(element) {
    const index = this._map.get(element);

    if (index >= 0) {
      this._array.splice(index, 1);

      this._map.delete(element);

      this.length--;
    }
  }

  peek() {
    return this._array[this._length - 1];
  }

  push(element) {
    if (!this._map.has(element)) {
      const index = this.length++;
      this._array[index] = element;

      this._map.set(element, index);
    }
  }

  pop() {
    const element = this._array[--this.length];

    this._map.delete(element);

    return element;
  }

  reserve(length) {
    assert$7(length >= 0);

    if (length > this._array.length) {
      this._array.length = length;
    }
  }

  resize(length) {
    assert$7(length >= 0);
    this.length = length;
  }

  trim(length) {
    if (length === null || length === undefined) {
      length = this.length;
    }

    this._array.length = length;
  }

  reset() {
    this._array = [];
    this._map = new Map();
    this._length = 0;
  }

  find(target) {
    return this._map.has(target);
  }

}

const DEFAULT_PROPS$1 = {
  loadSiblings: false,
  skipLevelOfDetail: false,
  maximumScreenSpaceError: 2,
  updateTransforms: true,
  onTraversalEnd: () => {},
  viewportTraversersMap: {},
  basePath: ''
};
class TilesetTraverser {
  constructor(options) {
    _defineProperty(this, "options", void 0);

    _defineProperty(this, "root", void 0);

    _defineProperty(this, "requestedTiles", void 0);

    _defineProperty(this, "selectedTiles", void 0);

    _defineProperty(this, "emptyTiles", void 0);

    _defineProperty(this, "_traversalStack", void 0);

    _defineProperty(this, "_emptyTraversalStack", void 0);

    _defineProperty(this, "_frameNumber", void 0);

    this.options = { ...DEFAULT_PROPS$1,
      ...options
    };
    this._traversalStack = new ManagedArray();
    this._emptyTraversalStack = new ManagedArray();
    this._frameNumber = null;
    this.root = null;
    this.selectedTiles = {};
    this.requestedTiles = {};
    this.emptyTiles = {};
  }

  traverse(root, frameState, options) {
    this.root = root;
    this.options = { ...this.options,
      ...options
    };
    this.reset();
    this.updateTile(root, frameState);
    this._frameNumber = frameState.frameNumber;
    this.executeTraversal(root, frameState);
  }

  reset() {
    this.requestedTiles = {};
    this.selectedTiles = {};
    this.emptyTiles = {};

    this._traversalStack.reset();

    this._emptyTraversalStack.reset();
  }

  executeTraversal(root, frameState) {
    const stack = this._traversalStack;
    root._selectionDepth = 1;
    stack.push(root);

    while (stack.length > 0) {
      const tile = stack.pop();
      let shouldRefine = false;

      if (this.canTraverse(tile, frameState)) {
        this.updateChildTiles(tile, frameState);
        shouldRefine = this.updateAndPushChildren(tile, frameState, stack, tile.hasRenderContent ? tile._selectionDepth + 1 : tile._selectionDepth);
      }

      const parent = tile.parent;
      const parentRefines = Boolean(!parent || parent._shouldRefine);
      const stoppedRefining = !shouldRefine;

      if (!tile.hasRenderContent) {
        this.emptyTiles[tile.id] = tile;
        this.loadTile(tile, frameState);

        if (stoppedRefining) {
          this.selectTile(tile, frameState);
        }
      } else if (tile.refine === TILE_REFINEMENT.ADD) {
        this.loadTile(tile, frameState);
        this.selectTile(tile, frameState);
      } else if (tile.refine === TILE_REFINEMENT.REPLACE) {
        this.loadTile(tile, frameState);

        if (stoppedRefining) {
          this.selectTile(tile, frameState);
        }
      }

      this.touchTile(tile, frameState);
      tile._shouldRefine = shouldRefine && parentRefines;
    }

    this.options.onTraversalEnd(frameState);
  }

  updateChildTiles(tile, frameState) {
    const children = tile.children;

    for (const child of children) {
      this.updateTile(child, frameState);
    }

    return true;
  }

  updateAndPushChildren(tile, frameState, stack, depth) {
    const {
      loadSiblings,
      skipLevelOfDetail
    } = this.options;
    const children = tile.children;
    children.sort(this.compareDistanceToCamera.bind(this));
    const checkRefines = tile.refine === TILE_REFINEMENT.REPLACE && tile.hasRenderContent && !skipLevelOfDetail;
    let hasVisibleChild = false;
    let refines = true;

    for (const child of children) {
      child._selectionDepth = depth;

      if (child.isVisibleAndInRequestVolume) {
        if (stack.find(child)) {
          stack.delete(child);
        }

        stack.push(child);
        hasVisibleChild = true;
      } else if (checkRefines || loadSiblings) {
        this.loadTile(child, frameState);
        this.touchTile(child, frameState);
      }

      if (checkRefines) {
        let childRefines;

        if (!child._inRequestVolume) {
          childRefines = false;
        } else if (!child.hasRenderContent) {
          childRefines = this.executeEmptyTraversal(child, frameState);
        } else {
          childRefines = child.contentAvailable;
        }

        refines = refines && childRefines;

        if (!refines) {
          return false;
        }
      }
    }

    if (!hasVisibleChild) {
      refines = false;
    }

    return refines;
  }

  updateTile(tile, frameState) {
    this.updateTileVisibility(tile, frameState);
  }

  selectTile(tile, frameState) {
    if (this.shouldSelectTile(tile)) {
      tile._selectedFrame = frameState.frameNumber;
      this.selectedTiles[tile.id] = tile;
    }
  }

  loadTile(tile, frameState) {
    if (this.shouldLoadTile(tile)) {
      tile._requestedFrame = frameState.frameNumber;
      tile._priority = tile._getPriority();
      this.requestedTiles[tile.id] = tile;
    }
  }

  touchTile(tile, frameState) {
    tile.tileset._cache.touch(tile);

    tile._touchedFrame = frameState.frameNumber;
  }

  canTraverse(tile, frameState, useParentMetric = false, ignoreVisibility = false) {
    if (!tile.hasChildren) {
      return false;
    }

    if (tile.hasTilesetContent) {
      return !tile.contentExpired;
    }

    if (!ignoreVisibility && !tile.isVisibleAndInRequestVolume) {
      return false;
    }

    return this.shouldRefine(tile, frameState, useParentMetric);
  }

  shouldLoadTile(tile) {
    return tile.hasUnloadedContent || tile.contentExpired;
  }

  shouldSelectTile(tile) {
    return tile.contentAvailable && !this.options.skipLevelOfDetail;
  }

  shouldRefine(tile, frameState, useParentMetric) {
    let screenSpaceError = tile._screenSpaceError;

    if (useParentMetric) {
      screenSpaceError = tile.getScreenSpaceError(frameState, true);
    }

    return screenSpaceError > this.options.maximumScreenSpaceError;
  }

  updateTileVisibility(tile, frameState) {
    const viewportIds = [];

    if (this.options.viewportTraversersMap) {
      for (const key in this.options.viewportTraversersMap) {
        const value = this.options.viewportTraversersMap[key];

        if (value === frameState.viewport.id) {
          viewportIds.push(key);
        }
      }
    } else {
      viewportIds.push(frameState.viewport.id);
    }

    tile.updateVisibility(frameState, viewportIds);
  }

  compareDistanceToCamera(b, a) {
    return b._distanceToCamera - a._distanceToCamera;
  }

  anyChildrenVisible(tile, frameState) {
    let anyVisible = false;

    for (const child of tile.children) {
      child.updateVisibility(frameState);
      anyVisible = anyVisible || child.isVisibleAndInRequestVolume;
    }

    return anyVisible;
  }

  executeEmptyTraversal(root, frameState) {
    let allDescendantsLoaded = true;
    const stack = this._emptyTraversalStack;
    stack.push(root);

    while (stack.length > 0 && allDescendantsLoaded) {
      const tile = stack.pop();
      this.updateTile(tile, frameState);

      if (!tile.isVisibleAndInRequestVolume) {
        this.loadTile(tile, frameState);
      }

      this.touchTile(tile, frameState);
      const traverse = !tile.hasRenderContent && this.canTraverse(tile, frameState, false, true);

      if (traverse) {
        const children = tile.children;

        for (const child of children) {
          if (stack.find(child)) {
            stack.delete(child);
          }

          stack.push(child);
        }
      } else if (!tile.contentAvailable) {
        allDescendantsLoaded = false;
      }
    }

    return allDescendantsLoaded;
  }

}

const scratchVector = new Vector3();

function defined$2(x) {
  return x !== undefined && x !== null;
}

class TileHeader {
  constructor(tileset, header, parentHeader, extendedId = '') {
    _defineProperty(this, "tileset", void 0);

    _defineProperty(this, "header", void 0);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "parent", void 0);

    _defineProperty(this, "refine", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "contentUrl", void 0);

    _defineProperty(this, "lodMetricType", void 0);

    _defineProperty(this, "lodMetricValue", void 0);

    _defineProperty(this, "boundingVolume", void 0);

    _defineProperty(this, "content", void 0);

    _defineProperty(this, "contentState", void 0);

    _defineProperty(this, "gpuMemoryUsageInBytes", void 0);

    _defineProperty(this, "children", void 0);

    _defineProperty(this, "depth", void 0);

    _defineProperty(this, "viewportIds", void 0);

    _defineProperty(this, "transform", void 0);

    _defineProperty(this, "userData", void 0);

    _defineProperty(this, "computedTransform", void 0);

    _defineProperty(this, "hasEmptyContent", void 0);

    _defineProperty(this, "hasTilesetContent", void 0);

    _defineProperty(this, "traverser", void 0);

    _defineProperty(this, "_cacheNode", void 0);

    _defineProperty(this, "_frameNumber", void 0);

    _defineProperty(this, "_lodJudge", void 0);

    _defineProperty(this, "_expireDate", void 0);

    _defineProperty(this, "_expiredContent", void 0);

    _defineProperty(this, "_shouldRefine", void 0);

    _defineProperty(this, "_distanceToCamera", void 0);

    _defineProperty(this, "_centerZDepth", void 0);

    _defineProperty(this, "_screenSpaceError", void 0);

    _defineProperty(this, "_visibilityPlaneMask", void 0);

    _defineProperty(this, "_visible", void 0);

    _defineProperty(this, "_inRequestVolume", void 0);

    _defineProperty(this, "_stackLength", void 0);

    _defineProperty(this, "_selectionDepth", void 0);

    _defineProperty(this, "_touchedFrame", void 0);

    _defineProperty(this, "_visitedFrame", void 0);

    _defineProperty(this, "_selectedFrame", void 0);

    _defineProperty(this, "_requestedFrame", void 0);

    _defineProperty(this, "_priority", void 0);

    _defineProperty(this, "_contentBoundingVolume", void 0);

    _defineProperty(this, "_viewerRequestVolume", void 0);

    _defineProperty(this, "_initialTransform", void 0);

    this.header = header;
    this.tileset = tileset;
    this.id = extendedId || header.id;
    this.url = header.url;
    this.parent = parentHeader;
    this.refine = this._getRefine(header.refine);
    this.type = header.type;
    this.contentUrl = header.contentUrl;
    this.lodMetricType = 'geometricError';
    this.lodMetricValue = 0;
    this.boundingVolume = null;
    this.content = null;
    this.contentState = TILE_CONTENT_STATE.UNLOADED;
    this.gpuMemoryUsageInBytes = 0;
    this.children = [];
    this.hasEmptyContent = false;
    this.hasTilesetContent = false;
    this.depth = 0;
    this.viewportIds = [];
    this.userData = {};
    this._priority = 0;
    this._touchedFrame = 0;
    this._visitedFrame = 0;
    this._selectedFrame = 0;
    this._requestedFrame = 0;
    this._screenSpaceError = 0;
    this._cacheNode = null;
    this._frameNumber = null;
    this._cacheNode = null;
    this.traverser = new TilesetTraverser({});
    this._shouldRefine = false;
    this._distanceToCamera = 0;
    this._centerZDepth = 0;
    this._visible = undefined;
    this._inRequestVolume = false;
    this._stackLength = 0;
    this._selectionDepth = 0;
    this._initialTransform = new Matrix4();
    this.transform = new Matrix4();

    this._initializeLodMetric(header);

    this._initializeTransforms(header);

    this._initializeBoundingVolumes(header);

    this._initializeContent(header);

    this._initializeRenderingState(header);

    this._lodJudge = null;
    this._expireDate = null;
    this._expiredContent = null;
    Object.seal(this);
  }

  destroy() {
    this.header = null;
  }

  isDestroyed() {
    return this.header === null;
  }

  get selected() {
    return this._selectedFrame === this.tileset._frameNumber;
  }

  get isVisible() {
    return this._visible;
  }

  get isVisibleAndInRequestVolume() {
    return this._visible && this._inRequestVolume;
  }

  get hasRenderContent() {
    return !this.hasEmptyContent && !this.hasTilesetContent;
  }

  get hasChildren() {
    return this.children.length > 0 || this.header.children && this.header.children.length > 0;
  }

  get contentReady() {
    return this.contentState === TILE_CONTENT_STATE.READY || this.hasEmptyContent;
  }

  get contentAvailable() {
    return Boolean(this.contentReady && this.hasRenderContent || this._expiredContent && !this.contentFailed);
  }

  get hasUnloadedContent() {
    return this.hasRenderContent && this.contentUnloaded;
  }

  get contentUnloaded() {
    return this.contentState === TILE_CONTENT_STATE.UNLOADED;
  }

  get contentExpired() {
    return this.contentState === TILE_CONTENT_STATE.EXPIRED;
  }

  get contentFailed() {
    return this.contentState === TILE_CONTENT_STATE.FAILED;
  }

  getScreenSpaceError(frameState, useParentLodMetric) {
    switch (this.tileset.type) {
      case TILESET_TYPE.I3S:
        return getI3ScreenSize(this, frameState);

      case TILESET_TYPE.TILES3D:
        return getTiles3DScreenSpaceError(this, frameState, useParentLodMetric);

      default:
        throw new Error('Unsupported tileset type');
    }
  }

  _getPriority() {
    const traverser = this.tileset._traverser;
    const {
      skipLevelOfDetail
    } = traverser.options;
    const maySkipTile = this.refine === TILE_REFINEMENT.ADD || skipLevelOfDetail;

    if (maySkipTile && !this.isVisible && this._visible !== undefined) {
      return -1;
    }

    if (this.contentState === TILE_CONTENT_STATE.UNLOADED) {
      return -1;
    }

    const parent = this.parent;
    const useParentScreenSpaceError = parent && (!maySkipTile || this._screenSpaceError === 0.0 || parent.hasTilesetContent);
    const screenSpaceError = useParentScreenSpaceError ? parent._screenSpaceError : this._screenSpaceError;
    const rootScreenSpaceError = traverser.root ? traverser.root._screenSpaceError : 0.0;
    return Math.max(rootScreenSpaceError - screenSpaceError, 0);
  }

  async loadContent() {
    if (this.hasEmptyContent) {
      return false;
    }

    if (this.content) {
      return true;
    }

    const expired = this.contentExpired;

    if (expired) {
      this._expireDate = null;
    }

    this.contentState = TILE_CONTENT_STATE.LOADING;
    const requestToken = await this.tileset._requestScheduler.scheduleRequest(this.id, this._getPriority.bind(this));

    if (!requestToken) {
      this.contentState = TILE_CONTENT_STATE.UNLOADED;
      return false;
    }

    try {
      const contentUrl = this.tileset.getTileUrl(this.contentUrl);
      const loader = this.tileset.loader;
      const options = { ...this.tileset.loadOptions,
        [loader.id]: { ...this.tileset.loadOptions[loader.id],
          isTileset: this.type === 'json',
          ...this._getLoaderSpecificOptions(loader.id)
        }
      };
      this.content = await load(contentUrl, loader, options);

      if (this.tileset.options.contentLoader) {
        await this.tileset.options.contentLoader(this);
      }

      if (this._isTileset()) {
        this.tileset._initializeTileHeaders(this.content, this);
      }

      this.contentState = TILE_CONTENT_STATE.READY;

      this._onContentLoaded();

      return true;
    } catch (error) {
      this.contentState = TILE_CONTENT_STATE.FAILED;
      throw error;
    } finally {
      requestToken.done();
    }
  }

  unloadContent() {
    if (this.content && this.content.destroy) {
      this.content.destroy();
    }

    this.content = null;

    if (this.header.content && this.header.content.destroy) {
      this.header.content.destroy();
    }

    this.header.content = null;
    this.contentState = TILE_CONTENT_STATE.UNLOADED;
    return true;
  }

  updateVisibility(frameState, viewportIds) {
    if (this._frameNumber === frameState.frameNumber) {
      return;
    }

    const parent = this.parent;
    const parentVisibilityPlaneMask = parent ? parent._visibilityPlaneMask : CullingVolume.MASK_INDETERMINATE;

    if (this.tileset._traverser.options.updateTransforms) {
      const parentTransform = parent ? parent.computedTransform : this.tileset.modelMatrix;

      this._updateTransform(parentTransform);
    }

    this._distanceToCamera = this.distanceToTile(frameState);
    this._screenSpaceError = this.getScreenSpaceError(frameState, false);
    this._visibilityPlaneMask = this.visibility(frameState, parentVisibilityPlaneMask);
    this._visible = this._visibilityPlaneMask !== CullingVolume.MASK_OUTSIDE;
    this._inRequestVolume = this.insideViewerRequestVolume(frameState);
    this._frameNumber = frameState.frameNumber;
    this.viewportIds = viewportIds;
  }

  visibility(frameState, parentVisibilityPlaneMask) {
    const {
      cullingVolume
    } = frameState;
    const {
      boundingVolume
    } = this;
    return cullingVolume.computeVisibilityWithPlaneMask(boundingVolume, parentVisibilityPlaneMask);
  }

  contentVisibility() {
    return true;
  }

  distanceToTile(frameState) {
    const boundingVolume = this.boundingVolume;
    return Math.sqrt(Math.max(boundingVolume.distanceSquaredTo(frameState.camera.position), 0));
  }

  cameraSpaceZDepth({
    camera
  }) {
    const boundingVolume = this.boundingVolume;
    scratchVector.subVectors(boundingVolume.center, camera.position);
    return camera.direction.dot(scratchVector);
  }

  insideViewerRequestVolume(frameState) {
    const viewerRequestVolume = this._viewerRequestVolume;
    return !viewerRequestVolume || viewerRequestVolume.distanceSquaredTo(frameState.camera.position) <= 0;
  }

  updateExpiration() {
    if (defined$2(this._expireDate) && this.contentReady && !this.hasEmptyContent) {
      const now = Date.now();

      if (Date.lessThan(this._expireDate, now)) {
        this.contentState = TILE_CONTENT_STATE.EXPIRED;
        this._expiredContent = this.content;
      }
    }
  }

  get extras() {
    return this.header.extras;
  }

  _initializeLodMetric(header) {
    if ('lodMetricType' in header) {
      this.lodMetricType = header.lodMetricType;
    } else {
      this.lodMetricType = this.parent && this.parent.lodMetricType || this.tileset.lodMetricType;
      console.warn("3D Tile: Required prop lodMetricType is undefined. Using parent lodMetricType");
    }

    if ('lodMetricValue' in header) {
      this.lodMetricValue = header.lodMetricValue;
    } else {
      this.lodMetricValue = this.parent && this.parent.lodMetricValue || this.tileset.lodMetricValue;
      console.warn('3D Tile: Required prop lodMetricValue is undefined. Using parent lodMetricValue');
    }
  }

  _initializeTransforms(tileHeader) {
    this.transform = tileHeader.transform ? new Matrix4(tileHeader.transform) : new Matrix4();
    const parent = this.parent;
    const tileset = this.tileset;
    const parentTransform = parent && parent.computedTransform ? parent.computedTransform.clone() : tileset.modelMatrix.clone();
    this.computedTransform = new Matrix4(parentTransform).multiplyRight(this.transform);
    const parentInitialTransform = parent && parent._initialTransform ? parent._initialTransform.clone() : new Matrix4();
    this._initialTransform = new Matrix4(parentInitialTransform).multiplyRight(this.transform);
  }

  _initializeBoundingVolumes(tileHeader) {
    this._contentBoundingVolume = null;
    this._viewerRequestVolume = null;

    this._updateBoundingVolume(tileHeader);
  }

  _initializeContent(tileHeader) {
    this.content = {
      _tileset: this.tileset,
      _tile: this
    };
    this.hasEmptyContent = true;
    this.contentState = TILE_CONTENT_STATE.UNLOADED;
    this.hasTilesetContent = false;

    if (tileHeader.contentUrl) {
      this.content = null;
      this.hasEmptyContent = false;
    }
  }

  _initializeRenderingState(header) {
    this.depth = header.level || (this.parent ? this.parent.depth + 1 : 0);
    this._shouldRefine = false;
    this._distanceToCamera = 0;
    this._centerZDepth = 0;
    this._screenSpaceError = 0;
    this._visibilityPlaneMask = CullingVolume.MASK_INDETERMINATE;
    this._visible = undefined;
    this._inRequestVolume = false;
    this._stackLength = 0;
    this._selectionDepth = 0;
    this._frameNumber = 0;
    this._touchedFrame = 0;
    this._visitedFrame = 0;
    this._selectedFrame = 0;
    this._requestedFrame = 0;
    this._priority = 0.0;
  }

  _getRefine(refine) {
    return refine || this.parent && this.parent.refine || TILE_REFINEMENT.REPLACE;
  }

  _isTileset() {
    return this.contentUrl.indexOf('.json') !== -1;
  }

  _onContentLoaded() {
    switch (this.content && this.content.type) {
      case 'vctr':
      case 'geom':
        this.tileset._traverser.disableSkipLevelOfDetail = true;
        break;
    }

    if (this._isTileset()) {
      this.hasTilesetContent = true;
    }
  }

  _updateBoundingVolume(header) {
    this.boundingVolume = createBoundingVolume(header.boundingVolume, this.computedTransform, this.boundingVolume);
    const content = header.content;

    if (!content) {
      return;
    }

    if (content.boundingVolume) {
      this._contentBoundingVolume = createBoundingVolume(content.boundingVolume, this.computedTransform, this._contentBoundingVolume);
    }

    if (header.viewerRequestVolume) {
      this._viewerRequestVolume = createBoundingVolume(header.viewerRequestVolume, this.computedTransform, this._viewerRequestVolume);
    }
  }

  _updateTransform(parentTransform = new Matrix4()) {
    const computedTransform = parentTransform.clone().multiplyRight(this.transform);
    const didTransformChange = !computedTransform.equals(this.computedTransform);

    if (!didTransformChange) {
      return;
    }

    this.computedTransform = computedTransform;

    this._updateBoundingVolume(this.header);
  }

  _getLoaderSpecificOptions(loaderId) {
    switch (loaderId) {
      case 'i3s':
        return { ...this.tileset.options.i3s,
          tile: this.header,
          tileset: this.tileset.tileset,
          isTileHeader: false
        };

      case '3d-tiles':
      case 'cesium-ion':
      default:
        return get3dTilesOptions(this.tileset.tileset);
    }
  }

}

class Tileset3DTraverser extends TilesetTraverser {
  compareDistanceToCamera(a, b) {
    return b._distanceToCamera === 0 && a._distanceToCamera === 0 ? b._centerZDepth - a._centerZDepth : b._distanceToCamera - a._distanceToCamera;
  }

  updateTileVisibility(tile, frameState) {
    super.updateTileVisibility(tile, frameState);

    if (!tile.isVisibleAndInRequestVolume) {
      return;
    }

    const hasChildren = tile.children.length > 0;

    if (tile.hasTilesetContent && hasChildren) {
      const firstChild = tile.children[0];
      this.updateTileVisibility(firstChild, frameState);
      tile._visible = firstChild._visible;
      return;
    }

    if (this.meetsScreenSpaceErrorEarly(tile, frameState)) {
      tile._visible = false;
      return;
    }

    const replace = tile.refine === TILE_REFINEMENT.REPLACE;
    const useOptimization = tile._optimChildrenWithinParent === TILE3D_OPTIMIZATION_HINT.USE_OPTIMIZATION;

    if (replace && useOptimization && hasChildren) {
      if (!this.anyChildrenVisible(tile, frameState)) {
        tile._visible = false;
        return;
      }
    }
  }

  meetsScreenSpaceErrorEarly(tile, frameState) {
    const {
      parent
    } = tile;

    if (!parent || parent.hasTilesetContent || parent.refine !== TILE_REFINEMENT.ADD) {
      return false;
    }

    return !this.shouldRefine(tile, frameState, true);
  }

}

const STATUS = {
  REQUESTED: 'REQUESTED',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
};
class I3STileManager {
  constructor() {
    _defineProperty(this, "_statusMap", void 0);

    this._statusMap = {};
  }

  add(request, key, callback, frameState) {
    if (!this._statusMap[key]) {
      this._statusMap[key] = {
        request,
        callback,
        key,
        frameState,
        status: STATUS.REQUESTED
      };
      request().then(data => {
        this._statusMap[key].status = STATUS.COMPLETED;

        this._statusMap[key].callback(data, frameState);
      }).catch(error => {
        this._statusMap[key].status = STATUS.ERROR;
        callback(error);
      });
    }
  }

  update(key, frameState) {
    if (this._statusMap[key]) {
      this._statusMap[key].frameState = frameState;
    }
  }

  find(key) {
    return this._statusMap[key];
  }

}

class I3STilesetTraverser extends TilesetTraverser {
  constructor(options) {
    super(options);

    _defineProperty(this, "_tileManager", void 0);

    this._tileManager = new I3STileManager();
  }

  shouldRefine(tile, frameState) {
    tile._lodJudge = lodJudge(tile, frameState);
    return tile._lodJudge === 'DIG';
  }

  updateChildTiles(tile, frameState) {
    const children = tile.header.children || [];
    const childTiles = tile.children;
    const tileset = tile.tileset;

    for (const child of children) {
      const extendedId = "".concat(child.id, "-").concat(frameState.viewport.id);
      const childTile = childTiles && childTiles.find(t => t.id === extendedId);

      if (!childTile) {
        let request = () => this._loadTile(child.id, tileset);

        const cachedRequest = this._tileManager.find(extendedId);

        if (!cachedRequest) {
          if (tileset.tileset.nodePages) {
            request = () => tileset.tileset.nodePagesTile.formTileFromNodePages(child.id);
          }

          this._tileManager.add(request, extendedId, header => this._onTileLoad(header, tile, extendedId), frameState);
        } else {
          this._tileManager.update(extendedId, frameState);
        }
      } else if (childTile) {
        this.updateTile(childTile, frameState);
      }
    }

    return false;
  }

  async _loadTile(nodeId, tileset) {
    const {
      loader
    } = tileset;
    const nodeUrl = tileset.getTileUrl("".concat(tileset.url, "/nodes/").concat(nodeId));
    const options = { ...tileset.loadOptions,
      i3s: { ...tileset.loadOptions.i3s,
        isTileHeader: true,
        loadContent: false
      }
    };
    return await load(nodeUrl, loader, options);
  }

  _onTileLoad(header, tile, extendedId) {
    const childTile = new TileHeader(tile.tileset, header, tile, extendedId);
    tile.children.push(childTile);

    const frameState = this._tileManager.find(childTile.id).frameState;

    this.updateTile(childTile, frameState);

    if (this._frameNumber === frameState.frameNumber) {
      this.executeTraversal(childTile, frameState);
    }
  }

}

const DEFAULT_PROPS = {
  description: '',
  ellipsoid: Ellipsoid.WGS84,
  modelMatrix: new Matrix4(),
  throttleRequests: true,
  maxRequests: 64,
  maximumMemoryUsage: 32,
  onTileLoad: () => {},
  onTileUnload: () => {},
  onTileError: () => {},
  contentLoader: undefined,
  viewDistanceScale: 1.0,
  maximumScreenSpaceError: 8,
  loadTiles: true,
  updateTransforms: true,
  viewportTraversersMap: null,
  loadOptions: {
    fetch: {}
  },
  attributions: [],
  basePath: '',
  i3s: {}
};
const TILES_TOTAL = 'Tiles In Tileset(s)';
const TILES_IN_MEMORY = 'Tiles In Memory';
const TILES_IN_VIEW = 'Tiles In View';
const TILES_RENDERABLE = 'Tiles To Render';
const TILES_LOADED = 'Tiles Loaded';
const TILES_LOADING = 'Tiles Loading';
const TILES_UNLOADED = 'Tiles Unloaded';
const TILES_LOAD_FAILED = 'Failed Tile Loads';
const POINTS_COUNT = 'Points';
const TILES_GPU_MEMORY = 'Tile Memory Use';
class Tileset3D {
  constructor(json, options) {
    _defineProperty(this, "options", void 0);

    _defineProperty(this, "loadOptions", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "tileset", void 0);

    _defineProperty(this, "loader", void 0);

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "basePath", void 0);

    _defineProperty(this, "modelMatrix", void 0);

    _defineProperty(this, "ellipsoid", void 0);

    _defineProperty(this, "lodMetricType", void 0);

    _defineProperty(this, "lodMetricValue", void 0);

    _defineProperty(this, "refine", void 0);

    _defineProperty(this, "root", void 0);

    _defineProperty(this, "roots", void 0);

    _defineProperty(this, "asset", void 0);

    _defineProperty(this, "description", void 0);

    _defineProperty(this, "properties", void 0);

    _defineProperty(this, "extras", void 0);

    _defineProperty(this, "attributions", void 0);

    _defineProperty(this, "credits", void 0);

    _defineProperty(this, "stats", void 0);

    _defineProperty(this, "traverseCounter", void 0);

    _defineProperty(this, "geometricError", void 0);

    _defineProperty(this, "selectedTiles", void 0);

    _defineProperty(this, "cartographicCenter", void 0);

    _defineProperty(this, "cartesianCenter", void 0);

    _defineProperty(this, "zoom", void 0);

    _defineProperty(this, "boundingVolume", void 0);

    _defineProperty(this, "gpuMemoryUsageInBytes", void 0);

    _defineProperty(this, "dynamicScreenSpaceErrorComputedDensity", void 0);

    _defineProperty(this, "_traverser", void 0);

    _defineProperty(this, "_cache", void 0);

    _defineProperty(this, "_requestScheduler", void 0);

    _defineProperty(this, "_frameNumber", void 0);

    _defineProperty(this, "_queryParamsString", void 0);

    _defineProperty(this, "_queryParams", void 0);

    _defineProperty(this, "_extensionsUsed", void 0);

    _defineProperty(this, "_tiles", void 0);

    _defineProperty(this, "_pendingCount", void 0);

    _defineProperty(this, "lastUpdatedVieports", void 0);

    _defineProperty(this, "_requestedTiles", void 0);

    _defineProperty(this, "_emptyTiles", void 0);

    _defineProperty(this, "frameStateData", void 0);

    _defineProperty(this, "maximumMemoryUsage", void 0);

    assert$7(json);
    this.options = { ...DEFAULT_PROPS,
      ...options
    };
    this.tileset = json;
    this.loader = json.loader;
    this.type = json.type;
    this.url = json.url;
    this.basePath = json.basePath || dirname(this.url);
    this.modelMatrix = this.options.modelMatrix;
    this.ellipsoid = this.options.ellipsoid;
    this.lodMetricType = json.lodMetricType;
    this.lodMetricValue = json.lodMetricValue;
    this.refine = json.root.refine;
    this.loadOptions = this.options.loadOptions || {};
    this.root = null;
    this.roots = {};
    this.cartographicCenter = null;
    this.cartesianCenter = null;
    this.zoom = 1;
    this.boundingVolume = null;
    this.traverseCounter = 0;
    this.geometricError = 0;
    this._traverser = this._initializeTraverser();
    this._cache = new TilesetCache();
    this._requestScheduler = new RequestScheduler({
      throttleRequests: this.options.throttleRequests,
      maxRequests: this.options.maxRequests
    });
    this._frameNumber = 0;
    this._pendingCount = 0;
    this._tiles = {};
    this.selectedTiles = [];
    this._emptyTiles = [];
    this._requestedTiles = [];
    this.frameStateData = {};
    this.lastUpdatedVieports = null;
    this._queryParams = {};
    this._queryParamsString = '';
    this.maximumMemoryUsage = this.options.maximumMemoryUsage || 32;
    this.gpuMemoryUsageInBytes = 0;
    this.stats = new Stats({
      id: this.url
    });

    this._initializeStats();

    this._extensionsUsed = undefined;
    this.dynamicScreenSpaceErrorComputedDensity = 0.0;
    this.extras = null;
    this.asset = {};
    this.credits = {};
    this.description = this.options.description || '';

    this._initializeTileSet(json);
  }

  destroy() {
    this._destroy();
  }

  isLoaded() {
    return this._pendingCount === 0 && this._frameNumber !== 0;
  }

  get tiles() {
    return Object.values(this._tiles);
  }

  get frameNumber() {
    return this._frameNumber;
  }

  get queryParams() {
    if (!this._queryParamsString) {
      this._queryParamsString = getQueryParamString(this._queryParams);
    }

    return this._queryParamsString;
  }

  setProps(props) {
    this.options = { ...this.options,
      ...props
    };
  }

  setOptions(options) {
    this.options = { ...this.options,
      ...options
    };
  }

  getTileUrl(tilePath) {
    const isDataUrl = tilePath.startsWith('data:');

    if (isDataUrl) {
      return tilePath;
    }

    return "".concat(tilePath).concat(this.queryParams);
  }

  hasExtension(extensionName) {
    return Boolean(this._extensionsUsed && this._extensionsUsed.indexOf(extensionName) > -1);
  }

  update(viewports) {
    if ('loadTiles' in this.options && !this.options.loadTiles) {
      return;
    }

    if (this.traverseCounter > 0) {
      return;
    }

    if (!viewports && this.lastUpdatedVieports) {
      viewports = this.lastUpdatedVieports;
    } else {
      this.lastUpdatedVieports = viewports;
    }

    if (!(viewports instanceof Array)) {
      viewports = [viewports];
    }

    this._cache.reset();

    this._frameNumber++;
    this.traverseCounter = viewports.length;
    const viewportsToTraverse = [];

    for (const viewport of viewports) {
      const id = viewport.id;

      if (this._needTraverse(id)) {
        viewportsToTraverse.push(id);
      } else {
        this.traverseCounter--;
      }
    }

    for (const viewport of viewports) {
      const id = viewport.id;

      if (!this.roots[id]) {
        this.roots[id] = this._initializeTileHeaders(this.tileset, null);
      }

      if (!viewportsToTraverse.includes(id)) {
        continue;
      }

      const frameState = getFrameState(viewport, this._frameNumber);

      this._traverser.traverse(this.roots[id], frameState, this.options);
    }
  }

  _needTraverse(viewportId) {
    let traverserId = viewportId;

    if (this.options.viewportTraversersMap) {
      traverserId = this.options.viewportTraversersMap[viewportId];
    }

    if (traverserId !== viewportId) {
      return false;
    }

    return true;
  }

  _onTraversalEnd(frameState) {
    const id = frameState.viewport.id;

    if (!this.frameStateData[id]) {
      this.frameStateData[id] = {
        selectedTiles: [],
        _requestedTiles: [],
        _emptyTiles: []
      };
    }

    const currentFrameStateData = this.frameStateData[id];
    const selectedTiles = Object.values(this._traverser.selectedTiles);
    currentFrameStateData.selectedTiles = selectedTiles;
    currentFrameStateData._requestedTiles = Object.values(this._traverser.requestedTiles);
    currentFrameStateData._emptyTiles = Object.values(this._traverser.emptyTiles);
    this.traverseCounter--;

    if (this.traverseCounter > 0) {
      return;
    }

    this._updateTiles();
  }

  _updateTiles() {
    this.selectedTiles = [];
    this._requestedTiles = [];
    this._emptyTiles = [];

    for (const frameStateKey in this.frameStateData) {
      const frameStateDataValue = this.frameStateData[frameStateKey];
      this.selectedTiles = this.selectedTiles.concat(frameStateDataValue.selectedTiles);
      this._requestedTiles = this._requestedTiles.concat(frameStateDataValue._requestedTiles);
      this._emptyTiles = this._emptyTiles.concat(frameStateDataValue._emptyTiles);
    }

    for (const tile of this.selectedTiles) {
      this._tiles[tile.id] = tile;
    }

    this._loadTiles();

    this._unloadTiles();

    this._updateStats();
  }

  _tilesChanged(oldSelectedTiles, selectedTiles) {
    if (oldSelectedTiles.length !== selectedTiles.length) {
      return true;
    }

    const set1 = new Set(oldSelectedTiles.map(t => t.id));
    const set2 = new Set(selectedTiles.map(t => t.id));
    let changed = oldSelectedTiles.filter(x => !set2.has(x.id)).length > 0;
    changed = changed || selectedTiles.filter(x => !set1.has(x.id)).length > 0;
    return changed;
  }

  _loadTiles() {
    for (const tile of this._requestedTiles) {
      if (tile.contentUnloaded) {
        this._loadTile(tile);
      }
    }
  }

  _unloadTiles() {
    this._cache.unloadTiles(this, (tileset, tile) => tileset._unloadTile(tile));
  }

  _updateStats() {
    let tilesRenderable = 0;
    let pointsRenderable = 0;

    for (const tile of this.selectedTiles) {
      if (tile.contentAvailable && tile.content) {
        tilesRenderable++;

        if (tile.content.pointCount) {
          pointsRenderable += tile.content.pointCount;
        }
      }
    }

    this.stats.get(TILES_IN_VIEW).count = this.selectedTiles.length;
    this.stats.get(TILES_RENDERABLE).count = tilesRenderable;
    this.stats.get(POINTS_COUNT).count = pointsRenderable;
  }

  _initializeTileSet(tilesetJson) {
    this.root = this._initializeTileHeaders(tilesetJson, null);

    if (this.type === TILESET_TYPE.TILES3D) {
      this._initializeCesiumTileset(tilesetJson);
    }

    if (this.type === TILESET_TYPE.I3S) {
      this._initializeI3STileset();
    }

    this._calculateViewProps();
  }

  _calculateViewProps() {
    const root = this.root;
    assert$7(root);
    const {
      center
    } = root.boundingVolume;

    if (!center) {
      console.warn('center was not pre-calculated for the root tile');
      this.cartographicCenter = new Vector3();
      this.zoom = 1;
      return;
    }

    this.cartographicCenter = Ellipsoid.WGS84.cartesianToCartographic(center, new Vector3());
    this.cartesianCenter = center;
    this.zoom = getZoomFromBoundingVolume(root.boundingVolume);
  }

  _initializeStats() {
    this.stats.get(TILES_TOTAL);
    this.stats.get(TILES_LOADING);
    this.stats.get(TILES_IN_MEMORY);
    this.stats.get(TILES_IN_VIEW);
    this.stats.get(TILES_RENDERABLE);
    this.stats.get(TILES_LOADED);
    this.stats.get(TILES_UNLOADED);
    this.stats.get(TILES_LOAD_FAILED);
    this.stats.get(POINTS_COUNT, 'memory');
    this.stats.get(TILES_GPU_MEMORY, 'memory');
  }

  _initializeTileHeaders(tilesetJson, parentTileHeader) {
    const rootTile = new TileHeader(this, tilesetJson.root, parentTileHeader);

    if (parentTileHeader) {
      parentTileHeader.children.push(rootTile);
      rootTile.depth = parentTileHeader.depth + 1;
    }

    if (this.type === TILESET_TYPE.TILES3D) {
      const stack = [];
      stack.push(rootTile);

      while (stack.length > 0) {
        const tile = stack.pop();
        this.stats.get(TILES_TOTAL).incrementCount();
        const children = tile.header.children || [];

        for (const childHeader of children) {
          const childTile = new TileHeader(this, childHeader, tile);
          tile.children.push(childTile);
          childTile.depth = tile.depth + 1;
          stack.push(childTile);
        }
      }
    }

    return rootTile;
  }

  _initializeTraverser() {
    let TraverserClass;
    const type = this.type;

    switch (type) {
      case TILESET_TYPE.TILES3D:
        TraverserClass = Tileset3DTraverser;
        break;

      case TILESET_TYPE.I3S:
        TraverserClass = I3STilesetTraverser;
        break;

      default:
        TraverserClass = TilesetTraverser;
    }

    return new TraverserClass({
      basePath: this.basePath,
      onTraversalEnd: this._onTraversalEnd.bind(this)
    });
  }

  _destroyTileHeaders(parentTile) {
    this._destroySubtree(parentTile);
  }

  async _loadTile(tile) {
    let loaded;

    try {
      this._onStartTileLoading();

      loaded = await tile.loadContent();
    } catch (error) {
      this._onTileLoadError(tile, error);
    } finally {
      this._onEndTileLoading();

      this._onTileLoad(tile, loaded);
    }
  }

  _onTileLoadError(tile, error) {
    this.stats.get(TILES_LOAD_FAILED).incrementCount();
    const message = error.message || error.toString();
    const url = tile.url;
    console.error("A 3D tile failed to load: ".concat(tile.url, " ").concat(message));
    this.options.onTileError(tile, message, url);
  }

  _onTileLoad(tile, loaded) {
    if (!loaded) {
      return;
    }

    if (tile && tile.content) {
      calculateTransformProps(tile, tile.content);
    }

    this._addTileToCache(tile);

    this.options.onTileLoad(tile);
  }

  _onStartTileLoading() {
    this._pendingCount++;
    this.stats.get(TILES_LOADING).incrementCount();
  }

  _onEndTileLoading() {
    this._pendingCount--;
    this.stats.get(TILES_LOADING).decrementCount();
  }

  _addTileToCache(tile) {
    this._cache.add(this, tile, tileset => tileset._updateCacheStats(tile));
  }

  _updateCacheStats(tile) {
    this.stats.get(TILES_LOADED).incrementCount();
    this.stats.get(TILES_IN_MEMORY).incrementCount();
    this.gpuMemoryUsageInBytes += tile.content.byteLength || 0;
    this.stats.get(TILES_GPU_MEMORY).count = this.gpuMemoryUsageInBytes;
  }

  _unloadTile(tile) {
    this.gpuMemoryUsageInBytes -= tile.content && tile.content.byteLength || 0;
    this.stats.get(TILES_IN_MEMORY).decrementCount();
    this.stats.get(TILES_UNLOADED).incrementCount();
    this.stats.get(TILES_GPU_MEMORY).count = this.gpuMemoryUsageInBytes;
    this.options.onTileUnload(tile);
    tile.unloadContent();
  }

  _destroy() {
    const stack = [];

    if (this.root) {
      stack.push(this.root);
    }

    while (stack.length > 0) {
      const tile = stack.pop();

      for (const child of tile.children) {
        stack.push(child);
      }

      this._destroyTile(tile);
    }

    this.root = null;
  }

  _destroySubtree(tile) {
    const root = tile;
    const stack = [];
    stack.push(root);

    while (stack.length > 0) {
      tile = stack.pop();

      for (const child of tile.children) {
        stack.push(child);
      }

      if (tile !== root) {
        this._destroyTile(tile);
      }
    }

    root.children = [];
  }

  _destroyTile(tile) {
    this._cache.unloadTile(this, tile);

    this._unloadTile(tile);

    tile.destroy();
  }

  _initializeCesiumTileset(tilesetJson) {
    this.asset = tilesetJson.asset;

    if (!this.asset) {
      throw new Error('Tileset must have an asset property.');
    }

    if (this.asset.version !== '0.0' && this.asset.version !== '1.0') {
      throw new Error('The tileset must be 3D Tiles version 0.0 or 1.0.');
    }

    if ('tilesetVersion' in this.asset) {
      this._queryParams.v = this.asset.tilesetVersion;
    }

    this.credits = {
      attributions: this.options.attributions || []
    };
    this.description = this.options.description || '';
    this.properties = tilesetJson.properties;
    this.geometricError = tilesetJson.geometricError;
    this._extensionsUsed = tilesetJson.extensionsUsed;
    this.extras = tilesetJson.extras;
  }

  _initializeI3STileset() {
    if (this.loadOptions.i3s && 'token' in this.loadOptions.i3s) {
      this._queryParams.token = this.loadOptions.i3s.token;
    }
  }

}

function getQueryParamString(queryParams) {
  const queryParamStrings = [];

  for (const key of Object.keys(queryParams)) {
    queryParamStrings.push("".concat(key, "=").concat(queryParams[key]));
  }

  switch (queryParamStrings.length) {
    case 0:
      return '';

    case 1:
      return "?".concat(queryParamStrings[0]);

    default:
      return "?".concat(queryParamStrings.join('&'));
  }
}

const VERSION$3 = "3.0.0-beta.3" ;

const TILE3D_TYPE = {
  COMPOSITE: 'cmpt',
  POINT_CLOUD: 'pnts',
  BATCHED_3D_MODEL: 'b3dm',
  INSTANCED_3D_MODEL: 'i3dm',
  GEOMETRY: 'geom',
  VECTOR: 'vect'
};

function getStringFromArrayBuffer(arrayBuffer, byteOffset, byteLength) {
  assert$7(arrayBuffer instanceof ArrayBuffer);
  const textDecoder = new TextDecoder('utf8');
  const typedArray = new Uint8Array(arrayBuffer, byteOffset, byteLength);
  const string = textDecoder.decode(typedArray);
  return string;
}
function getMagicString$1(arrayBuffer, byteOffset = 0) {
  const dataView = new DataView(arrayBuffer);
  return "".concat(String.fromCharCode(dataView.getUint8(byteOffset + 0))).concat(String.fromCharCode(dataView.getUint8(byteOffset + 1))).concat(String.fromCharCode(dataView.getUint8(byteOffset + 2))).concat(String.fromCharCode(dataView.getUint8(byteOffset + 3)));
}

function assert$4(condition, message) {
  if (!condition) {
    throw new Error(message || 'loader assertion failed.');
  }
}

class Schema {
  constructor(fields, metadata) {
    _defineProperty(this, "fields", void 0);

    _defineProperty(this, "metadata", void 0);

    assert$4(Array.isArray(fields));
    checkNames(fields);
    this.fields = fields;
    this.metadata = metadata || new Map();
  }

  compareTo(other) {
    if (this.metadata !== other.metadata) {
      return false;
    }

    if (this.fields.length !== other.fields.length) {
      return false;
    }

    for (let i = 0; i < this.fields.length; ++i) {
      if (!this.fields[i].compareTo(other.fields[i])) {
        return false;
      }
    }

    return true;
  }

  select(...columnNames) {
    const nameMap = Object.create(null);

    for (const name of columnNames) {
      nameMap[name] = true;
    }

    const selectedFields = this.fields.filter(field => nameMap[field.name]);
    return new Schema(selectedFields, this.metadata);
  }

  selectAt(...columnIndices) {
    const selectedFields = columnIndices.map(index => this.fields[index]).filter(Boolean);
    return new Schema(selectedFields, this.metadata);
  }

  assign(schemaOrFields) {
    let fields;
    let metadata = this.metadata;

    if (schemaOrFields instanceof Schema) {
      const otherSchema = schemaOrFields;
      fields = otherSchema.fields;
      metadata = mergeMaps(mergeMaps(new Map(), this.metadata), otherSchema.metadata);
    } else {
      fields = schemaOrFields;
    }

    const fieldMap = Object.create(null);

    for (const field of this.fields) {
      fieldMap[field.name] = field;
    }

    for (const field of fields) {
      fieldMap[field.name] = field;
    }

    const mergedFields = Object.values(fieldMap);
    return new Schema(mergedFields, metadata);
  }

}

function checkNames(fields) {
  const usedNames = {};

  for (const field of fields) {
    if (usedNames[field.name]) {
      console.warn('Schema: duplicated field name', field.name, field);
    }

    usedNames[field.name] = true;
  }
}

function mergeMaps(m1, m2) {
  return new Map([...(m1 || new Map()), ...(m2 || new Map())]);
}

class Field {
  constructor(name, type, nullable = false, metadata = new Map()) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "nullable", void 0);

    _defineProperty(this, "metadata", void 0);

    this.name = name;
    this.type = type;
    this.nullable = nullable;
    this.metadata = metadata;
  }

  get typeId() {
    return this.type && this.type.typeId;
  }

  clone() {
    return new Field(this.name, this.type, this.nullable, this.metadata);
  }

  compareTo(other) {
    return this.name === other.name && this.type === other.type && this.nullable === other.nullable && this.metadata === other.metadata;
  }

  toString() {
    return "".concat(this.type).concat(this.nullable ? ', nullable' : '').concat(this.metadata ? ", metadata: ".concat(this.metadata) : '');
  }

}

let Type;

(function (Type) {
  Type[Type["NONE"] = 0] = "NONE";
  Type[Type["Null"] = 1] = "Null";
  Type[Type["Int"] = 2] = "Int";
  Type[Type["Float"] = 3] = "Float";
  Type[Type["Binary"] = 4] = "Binary";
  Type[Type["Utf8"] = 5] = "Utf8";
  Type[Type["Bool"] = 6] = "Bool";
  Type[Type["Decimal"] = 7] = "Decimal";
  Type[Type["Date"] = 8] = "Date";
  Type[Type["Time"] = 9] = "Time";
  Type[Type["Timestamp"] = 10] = "Timestamp";
  Type[Type["Interval"] = 11] = "Interval";
  Type[Type["List"] = 12] = "List";
  Type[Type["Struct"] = 13] = "Struct";
  Type[Type["Union"] = 14] = "Union";
  Type[Type["FixedSizeBinary"] = 15] = "FixedSizeBinary";
  Type[Type["FixedSizeList"] = 16] = "FixedSizeList";
  Type[Type["Map"] = 17] = "Map";
  Type[Type["Dictionary"] = -1] = "Dictionary";
  Type[Type["Int8"] = -2] = "Int8";
  Type[Type["Int16"] = -3] = "Int16";
  Type[Type["Int32"] = -4] = "Int32";
  Type[Type["Int64"] = -5] = "Int64";
  Type[Type["Uint8"] = -6] = "Uint8";
  Type[Type["Uint16"] = -7] = "Uint16";
  Type[Type["Uint32"] = -8] = "Uint32";
  Type[Type["Uint64"] = -9] = "Uint64";
  Type[Type["Float16"] = -10] = "Float16";
  Type[Type["Float32"] = -11] = "Float32";
  Type[Type["Float64"] = -12] = "Float64";
  Type[Type["DateDay"] = -13] = "DateDay";
  Type[Type["DateMillisecond"] = -14] = "DateMillisecond";
  Type[Type["TimestampSecond"] = -15] = "TimestampSecond";
  Type[Type["TimestampMillisecond"] = -16] = "TimestampMillisecond";
  Type[Type["TimestampMicrosecond"] = -17] = "TimestampMicrosecond";
  Type[Type["TimestampNanosecond"] = -18] = "TimestampNanosecond";
  Type[Type["TimeSecond"] = -19] = "TimeSecond";
  Type[Type["TimeMillisecond"] = -20] = "TimeMillisecond";
  Type[Type["TimeMicrosecond"] = -21] = "TimeMicrosecond";
  Type[Type["TimeNanosecond"] = -22] = "TimeNanosecond";
  Type[Type["DenseUnion"] = -23] = "DenseUnion";
  Type[Type["SparseUnion"] = -24] = "SparseUnion";
  Type[Type["IntervalDayTime"] = -25] = "IntervalDayTime";
  Type[Type["IntervalYearMonth"] = -26] = "IntervalYearMonth";
})(Type || (Type = {}));

let _Symbol$toStringTag, _Symbol$toStringTag2, _Symbol$toStringTag7;
class DataType {
  static isNull(x) {
    return x && x.typeId === Type.Null;
  }

  static isInt(x) {
    return x && x.typeId === Type.Int;
  }

  static isFloat(x) {
    return x && x.typeId === Type.Float;
  }

  static isBinary(x) {
    return x && x.typeId === Type.Binary;
  }

  static isUtf8(x) {
    return x && x.typeId === Type.Utf8;
  }

  static isBool(x) {
    return x && x.typeId === Type.Bool;
  }

  static isDecimal(x) {
    return x && x.typeId === Type.Decimal;
  }

  static isDate(x) {
    return x && x.typeId === Type.Date;
  }

  static isTime(x) {
    return x && x.typeId === Type.Time;
  }

  static isTimestamp(x) {
    return x && x.typeId === Type.Timestamp;
  }

  static isInterval(x) {
    return x && x.typeId === Type.Interval;
  }

  static isList(x) {
    return x && x.typeId === Type.List;
  }

  static isStruct(x) {
    return x && x.typeId === Type.Struct;
  }

  static isUnion(x) {
    return x && x.typeId === Type.Union;
  }

  static isFixedSizeBinary(x) {
    return x && x.typeId === Type.FixedSizeBinary;
  }

  static isFixedSizeList(x) {
    return x && x.typeId === Type.FixedSizeList;
  }

  static isMap(x) {
    return x && x.typeId === Type.Map;
  }

  static isDictionary(x) {
    return x && x.typeId === Type.Dictionary;
  }

  get typeId() {
    return Type.NONE;
  }

  compareTo(other) {
    return this === other;
  }

}
_Symbol$toStringTag = Symbol.toStringTag;
class Int extends DataType {
  constructor(isSigned, bitWidth) {
    super();

    _defineProperty(this, "isSigned", void 0);

    _defineProperty(this, "bitWidth", void 0);

    this.isSigned = isSigned;
    this.bitWidth = bitWidth;
  }

  get typeId() {
    return Type.Int;
  }

  get [_Symbol$toStringTag]() {
    return 'Int';
  }

  toString() {
    return "".concat(this.isSigned ? 'I' : 'Ui', "nt").concat(this.bitWidth);
  }

}
class Int8 extends Int {
  constructor() {
    super(true, 8);
  }

}
class Int16 extends Int {
  constructor() {
    super(true, 16);
  }

}
class Int32 extends Int {
  constructor() {
    super(true, 32);
  }

}
class Uint8 extends Int {
  constructor() {
    super(false, 8);
  }

}
class Uint16 extends Int {
  constructor() {
    super(false, 16);
  }

}
class Uint32 extends Int {
  constructor() {
    super(false, 32);
  }

}
const Precision = {
  HALF: 16,
  SINGLE: 32,
  DOUBLE: 64
};
_Symbol$toStringTag2 = Symbol.toStringTag;
class Float extends DataType {
  constructor(precision) {
    super();

    _defineProperty(this, "precision", void 0);

    this.precision = precision;
  }

  get typeId() {
    return Type.Float;
  }

  get [_Symbol$toStringTag2]() {
    return 'Float';
  }

  toString() {
    return "Float".concat(this.precision);
  }

}
class Float32 extends Float {
  constructor() {
    super(Precision.SINGLE);
  }

}
class Float64 extends Float {
  constructor() {
    super(Precision.DOUBLE);
  }

}
_Symbol$toStringTag7 = Symbol.toStringTag;
class FixedSizeList extends DataType {
  constructor(listSize, child) {
    super();

    _defineProperty(this, "listSize", void 0);

    _defineProperty(this, "children", void 0);

    this.listSize = listSize;
    this.children = [child];
  }

  get typeId() {
    return Type.FixedSizeList;
  }

  get valueType() {
    return this.children[0].type;
  }

  get valueField() {
    return this.children[0];
  }

  get [_Symbol$toStringTag7]() {
    return 'FixedSizeList';
  }

  toString() {
    return "FixedSizeList[".concat(this.listSize, "]<").concat(this.valueType, ">");
  }

}

function getArrowTypeFromTypedArray(array) {
  switch (array.constructor) {
    case Int8Array:
      return new Int8();

    case Uint8Array:
      return new Uint8();

    case Int16Array:
      return new Int16();

    case Uint16Array:
      return new Uint16();

    case Int32Array:
      return new Int32();

    case Uint32Array:
      return new Uint32();

    case Float32Array:
      return new Float32();

    case Float64Array:
      return new Float64();

    default:
      throw new Error('array type not supported');
  }
}

function makeSchemaFromAttributes(attributes, loaderData, indices) {
  const metadataMap = makeMetadata(loaderData.metadata);
  const fields = [];
  const namedLoaderDataAttributes = transformAttributesLoaderData(loaderData.attributes);

  for (const attributeName in attributes) {
    const attribute = attributes[attributeName];
    const field = getArrowFieldFromAttribute(attributeName, attribute, namedLoaderDataAttributes[attributeName]);
    fields.push(field);
  }

  if (indices) {
    const indicesField = getArrowFieldFromAttribute('indices', indices);
    fields.push(indicesField);
  }

  return new Schema(fields, metadataMap);
}

function transformAttributesLoaderData(loaderData) {
  const result = {};

  for (const key in loaderData) {
    const dracoAttribute = loaderData[key];
    result[dracoAttribute.name || 'undefined'] = dracoAttribute;
  }

  return result;
}

function getArrowFieldFromAttribute(attributeName, attribute, loaderData) {
  const metadataMap = loaderData ? makeMetadata(loaderData.metadata) : undefined;
  const type = getArrowTypeFromTypedArray(attribute.value);
  return new Field(attributeName, new FixedSizeList(attribute.size, new Field('value', type)), false, metadataMap);
}

function makeMetadata(metadata) {
  const metadataMap = new Map();

  for (const key in metadata) {
    metadataMap.set("".concat(key, ".string"), JSON.stringify(metadata[key]));
  }

  return metadataMap;
}

const DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP = {
  POSITION: 'POSITION',
  NORMAL: 'NORMAL',
  COLOR: 'COLOR_0',
  TEX_COORD: 'TEXCOORD_0'
};
const DRACO_DATA_TYPE_TO_TYPED_ARRAY_MAP = {
  1: Int8Array,
  2: Uint8Array,
  3: Int16Array,
  4: Uint16Array,
  5: Int32Array,
  6: Uint32Array,
  9: Float32Array
};
const INDEX_ITEM_SIZE = 4;
class DracoParser {
  constructor(draco) {
    _defineProperty(this, "draco", void 0);

    _defineProperty(this, "decoder", void 0);

    _defineProperty(this, "metadataQuerier", void 0);

    this.draco = draco;
    this.decoder = new this.draco.Decoder();
    this.metadataQuerier = new this.draco.MetadataQuerier();
  }

  destroy() {
    this.draco.destroy(this.decoder);
    this.draco.destroy(this.metadataQuerier);
  }

  parseSync(arrayBuffer, options = {}) {
    const buffer = new this.draco.DecoderBuffer();
    buffer.Init(new Int8Array(arrayBuffer), arrayBuffer.byteLength);

    this._disableAttributeTransforms(options);

    const geometry_type = this.decoder.GetEncodedGeometryType(buffer);
    const dracoGeometry = geometry_type === this.draco.TRIANGULAR_MESH ? new this.draco.Mesh() : new this.draco.PointCloud();

    try {
      let dracoStatus;

      switch (geometry_type) {
        case this.draco.TRIANGULAR_MESH:
          dracoStatus = this.decoder.DecodeBufferToMesh(buffer, dracoGeometry);
          break;

        case this.draco.POINT_CLOUD:
          dracoStatus = this.decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
          break;

        default:
          throw new Error('DRACO: Unknown geometry type.');
      }

      if (!dracoStatus.ok() || !dracoGeometry.ptr) {
        const message = "DRACO decompression failed: ".concat(dracoStatus.error_msg());
        throw new Error(message);
      }

      const loaderData = this._getDracoLoaderData(dracoGeometry, geometry_type, options);

      const geometry = this._getMeshData(dracoGeometry, loaderData, options);

      const boundingBox = getMeshBoundingBox(geometry.attributes);
      const schema = makeSchemaFromAttributes(geometry.attributes, loaderData, geometry.indices);
      const data = {
        loader: 'draco',
        loaderData,
        header: {
          vertexCount: dracoGeometry.num_points(),
          boundingBox
        },
        ...geometry,
        schema
      };
      return data;
    } finally {
      this.draco.destroy(buffer);

      if (dracoGeometry) {
        this.draco.destroy(dracoGeometry);
      }
    }
  }

  _getDracoLoaderData(dracoGeometry, geometry_type, options) {
    const metadata = this._getTopLevelMetadata(dracoGeometry);

    const attributes = this._getDracoAttributes(dracoGeometry, options);

    return {
      geometry_type,
      num_attributes: dracoGeometry.num_attributes(),
      num_points: dracoGeometry.num_points(),
      num_faces: dracoGeometry instanceof this.draco.Mesh ? dracoGeometry.num_faces() : 0,
      metadata,
      attributes
    };
  }

  _getDracoAttributes(dracoGeometry, options) {
    const dracoAttributes = {};

    for (let attributeId = 0; attributeId < dracoGeometry.num_attributes(); attributeId++) {
      const dracoAttribute = this.decoder.GetAttribute(dracoGeometry, attributeId);

      const metadata = this._getAttributeMetadata(dracoGeometry, attributeId);

      dracoAttributes[dracoAttribute.unique_id()] = {
        unique_id: dracoAttribute.unique_id(),
        attribute_type: dracoAttribute.attribute_type(),
        data_type: dracoAttribute.data_type(),
        num_components: dracoAttribute.num_components(),
        byte_offset: dracoAttribute.byte_offset(),
        byte_stride: dracoAttribute.byte_stride(),
        normalized: dracoAttribute.normalized(),
        metadata
      };

      const quantization = this._getQuantizationTransform(dracoAttribute, options);

      if (quantization) {
        dracoAttributes[dracoAttribute.unique_id()].quantization_transform = quantization;
      }

      const octahedron = this._getOctahedronTransform(dracoAttribute, options);

      if (octahedron) {
        dracoAttributes[dracoAttribute.unique_id()].octahedron_transform = octahedron;
      }
    }

    return dracoAttributes;
  }

  _getMeshData(dracoGeometry, loaderData, options) {
    const attributes = this._getMeshAttributes(loaderData, dracoGeometry, options);

    const positionAttribute = attributes.POSITION;

    if (!positionAttribute) {
      throw new Error('DRACO: No position attribute found.');
    }

    if (dracoGeometry instanceof this.draco.Mesh) {
      switch (options.topology) {
        case 'triangle-strip':
          return {
            topology: 'triangle-strip',
            mode: 4,
            attributes,
            indices: {
              value: this._getTriangleStripIndices(dracoGeometry),
              size: 1
            }
          };

        case 'triangle-list':
        default:
          return {
            topology: 'triangle-list',
            mode: 5,
            attributes,
            indices: {
              value: this._getTriangleListIndices(dracoGeometry),
              size: 1
            }
          };
      }
    }

    return {
      topology: 'point-list',
      mode: 0,
      attributes
    };
  }

  _getMeshAttributes(loaderData, dracoGeometry, options) {
    const attributes = {};

    for (const loaderAttribute of Object.values(loaderData.attributes)) {
      const attributeName = this._deduceAttributeName(loaderAttribute, options);

      loaderAttribute.name = attributeName;

      const {
        value,
        size
      } = this._getAttributeValues(dracoGeometry, loaderAttribute);

      attributes[attributeName] = {
        value,
        size,
        byteOffset: loaderAttribute.byte_offset,
        byteStride: loaderAttribute.byte_stride,
        normalized: loaderAttribute.normalized
      };
    }

    return attributes;
  }

  _getTriangleListIndices(dracoGeometry) {
    const numFaces = dracoGeometry.num_faces();
    const numIndices = numFaces * 3;
    const byteLength = numIndices * INDEX_ITEM_SIZE;

    const ptr = this.draco._malloc(byteLength);

    try {
      this.decoder.GetTrianglesUInt32Array(dracoGeometry, byteLength, ptr);
      return new Uint32Array(this.draco.HEAPF32.buffer, ptr, numIndices).slice();
    } finally {
      this.draco._free(ptr);
    }
  }

  _getTriangleStripIndices(dracoGeometry) {
    const dracoArray = new this.draco.DracoInt32Array();

    try {
      this.decoder.GetTriangleStripsFromMesh(dracoGeometry, dracoArray);
      return getUint32Array(dracoArray);
    } finally {
      this.draco.destroy(dracoArray);
    }
  }

  _getAttributeValues(dracoGeometry, attribute) {
    const TypedArrayCtor = DRACO_DATA_TYPE_TO_TYPED_ARRAY_MAP[attribute.data_type];
    const numComponents = attribute.num_components;
    const numPoints = dracoGeometry.num_points();
    const numValues = numPoints * numComponents;
    const byteLength = numValues * TypedArrayCtor.BYTES_PER_ELEMENT;
    const dataType = getDracoDataType(this.draco, TypedArrayCtor);
    let value;

    const ptr = this.draco._malloc(byteLength);

    try {
      const dracoAttribute = this.decoder.GetAttribute(dracoGeometry, attribute.unique_id);
      this.decoder.GetAttributeDataArrayForAllPoints(dracoGeometry, dracoAttribute, dataType, byteLength, ptr);
      value = new TypedArrayCtor(this.draco.HEAPF32.buffer, ptr, numValues).slice();
    } finally {
      this.draco._free(ptr);
    }

    return {
      value,
      size: numComponents
    };
  }

  _deduceAttributeName(attribute, options) {
    const uniqueId = attribute.unique_id;

    for (const [attributeName, attributeUniqueId] of Object.entries(options.extraAttributes || {})) {
      if (attributeUniqueId === uniqueId) {
        return attributeName;
      }
    }

    const thisAttributeType = attribute.attribute_type;

    for (const dracoAttributeConstant in DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP) {
      const attributeType = this.draco[dracoAttributeConstant];

      if (attributeType === thisAttributeType) {
        return DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP[dracoAttributeConstant];
      }
    }

    const entryName = options.attributeNameEntry || 'name';

    if (attribute.metadata[entryName]) {
      return attribute.metadata[entryName].string;
    }

    return "CUSTOM_ATTRIBUTE_".concat(uniqueId);
  }

  _getTopLevelMetadata(dracoGeometry) {
    const dracoMetadata = this.decoder.GetMetadata(dracoGeometry);
    return this._getDracoMetadata(dracoMetadata);
  }

  _getAttributeMetadata(dracoGeometry, attributeId) {
    const dracoMetadata = this.decoder.GetAttributeMetadata(dracoGeometry, attributeId);
    return this._getDracoMetadata(dracoMetadata);
  }

  _getDracoMetadata(dracoMetadata) {
    if (!dracoMetadata || !dracoMetadata.ptr) {
      return {};
    }

    const result = {};
    const numEntries = this.metadataQuerier.NumEntries(dracoMetadata);

    for (let entryIndex = 0; entryIndex < numEntries; entryIndex++) {
      const entryName = this.metadataQuerier.GetEntryName(dracoMetadata, entryIndex);
      result[entryName] = this._getDracoMetadataField(dracoMetadata, entryName);
    }

    return result;
  }

  _getDracoMetadataField(dracoMetadata, entryName) {
    const dracoArray = new this.draco.DracoInt32Array();

    try {
      this.metadataQuerier.GetIntEntryArray(dracoMetadata, entryName, dracoArray);
      const intArray = getInt32Array(dracoArray);
      return {
        int: this.metadataQuerier.GetIntEntry(dracoMetadata, entryName),
        string: this.metadataQuerier.GetStringEntry(dracoMetadata, entryName),
        double: this.metadataQuerier.GetDoubleEntry(dracoMetadata, entryName),
        intArray
      };
    } finally {
      this.draco.destroy(dracoArray);
    }
  }

  _disableAttributeTransforms(options) {
    const {
      quantizedAttributes = [],
      octahedronAttributes = []
    } = options;
    const skipAttributes = [...quantizedAttributes, ...octahedronAttributes];

    for (const dracoAttributeName of skipAttributes) {
      this.decoder.SkipAttributeTransform(this.draco[dracoAttributeName]);
    }
  }

  _getQuantizationTransform(dracoAttribute, options) {
    const {
      quantizedAttributes = []
    } = options;
    const attribute_type = dracoAttribute.attribute_type();
    const skip = quantizedAttributes.map(type => this.decoder[type]).includes(attribute_type);

    if (skip) {
      const transform = new this.draco.AttributeQuantizationTransform();

      try {
        if (transform.InitFromAttribute(dracoAttribute)) {
          return {
            quantization_bits: transform.quantization_bits(),
            range: transform.range(),
            min_values: new Float32Array([1, 2, 3]).map(i => transform.min_value(i))
          };
        }
      } finally {
        this.draco.destroy(transform);
      }
    }

    return null;
  }

  _getOctahedronTransform(dracoAttribute, options) {
    const {
      octahedronAttributes = []
    } = options;
    const attribute_type = dracoAttribute.attribute_type();
    const octahedron = octahedronAttributes.map(type => this.decoder[type]).includes(attribute_type);

    if (octahedron) {
      const transform = new this.draco.AttributeQuantizationTransform();

      try {
        if (transform.InitFromAttribute(dracoAttribute)) {
          return {
            quantization_bits: transform.quantization_bits()
          };
        }
      } finally {
        this.draco.destroy(transform);
      }
    }

    return null;
  }

}

function getDracoDataType(draco, attributeType) {
  switch (attributeType) {
    case Float32Array:
      return draco.DT_FLOAT32;

    case Int8Array:
      return draco.DT_INT8;

    case Int16Array:
      return draco.DT_INT16;

    case Int32Array:
      return draco.DT_INT32;

    case Uint8Array:
      return draco.DT_UINT8;

    case Uint16Array:
      return draco.DT_UINT16;

    case Uint32Array:
      return draco.DT_UINT32;

    default:
      return draco.DT_INVALID;
  }
}

function getInt32Array(dracoArray) {
  const numValues = dracoArray.size();
  const intArray = new Int32Array(numValues);

  for (let i = 0; i < numValues; i++) {
    intArray[i] = dracoArray.GetValue(i);
  }

  return intArray;
}

function getUint32Array(dracoArray) {
  const numValues = dracoArray.size();
  const intArray = new Int32Array(numValues);

  for (let i = 0; i < numValues; i++) {
    intArray[i] = dracoArray.GetValue(i);
  }

  return intArray;
}

const DRACO_VERSION = '1.4.1';
const DRACO_JS_DECODER_URL = "https://www.gstatic.com/draco/versioned/decoders/".concat(DRACO_VERSION, "/draco_decoder.js");
const DRACO_WASM_WRAPPER_URL = "https://www.gstatic.com/draco/versioned/decoders/".concat(DRACO_VERSION, "/draco_wasm_wrapper.js");
const DRACO_WASM_DECODER_URL = "https://www.gstatic.com/draco/versioned/decoders/".concat(DRACO_VERSION, "/draco_decoder.wasm");
let loadDecoderPromise;
async function loadDracoDecoderModule(options) {
  const modules = options.modules || {};

  if (modules.draco3d) {
    loadDecoderPromise = loadDecoderPromise || modules.draco3d.createDecoderModule({}).then(draco => {
      return {
        draco
      };
    });
  } else {
    loadDecoderPromise = loadDecoderPromise || loadDracoDecoder(options);
  }

  return await loadDecoderPromise;
}

async function loadDracoDecoder(options) {
  let DracoDecoderModule;
  let wasmBinary;

  switch (options.draco && options.draco.decoderType) {
    case 'js':
      DracoDecoderModule = await loadLibrary(DRACO_JS_DECODER_URL, 'draco', options);
      break;

    case 'wasm':
    default:
      [DracoDecoderModule, wasmBinary] = await Promise.all([await loadLibrary(DRACO_WASM_WRAPPER_URL, 'draco', options), await loadLibrary(DRACO_WASM_DECODER_URL, 'draco', options)]);
  }

  DracoDecoderModule = DracoDecoderModule || globalThis.DracoDecoderModule;
  return await initializeDracoDecoder(DracoDecoderModule, wasmBinary);
}

function initializeDracoDecoder(DracoDecoderModule, wasmBinary) {
  const options = {};

  if (wasmBinary) {
    options.wasmBinary = wasmBinary;
  }

  return new Promise(resolve => {
    DracoDecoderModule({ ...options,
      onModuleLoaded: draco => resolve({
        draco
      })
    });
  });
}

const VERSION$2 = "3.0.0-beta.3" ;

const DEFAULT_DRACO_OPTIONS = {
  draco: {
    decoderType: typeof WebAssembly === 'object' ? 'wasm' : 'js',
    libraryPath: 'libs/',
    extraAttributes: {},
    attributeNameEntry: undefined
  }
};
const DracoWorkerLoader = {
  name: 'Draco',
  id: 'draco',
  module: 'draco',
  version: VERSION$2,
  worker: true,
  extensions: ['drc'],
  mimeTypes: ['application/octet-stream'],
  binary: true,
  tests: ['DRACO'],
  options: DEFAULT_DRACO_OPTIONS
};
const DracoLoader = { ...DracoWorkerLoader,
  parse: parse$2
};

async function parse$2(arrayBuffer, options) {
  const {
    draco
  } = await loadDracoDecoderModule(options);
  const dracoParser = new DracoParser(draco);

  try {
    return dracoParser.parseSync(arrayBuffer, options === null || options === void 0 ? void 0 : options.draco);
  } finally {
    dracoParser.destroy();
  }
}

const GL_PRIMITIVE_MODE = {
  POINTS: 0x0000,
  LINES: 0x0001,
  LINE_LOOP: 0x0002,
  LINE_STRIP: 0x0003,
  TRIANGLES: 0x0004,
  TRIANGLE_STRIP: 0x0005,
  TRIANGLE_FAN: 0x0006
};
const GL_TYPE = {
  BYTE: 5120,
  UNSIGNED_BYTE: 5121,
  SHORT: 5122,
  UNSIGNED_SHORT: 5123,
  INT: 5124,
  UNSIGNED_INT: 5125,
  FLOAT: 5126,
  DOUBLE: 5130
};
const GL$1 = { ...GL_PRIMITIVE_MODE,
  ...GL_TYPE
};

const GL_TYPE_TO_ARRAY_TYPE = {
  [GL_TYPE.DOUBLE]: Float64Array,
  [GL_TYPE.FLOAT]: Float32Array,
  [GL_TYPE.UNSIGNED_SHORT]: Uint16Array,
  [GL_TYPE.UNSIGNED_INT]: Uint32Array,
  [GL_TYPE.UNSIGNED_BYTE]: Uint8Array,
  [GL_TYPE.BYTE]: Int8Array,
  [GL_TYPE.SHORT]: Int16Array,
  [GL_TYPE.INT]: Int32Array
};
const NAME_TO_GL_TYPE = {
  DOUBLE: GL_TYPE.DOUBLE,
  FLOAT: GL_TYPE.FLOAT,
  UNSIGNED_SHORT: GL_TYPE.UNSIGNED_SHORT,
  UNSIGNED_INT: GL_TYPE.UNSIGNED_INT,
  UNSIGNED_BYTE: GL_TYPE.UNSIGNED_BYTE,
  BYTE: GL_TYPE.BYTE,
  SHORT: GL_TYPE.SHORT,
  INT: GL_TYPE.INT
};
const ERR_TYPE_CONVERSION = 'Failed to convert GL type';
class GLType {
  static fromTypedArray(arrayOrType) {
    arrayOrType = ArrayBuffer.isView(arrayOrType) ? arrayOrType.constructor : arrayOrType;

    for (const glType in GL_TYPE_TO_ARRAY_TYPE) {
      const ArrayType = GL_TYPE_TO_ARRAY_TYPE[glType];

      if (ArrayType === arrayOrType) {
        return glType;
      }
    }

    throw new Error(ERR_TYPE_CONVERSION);
  }

  static fromName(name) {
    const glType = NAME_TO_GL_TYPE[name];

    if (!glType) {
      throw new Error(ERR_TYPE_CONVERSION);
    }

    return glType;
  }

  static getArrayType(glType, clamped = false) {
    switch (glType) {
      case GL_TYPE.UNSIGNED_SHORT_5_6_5:
      case GL_TYPE.UNSIGNED_SHORT_4_4_4_4:
      case GL_TYPE.UNSIGNED_SHORT_5_5_5_1:
        return Uint16Array;

      default:
        const ArrayType = GL_TYPE_TO_ARRAY_TYPE[glType];

        if (!ArrayType) {
          throw new Error(ERR_TYPE_CONVERSION);
        }

        return ArrayType;
    }
  }

  static getByteSize(glType) {
    const ArrayType = GLType.getArrayType(glType);
    return ArrayType.BYTES_PER_ELEMENT;
  }

  static validate(glType) {
    return Boolean(GLType.getArrayType(glType));
  }

  static createTypedArray(glType, buffer, byteOffset = 0, length) {
    if (length === undefined) {
      length = (buffer.byteLength - byteOffset) / GLType.getByteSize(glType);
    }

    const ArrayType = GLType.getArrayType(glType);
    return new ArrayType(buffer, byteOffset, length);
  }

}

function assert$3(condition, message) {
  if (!condition) {
    throw new Error("math.gl assertion failed. ".concat(message));
  }
}

function decodeRGB565(rgb565, target = [0, 0, 0]) {
  const r5 = rgb565 >> 11 & 31;
  const g6 = rgb565 >> 5 & 63;
  const b5 = rgb565 & 31;
  target[0] = r5 << 3;
  target[1] = g6 << 2;
  target[2] = b5 << 3;
  return target;
}

new Vector2();
new Vector3();
new Vector2();
new Vector2();

function fromSNorm(value, rangeMaximum = 255) {
  return clamp(value, 0.0, rangeMaximum) / rangeMaximum * 2.0 - 1.0;
}

function signNotZero(value) {
  return value < 0.0 ? -1.0 : 1.0;
}
function octDecodeInRange(x, y, rangeMax, result) {
  assert$3(result);

  if (x < 0 || x > rangeMax || y < 0 || y > rangeMax) {
    throw new Error("x and y must be unsigned normalized integers between 0 and ".concat(rangeMax));
  }

  result.x = fromSNorm(x, rangeMax);
  result.y = fromSNorm(y, rangeMax);
  result.z = 1.0 - (Math.abs(result.x) + Math.abs(result.y));

  if (result.z < 0.0) {
    const oldVX = result.x;
    result.x = (1.0 - Math.abs(result.y)) * signNotZero(oldVX);
    result.y = (1.0 - Math.abs(oldVX)) * signNotZero(result.y);
  }

  return result.normalize();
}
function octDecode(x, y, result) {
  return octDecodeInRange(x, y, 255, result);
}

class Tile3DFeatureTable {
  constructor(featureTableJson, featureTableBinary) {
    this.json = featureTableJson;
    this.buffer = featureTableBinary;
    this.featuresLength = 0;
    this._cachedTypedArrays = {};
  }

  getExtension(extensionName) {
    return this.json.extensions && this.json.extensions[extensionName];
  }

  hasProperty(propertyName) {
    return Boolean(this.json[propertyName]);
  }

  getGlobalProperty(propertyName, componentType = GL$1.UNSIGNED_INT, componentLength = 1) {
    const jsonValue = this.json[propertyName];

    if (jsonValue && Number.isFinite(jsonValue.byteOffset)) {
      return this._getTypedArrayFromBinary(propertyName, componentType, componentLength, 1, jsonValue.byteOffset);
    }

    return jsonValue;
  }

  getPropertyArray(propertyName, componentType, componentLength) {
    const jsonValue = this.json[propertyName];

    if (jsonValue && Number.isFinite(jsonValue.byteOffset)) {
      if ('componentType' in jsonValue) {
        componentType = GLType.fromName(jsonValue.componentType);
      }

      return this._getTypedArrayFromBinary(propertyName, componentType, componentLength, this.featuresLength, jsonValue.byteOffset);
    }

    return this._getTypedArrayFromArray(propertyName, componentType, jsonValue);
  }

  getProperty(propertyName, componentType, componentLength, featureId, result) {
    const jsonValue = this.json[propertyName];

    if (!jsonValue) {
      return jsonValue;
    }

    const typedArray = this.getPropertyArray(propertyName, componentType, componentLength);

    if (componentLength === 1) {
      return typedArray[featureId];
    }

    for (let i = 0; i < componentLength; ++i) {
      result[i] = typedArray[componentLength * featureId + i];
    }

    return result;
  }

  _getTypedArrayFromBinary(propertyName, componentType, componentLength, count, byteOffset) {
    const cachedTypedArrays = this._cachedTypedArrays;
    let typedArray = cachedTypedArrays[propertyName];

    if (!typedArray) {
      typedArray = GLType.createTypedArray(componentType, this.buffer.buffer, this.buffer.byteOffset + byteOffset, count * componentLength);
      cachedTypedArrays[propertyName] = typedArray;
    }

    return typedArray;
  }

  _getTypedArrayFromArray(propertyName, componentType, array) {
    const cachedTypedArrays = this._cachedTypedArrays;
    let typedArray = cachedTypedArrays[propertyName];

    if (!typedArray) {
      typedArray = GLType.createTypedArray(componentType, array);
      cachedTypedArrays[propertyName] = typedArray;
    }

    return typedArray;
  }

}

const COMPONENTS_PER_ATTRIBUTE = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};
const UNPACKER = {
  SCALAR: (values, i) => values[i],
  VEC2: (values, i) => [values[2 * i + 0], values[2 * i + 1]],
  VEC3: (values, i) => [values[3 * i + 0], values[3 * i + 1], values[3 * i + 2]],
  VEC4: (values, i) => [values[4 * i + 0], values[4 * i + 1], values[4 * i + 2], values[4 * i + 3]],
  MAT2: (values, i) => [values[4 * i + 0], values[4 * i + 1], values[4 * i + 2], values[4 * i + 3]],
  MAT3: (values, i) => [values[9 * i + 0], values[9 * i + 1], values[9 * i + 2], values[9 * i + 3], values[9 * i + 4], values[9 * i + 5], values[9 * i + 6], values[9 * i + 7], values[9 * i + 8]],
  MAT4: (values, i) => [values[16 * i + 0], values[16 * i + 1], values[16 * i + 2], values[16 * i + 3], values[16 * i + 4], values[16 * i + 5], values[16 * i + 6], values[16 * i + 7], values[16 * i + 8], values[16 * i + 9], values[16 * i + 10], values[16 * i + 11], values[16 * i + 12], values[16 * i + 13], values[16 * i + 14], values[16 * i + 15]]
};
const PACKER = {
  SCALAR: (x, values, i) => {
    values[i] = x;
  },
  VEC2: (x, values, i) => {
    values[2 * i + 0] = x[0];
    values[2 * i + 1] = x[1];
  },
  VEC3: (x, values, i) => {
    values[3 * i + 0] = x[0];
    values[3 * i + 1] = x[1];
    values[3 * i + 2] = x[2];
  },
  VEC4: (x, values, i) => {
    values[4 * i + 0] = x[0];
    values[4 * i + 1] = x[1];
    values[4 * i + 2] = x[2];
    values[4 * i + 3] = x[3];
  },
  MAT2: (x, values, i) => {
    values[4 * i + 0] = x[0];
    values[4 * i + 1] = x[1];
    values[4 * i + 2] = x[2];
    values[4 * i + 3] = x[3];
  },
  MAT3: (x, values, i) => {
    values[9 * i + 0] = x[0];
    values[9 * i + 1] = x[1];
    values[9 * i + 2] = x[2];
    values[9 * i + 3] = x[3];
    values[9 * i + 4] = x[4];
    values[9 * i + 5] = x[5];
    values[9 * i + 6] = x[6];
    values[9 * i + 7] = x[7];
    values[9 * i + 8] = x[8];
    values[9 * i + 9] = x[9];
  },
  MAT4: (x, values, i) => {
    values[16 * i + 0] = x[0];
    values[16 * i + 1] = x[1];
    values[16 * i + 2] = x[2];
    values[16 * i + 3] = x[3];
    values[16 * i + 4] = x[4];
    values[16 * i + 5] = x[5];
    values[16 * i + 6] = x[6];
    values[16 * i + 7] = x[7];
    values[16 * i + 8] = x[8];
    values[16 * i + 9] = x[9];
    values[16 * i + 10] = x[10];
    values[16 * i + 11] = x[11];
    values[16 * i + 12] = x[12];
    values[16 * i + 13] = x[13];
    values[16 * i + 14] = x[14];
    values[16 * i + 15] = x[15];
  }
};
function createTypedArrayFromAccessor(tile3DAccessor, buffer, byteOffset, length) {
  const {
    componentType
  } = tile3DAccessor;
  assert$7(tile3DAccessor.componentType);
  const type = typeof componentType === 'string' ? GLType.fromName(componentType) : componentType;
  const size = COMPONENTS_PER_ATTRIBUTE[tile3DAccessor.type];
  const unpacker = UNPACKER[tile3DAccessor.type];
  const packer = PACKER[tile3DAccessor.type];
  byteOffset += tile3DAccessor.byteOffset;
  const values = GLType.createTypedArray(type, buffer, byteOffset, size * length);
  return {
    values,
    type,
    size,
    unpacker,
    packer
  };
}

const defined$1 = x => x !== undefined;

function initializeHierarchy(batchTable, jsonHeader, binaryBody) {
  if (!jsonHeader) {
    return null;
  }

  let hierarchy = batchTable.getExtension('3DTILES_batch_table_hierarchy');
  const legacyHierarchy = jsonHeader.HIERARCHY;

  if (legacyHierarchy) {
    console.warn('3D Tile Parser: HIERARCHY is deprecated. Use 3DTILES_batch_table_hierarchy.');
    jsonHeader.extensions = jsonHeader.extensions || {};
    jsonHeader.extensions['3DTILES_batch_table_hierarchy'] = legacyHierarchy;
    hierarchy = legacyHierarchy;
  }

  if (!hierarchy) {
    return null;
  }

  return initializeHierarchyValues(hierarchy, binaryBody);
}

function initializeHierarchyValues(hierarchyJson, binaryBody) {
  let i;
  let classId;
  let binaryAccessor;
  const instancesLength = hierarchyJson.instancesLength;
  const classes = hierarchyJson.classes;
  const classIds = hierarchyJson.classIds;
  const parentCounts = hierarchyJson.parentCounts;
  const parentIds = hierarchyJson.parentIds;
  const parentIdsLength = instancesLength;

  if (defined$1(classIds.byteOffset)) {
    classIds.componentType = defaultValue(classIds.componentType, GL.UNSIGNED_SHORT);
    classIds.type = AttributeType.SCALAR;
    binaryAccessor = getBinaryAccessor(classIds);
    classIds = binaryAccessor.createArrayBufferView(binaryBody.buffer, binaryBody.byteOffset + classIds.byteOffset, instancesLength);
  }

  let parentIndexes;

  if (defined$1(parentCounts)) {
    if (defined$1(parentCounts.byteOffset)) {
      parentCounts.componentType = defaultValue(parentCounts.componentType, GL.UNSIGNED_SHORT);
      parentCounts.type = AttributeType.SCALAR;
      binaryAccessor = getBinaryAccessor(parentCounts);
      parentCounts = binaryAccessor.createArrayBufferView(binaryBody.buffer, binaryBody.byteOffset + parentCounts.byteOffset, instancesLength);
    }

    parentIndexes = new Uint16Array(instancesLength);
    parentIdsLength = 0;

    for (i = 0; i < instancesLength; ++i) {
      parentIndexes[i] = parentIdsLength;
      parentIdsLength += parentCounts[i];
    }
  }

  if (defined$1(parentIds) && defined$1(parentIds.byteOffset)) {
    parentIds.componentType = defaultValue(parentIds.componentType, GL.UNSIGNED_SHORT);
    parentIds.type = AttributeType.SCALAR;
    binaryAccessor = getBinaryAccessor(parentIds);
    parentIds = binaryAccessor.createArrayBufferView(binaryBody.buffer, binaryBody.byteOffset + parentIds.byteOffset, parentIdsLength);
  }

  const classesLength = classes.length;

  for (i = 0; i < classesLength; ++i) {
    const classInstancesLength = classes[i].length;
    const properties = classes[i].instances;
    const binaryProperties = getBinaryProperties(classInstancesLength, properties, binaryBody);
    classes[i].instances = combine(binaryProperties, properties);
  }

  const classCounts = new Array(classesLength).fill(0);
  const classIndexes = new Uint16Array(instancesLength);

  for (i = 0; i < instancesLength; ++i) {
    classId = classIds[i];
    classIndexes[i] = classCounts[classId];
    ++classCounts[classId];
  }

  const hierarchy = {
    classes,
    classIds,
    classIndexes,
    parentCounts,
    parentIndexes,
    parentIds
  };
  validateHierarchy(hierarchy);
  return hierarchy;
}

function traverseHierarchy(hierarchy, instanceIndex, endConditionCallback) {
  if (!hierarchy) {
    return;
  }

  const parentCounts = hierarchy.parentCounts;
  const parentIds = hierarchy.parentIds;

  if (parentIds) {
    return endConditionCallback(hierarchy, instanceIndex);
  }

  if (parentCounts > 0) {
    return traverseHierarchyMultipleParents(hierarchy, instanceIndex, endConditionCallback);
  }

  return traverseHierarchySingleParent(hierarchy, instanceIndex, endConditionCallback);
}

function traverseHierarchyMultipleParents(hierarchy, instanceIndex, endConditionCallback) {
  const classIds = hierarchy.classIds;
  const parentCounts = hierarchy.parentCounts;
  const parentIds = hierarchy.parentIds;
  const parentIndexes = hierarchy.parentIndexes;
  const instancesLength = classIds.length;
  const visited = scratchVisited;
  visited.length = Math.max(visited.length, instancesLength);
  const visitedMarker = ++marker;
  const stack = scratchStack;
  stack.length = 0;
  stack.push(instanceIndex);

  while (stack.length > 0) {
    instanceIndex = stack.pop();

    if (visited[instanceIndex] === visitedMarker) {
      continue;
    }

    visited[instanceIndex] = visitedMarker;
    const result = endConditionCallback(hierarchy, instanceIndex);

    if (defined$1(result)) {
      return result;
    }

    const parentCount = parentCounts[instanceIndex];
    const parentIndex = parentIndexes[instanceIndex];

    for (let i = 0; i < parentCount; ++i) {
      const parentId = parentIds[parentIndex + i];

      if (parentId !== instanceIndex) {
        stack.push(parentId);
      }
    }
  }

  return null;
}

function traverseHierarchySingleParent(hierarchy, instanceIndex, endConditionCallback) {
  let hasParent = true;

  while (hasParent) {
    const result = endConditionCallback(hierarchy, instanceIndex);

    if (defined$1(result)) {
      return result;
    }

    const parentId = hierarchy.parentIds[instanceIndex];
    hasParent = parentId !== instanceIndex;
    instanceIndex = parentId;
  }

  throw new Error('traverseHierarchySingleParent');
}

function validateHierarchy(hierarchy) {
  const classIds = hierarchy.classIds;
  const instancesLength = classIds.length;

  for (let i = 0; i < instancesLength; ++i) {
    validateInstance(hierarchy, i, stack);
  }
}

function validateInstance(hierarchy, instanceIndex, stack) {
  const parentCounts = hierarchy.parentCounts;
  const parentIds = hierarchy.parentIds;
  const parentIndexes = hierarchy.parentIndexes;
  const classIds = hierarchy.classIds;
  const instancesLength = classIds.length;

  if (!defined$1(parentIds)) {
    return;
  }

  assert(instanceIndex < instancesLength, "Parent index ".concat(instanceIndex, " exceeds the total number of instances: ").concat(instancesLength));
  assert(stack.indexOf(instanceIndex) === -1, 'Circular dependency detected in the batch table hierarchy.');
  stack.push(instanceIndex);
  const parentCount = defined$1(parentCounts) ? parentCounts[instanceIndex] : 1;
  const parentIndex = defined$1(parentCounts) ? parentIndexes[instanceIndex] : instanceIndex;

  for (let i = 0; i < parentCount; ++i) {
    const parentId = parentIds[parentIndex + i];

    if (parentId !== instanceIndex) {
      validateInstance(hierarchy, parentId, stack);
    }
  }

  stack.pop(instanceIndex);
}

function defined(x) {
  return x !== undefined && x !== null;
}

const clone = (x, y) => x;

const IGNORED_PROPERTY_FIELDS = {
  HIERARCHY: true,
  extensions: true,
  extras: true
};
class Tile3DBatchTableParser {
  constructor(json, binary, featureCount, options = {}) {
    var _this$json;

    assert$7(featureCount >= 0);
    this.json = json || {};
    this.binary = binary;
    this.featureCount = featureCount;
    this._extensions = ((_this$json = this.json) === null || _this$json === void 0 ? void 0 : _this$json.extensions) || {};
    this._properties = {};

    for (const propertyName in this.json) {
      if (!IGNORED_PROPERTY_FIELDS[propertyName]) {
        this._properties[propertyName] = this.json[propertyName];
      }
    }

    this._binaryProperties = this._initializeBinaryProperties();

    if (options['3DTILES_batch_table_hierarchy']) {
      this._hierarchy = initializeHierarchy(this, this.json, this.binary);
    }
  }

  getExtension(extensionName) {
    return this.json && this.json.extensions && this.json.extensions[extensionName];
  }

  memorySizeInBytes() {
    return 0;
  }

  isClass(batchId, className) {
    this._checkBatchId(batchId);

    assert$7(typeof className === 'string', className);

    if (this._hierarchy) {
      const result = traverseHierarchy(this._hierarchy, batchId, (hierarchy, instanceIndex) => {
        const classId = hierarchy.classIds[instanceIndex];
        const instanceClass = hierarchy.classes[classId];
        return instanceClass.name === className;
      });
      return defined(result);
    }

    return false;
  }

  isExactClass(batchId, className) {
    assert$7(typeof className === 'string', className);
    return this.getExactClassName(batchId) === className;
  }

  getExactClassName(batchId) {
    this._checkBatchId(batchId);

    if (this._hierarchy) {
      const classId = this._hierarchy.classIds[batchId];
      const instanceClass = this._hierarchy.classes[classId];
      return instanceClass.name;
    }

    return undefined;
  }

  hasProperty(batchId, name) {
    this._checkBatchId(batchId);

    assert$7(typeof name === 'string', name);
    return defined(this._properties[name]) || this._hasPropertyInHierarchy(batchId, name);
  }

  getPropertyNames(batchId, results) {
    this._checkBatchId(batchId);

    results = defined(results) ? results : [];
    results.length = 0;
    const propertyNames = Object.keys(this._properties);
    results.push(...propertyNames);

    if (this._hierarchy) {
      this._getPropertyNamesInHierarchy(batchId, results);
    }

    return results;
  }

  getProperty(batchId, name) {
    this._checkBatchId(batchId);

    assert$7(typeof name === 'string', name);

    if (this._binaryProperties) {
      const binaryProperty = this._binaryProperties[name];

      if (defined(binaryProperty)) {
        return this._getBinaryProperty(binaryProperty, batchId);
      }
    }

    const propertyValues = this._properties[name];

    if (defined(propertyValues)) {
      return clone(propertyValues[batchId]);
    }

    if (this._hierarchy) {
      const hierarchyProperty = this._getHierarchyProperty(batchId, name);

      if (defined(hierarchyProperty)) {
        return hierarchyProperty;
      }
    }

    return undefined;
  }

  setProperty(batchId, name, value) {
    const featureCount = this.featureCount;

    this._checkBatchId(batchId);

    assert$7(typeof name === 'string', name);

    if (this._binaryProperties) {
      const binaryProperty = this._binaryProperties[name];

      if (binaryProperty) {
        this._setBinaryProperty(binaryProperty, batchId, value);

        return;
      }
    }

    if (this._hierarchy) {
      if (this._setHierarchyProperty(this, batchId, name, value)) {
        return;
      }
    }

    let propertyValues = this._properties[name];

    if (!defined(propertyValues)) {
      this._properties[name] = new Array(featureCount);
      propertyValues = this._properties[name];
    }

    propertyValues[batchId] = clone(value);
  }

  _checkBatchId(batchId) {
    const valid = batchId >= 0 && batchId < this.featureCount;

    if (!valid) {
      throw new Error("batchId not in range [0, featureCount - 1].");
    }
  }

  _getBinaryProperty(binaryProperty, index) {
    return binaryProperty.unpack(binaryProperty.typedArray, index);
  }

  _setBinaryProperty(binaryProperty, index, value) {
    binaryProperty.pack(value, binaryProperty.typedArray, index);
  }

  _initializeBinaryProperties() {
    let binaryProperties = null;

    for (const name in this._properties) {
      const property = this._properties[name];

      const binaryProperty = this._initializeBinaryProperty(name, property);

      if (binaryProperty) {
        binaryProperties = binaryProperties || {};
        binaryProperties[name] = binaryProperty;
      }
    }

    return binaryProperties;
  }

  _initializeBinaryProperty(name, property) {
    if ('byteOffset' in property) {
      const tile3DAccessor = property;
      assert$7(this.binary, "Property ".concat(name, " requires a batch table binary."));
      assert$7(tile3DAccessor.type, "Property ".concat(name, " requires a type."));
      const accessor = createTypedArrayFromAccessor(tile3DAccessor, this.binary.buffer, this.binary.byteOffset | 0, this.featureCount);
      return {
        typedArray: accessor.values,
        componentCount: accessor.size,
        unpack: accessor.unpacker,
        pack: accessor.packer
      };
    }

    return null;
  }

  _hasPropertyInHierarchy(batchId, name) {
    if (!this._hierarchy) {
      return false;
    }

    const result = traverseHierarchy(this._hierarchy, batchId, (hierarchy, instanceIndex) => {
      const classId = hierarchy.classIds[instanceIndex];
      const instances = hierarchy.classes[classId].instances;
      return defined(instances[name]);
    });
    return defined(result);
  }

  _getPropertyNamesInHierarchy(batchId, results) {
    traverseHierarchy(this._hierarchy, batchId, (hierarchy, instanceIndex) => {
      const classId = hierarchy.classIds[instanceIndex];
      const instances = hierarchy.classes[classId].instances;

      for (const name in instances) {
        if (instances.hasOwnProperty(name)) {
          if (results.indexOf(name) === -1) {
            results.push(name);
          }
        }
      }
    });
  }

  _getHierarchyProperty(batchId, name) {
    return traverseHierarchy(this._hierarchy, batchId, (hierarchy, instanceIndex) => {
      const classId = hierarchy.classIds[instanceIndex];
      const instanceClass = hierarchy.classes[classId];
      const indexInClass = hierarchy.classIndexes[instanceIndex];
      const propertyValues = instanceClass.instances[name];

      if (defined(propertyValues)) {
        if (defined(propertyValues.typedArray)) {
          return this._getBinaryProperty(propertyValues, indexInClass);
        }

        return clone(propertyValues[indexInClass]);
      }

      return null;
    });
  }

  _setHierarchyProperty(batchTable, batchId, name, value) {
    const result = traverseHierarchy(this._hierarchy, batchId, (hierarchy, instanceIndex) => {
      const classId = hierarchy.classIds[instanceIndex];
      const instanceClass = hierarchy.classes[classId];
      const indexInClass = hierarchy.classIndexes[instanceIndex];
      const propertyValues = instanceClass.instances[name];

      if (defined(propertyValues)) {
        assert$7(instanceIndex === batchId, "Inherited property \"".concat(name, "\" is read-only."));

        if (defined(propertyValues.typedArray)) {
          this._setBinaryProperty(propertyValues, indexInClass, value);
        } else {
          propertyValues[indexInClass] = clone(value);
        }

        return true;
      }

      return false;
    });
    return defined(result);
  }

}

const SIZEOF_UINT32$1 = 4;
function parse3DTileHeaderSync(tile, arrayBuffer, byteOffset = 0) {
  const view = new DataView(arrayBuffer);
  tile.magic = view.getUint32(byteOffset, true);
  byteOffset += SIZEOF_UINT32$1;
  tile.version = view.getUint32(byteOffset, true);
  byteOffset += SIZEOF_UINT32$1;
  tile.byteLength = view.getUint32(byteOffset, true);
  byteOffset += SIZEOF_UINT32$1;

  if (tile.version !== 1) {
    throw new Error("3D Tile Version ".concat(tile.version, " not supported"));
  }

  return byteOffset;
}

const SIZEOF_UINT32 = 4;
const DEPRECATION_WARNING = "b3dm tile in legacy format.";
function parse3DTileTablesHeaderSync(tile, arrayBuffer, byteOffset) {
  const view = new DataView(arrayBuffer);
  let batchLength;
  tile.header = tile.header || {};
  let featureTableJsonByteLength = view.getUint32(byteOffset, true);
  byteOffset += SIZEOF_UINT32;
  let featureTableBinaryByteLength = view.getUint32(byteOffset, true);
  byteOffset += SIZEOF_UINT32;
  let batchTableJsonByteLength = view.getUint32(byteOffset, true);
  byteOffset += SIZEOF_UINT32;
  let batchTableBinaryByteLength = view.getUint32(byteOffset, true);
  byteOffset += SIZEOF_UINT32;

  if (batchTableJsonByteLength >= 570425344) {
    byteOffset -= SIZEOF_UINT32 * 2;
    batchLength = featureTableJsonByteLength;
    batchTableJsonByteLength = featureTableBinaryByteLength;
    batchTableBinaryByteLength = 0;
    featureTableJsonByteLength = 0;
    featureTableBinaryByteLength = 0;
    console.warn(DEPRECATION_WARNING);
  } else if (batchTableBinaryByteLength >= 570425344) {
    byteOffset -= SIZEOF_UINT32;
    batchLength = batchTableJsonByteLength;
    batchTableJsonByteLength = featureTableJsonByteLength;
    batchTableBinaryByteLength = featureTableBinaryByteLength;
    featureTableJsonByteLength = 0;
    featureTableBinaryByteLength = 0;
    console.warn(DEPRECATION_WARNING);
  }

  tile.header.featureTableJsonByteLength = featureTableJsonByteLength;
  tile.header.featureTableBinaryByteLength = featureTableBinaryByteLength;
  tile.header.batchTableJsonByteLength = batchTableJsonByteLength;
  tile.header.batchTableBinaryByteLength = batchTableBinaryByteLength;
  tile.header.batchLength = batchLength;
  return byteOffset;
}
function parse3DTileTablesSync(tile, arrayBuffer, byteOffset, options) {
  byteOffset = parse3DTileFeatureTable(tile, arrayBuffer, byteOffset);
  byteOffset = parse3DTileBatchTable(tile, arrayBuffer, byteOffset);
  return byteOffset;
}

function parse3DTileFeatureTable(tile, arrayBuffer, byteOffset, options) {
  const {
    featureTableJsonByteLength,
    featureTableBinaryByteLength,
    batchLength
  } = tile.header;
  tile.featureTableJson = {
    BATCH_LENGTH: batchLength || 0
  };

  if (featureTableJsonByteLength > 0) {
    const featureTableString = getStringFromArrayBuffer(arrayBuffer, byteOffset, featureTableJsonByteLength);
    tile.featureTableJson = JSON.parse(featureTableString);
  }

  byteOffset += featureTableJsonByteLength;
  tile.featureTableBinary = new Uint8Array(arrayBuffer, byteOffset, featureTableBinaryByteLength);
  byteOffset += featureTableBinaryByteLength;
  return byteOffset;
}

function parse3DTileBatchTable(tile, arrayBuffer, byteOffset, options) {
  const {
    batchTableJsonByteLength,
    batchTableBinaryByteLength
  } = tile.header;

  if (batchTableJsonByteLength > 0) {
    const batchTableString = getStringFromArrayBuffer(arrayBuffer, byteOffset, batchTableJsonByteLength);
    tile.batchTableJson = JSON.parse(batchTableString);
    byteOffset += batchTableJsonByteLength;

    if (batchTableBinaryByteLength > 0) {
      tile.batchTableBinary = new Uint8Array(arrayBuffer, byteOffset, batchTableBinaryByteLength);
      tile.batchTableBinary = new Uint8Array(tile.batchTableBinary);
      byteOffset += batchTableBinaryByteLength;
    }
  }

  return byteOffset;
}

function normalize3DTileColorAttribute(tile, colors, batchTable) {
  if (!colors && (!tile || !tile.batchIds || !batchTable)) {
    return null;
  }

  const {
    batchIds,
    isRGB565,
    pointCount
  } = tile;

  if (batchIds && batchTable) {
    const colorArray = new Uint8ClampedArray(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      const batchId = batchIds[i];
      const dimensions = batchTable.getProperty(batchId, 'dimensions');
      const color = dimensions.map(d => d * 255);
      colorArray[i * 3] = color[0];
      colorArray[i * 3 + 1] = color[1];
      colorArray[i * 3 + 2] = color[2];
    }

    return {
      type: GL$1.UNSIGNED_BYTE,
      value: colorArray,
      size: 3,
      normalized: true
    };
  }

  if (isRGB565) {
    const colorArray = new Uint8ClampedArray(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      const color = decodeRGB565(colors[i]);
      colorArray[i * 3] = color[0];
      colorArray[i * 3 + 1] = color[1];
      colorArray[i * 3 + 2] = color[2];
    }

    return {
      type: GL$1.UNSIGNED_BYTE,
      value: colorArray,
      size: 3,
      normalized: true
    };
  }

  if (colors && colors.length === pointCount * 3) {
    return {
      type: GL$1.UNSIGNED_BYTE,
      value: colors,
      size: 3,
      normalized: true
    };
  }

  return {
    type: GL$1.UNSIGNED_BYTE,
    value: colors,
    size: 4,
    normalized: true
  };
}

const scratchNormal = new Vector3();
function normalize3DTileNormalAttribute(tile, normals) {
  if (!normals) {
    return null;
  }

  if (tile.isOctEncoded16P) {
    const decodedArray = new Float32Array(tile.pointsLength * 3);

    for (let i = 0; i < tile.pointsLength; i++) {
      octDecode(normals[i * 2], normals[i * 2 + 1], scratchNormal);
      scratchNormal.toArray(decodedArray, i * 3);
    }

    return {
      type: GL$1.FLOAT,
      size: 2,
      value: decodedArray
    };
  }

  return {
    type: GL$1.FLOAT,
    size: 2,
    value: normals
  };
}

function normalize3DTilePositionAttribute(tile, positions, options) {
  if (!tile.isQuantized) {
    return positions;
  }

  if (options['3d-tiles'] && options['3d-tiles'].decodeQuantizedPositions) {
    tile.isQuantized = false;
    return decodeQuantizedPositions(tile, positions);
  }

  return {
    type: GL$1.UNSIGNED_SHORT,
    value: positions,
    size: 3,
    normalized: true
  };
}

function decodeQuantizedPositions(tile, positions) {
  const scratchPosition = new Vector3();
  const decodedArray = new Float32Array(tile.pointCount * 3);

  for (let i = 0; i < tile.pointCount; i++) {
    scratchPosition.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]).scale(1 / tile.quantizedRange).multiply(tile.quantizedVolumeScale).add(tile.quantizedVolumeOffset).toArray(decodedArray, i * 3);
  }

  return decodedArray;
}

async function parsePointCloud3DTile(tile, arrayBuffer, byteOffset, options, context) {
  byteOffset = parse3DTileHeaderSync(tile, arrayBuffer, byteOffset);
  byteOffset = parse3DTileTablesHeaderSync(tile, arrayBuffer, byteOffset);
  byteOffset = parse3DTileTablesSync(tile, arrayBuffer, byteOffset);
  initializeTile(tile);
  const {
    featureTable,
    batchTable
  } = parsePointCloudTables(tile);
  await parseDraco(tile, featureTable, batchTable, options, context);
  parsePositions(tile, featureTable, options);
  parseColors(tile, featureTable, batchTable);
  parseNormals(tile, featureTable);
  return byteOffset;
}

function initializeTile(tile) {
  tile.attributes = {
    positions: null,
    colors: null,
    normals: null,
    batchIds: null
  };
  tile.isQuantized = false;
  tile.isTranslucent = false;
  tile.isRGB565 = false;
  tile.isOctEncoded16P = false;
}

function parsePointCloudTables(tile) {
  const featureTable = new Tile3DFeatureTable(tile.featureTableJson, tile.featureTableBinary);
  const pointsLength = featureTable.getGlobalProperty('POINTS_LENGTH');

  if (!Number.isFinite(pointsLength)) {
    throw new Error('POINTS_LENGTH must be defined');
  }

  featureTable.featuresLength = pointsLength;
  tile.featuresLength = pointsLength;
  tile.pointsLength = pointsLength;
  tile.pointCount = pointsLength;
  tile.rtcCenter = featureTable.getGlobalProperty('RTC_CENTER', GL$1.FLOAT, 3);
  const batchTable = parseBatchIds(tile, featureTable);
  return {
    featureTable,
    batchTable
  };
}

function parsePositions(tile, featureTable, options) {
  if (!tile.attributes.positions) {
    if (featureTable.hasProperty('POSITION')) {
      tile.attributes.positions = featureTable.getPropertyArray('POSITION', GL$1.FLOAT, 3);
    } else if (featureTable.hasProperty('POSITION_QUANTIZED')) {
      const positions = featureTable.getPropertyArray('POSITION_QUANTIZED', GL$1.UNSIGNED_SHORT, 3);
      tile.isQuantized = true;
      tile.quantizedRange = (1 << 16) - 1;
      tile.quantizedVolumeScale = featureTable.getGlobalProperty('QUANTIZED_VOLUME_SCALE', GL$1.FLOAT, 3);

      if (!tile.quantizedVolumeScale) {
        throw new Error('QUANTIZED_VOLUME_SCALE must be defined for quantized positions.');
      }

      tile.quantizedVolumeOffset = featureTable.getGlobalProperty('QUANTIZED_VOLUME_OFFSET', GL$1.FLOAT, 3);

      if (!tile.quantizedVolumeOffset) {
        throw new Error('QUANTIZED_VOLUME_OFFSET must be defined for quantized positions.');
      }

      tile.attributes.positions = normalize3DTilePositionAttribute(tile, positions, options);
    }
  }

  if (!tile.attributes.positions) {
    throw new Error('Either POSITION or POSITION_QUANTIZED must be defined.');
  }
}

function parseColors(tile, featureTable, batchTable) {
  if (!tile.attributes.colors) {
    let colors = null;

    if (featureTable.hasProperty('RGBA')) {
      colors = featureTable.getPropertyArray('RGBA', GL$1.UNSIGNED_BYTE, 4);
      tile.isTranslucent = true;
    } else if (featureTable.hasProperty('RGB')) {
      colors = featureTable.getPropertyArray('RGB', GL$1.UNSIGNED_BYTE, 3);
    } else if (featureTable.hasProperty('RGB565')) {
      colors = featureTable.getPropertyArray('RGB565', GL$1.UNSIGNED_SHORT, 1);
      tile.isRGB565 = true;
    }

    tile.attributes.colors = normalize3DTileColorAttribute(tile, colors, batchTable);
  }

  if (featureTable.hasProperty('CONSTANT_RGBA')) {
    tile.constantRGBA = featureTable.getGlobalProperty('CONSTANT_RGBA', GL$1.UNSIGNED_BYTE, 4);
  }
}

function parseNormals(tile, featureTable) {
  if (!tile.attributes.normals) {
    let normals = null;

    if (featureTable.hasProperty('NORMAL')) {
      normals = featureTable.getPropertyArray('NORMAL', GL$1.FLOAT, 3);
    } else if (featureTable.hasProperty('NORMAL_OCT16P')) {
      normals = featureTable.getPropertyArray('NORMAL_OCT16P', GL$1.UNSIGNED_BYTE, 2);
      tile.isOctEncoded16P = true;
    }

    tile.attributes.normals = normalize3DTileNormalAttribute(tile, normals);
  }
}

function parseBatchIds(tile, featureTable) {
  let batchTable = null;

  if (!tile.batchIds && featureTable.hasProperty('BATCH_ID')) {
    tile.batchIds = featureTable.getPropertyArray('BATCH_ID', GL$1.UNSIGNED_SHORT, 1);

    if (tile.batchIds) {
      const batchFeatureLength = featureTable.getGlobalProperty('BATCH_LENGTH');

      if (!batchFeatureLength) {
        throw new Error('Global property: BATCH_LENGTH must be defined when BATCH_ID is defined.');
      }

      const {
        batchTableJson,
        batchTableBinary
      } = tile;
      batchTable = new Tile3DBatchTableParser(batchTableJson, batchTableBinary, batchFeatureLength);
    }
  }

  return batchTable;
}

async function parseDraco(tile, featureTable, batchTable, options, context) {
  let dracoBuffer;
  let dracoFeatureTableProperties;
  let dracoBatchTableProperties;
  const batchTableDraco = tile.batchTableJson && tile.batchTableJson.extensions && tile.batchTableJson.extensions['3DTILES_draco_point_compression'];

  if (batchTableDraco) {
    dracoBatchTableProperties = batchTableDraco.properties;
  }

  const featureTableDraco = featureTable.getExtension('3DTILES_draco_point_compression');

  if (featureTableDraco) {
    dracoFeatureTableProperties = featureTableDraco.properties;
    const dracoByteOffset = featureTableDraco.byteOffset;
    const dracoByteLength = featureTableDraco.byteLength;

    if (!dracoFeatureTableProperties || !Number.isFinite(dracoByteOffset) || !dracoByteLength) {
      throw new Error('Draco properties, byteOffset, and byteLength must be defined');
    }

    dracoBuffer = tile.featureTableBinary.slice(dracoByteOffset, dracoByteOffset + dracoByteLength);
    tile.hasPositions = Number.isFinite(dracoFeatureTableProperties.POSITION);
    tile.hasColors = Number.isFinite(dracoFeatureTableProperties.RGB) || Number.isFinite(dracoFeatureTableProperties.RGBA);
    tile.hasNormals = Number.isFinite(dracoFeatureTableProperties.NORMAL);
    tile.hasBatchIds = Number.isFinite(dracoFeatureTableProperties.BATCH_ID);
    tile.isTranslucent = Number.isFinite(dracoFeatureTableProperties.RGBA);
  }

  if (!dracoBuffer) {
    return true;
  }

  const dracoData = {
    buffer: dracoBuffer,
    properties: { ...dracoFeatureTableProperties,
      ...dracoBatchTableProperties
    },
    featureTableProperties: dracoFeatureTableProperties,
    batchTableProperties: dracoBatchTableProperties,
    dequantizeInShader: false
  };
  return await loadDraco(tile, dracoData, options, context);
}

async function loadDraco(tile, dracoData, options, context) {
  const {
    parse
  } = context;
  const dracoOptions = { ...options,
    draco: { ...options.draco,
      extraAttributes: dracoData.batchTableProperties || {}
    }
  };
  delete dracoOptions['3d-tiles'];
  const data = await parse(dracoData.buffer, DracoLoader, dracoOptions);
  const decodedPositions = data.attributes.POSITION && data.attributes.POSITION.value;
  const decodedColors = data.attributes.COLOR_0 && data.attributes.COLOR_0.value;
  const decodedNormals = data.attributes.NORMAL && data.attributes.NORMAL.value;
  const decodedBatchIds = data.attributes.BATCH_ID && data.attributes.BATCH_ID.value;
  const isQuantizedDraco = decodedPositions && data.attributes.POSITION.value.quantization;
  const isOctEncodedDraco = decodedNormals && data.attributes.NORMAL.value.quantization;

  if (isQuantizedDraco) {
    const quantization = data.POSITION.data.quantization;
    const range = quantization.range;
    tile.quantizedVolumeScale = new Vector3(range, range, range);
    tile.quantizedVolumeOffset = new Vector3(quantization.minValues);
    tile.quantizedRange = (1 << quantization.quantizationBits) - 1.0;
    tile.isQuantizedDraco = true;
  }

  if (isOctEncodedDraco) {
    tile.octEncodedRange = (1 << data.NORMAL.data.quantization.quantizationBits) - 1.0;
    tile.isOctEncodedDraco = true;
  }

  const batchTableAttributes = {};

  if (dracoData.batchTableProperties) {
    for (const attributeName of Object.keys(dracoData.batchTableProperties)) {
      if (data.attributes[attributeName] && data.attributes[attributeName].value) {
        batchTableAttributes[attributeName.toLowerCase()] = data.attributes[attributeName].value;
      }
    }
  }

  tile.attributes = {
    positions: decodedPositions,
    colors: normalize3DTileColorAttribute(tile, decodedColors),
    normals: decodedNormals,
    batchIds: decodedBatchIds,
    ...batchTableAttributes
  };
}

const KHR_BINARY_GLTF = 'KHR_binary_glTF';
const KHR_DRACO_MESH_COMPRESSION = 'KHR_draco_mesh_compression';
const KHR_LIGHTS_PUNCTUAL = 'KHR_lights_punctual';
const KHR_MATERIALS_UNLIT = 'KHR_materials_unlit';
const KHR_TECHNIQUES_WEBGL = 'KHR_techniques_webgl';

const VERSION$1 = "3.0.0-beta.3" ;

const VERSION = "3.0.0-beta.3" ;

function assert$2(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const globals = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document
};
const global_ = globals.global || globals.self || globals.window;
const isBrowser = typeof process !== 'object' || String(process) !== '[object process]' || process.browser;
const matches = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
matches && parseFloat(matches[1]) || 0;

const {
  _parseImageNode
} = global_;
const IMAGE_SUPPORTED = typeof Image !== 'undefined';
const IMAGE_BITMAP_SUPPORTED = typeof ImageBitmap !== 'undefined';
const NODE_IMAGE_SUPPORTED = Boolean(_parseImageNode);
const DATA_SUPPORTED = isBrowser ? true : NODE_IMAGE_SUPPORTED;
function isImageTypeSupported(type) {
  switch (type) {
    case 'auto':
      return IMAGE_BITMAP_SUPPORTED || IMAGE_SUPPORTED || DATA_SUPPORTED;

    case 'imagebitmap':
      return IMAGE_BITMAP_SUPPORTED;

    case 'image':
      return IMAGE_SUPPORTED;

    case 'data':
      return DATA_SUPPORTED;

    default:
      throw new Error("@loaders.gl/images: image ".concat(type, " not supported in this environment"));
  }
}
function getDefaultImageType() {
  if (IMAGE_BITMAP_SUPPORTED) {
    return 'imagebitmap';
  }

  if (IMAGE_SUPPORTED) {
    return 'image';
  }

  if (DATA_SUPPORTED) {
    return 'data';
  }

  throw new Error('Install \'@loaders.gl/polyfills\' to parse images under Node.js');
}

function getImageType(image) {
  const format = getImageTypeOrNull(image);

  if (!format) {
    throw new Error('Not an image');
  }

  return format;
}
function getImageData(image) {
  switch (getImageType(image)) {
    case 'data':
      return image;

    case 'image':
    case 'imagebitmap':
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('getImageData');
      }

      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);

    default:
      throw new Error('getImageData');
  }
}

function getImageTypeOrNull(image) {
  if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) {
    return 'imagebitmap';
  }

  if (typeof Image !== 'undefined' && image instanceof Image) {
    return 'image';
  }

  if (image && typeof image === 'object' && image.data && image.width && image.height) {
    return 'data';
  }

  return null;
}

const SVG_DATA_URL_PATTERN = /^data:image\/svg\+xml/;
const SVG_URL_PATTERN = /\.svg((\?|#).*)?$/;
function isSVG(url) {
  return url && (SVG_DATA_URL_PATTERN.test(url) || SVG_URL_PATTERN.test(url));
}
function getBlobOrSVGDataUrl(arrayBuffer, url) {
  if (isSVG(url)) {
    const textDecoder = new TextDecoder();
    const xmlText = textDecoder.decode(arrayBuffer);
    const src = "data:image/svg+xml;base64,".concat(btoa(xmlText));
    return src;
  }

  return getBlob(arrayBuffer, url);
}
function getBlob(arrayBuffer, url) {
  if (isSVG(url)) {
    throw new Error('SVG cannot be parsed directly to imagebitmap');
  }

  return new Blob([new Uint8Array(arrayBuffer)]);
}

async function parseToImage(arrayBuffer, options, url) {
  const blobOrDataUrl = getBlobOrSVGDataUrl(arrayBuffer, url);
  const URL = self.URL || self.webkitURL;
  const objectUrl = typeof blobOrDataUrl !== 'string' && URL.createObjectURL(blobOrDataUrl);

  try {
    return await loadToImage(objectUrl || blobOrDataUrl, options);
  } finally {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}
async function loadToImage(url, options) {
  const image = new Image();
  image.src = url;

  if (options.image && options.image.decode && image.decode) {
    await image.decode();
    return image;
  }

  return await new Promise((resolve, reject) => {
    try {
      image.onload = () => resolve(image);

      image.onerror = err => reject(new Error("Could not load image ".concat(url, ": ").concat(err)));
    } catch (error) {
      reject(error);
    }
  });
}

const EMPTY_OBJECT = {};
let imagebitmapOptionsSupported = true;
async function parseToImageBitmap(arrayBuffer, options, url) {
  let blob;

  if (isSVG(url)) {
    const image = await parseToImage(arrayBuffer, options, url);
    blob = image;
  } else {
    blob = getBlob(arrayBuffer, url);
  }

  const imagebitmapOptions = options && options.imagebitmap;
  return await safeCreateImageBitmap(blob, imagebitmapOptions);
}

async function safeCreateImageBitmap(blob, imagebitmapOptions = null) {
  if (isEmptyObject(imagebitmapOptions) || !imagebitmapOptionsSupported) {
    imagebitmapOptions = null;
  }

  if (imagebitmapOptions) {
    try {
      return await createImageBitmap(blob, imagebitmapOptions);
    } catch (error) {
      console.warn(error);
      imagebitmapOptionsSupported = false;
    }
  }

  return await createImageBitmap(blob);
}

function isEmptyObject(object) {
  for (const key in object || EMPTY_OBJECT) {
    return false;
  }

  return true;
}

const BIG_ENDIAN = false;
const LITTLE_ENDIAN = true;
function getBinaryImageMetadata(binaryData) {
  const dataView = toDataView(binaryData);
  return getPngMetadata(dataView) || getJpegMetadata(dataView) || getGifMetadata(dataView) || getBmpMetadata(dataView);
}

function getPngMetadata(binaryData) {
  const dataView = toDataView(binaryData);
  const isPng = dataView.byteLength >= 24 && dataView.getUint32(0, BIG_ENDIAN) === 0x89504e47;

  if (!isPng) {
    return null;
  }

  return {
    mimeType: 'image/png',
    width: dataView.getUint32(16, BIG_ENDIAN),
    height: dataView.getUint32(20, BIG_ENDIAN)
  };
}

function getGifMetadata(binaryData) {
  const dataView = toDataView(binaryData);
  const isGif = dataView.byteLength >= 10 && dataView.getUint32(0, BIG_ENDIAN) === 0x47494638;

  if (!isGif) {
    return null;
  }

  return {
    mimeType: 'image/gif',
    width: dataView.getUint16(6, LITTLE_ENDIAN),
    height: dataView.getUint16(8, LITTLE_ENDIAN)
  };
}

function getBmpMetadata(binaryData) {
  const dataView = toDataView(binaryData);
  const isBmp = dataView.byteLength >= 14 && dataView.getUint16(0, BIG_ENDIAN) === 0x424d && dataView.getUint32(2, LITTLE_ENDIAN) === dataView.byteLength;

  if (!isBmp) {
    return null;
  }

  return {
    mimeType: 'image/bmp',
    width: dataView.getUint32(18, LITTLE_ENDIAN),
    height: dataView.getUint32(22, LITTLE_ENDIAN)
  };
}

function getJpegMetadata(binaryData) {
  const dataView = toDataView(binaryData);
  const isJpeg = dataView.byteLength >= 3 && dataView.getUint16(0, BIG_ENDIAN) === 0xffd8 && dataView.getUint8(2) === 0xff;

  if (!isJpeg) {
    return null;
  }

  const {
    tableMarkers,
    sofMarkers
  } = getJpegMarkers();
  let i = 2;

  while (i + 9 < dataView.byteLength) {
    const marker = dataView.getUint16(i, BIG_ENDIAN);

    if (sofMarkers.has(marker)) {
      return {
        mimeType: 'image/jpeg',
        height: dataView.getUint16(i + 5, BIG_ENDIAN),
        width: dataView.getUint16(i + 7, BIG_ENDIAN)
      };
    }

    if (!tableMarkers.has(marker)) {
      return null;
    }

    i += 2;
    i += dataView.getUint16(i, BIG_ENDIAN);
  }

  return null;
}

function getJpegMarkers() {
  const tableMarkers = new Set([0xffdb, 0xffc4, 0xffcc, 0xffdd, 0xfffe]);

  for (let i = 0xffe0; i < 0xfff0; ++i) {
    tableMarkers.add(i);
  }

  const sofMarkers = new Set([0xffc0, 0xffc1, 0xffc2, 0xffc3, 0xffc5, 0xffc6, 0xffc7, 0xffc9, 0xffca, 0xffcb, 0xffcd, 0xffce, 0xffcf, 0xffde]);
  return {
    tableMarkers,
    sofMarkers
  };
}

function toDataView(data) {
  if (data instanceof DataView) {
    return data;
  }

  if (ArrayBuffer.isView(data)) {
    return new DataView(data.buffer);
  }

  if (data instanceof ArrayBuffer) {
    return new DataView(data);
  }

  throw new Error('toDataView');
}

function parseToNodeImage(arrayBuffer, options) {
  const {
    mimeType
  } = getBinaryImageMetadata(arrayBuffer) || {};
  const {
    _parseImageNode
  } = global_;
  assert$2(_parseImageNode);
  return _parseImageNode(arrayBuffer, mimeType, options);
}

async function parseImage(arrayBuffer, options, context) {
  options = options || {};
  const imageOptions = options.image || {};
  const imageType = imageOptions.type || 'auto';
  const {
    url
  } = context || {};
  const loadType = getLoadableImageType(imageType);
  let image;

  switch (loadType) {
    case 'imagebitmap':
      image = await parseToImageBitmap(arrayBuffer, options, url);
      break;

    case 'image':
      image = await parseToImage(arrayBuffer, options, url);
      break;

    case 'data':
      image = await parseToNodeImage(arrayBuffer, options);
      break;

    default:
      assert$2(false);
  }

  if (imageType === 'data') {
    image = getImageData(image);
  }

  return image;
}

function getLoadableImageType(type) {
  switch (type) {
    case 'auto':
    case 'data':
      return getDefaultImageType();

    default:
      isImageTypeSupported(type);
      return type;
  }
}

const EXTENSIONS$2 = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'svg'];
const MIME_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/bmp', 'image/vnd.microsoft.icon', 'image/svg+xml'];
const ImageLoader = {
  id: 'image',
  module: 'images',
  name: 'Images',
  version: VERSION,
  mimeTypes: MIME_TYPES,
  extensions: EXTENSIONS$2,
  parse: parseImage,
  tests: [arrayBuffer => Boolean(getBinaryImageMetadata(new DataView(arrayBuffer)))],
  options: {
    image: {
      type: 'auto',
      decode: true
    }
  }
};

function assert$1(condition, message) {
  if (!condition) {
    throw new Error(message || 'assert failed: gltf');
  }
}

function resolveUrl(url, options) {
  const absolute = url.startsWith('data:') || url.startsWith('http:') || url.startsWith('https:');

  if (absolute) {
    return url;
  }

  const baseUrl = options.baseUri || options.uri;

  if (!baseUrl) {
    throw new Error("'baseUri' must be provided to resolve relative url ".concat(url));
  }

  return baseUrl.substr(0, baseUrl.lastIndexOf('/') + 1) + url;
}

function getTypedArrayForBufferView(json, buffers, bufferViewIndex) {
  const bufferView = json.bufferViews[bufferViewIndex];
  assert$1(bufferView);
  const bufferIndex = bufferView.buffer;
  const binChunk = buffers[bufferIndex];
  assert$1(binChunk);
  const byteOffset = (bufferView.byteOffset || 0) + binChunk.byteOffset;
  return new Uint8Array(binChunk.arrayBuffer, byteOffset, bufferView.byteLength);
}

const TYPES = ['SCALAR', 'VEC2', 'VEC3', 'VEC4'];
const ARRAY_CONSTRUCTOR_TO_WEBGL_CONSTANT = [[Int8Array, 5120], [Uint8Array, 5121], [Int16Array, 5122], [Uint16Array, 5123], [Uint32Array, 5125], [Float32Array, 5126], [Float64Array, 5130]];
const ARRAY_TO_COMPONENT_TYPE = new Map(ARRAY_CONSTRUCTOR_TO_WEBGL_CONSTANT);
const ATTRIBUTE_TYPE_TO_COMPONENTS = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};
const ATTRIBUTE_COMPONENT_TYPE_TO_BYTE_SIZE = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4
};
const ATTRIBUTE_COMPONENT_TYPE_TO_ARRAY = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
};
function getAccessorTypeFromSize(size) {
  const type = TYPES[size - 1];
  return type || TYPES[0];
}
function getComponentTypeFromArray(typedArray) {
  const componentType = ARRAY_TO_COMPONENT_TYPE.get(typedArray.constructor);

  if (!componentType) {
    throw new Error('Illegal typed array');
  }

  return componentType;
}
function getAccessorArrayTypeAndLength(accessor, bufferView) {
  const ArrayType = ATTRIBUTE_COMPONENT_TYPE_TO_ARRAY[accessor.componentType];
  const components = ATTRIBUTE_TYPE_TO_COMPONENTS[accessor.type];
  const bytesPerComponent = ATTRIBUTE_COMPONENT_TYPE_TO_BYTE_SIZE[accessor.componentType];
  const length = accessor.count * components;
  const byteLength = accessor.count * components * bytesPerComponent;
  assert$1(byteLength >= 0 && byteLength <= bufferView.byteLength);
  return {
    ArrayType,
    length,
    byteLength
  };
}

const DEFAULT_GLTF_JSON = {
  asset: {
    version: '2.0',
    generator: 'loaders.gl'
  },
  buffers: []
};
class GLTFScenegraph {
  constructor(gltf) {
    _defineProperty(this, "gltf", void 0);

    _defineProperty(this, "sourceBuffers", void 0);

    _defineProperty(this, "byteLength", void 0);

    this.gltf = gltf || {
      json: { ...DEFAULT_GLTF_JSON
      },
      buffers: []
    };
    this.sourceBuffers = [];
    this.byteLength = 0;

    if (this.gltf.buffers && this.gltf.buffers[0]) {
      this.byteLength = this.gltf.buffers[0].byteLength;
      this.sourceBuffers = [this.gltf.buffers[0]];
    }
  }

  get json() {
    return this.gltf.json;
  }

  getApplicationData(key) {
    const data = this.json[key];
    return data;
  }

  getExtraData(key) {
    const extras = this.json.extras || {};
    return extras[key];
  }

  getExtension(extensionName) {
    const isExtension = this.getUsedExtensions().find(name => name === extensionName);
    const extensions = this.json.extensions || {};
    return isExtension ? extensions[extensionName] || true : null;
  }

  getRequiredExtension(extensionName) {
    const isRequired = this.getRequiredExtensions().find(name => name === extensionName);
    return isRequired ? this.getExtension(extensionName) : null;
  }

  getRequiredExtensions() {
    return this.json.extensionsRequired || [];
  }

  getUsedExtensions() {
    return this.json.extensionsUsed || [];
  }

  getObjectExtension(object, extensionName) {
    const extensions = object.extensions || {};
    return extensions[extensionName];
  }

  getScene(index) {
    return this.getObject('scenes', index);
  }

  getNode(index) {
    return this.getObject('nodes', index);
  }

  getSkin(index) {
    return this.getObject('skins', index);
  }

  getMesh(index) {
    return this.getObject('meshes', index);
  }

  getMaterial(index) {
    return this.getObject('materials', index);
  }

  getAccessor(index) {
    return this.getObject('accessors', index);
  }

  getTexture(index) {
    return this.getObject('textures', index);
  }

  getSampler(index) {
    return this.getObject('samplers', index);
  }

  getImage(index) {
    return this.getObject('images', index);
  }

  getBufferView(index) {
    return this.getObject('bufferViews', index);
  }

  getBuffer(index) {
    return this.getObject('buffers', index);
  }

  getObject(array, index) {
    if (typeof index === 'object') {
      return index;
    }

    const object = this.json[array] && this.json[array][index];

    if (!object) {
      throw new Error("glTF file error: Could not find ".concat(array, "[").concat(index, "]"));
    }

    return object;
  }

  getTypedArrayForBufferView(bufferView) {
    bufferView = this.getBufferView(bufferView);
    const bufferIndex = bufferView.buffer;
    const binChunk = this.gltf.buffers[bufferIndex];
    assert$1(binChunk);
    const byteOffset = (bufferView.byteOffset || 0) + binChunk.byteOffset;
    return new Uint8Array(binChunk.arrayBuffer, byteOffset, bufferView.byteLength);
  }

  getTypedArrayForAccessor(accessor) {
    accessor = this.getAccessor(accessor);
    const bufferView = this.getBufferView(accessor.bufferView);
    const buffer = this.getBuffer(bufferView.buffer);
    const arrayBuffer = buffer.data;
    const {
      ArrayType,
      length
    } = getAccessorArrayTypeAndLength(accessor, bufferView);
    const byteOffset = bufferView.byteOffset + accessor.byteOffset;
    return new ArrayType(arrayBuffer, byteOffset, length);
  }

  getTypedArrayForImageData(image) {
    image = this.getAccessor(image);
    const bufferView = this.getBufferView(image.bufferView);
    const buffer = this.getBuffer(bufferView.buffer);
    const arrayBuffer = buffer.data;
    const byteOffset = bufferView.byteOffset || 0;
    return new Uint8Array(arrayBuffer, byteOffset, bufferView.byteLength);
  }

  addApplicationData(key, data) {
    this.json[key] = data;
    return this;
  }

  addExtraData(key, data) {
    this.json.extras = this.json.extras || {};
    this.json.extras[key] = data;
    return this;
  }

  addObjectExtension(object, extensionName, data) {
    object.extensions = object.extensions || {};
    object.extensions[extensionName] = data;
    this.registerUsedExtension(extensionName);
    return this;
  }

  setObjectExtension(object, extensionName, data) {
    const extensions = object.extensions || {};
    extensions[extensionName] = data;
  }

  removeObjectExtension(object, extensionName) {
    const extensions = object.extensions || {};
    const extension = extensions[extensionName];
    delete extensions[extensionName];
    return extension;
  }

  addExtension(extensionName, extensionData = {}) {
    assert$1(extensionData);
    this.json.extensions = this.json.extensions || {};
    this.json.extensions[extensionName] = extensionData;
    this.registerUsedExtension(extensionName);
    return extensionData;
  }

  addRequiredExtension(extensionName, extensionData = {}) {
    assert$1(extensionData);
    this.addExtension(extensionName, extensionData);
    this.registerRequiredExtension(extensionName);
    return extensionData;
  }

  registerUsedExtension(extensionName) {
    this.json.extensionsUsed = this.json.extensionsUsed || [];

    if (!this.json.extensionsUsed.find(ext => ext === extensionName)) {
      this.json.extensionsUsed.push(extensionName);
    }
  }

  registerRequiredExtension(extensionName) {
    this.registerUsedExtension(extensionName);
    this.json.extensionsRequired = this.json.extensionsRequired || [];

    if (!this.json.extensionsRequired.find(ext => ext === extensionName)) {
      this.json.extensionsRequired.push(extensionName);
    }
  }

  removeExtension(extensionName) {
    if (this.json.extensionsRequired) {
      this._removeStringFromArray(this.json.extensionsRequired, extensionName);
    }

    if (this.json.extensionsUsed) {
      this._removeStringFromArray(this.json.extensionsUsed, extensionName);
    }

    if (this.json.extensions) {
      delete this.json.extensions[extensionName];
    }
  }

  setDefaultScene(sceneIndex) {
    this.json.scene = sceneIndex;
  }

  addScene(scene) {
    const {
      nodeIndices
    } = scene;
    this.json.scenes = this.json.scenes || [];
    this.json.scenes.push({
      nodes: nodeIndices
    });
    return this.json.scenes.length - 1;
  }

  addNode(node) {
    const {
      meshIndex,
      matrix
    } = node;
    this.json.nodes = this.json.nodes || [];
    const nodeData = {
      mesh: meshIndex
    };

    if (matrix) {
      nodeData.matrix = matrix;
    }

    this.json.nodes.push(nodeData);
    return this.json.nodes.length - 1;
  }

  addMesh(mesh) {
    const {
      attributes,
      indices,
      material,
      mode = 4
    } = mesh;

    const accessors = this._addAttributes(attributes);

    const glTFMesh = {
      primitives: [{
        attributes: accessors,
        mode
      }]
    };

    if (indices) {
      const indicesAccessor = this._addIndices(indices);

      glTFMesh.primitives[0].indices = indicesAccessor;
    }

    if (Number.isFinite(material)) {
      glTFMesh.primitives[0].material = material;
    }

    this.json.meshes = this.json.meshes || [];
    this.json.meshes.push(glTFMesh);
    return this.json.meshes.length - 1;
  }

  addPointCloud(attributes) {
    const accessorIndices = this._addAttributes(attributes);

    const glTFMesh = {
      primitives: [{
        attributes: accessorIndices,
        mode: 0
      }]
    };
    this.json.meshes = this.json.meshes || [];
    this.json.meshes.push(glTFMesh);
    return this.json.meshes.length - 1;
  }

  addImage(imageData, mimeTypeOpt) {
    const metadata = getBinaryImageMetadata(imageData);
    const mimeType = mimeTypeOpt || (metadata === null || metadata === void 0 ? void 0 : metadata.mimeType);
    const bufferViewIndex = this.addBufferView(imageData);
    const glTFImage = {
      bufferView: bufferViewIndex,
      mimeType
    };
    this.json.images = this.json.images || [];
    this.json.images.push(glTFImage);
    return this.json.images.length - 1;
  }

  addBufferView(buffer) {
    const byteLength = buffer.byteLength;
    assert$1(Number.isFinite(byteLength));
    this.sourceBuffers = this.sourceBuffers || [];
    this.sourceBuffers.push(buffer);
    const glTFBufferView = {
      buffer: 0,
      byteOffset: this.byteLength,
      byteLength
    };
    this.byteLength += padToNBytes(byteLength, 4);
    this.json.bufferViews = this.json.bufferViews || [];
    this.json.bufferViews.push(glTFBufferView);
    return this.json.bufferViews.length - 1;
  }

  addAccessor(bufferViewIndex, accessor) {
    const glTFAccessor = {
      bufferView: bufferViewIndex,
      type: getAccessorTypeFromSize(accessor.size),
      componentType: accessor.componentType,
      count: accessor.count,
      max: accessor.max,
      min: accessor.min
    };
    this.json.accessors = this.json.accessors || [];
    this.json.accessors.push(glTFAccessor);
    return this.json.accessors.length - 1;
  }

  addBinaryBuffer(sourceBuffer, accessor = {
    size: 3
  }) {
    const bufferViewIndex = this.addBufferView(sourceBuffer);
    let minMax = {
      min: accessor.min,
      max: accessor.max
    };

    if (!minMax.min || !minMax.max) {
      minMax = this._getAccessorMinMax(sourceBuffer, accessor.size);
    }

    const accessorDefaults = {
      size: accessor.size,
      componentType: getComponentTypeFromArray(sourceBuffer),
      count: Math.round(sourceBuffer.length / accessor.size),
      min: minMax.min,
      max: minMax.max
    };
    return this.addAccessor(bufferViewIndex, Object.assign(accessorDefaults, accessor));
  }

  addTexture(texture) {
    const {
      imageIndex
    } = texture;
    const glTFTexture = {
      source: imageIndex
    };
    this.json.textures = this.json.textures || [];
    this.json.textures.push(glTFTexture);
    return this.json.textures.length - 1;
  }

  addMaterial(pbrMaterialInfo) {
    this.json.materials = this.json.materials || [];
    this.json.materials.push(pbrMaterialInfo);
    return this.json.materials.length - 1;
  }

  createBinaryChunk() {
    var _this$json, _this$json$buffers;

    this.gltf.buffers = [];
    const totalByteLength = this.byteLength;
    const arrayBuffer = new ArrayBuffer(totalByteLength);
    const targetArray = new Uint8Array(arrayBuffer);
    let dstByteOffset = 0;

    for (const sourceBuffer of this.sourceBuffers || []) {
      dstByteOffset = copyToArray(sourceBuffer, targetArray, dstByteOffset);
    }

    if ((_this$json = this.json) !== null && _this$json !== void 0 && (_this$json$buffers = _this$json.buffers) !== null && _this$json$buffers !== void 0 && _this$json$buffers[0]) {
      this.json.buffers[0].byteLength = totalByteLength;
    } else {
      this.json.buffers = [{
        byteLength: totalByteLength
      }];
    }

    this.gltf.binary = arrayBuffer;
    this.sourceBuffers = [arrayBuffer];
  }

  _removeStringFromArray(array, string) {
    let found = true;

    while (found) {
      const index = array.indexOf(string);

      if (index > -1) {
        array.splice(index, 1);
      } else {
        found = false;
      }
    }
  }

  _addAttributes(attributes = {}) {
    const result = {};

    for (const attributeKey in attributes) {
      const attributeData = attributes[attributeKey];

      const attrName = this._getGltfAttributeName(attributeKey);

      const accessor = this.addBinaryBuffer(attributeData.value, attributeData);
      result[attrName] = accessor;
    }

    return result;
  }

  _addIndices(indices) {
    return this.addBinaryBuffer(indices, {
      size: 1
    });
  }

  _getGltfAttributeName(attributeName) {
    switch (attributeName.toLowerCase()) {
      case 'position':
      case 'positions':
      case 'vertices':
        return 'POSITION';

      case 'normal':
      case 'normals':
        return 'NORMAL';

      case 'color':
      case 'colors':
        return 'COLOR_0';

      case 'texcoord':
      case 'texcoords':
        return 'TEXCOORD_0';

      default:
        return attributeName;
    }
  }

  _getAccessorMinMax(buffer, size) {
    const result = {
      min: null,
      max: null
    };

    if (buffer.length < size) {
      return result;
    }

    result.min = [];
    result.max = [];
    const initValues = buffer.subarray(0, size);

    for (const value of initValues) {
      result.min.push(value);
      result.max.push(value);
    }

    for (let index = size; index < buffer.length; index += size) {
      for (let componentIndex = 0; componentIndex < size; componentIndex++) {
        result.min[0 + componentIndex] = Math.min(result.min[0 + componentIndex], buffer[index + componentIndex]);
        result.max[0 + componentIndex] = Math.max(result.max[0 + componentIndex], buffer[index + componentIndex]);
      }
    }

    return result;
  }

}

function getGLTFAccessors(attributes) {
  const accessors = {};

  for (const name in attributes) {
    const attribute = attributes[name];

    if (name !== 'indices') {
      const glTFAccessor = getGLTFAccessor(attribute);
      accessors[name] = glTFAccessor;
    }
  }

  return accessors;
}
function getGLTFAccessor(attribute) {
  const {
    buffer,
    size,
    count
  } = getAccessorData(attribute);
  const glTFAccessor = {
    value: buffer,
    size,
    byteOffset: 0,
    count,
    type: getAccessorTypeFromSize(size),
    componentType: getComponentTypeFromArray(buffer)
  };
  return glTFAccessor;
}

function getAccessorData(attribute) {
  let buffer = attribute;
  let size = 1;
  let count = 0;

  if (attribute && attribute.value) {
    buffer = attribute.value;
    size = attribute.size || 1;
  }

  if (buffer) {
    if (!ArrayBuffer.isView(buffer)) {
      buffer = toTypedArray(buffer, Float32Array);
    }

    count = buffer.length / size;
  }

  return {
    buffer,
    size,
    count
  };
}

function toTypedArray(array, ArrayType, convertTypedArrays = false) {
  if (!array) {
    return null;
  }

  if (Array.isArray(array)) {
    return new ArrayType(array);
  }

  if (convertTypedArrays && !(array instanceof ArrayType)) {
    return new ArrayType(array);
  }

  return array;
}

async function decode$4(gltfData, options, context) {
  var _options$gltf;

  if (!(options !== null && options !== void 0 && (_options$gltf = options.gltf) !== null && _options$gltf !== void 0 && _options$gltf.decompressMeshes)) {
    return;
  }

  const scenegraph = new GLTFScenegraph(gltfData);
  const promises = [];

  for (const primitive of makeMeshPrimitiveIterator(scenegraph)) {
    if (scenegraph.getObjectExtension(primitive, KHR_DRACO_MESH_COMPRESSION)) {
      promises.push(decompressPrimitive(scenegraph, primitive, options, context));
    }
  }

  await Promise.all(promises);
  scenegraph.removeExtension(KHR_DRACO_MESH_COMPRESSION);
}
function encode$3(gltfData, options = {}) {
  const scenegraph = new GLTFScenegraph(gltfData);

  for (const mesh of scenegraph.json.meshes || []) {
    compressMesh(mesh);
    scenegraph.addRequiredExtension(KHR_DRACO_MESH_COMPRESSION);
  }
}

async function decompressPrimitive(scenegraph, primitive, options, context) {
  const dracoExtension = scenegraph.getObjectExtension(primitive, KHR_DRACO_MESH_COMPRESSION);

  if (!dracoExtension) {
    return;
  }

  const buffer = scenegraph.getTypedArrayForBufferView(dracoExtension.bufferView);
  const bufferCopy = sliceArrayBuffer(buffer.buffer, buffer.byteOffset);
  const {
    parse
  } = context;
  const dracoOptions = { ...options
  };
  delete dracoOptions['3d-tiles'];
  const decodedData = await parse(bufferCopy, DracoLoader, dracoOptions, context);
  const decodedAttributes = getGLTFAccessors(decodedData.attributes);

  for (const [attributeName, decodedAttribute] of Object.entries(decodedAttributes)) {
    if (attributeName in primitive.attributes) {
      const accessorIndex = primitive.attributes[attributeName];
      const accessor = scenegraph.getAccessor(accessorIndex);

      if (accessor !== null && accessor !== void 0 && accessor.min && accessor !== null && accessor !== void 0 && accessor.max) {
        decodedAttribute.min = accessor.min;
        decodedAttribute.max = accessor.max;
      }
    }
  }

  primitive.attributes = decodedAttributes;

  if (decodedData.indices) {
    primitive.indices = getGLTFAccessor(decodedData.indices);
  }

  checkPrimitive(primitive);
}

function compressMesh(attributes, indices, mode = 4, options, context) {
  if (!options.DracoWriter) {
    throw new Error('options.gltf.DracoWriter not provided');
  }

  const compressedData = options.DracoWriter.encodeSync({
    attributes
  });
  const {
    parseSync
  } = context;
  const decodedData = parseSync({
    attributes
  });

  const fauxAccessors = options._addFauxAttributes(decodedData.attributes);

  const bufferViewIndex = options.addBufferView(compressedData);
  const glTFMesh = {
    primitives: [{
      attributes: fauxAccessors,
      mode,
      extensions: {
        [KHR_DRACO_MESH_COMPRESSION]: {
          bufferView: bufferViewIndex,
          attributes: fauxAccessors
        }
      }
    }]
  };
  return glTFMesh;
}

function checkPrimitive(primitive) {
  if (!primitive.attributes && Object.keys(primitive.attributes).length > 0) {
    throw new Error('glTF: Empty primitive detected: Draco decompression failure?');
  }
}

function* makeMeshPrimitiveIterator(scenegraph) {
  for (const mesh of scenegraph.json.meshes || []) {
    for (const primitive of mesh.primitives) {
      yield primitive;
    }
  }
}

var KHR_draco_mesh_compression = /*#__PURE__*/Object.freeze({
    __proto__: null,
    decode: decode$4,
    encode: encode$3
});

async function decode$3(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;
  gltfScenegraph.removeExtension(KHR_MATERIALS_UNLIT);

  for (const material of json.materials || []) {
    const extension = material.extensions && material.extensions.KHR_materials_unlit;

    if (extension) {
      material.unlit = true;
    }

    gltfScenegraph.removeObjectExtension(material, KHR_MATERIALS_UNLIT);
  }
}
function encode$2(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;

  if (gltfScenegraph.materials) {
    for (const material of json.materials || []) {
      if (material.unlit) {
        delete material.unlit;
        gltfScenegraph.addObjectExtension(material, KHR_MATERIALS_UNLIT, {});
        gltfScenegraph.addExtension(KHR_MATERIALS_UNLIT);
      }
    }
  }
}

var KHR_materials_unlit = /*#__PURE__*/Object.freeze({
    __proto__: null,
    decode: decode$3,
    encode: encode$2
});

async function decode$2(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;
  const extension = gltfScenegraph.getExtension(KHR_LIGHTS_PUNCTUAL);

  if (extension) {
    gltfScenegraph.json.lights = extension.lights;
    gltfScenegraph.removeExtension(KHR_LIGHTS_PUNCTUAL);
  }

  for (const node of json.nodes || []) {
    const nodeExtension = gltfScenegraph.getObjectExtension(node, KHR_LIGHTS_PUNCTUAL);

    if (nodeExtension) {
      node.light = nodeExtension.light;
    }

    gltfScenegraph.removeObjectExtension(node, KHR_LIGHTS_PUNCTUAL);
  }
}
async function encode$1(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;

  if (json.lights) {
    const extension = gltfScenegraph.addExtension(KHR_LIGHTS_PUNCTUAL);
    assert$1(!extension.lights);
    extension.lights = json.lights;
    delete json.lights;
  }

  if (gltfScenegraph.json.lights) {
    for (const light of gltfScenegraph.json.lights) {
      const node = light.node;
      gltfScenegraph.addObjectExtension(node, KHR_LIGHTS_PUNCTUAL, light);
    }

    delete gltfScenegraph.json.lights;
  }
}

var KHR_lights_punctual = /*#__PURE__*/Object.freeze({
    __proto__: null,
    decode: decode$2,
    encode: encode$1
});

async function decode$1(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;
  const extension = gltfScenegraph.getExtension(KHR_TECHNIQUES_WEBGL);

  if (extension) {
    const techniques = resolveTechniques(extension, gltfScenegraph);

    for (const material of json.materials || []) {
      const materialExtension = gltfScenegraph.getObjectExtension(material, KHR_TECHNIQUES_WEBGL);

      if (materialExtension) {
        material.technique = Object.assign({}, materialExtension, techniques[materialExtension.technique]);
        material.technique.values = resolveValues(material.technique, gltfScenegraph);
      }

      gltfScenegraph.removeObjectExtension(material, KHR_TECHNIQUES_WEBGL);
    }

    gltfScenegraph.removeExtension(KHR_TECHNIQUES_WEBGL);
  }
}
async function encode(gltfData, options) {}

function resolveTechniques(techniquesExtension, gltfScenegraph) {
  const {
    programs = [],
    shaders = [],
    techniques = []
  } = techniquesExtension;
  const textDecoder = new TextDecoder();
  shaders.forEach(shader => {
    if (Number.isFinite(shader.bufferView)) {
      shader.code = textDecoder.decode(gltfScenegraph.getTypedArrayForBufferView(shader.bufferView));
    } else {
      throw new Error('KHR_techniques_webgl: no shader code');
    }
  });
  programs.forEach(program => {
    program.fragmentShader = shaders[program.fragmentShader];
    program.vertexShader = shaders[program.vertexShader];
  });
  techniques.forEach(technique => {
    technique.program = programs[technique.program];
  });
  return techniques;
}

function resolveValues(technique, gltfScenegraph) {
  const values = Object.assign({}, technique.values);
  Object.keys(technique.uniforms || {}).forEach(uniform => {
    if (technique.uniforms[uniform].value && !(uniform in values)) {
      values[uniform] = technique.uniforms[uniform].value;
    }
  });
  Object.keys(values).forEach(uniform => {
    if (typeof values[uniform] === 'object' && values[uniform].index !== undefined) {
      values[uniform].texture = gltfScenegraph.getTexture(values[uniform].index);
    }
  });
  return values;
}

var KHR_techniques_webgl = /*#__PURE__*/Object.freeze({
    __proto__: null,
    decode: decode$1,
    encode: encode
});

const EXTENSIONS$1 = {
  KHR_draco_mesh_compression,
  KHR_materials_unlit,
  KHR_lights_punctual,
  KHR_techniques_webgl
};
async function decodeExtensions(gltf, options = {}, context) {
  for (const extensionName in EXTENSIONS$1) {
    var _options$gltf;

    const excludes = (options === null || options === void 0 ? void 0 : (_options$gltf = options.gltf) === null || _options$gltf === void 0 ? void 0 : _options$gltf.excludeExtensions) || {};
    const exclude = extensionName in excludes && !excludes[extensionName];

    if (!exclude) {
      const extension = EXTENSIONS$1[extensionName];
      await extension.decode(gltf, options, context);
    }
  }
}

function decode(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;

  for (const node of json.images || []) {
    const extension = gltfScenegraph.removeObjectExtension(node, KHR_BINARY_GLTF);

    if (extension) {
      Object.assign(node, extension);
    }
  }

  if (json.buffers && json.buffers[0]) {
    delete json.buffers[0].uri;
  }

  gltfScenegraph.removeExtension(KHR_BINARY_GLTF);
}

const GLTF_ARRAYS = {
  accessors: 'accessor',
  animations: 'animation',
  buffers: 'buffer',
  bufferViews: 'bufferView',
  images: 'image',
  materials: 'material',
  meshes: 'mesh',
  nodes: 'node',
  samplers: 'sampler',
  scenes: 'scene',
  skins: 'skin',
  textures: 'texture'
};
const GLTF_KEYS = {
  accessor: 'accessors',
  animations: 'animation',
  buffer: 'buffers',
  bufferView: 'bufferViews',
  image: 'images',
  material: 'materials',
  mesh: 'meshes',
  node: 'nodes',
  sampler: 'samplers',
  scene: 'scenes',
  skin: 'skins',
  texture: 'textures'
};

class GLTFV1Normalizer {
  constructor(gltf) {
    this.idToIndexMap = {
      animations: {},
      accessors: {},
      buffers: {},
      bufferViews: {},
      images: {},
      materials: {},
      meshes: {},
      nodes: {},
      samplers: {},
      scenes: {},
      skins: {},
      textures: {}
    };
  }

  normalize(gltf, options) {
    this.json = gltf.json;
    const json = gltf.json;

    switch (json.asset && json.asset.version) {
      case '2.0':
        return;

      case undefined:
      case '1.0':
        break;

      default:
        console.warn("glTF: Unknown version ".concat(json.asset.version));
        return;
    }

    if (!options.normalize) {
      throw new Error('glTF v1 is not supported.');
    }

    console.warn('Converting glTF v1 to glTF v2 format. This is experimental and may fail.');

    this._addAsset(json);

    this._convertTopLevelObjectsToArrays(json);

    decode(gltf);

    this._convertObjectIdsToArrayIndices(json);

    this._updateObjects(json);

    this._updateMaterial(json);
  }

  _addAsset(json) {
    json.asset = json.asset || {};
    json.asset.version = '2.0';
    json.asset.generator = json.asset.generator || 'Normalized to glTF 2.0 by loaders.gl';
  }

  _convertTopLevelObjectsToArrays(json) {
    for (const arrayName in GLTF_ARRAYS) {
      this._convertTopLevelObjectToArray(json, arrayName);
    }
  }

  _convertTopLevelObjectToArray(json, mapName) {
    const objectMap = json[mapName];

    if (!objectMap || Array.isArray(objectMap)) {
      return;
    }

    json[mapName] = [];

    for (const id in objectMap) {
      const object = objectMap[id];
      object.id = object.id || id;
      const index = json[mapName].length;
      json[mapName].push(object);
      this.idToIndexMap[mapName][id] = index;
    }
  }

  _convertObjectIdsToArrayIndices(json) {
    for (const arrayName in GLTF_ARRAYS) {
      this._convertIdsToIndices(json, arrayName);
    }

    if ('scene' in json) {
      json.scene = this._convertIdToIndex(json.scene, 'scene');
    }

    for (const texture of json.textures) {
      this._convertTextureIds(texture);
    }

    for (const mesh of json.meshes) {
      this._convertMeshIds(mesh);
    }

    for (const node of json.nodes) {
      this._convertNodeIds(node);
    }

    for (const node of json.scenes) {
      this._convertSceneIds(node);
    }
  }

  _convertTextureIds(texture) {
    if (texture.source) {
      texture.source = this._convertIdToIndex(texture.source, 'image');
    }
  }

  _convertMeshIds(mesh) {
    for (const primitive of mesh.primitives) {
      const {
        attributes,
        indices,
        material
      } = primitive;

      for (const attributeName in attributes) {
        attributes[attributeName] = this._convertIdToIndex(attributes[attributeName], 'accessor');
      }

      if (indices) {
        primitive.indices = this._convertIdToIndex(indices, 'accessor');
      }

      if (material) {
        primitive.material = this._convertIdToIndex(material, 'material');
      }
    }
  }

  _convertNodeIds(node) {
    if (node.children) {
      node.children = node.children.map(child => this._convertIdToIndex(child, 'node'));
    }

    if (node.meshes) {
      node.meshes = node.meshes.map(mesh => this._convertIdToIndex(mesh, 'mesh'));
    }
  }

  _convertSceneIds(scene) {
    if (scene.nodes) {
      scene.nodes = scene.nodes.map(node => this._convertIdToIndex(node, 'node'));
    }
  }

  _convertIdsToIndices(json, topLevelArrayName) {
    if (!json[topLevelArrayName]) {
      console.warn("gltf v1: json doesn't contain attribute ".concat(topLevelArrayName));
      json[topLevelArrayName] = [];
    }

    for (const object of json[topLevelArrayName]) {
      for (const key in object) {
        const id = object[key];

        const index = this._convertIdToIndex(id, key);

        object[key] = index;
      }
    }
  }

  _convertIdToIndex(id, key) {
    const arrayName = GLTF_KEYS[key];

    if (arrayName in this.idToIndexMap) {
      const index = this.idToIndexMap[arrayName][id];

      if (!Number.isFinite(index)) {
        throw new Error("gltf v1: failed to resolve ".concat(key, " with id ").concat(id));
      }

      return index;
    }

    return id;
  }

  _updateObjects(json) {
    for (const buffer of this.json.buffers) {
      delete buffer.type;
    }
  }

  _updateMaterial(json) {
    for (const material of json.materials) {
      material.pbrMetallicRoughness = {
        baseColorFactor: [1, 1, 1, 1],
        metallicFactor: 1,
        roughnessFactor: 1
      };
      const textureId = material.values && material.values.tex;
      const textureIndex = json.textures.findIndex(texture => texture.id === textureId);

      if (textureIndex !== -1) {
        material.pbrMetallicRoughness.baseColorTexture = {
          index: textureIndex
        };
      }
    }
  }

}

function normalizeGLTFV1(gltf, options = {}) {
  return new GLTFV1Normalizer().normalize(gltf, options);
}

const COMPONENTS = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};
const BYTES = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4
};
const GL_SAMPLER = {
  TEXTURE_MAG_FILTER: 0x2800,
  TEXTURE_MIN_FILTER: 0x2801,
  TEXTURE_WRAP_S: 0x2802,
  TEXTURE_WRAP_T: 0x2803,
  REPEAT: 0x2901,
  LINEAR: 0x2601,
  NEAREST_MIPMAP_LINEAR: 0x2702
};
const SAMPLER_PARAMETER_GLTF_TO_GL = {
  magFilter: GL_SAMPLER.TEXTURE_MAG_FILTER,
  minFilter: GL_SAMPLER.TEXTURE_MIN_FILTER,
  wrapS: GL_SAMPLER.TEXTURE_WRAP_S,
  wrapT: GL_SAMPLER.TEXTURE_WRAP_T
};
const DEFAULT_SAMPLER = {
  [GL_SAMPLER.TEXTURE_MAG_FILTER]: GL_SAMPLER.LINEAR,
  [GL_SAMPLER.TEXTURE_MIN_FILTER]: GL_SAMPLER.NEAREST_MIPMAP_LINEAR,
  [GL_SAMPLER.TEXTURE_WRAP_S]: GL_SAMPLER.REPEAT,
  [GL_SAMPLER.TEXTURE_WRAP_]: GL_SAMPLER.REPEAT
};

function getBytesFromComponentType(componentType) {
  return BYTES[componentType];
}

function getSizeFromAccessorType(type) {
  return COMPONENTS[type];
}

class GLTFPostProcessor {
  postProcess(gltf, options = {}) {
    const {
      json,
      buffers = [],
      images = [],
      baseUri = ''
    } = gltf;
    assert$1(json);
    this.baseUri = baseUri;
    this.json = json;
    this.buffers = buffers;
    this.images = images;

    this._resolveTree(this.json, options);

    return this.json;
  }

  _resolveTree(json, options = {}) {
    if (json.bufferViews) {
      json.bufferViews = json.bufferViews.map((bufView, i) => this._resolveBufferView(bufView, i));
    }

    if (json.images) {
      json.images = json.images.map((image, i) => this._resolveImage(image, i));
    }

    if (json.samplers) {
      json.samplers = json.samplers.map((sampler, i) => this._resolveSampler(sampler, i));
    }

    if (json.textures) {
      json.textures = json.textures.map((texture, i) => this._resolveTexture(texture, i));
    }

    if (json.accessors) {
      json.accessors = json.accessors.map((accessor, i) => this._resolveAccessor(accessor, i));
    }

    if (json.materials) {
      json.materials = json.materials.map((material, i) => this._resolveMaterial(material, i));
    }

    if (json.meshes) {
      json.meshes = json.meshes.map((mesh, i) => this._resolveMesh(mesh, i));
    }

    if (json.nodes) {
      json.nodes = json.nodes.map((node, i) => this._resolveNode(node, i));
    }

    if (json.skins) {
      json.skins = json.skins.map((skin, i) => this._resolveSkin(skin, i));
    }

    if (json.scenes) {
      json.scenes = json.scenes.map((scene, i) => this._resolveScene(scene, i));
    }

    if (json.scene !== undefined) {
      json.scene = json.scenes[this.json.scene];
    }
  }

  getScene(index) {
    return this._get('scenes', index);
  }

  getNode(index) {
    return this._get('nodes', index);
  }

  getSkin(index) {
    return this._get('skins', index);
  }

  getMesh(index) {
    return this._get('meshes', index);
  }

  getMaterial(index) {
    return this._get('materials', index);
  }

  getAccessor(index) {
    return this._get('accessors', index);
  }

  getCamera(index) {
    return null;
  }

  getTexture(index) {
    return this._get('textures', index);
  }

  getSampler(index) {
    return this._get('samplers', index);
  }

  getImage(index) {
    return this._get('images', index);
  }

  getBufferView(index) {
    return this._get('bufferViews', index);
  }

  getBuffer(index) {
    return this._get('buffers', index);
  }

  _get(array, index) {
    if (typeof index === 'object') {
      return index;
    }

    const object = this.json[array] && this.json[array][index];

    if (!object) {
      console.warn("glTF file error: Could not find ".concat(array, "[").concat(index, "]"));
    }

    return object;
  }

  _resolveScene(scene, index) {
    scene.id = scene.id || "scene-".concat(index);
    scene.nodes = (scene.nodes || []).map(node => this.getNode(node));
    return scene;
  }

  _resolveNode(node, index) {
    node.id = node.id || "node-".concat(index);

    if (node.children) {
      node.children = node.children.map(child => this.getNode(child));
    }

    if (node.mesh !== undefined) {
      node.mesh = this.getMesh(node.mesh);
    } else if (node.meshes !== undefined && node.meshes.length) {
      node.mesh = node.meshes.reduce((accum, meshIndex) => {
        const mesh = this.getMesh(meshIndex);
        accum.id = mesh.id;
        accum.primitives = accum.primitives.concat(mesh.primitives);
        return accum;
      }, {
        primitives: []
      });
    }

    if (node.camera !== undefined) {
      node.camera = this.getCamera(node.camera);
    }

    if (node.skin !== undefined) {
      node.skin = this.getSkin(node.skin);
    }

    return node;
  }

  _resolveSkin(skin, index) {
    skin.id = skin.id || "skin-".concat(index);
    skin.inverseBindMatrices = this.getAccessor(skin.inverseBindMatrices);
    return skin;
  }

  _resolveMesh(mesh, index) {
    mesh.id = mesh.id || "mesh-".concat(index);

    if (mesh.primitives) {
      mesh.primitives = mesh.primitives.map(primitive => {
        primitive = { ...primitive
        };
        const attributes = primitive.attributes;
        primitive.attributes = {};

        for (const attribute in attributes) {
          primitive.attributes[attribute] = this.getAccessor(attributes[attribute]);
        }

        if (primitive.indices !== undefined) {
          primitive.indices = this.getAccessor(primitive.indices);
        }

        if (primitive.material !== undefined) {
          primitive.material = this.getMaterial(primitive.material);
        }

        return primitive;
      });
    }

    return mesh;
  }

  _resolveMaterial(material, index) {
    material.id = material.id || "material-".concat(index);

    if (material.normalTexture) {
      material.normalTexture = { ...material.normalTexture
      };
      material.normalTexture.texture = this.getTexture(material.normalTexture.index);
    }

    if (material.occlusionTexture) {
      material.occlustionTexture = { ...material.occlustionTexture
      };
      material.occlusionTexture.texture = this.getTexture(material.occlusionTexture.index);
    }

    if (material.emissiveTexture) {
      material.emmisiveTexture = { ...material.emmisiveTexture
      };
      material.emissiveTexture.texture = this.getTexture(material.emissiveTexture.index);
    }

    if (!material.emissiveFactor) {
      material.emissiveFactor = material.emmisiveTexture ? [1, 1, 1] : [0, 0, 0];
    }

    if (material.pbrMetallicRoughness) {
      material.pbrMetallicRoughness = { ...material.pbrMetallicRoughness
      };
      const mr = material.pbrMetallicRoughness;

      if (mr.baseColorTexture) {
        mr.baseColorTexture = { ...mr.baseColorTexture
        };
        mr.baseColorTexture.texture = this.getTexture(mr.baseColorTexture.index);
      }

      if (mr.metallicRoughnessTexture) {
        mr.metallicRoughnessTexture = { ...mr.metallicRoughnessTexture
        };
        mr.metallicRoughnessTexture.texture = this.getTexture(mr.metallicRoughnessTexture.index);
      }
    }

    return material;
  }

  _resolveAccessor(accessor, index) {
    accessor.id = accessor.id || "accessor-".concat(index);

    if (accessor.bufferView !== undefined) {
      accessor.bufferView = this.getBufferView(accessor.bufferView);
    }

    accessor.bytesPerComponent = getBytesFromComponentType(accessor.componentType);
    accessor.components = getSizeFromAccessorType(accessor.type);
    accessor.bytesPerElement = accessor.bytesPerComponent * accessor.components;

    if (accessor.bufferView) {
      const buffer = accessor.bufferView.buffer;
      const {
        ArrayType,
        byteLength
      } = getAccessorArrayTypeAndLength(accessor, accessor.bufferView);
      const byteOffset = (accessor.bufferView.byteOffset || 0) + (accessor.byteOffset || 0) + buffer.byteOffset;
      const cutBufffer = buffer.arrayBuffer.slice(byteOffset, byteOffset + byteLength);
      accessor.value = new ArrayType(cutBufffer);
    }

    return accessor;
  }

  _resolveTexture(texture, index) {
    texture.id = texture.id || "texture-".concat(index);
    texture.sampler = 'sampler' in texture ? this.getSampler(texture.sampler) : DEFAULT_SAMPLER;
    texture.source = this.getImage(texture.source);
    return texture;
  }

  _resolveSampler(sampler, index) {
    sampler.id = sampler.id || "sampler-".concat(index);
    sampler.parameters = {};

    for (const key in sampler) {
      const glEnum = this._enumSamplerParameter(key);

      if (glEnum !== undefined) {
        sampler.parameters[glEnum] = sampler[key];
      }
    }

    return sampler;
  }

  _enumSamplerParameter(key) {
    return SAMPLER_PARAMETER_GLTF_TO_GL[key];
  }

  _resolveImage(image, index) {
    image.id = image.id || "image-".concat(index);

    if (image.bufferView !== undefined) {
      image.bufferView = this.getBufferView(image.bufferView);
    }

    const preloadedImage = this.images[index];

    if (preloadedImage) {
      image.image = preloadedImage;
    }

    return image;
  }

  _resolveBufferView(bufferView, index) {
    bufferView.id = bufferView.id || "bufferView-".concat(index);
    const bufferIndex = bufferView.buffer;
    bufferView.buffer = this.buffers[bufferIndex];
    const arrayBuffer = this.buffers[bufferIndex].arrayBuffer;
    let byteOffset = this.buffers[bufferIndex].byteOffset || 0;

    if ('byteOffset' in bufferView) {
      byteOffset += bufferView.byteOffset;
    }

    bufferView.data = new Uint8Array(arrayBuffer, byteOffset, bufferView.byteLength);
    return bufferView;
  }

  _resolveCamera(camera, index) {
    camera.id = camera.id || "camera-".concat(index);

    if (camera.perspective) ;

    if (camera.orthographic) ;

    return camera;
  }

}

function postProcessGLTF(gltf, options) {
  return new GLTFPostProcessor().postProcess(gltf, options);
}

const MAGIC_glTF = 0x676c5446;
const GLB_FILE_HEADER_SIZE = 12;
const GLB_CHUNK_HEADER_SIZE = 8;
const GLB_CHUNK_TYPE_JSON = 0x4e4f534a;
const GLB_CHUNK_TYPE_BIN = 0x004e4942;
const GLB_CHUNK_TYPE_JSON_XVIZ_DEPRECATED = 0;
const GLB_CHUNK_TYPE_BIX_XVIZ_DEPRECATED = 1;
const GLB_V1_CONTENT_FORMAT_JSON = 0x0;
const LE = true;

function getMagicString(dataView, byteOffset = 0) {
  return "".concat(String.fromCharCode(dataView.getUint8(byteOffset + 0))).concat(String.fromCharCode(dataView.getUint8(byteOffset + 1))).concat(String.fromCharCode(dataView.getUint8(byteOffset + 2))).concat(String.fromCharCode(dataView.getUint8(byteOffset + 3)));
}

function isGLB(arrayBuffer, byteOffset = 0, options = {}) {
  const dataView = new DataView(arrayBuffer);
  const {
    magic = MAGIC_glTF
  } = options;
  const magic1 = dataView.getUint32(byteOffset, false);
  return magic1 === magic || magic1 === MAGIC_glTF;
}
function parseGLBSync(glb, arrayBuffer, byteOffset = 0, options = {}) {
  const dataView = new DataView(arrayBuffer);
  const type = getMagicString(dataView, byteOffset + 0);
  const version = dataView.getUint32(byteOffset + 4, LE);
  const byteLength = dataView.getUint32(byteOffset + 8, LE);
  Object.assign(glb, {
    header: {
      byteOffset,
      byteLength,
      hasBinChunk: false
    },
    type,
    version,
    json: {},
    binChunks: []
  });
  byteOffset += GLB_FILE_HEADER_SIZE;

  switch (glb.version) {
    case 1:
      return parseGLBV1(glb, dataView, byteOffset);

    case 2:
      return parseGLBV2(glb, dataView, byteOffset, options = {});

    default:
      throw new Error("Invalid GLB version ".concat(glb.version, ". Only supports v1 and v2."));
  }
}

function parseGLBV1(glb, dataView, byteOffset) {
  assert$7(glb.header.byteLength > GLB_FILE_HEADER_SIZE + GLB_CHUNK_HEADER_SIZE);
  const contentLength = dataView.getUint32(byteOffset + 0, LE);
  const contentFormat = dataView.getUint32(byteOffset + 4, LE);
  byteOffset += GLB_CHUNK_HEADER_SIZE;
  assert$7(contentFormat === GLB_V1_CONTENT_FORMAT_JSON);
  parseJSONChunk(glb, dataView, byteOffset, contentLength);
  byteOffset += contentLength;
  byteOffset += parseBINChunk(glb, dataView, byteOffset, glb.header.byteLength);
  return byteOffset;
}

function parseGLBV2(glb, dataView, byteOffset, options) {
  assert$7(glb.header.byteLength > GLB_FILE_HEADER_SIZE + GLB_CHUNK_HEADER_SIZE);
  parseGLBChunksSync(glb, dataView, byteOffset, options);
  return byteOffset + glb.header.byteLength;
}

function parseGLBChunksSync(glb, dataView, byteOffset, options) {
  while (byteOffset + 8 <= glb.header.byteLength) {
    const chunkLength = dataView.getUint32(byteOffset + 0, LE);
    const chunkFormat = dataView.getUint32(byteOffset + 4, LE);
    byteOffset += GLB_CHUNK_HEADER_SIZE;

    switch (chunkFormat) {
      case GLB_CHUNK_TYPE_JSON:
        parseJSONChunk(glb, dataView, byteOffset, chunkLength);
        break;

      case GLB_CHUNK_TYPE_BIN:
        parseBINChunk(glb, dataView, byteOffset, chunkLength);
        break;

      case GLB_CHUNK_TYPE_JSON_XVIZ_DEPRECATED:
        if (!options.strict) {
          parseJSONChunk(glb, dataView, byteOffset, chunkLength);
        }

        break;

      case GLB_CHUNK_TYPE_BIX_XVIZ_DEPRECATED:
        if (!options.strict) {
          parseBINChunk(glb, dataView, byteOffset, chunkLength);
        }

        break;
    }

    byteOffset += padToNBytes(chunkLength, 4);
  }

  return byteOffset;
}

function parseJSONChunk(glb, dataView, byteOffset, chunkLength) {
  const jsonChunk = new Uint8Array(dataView.buffer, byteOffset, chunkLength);
  const textDecoder = new TextDecoder('utf8');
  const jsonText = textDecoder.decode(jsonChunk);
  glb.json = JSON.parse(jsonText);
  return padToNBytes(chunkLength, 4);
}

function parseBINChunk(glb, dataView, byteOffset, chunkLength) {
  glb.header.hasBinChunk = true;
  glb.binChunks.push({
    byteOffset,
    byteLength: chunkLength,
    arrayBuffer: dataView.buffer
  });
  return padToNBytes(chunkLength, 4);
}

async function parseGLTF(gltf, arrayBufferOrString, byteOffset = 0, options, context) {
  var _options$gltf, _options$gltf2, _options$gltf3, _options$gltf4;

  parseGLTFContainerSync(gltf, arrayBufferOrString, byteOffset, options);
  normalizeGLTFV1(gltf, {
    normalize: options === null || options === void 0 ? void 0 : (_options$gltf = options.gltf) === null || _options$gltf === void 0 ? void 0 : _options$gltf.normalize
  });
  const promises = [];

  if (options !== null && options !== void 0 && (_options$gltf2 = options.gltf) !== null && _options$gltf2 !== void 0 && _options$gltf2.loadBuffers && gltf.json.buffers) {
    await loadBuffers(gltf, options, context);
  }

  if (options !== null && options !== void 0 && (_options$gltf3 = options.gltf) !== null && _options$gltf3 !== void 0 && _options$gltf3.loadImages) {
    const promise = loadImages(gltf, options, context);
    promises.push(promise);
  }

  const promise = decodeExtensions(gltf, options, context);
  promises.push(promise);
  await Promise.all(promises);
  return options !== null && options !== void 0 && (_options$gltf4 = options.gltf) !== null && _options$gltf4 !== void 0 && _options$gltf4.postProcess ? postProcessGLTF(gltf, options) : gltf;
}

function parseGLTFContainerSync(gltf, data, byteOffset, options) {
  if (options.uri) {
    gltf.baseUri = options.uri;
  }

  if (data instanceof ArrayBuffer && !isGLB(data, byteOffset, options)) {
    const textDecoder = new TextDecoder();
    data = textDecoder.decode(data);
  }

  if (typeof data === 'string') {
    gltf.json = parseJSON(data);
  } else if (data instanceof ArrayBuffer) {
    const glb = {};
    byteOffset = parseGLBSync(glb, data, byteOffset, options.glb);
    assert$1(glb.type === 'glTF', "Invalid GLB magic string ".concat(glb.type));
    gltf._glb = glb;
    gltf.json = glb.json;
  } else {
    assert$1(false, 'GLTF: must be ArrayBuffer or string');
  }

  const buffers = gltf.json.buffers || [];
  gltf.buffers = new Array(buffers.length).fill(null);

  if (gltf._glb && gltf._glb.header.hasBinChunk) {
    const {
      binChunks
    } = gltf._glb;
    gltf.buffers[0] = {
      arrayBuffer: binChunks[0].arrayBuffer,
      byteOffset: binChunks[0].byteOffset,
      byteLength: binChunks[0].byteLength
    };
  }

  const images = gltf.json.images || [];
  gltf.images = new Array(images.length).fill({});
}

async function loadBuffers(gltf, options, context) {
  for (let i = 0; i < gltf.json.buffers.length; ++i) {
    const buffer = gltf.json.buffers[i];

    if (buffer.uri) {
      const {
        fetch
      } = context;
      assert$1(fetch);
      const uri = resolveUrl(buffer.uri, options);
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      gltf.buffers[i] = {
        arrayBuffer,
        byteOffset: 0,
        byteLength: arrayBuffer.byteLength
      };
      delete buffer.uri;
    }
  }
}

async function loadImages(gltf, options, context) {
  const images = gltf.json.images || [];
  const promises = [];

  for (let i = 0; i < images.length; ++i) {
    promises.push(loadImage(gltf, images[i], i, options, context));
  }

  return await Promise.all(promises);
}

async function loadImage(gltf, image, i, options, context) {
  const {
    fetch,
    parse
  } = context;
  let arrayBuffer;

  if (image.uri) {
    const uri = resolveUrl(image.uri, options);
    const response = await fetch(uri);
    arrayBuffer = await response.arrayBuffer();
  }

  if (Number.isFinite(image.bufferView)) {
    const array = getTypedArrayForBufferView(gltf.json, gltf.buffers, image.bufferView);
    arrayBuffer = sliceArrayBuffer(array.buffer, array.byteOffset, array.byteLength);
  }

  assert$1(arrayBuffer, 'glTF image has no data');
  const parsedImage = await parse(arrayBuffer, ImageLoader, {}, context);
  gltf.images[i] = parsedImage;
}

const GLTFLoader$1 = {
  name: 'glTF',
  id: 'gltf',
  module: 'gltf',
  version: VERSION$1,
  extensions: ['gltf', 'glb'],
  mimeTypes: ['model/gltf+json', 'model/gltf-binary'],
  text: true,
  binary: true,
  tests: ['glTF'],
  parse: parse$1,
  options: {
    gltf: {
      normalize: true,
      loadBuffers: true,
      loadImages: true,
      decompressMeshes: true,
      postProcess: true
    },
    log: console
  },
  deprecatedOptions: {
    fetchImages: 'gltf.loadImages',
    createImages: 'gltf.loadImages',
    decompress: 'gltf.decompressMeshes',
    postProcess: 'gltf.postProcess',
    gltf: {
      decompress: 'gltf.decompressMeshes'
    }
  }
};
async function parse$1(arrayBuffer, options = {}, context) {
  options = { ...GLTFLoader$1.options,
    ...options
  };
  options.gltf = { ...GLTFLoader$1.options.gltf,
    ...options.gltf
  };
  const {
    byteOffset = 0
  } = options;
  const gltf = {};
  return await parseGLTF(gltf, arrayBuffer, byteOffset, options, context);
}

const GLTF_FORMAT = {
  URI: 0,
  EMBEDDED: 1
};
function parse3DTileGLTFViewSync(tile, arrayBuffer, byteOffset, options) {
  tile.rotateYtoZ = true;
  const gltfByteLength = tile.byteOffset + tile.byteLength - byteOffset;

  if (gltfByteLength === 0) {
    throw new Error('glTF byte length must be greater than 0.');
  }

  tile.gltfUpAxis = options['3d-tiles'] && options['3d-tiles'].assetGltfUpAxis ? options['3d-tiles'].assetGltfUpAxis : 'Y';
  tile.gltfArrayBuffer = sliceArrayBuffer(arrayBuffer, byteOffset, gltfByteLength);
  tile.gltfByteOffset = 0;
  tile.gltfByteLength = gltfByteLength;

  if (byteOffset % 4 === 0) ; else {
    console.warn("".concat(tile.type, ": embedded glb is not aligned to a 4-byte boundary."));
  }

  return tile.byteOffset + tile.byteLength;
}
async function extractGLTF(tile, gltfFormat, options, context) {
  const tile3DOptions = options['3d-tiles'] || {};
  extractGLTFBufferOrURL(tile, gltfFormat);

  if (tile3DOptions.loadGLTF) {
    const {
      parse,
      fetch
    } = context;

    if (tile.gltfUrl) {
      tile.gltfArrayBuffer = await fetch(tile.gltfUrl, options);
      tile.gltfByteOffset = 0;
    }

    if (tile.gltfArrayBuffer) {
      tile.gltf = await parse(tile.gltfArrayBuffer, GLTFLoader$1, options, context);
      delete tile.gltfArrayBuffer;
      delete tile.gltfByteOffset;
      delete tile.gltfByteLength;
    }
  }
}

function extractGLTFBufferOrURL(tile, gltfFormat, options) {
  switch (gltfFormat) {
    case GLTF_FORMAT.URI:
      const gltfUrlBytes = new Uint8Array(tile.gltfArrayBuffer, tile.gltfByteOffset);
      const textDecoder = new TextDecoder();
      const gltfUrl = textDecoder.decode(gltfUrlBytes);
      tile.gltfUrl = gltfUrl.replace(/[\s\0]+$/, '');
      delete tile.gltfArrayBuffer;
      delete tile.gltfByteOffset;
      delete tile.gltfByteLength;
      break;

    case GLTF_FORMAT.EMBEDDED:
      break;

    default:
      throw new Error("b3dm: Illegal glTF format field");
  }
}

async function parseBatchedModel3DTile(tile, arrayBuffer, byteOffset, options, context) {
  var _tile$gltf;

  byteOffset = parseBatchedModel(tile, arrayBuffer, byteOffset, options);
  await extractGLTF(tile, GLTF_FORMAT.EMBEDDED, options, context);
  const extensions = tile === null || tile === void 0 ? void 0 : (_tile$gltf = tile.gltf) === null || _tile$gltf === void 0 ? void 0 : _tile$gltf.extension;

  if (extensions && extensions.CESIUM_RTC) {
    tile.rtcCenter = extensions.CESIUM_RTC.center;
  }

  return byteOffset;
}

function parseBatchedModel(tile, arrayBuffer, byteOffset, options, context) {
  byteOffset = parse3DTileHeaderSync(tile, arrayBuffer, byteOffset);
  byteOffset = parse3DTileTablesHeaderSync(tile, arrayBuffer, byteOffset);
  byteOffset = parse3DTileTablesSync(tile, arrayBuffer, byteOffset);
  byteOffset = parse3DTileGLTFViewSync(tile, arrayBuffer, byteOffset, options);
  const featureTable = new Tile3DFeatureTable(tile.featureTableJson, tile.featureTableBinary);
  tile.rtcCenter = featureTable.getGlobalProperty('RTC_CENTER', GL$1.FLOAT, 3);
  return byteOffset;
}

async function parseInstancedModel3DTile(tile, arrayBuffer, byteOffset, options, context) {
  byteOffset = parseInstancedModel(tile, arrayBuffer, byteOffset, options);
  await extractGLTF(tile, tile.gltfFormat, options, context);
  return byteOffset;
}

function parseInstancedModel(tile, arrayBuffer, byteOffset, options, context) {
  byteOffset = parse3DTileHeaderSync(tile, arrayBuffer, byteOffset);

  if (tile.version !== 1) {
    throw new Error("Instanced 3D Model version ".concat(tile.version, " is not supported"));
  }

  byteOffset = parse3DTileTablesHeaderSync(tile, arrayBuffer, byteOffset);
  const view = new DataView(arrayBuffer);
  tile.gltfFormat = view.getUint32(byteOffset, true);
  byteOffset += 4;
  byteOffset = parse3DTileTablesSync(tile, arrayBuffer, byteOffset);
  byteOffset = parse3DTileGLTFViewSync(tile, arrayBuffer, byteOffset, options);

  if (tile.featureTableJsonByteLength === 0) {
    throw new Error('i3dm parser: featureTableJsonByteLength is zero.');
  }

  const featureTable = new Tile3DFeatureTable(tile.featureTableJson, tile.featureTableBinary);
  const instancesLength = featureTable.getGlobalProperty('INSTANCES_LENGTH');
  featureTable.featuresLength = instancesLength;

  if (!Number.isFinite(instancesLength)) {
    throw new Error('i3dm parser: INSTANCES_LENGTH must be defined');
  }

  tile.eastNorthUp = featureTable.getGlobalProperty('EAST_NORTH_UP');
  tile.rtcCenter = featureTable.getGlobalProperty('RTC_CENTER', GL$1.FLOAT, 3);
  const batchTable = new Tile3DBatchTableParser(tile.batchTableJson, tile.batchTableBinary, instancesLength);
  extractInstancedAttributes(tile, featureTable, batchTable, instancesLength);
  return byteOffset;
}

function extractInstancedAttributes(tile, featureTable, batchTable, instancesLength) {
  const collectionOptions = {
    instances: new Array(instancesLength),
    batchTable: tile._batchTable,
    cull: false,
    url: undefined,
    gltf: undefined,
    basePath: undefined,
    incrementallyLoadTextures: false,
    forwardAxis: [1, 0, 0]
  };
  const instances = collectionOptions.instances;
  const instancePosition = new Vector3();
  new Vector3();
  new Vector3();
  new Vector3();
  const instanceRotation = new Matrix3();
  const instanceQuaternion = new Quaternion();
  const instanceScale = new Vector3();
  const instanceTranslationRotationScale = {};
  const instanceTransform = new Matrix4();
  const scratch1 = [];
  const scratch2 = [];
  const scratchVector1 = new Vector3();
  const scratchVector2 = new Vector3();

  for (let i = 0; i < instancesLength; i++) {
    let position;

    if (featureTable.hasProperty('POSITION')) {
      position = featureTable.getProperty('POSITION', GL$1.FLOAT, 3, i, instancePosition);
    } else if (featureTable.hasProperty('POSITION_QUANTIZED')) {
      position = featureTable.getProperty('POSITION_QUANTIZED', GL$1.UNSIGNED_SHORT, 3, i, instancePosition);
      const quantizedVolumeOffset = featureTable.getGlobalProperty('QUANTIZED_VOLUME_OFFSET', GL$1.FLOAT, 3, scratchVector1);

      if (!quantizedVolumeOffset) {
        throw new Error('i3dm parser: QUANTIZED_VOLUME_OFFSET must be defined for quantized positions.');
      }

      const quantizedVolumeScale = featureTable.getGlobalProperty('QUANTIZED_VOLUME_SCALE', GL$1.FLOAT, 3, scratchVector2);

      if (!quantizedVolumeScale) {
        throw new Error('i3dm parser: QUANTIZED_VOLUME_SCALE must be defined for quantized positions.');
      }

      const MAX_UNSIGNED_SHORT = 65535.0;

      for (let j = 0; j < 3; j++) {
        position[j] = position[j] / MAX_UNSIGNED_SHORT * quantizedVolumeScale[j] + quantizedVolumeOffset[j];
      }
    }

    if (!position) {
      throw new Error('i3dm: POSITION or POSITION_QUANTIZED must be defined for each instance.');
    }

    instancePosition.copy(position);
    instanceTranslationRotationScale.translation = instancePosition;
    tile.normalUp = featureTable.getProperty('NORMAL_UP', GL$1.FLOAT, 3, i, scratch1);
    tile.normalRight = featureTable.getProperty('NORMAL_RIGHT', GL$1.FLOAT, 3, i, scratch2);

    if (tile.normalUp) {
      if (!tile.normalRight) {
        throw new Error('i3dm: Custom orientation requires both NORMAL_UP and NORMAL_RIGHT.');
      }

      tile.hasCustomOrientation = true;
    } else {
      tile.octNormalUp = featureTable.getProperty('NORMAL_UP_OCT32P', GL$1.UNSIGNED_SHORT, 2, scratch1);
      tile.octNormalRight = featureTable.getProperty('NORMAL_RIGHT_OCT32P', GL$1.UNSIGNED_SHORT, 2, scratch2);

      if (tile.octNormalUp) {
        if (!tile.octNormalRight) {
          throw new Error('i3dm: oct-encoded orientation requires NORMAL_UP_OCT32P and NORMAL_RIGHT_OCT32P');
        }

        throw new Error('i3dm: oct-encoded orientation not implemented');
      } else if (tile.eastNorthUp) {
        Ellipsoid.WGS84.eastNorthUpToFixedFrame(instancePosition, instanceTransform);
        instanceTransform.getRotationMatrix3(instanceRotation);
      } else {
        instanceRotation.identity();
      }
    }

    instanceQuaternion.fromMatrix3(instanceRotation);
    instanceTranslationRotationScale.rotation = instanceQuaternion;
    instanceScale.set(1.0, 1.0, 1.0);
    const scale = featureTable.getProperty('SCALE', GL$1.FLOAT, 1, i);

    if (Number.isFinite(scale)) {
      instanceScale.multiplyByScalar(scale);
    }

    const nonUniformScale = featureTable.getProperty('SCALE_NON_UNIFORM', GL$1.FLOAT, 3, i, scratch1);

    if (nonUniformScale) {
      instanceScale.scale(nonUniformScale);
    }

    instanceTranslationRotationScale.scale = instanceScale;
    let batchId = featureTable.getProperty('BATCH_ID', GL$1.UNSIGNED_SHORT, 1, i);

    if (batchId === undefined) {
      batchId = i;
    }

    const rotationMatrix = new Matrix4().fromQuaternion(instanceTranslationRotationScale.rotation);
    instanceTransform.identity();
    instanceTransform.translate(instanceTranslationRotationScale.translation);
    instanceTransform.multiplyRight(rotationMatrix);
    instanceTransform.scale(instanceTranslationRotationScale.scale);
    const modelMatrix = instanceTransform.clone();
    instances[i] = {
      modelMatrix,
      batchId
    };
  }

  tile.instances = instances;
}

async function parseComposite3DTile(tile, arrayBuffer, byteOffset, options, context, parse3DTile) {
  byteOffset = parse3DTileHeaderSync(tile, arrayBuffer, byteOffset);
  const view = new DataView(arrayBuffer);
  tile.tilesLength = view.getUint32(byteOffset, true);
  byteOffset += 4;
  tile.tiles = [];

  while (tile.tiles.length < tile.tilesLength && tile.byteLength - byteOffset > 12) {
    const subtile = {};
    tile.tiles.push(subtile);
    byteOffset = await parse3DTile(arrayBuffer, byteOffset, options, context, subtile);
  }

  return byteOffset;
}

async function parse3DTile(arrayBuffer, byteOffset = 0, options, context, tile = {}) {
  tile.byteOffset = byteOffset;
  tile.type = getMagicString$1(arrayBuffer, byteOffset);

  switch (tile.type) {
    case TILE3D_TYPE.COMPOSITE:
      return await parseComposite3DTile(tile, arrayBuffer, byteOffset, options, context, parse3DTile);

    case TILE3D_TYPE.BATCHED_3D_MODEL:
      return await parseBatchedModel3DTile(tile, arrayBuffer, byteOffset, options, context);

    case TILE3D_TYPE.INSTANCED_3D_MODEL:
      return await parseInstancedModel3DTile(tile, arrayBuffer, byteOffset, options, context);

    case TILE3D_TYPE.POINT_CLOUD:
      return await parsePointCloud3DTile(tile, arrayBuffer, byteOffset, options, context);

    default:
      throw new Error("3DTileLoader: unknown type ".concat(tile.type));
  }
}

function getTileType(tile) {
  if (!tile.contentUrl) {
    return TILE_TYPE.EMPTY;
  }

  const contentUrl = tile.contentUrl;
  const fileExtension = contentUrl.split('.').pop();

  switch (fileExtension) {
    case 'pnts':
      return TILE_TYPE.POINTCLOUD;

    case 'i3dm':
    case 'b3dm':
      return TILE_TYPE.SCENEGRAPH;

    default:
      return fileExtension;
  }
}

function getRefine(refine) {
  switch (refine) {
    case 'REPLACE':
    case 'replace':
      return TILE_REFINEMENT.REPLACE;

    case 'ADD':
    case 'add':
      return TILE_REFINEMENT.ADD;

    default:
      return refine;
  }
}

function normalizeTileData(tile, options) {
  if (tile.content) {
    const contentUri = tile.content.uri || tile.content.url;
    tile.contentUrl = "".concat(options.basePath, "/").concat(contentUri);
  }

  tile.id = tile.contentUrl;
  tile.lodMetricType = LOD_METRIC_TYPE.GEOMETRIC_ERROR;
  tile.lodMetricValue = tile.geometricError;
  tile.transformMatrix = tile.transform;
  tile.type = getTileType(tile);
  tile.refine = getRefine(tile.refine);
  return tile;
}
function normalizeTileHeaders(tileset) {
  const basePath = tileset.basePath;
  const root = normalizeTileData(tileset.root, tileset);
  const stack = [];
  stack.push(root);

  while (stack.length > 0) {
    const tile = stack.pop();
    const children = tile.children || [];

    for (const childHeader of children) {
      normalizeTileData(childHeader, {
        basePath
      });
      stack.push(childHeader);
    }
  }

  return root;
}

const Tiles3DLoader = {
  id: '3d-tiles',
  name: '3D Tiles',
  module: '3d-tiles',
  version: VERSION$3,
  extensions: ['cmpt', 'pnts', 'b3dm', 'i3dm'],
  mimeTypes: ['application/octet-stream'],
  tests: ['cmpt', 'pnts', 'b3dm', 'i3dm'],
  parse,
  options: {
    '3d-tiles': {
      loadGLTF: true,
      decodeQuantizedPositions: false,
      isTileset: 'auto',
      assetGltfUpAxis: null
    }
  }
};

function getBaseUri(tileset) {
  return dirname(tileset.url);
}

async function parseTile(arrayBuffer, options, context) {
  const tile = {
    content: {
      featureIds: null
    }
  };
  const byteOffset = 0;
  await parse3DTile(arrayBuffer, byteOffset, options, context, tile.content);
  return tile.content;
}

async function parseTileset(data, options, context) {
  const tilesetJson = JSON.parse(new TextDecoder().decode(data));
  tilesetJson.loader = options.loader || Tiles3DLoader;
  tilesetJson.url = context.url;
  tilesetJson.basePath = getBaseUri(tilesetJson);
  tilesetJson.root = normalizeTileHeaders(tilesetJson);
  tilesetJson.type = TILESET_TYPE.TILES3D;
  tilesetJson.lodMetricType = LOD_METRIC_TYPE.GEOMETRIC_ERROR;
  tilesetJson.lodMetricValue = tilesetJson.root.lodMetricValue;
  return tilesetJson;
}

async function parse(data, options, context) {
  const loaderOptions = options['3d-tiles'] || {};
  let isTileset;

  if (loaderOptions.isTileset === 'auto') {
    isTileset = context.url && context.url.indexOf('.json') !== -1;
  } else {
    isTileset = loaderOptions.isTileset;
  }

  if (isTileset) {
    data = await parseTileset(data, options, context);
  } else {
    data = await parseTile(data, options, context);
  }

  return data;
}

const CESIUM_ION_URL = 'https://api.cesium.com/v1/assets';
async function getIonTilesetMetadata(accessToken, assetId) {
  if (!assetId) {
    const assets = await getIonAssets(accessToken);

    for (const item of assets.items) {
      if (item.type === '3DTILES') {
        assetId = item.id;
      }
    }
  }

  const ionAssetMetadata = await getIonAssetMetadata(accessToken, assetId);
  const {
    type,
    url
  } = ionAssetMetadata;
  assert$7(type === '3DTILES' && url);
  ionAssetMetadata.headers = {
    Authorization: "Bearer ".concat(ionAssetMetadata.accessToken)
  };
  return ionAssetMetadata;
}
async function getIonAssets(accessToken) {
  assert$7(accessToken);
  const url = CESIUM_ION_URL;
  const headers = {
    Authorization: "Bearer ".concat(accessToken)
  };
  const response = await fetchFile(url, {
    fetch: {
      headers,
      throws: true
    }
  });
  return await response.json();
}
async function getIonAssetMetadata(accessToken, assetId) {
  assert$7(accessToken, assetId);
  const headers = {
    Authorization: "Bearer ".concat(accessToken)
  };
  const url = "".concat(CESIUM_ION_URL, "/").concat(assetId);
  let response = await fetchFile("".concat(url), {
    fetch: {
      headers,
      throws: true
    }
  });
  let metadata = await response.json();
  response = await fetchFile("".concat(url, "/endpoint"), {
    fetch: {
      headers,
      throws: true
    }
  });
  const tilesetInfo = await response.json();
  metadata = { ...metadata,
    ...tilesetInfo
  };
  return metadata;
}

async function preload(url, options = {}) {
  options = options['cesium-ion'] || {};
  const {
    accessToken
  } = options;
  let assetId = options.assetId;

  if (!Number.isFinite(assetId)) {
    const matched = url.match(/\/([0-9]+)\/tileset.json/);
    assetId = matched && matched[1];
  }

  return getIonTilesetMetadata(accessToken, assetId);
}

const CesiumIonLoader = { ...Tiles3DLoader,
  id: 'cesium-ion',
  name: 'Cesium Ion',
  preload,
  parse: async (data, options, context) => {
    options = { ...options
    };
    options['3d-tiles'] = options['cesium-ion'];
    options.loader = CesiumIonLoader;
    return Tiles3DLoader.parse(data, options, context);
  },
  options: {
    'cesium-ion': { ...Tiles3DLoader.options['3d-tiles'],
      accessToken: null
    }
  }
};

// From https://github.com/potree/potree/blob/master/src/materials/PointCloudMaterial.js
function generateGradientTexture(gradient) {
    const size = 64;
    // create canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    // get context
    const context = canvas.getContext('2d');
    // draw gradient
    context.rect(0, 0, size, size);
    const ctxGradient = context.createLinearGradient(0, 0, size, size);
    for (let i = 0; i < gradient.length; i++) {
        const step = gradient[i];
        ctxGradient.addColorStop(step[0], '#' + step[1].getHexString());
    }
    context.fillStyle = ctxGradient;
    context.fill();
    //let texture = new THREE.Texture(canvas);
    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = LinearFilter;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(2, 2);
    // textureImage = texture.image;
    return texture;
}
function getCameraFrustum(camera) {
    camera.updateMatrix(); // make sure camera's local matrix is updated
    camera.updateMatrixWorld(); // make sure camera's world matrix is updated
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    const frustum = new Frustum();
    frustum.setFromProjectionMatrix(new Matrix4$1().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    return frustum;
}
function loadersPlaneToMesh(plane) {
    const group = new Group();
    // Create a basic rectangle geometry from math.gl plane
    const planeGeometry = new PlaneGeometry(10, 5);
    // Align the geometry to the plane
    const coplanarPoint = new Vector3$1(...plane.projectPointOntoPlane([0, 0, 0]));
    const normal = new Vector3$1(plane.normal.x, plane.normal.y, plane.normal.z);
    const focalPoint = new Vector3$1().copy(coplanarPoint).add(normal);
    planeGeometry.lookAt(focalPoint);
    planeGeometry.translate(coplanarPoint.x, coplanarPoint.y, coplanarPoint.z);
    // Edges
    /*
    const edges = new EdgesGeometry(planeGeometry)
    var dispPlane = new LineSegments(edges, new LineBasicMaterial({ color: 0x00ffff }))*/
    //plane
    const material = new MeshBasicMaterial({ color: 0x00ffff, side: DoubleSide });
    const mesh = new Mesh(planeGeometry, material);
    const arrowHelper = new ArrowHelper(normal, coplanarPoint, 5, 0xffff00);
    group.add(arrowHelper);
    group.add(mesh);
    return group;
}
function loadersBoundingBoxToMesh(tile) {
    // Create a basic rectangle geometry from math.gl half-axes
    const box = tile.boundingVolume;
    let redColor = 0;
    if (tile.content) {
        redColor = Math.min(tile.content.byteLength / 500000, 1.0);
    }
    const boxColor = new Color(redColor, 1.0, 0.0);
    const boxGeometry = new BoxGeometry(1, 1, 1);
    const boxRotate = getMatrix4FromHalfAxes(box.halfAxes);
    boxGeometry.applyMatrix4(boxRotate);
    const edges = new EdgesGeometry(boxGeometry);
    const dispPlane = new LineSegments(edges, new LineBasicMaterial({ color: boxColor }));
    dispPlane.position.copy(new Vector3$1(...box.center));
    return dispPlane;
}
function getMatrix4FromHalfAxes(halfAxes) {
    const m = halfAxes;
    const rotateMatrix = new Matrix4$1().fromArray([
        m[0] * 2,
        m[1] * 2,
        m[2] * 2,
        0,
        m[3] * 2,
        m[4] * 2,
        m[5] * 2,
        0,
        m[6] * 2,
        m[7] * 2,
        m[8] * 2,
        0,
        0,
        0,
        0,
        1,
    ]);
    return rotateMatrix;
}

class GLTFLoader extends Loader {

  constructor( manager ) {

    super( manager );

    this.dracoLoader = null;
    this.ddsLoader = null;
    this.ktx2Loader = null;
    this.meshoptDecoder = null;

    this.pluginCallbacks = [];

    this.register(function(parser) {
      return new GLTFMaterialsClearcoatExtension(parser)
    });

    this.register(function(parser) {
      return new GLTFTextureBasisUExtension(parser)
    });

    this.register(function(parser) {
      return new GLTFTextureWebPExtension(parser)
    });

    this.register(function(parser) {
      return new GLTFMaterialsTransmissionExtension(parser)
    });

    this.register(function(parser) {
      return new GLTFLightsExtension(parser)
    });

    this.register(function(parser) {
      return new GLTFMeshoptCompression(parser)
    });

  }

  load (url, onLoad, onProgress, onError) {
      var scope = this;

      var resourcePath;

      if (this.resourcePath !== '') {
        resourcePath = this.resourcePath;
      } else if (this.path !== '') {
        resourcePath = this.path;
      } else {
        resourcePath = LoaderUtils.extractUrlBase(url);
      }

      // Tells the LoadingManager to track an extra item, which resolves after
      // the model is fully loaded. This means the count of items loaded will
      // be incorrect, but ensures manager.onLoad() does not fire early.
      this.manager.itemStart(url);

      var _onError = function(e) {
        if (onError) {
          onError(e);
        } else {
          console.error(e);
        }

        scope.manager.itemError(url);
        scope.manager.itemEnd(url);
      };

      var loader = new FileLoader(this.manager);

      loader.setPath(this.path);
      loader.setResponseType('arraybuffer');
      loader.setRequestHeader(this.requestHeader);
      loader.setWithCredentials(this.withCredentials);

      loader.load(
        url,
        function(data) {
          try {
            scope.parse(
              data,
              resourcePath,
              function(gltf) {
                onLoad(gltf);

                scope.manager.itemEnd(url);
              },
              _onError,
            );
          } catch (e) {
            _onError(e);
          }
        },
        onProgress,
        _onError,
      );
    }

    setDRACOLoader(dracoLoader) {
      this.dracoLoader = dracoLoader;
      return this
    }

    setDDSLoader(ddsLoader) {
      this.ddsLoader = ddsLoader;
      return this
    }

    setKTX2Loader(ktx2Loader) {
      this.ktx2Loader = ktx2Loader;
      return this
    }

    setMeshoptDecoder(meshoptDecoder) {
      this.meshoptDecoder = meshoptDecoder;
      return this
    }

    register(callback) {
      if (this.pluginCallbacks.indexOf(callback) === -1) {
        this.pluginCallbacks.push(callback);
      }

      return this
    }

    unregister(callback) {
      if (this.pluginCallbacks.indexOf(callback) !== -1) {
        this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(callback), 1);
      }

      return this
    }

    parse(data, path, onLoad, onError) {
      var content;
      var extensions = {};
      var plugins = {};

      if (typeof data === 'string') {
        content = data;
      } else {
        var magic = LoaderUtils.decodeText(new Uint8Array(data, 0, 4));

        if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
          try {
            extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
          } catch (error) {
            if (onError) onError(error);
            return
          }

          content = extensions[EXTENSIONS.KHR_BINARY_GLTF].content;
        } else {
          content = LoaderUtils.decodeText(new Uint8Array(data));
        }
      }

      var json = data instanceof ArrayBuffer ? JSON.parse(content) : data;

      if (json.asset === undefined || json.asset.version[0] < 2) {
        if (onError)
          onError(
            new Error('THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.'),
          );
        return
      }

      var parser = new GLTFParser(json, {
        path: path || this.resourcePath || '',
        crossOrigin: this.crossOrigin,
        manager: this.manager,
        ktx2Loader: this.ktx2Loader,
        meshoptDecoder: this.meshoptDecoder,
      });

      parser.fileLoader.setRequestHeader(this.requestHeader);

      for (var i = 0; i < this.pluginCallbacks.length; i++) {
        var plugin = this.pluginCallbacks[i](parser);
        plugins[plugin.name] = plugin;

        // Workaround to avoid determining as unknown extension
        // in addUnknownExtensionsToUserData().
        // Remove this workaround if we move all the existing
        // extension handlers to plugin system
        extensions[plugin.name] = true;
      }

      if (json.extensionsUsed) {
        for (var i = 0; i < json.extensionsUsed.length; ++i) {
          var extensionName = json.extensionsUsed[i];
          var extensionsRequired = json.extensionsRequired || [];

          switch (extensionName) {
            case EXTENSIONS.KHR_MATERIALS_UNLIT:
              extensions[extensionName] = new GLTFMaterialsUnlitExtension();
              break

            case EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
              extensions[extensionName] = new GLTFMaterialsPbrSpecularGlossinessExtension();
              break

            case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
              extensions[extensionName] = new GLTFDracoMeshCompressionExtension(
                json,
                this.dracoLoader,
              );
              break

            case EXTENSIONS.MSFT_TEXTURE_DDS:
              extensions[extensionName] = new GLTFTextureDDSExtension(this.ddsLoader);
              break

            case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
              extensions[extensionName] = new GLTFTextureTransformExtension();
              break

            case EXTENSIONS.KHR_MESH_QUANTIZATION:
              extensions[extensionName] = new GLTFMeshQuantizationExtension();
              break

            default:
              if (
                extensionsRequired.indexOf(extensionName) >= 0 &&
                plugins[extensionName] === undefined
              ) {
                console.warn('THREE.GLTFLoader: Unknown extension "' + extensionName + '".');
              }
          }
        }
      }

      parser.setExtensions(extensions);
      parser.setPlugins(plugins);
      parser.parse(onLoad, onError);
    }
  }

  /* GLTFREGISTRY */

  function GLTFRegistry() {
    var objects = {};

    return {
      get: function(key) {
        return objects[key]
      },

      add: function(key, object) {
        objects[key] = object;
      },

      remove: function(key) {
        delete objects[key];
      },

      removeAll: function() {
        objects = {};
      },
    }
  }

  /*********************************/
  /********** EXTENSIONS ***********/
  /*********************************/

  var EXTENSIONS = {
    KHR_BINARY_GLTF: 'KHR_binary_glTF',
    KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
    KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
    KHR_MATERIALS_CLEARCOAT: 'KHR_materials_clearcoat',
    KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness',
    KHR_MATERIALS_TRANSMISSION: 'KHR_materials_transmission',
    KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
    KHR_TEXTURE_BASISU: 'KHR_texture_basisu',
    KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
    KHR_MESH_QUANTIZATION: 'KHR_mesh_quantization',
    EXT_TEXTURE_WEBP: 'EXT_texture_webp',
    EXT_MESHOPT_COMPRESSION: 'EXT_meshopt_compression',
    MSFT_TEXTURE_DDS: 'MSFT_texture_dds',
  };

  /**
   * DDS Texture Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/MSFT_texture_dds
   *
   */
  function GLTFTextureDDSExtension(ddsLoader) {
    if (!ddsLoader) {
      throw new Error(
        'THREE.GLTFLoader: Attempting to load .dds texture without importing DDSLoader',
      )
    }

    this.name = EXTENSIONS.MSFT_TEXTURE_DDS;
    this.ddsLoader = ddsLoader;
  }

  /**
   * Punctual Lights Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
   */
  function GLTFLightsExtension(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;

    // Object3D instance caches
    this.cache = { refs: {}, uses: {} };
  }

  GLTFLightsExtension.prototype._markDefs = function() {
    var parser = this.parser;
    var nodeDefs = this.parser.json.nodes || [];

    for (var nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
      var nodeDef = nodeDefs[nodeIndex];

      if (
        nodeDef.extensions &&
        nodeDef.extensions[this.name] &&
        nodeDef.extensions[this.name].light !== undefined
      ) {
        parser._addNodeRef(this.cache, nodeDef.extensions[this.name].light);
      }
    }
  };

  GLTFLightsExtension.prototype._loadLight = function(lightIndex) {
    var parser = this.parser;
    var cacheKey = 'light:' + lightIndex;
    var dependency = parser.cache.get(cacheKey);

    if (dependency) return dependency

    var json = parser.json;
    var extensions = (json.extensions && json.extensions[this.name]) || {};
    var lightDefs = extensions.lights || [];
    var lightDef = lightDefs[lightIndex];
    var lightNode;

    var color = new Color(0xffffff);

    if (lightDef.color !== undefined) color.fromArray(lightDef.color);

    var range = lightDef.range !== undefined ? lightDef.range : 0;

    switch (lightDef.type) {
      case 'directional':
        lightNode = new DirectionalLight(color);
        lightNode.target.position.set(0, 0, -1);
        lightNode.add(lightNode.target);
        break

      case 'point':
        lightNode = new PointLight(color);
        lightNode.distance = range;
        break

      case 'spot':
        lightNode = new SpotLight(color);
        lightNode.distance = range;
        // Handle spotlight properties.
        lightDef.spot = lightDef.spot || {};
        lightDef.spot.innerConeAngle =
          lightDef.spot.innerConeAngle !== undefined ? lightDef.spot.innerConeAngle : 0;
        lightDef.spot.outerConeAngle =
          lightDef.spot.outerConeAngle !== undefined ? lightDef.spot.outerConeAngle : Math.PI / 4.0;
        lightNode.angle = lightDef.spot.outerConeAngle;
        lightNode.penumbra = 1.0 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
        lightNode.target.position.set(0, 0, -1);
        lightNode.add(lightNode.target);
        break

      default:
        throw new Error('THREE.GLTFLoader: Unexpected light type, "' + lightDef.type + '".')
    }

    // Some lights (e.g. spot) default to a position other than the origin. Reset the position
    // here, because node-level parsing will only override position if explicitly specified.
    lightNode.position.set(0, 0, 0);

    lightNode.decay = 2;

    if (lightDef.intensity !== undefined) lightNode.intensity = lightDef.intensity;

    lightNode.name = parser.createUniqueName(lightDef.name || 'light_' + lightIndex);

    dependency = Promise.resolve(lightNode);

    parser.cache.add(cacheKey, dependency);

    return dependency
  };

  GLTFLightsExtension.prototype.createNodeAttachment = function(nodeIndex) {
    var self = this;
    var parser = this.parser;
    var json = parser.json;
    var nodeDef = json.nodes[nodeIndex] || nodeIndex;
    var lightDef = (nodeDef.extensions && nodeDef.extensions[this.name]) || {};
    var lightIndex = lightDef.light;

    if (lightIndex === undefined) return null

    return this._loadLight(lightIndex).then(function(light) {
      return parser._getNodeRef(self.cache, lightIndex, light)
    })
  };

  /**
   * Unlit Materials Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
   */
  function GLTFMaterialsUnlitExtension() {
    this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;
  }

  GLTFMaterialsUnlitExtension.prototype.getMaterialType = function() {
    return MeshBasicMaterial
  };

  GLTFMaterialsUnlitExtension.prototype.extendParams = function(
    materialParams,
    materialDef,
    parser,
  ) {
    var pending = [];

    materialParams.color = new Color(1.0, 1.0, 1.0);
    materialParams.opacity = 1.0;

    var metallicRoughness = materialDef.pbrMetallicRoughness;

    if (metallicRoughness) {
      if (Array.isArray(metallicRoughness.baseColorFactor)) {
        var array = metallicRoughness.baseColorFactor;

        materialParams.color.fromArray(array);
        materialParams.opacity = array[3];
      }

      if (metallicRoughness.baseColorTexture !== undefined) {
        pending.push(
          parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture),
        );
      }
    }

    return Promise.all(pending)
  };

  /**
   * Clearcoat Materials Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
   */
  function GLTFMaterialsClearcoatExtension(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;
  }

  GLTFMaterialsClearcoatExtension.prototype.getMaterialType = function(materialIndex) {
    var parser = this.parser;
    var materialDef = parser.json.materials[materialIndex] || materialIndex;

    if (!materialDef.extensions || !materialDef.extensions[this.name]) return null

    return MeshPhysicalMaterial
  };

  GLTFMaterialsClearcoatExtension.prototype.extendMaterialParams = function(
    materialIndex,
    materialParams,
  ) {
    var parser = this.parser;
    var materialDef = parser.json.materials[materialIndex] || materialIndex;

    if (!materialDef.extensions || !materialDef.extensions[this.name]) {
      return Promise.resolve()
    }

    var pending = [];

    var extension = materialDef.extensions[this.name];

    if (extension.clearcoatFactor !== undefined) {
      materialParams.clearcoat = extension.clearcoatFactor;
    }

    if (extension.clearcoatTexture !== undefined) {
      pending.push(parser.assignTexture(materialParams, 'clearcoatMap', extension.clearcoatTexture));
    }

    if (extension.clearcoatRoughnessFactor !== undefined) {
      materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;
    }

    if (extension.clearcoatRoughnessTexture !== undefined) {
      pending.push(
        parser.assignTexture(
          materialParams,
          'clearcoatRoughnessMap',
          extension.clearcoatRoughnessTexture,
        ),
      );
    }

    if (extension.clearcoatNormalTexture !== undefined) {
      pending.push(
        parser.assignTexture(
          materialParams,
          'clearcoatNormalMap',
          extension.clearcoatNormalTexture,
        ),
      );

      if (extension.clearcoatNormalTexture.scale !== undefined) {
        var scale = extension.clearcoatNormalTexture.scale;

        materialParams.clearcoatNormalScale = new Vector2$1(scale, scale);
      }
    }

    return Promise.all(pending)
  };

  /**
   * Transmission Materials Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
   * Draft: https://github.com/KhronosGroup/glTF/pull/1698
   */
  function GLTFMaterialsTransmissionExtension(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;
  }

  GLTFMaterialsTransmissionExtension.prototype.getMaterialType = function(materialIndex) {
    var parser = this.parser;
    var materialDef = parser.json.materials[materialIndex] || materialIndex;

    if (!materialDef.extensions || !materialDef.extensions[this.name]) return null

    return MeshPhysicalMaterial
  };

  GLTFMaterialsTransmissionExtension.prototype.extendMaterialParams = function(
    materialIndex,
    materialParams,
  ) {
    var parser = this.parser;
    var materialDef = parser.json.materials[materialIndex] || materialIndex;

    if (!materialDef.extensions || !materialDef.extensions[this.name]) {
      return Promise.resolve()
    }

    var pending = [];

    var extension = materialDef.extensions[this.name];

    if (extension.transmissionFactor !== undefined) {
      materialParams.transmission = extension.transmissionFactor;
    }

    if (extension.transmissionTexture !== undefined) {
      pending.push(
        parser.assignTexture(materialParams, 'transmissionMap', extension.transmissionTexture),
      );
    }

    return Promise.all(pending)
  };

  /**
   * BasisU Texture Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
   */
  function GLTFTextureBasisUExtension(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_TEXTURE_BASISU;
  }

  GLTFTextureBasisUExtension.prototype.loadTexture = function(textureIndex) {
    var parser = this.parser;
    var json = parser.json;

    var textureDef = json.textures[textureIndex] || textureIndex;

    if (!textureDef.extensions || !textureDef.extensions[this.name]) {
      return null
    }

    var extension = textureDef.extensions[this.name];
    var source = json.images[extension.source];
    var loader = parser.options.ktx2Loader;

    if (!loader) {
      if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {
        throw new Error(
          'THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures',
        )
      } else {
        // Assumes that the extension is optional and that a fallback texture is present
        return null
      }
    }

    return parser.loadTextureImage(textureIndex, source, loader)
  };

  /**
   * WebP Texture Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_webp
   */
  function GLTFTextureWebPExtension(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
    this.isSupported = null;
  }

  GLTFTextureWebPExtension.prototype.loadTexture = function(textureIndex) {
    var name = this.name;
    var parser = this.parser;
    var json = parser.json;

    var textureDef = json.textures[textureIndex];

    if (!textureDef.extensions || !textureDef.extensions[name]) {
      return null
    }

    var extension = textureDef.extensions[name];
    var source = json.images[extension.source];
    var loader = source.uri ? parser.options.manager.getHandler(source.uri) : parser.textureLoader;

    return this.detectSupport().then(function(isSupported) {
      if (isSupported) return parser.loadTextureImage(textureIndex, source, loader)

      if (json.extensionsRequired && json.extensionsRequired.indexOf(name) >= 0) {
        throw new Error('THREE.GLTFLoader: WebP required by asset but unsupported.')
      }

      // Fall back to PNG or JPEG.
      return parser.loadTexture(textureIndex)
    })
  };

  GLTFTextureWebPExtension.prototype.detectSupport = function() {
    if (!this.isSupported) {
      this.isSupported = new Promise(function(resolve) {
        var image = new Image();

        // Lossy test image. Support for lossy images doesn't guarantee support for all
        // WebP images, unfortunately.
        image.src =
          'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

        image.onload = image.onerror = function() {
          resolve(image.height === 1);
        };
      });
    }

    return this.isSupported
  };

  /**
   * meshopt BufferView Compression Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression
   */
  function GLTFMeshoptCompression(parser) {
    this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
    this.parser = parser;
  }

  GLTFMeshoptCompression.prototype.loadBufferView = function(index) {
    var json = this.parser.json;
    var bufferView = json.bufferViews[index] || index;

    if (bufferView.extensions && bufferView.extensions[this.name]) {
      var extensionDef = bufferView.extensions[this.name];

      var buffer = this.parser.getDependency('buffer', extensionDef.buffer);
      var decoder = this.parser.options.meshoptDecoder;

      if (!decoder || !decoder.supported) {
        if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {
          throw new Error(
            'THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files',
          )
        } else {
          // Assumes that the extension is optional and that fallback buffer data is present
          return null
        }
      }

      return Promise.all([buffer, decoder.ready]).then(function(res) {
        var byteOffset = extensionDef.byteOffset || 0;
        var byteLength = extensionDef.byteLength || 0;

        var count = extensionDef.count;
        var stride = extensionDef.byteStride;

        var result = new ArrayBuffer(count * stride);
        var source = new Uint8Array(res[0], byteOffset, byteLength);

        decoder.decodeGltfBuffer(
          new Uint8Array(result),
          count,
          stride,
          source,
          extensionDef.mode,
          extensionDef.filter,
        );
        return result
      })
    } else {
      return null
    }
  };

  /* BINARY EXTENSION */
  var BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
  var BINARY_EXTENSION_HEADER_LENGTH = 12;
  var BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4e4f534a, BIN: 0x004e4942 };

  function GLTFBinaryExtension(data) {
    this.name = EXTENSIONS.KHR_BINARY_GLTF;
    this.content = null;
    this.body = null;

    var headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);

    this.header = {
      magic: LoaderUtils.decodeText(new Uint8Array(data.slice(0, 4))),
      version: headerView.getUint32(4, true),
      length: headerView.getUint32(8, true),
    };

    if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
      throw new Error('THREE.GLTFLoader: Unsupported glTF-Binary header.')
    } else if (this.header.version < 2.0) {
      throw new Error('THREE.GLTFLoader: Legacy binary file detected.')
    }

    var chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
    var chunkIndex = 0;

    while (chunkIndex < chunkView.byteLength) {
      var chunkLength = chunkView.getUint32(chunkIndex, true);
      chunkIndex += 4;

      var chunkType = chunkView.getUint32(chunkIndex, true);
      chunkIndex += 4;

      if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
        var contentArray = new Uint8Array(
          data,
          BINARY_EXTENSION_HEADER_LENGTH + chunkIndex,
          chunkLength,
        );
        this.content = LoaderUtils.decodeText(contentArray);
      } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
        var byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
        this.body = data.slice(byteOffset, byteOffset + chunkLength);
      }

      // Clients must ignore chunks with unknown types.

      chunkIndex += chunkLength;
    }

    if (this.content === null) {
      throw new Error('THREE.GLTFLoader: JSON content not found.')
    }
  }

  /**
   * DRACO Mesh Compression Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
   */
  function GLTFDracoMeshCompressionExtension(json, dracoLoader) {
    if (!dracoLoader) {
      throw new Error('THREE.GLTFLoader: No DRACOLoader instance provided.')
    }

    this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
    this.json = json;
    this.dracoLoader = dracoLoader;
    this.dracoLoader.preload();
  }

  GLTFDracoMeshCompressionExtension.prototype.decodePrimitive = function(primitive, parser) {
    var json = this.json;
    var dracoLoader = this.dracoLoader;
    var bufferViewIndex = primitive.extensions[this.name].bufferView;
    var gltfAttributeMap = primitive.extensions[this.name].attributes;
    var threeAttributeMap = {};
    var attributeNormalizedMap = {};
    var attributeTypeMap = {};

    for (var attributeName in gltfAttributeMap) {
      var threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();

      threeAttributeMap[threeAttributeName] = gltfAttributeMap[attributeName];
    }

    for (attributeName in primitive.attributes) {
      var threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();

      if (gltfAttributeMap[attributeName] !== undefined) {
        var accessorDef = json.accessors[primitive.attributes[attributeName]];
        var componentType = WEBGL_COMPONENT_TYPES[accessorDef.componentType];

        attributeTypeMap[threeAttributeName] = componentType;
        attributeNormalizedMap[threeAttributeName] = accessorDef.normalized === true;
      }
    }

    return parser.getDependency('bufferView', bufferViewIndex).then(function(bufferView) {
      return new Promise(function(resolve) {
        dracoLoader.decodeDracoFile(
          bufferView,
          function(geometry) {
            for (var attributeName in geometry.attributes) {
              var attribute = geometry.attributes[attributeName];
              var normalized = attributeNormalizedMap[attributeName];

              if (normalized !== undefined) attribute.normalized = normalized;
            }
            
            resolve(geometry);
          },
          threeAttributeMap,
          attributeTypeMap,
        );
      })
    })
  };

  /**
   * Texture Transform Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
   */
  function GLTFTextureTransformExtension() {
    this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;
  }

  GLTFTextureTransformExtension.prototype.extendTexture = function(texture, transform) {
    texture = texture.clone();

    if (transform.offset !== undefined) {
      texture.offset.fromArray(transform.offset);
    }

    if (transform.rotation !== undefined) {
      texture.rotation = transform.rotation;
    }

    if (transform.scale !== undefined) {
      texture.repeat.fromArray(transform.scale);
    }

    if (transform.texCoord !== undefined) {
      console.warn(
        'THREE.GLTFLoader: Custom UV sets in "' + this.name + '" extension not yet supported.',
      );
    }

    texture.needsUpdate = true;

    return texture
  };

  /**
   * Specular-Glossiness Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness
   */

  /**
   * A sub class of StandardMaterial with some of the functionality
   * changed via the `onBeforeCompile` callback
   * @pailhead
   */

  function GLTFMeshStandardSGMaterial(params) {
    MeshStandardMaterial.call(this);

    this.isGLTFSpecularGlossinessMaterial = true;

    //various chunks that need replacing
    var specularMapParsFragmentChunk = [
      '#ifdef USE_SPECULARMAP',
      '	uniform sampler2D specularMap;',
      '#endif',
    ].join('\n');

    var glossinessMapParsFragmentChunk = [
      '#ifdef USE_GLOSSINESSMAP',
      '	uniform sampler2D glossinessMap;',
      '#endif',
    ].join('\n');

    var specularMapFragmentChunk = [
      'vec3 specularFactor = specular;',
      '#ifdef USE_SPECULARMAP',
      '	vec4 texelSpecular = texture2D( specularMap, vUv );',
      '	texelSpecular = sRGBToLinear( texelSpecular );',
      '	// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture',
      '	specularFactor *= texelSpecular.rgb;',
      '#endif',
    ].join('\n');

    var glossinessMapFragmentChunk = [
      'float glossinessFactor = glossiness;',
      '#ifdef USE_GLOSSINESSMAP',
      '	vec4 texelGlossiness = texture2D( glossinessMap, vUv );',
      '	// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture',
      '	glossinessFactor *= texelGlossiness.a;',
      '#endif',
    ].join('\n');

    var lightPhysicalFragmentChunk = [
      'PhysicalMaterial material;',
      'material.diffuseColor = diffuseColor.rgb * ( 1. - max( specularFactor.r, max( specularFactor.g, specularFactor.b ) ) );',
      'vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );',
      'float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );',
      'material.specularRoughness = max( 1.0 - glossinessFactor, 0.0525 ); // 0.0525 corresponds to the base mip of a 256 cubemap.',
      'material.specularRoughness += geometryRoughness;',
      'material.specularRoughness = min( material.specularRoughness, 1.0 );',
      'material.specularColor = specularFactor;',
    ].join('\n');

    var uniforms = {
      specular: { value: new Color().setHex(0xffffff) },
      glossiness: { value: 1 },
      specularMap: { value: null },
      glossinessMap: { value: null },
    };

    this._extraUniforms = uniforms;

    this.onBeforeCompile = function(shader) {
      for (var uniformName in uniforms) {
        shader.uniforms[uniformName] = uniforms[uniformName];
      }

      shader.fragmentShader = shader.fragmentShader
        .replace('uniform float roughness;', 'uniform vec3 specular;')
        .replace('uniform float metalness;', 'uniform float glossiness;')
        .replace('#include <roughnessmap_pars_fragment>', specularMapParsFragmentChunk)
        .replace('#include <metalnessmap_pars_fragment>', glossinessMapParsFragmentChunk)
        .replace('#include <roughnessmap_fragment>', specularMapFragmentChunk)
        .replace('#include <metalnessmap_fragment>', glossinessMapFragmentChunk)
        .replace('#include <lights_physical_fragment>', lightPhysicalFragmentChunk);
    };

    Object.defineProperties(this, {
      specular: {
        get: function() {
          return uniforms.specular.value
        },
        set: function(v) {
          uniforms.specular.value = v;
        },
      },

      specularMap: {
        get: function() {
          return uniforms.specularMap.value
        },
        set: function(v) {
          uniforms.specularMap.value = v;

          if (v) {
            this.defines.USE_SPECULARMAP = ''; // USE_UV is set by the renderer for specular maps
          } else {
            delete this.defines.USE_SPECULARMAP;
          }
        },
      },

      glossiness: {
        get: function() {
          return uniforms.glossiness.value
        },
        set: function(v) {
          uniforms.glossiness.value = v;
        },
      },

      glossinessMap: {
        get: function() {
          return uniforms.glossinessMap.value
        },
        set: function(v) {
          uniforms.glossinessMap.value = v;

          if (v) {
            this.defines.USE_GLOSSINESSMAP = '';
            this.defines.USE_UV = '';
          } else {
            delete this.defines.USE_GLOSSINESSMAP;
            delete this.defines.USE_UV;
          }
        },
      },
    });

    delete this.metalness;
    delete this.roughness;
    delete this.metalnessMap;
    delete this.roughnessMap;

    this.setValues(params);
  }

  GLTFMeshStandardSGMaterial.prototype = Object.create(MeshStandardMaterial.prototype);
  GLTFMeshStandardSGMaterial.prototype.constructor = GLTFMeshStandardSGMaterial;

  GLTFMeshStandardSGMaterial.prototype.copy = function(source) {
    MeshStandardMaterial.prototype.copy.call(this, source);
    this.specularMap = source.specularMap;
    this.specular.copy(source.specular);
    this.glossinessMap = source.glossinessMap;
    this.glossiness = source.glossiness;
    delete this.metalness;
    delete this.roughness;
    delete this.metalnessMap;
    delete this.roughnessMap;
    return this
  };

  function GLTFMaterialsPbrSpecularGlossinessExtension() {
    return {
      name: EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS,

      specularGlossinessParams: [
        'color',
        'map',
        'lightMap',
        'lightMapIntensity',
        'aoMap',
        'aoMapIntensity',
        'emissive',
        'emissiveIntensity',
        'emissiveMap',
        'bumpMap',
        'bumpScale',
        'normalMap',
        'normalMapType',
        'displacementMap',
        'displacementScale',
        'displacementBias',
        'specularMap',
        'specular',
        'glossinessMap',
        'glossiness',
        'alphaMap',
        'envMap',
        'envMapIntensity',
        'refractionRatio',
      ],

      getMaterialType: function() {
        return GLTFMeshStandardSGMaterial
      },

      extendParams: function(materialParams, materialDef, parser) {
        var pbrSpecularGlossiness = materialDef.extensions[this.name];

        materialParams.color = new Color(1.0, 1.0, 1.0);
        materialParams.opacity = 1.0;

        var pending = [];

        if (Array.isArray(pbrSpecularGlossiness.diffuseFactor)) {
          var array = pbrSpecularGlossiness.diffuseFactor;

          materialParams.color.fromArray(array);
          materialParams.opacity = array[3];
        }

        if (pbrSpecularGlossiness.diffuseTexture !== undefined) {
          pending.push(
            parser.assignTexture(materialParams, 'map', pbrSpecularGlossiness.diffuseTexture),
          );
        }

        materialParams.emissive = new Color(0.0, 0.0, 0.0);
        materialParams.glossiness =
          pbrSpecularGlossiness.glossinessFactor !== undefined
            ? pbrSpecularGlossiness.glossinessFactor
            : 1.0;
        materialParams.specular = new Color(1.0, 1.0, 1.0);

        if (Array.isArray(pbrSpecularGlossiness.specularFactor)) {
          materialParams.specular.fromArray(pbrSpecularGlossiness.specularFactor);
        }

        if (pbrSpecularGlossiness.specularGlossinessTexture !== undefined) {
          var specGlossMapDef = pbrSpecularGlossiness.specularGlossinessTexture;
          pending.push(parser.assignTexture(materialParams, 'glossinessMap', specGlossMapDef));
          pending.push(parser.assignTexture(materialParams, 'specularMap', specGlossMapDef));
        }

        return Promise.all(pending)
      },

      createMaterial: function(materialParams) {
        var material = new GLTFMeshStandardSGMaterial(materialParams);
        material.fog = true;

        material.color = materialParams.color;

        material.map = materialParams.map === undefined ? null : materialParams.map;

        material.lightMap = null;
        material.lightMapIntensity = 1.0;

        material.aoMap = materialParams.aoMap === undefined ? null : materialParams.aoMap;
        material.aoMapIntensity = 1.0;

        material.emissive = materialParams.emissive;
        material.emissiveIntensity = 1.0;
        material.emissiveMap =
          materialParams.emissiveMap === undefined ? null : materialParams.emissiveMap;

        material.bumpMap = materialParams.bumpMap === undefined ? null : materialParams.bumpMap;
        material.bumpScale = 1;

        material.normalMap =
          materialParams.normalMap === undefined ? null : materialParams.normalMap;
        material.normalMapType = TangentSpaceNormalMap;

        if (materialParams.normalScale) material.normalScale = materialParams.normalScale;

        material.displacementMap = null;
        material.displacementScale = 1;
        material.displacementBias = 0;

        material.specularMap =
          materialParams.specularMap === undefined ? null : materialParams.specularMap;
        material.specular = materialParams.specular;

        material.glossinessMap =
          materialParams.glossinessMap === undefined ? null : materialParams.glossinessMap;
        material.glossiness = materialParams.glossiness;

        material.alphaMap = null;

        material.envMap = materialParams.envMap === undefined ? null : materialParams.envMap;
        material.envMapIntensity = 1.0;

        material.refractionRatio = 0.98;

        return material
      },
    }
  }

  /**
   * Mesh Quantization Extension
   *
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
   */
  function GLTFMeshQuantizationExtension() {
    this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;
  }

  /*********************************/
  /********** INTERPOLATION ********/
  /*********************************/

  // Spline Interpolation
  // Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-c-spline-interpolation
  function GLTFCubicSplineInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
    Interpolant.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer);
  }

  GLTFCubicSplineInterpolant.prototype = Object.create(Interpolant.prototype);
  GLTFCubicSplineInterpolant.prototype.constructor = GLTFCubicSplineInterpolant;

  GLTFCubicSplineInterpolant.prototype.copySampleValue_ = function(index) {
    // Copies a sample value to the result buffer. See description of glTF
    // CUBICSPLINE values layout in interpolate_() function below.

    var result = this.resultBuffer,
      values = this.sampleValues,
      valueSize = this.valueSize,
      offset = index * valueSize * 3 + valueSize;

    for (var i = 0; i !== valueSize; i++) {
      result[i] = values[offset + i];
    }

    return result
  };

  GLTFCubicSplineInterpolant.prototype.beforeStart_ =
    GLTFCubicSplineInterpolant.prototype.copySampleValue_;

  GLTFCubicSplineInterpolant.prototype.afterEnd_ =
    GLTFCubicSplineInterpolant.prototype.copySampleValue_;

  GLTFCubicSplineInterpolant.prototype.interpolate_ = function(i1, t0, t, t1) {
    var result = this.resultBuffer;
    var values = this.sampleValues;
    var stride = this.valueSize;

    var stride2 = stride * 2;
    var stride3 = stride * 3;

    var td = t1 - t0;

    var p = (t - t0) / td;
    var pp = p * p;
    var ppp = pp * p;

    var offset1 = i1 * stride3;
    var offset0 = offset1 - stride3;

    var s2 = -2 * ppp + 3 * pp;
    var s3 = ppp - pp;
    var s0 = 1 - s2;
    var s1 = s3 - pp + p;

    // Layout of keyframe output values for CUBICSPLINE animations:
    //   [ inTangent_1, splineVertex_1, outTangent_1, inTangent_2, splineVertex_2, ... ]
    for (var i = 0; i !== stride; i++) {
      var p0 = values[offset0 + i + stride]; // splineVertex_k
      var m0 = values[offset0 + i + stride2] * td; // outTangent_k * (t_k+1 - t_k)
      var p1 = values[offset1 + i + stride]; // splineVertex_k+1
      var m1 = values[offset1 + i] * td; // inTangent_k+1 * (t_k+1 - t_k)

      result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;
    }

    return result
  };

  /*********************************/
  /********** INTERNALS ************/
  /*********************************/

  /* CONSTANTS */

  var WEBGL_CONSTANTS = {
    FLOAT: 5126,
    //FLOAT_MAT2: 35674,
    FLOAT_MAT3: 35675,
    FLOAT_MAT4: 35676,
    FLOAT_VEC2: 35664,
    FLOAT_VEC3: 35665,
    FLOAT_VEC4: 35666,
    LINEAR: 9729,
    REPEAT: 10497,
    SAMPLER_2D: 35678,
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6,
    UNSIGNED_BYTE: 5121,
    UNSIGNED_SHORT: 5123,
  };

  var WEBGL_COMPONENT_TYPES = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array,
  };

  var WEBGL_FILTERS = {
    9728: NearestFilter,
    9729: LinearFilter,
    9984: NearestMipmapNearestFilter,
    9985: LinearMipmapNearestFilter,
    9986: NearestMipmapLinearFilter,
    9987: LinearMipmapLinearFilter,
  };

  var WEBGL_WRAPPINGS = {
    33071: ClampToEdgeWrapping,
    33648: MirroredRepeatWrapping,
    10497: RepeatWrapping,
  };

  var WEBGL_TYPE_SIZES = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16,
  };

  var ATTRIBUTES = {
    POSITION: 'position',
    NORMAL: 'normal',
    TANGENT: 'tangent',
    TEXCOORD_0: 'uv',
    TEXCOORD_1: 'uv2',
    COLOR_0: 'color',
    WEIGHTS_0: 'skinWeight',
    JOINTS_0: 'skinIndex',
  };

  var PATH_PROPERTIES = {
    scale: 'scale',
    translation: 'position',
    rotation: 'quaternion',
    weights: 'morphTargetInfluences',
  };

  var INTERPOLATION = {
    CUBICSPLINE: undefined, // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
    // keyframe track will be initialized with a default interpolation type, then modified.
    LINEAR: InterpolateLinear,
    STEP: InterpolateDiscrete,
  };

  var ALPHA_MODES = {
    OPAQUE: 'OPAQUE',
    MASK: 'MASK',
    BLEND: 'BLEND',
  };

  /* UTILITY FUNCTIONS */

  function resolveURL(url, path) {
    // Invalid URL
    if (typeof url !== 'string' || url === '') return ''

    // Host Relative URL
    if (/^https?:\/\//i.test(path) && /^\//.test(url)) {
      path = path.replace(/(^https?:\/\/[^\/]+).*/i, '$1');
    }

    // Absolute URL http://,https://,//
    if (/^(https?:)?\/\//i.test(url)) return url

    // Data URI
    if (/^data:.*,.*$/i.test(url)) return url

    // Blob URL
    if (/^blob:.*$/i.test(url)) return url

    // Relative URL
    return path + url
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
   */
  function createDefaultMaterial(cache) {
    if (cache['DefaultMaterial'] === undefined) {
      cache['DefaultMaterial'] = new MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x000000,
        metalness: 1,
        roughness: 1,
        transparent: false,
        depthTest: true,
        side: FrontSide,
      });
    }

    return cache['DefaultMaterial']
  }

  function addUnknownExtensionsToUserData(knownExtensions, object, objectDef) {
    // Add unknown glTF extensions to an object's userData.

    for (var name in objectDef.extensions) {
      if (knownExtensions[name] === undefined) {
        object.userData.gltfExtensions = object.userData.gltfExtensions || {};
        object.userData.gltfExtensions[name] = objectDef.extensions[name];
      }
    }
  }

  /**
   * @param {Object3D|Material|BufferGeometry} object
   * @param {GLTF.definition} gltfDef
   */
  function assignExtrasToUserData(object, gltfDef) {
    if (gltfDef.extras !== undefined) {
      if (typeof gltfDef.extras === 'object') {
        Object.assign(object.userData, gltfDef.extras);
      } else {
        console.warn('THREE.GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras);
      }
    }
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
   *
   * @param {BufferGeometry} geometry
   * @param {Array<GLTF.Target>} targets
   * @param {GLTFParser} parser
   * @return {Promise<BufferGeometry>}
   */
  function addMorphTargets(geometry, targets, parser) {
    var hasMorphPosition = false;
    var hasMorphNormal = false;

    for (var i = 0, il = targets.length; i < il; i++) {
      var target = targets[i];

      if (target.POSITION !== undefined) hasMorphPosition = true;
      if (target.NORMAL !== undefined) hasMorphNormal = true;

      if (hasMorphPosition && hasMorphNormal) break
    }

    if (!hasMorphPosition && !hasMorphNormal) return Promise.resolve(geometry)

    var pendingPositionAccessors = [];
    var pendingNormalAccessors = [];

    for (var i = 0, il = targets.length; i < il; i++) {
      var target = targets[i];

      if (hasMorphPosition) {
        var pendingAccessor =
          target.POSITION !== undefined
            ? parser.getDependency('accessor', target.POSITION)
            : geometry.attributes.position;

        pendingPositionAccessors.push(pendingAccessor);
      }

      if (hasMorphNormal) {
        var pendingAccessor =
          target.NORMAL !== undefined
            ? parser.getDependency('accessor', target.NORMAL)
            : geometry.attributes.normal;

        pendingNormalAccessors.push(pendingAccessor);
      }
    }

    return Promise.all([
      Promise.all(pendingPositionAccessors),
      Promise.all(pendingNormalAccessors),
    ]).then(function(accessors) {
      var morphPositions = accessors[0];
      var morphNormals = accessors[1];

      if (hasMorphPosition) geometry.morphAttributes.position = morphPositions;
      if (hasMorphNormal) geometry.morphAttributes.normal = morphNormals;
      geometry.morphTargetsRelative = true;

      return geometry
    })
  }

  /**
   * @param {Mesh} mesh
   * @param {GLTF.Mesh} meshDef
   */
  function updateMorphTargets(mesh, meshDef) {
    mesh.updateMorphTargets();

    if (meshDef.weights !== undefined) {
      for (var i = 0, il = meshDef.weights.length; i < il; i++) {
        mesh.morphTargetInfluences[i] = meshDef.weights[i];
      }
    }

    // .extras has user-defined data, so check that .extras.targetNames is an array.
    if (meshDef.extras && Array.isArray(meshDef.extras.targetNames)) {
      var targetNames = meshDef.extras.targetNames;

      if (mesh.morphTargetInfluences.length === targetNames.length) {
        mesh.morphTargetDictionary = {};

        for (var i = 0, il = targetNames.length; i < il; i++) {
          mesh.morphTargetDictionary[targetNames[i]] = i;
        }
      } else {
        console.warn('THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.');
      }
    }
  }

  function createPrimitiveKey(primitiveDef) {
    var dracoExtension =
      primitiveDef.extensions && primitiveDef.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION];
    var geometryKey;

    if (dracoExtension) {
      geometryKey =
        'draco:' +
        dracoExtension.bufferView +
        ':' +
        dracoExtension.indices +
        ':' +
        createAttributesKey(dracoExtension.attributes);
    } else {
      geometryKey =
        primitiveDef.indices +
        ':' +
        createAttributesKey(primitiveDef.attributes) +
        ':' +
        primitiveDef.mode;
    }

    return geometryKey
  }

  function createAttributesKey(attributes) {
    var attributesKey = '';

    var keys = Object.keys(attributes).sort();

    for (var i = 0, il = keys.length; i < il; i++) {
      attributesKey += keys[i] + ':' + attributes[keys[i]] + ';';
    }

    return attributesKey
  }

  /* GLTF PARSER */

  function GLTFParser(json, options) {
    this.json = json || {};
    this.extensions = {};
    this.plugins = {};
    this.options = options || {};

    // loader object cache
    this.cache = new GLTFRegistry();

    // associations between Three.js objects and glTF elements
    this.associations = new Map();

    // BufferGeometry caching
    this.primitiveCache = {};

    // Object3D instance caches
    this.meshCache = { refs: {}, uses: {} };
    this.cameraCache = { refs: {}, uses: {} };
    this.lightCache = { refs: {}, uses: {} };

    // Track node names, to ensure no duplicates
    this.nodeNamesUsed = {};

    // Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
    // expensive work of uploading a texture to the GPU off the main thread.
    if (typeof createImageBitmap !== 'undefined' && /Firefox/.test(navigator.userAgent) === false) {
      this.textureLoader = new ImageBitmapLoader(this.options.manager);
    } else {
      this.textureLoader = new TextureLoader(this.options.manager);
    }

    this.textureLoader.setCrossOrigin(this.options.crossOrigin);

    this.fileLoader = new FileLoader(this.options.manager);
    this.fileLoader.setResponseType('arraybuffer');

    if (this.options.crossOrigin === 'use-credentials') {
      this.fileLoader.setWithCredentials(true);
    }

  }

  GLTFParser.prototype.setExtensions = function(extensions) {
    this.extensions = extensions;
  };

  GLTFParser.prototype.setPlugins = function(plugins) {
    this.plugins = plugins;
  };

  GLTFParser.prototype.parse = function(onLoad, onError) {
    var parser = this;
    var json = this.json;
    var extensions = this.extensions;

    // Clear the loader cache
    this.cache.removeAll();

    // Mark the special nodes/meshes in json for efficient parse
    this._invokeAll(function(ext) {
      return ext._markDefs && ext._markDefs()
    });

    Promise.all([
      this.getDependencies('scene'),
      this.getDependencies('animation'),
      this.getDependencies('camera'),
    ])
      .then(function(dependencies) {
        var result = {
          scene: dependencies[0][json.scene || 0],
          scenes: dependencies[0],
          animations: dependencies[1],
          cameras: dependencies[2],
          asset: json.asset,
          parser: parser,
          userData: {},
        };

        addUnknownExtensionsToUserData(extensions, result, json);

        assignExtrasToUserData(result, json);

        onLoad(result);
      })
      .catch(onError);
  };

  /**
   * Marks the special nodes/meshes in json for efficient parse.
   */
  GLTFParser.prototype._markDefs = function() {
    var nodeDefs = this.json.nodes || [];
    var skinDefs = this.json.skins || [];
    var meshDefs = this.json.meshes || [];

    // Nothing in the node definition indicates whether it is a Bone or an
    // Object3D. Use the skins' joint references to mark bones.
    for (var skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
      var joints = skinDefs[skinIndex].joints;

      for (var i = 0, il = joints.length; i < il; i++) {
        nodeDefs[joints[i]].isBone = true;
      }
    }

    // Iterate over all nodes, marking references to shared resources,
    // as well as skeleton joints.
    for (var nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
      var nodeDef = nodeDefs[nodeIndex];

      if (nodeDef.mesh !== undefined) {
        this._addNodeRef(this.meshCache, nodeDef.mesh);

        // Nothing in the mesh definition indicates whether it is
        // a SkinnedMesh or Mesh. Use the node's mesh reference
        // to mark SkinnedMesh if node has skin.
        if (nodeDef.skin !== undefined) {
          meshDefs[nodeDef.mesh].isSkinnedMesh = true;
        }
      }

      if (nodeDef.camera !== undefined) {
        this._addNodeRef(this.cameraCache, nodeDef.camera);
      }
    }
  };

  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   */
  GLTFParser.prototype._addNodeRef = function(cache, index) {
    if (index === undefined) return

    if (cache.refs[index] === undefined) {
      cache.refs[index] = cache.uses[index] = 0;
    }

    cache.refs[index]++;
  };

  /** Returns a reference to a shared resource, cloning it if necessary. */
  GLTFParser.prototype._getNodeRef = function(cache, index, object) {
    if (cache.refs[index] <= 1) return object

    var ref = object.clone();

    ref.name += '_instance_' + cache.uses[index]++;

    return ref
  };

  GLTFParser.prototype._invokeOne = function(func) {
    var extensions = Object.values(this.plugins);
    extensions.push(this);

    for (var i = 0; i < extensions.length; i++) {
      var result = func(extensions[i]);

      if (result) return result
    }
  };

  GLTFParser.prototype._invokeAll = function(func) {
    var extensions = Object.values(this.plugins);
    extensions.unshift(this);

    var pending = [];

    for (var i = 0; i < extensions.length; i++) {
      var result = func(extensions[i]);

      if (result) pending.push(result);
    }

    return pending
  };

  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  GLTFParser.prototype.getDependency = function(type, index) {
    var cacheKey = type + ':' + index;
    var dependency = typeof index == 'number' ? this.cache.get(cacheKey) : null;
    if (!dependency) {
      switch (type) {
        case 'scene':
          dependency = this.loadScene(index);
          break

        case 'node':
          dependency = this.loadNode(index);
          break

        case 'mesh':
          dependency = this._invokeOne(function(ext) {
            return ext.loadMesh && ext.loadMesh(index)
          });
          break

        case 'accessor':
          dependency = this.loadAccessor(index);
          break

        case 'bufferView':
          dependency = this._invokeOne(function(ext) {
            return ext.loadBufferView && ext.loadBufferView(index)
          });
          break

        case 'buffer':
          dependency = this.loadBuffer(index);
          break

        case 'material':
          dependency = this._invokeOne(function(ext) {
            return ext.loadMaterial && ext.loadMaterial(index)
          });
          break

        case 'texture':
          dependency = this._invokeOne(function(ext) {
            return ext.loadTexture && ext.loadTexture(index)
          });
          break

        case 'skin':
          dependency = this.loadSkin(index);
          break

        case 'animation':
          dependency = this.loadAnimation(index);
          break

        case 'camera':
          dependency = this.loadCamera(index);
          break

        default:
          throw new Error('Unknown type: ' + type)
      }

      this.cache.add(cacheKey, dependency);
    }

    return dependency
  };

  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  GLTFParser.prototype.getDependencies = function(type) {
    var dependencies = this.cache.get(type);

    if (!dependencies) {
      var parser = this;
      var defs = this.json[type + (type === 'mesh' ? 'es' : 's')] || [];

      dependencies = Promise.all(
        defs.map(function(def, index) {
          return parser.getDependency(type, index)
        }),
      );

      this.cache.add(type, dependencies);
    }

    return dependencies
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  GLTFParser.prototype.loadBuffer = function(bufferIndex) {
    var bufferDef = this.json.buffers[bufferIndex] || bufferIndex;
    var loader = this.fileLoader;

    if (bufferDef.type && bufferDef.type !== 'arraybuffer') {
      throw new Error('THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.')
    }

    // If present, GLB container is required to be the first buffer.
    if (
      bufferDef.uri === undefined &&
      bufferIndex === 0 &&
      this.extensions[EXTENSIONS.KHR_BINARY_GLTF]
    ) {
      return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body)
    }

    var options = this.options;

    return new Promise(function(resolve, reject) {
      loader.load(resolveURL(bufferDef.uri, options.path), resolve, undefined, function() {
        reject(new Error('THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'));
      });
    })
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  GLTFParser.prototype.loadBufferView = function(bufferViewIndex) {
    var bufferViewDef = this.json.bufferViews[bufferViewIndex] || bufferViewIndex;

    if (bufferViewDef.data) {
      return Promise.resolve(bufferViewDef.data)
    }

    return this.getDependency('buffer', bufferViewDef.buffer).then(function(buffer) {
      var byteLength = bufferViewDef.byteLength || 0;
      var byteOffset = bufferViewDef.byteOffset || 0;
      return buffer.slice(byteOffset, byteOffset + byteLength)
    })
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  GLTFParser.prototype.loadAccessor = function(accessorIndex) {
    var parser = this;
    var json = this.json;

    var accessorDef = this.json.accessors[accessorIndex] || accessorIndex;

    if (
      (accessorDef.bufferView === undefined || accessorDef.bufferView === null) &&
      accessorDef.sparse === undefined &&
      !accessorDef.value
    ) {
      // Ignore empty accessors, which may be used to declare runtime
      // information about attributes coming from another source (e.g. Draco
      // compression extension).
      return Promise.resolve(null)
    }

    var pendingBufferViews = [];

    if (accessorDef.bufferView !== undefined && !accessorDef.value) {
      pendingBufferViews.push(this.getDependency('bufferView', accessorDef.bufferView));
    } else {
      pendingBufferViews.push(null);
    }

    if (accessorDef.sparse !== undefined) {
      pendingBufferViews.push(
        this.getDependency('bufferView', accessorDef.sparse.indices.bufferView),
      );
      pendingBufferViews.push(
        this.getDependency('bufferView', accessorDef.sparse.values.bufferView),
      );
    }

    return Promise.all(pendingBufferViews).then(function(bufferViews) {
      var bufferView = bufferViews[0];

      var itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
      var TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];

      // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
      var elementBytes = TypedArray.BYTES_PER_ELEMENT;
      var itemBytes = elementBytes * itemSize;
      var byteOffset = accessorDef.byteOffset || 0;
      var byteStride =
        accessorDef.bufferView !== undefined && !accessorDef.value
          ? json.bufferViews[accessorDef.bufferView].byteStride
          : undefined;
      var normalized = accessorDef.normalized === true;
      var array, bufferAttribute;

      // The buffer is not interleaved if the stride is the item size in bytes.
      if (byteStride && byteStride !== itemBytes) {
        // Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
        // This makes sure that IBA.count reflects accessor.count properly
        var ibSlice = Math.floor(byteOffset / byteStride);
        var ibCacheKey =
          'InterleavedBuffer:' +
          accessorDef.bufferView +
          ':' +
          accessorDef.componentType +
          ':' +
          ibSlice +
          ':' +
          accessorDef.count;
        var ib = parser.cache.get(ibCacheKey);

        if (!ib) {
          array = new TypedArray(
            bufferView,
            ibSlice * byteStride,
            (accessorDef.count * byteStride) / elementBytes,
          );

          // Integer parameters to IB/IBA are in array elements, not bytes.
          ib = new InterleavedBuffer(array, byteStride / elementBytes);

          parser.cache.add(ibCacheKey, ib);
        }

        bufferAttribute = new InterleavedBufferAttribute(
          ib,
          itemSize,
          (byteOffset % byteStride) / elementBytes,
          normalized,
        );
      } else {
        if (accessorDef.value) {
          array = accessorDef.value;
        } else if (bufferView === null) {
          array = new TypedArray(accessorDef.count * itemSize);
        } else {
          array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);
        }

        bufferAttribute = new BufferAttribute(array, itemSize, normalized);
      }

      // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
      if (accessorDef.sparse !== undefined) {
        var itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
        var TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];

        var byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
        var byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

        var sparseIndices = new TypedArrayIndices(
          bufferViews[1],
          byteOffsetIndices,
          accessorDef.sparse.count * itemSizeIndices,
        );
        var sparseValues = new TypedArray(
          bufferViews[2],
          byteOffsetValues,
          accessorDef.sparse.count * itemSize,
        );

        if (bufferView !== null) {
          // Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
          bufferAttribute = new BufferAttribute(
            bufferAttribute.array.slice(),
            bufferAttribute.itemSize,
            bufferAttribute.normalized,
          );
        }

        for (var i = 0, il = sparseIndices.length; i < il; i++) {
          var index = sparseIndices[i];

          bufferAttribute.setX(index, sparseValues[i * itemSize]);
          if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
          if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
          if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
          if (itemSize >= 5)
            throw new Error('THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.')
        }
      }

      return bufferAttribute
    })
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture>}
   */
  GLTFParser.prototype.loadTexture = function(textureIndex) {
    var parser = this;
    var json = this.json;
    var options = this.options;

    var textureDef = json.textures[textureIndex] || textureIndex;

    var textureExtensions = textureDef.extensions || {};

    var source;

    if (textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS]) {
      source = json.images[textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS].source];
    } else {
      source = json.images[textureDef.source] || textureDef.source;
    }

    var loader;

    if (source.uri) {
      loader = options.manager.getHandler(source.uri);
    }

    if (!loader) {
      loader = textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS]
        ? parser.extensions[EXTENSIONS.MSFT_TEXTURE_DDS].ddsLoader
        : this.textureLoader;
    }

    return this.loadTextureImage(textureIndex, source, loader)
  };

  GLTFParser.prototype.loadTextureImage = function(textureIndex, source, loader) {
    var parser = this;
    var json = this.json;
    var options = this.options;

    var textureDef = json.textures[textureIndex] || textureIndex;

    var URL = self.URL || self.webkitURL;

    var sourceURI = source.uri;
    var isObjectURL = false;
    var hasAlpha = true;
    var blob = null;

    if (source.mimeType === 'image/jpeg') hasAlpha = false;

    if (source.bufferView !== undefined) {
      // Load binary image data from bufferView, if provided.

      sourceURI = parser.getDependency('bufferView', source.bufferView).then(function(bufferView) {
        if (source.mimeType === 'image/png') {
          // Inspect the PNG 'IHDR' chunk to determine whether the image could have an
          // alpha channel. This check is conservative — the image could have an alpha
          // channel with all values == 1, and the indexed type (colorType == 3) only
          // sometimes contains alpha.
          //
          // https://en.wikipedia.org/wiki/Portable_Network_Graphics#File_header
          var colorType = new DataView(bufferView, 25, 1).getUint8(0, false);
          hasAlpha = colorType === 6 || colorType === 4 || colorType === 3;
        }

        blob = new Blob([bufferView], { type: source.mimeType });
        return blob
      });
    }

    var textureLoad;

    if (loader.isImageBitmapLoader) {
      textureLoad = Promise.resolve(sourceURI)
        .then(function(blob) {
          return createImageBitmap(blob, { premultiplyAlpha: 'none' })
        })
        .then(function(imageBitmap) {
          return new CanvasTexture(imageBitmap)
        });
    } else {
      /* TODO: Different behaviors in different browsers?
       * https://www.andygup.net/performance-comparison-between-readasdataurl-and-createobjecturl/
       */
      textureLoad = Promise.resolve(sourceURI)
        .then(function(blob) {
          isObjectURL = true;
          sourceURI = URL.createObjectURL(blob);
          return sourceURI
        })
        .then(function(sourceURI) {
          return new Promise(function(resolve, reject) {
            var onLoad = resolve;

            loader.load(resolveURL(sourceURI, options.path), onLoad, undefined, reject);
          })
        });
    }
    return Promise.resolve(textureLoad).then(function(texture) {
      // Clean up resources and configure Texture.

      if (isObjectURL === true) {
        URL.revokeObjectURL(sourceURI);
      }

      texture.flipY = false;

      if (textureDef.name) texture.name = textureDef.name;

      // When there is definitely no alpha channel in the texture, set RGBFormat to save space.
      if (!hasAlpha) texture.format = RGBFormat;

      var samplers = json.samplers || {};
      var sampler = samplers[textureDef.sampler] || {};

      texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || LinearFilter;
      texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || LinearMipmapLinearFilter;
      texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || RepeatWrapping;
      texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || RepeatWrapping;

      parser.associations.set(texture, {
        type: 'textures',
        index: textureIndex,
      });

      return texture
    })
  };

  /**
   * Asynchronously assigns a texture to the given material parameters.
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @return {Promise}
   */
  GLTFParser.prototype.assignTexture = function(materialParams, mapName, mapDef) {
    var parser = this;

    return this.getDependency('texture', mapDef.index).then(function(texture) {
      // Materials sample aoMap from UV set 1 and other maps from UV set 0 - this can't be configured
      // However, we will copy UV set 0 to UV set 1 on demand for aoMap
      if (
        mapDef.texCoord !== undefined &&
        mapDef.texCoord != 0 &&
        !(mapName === 'aoMap' && mapDef.texCoord == 1)
      ) {
        console.warn(
          'THREE.GLTFLoader: Custom UV set ' +
            mapDef.texCoord +
            ' for texture ' +
            mapName +
            ' not yet supported.',
        );
      }

      if (parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]) {
        var transform =
          mapDef.extensions !== undefined
            ? mapDef.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]
            : undefined;

        if (transform) {
          var gltfReference = parser.associations.get(texture);
          texture = parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM].extendTexture(
            texture,
            transform,
          );
          parser.associations.set(texture, gltfReference);
        }
      }

      materialParams[mapName] = texture;
    })
  };

  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accomodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   * @param  {Object3D} mesh Mesh, Line, or Points instance.
   */
  GLTFParser.prototype.assignFinalMaterial = function(mesh) {
    var geometry = mesh.geometry;
    var material = mesh.material;

    var useVertexTangents = geometry.attributes.tangent !== undefined;
    var useVertexColors = geometry.attributes.color !== undefined;
    var useFlatShading = geometry.attributes.normal === undefined;
    var useSkinning = mesh.isSkinnedMesh === true;
    var useMorphTargets = Object.keys(geometry.morphAttributes).length > 0;
    var useMorphNormals = useMorphTargets && geometry.morphAttributes.normal !== undefined;

    if (mesh.isPoints) {
      var cacheKey = 'PointsMaterial:' + material.uuid;

      var pointsMaterial = this.cache.get(cacheKey);

      if (!pointsMaterial) {
        pointsMaterial = new PointsMaterial();
        Material.prototype.copy.call(pointsMaterial, material);
        pointsMaterial.color.copy(material.color);
        pointsMaterial.map = material.map;
        pointsMaterial.sizeAttenuation = false; // glTF spec says points should be 1px

        this.cache.add(cacheKey, pointsMaterial);
      }

      material = pointsMaterial;
    } else if (mesh.isLine) {
      var cacheKey = 'LineBasicMaterial:' + material.uuid;

      var lineMaterial = this.cache.get(cacheKey);

      if (!lineMaterial) {
        lineMaterial = new LineBasicMaterial();
        Material.prototype.copy.call(lineMaterial, material);
        lineMaterial.color.copy(material.color);

        this.cache.add(cacheKey, lineMaterial);
      }

      material = lineMaterial;
    }

    // Clone the material if it will be modified
    if (useVertexTangents || useVertexColors || useFlatShading || useSkinning || useMorphTargets) {
      var cacheKey = 'ClonedMaterial:' + material.uuid + ':';

      if (material.isGLTFSpecularGlossinessMaterial) cacheKey += 'specular-glossiness:';
      if (useSkinning) cacheKey += 'skinning:';
      if (useVertexTangents) cacheKey += 'vertex-tangents:';
      if (useVertexColors) cacheKey += 'vertex-colors:';
      if (useFlatShading) cacheKey += 'flat-shading:';
      if (useMorphTargets) cacheKey += 'morph-targets:';
      if (useMorphNormals) cacheKey += 'morph-normals:';

      var cachedMaterial = this.cache.get(cacheKey);

      if (!cachedMaterial) {
        cachedMaterial = material.clone();

        if (useSkinning) cachedMaterial.skinning = true;
        if (useVertexTangents) cachedMaterial.vertexTangents = true;
        if (useVertexColors) cachedMaterial.vertexColors = true;
        if (useFlatShading) cachedMaterial.flatShading = true;
        if (useMorphTargets) cachedMaterial.morphTargets = true;
        if (useMorphNormals) cachedMaterial.morphNormals = true;

        this.cache.add(cacheKey, cachedMaterial);

        this.associations.set(cachedMaterial, this.associations.get(material));
      }

      material = cachedMaterial;
    }

    // workarounds for mesh and geometry

    if (
      material.aoMap &&
      geometry.attributes.uv2 === undefined &&
      geometry.attributes.uv !== undefined
    ) {
      geometry.setAttribute('uv2', geometry.attributes.uv);
    }

    // https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
    if (material.normalScale && !useVertexTangents) {
      material.normalScale.y = -material.normalScale.y;
    }

    if (material.clearcoatNormalScale && !useVertexTangents) {
      material.clearcoatNormalScale.y = -material.clearcoatNormalScale.y;
    }

    mesh.material = material;
  };

  GLTFParser.prototype.getMaterialType = function(/* materialIndex */) {
    return MeshStandardMaterial
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  GLTFParser.prototype.loadMaterial = function(materialIndex) {
    var parser = this;
    var json = this.json;
    var extensions = this.extensions;
    var materialDef = json.materials[materialIndex] || materialIndex;

    var materialType;
    var materialParams = {};
    var materialExtensions = materialDef.extensions || {};

    var pending = [];

    if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
      var sgExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
      materialType = sgExtension.getMaterialType();
      pending.push(sgExtension.extendParams(materialParams, materialDef, parser));
    } else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
      var kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
      materialType = kmuExtension.getMaterialType();
      pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));
    } else {
      // Specification:
      // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

      var metallicRoughness = materialDef.pbrMetallicRoughness || {};

      materialParams.color = new Color(1.0, 1.0, 1.0);
      materialParams.opacity = 1.0;

      if (Array.isArray(metallicRoughness.baseColorFactor)) {
        var array = metallicRoughness.baseColorFactor;

        materialParams.color.fromArray(array);
        materialParams.opacity = array[3];
      }

      if (metallicRoughness.baseColorTexture !== undefined) {
        pending.push(
          parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture),
        );
      }

      materialParams.metalness =
        metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
      materialParams.roughness =
        metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;

      if (metallicRoughness.metallicRoughnessTexture !== undefined) {
        pending.push(
          parser.assignTexture(
            materialParams,
            'metalnessMap',
            metallicRoughness.metallicRoughnessTexture,
          ),
        );
        pending.push(
          parser.assignTexture(
            materialParams,
            'roughnessMap',
            metallicRoughness.metallicRoughnessTexture,
          ),
        );
      }

      materialType = this._invokeOne(function(ext) {
        return ext.getMaterialType && ext.getMaterialType(materialIndex)
      });

      pending.push(
        Promise.all(
          this._invokeAll(function(ext) {
            return (
              ext.extendMaterialParams && ext.extendMaterialParams(materialIndex, materialParams)
            )
          }),
        ),
      );
    }

    if (materialDef.doubleSided === true) {
      materialParams.side = DoubleSide;
    }

    var alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;

    if (alphaMode === ALPHA_MODES.BLEND) {
      materialParams.transparent = true;

      // See: https://github.com/mrdoob/three.js/issues/17706
      materialParams.depthWrite = false;
    } else {
      materialParams.transparent = false;

      if (alphaMode === ALPHA_MODES.MASK) {
        materialParams.alphaTest =
          materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;
      }
    }

    if (materialDef.normalTexture !== undefined && materialType !== MeshBasicMaterial) {
      pending.push(parser.assignTexture(materialParams, 'normalMap', materialDef.normalTexture));

      materialParams.normalScale = new Vector2$1(1, 1);

      if (materialDef.normalTexture.scale !== undefined) {
        materialParams.normalScale.set(
          materialDef.normalTexture.scale,
          materialDef.normalTexture.scale,
        );
      }
    }

    if (materialDef.occlusionTexture !== undefined && materialType !== MeshBasicMaterial) {
      pending.push(parser.assignTexture(materialParams, 'aoMap', materialDef.occlusionTexture));

      if (materialDef.occlusionTexture.strength !== undefined) {
        materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;
      }
    }

    if (materialDef.emissiveFactor !== undefined && materialType !== MeshBasicMaterial) {
      materialParams.emissive = new Color().fromArray(materialDef.emissiveFactor);
    }

    if (materialDef.emissiveTexture !== undefined && materialType !== MeshBasicMaterial) {
      pending.push(parser.assignTexture(materialParams, 'emissiveMap', materialDef.emissiveTexture));
    }

    return Promise.all(pending).then(function() {
      var material;

      if (materialType === GLTFMeshStandardSGMaterial) {
        material = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].createMaterial(
          materialParams,
        );
      } else {
        material = new materialType(materialParams);
      }

      if (materialDef.name) material.name = materialDef.name;

      // baseColorTexture, emissiveTexture, and specularGlossinessTexture use sRGB encoding.
      if (material.map) material.map.encoding = sRGBEncoding;
      if (material.emissiveMap) material.emissiveMap.encoding = sRGBEncoding;

      assignExtrasToUserData(material, materialDef);

      parser.associations.set(material, { type: 'materials', index: materialIndex });

      if (materialDef.extensions) addUnknownExtensionsToUserData(extensions, material, materialDef);

      return material
    })
  };

  /** When Object3D instances are targeted by animation, they need unique names. */
  GLTFParser.prototype.createUniqueName = function(originalName) {
    var name = PropertyBinding.sanitizeNodeName(originalName || '');

    for (var i = 1; this.nodeNamesUsed[name]; ++i) {
      name = originalName + '_' + i;
    }

    this.nodeNamesUsed[name] = true;

    return name
  };

  /**
   * @param {BufferGeometry} geometry
   * @param {GLTF.Primitive} primitiveDef
   * @param {GLTFParser} parser
   */
  function computeBounds(geometry, primitiveDef, parser) {
    var attributes = primitiveDef.attributes;

    var box = new Box3();

    if (attributes.POSITION !== undefined) {
      var accessor = parser.json.accessors[attributes.POSITION] || attributes.POSITION;

      var min = accessor.min;
      var max = accessor.max;

      // glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

      if (min !== undefined && max !== undefined) {
        box.set(new Vector3$1(min[0], min[1], min[2]), new Vector3$1(max[0], max[1], max[2]));
      } else {
        console.warn('THREE.GLTFLoader: Missing min/max properties for accessor POSITION.');

        return
      }
    } else {
      return
    }

    var targets = primitiveDef.targets;

    if (targets !== undefined) {
      var maxDisplacement = new Vector3$1();
      var vector = new Vector3$1();

      for (var i = 0, il = targets.length; i < il; i++) {
        var target = targets[i];

        if (target.POSITION !== undefined) {
          var accessor = parser.json.accessors[target.POSITION];
          var min = accessor.min;
          var max = accessor.max;

          // glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

          if (min !== undefined && max !== undefined) {
            // we need to get max of absolute components because target weight is [-1,1]
            vector.setX(Math.max(Math.abs(min[0]), Math.abs(max[0])));
            vector.setY(Math.max(Math.abs(min[1]), Math.abs(max[1])));
            vector.setZ(Math.max(Math.abs(min[2]), Math.abs(max[2])));

            // Note: this assumes that the sum of all weights is at most 1. This isn't quite correct - it's more conservative
            // to assume that each target can have a max weight of 1. However, for some use cases - notably, when morph targets
            // are used to implement key-frame animations and as such only two are active at a time - this results in very large
            // boxes. So for now we make a box that's sometimes a touch too small but is hopefully mostly of reasonable size.
            maxDisplacement.max(vector);
          } else {
            console.warn('THREE.GLTFLoader: Missing min/max properties for accessor POSITION.');
          }
        }
      }

      // As per comment above this box isn't conservative, but has a reasonable size for a very large number of morph targets.
      box.expandByVector(maxDisplacement);
    }

    geometry.boundingBox = box;

    var sphere = new Sphere();

    box.getCenter(sphere.center);
    sphere.radius = box.min.distanceTo(box.max) / 2;

    geometry.boundingSphere = sphere;
  }

  /**
   * @param {BufferGeometry} geometry
   * @param {GLTF.Primitive} primitiveDef
   * @param {GLTFParser} parser
   * @return {Promise<BufferGeometry>}
   */
  function addPrimitiveAttributes(geometry, primitiveDef, parser) {
    var attributes = primitiveDef.attributes;

    var pending = [];

    function assignAttributeAccessor(accessorIndex, attributeName) {
      return parser.getDependency('accessor', accessorIndex).then(function(accessor) {
        geometry.setAttribute(attributeName, accessor);
      })
    }

    for (var gltfAttributeName in attributes) {
      var threeAttributeName = ATTRIBUTES[gltfAttributeName] || gltfAttributeName.toLowerCase();

      // Skip attributes already provided by e.g. Draco extension.
      if (
        threeAttributeName in geometry.attributes &&
        geometry.attributes[threeAttributeName] != null
      )
        continue

      pending.push(assignAttributeAccessor(attributes[gltfAttributeName], threeAttributeName));
    }

    if (primitiveDef.indices !== undefined && ! geometry.index) {
      var accessor = parser
        .getDependency('accessor', primitiveDef.indices)
        .then(function(accessor) {
          geometry.setIndex(accessor);
        });

      pending.push(accessor);
    }

    assignExtrasToUserData(geometry, primitiveDef);

    computeBounds(geometry, primitiveDef, parser);

    return Promise.all(pending).then(function() {
      return primitiveDef.targets !== undefined
        ? addMorphTargets(geometry, primitiveDef.targets, parser)
        : geometry
    })
  }

  /**
   * @param {BufferGeometry} geometry
   * @param {Number} drawMode
   * @return {BufferGeometry}
   */
  function toTrianglesDrawMode(geometry, drawMode) {
    var index = geometry.getIndex();

    // generate index if not present

    if (index === null) {
      var indices = [];

      var position = geometry.getAttribute('position');

      if (position !== undefined) {
        for (var i = 0; i < position.count; i++) {
          indices.push(i);
        }

        geometry.setIndex(indices);
        index = geometry.getIndex();
      } else {
        console.error(
          'THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.',
        );
        return geometry
      }
    }

    //

    var numberOfTriangles = index.count - 2;
    var newIndices = [];

    if (drawMode === TriangleFanDrawMode) {
      // gl.TRIANGLE_FAN

      for (var i = 1; i <= numberOfTriangles; i++) {
        newIndices.push(index.getX(0));
        newIndices.push(index.getX(i));
        newIndices.push(index.getX(i + 1));
      }
    } else {
      // gl.TRIANGLE_STRIP

      for (var i = 0; i < numberOfTriangles; i++) {
        if (i % 2 === 0) {
          newIndices.push(index.getX(i));
          newIndices.push(index.getX(i + 1));
          newIndices.push(index.getX(i + 2));
        } else {
          newIndices.push(index.getX(i + 2));
          newIndices.push(index.getX(i + 1));
          newIndices.push(index.getX(i));
        }
      }
    }

    if (newIndices.length / 3 !== numberOfTriangles) {
      console.error(
        'THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles.',
      );
    }

    // build final geometry

    var newGeometry = geometry.clone();
    newGeometry.setIndex(newIndices);

    return newGeometry
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  GLTFParser.prototype.loadGeometries = function(primitives) {
    var parser = this;
    var extensions = this.extensions;
    var cache = this.primitiveCache;

    function createDracoPrimitive(primitive) {
      return extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]
        .decodePrimitive(primitive, parser)
        .then(function(geometry) {
          return addPrimitiveAttributes(geometry, primitive, parser)
        })
    }

    var pending = [];

    for (var i = 0, il = primitives.length; i < il; i++) {
      var primitive = primitives[i];

      var cacheKey = null;
      var cached = null;

      if (typeof primitive.indices == 'number') {
        cacheKey = createPrimitiveKey(primitive);
        cached = cache[cacheKey];
      }
      
      if (cached) {
        // Use the cached geometry if it exists
        pending.push(cached.promise);
      } else {
        var geometryPromise;
        
        if (
          primitive.extensions &&
          primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION] &&
          // TODO: There should be a better way to differentiate already loaded draco meshes.
          (typeof primitive.indices == 'number')
        ) {
          // Use DRACO geometry if available
          geometryPromise = createDracoPrimitive(primitive);
        } else {
          // Otherwise create a new geometry
          geometryPromise = addPrimitiveAttributes(new BufferGeometry(), primitive, parser);
        }

        // Cache this geometry
        if (cacheKey) {
          cache[cacheKey] = { primitive: primitive, promise: geometryPromise };
        }

        pending.push(geometryPromise);
      }
    }

    return Promise.all(pending)
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh>}
   */
  GLTFParser.prototype.loadMesh = function(meshIndex) {
    var parser = this;
    var json = this.json;

    var meshDef = json.meshes[meshIndex] || meshIndex;
    var primitives = meshDef.primitives;

    var pending = [];

    for (var i = 0, il = primitives.length; i < il; i++) {
      var material =
        primitives[i].material === undefined
          ? createDefaultMaterial(this.cache)
          : this.getDependency('material', primitives[i].material);

      pending.push(material);
    }

    pending.push(parser.loadGeometries(primitives));

    return Promise.all(pending).then(function(results) {
      var materials = results.slice(0, results.length - 1);
      var geometries = results[results.length - 1];

      var meshes = [];

      for (var i = 0, il = geometries.length; i < il; i++) {
        var geometry = geometries[i];
        var primitive = primitives[i];

        // 1. create Mesh

        var mesh;

        var material = materials[i];

        if (
          primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
          primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
          primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
          primitive.mode === undefined
        ) {
          // .isSkinnedMesh isn't in glTF spec. See ._markDefs()
          mesh =
            meshDef.isSkinnedMesh === true
              ? new SkinnedMesh(geometry, material)
              : new Mesh(geometry, material);

          if (mesh.isSkinnedMesh === true && !mesh.geometry.attributes.skinWeight.normalized) {
            // we normalize floating point skin weight array to fix malformed assets (see #15319)
            // it's important to skip this for non-float32 data since normalizeSkinWeights assumes non-normalized inputs
            mesh.normalizeSkinWeights();
          }

          if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
            mesh.geometry = toTrianglesDrawMode(mesh.geometry, TriangleStripDrawMode);
          } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
            mesh.geometry = toTrianglesDrawMode(mesh.geometry, TriangleFanDrawMode);
          }
        } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {
          mesh = new LineSegments(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {
          mesh = new Line(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
          mesh = new LineLoop(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
          mesh = new Points(geometry, material);
        } else {
          throw new Error('THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode)
        }

        if (Object.keys(mesh.geometry.morphAttributes).length > 0) {
          updateMorphTargets(mesh, meshDef);
        }

        mesh.name = parser.createUniqueName(meshDef.name || 'mesh_' + meshIndex);

        assignExtrasToUserData(mesh, meshDef);

        parser.assignFinalMaterial(mesh);

        meshes.push(mesh);
      }

      if (meshes.length === 1) {
        return meshes[0]
      }

      var group = new Group();

      for (var i = 0, il = meshes.length; i < il; i++) {
        group.add(meshes[i]);
      }

      return group
    })
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   * @param {number} cameraIndex
   * @return {Promise<THREE.Camera>}
   */
  GLTFParser.prototype.loadCamera = function(cameraIndex) {
    var camera;
    var cameraDef = this.json.cameras[cameraIndex];
    var params = cameraDef[cameraDef.type];

    if (!params) {
      console.warn('THREE.GLTFLoader: Missing camera parameters.');
      return
    }

    if (cameraDef.type === 'perspective') {
      camera = new PerspectiveCamera(
        MathUtils.radToDeg(params.yfov),
        params.aspectRatio || 1,
        params.znear || 1,
        params.zfar || 2e6,
      );
    } else if (cameraDef.type === 'orthographic') {
      camera = new OrthographicCamera(
        -params.xmag,
        params.xmag,
        params.ymag,
        -params.ymag,
        params.znear,
        params.zfar,
      );
    }

    if (cameraDef.name) camera.name = this.createUniqueName(cameraDef.name);

    assignExtrasToUserData(camera, cameraDef);

    return Promise.resolve(camera)
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   * @param {number} skinIndex
   * @return {Promise<Object>}
   */
  GLTFParser.prototype.loadSkin = function(skinIndex) {
    var skinDef = this.json.skins[skinIndex];

    var skinEntry = { joints: skinDef.joints };

    if (skinDef.inverseBindMatrices === undefined) {
      return Promise.resolve(skinEntry)
    }

    return this.getDependency('accessor', skinDef.inverseBindMatrices).then(function(accessor) {
      skinEntry.inverseBindMatrices = accessor;

      return skinEntry
    })
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  GLTFParser.prototype.loadAnimation = function(animationIndex) {
    var json = this.json;

    var animationDef = json.animations[animationIndex];

    var pendingNodes = [];
    var pendingInputAccessors = [];
    var pendingOutputAccessors = [];
    var pendingSamplers = [];
    var pendingTargets = [];

    for (var i = 0, il = animationDef.channels.length; i < il; i++) {
      var channel = animationDef.channels[i];
      var sampler = animationDef.samplers[channel.sampler];
      var target = channel.target;
      var name = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
      var input =
        animationDef.parameters !== undefined
          ? animationDef.parameters[sampler.input]
          : sampler.input;
      var output =
        animationDef.parameters !== undefined
          ? animationDef.parameters[sampler.output]
          : sampler.output;

      pendingNodes.push(this.getDependency('node', name));
      pendingInputAccessors.push(this.getDependency('accessor', input));
      pendingOutputAccessors.push(this.getDependency('accessor', output));
      pendingSamplers.push(sampler);
      pendingTargets.push(target);
    }

    return Promise.all([
      Promise.all(pendingNodes),
      Promise.all(pendingInputAccessors),
      Promise.all(pendingOutputAccessors),
      Promise.all(pendingSamplers),
      Promise.all(pendingTargets),
    ]).then(function(dependencies) {
      var nodes = dependencies[0];
      var inputAccessors = dependencies[1];
      var outputAccessors = dependencies[2];
      var samplers = dependencies[3];
      var targets = dependencies[4];

      var tracks = [];

      for (var i = 0, il = nodes.length; i < il; i++) {
        var node = nodes[i];
        var inputAccessor = inputAccessors[i];
        var outputAccessor = outputAccessors[i];
        var sampler = samplers[i];
        var target = targets[i];

        if (node === undefined) continue

        node.updateMatrix();
        node.matrixAutoUpdate = true;

        var TypedKeyframeTrack;

        switch (PATH_PROPERTIES[target.path]) {
          case PATH_PROPERTIES.weights:
            TypedKeyframeTrack = NumberKeyframeTrack;
            break

          case PATH_PROPERTIES.rotation:
            TypedKeyframeTrack = QuaternionKeyframeTrack;
            break

          case PATH_PROPERTIES.position:
          case PATH_PROPERTIES.scale:
          default:
            TypedKeyframeTrack = VectorKeyframeTrack;
            break
        }

        var targetName = node.name ? node.name : node.uuid;

        var interpolation =
          sampler.interpolation !== undefined
            ? INTERPOLATION[sampler.interpolation]
            : InterpolateLinear;

        var targetNames = [];

        if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
          // Node may be a Group (glTF mesh with several primitives) or a Mesh.
          node.traverse(function(object) {
            if (object.isMesh === true && object.morphTargetInfluences) {
              targetNames.push(object.name ? object.name : object.uuid);
            }
          });
        } else {
          targetNames.push(targetName);
        }

        var outputArray = outputAccessor.array;

        if (outputAccessor.normalized) {
          var scale;

          if (outputArray.constructor === Int8Array) {
            scale = 1 / 127;
          } else if (outputArray.constructor === Uint8Array) {
            scale = 1 / 255;
          } else if (outputArray.constructor == Int16Array) {
            scale = 1 / 32767;
          } else if (outputArray.constructor === Uint16Array) {
            scale = 1 / 65535;
          } else {
            throw new Error('THREE.GLTFLoader: Unsupported output accessor component type.')
          }

          var scaled = new Float32Array(outputArray.length);

          for (var j = 0, jl = outputArray.length; j < jl; j++) {
            scaled[j] = outputArray[j] * scale;
          }

          outputArray = scaled;
        }

        for (var j = 0, jl = targetNames.length; j < jl; j++) {
          var track = new TypedKeyframeTrack(
            targetNames[j] + '.' + PATH_PROPERTIES[target.path],
            inputAccessor.array,
            outputArray,
            interpolation,
          );

          // Override interpolation with custom factory method.
          if (sampler.interpolation === 'CUBICSPLINE') {
            track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result) {
              // A CUBICSPLINE keyframe in glTF has three output values for each input value,
              // representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
              // must be divided by three to get the interpolant's sampleSize argument.

              return new GLTFCubicSplineInterpolant(
                this.times,
                this.values,
                this.getValueSize() / 3,
                result,
              )
            };

            // Mark as CUBICSPLINE. `track.getInterpolation()` doesn't support custom interpolants.
            track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
          }

          tracks.push(track);
        }
      }

      var name = animationDef.name ? animationDef.name : 'animation_' + animationIndex;

      return new AnimationClip(name, undefined, tracks)
    })
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  GLTFParser.prototype.loadNode = function(nodeIndex) {
    var json = this.json;
    var extensions = this.extensions;
    var parser = this;

    var nodeDef = json.nodes[nodeIndex] || nodeIndex;

    // reserve node's name before its dependencies, so the root has the intended name.
    var nodeName = nodeDef.name ? parser.createUniqueName(nodeDef.name) : '';

    return (function() {
      var pending = [];

      if (nodeDef.mesh !== undefined) {
        pending.push(
          parser.getDependency('mesh', nodeDef.mesh).then(function(mesh) {
            var node = parser._getNodeRef(parser.meshCache, nodeDef.mesh, mesh);

            // if weights are provided on the node, override weights on the mesh.
            if (nodeDef.weights !== undefined) {
              node.traverse(function(o) {
                if (!o.isMesh) return

                for (var i = 0, il = nodeDef.weights.length; i < il; i++) {
                  o.morphTargetInfluences[i] = nodeDef.weights[i];
                }
              });
            }

            return node
          }),
        );
      }

      if (nodeDef.camera !== undefined) {
        pending.push(
          parser.getDependency('camera', nodeDef.camera).then(function(camera) {
            return parser._getNodeRef(parser.cameraCache, nodeDef.camera, camera)
          }),
        );
      }

      parser
        ._invokeAll(function(ext) {
          return ext.createNodeAttachment && ext.createNodeAttachment(nodeIndex)
        })
        .forEach(function(promise) {
          pending.push(promise);
        });

      return Promise.all(pending)
    })().then(function(objects) {
      var node;

      // .isBone isn't in glTF spec. See ._markDefs
      if (nodeDef.isBone === true) {
        node = new Bone();
      } else if (objects.length > 1) {
        node = new Group();
      } else if (objects.length === 1) {
        node = objects[0];
      } else {
        node = new Object3D();
      }

      if (node !== objects[0]) {
        for (var i = 0, il = objects.length; i < il; i++) {
          node.add(objects[i]);
        }
      }

      if (nodeDef.name) {
        node.userData.name = nodeDef.name;
        node.name = nodeName;
      }

      assignExtrasToUserData(node, nodeDef);

      if (nodeDef.extensions) addUnknownExtensionsToUserData(extensions, node, nodeDef);

      if (nodeDef.matrix !== undefined) {
        var matrix = new Matrix4$1();
        matrix.fromArray(nodeDef.matrix);
        node.applyMatrix4(matrix);
      } else {
        if (nodeDef.translation !== undefined) {
          node.position.fromArray(nodeDef.translation);
        }

        if (nodeDef.rotation !== undefined) {
          node.quaternion.fromArray(nodeDef.rotation);
        }

        if (nodeDef.scale !== undefined) {
          node.scale.fromArray(nodeDef.scale);
        }
      }

      parser.associations.set(node, { type: 'nodes', index: nodeIndex });

      return node
    })
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  GLTFParser.prototype.loadScene = (function() {
    // scene node hierachy builder

    function buildNodeHierachy(nodeId, parentObject, json, parser) {
      var nodeDef = json.nodes[nodeId] || nodeId;

      return parser
        .getDependency('node', nodeId)
        .then(function(node) {
          if (nodeDef.skin === undefined) return node

          // build skeleton here as well

          var skinEntry;

          return parser
            .getDependency('skin', nodeDef.skin)
            .then(function(skin) {
              skinEntry = skin;

              var pendingJoints = [];

              for (var i = 0, il = skinEntry.joints.length; i < il; i++) {
                pendingJoints.push(parser.getDependency('node', skinEntry.joints[i]));
              }

              return Promise.all(pendingJoints)
            })
            .then(function(jointNodes) {
              node.traverse(function(mesh) {
                if (!mesh.isMesh) return

                var bones = [];
                var boneInverses = [];

                for (var j = 0, jl = jointNodes.length; j < jl; j++) {
                  var jointNode = jointNodes[j];

                  if (jointNode) {
                    bones.push(jointNode);

                    var mat = new Matrix4$1();

                    if (skinEntry.inverseBindMatrices !== undefined) {
                      mat.fromArray(skinEntry.inverseBindMatrices.array, j * 16);
                    }

                    boneInverses.push(mat);
                  } else {
                    console.warn(
                      'THREE.GLTFLoader: Joint "%s" could not be found.',
                      skinEntry.joints[j],
                    );
                  }
                }

                mesh.bind(new Skeleton(bones, boneInverses), mesh.matrixWorld);
              });

              return node
            })
        })
        .then(function(node) {
          // build node hierachy

          parentObject.add(node);

          var pending = [];

          if (nodeDef.children) {
            var children = nodeDef.children;

            for (var i = 0, il = children.length; i < il; i++) {
              var child = children[i];
              pending.push(buildNodeHierachy(child, node, json, parser));
            }
          }

          return Promise.all(pending)
        })
    }

    return function loadScene(sceneIndex) {
      var json = this.json;
      var extensions = this.extensions;
      var sceneDef = this.json.scenes[sceneIndex];
      var parser = this;

      // Loader returns Group, not Scene.
      // See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172
      var scene = new Group();
      if (sceneDef.name) scene.name = parser.createUniqueName(sceneDef.name);

      assignExtrasToUserData(scene, sceneDef);

      if (sceneDef.extensions) addUnknownExtensionsToUserData(extensions, scene, sceneDef);

      var nodeIds = sceneDef.nodes || [];

      var pending = [];

      for (var i = 0, il = nodeIds.length; i < il; i++) {
        pending.push(buildNodeHierachy(nodeIds[i], scene, json, parser));
      }

      return Promise.all(pending).then(function() {
        return scene
      })
    }
  })();

const Gradients = {
    // From chroma spectral http://gka.github.io/chroma.js/
    SPECTRAL: [
        [0, new Color(0.3686, 0.3098, 0.6353)],
        [0.1, new Color(0.1961, 0.5333, 0.7412)],
        [0.2, new Color(0.4, 0.7608, 0.6471)],
        [0.3, new Color(0.6706, 0.8667, 0.6431)],
        [0.4, new Color(0.902, 0.9608, 0.5961)],
        [0.5, new Color(1.0, 1.0, 0.749)],
        [0.6, new Color(0.9961, 0.8784, 0.5451)],
        [0.7, new Color(0.9922, 0.6824, 0.3804)],
        [0.8, new Color(0.9569, 0.4275, 0.2627)],
        [0.9, new Color(0.8353, 0.2431, 0.3098)],
        [1, new Color(0.6196, 0.0039, 0.2588)],
    ],
    PLASMA: [
        [0.0, new Color(0.241, 0.015, 0.61)],
        [0.1, new Color(0.387, 0.001, 0.654)],
        [0.2, new Color(0.524, 0.025, 0.653)],
        [0.3, new Color(0.651, 0.125, 0.596)],
        [0.4, new Color(0.752, 0.227, 0.513)],
        [0.5, new Color(0.837, 0.329, 0.431)],
        [0.6, new Color(0.907, 0.435, 0.353)],
        [0.7, new Color(0.963, 0.554, 0.272)],
        [0.8, new Color(0.992, 0.681, 0.195)],
        [0.9, new Color(0.987, 0.822, 0.144)],
        [1.0, new Color(0.94, 0.975, 0.131)],
    ],
    YELLOW_GREEN: [
        [0, new Color(0.1647, 0.2824, 0.3451)],
        [0.1, new Color(0.1338, 0.3555, 0.4227)],
        [0.2, new Color(0.061, 0.4319, 0.4864)],
        [0.3, new Color(0.0, 0.5099, 0.5319)],
        [0.4, new Color(0.0, 0.5881, 0.5569)],
        [0.5, new Color(0.137, 0.665, 0.5614)],
        [0.6, new Color(0.2906, 0.7395, 0.5477)],
        [0.7, new Color(0.4453, 0.8099, 0.5201)],
        [0.8, new Color(0.6102, 0.8748, 0.485)],
        [0.9, new Color(0.7883, 0.9323, 0.4514)],
        [1, new Color(0.9804, 0.9804, 0.4314)],
    ],
    VIRIDIS: [
        [0.0, new Color(0.267, 0.005, 0.329)],
        [0.1, new Color(0.283, 0.141, 0.458)],
        [0.2, new Color(0.254, 0.265, 0.53)],
        [0.3, new Color(0.207, 0.372, 0.553)],
        [0.4, new Color(0.164, 0.471, 0.558)],
        [0.5, new Color(0.128, 0.567, 0.551)],
        [0.6, new Color(0.135, 0.659, 0.518)],
        [0.7, new Color(0.267, 0.749, 0.441)],
        [0.8, new Color(0.478, 0.821, 0.318)],
        [0.9, new Color(0.741, 0.873, 0.15)],
        [1.0, new Color(0.993, 0.906, 0.144)],
    ],
    INFERNO: [
        [0.0, new Color(0.077, 0.042, 0.206)],
        [0.1, new Color(0.225, 0.036, 0.388)],
        [0.2, new Color(0.373, 0.074, 0.432)],
        [0.3, new Color(0.522, 0.128, 0.42)],
        [0.4, new Color(0.665, 0.182, 0.37)],
        [0.5, new Color(0.797, 0.255, 0.287)],
        [0.6, new Color(0.902, 0.364, 0.184)],
        [0.7, new Color(0.969, 0.516, 0.063)],
        [0.8, new Color(0.988, 0.683, 0.072)],
        [0.9, new Color(0.961, 0.859, 0.298)],
        [1.0, new Color(0.988, 0.998, 0.645)],
    ],
    GRAYSCALE: [
        [0, new Color(0, 0, 0)],
        [1, new Color(1, 1, 1)],
    ],
    // 16 samples of the TURBU color scheme
    // values taken from: https://gist.github.com/mikhailov-work/ee72ba4191942acecc03fe6da94fc73f
    // original file licensed under Apache-2.0
    TURBO: [
        [0.0, new Color(0.18995, 0.07176, 0.23217)],
        [0.07, new Color(0.25107, 0.25237, 0.63374)],
        [0.13, new Color(0.27628, 0.42118, 0.89123)],
        [0.2, new Color(0.25862, 0.57958, 0.99876)],
        [0.27, new Color(0.15844, 0.73551, 0.92305)],
        [0.33, new Color(0.09267, 0.86554, 0.7623)],
        [0.4, new Color(0.19659, 0.94901, 0.59466)],
        [0.47, new Color(0.42778, 0.99419, 0.38575)],
        [0.53, new Color(0.64362, 0.98999, 0.23356)],
        [0.6, new Color(0.80473, 0.92452, 0.20459)],
        [0.67, new Color(0.93301, 0.81236, 0.22667)],
        [0.73, new Color(0.99314, 0.67408, 0.20348)],
        [0.8, new Color(0.9836, 0.49291, 0.12849)],
        [0.87, new Color(0.92105, 0.31489, 0.05475)],
        [0.93, new Color(0.81608, 0.18462, 0.01809)],
        [1.0, new Color(0.66449, 0.08436, 0.00424)],
    ],
    RAINBOW: [
        [0, new Color(0.278, 0, 0.714)],
        [1 / 6, new Color(0, 0, 1)],
        [2 / 6, new Color(0, 1, 1)],
        [3 / 6, new Color(0, 1, 0)],
        [4 / 6, new Color(1, 1, 0)],
        [5 / 6, new Color(1, 0.64, 0)],
        [1, new Color(1, 0, 0)],
    ],
    CONTOUR: [
        [0.0, new Color(0, 0, 0)],
        [0.03, new Color(0, 0, 0)],
        [0.04, new Color(1, 1, 1)],
        [1.0, new Color(1, 1, 1)],
    ],
};

const MeshFS = `
  uniform sampler2D map;
  varying vec2 vUv;

  void main() {
    vec4 realColor = texture2D(map, vUv);
    gl_FragColor = realColor;
  }
`;
const MeshVS = `
  varying vec2 vUv;
  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;
const PointCloudFS = `
  varying vec3 vColor;
  void main() {
    if (vColor == vec3(0.0, 0.0, 0.0)) {
      discard;
    } else {
      gl_FragColor = vec4( vColor, 1.0 );
    }
  }
`;
const PointCloudVS = `
  varying vec3 vColor;
  uniform sampler2D gradient;
  uniform sampler2D grayscale;
  attribute float intensity;
  attribute float classification;
  uniform vec3 rootCenter;
  uniform vec3 rootNormal;
  uniform vec2 elevationRange;
  uniform int coloring;
  uniform bool hideGround;
  uniform float maxIntensity;
  uniform float intensityContrast;

  #ifdef USE_COLOR
  vec3 getRGB() {
      vec3 rgb = color;
      return rgb;
  }
  #endif

  vec3 getElevation(){
    vec4 world = modelMatrix * vec4( position, 1.0 );
    float diff = abs(dot(rootNormal, (vec3(world) - rootCenter)));
    float w = max(diff - elevationRange.x,0.0) / max(elevationRange.y - elevationRange.x,1.0);
    vec3 cElevation = texture2D(gradient, vec2(w,1.0-w)).rgb;

    return cElevation;
  }

  vec3 getIntensity(){
    // TODO: real contrast enhancement. Check https://github.com/yuki-koyama/enhancer/blob/master/shaders/enhancer.fs
    float intmod = pow(intensity, intensityContrast);
    vec3 cIntensity = texture2D(grayscale, vec2(intmod / maxIntensity ,1.0-(intmod / maxIntensity))).rgb;
    return cIntensity;
  }

  vec3 getClassification(){
    float classNormalized = classification / 255.0;
    vec3 cClassification = texture2D(gradient, vec2(classNormalized * 5.0,1.0-classNormalized * 5.0)).rgb;
    return cClassification;
  }

  vec3 getColor(){
      vec3 color;
      if (hideGround && classification == 2.0) {
         return vec3(0.0, 0.0, 0.0);               
      }

      if (coloring == 1) {
        color = getIntensity();
      }
      else if (coloring == 2) {
        color = getClassification();
      } else if (coloring == 3) {
        color = getElevation();
      } 
      #ifdef USE_COLOR
      else if (coloring == 4) {
        color = getRGB();
      }
      #endif
      else {
        color = vec3(1.0, 1.0, 1.0);
      }
      return color;
  }

  void main() {
      vColor = getColor();

      gl_PointSize = 1.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

var PointCloudColoring;
(function (PointCloudColoring) {
    PointCloudColoring[PointCloudColoring["Intensity"] = 1] = "Intensity";
    PointCloudColoring[PointCloudColoring["Classification"] = 2] = "Classification";
    PointCloudColoring[PointCloudColoring["Elevation"] = 3] = "Elevation";
    PointCloudColoring[PointCloudColoring["RGB"] = 4] = "RGB";
    PointCloudColoring[PointCloudColoring["White"] = 5] = "White";
})(PointCloudColoring || (PointCloudColoring = {}));
var Shading;
(function (Shading) {
    Shading[Shading["FlatTexture"] = 1] = "FlatTexture";
    Shading[Shading["ShadedTexture"] = 2] = "ShadedTexture";
    Shading[Shading["ShadedNoTexture"] = 3] = "ShadedNoTexture";
})(Shading || (Shading = {}));

const gradient = Gradients.RAINBOW;
const gradientTexture = typeof document != 'undefined' ? generateGradientTexture(gradient) : null;
const grayscale = Gradients.GRAYSCALE;
const grayscaleTexture = typeof document != 'undefined' ? generateGradientTexture(grayscale) : null;
const defaultOptions = {
    initialTransform: new Matrix4$1(),
    throttleRequests: true,
    updateInterval: 0.1,
    maxConcurrency: 1,
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 32,
    viewDistanceScale: 1.0,
    skipLevelOfDetail: false,
    updateTransforms: false,
    shading: Shading.FlatTexture,
    pointCloudColoring: PointCloudColoring.White,
    worker: true,
    wireframe: false,
    debug: false,
    basisTranscoderPath: null,
    dracoDecoderPath: null,
    material: null,
    computeNormals: false,
    shaderCallback: null,
    loadersGlGltf: true
};
const Loader3DTiles = {
    load: (props) => __awaiter(void 0, void 0, void 0, function* () {
        const options = Object.assign(Object.assign({}, defaultOptions), props.options);
        const { url } = props;
        const UPDATE_INTERVAL = options.updateInterval;
        const loadersGLOptions = {};
        if (options.cesiumIONToken) {
            loadersGLOptions['cesium-ion'] = {
                accessToken: options.cesiumIONToken,
            };
            // @ts-ignore
            const metadata = yield CesiumIonLoader.preload(url, loadersGLOptions);
            loadersGLOptions['fetch'] = { headers: metadata.headers };
        }
        const tilesetJson = yield load(url, Tiles3DLoader, Object.assign({}, loadersGLOptions));
        const renderMap = {};
        const boxMap = {};
        const unloadQueue = [];
        const root = new Group();
        const tileBoxes = new Group();
        if (!options.debug) {
            tileBoxes.visible = false;
        }
        // transformations
        let threeMat = new Matrix4$1();
        // TODO: This handles the situation where not the root tile is transformed, but one child below the root. There should be a more generic way to handle this...
        const tileTrasnform = tilesetJson.root.transform
            ? new Matrix4$1().fromArray(tilesetJson.root.transform)
            : new Matrix4$1();
        if (tilesetJson.root.children.length == 1 && tilesetJson.root.children[0].transform) {
            const childTransform = new Matrix4$1().fromArray(tilesetJson.root.children[0].transform);
            tileTrasnform.multiply(childTransform);
        }
        // TODO: Originally the tileset is moved by loaders.gl to its WGS84 matching coordiate. In here, we negate that and bring it back to 0,0,0 with an optional initial transform. If we want to combine the tileset with other geographic layers we might need to go back to those original coordiates
        threeMat.copy(tileTrasnform).invert();
        const resetTransform = threeMat.clone();
        threeMat.premultiply(options.initialTransform);
        let modelMatrix = new Matrix4(threeMat.toArray());
        const pointcloudUniforms = {
            pointSize: { type: 'f', value: 1.0 },
            gradient: { type: 't', value: gradientTexture },
            grayscale: { type: 't', value: grayscaleTexture },
            rootCenter: { type: 'vec3', value: new Vector3$1() },
            rootNormal: { type: 'vec3', value: new Vector3$1() },
            coloring: { type: 'i', value: options.pointCloudColoring },
            hideGround: { type: 'b', value: true },
            elevationRange: { type: 'vec2', value: new Vector2$1(0, 400) },
            maxIntensity: { type: 'f', value: 1.0 },
            intensityContrast: { type: 'f', value: 1.0 },
        };
        let cameraReference = null;
        let rendererReference = null;
        const gltfLoader = options.loadersGlGltf ? new GLTFLoader() : new GLTFLoader$2();
        if (options.basisTranscoderPath) {
            const ktx2Loader = new KTX2Loader();
            ktx2Loader.detectSupport(props.renderer);
            ktx2Loader.setTranscoderPath(options.basisTranscoderPath + '/');
            // @ts-ignore
            gltfLoader.setKTX2Loader(ktx2Loader);
        }
        if (!options.loadersGlGltf && options.dracoDecoderPath) {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath(options.dracoDecoderPath + '/');
            dracoLoader.setWorkerLimit(options.maxConcurrency);
            gltfLoader.setDRACOLoader(dracoLoader);
        }
        const unlitMaterial = new ShaderMaterial({
            uniforms: {},
            vertexShader: MeshVS,
            fragmentShader: MeshFS,
        });
        const tileOptions = {
            modelMatrix: modelMatrix,
            maximumMemoryUsage: options.maximumMemoryUsage,
            maximumScreenSpaceError: options.maximumScreenSpaceError,
            viewDistanceScale: options.viewDistanceScale,
            skipLevelOfDetail: options.skipLevelOfDetail,
            updateTransforms: options.updateTransforms,
            throttleRequests: options.throttleRequests,
            contentLoader: (tile) => __awaiter(void 0, void 0, void 0, function* () {
                let tileContent = null;
                switch (tile.type) {
                    case TILE_TYPE.POINTCLOUD: {
                        tileContent = createPointNodes(tile, pointcloudUniforms);
                        break;
                    }
                    case TILE_TYPE.SCENEGRAPH:
                    case TILE_TYPE.MESH: {
                        tileContent = yield createGLTFNodes(gltfLoader, tile, unlitMaterial, options);
                        break;
                    }
                }
                if (tileContent) {
                    tileContent.visible = false;
                    renderMap[tile.id] = tileContent;
                    root.add(renderMap[tile.id]);
                    if (options.debug) {
                        const box = loadersBoundingBoxToMesh(tile);
                        tileBoxes.add(box);
                        boxMap[tile.id] = box;
                    }
                }
            }),
            onTileLoad: () => __awaiter(void 0, void 0, void 0, function* () {
                if (tileset) {
                    tileset._frameNumber++;
                    tilesetUpdate(tileset, renderMap, rendererReference, cameraReference);
                }
            }),
            onTileUnload: (tile) => {
                unloadQueue.push(tile);
            },
            onTileError: (tile, message) => {
                console.error('Tile error', tile.id, message);
            },
        };
        const tileset = new Tileset3D(tilesetJson, Object.assign(Object.assign({}, tileOptions), { loadOptions: Object.assign(Object.assign({}, loadersGLOptions), { maxConcurrency: options.maxConcurrency, worker: options.worker, 
                // @ts-ignore: https://github.com/visgl/loaders.gl/issues/1575
                gltf: {
                    loadImages: false,
                }, '3d-tiles': {
                    loadGLTF: options.loadersGlGltf,
                } }) }));
        let disposeFlag = false;
        const rootCenter = new Vector3$1().setFromMatrixPosition(options.initialTransform);
        pointcloudUniforms.rootCenter.value.copy(rootCenter);
        pointcloudUniforms.rootNormal.value.copy(new Vector3$1(0, 0, 1).applyMatrix4(options.initialTransform).normalize());
        root.applyMatrix4(options.initialTransform);
        // Extra stats
        tileset.stats.get('Loader concurrency').count =
            options.maxConcurrency +
                ' / ' +
                (typeof navigator != 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : '??');
        tileset.stats.get('Maximum SSE').count = options.maximumScreenSpaceError;
        tileset.stats.get('Maximum mem usage').count = options.maximumMemoryUsage;
        let timer = 0;
        const lastCameraTransform = new Matrix4$1().makeTranslation(Infinity, Infinity, Infinity);
        let lastCameraAspect = null;
        const lastCameraPosition = new Vector3$1(Infinity, Infinity, Infinity);
        let sseDenominator = null;
        function tilesetUpdate(tileset, renderMap, renderer, camera) {
            if (disposeFlag) {
                return;
            }
            // Assumes camera fov, near and far are not changing
            if (!sseDenominator || camera.aspect != lastCameraAspect) {
                const loadersFrustum = new PerspectiveFrustum({
                    fov: (camera.fov / 180) * Math.PI,
                    aspectRatio: camera.aspect,
                    near: camera.near,
                    far: camera.far,
                });
                sseDenominator = loadersFrustum.sseDenominator;
                lastCameraAspect = camera.aspect;
                if (options.debug) {
                    console.log('Updated sse denonimator:', sseDenominator);
                }
            }
            const frustum = getCameraFrustum(camera);
            const planes = frustum.planes.map((plane) => new Plane(plane.normal.toArray(), plane.constant));
            const cullingVolume = new CullingVolume(planes);
            const rendererSize = new Vector2$1();
            renderer.getSize(rendererSize);
            const frameState = {
                camera: {
                    position: lastCameraPosition.toArray(),
                },
                height: rendererSize.y,
                frameNumber: tileset._frameNumber,
                sseDenominator: sseDenominator,
                cullingVolume: cullingVolume,
                viewport: {
                    id: 0,
                },
            };
            tileset._cache.reset();
            tileset._traverser.traverse(tileset.root, frameState, tileset.options);
            for (const tile of tileset.tiles) {
                if (tile.selected) {
                    if (!renderMap[tile.id]) {
                        console.error('TILE SELECTED BUT NOT LOADED!!', tile.id);
                    }
                    else {
                        // Make sure it's visible
                        renderMap[tile.id].visible = true;
                    }
                }
                else {
                    if (renderMap[tile.id]) {
                        renderMap[tile.id].visible = false;
                    }
                }
            }
            while (unloadQueue.length > 0) {
                const tile = unloadQueue.pop();
                if (renderMap[tile.id] && tile.contentState == TILE_CONTENT_STATE.UNLOADED) {
                    root.remove(renderMap[tile.id]);
                    disposeNode(renderMap[tile.id]);
                    delete renderMap[tile.id];
                }
                if (boxMap[tile.id]) {
                    disposeNode(boxMap[tile.id]);
                    tileBoxes.remove(boxMap[tile.id]);
                    delete boxMap[tile.id];
                }
            }
            if (props.onProgress) {
                props.onProgress(tileset.stats.get('Tiles Loaded').count, tileset.stats.get('Tiles Loaded').count + tileset.stats.get('Tiles Loading').count);
            }
            return frameState;
        }
        return {
            model: root,
            runtime: {
                getTileset: () => {
                    return tileset;
                },
                getStats: () => {
                    return tileset.stats;
                },
                showTiles: (visible) => {
                    tileBoxes.visible = visible;
                },
                setWireframe: (wireframe) => {
                    options.wireframe = wireframe;
                    root.traverse((object) => {
                        if (object instanceof Mesh) {
                            object.material.wireframe = wireframe;
                        }
                    });
                },
                setDebug: (debug) => {
                    options.debug = debug;
                    tileBoxes.visible = debug;
                },
                setShading: (shading) => {
                    options.shading = shading;
                },
                getTileBoxes: () => {
                    return tileBoxes;
                },
                setViewDistanceScale: (scale) => {
                    tileset.options.viewDistanceScale = scale;
                    tileset._frameNumber++;
                    tilesetUpdate(tileset, renderMap, rendererReference, cameraReference);
                },
                setHideGround: (enabled) => {
                    pointcloudUniforms.hideGround.value = enabled;
                },
                setPointCloudColoring: (selection) => {
                    pointcloudUniforms.coloring.value = selection;
                },
                setElevationRange: (range) => {
                    pointcloudUniforms.elevationRange.value.set(range[0], range[1]);
                },
                setMaxIntensity: (intensity) => {
                    pointcloudUniforms.maxIntensity.value = intensity;
                },
                setIntensityContrast: (contrast) => {
                    pointcloudUniforms.intensityContrast.value = contrast;
                },
                getLatLongHeightFromPosition: (position) => {
                    const cartographicPosition = tileset.ellipsoid.cartesianToCartographic(new Vector3$1().copy(position).applyMatrix4(new Matrix4$1().copy(threeMat).invert()).toArray());
                    return {
                        lat: cartographicPosition[1],
                        long: cartographicPosition[0],
                        height: cartographicPosition[2],
                    };
                },
                getPositionFromLatLongHeight: (coord) => {
                    const cartesianPosition = tileset.ellipsoid.cartographicToCartesian([coord.long, coord.lat, coord.height]);
                    return new Vector3$1(...cartesianPosition).applyMatrix4(threeMat);
                },
                getCameraFrustum: (camera) => {
                    const frustum = getCameraFrustum(camera);
                    const meshes = frustum.planes
                        .map((plane) => new Plane(plane.normal.toArray(), plane.constant))
                        .map((loadersPlane) => loadersPlaneToMesh(loadersPlane));
                    const model = new Group();
                    for (const mesh of meshes)
                        model.add(mesh);
                    return model;
                },
                getTransform: () => {
                    return options.initialTransform;
                },
                setTransform: (transform) => {
                    options.initialTransform = transform;
                    threeMat = resetTransform.clone();
                    threeMat.premultiply(options.initialTransform);
                    modelMatrix = new Matrix4(threeMat.toArray());
                    tileset.modelMatrix = modelMatrix;
                    root.matrix.copy(options.initialTransform);
                    root.matrix.decompose(root.position, root.quaternion, root.scale);
                },
                update: function (dt, renderer, camera) {
                    const cameraChanged = !camera.matrixWorld.equals(lastCameraTransform) ||
                        !(camera.aspect == lastCameraAspect);
                    cameraReference = camera;
                    rendererReference = renderer;
                    timer += dt;
                    if (tileset && timer >= UPDATE_INTERVAL && cameraChanged) {
                        timer = 0;
                        tileset._frameNumber++;
                        camera.getWorldPosition(lastCameraPosition);
                        lastCameraTransform.copy(camera.matrixWorld);
                        tilesetUpdate(tileset, renderMap, renderer, camera);
                    }
                },
                dispose: function () {
                    disposeFlag = true;
                    tileset._destroy();
                    while (root.children.length > 0) {
                        const obj = root.children[0];
                        disposeNode(obj);
                        root.remove(obj);
                    }
                    while (tileBoxes.children.length > 0) {
                        const obj = tileBoxes.children[0];
                        tileBoxes.remove(obj);
                        obj.geometry.dispose();
                        obj.material.dispose();
                    }
                },
            },
        };
    }),
};
function createGLTFNodes(gltfLoader, tile, unlitMaterial, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const rotateX = new Matrix4$1().makeRotationAxis(new Vector3$1(1, 0, 0), Math.PI / 2);
            gltfLoader.parse(options.loadersGlGltf ? tile.content.gltf : tile.content.gltfArrayBuffer, '', (gltf) => {
                const tileContent = gltf.scenes[0].children[0];
                tileContent.applyMatrix4(rotateX); // convert from GLTF Y-up to Z-up
                tileContent.traverse((object) => {
                    if (object instanceof Mesh) {
                        const originalMap = object.material.map;
                        if (options.material) {
                            object.material = options.material.clone();
                        }
                        else if (options.shading == Shading.FlatTexture) {
                            object.material = unlitMaterial.clone();
                        }
                        if (options.shading != Shading.ShadedNoTexture) {
                            if (object.material.uniforms) {
                                object.material.uniforms.map = { value: originalMap };
                            }
                            else {
                                object.material.map = originalMap;
                            }
                        }
                        else {
                            object.material.map = null;
                        }
                        if (options.shaderCallback) {
                            object.onBeforeRender = options.shaderCallback;
                        }
                        object.material.wireframe = options.wireframe;
                        if (options.computeNormals) {
                            object.geometry.computeVertexNormals();
                        }
                    }
                });
                resolve(tileContent);
            }, (e) => {
                reject(new Error(`error parsing gltf in tile ${tile.id}: ${e}`));
            });
        });
    });
}
function createPointNodes(tile, pointcloudUniforms) {
    const d = {
        rtc_center: tile.content.rtcCenter,
        points: tile.content.attributes.positions,
        intensities: tile.content.attributes.intensity,
        classifications: tile.content.attributes.classification,
        rgb: null,
        rgba: null,
    };
    const { colors } = tile.content.attributes;
    if (colors && colors.size === 3) {
        d.rgb = colors.value;
    }
    if (colors && colors.size === 4) {
        d.rgba = colors.value;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(d.points, 3));
    const pointcloudMaterial = new ShaderMaterial({
        uniforms: pointcloudUniforms,
        vertexShader: PointCloudVS,
        fragmentShader: PointCloudFS,
        transparent: true,
    });
    if (d.rgba) {
        geometry.setAttribute('color', new Float32BufferAttribute(d.rgba, 4));
        pointcloudMaterial.vertexColors = true;
    }
    else if (d.rgb) {
        geometry.setAttribute('color', new Uint8BufferAttribute(d.rgb, 3, true));
        pointcloudMaterial.vertexColors = true;
    }
    if (d.intensities) {
        geometry.setAttribute('intensity', new Uint8BufferAttribute(d.intensities, 1, true));
    }
    if (d.classifications) {
        geometry.setAttribute('classification', new Uint8BufferAttribute(d.classifications, 1, false));
    }
    const tileContent = new Points(geometry, pointcloudMaterial);
    if (d.rtc_center) {
        const c = d.rtc_center;
        tileContent.applyMatrix4(new Matrix4$1().makeTranslation(c[0], c[1], c[2]));
    }
    return tileContent;
}
function disposeNode(node) {
    node.traverse((object) => {
        if (object.isMesh) {
            object.geometry.dispose();
            if (object.material.isMaterial) {
                object.material.dispose();
            }
            else {
                // an array of materials
                for (const material of object.material)
                    material.dispose();
            }
        }
    });
    for (let i = node.children.length - 1; i >= 0; i--) {
        const obj = node.children[i];
        node.remove(obj);
    }
}

export { Loader3DTiles, PointCloudColoring, Shading };
//# sourceMappingURL=threebird-loader-3d-tiles.esm.js.map
