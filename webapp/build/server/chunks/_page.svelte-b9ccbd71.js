import { c as create_ssr_component, v as validate_component, a as subscribe, d as each, e as escape, f as get_store_value, b as add_attribute, o as onDestroy, m as missing_component, n as null_to_empty, h as set_store_value } from './ssr-cfa1d793.js';
import require$$0$2 from 'stream';
import require$$0 from 'zlib';
import require$$0$1 from 'buffer';
import require$$1 from 'crypto';
import require$$0$3 from 'events';
import require$$1$1 from 'https';
import require$$2 from 'http';
import require$$3 from 'net';
import require$$4 from 'tls';
import require$$7 from 'url';
import { w as writable } from './index-61e47382.js';
import { g as getCookies, a as goto } from './cookies-e2afa694.js';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createEmitter(){
	let listeners = {};

	function add(type, entry){
		if(!listeners[type])
				listeners[type] = [];

		listeners[type].push(entry);
	}

	return {
		listeners,

		on(type, callback){
			add(type, { callback });
			return this
		},
	
		once(type, callback){
			add(type, { callback, once: true });
			return this
		},
	
		off(type, callback){
			if(!type){
				for(let key of Object.keys(listeners)){
					delete listeners[key];
				}
				return
			}

			if(!listeners[type])
				return

			if(callback){
				listeners[type] = listeners[type].filter(
					listener => callback !== listener.callback
				);
	
				if(listeners[type].length === 0)
					delete listeners[type];
			}else {
				delete listeners[type];
			}

			return this
		},
	
		emit(type, data){
			if(!listeners[type])
				return

			let matchedListeners = listeners[type].slice();
	
			listeners[type] = listeners[type].filter(
				listener => !listener.once
			);
	
			for(let { callback } of matchedListeners){
				callback(data);
			}

			return this
		}
	}
}

function createSocket$1 ({ url, autoReconnect = true, autoRetryRequests = false, socketOptions, impl }){
	let socket;
	let requestCounter = 0;
	let requestRegistry = [];
	let responseBacklog = [];
	let frozen = false;
	let connected = false;
	let connectionError;
	let events = new createEmitter();

	function connect(){
		socket = impl.WebSocket({ url, options: socketOptions });
		socket.addEventListener('open', handleOpen);
		socket.addEventListener('close', handleClose);
		socket.addEventListener('error', handleError);
		socket.addEventListener('message', handleMessage);
	}

	function handleOpen(event){
		connected = true;
		events.emit('connect', event);
		pushRequests();
	}

	function handleClose(event){
		if(autoReconnect){
			setTimeout(connect, 1000);
		}

		if(!connected){
			return
		}

		if(autoRetryRequests){
			for(let request of requestRegistry){
				request.sent = false;
			}
		}else {
			for(let { reject } of requestRegistry){
				reject(new Error(event.reason));
			}
			requestRegistry.length = 0;
		}
		
		connected = false;
		events.emit('disconnect', event);
	}

	function handleError(event){
		connectionError = event;
		events.emit('error', event);
	}

	function handleMessage(evt){
		if(frozen){
			responseBacklog.push(evt);
			return
		}

		let { event, ...payload } = JSON.parse(evt.data);

		if(payload.id){
			let handlerIndex = requestRegistry.findIndex(({id}) => id === payload.id);

			if(handlerIndex >= 0){
				let request = requestRegistry[handlerIndex];

				request.emit(event, payload);

				let isResolved = typeof request.expectEvent === 'function'
					? request.expectEvent({ event, ...payload })
					: event === request.expectEvent;

				if(isResolved){
					request.resolve(payload);
				}else if(event === 'error'){
					if(!request.events.error)
						request.reject(payload);
				}else {
					return
				}

				requestRegistry.splice(handlerIndex, 1);
			}
		}else if(requestRegistry.length > 0 && event === 'error'){
			let lastRequest = requestRegistry.pop();

			if(lastRequest.listeners.error)
				lastRequest.emit(event, payload);
			else
				lastRequest.reject(payload);
		}else {
			events.emit(event, payload);
		}
	}

	function pushRequests(){
		if(!connected || frozen)
			return

		for(let request of requestRegistry.slice()){
			if(request.sent)
				continue

			socket.send(JSON.stringify(request.payload));

			if(request.id)
				request.sent = true;
			else
				requestRegistry.splice(requestRegistry.indexOf(request), 1);
		}
	}

	connect();

	return Object.assign(
		events,
		{
			status(){
				return {
					connected,
					connectionError,
					openRequests: requestRegistry.map(
						request => ({
							id: request.id,
							sent: request.sent
						})
					)
				}
			},
			request({ expectEvent, ...payload }){
				let events = createEmitter();
				let id = `r${++requestCounter}`;
				let request = {
					payload: {
						...payload,
						id
					},
					...events,
					expectEvent,
					id
				};

				return Object.assign(
					new Promise((resolve, reject) => {
						Object.assign(request, {
							resolve,
							reject
						});

						requestRegistry.push(request);
						pushRequests();
					}),
					request
				)
			},
			send(payload){
				requestRegistry.push({ payload });
				pushRequests();
			},
			freeze(){
				frozen = true;
			},
			unfreeze(){
				frozen = false;

				while(responseBacklog.length > 0){
					handleMessage(responseBacklog.shift());
				}

				pushRequests();
			}
		}
	)
}

var bufferUtil = {exports: {}};

var constants;
var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;

	constants = {
	  BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
	  EMPTY_BUFFER: Buffer.alloc(0),
	  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
	  kForOnEventAttribute: Symbol('kIsForOnEventAttribute'),
	  kListener: Symbol('kListener'),
	  kStatusCode: Symbol('status-code'),
	  kWebSocket: Symbol('websocket'),
	  NOOP: () => {}
	};
	return constants;
}

var hasRequiredBufferUtil;

function requireBufferUtil () {
	if (hasRequiredBufferUtil) return bufferUtil.exports;
	hasRequiredBufferUtil = 1;

	const { EMPTY_BUFFER } = requireConstants();

	const FastBuffer = Buffer[Symbol.species];

	/**
	 * Merges an array of buffers into a new buffer.
	 *
	 * @param {Buffer[]} list The array of buffers to concat
	 * @param {Number} totalLength The total length of buffers in the list
	 * @return {Buffer} The resulting buffer
	 * @public
	 */
	function concat(list, totalLength) {
	  if (list.length === 0) return EMPTY_BUFFER;
	  if (list.length === 1) return list[0];

	  const target = Buffer.allocUnsafe(totalLength);
	  let offset = 0;

	  for (let i = 0; i < list.length; i++) {
	    const buf = list[i];
	    target.set(buf, offset);
	    offset += buf.length;
	  }

	  if (offset < totalLength) {
	    return new FastBuffer(target.buffer, target.byteOffset, offset);
	  }

	  return target;
	}

	/**
	 * Masks a buffer using the given mask.
	 *
	 * @param {Buffer} source The buffer to mask
	 * @param {Buffer} mask The mask to use
	 * @param {Buffer} output The buffer where to store the result
	 * @param {Number} offset The offset at which to start writing
	 * @param {Number} length The number of bytes to mask.
	 * @public
	 */
	function _mask(source, mask, output, offset, length) {
	  for (let i = 0; i < length; i++) {
	    output[offset + i] = source[i] ^ mask[i & 3];
	  }
	}

	/**
	 * Unmasks a buffer using the given mask.
	 *
	 * @param {Buffer} buffer The buffer to unmask
	 * @param {Buffer} mask The mask to use
	 * @public
	 */
	function _unmask(buffer, mask) {
	  for (let i = 0; i < buffer.length; i++) {
	    buffer[i] ^= mask[i & 3];
	  }
	}

	/**
	 * Converts a buffer to an `ArrayBuffer`.
	 *
	 * @param {Buffer} buf The buffer to convert
	 * @return {ArrayBuffer} Converted buffer
	 * @public
	 */
	function toArrayBuffer(buf) {
	  if (buf.length === buf.buffer.byteLength) {
	    return buf.buffer;
	  }

	  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
	}

	/**
	 * Converts `data` to a `Buffer`.
	 *
	 * @param {*} data The data to convert
	 * @return {Buffer} The buffer
	 * @throws {TypeError}
	 * @public
	 */
	function toBuffer(data) {
	  toBuffer.readOnly = true;

	  if (Buffer.isBuffer(data)) return data;

	  let buf;

	  if (data instanceof ArrayBuffer) {
	    buf = new FastBuffer(data);
	  } else if (ArrayBuffer.isView(data)) {
	    buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
	  } else {
	    buf = Buffer.from(data);
	    toBuffer.readOnly = false;
	  }

	  return buf;
	}

	bufferUtil.exports = {
	  concat,
	  mask: _mask,
	  toArrayBuffer,
	  toBuffer,
	  unmask: _unmask
	};

	/* istanbul ignore else  */
	if (!process.env.WS_NO_BUFFER_UTIL) {
	  try {
	    const bufferUtil$1 = require('bufferutil');

	    bufferUtil.exports.mask = function (source, mask, output, offset, length) {
	      if (length < 48) _mask(source, mask, output, offset, length);
	      else bufferUtil$1.mask(source, mask, output, offset, length);
	    };

	    bufferUtil.exports.unmask = function (buffer, mask) {
	      if (buffer.length < 32) _unmask(buffer, mask);
	      else bufferUtil$1.unmask(buffer, mask);
	    };
	  } catch (e) {
	    // Continue regardless of the error.
	  }
	}
	return bufferUtil.exports;
}

var limiter;
var hasRequiredLimiter;

function requireLimiter () {
	if (hasRequiredLimiter) return limiter;
	hasRequiredLimiter = 1;

	const kDone = Symbol('kDone');
	const kRun = Symbol('kRun');

	/**
	 * A very simple job queue with adjustable concurrency. Adapted from
	 * https://github.com/STRML/async-limiter
	 */
	class Limiter {
	  /**
	   * Creates a new `Limiter`.
	   *
	   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
	   *     to run concurrently
	   */
	  constructor(concurrency) {
	    this[kDone] = () => {
	      this.pending--;
	      this[kRun]();
	    };
	    this.concurrency = concurrency || Infinity;
	    this.jobs = [];
	    this.pending = 0;
	  }

	  /**
	   * Adds a job to the queue.
	   *
	   * @param {Function} job The job to run
	   * @public
	   */
	  add(job) {
	    this.jobs.push(job);
	    this[kRun]();
	  }

	  /**
	   * Removes a job from the queue and runs it if possible.
	   *
	   * @private
	   */
	  [kRun]() {
	    if (this.pending === this.concurrency) return;

	    if (this.jobs.length) {
	      const job = this.jobs.shift();

	      this.pending++;
	      job(this[kDone]);
	    }
	  }
	}

	limiter = Limiter;
	return limiter;
}

var permessageDeflate;
var hasRequiredPermessageDeflate;

function requirePermessageDeflate () {
	if (hasRequiredPermessageDeflate) return permessageDeflate;
	hasRequiredPermessageDeflate = 1;

	const zlib = require$$0;

	const bufferUtil = requireBufferUtil();
	const Limiter = requireLimiter();
	const { kStatusCode } = requireConstants();

	const FastBuffer = Buffer[Symbol.species];
	const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
	const kPerMessageDeflate = Symbol('permessage-deflate');
	const kTotalLength = Symbol('total-length');
	const kCallback = Symbol('callback');
	const kBuffers = Symbol('buffers');
	const kError = Symbol('error');

	//
	// We limit zlib concurrency, which prevents severe memory fragmentation
	// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
	// and https://github.com/websockets/ws/issues/1202
	//
	// Intentionally global; it's the global thread pool that's an issue.
	//
	let zlibLimiter;

	/**
	 * permessage-deflate implementation.
	 */
	class PerMessageDeflate {
	  /**
	   * Creates a PerMessageDeflate instance.
	   *
	   * @param {Object} [options] Configuration options
	   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
	   *     for, or request, a custom client window size
	   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
	   *     acknowledge disabling of client context takeover
	   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
	   *     calls to zlib
	   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
	   *     use of a custom server window size
	   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
	   *     disabling of server context takeover
	   * @param {Number} [options.threshold=1024] Size (in bytes) below which
	   *     messages should not be compressed if context takeover is disabled
	   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
	   *     deflate
	   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
	   *     inflate
	   * @param {Boolean} [isServer=false] Create the instance in either server or
	   *     client mode
	   * @param {Number} [maxPayload=0] The maximum allowed message length
	   */
	  constructor(options, isServer, maxPayload) {
	    this._maxPayload = maxPayload | 0;
	    this._options = options || {};
	    this._threshold =
	      this._options.threshold !== undefined ? this._options.threshold : 1024;
	    this._isServer = !!isServer;
	    this._deflate = null;
	    this._inflate = null;

	    this.params = null;

	    if (!zlibLimiter) {
	      const concurrency =
	        this._options.concurrencyLimit !== undefined
	          ? this._options.concurrencyLimit
	          : 10;
	      zlibLimiter = new Limiter(concurrency);
	    }
	  }

	  /**
	   * @type {String}
	   */
	  static get extensionName() {
	    return 'permessage-deflate';
	  }

	  /**
	   * Create an extension negotiation offer.
	   *
	   * @return {Object} Extension parameters
	   * @public
	   */
	  offer() {
	    const params = {};

	    if (this._options.serverNoContextTakeover) {
	      params.server_no_context_takeover = true;
	    }
	    if (this._options.clientNoContextTakeover) {
	      params.client_no_context_takeover = true;
	    }
	    if (this._options.serverMaxWindowBits) {
	      params.server_max_window_bits = this._options.serverMaxWindowBits;
	    }
	    if (this._options.clientMaxWindowBits) {
	      params.client_max_window_bits = this._options.clientMaxWindowBits;
	    } else if (this._options.clientMaxWindowBits == null) {
	      params.client_max_window_bits = true;
	    }

	    return params;
	  }

	  /**
	   * Accept an extension negotiation offer/response.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Object} Accepted configuration
	   * @public
	   */
	  accept(configurations) {
	    configurations = this.normalizeParams(configurations);

	    this.params = this._isServer
	      ? this.acceptAsServer(configurations)
	      : this.acceptAsClient(configurations);

	    return this.params;
	  }

	  /**
	   * Releases all resources used by the extension.
	   *
	   * @public
	   */
	  cleanup() {
	    if (this._inflate) {
	      this._inflate.close();
	      this._inflate = null;
	    }

	    if (this._deflate) {
	      const callback = this._deflate[kCallback];

	      this._deflate.close();
	      this._deflate = null;

	      if (callback) {
	        callback(
	          new Error(
	            'The deflate stream was closed while data was being processed'
	          )
	        );
	      }
	    }
	  }

	  /**
	   *  Accept an extension negotiation offer.
	   *
	   * @param {Array} offers The extension negotiation offers
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsServer(offers) {
	    const opts = this._options;
	    const accepted = offers.find((params) => {
	      if (
	        (opts.serverNoContextTakeover === false &&
	          params.server_no_context_takeover) ||
	        (params.server_max_window_bits &&
	          (opts.serverMaxWindowBits === false ||
	            (typeof opts.serverMaxWindowBits === 'number' &&
	              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
	        (typeof opts.clientMaxWindowBits === 'number' &&
	          !params.client_max_window_bits)
	      ) {
	        return false;
	      }

	      return true;
	    });

	    if (!accepted) {
	      throw new Error('None of the extension offers can be accepted');
	    }

	    if (opts.serverNoContextTakeover) {
	      accepted.server_no_context_takeover = true;
	    }
	    if (opts.clientNoContextTakeover) {
	      accepted.client_no_context_takeover = true;
	    }
	    if (typeof opts.serverMaxWindowBits === 'number') {
	      accepted.server_max_window_bits = opts.serverMaxWindowBits;
	    }
	    if (typeof opts.clientMaxWindowBits === 'number') {
	      accepted.client_max_window_bits = opts.clientMaxWindowBits;
	    } else if (
	      accepted.client_max_window_bits === true ||
	      opts.clientMaxWindowBits === false
	    ) {
	      delete accepted.client_max_window_bits;
	    }

	    return accepted;
	  }

	  /**
	   * Accept the extension negotiation response.
	   *
	   * @param {Array} response The extension negotiation response
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsClient(response) {
	    const params = response[0];

	    if (
	      this._options.clientNoContextTakeover === false &&
	      params.client_no_context_takeover
	    ) {
	      throw new Error('Unexpected parameter "client_no_context_takeover"');
	    }

	    if (!params.client_max_window_bits) {
	      if (typeof this._options.clientMaxWindowBits === 'number') {
	        params.client_max_window_bits = this._options.clientMaxWindowBits;
	      }
	    } else if (
	      this._options.clientMaxWindowBits === false ||
	      (typeof this._options.clientMaxWindowBits === 'number' &&
	        params.client_max_window_bits > this._options.clientMaxWindowBits)
	    ) {
	      throw new Error(
	        'Unexpected or invalid parameter "client_max_window_bits"'
	      );
	    }

	    return params;
	  }

	  /**
	   * Normalize parameters.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Array} The offers/response with normalized parameters
	   * @private
	   */
	  normalizeParams(configurations) {
	    configurations.forEach((params) => {
	      Object.keys(params).forEach((key) => {
	        let value = params[key];

	        if (value.length > 1) {
	          throw new Error(`Parameter "${key}" must have only a single value`);
	        }

	        value = value[0];

	        if (key === 'client_max_window_bits') {
	          if (value !== true) {
	            const num = +value;
	            if (!Number.isInteger(num) || num < 8 || num > 15) {
	              throw new TypeError(
	                `Invalid value for parameter "${key}": ${value}`
	              );
	            }
	            value = num;
	          } else if (!this._isServer) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else if (key === 'server_max_window_bits') {
	          const num = +value;
	          if (!Number.isInteger(num) || num < 8 || num > 15) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	          value = num;
	        } else if (
	          key === 'client_no_context_takeover' ||
	          key === 'server_no_context_takeover'
	        ) {
	          if (value !== true) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else {
	          throw new Error(`Unknown parameter "${key}"`);
	        }

	        params[key] = value;
	      });
	    });

	    return configurations;
	  }

	  /**
	   * Decompress data. Concurrency limited.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  decompress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._decompress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Compress data. Concurrency limited.
	   *
	   * @param {(Buffer|String)} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  compress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._compress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Decompress data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _decompress(data, fin, callback) {
	    const endpoint = this._isServer ? 'client' : 'server';

	    if (!this._inflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._inflate = zlib.createInflateRaw({
	        ...this._options.zlibInflateOptions,
	        windowBits
	      });
	      this._inflate[kPerMessageDeflate] = this;
	      this._inflate[kTotalLength] = 0;
	      this._inflate[kBuffers] = [];
	      this._inflate.on('error', inflateOnError);
	      this._inflate.on('data', inflateOnData);
	    }

	    this._inflate[kCallback] = callback;

	    this._inflate.write(data);
	    if (fin) this._inflate.write(TRAILER);

	    this._inflate.flush(() => {
	      const err = this._inflate[kError];

	      if (err) {
	        this._inflate.close();
	        this._inflate = null;
	        callback(err);
	        return;
	      }

	      const data = bufferUtil.concat(
	        this._inflate[kBuffers],
	        this._inflate[kTotalLength]
	      );

	      if (this._inflate._readableState.endEmitted) {
	        this._inflate.close();
	        this._inflate = null;
	      } else {
	        this._inflate[kTotalLength] = 0;
	        this._inflate[kBuffers] = [];

	        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	          this._inflate.reset();
	        }
	      }

	      callback(null, data);
	    });
	  }

	  /**
	   * Compress data.
	   *
	   * @param {(Buffer|String)} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _compress(data, fin, callback) {
	    const endpoint = this._isServer ? 'server' : 'client';

	    if (!this._deflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._deflate = zlib.createDeflateRaw({
	        ...this._options.zlibDeflateOptions,
	        windowBits
	      });

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      this._deflate.on('data', deflateOnData);
	    }

	    this._deflate[kCallback] = callback;

	    this._deflate.write(data);
	    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
	      if (!this._deflate) {
	        //
	        // The deflate stream was closed while data was being processed.
	        //
	        return;
	      }

	      let data = bufferUtil.concat(
	        this._deflate[kBuffers],
	        this._deflate[kTotalLength]
	      );

	      if (fin) {
	        data = new FastBuffer(data.buffer, data.byteOffset, data.length - 4);
	      }

	      //
	      // Ensure that the callback will not be called again in
	      // `PerMessageDeflate#cleanup()`.
	      //
	      this._deflate[kCallback] = null;

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	        this._deflate.reset();
	      }

	      callback(null, data);
	    });
	  }
	}

	permessageDeflate = PerMessageDeflate;

	/**
	 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function deflateOnData(chunk) {
	  this[kBuffers].push(chunk);
	  this[kTotalLength] += chunk.length;
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function inflateOnData(chunk) {
	  this[kTotalLength] += chunk.length;

	  if (
	    this[kPerMessageDeflate]._maxPayload < 1 ||
	    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
	  ) {
	    this[kBuffers].push(chunk);
	    return;
	  }

	  this[kError] = new RangeError('Max payload size exceeded');
	  this[kError].code = 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH';
	  this[kError][kStatusCode] = 1009;
	  this.removeListener('data', inflateOnData);
	  this.reset();
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'error'` event.
	 *
	 * @param {Error} err The emitted error
	 * @private
	 */
	function inflateOnError(err) {
	  //
	  // There is no need to call `Zlib#close()` as the handle is automatically
	  // closed when an error is emitted.
	  //
	  this[kPerMessageDeflate]._inflate = null;
	  err[kStatusCode] = 1007;
	  this[kCallback](err);
	}
	return permessageDeflate;
}

var validation = {exports: {}};

var hasRequiredValidation;

function requireValidation () {
	if (hasRequiredValidation) return validation.exports;
	hasRequiredValidation = 1;

	const { isUtf8 } = require$$0$1;

	//
	// Allowed token characters:
	//
	// '!', '#', '$', '%', '&', ''', '*', '+', '-',
	// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
	//
	// tokenChars[32] === 0 // ' '
	// tokenChars[33] === 1 // '!'
	// tokenChars[34] === 0 // '"'
	// ...
	//
	// prettier-ignore
	const tokenChars = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
	  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
	];

	/**
	 * Checks if a status code is allowed in a close frame.
	 *
	 * @param {Number} code The status code
	 * @return {Boolean} `true` if the status code is valid, else `false`
	 * @public
	 */
	function isValidStatusCode(code) {
	  return (
	    (code >= 1000 &&
	      code <= 1014 &&
	      code !== 1004 &&
	      code !== 1005 &&
	      code !== 1006) ||
	    (code >= 3000 && code <= 4999)
	  );
	}

	/**
	 * Checks if a given buffer contains only correct UTF-8.
	 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	 * Markus Kuhn.
	 *
	 * @param {Buffer} buf The buffer to check
	 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	 * @public
	 */
	function _isValidUTF8(buf) {
	  const len = buf.length;
	  let i = 0;

	  while (i < len) {
	    if ((buf[i] & 0x80) === 0) {
	      // 0xxxxxxx
	      i++;
	    } else if ((buf[i] & 0xe0) === 0xc0) {
	      // 110xxxxx 10xxxxxx
	      if (
	        i + 1 === len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i] & 0xfe) === 0xc0 // Overlong
	      ) {
	        return false;
	      }

	      i += 2;
	    } else if ((buf[i] & 0xf0) === 0xe0) {
	      // 1110xxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 2 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
	        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
	      ) {
	        return false;
	      }

	      i += 3;
	    } else if ((buf[i] & 0xf8) === 0xf0) {
	      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 3 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i + 3] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
	        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
	        buf[i] > 0xf4 // > U+10FFFF
	      ) {
	        return false;
	      }

	      i += 4;
	    } else {
	      return false;
	    }
	  }

	  return true;
	}

	validation.exports = {
	  isValidStatusCode,
	  isValidUTF8: _isValidUTF8,
	  tokenChars
	};

	if (isUtf8) {
	  validation.exports.isValidUTF8 = function (buf) {
	    return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
	  };
	} /* istanbul ignore else  */ else if (!process.env.WS_NO_UTF_8_VALIDATE) {
	  try {
	    const isValidUTF8 = require('utf-8-validate');

	    validation.exports.isValidUTF8 = function (buf) {
	      return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
	    };
	  } catch (e) {
	    // Continue regardless of the error.
	  }
	}
	return validation.exports;
}

var receiver;
var hasRequiredReceiver;

function requireReceiver () {
	if (hasRequiredReceiver) return receiver;
	hasRequiredReceiver = 1;

	const { Writable } = require$$0$2;

	const PerMessageDeflate = requirePermessageDeflate();
	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  kStatusCode,
	  kWebSocket
	} = requireConstants();
	const { concat, toArrayBuffer, unmask } = requireBufferUtil();
	const { isValidStatusCode, isValidUTF8 } = requireValidation();

	const FastBuffer = Buffer[Symbol.species];
	const promise = Promise.resolve();

	//
	// `queueMicrotask()` is not available in Node.js < 11.
	//
	const queueTask =
	  typeof queueMicrotask === 'function' ? queueMicrotask : queueMicrotaskShim;

	const GET_INFO = 0;
	const GET_PAYLOAD_LENGTH_16 = 1;
	const GET_PAYLOAD_LENGTH_64 = 2;
	const GET_MASK = 3;
	const GET_DATA = 4;
	const INFLATING = 5;
	const WAIT_MICROTASK = 6;

	/**
	 * HyBi Receiver implementation.
	 *
	 * @extends Writable
	 */
	class Receiver extends Writable {
	  /**
	   * Creates a Receiver instance.
	   *
	   * @param {Object} [options] Options object
	   * @param {String} [options.binaryType=nodebuffer] The type for binary data
	   * @param {Object} [options.extensions] An object containing the negotiated
	   *     extensions
	   * @param {Boolean} [options.isServer=false] Specifies whether to operate in
	   *     client or server mode
	   * @param {Number} [options.maxPayload=0] The maximum allowed message length
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   */
	  constructor(options = {}) {
	    super();

	    this._binaryType = options.binaryType || BINARY_TYPES[0];
	    this._extensions = options.extensions || {};
	    this._isServer = !!options.isServer;
	    this._maxPayload = options.maxPayload | 0;
	    this._skipUTF8Validation = !!options.skipUTF8Validation;
	    this[kWebSocket] = undefined;

	    this._bufferedBytes = 0;
	    this._buffers = [];

	    this._compressed = false;
	    this._payloadLength = 0;
	    this._mask = undefined;
	    this._fragmented = 0;
	    this._masked = false;
	    this._fin = false;
	    this._opcode = 0;

	    this._totalPayloadLength = 0;
	    this._messageLength = 0;
	    this._fragments = [];

	    this._state = GET_INFO;
	    this._loop = false;
	  }

	  /**
	   * Implements `Writable.prototype._write()`.
	   *
	   * @param {Buffer} chunk The chunk of data to write
	   * @param {String} encoding The character encoding of `chunk`
	   * @param {Function} cb Callback
	   * @private
	   */
	  _write(chunk, encoding, cb) {
	    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

	    this._bufferedBytes += chunk.length;
	    this._buffers.push(chunk);
	    this.startLoop(cb);
	  }

	  /**
	   * Consumes `n` bytes from the buffered data.
	   *
	   * @param {Number} n The number of bytes to consume
	   * @return {Buffer} The consumed bytes
	   * @private
	   */
	  consume(n) {
	    this._bufferedBytes -= n;

	    if (n === this._buffers[0].length) return this._buffers.shift();

	    if (n < this._buffers[0].length) {
	      const buf = this._buffers[0];
	      this._buffers[0] = new FastBuffer(
	        buf.buffer,
	        buf.byteOffset + n,
	        buf.length - n
	      );

	      return new FastBuffer(buf.buffer, buf.byteOffset, n);
	    }

	    const dst = Buffer.allocUnsafe(n);

	    do {
	      const buf = this._buffers[0];
	      const offset = dst.length - n;

	      if (n >= buf.length) {
	        dst.set(this._buffers.shift(), offset);
	      } else {
	        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
	        this._buffers[0] = new FastBuffer(
	          buf.buffer,
	          buf.byteOffset + n,
	          buf.length - n
	        );
	      }

	      n -= buf.length;
	    } while (n > 0);

	    return dst;
	  }

	  /**
	   * Starts the parsing loop.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  startLoop(cb) {
	    let err;
	    this._loop = true;

	    do {
	      switch (this._state) {
	        case GET_INFO:
	          err = this.getInfo();
	          break;
	        case GET_PAYLOAD_LENGTH_16:
	          err = this.getPayloadLength16();
	          break;
	        case GET_PAYLOAD_LENGTH_64:
	          err = this.getPayloadLength64();
	          break;
	        case GET_MASK:
	          this.getMask();
	          break;
	        case GET_DATA:
	          err = this.getData(cb);
	          break;
	        case INFLATING:
	          this._loop = false;
	          return;
	        default:
	          //
	          // `WAIT_MICROTASK`.
	          //
	          this._loop = false;

	          queueTask(() => {
	            this._state = GET_INFO;
	            this.startLoop(cb);
	          });
	          return;
	      }
	    } while (this._loop);

	    cb(err);
	  }

	  /**
	   * Reads the first two bytes of a frame.
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getInfo() {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(2);

	    if ((buf[0] & 0x30) !== 0x00) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'RSV2 and RSV3 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_2_3'
	      );
	    }

	    const compressed = (buf[0] & 0x40) === 0x40;

	    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'RSV1 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_1'
	      );
	    }

	    this._fin = (buf[0] & 0x80) === 0x80;
	    this._opcode = buf[0] & 0x0f;
	    this._payloadLength = buf[1] & 0x7f;

	    if (this._opcode === 0x00) {
	      if (compressed) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );
	      }

	      if (!this._fragmented) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'invalid opcode 0',
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );
	      }

	      this._opcode = this._fragmented;
	    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
	      if (this._fragmented) {
	        this._loop = false;
	        return error(
	          RangeError,
	          `invalid opcode ${this._opcode}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );
	      }

	      this._compressed = compressed;
	    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
	      if (!this._fin) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'FIN must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_FIN'
	        );
	      }

	      if (compressed) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );
	      }

	      if (
	        this._payloadLength > 0x7d ||
	        (this._opcode === 0x08 && this._payloadLength === 1)
	      ) {
	        this._loop = false;
	        return error(
	          RangeError,
	          `invalid payload length ${this._payloadLength}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
	        );
	      }
	    } else {
	      this._loop = false;
	      return error(
	        RangeError,
	        `invalid opcode ${this._opcode}`,
	        true,
	        1002,
	        'WS_ERR_INVALID_OPCODE'
	      );
	    }

	    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
	    this._masked = (buf[1] & 0x80) === 0x80;

	    if (this._isServer) {
	      if (!this._masked) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'MASK must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_MASK'
	        );
	      }
	    } else if (this._masked) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'MASK must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_MASK'
	      );
	    }

	    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
	    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
	    else return this.haveLength();
	  }

	  /**
	   * Gets extended payload length (7+16).
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getPayloadLength16() {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    this._payloadLength = this.consume(2).readUInt16BE(0);
	    return this.haveLength();
	  }

	  /**
	   * Gets extended payload length (7+64).
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getPayloadLength64() {
	    if (this._bufferedBytes < 8) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(8);
	    const num = buf.readUInt32BE(0);

	    //
	    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
	    // if payload length is greater than this number.
	    //
	    if (num > Math.pow(2, 53 - 32) - 1) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'Unsupported WebSocket frame: payload length > 2^53 - 1',
	        false,
	        1009,
	        'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH'
	      );
	    }

	    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
	    return this.haveLength();
	  }

	  /**
	   * Payload length has been read.
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  haveLength() {
	    if (this._payloadLength && this._opcode < 0x08) {
	      this._totalPayloadLength += this._payloadLength;
	      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'Max payload size exceeded',
	          false,
	          1009,
	          'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	        );
	      }
	    }

	    if (this._masked) this._state = GET_MASK;
	    else this._state = GET_DATA;
	  }

	  /**
	   * Reads mask bytes.
	   *
	   * @private
	   */
	  getMask() {
	    if (this._bufferedBytes < 4) {
	      this._loop = false;
	      return;
	    }

	    this._mask = this.consume(4);
	    this._state = GET_DATA;
	  }

	  /**
	   * Reads data bytes.
	   *
	   * @param {Function} cb Callback
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  getData(cb) {
	    let data = EMPTY_BUFFER;

	    if (this._payloadLength) {
	      if (this._bufferedBytes < this._payloadLength) {
	        this._loop = false;
	        return;
	      }

	      data = this.consume(this._payloadLength);

	      if (
	        this._masked &&
	        (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0
	      ) {
	        unmask(data, this._mask);
	      }
	    }

	    if (this._opcode > 0x07) return this.controlMessage(data);

	    if (this._compressed) {
	      this._state = INFLATING;
	      this.decompress(data, cb);
	      return;
	    }

	    if (data.length) {
	      //
	      // This message is not compressed so its length is the sum of the payload
	      // length of all fragments.
	      //
	      this._messageLength = this._totalPayloadLength;
	      this._fragments.push(data);
	    }

	    return this.dataMessage();
	  }

	  /**
	   * Decompresses data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Function} cb Callback
	   * @private
	   */
	  decompress(data, cb) {
	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

	    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
	      if (err) return cb(err);

	      if (buf.length) {
	        this._messageLength += buf.length;
	        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
	          return cb(
	            error(
	              RangeError,
	              'Max payload size exceeded',
	              false,
	              1009,
	              'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	            )
	          );
	        }

	        this._fragments.push(buf);
	      }

	      const er = this.dataMessage();
	      if (er) return cb(er);

	      this.startLoop(cb);
	    });
	  }

	  /**
	   * Handles a data message.
	   *
	   * @return {(Error|undefined)} A possible error
	   * @private
	   */
	  dataMessage() {
	    if (this._fin) {
	      const messageLength = this._messageLength;
	      const fragments = this._fragments;

	      this._totalPayloadLength = 0;
	      this._messageLength = 0;
	      this._fragmented = 0;
	      this._fragments = [];

	      if (this._opcode === 2) {
	        let data;

	        if (this._binaryType === 'nodebuffer') {
	          data = concat(fragments, messageLength);
	        } else if (this._binaryType === 'arraybuffer') {
	          data = toArrayBuffer(concat(fragments, messageLength));
	        } else {
	          data = fragments;
	        }

	        this.emit('message', data, true);
	      } else {
	        const buf = concat(fragments, messageLength);

	        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
	          this._loop = false;
	          return error(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );
	        }

	        this.emit('message', buf, false);
	      }
	    }

	    this._state = WAIT_MICROTASK;
	  }

	  /**
	   * Handles a control message.
	   *
	   * @param {Buffer} data Data to handle
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  controlMessage(data) {
	    if (this._opcode === 0x08) {
	      this._loop = false;

	      if (data.length === 0) {
	        this.emit('conclude', 1005, EMPTY_BUFFER);
	        this.end();

	        this._state = GET_INFO;
	      } else {
	        const code = data.readUInt16BE(0);

	        if (!isValidStatusCode(code)) {
	          return error(
	            RangeError,
	            `invalid status code ${code}`,
	            true,
	            1002,
	            'WS_ERR_INVALID_CLOSE_CODE'
	          );
	        }

	        const buf = new FastBuffer(
	          data.buffer,
	          data.byteOffset + 2,
	          data.length - 2
	        );

	        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
	          return error(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );
	        }

	        this.emit('conclude', code, buf);
	        this.end();

	        this._state = GET_INFO;
	      }
	    } else if (this._opcode === 0x09) {
	      this.emit('ping', data);
	      this._state = WAIT_MICROTASK;
	    } else {
	      this.emit('pong', data);
	      this._state = WAIT_MICROTASK;
	    }
	  }
	}

	receiver = Receiver;

	/**
	 * Builds an error object.
	 *
	 * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
	 * @param {String} message The error message
	 * @param {Boolean} prefix Specifies whether or not to add a default prefix to
	 *     `message`
	 * @param {Number} statusCode The status code
	 * @param {String} errorCode The exposed error code
	 * @return {(Error|RangeError)} The error
	 * @private
	 */
	function error(ErrorCtor, message, prefix, statusCode, errorCode) {
	  const err = new ErrorCtor(
	    prefix ? `Invalid WebSocket frame: ${message}` : message
	  );

	  Error.captureStackTrace(err, error);
	  err.code = errorCode;
	  err[kStatusCode] = statusCode;
	  return err;
	}

	/**
	 * A shim for `queueMicrotask()`.
	 *
	 * @param {Function} cb Callback
	 */
	function queueMicrotaskShim(cb) {
	  promise.then(cb).catch(throwErrorNextTick);
	}

	/**
	 * Throws an error.
	 *
	 * @param {Error} err The error to throw
	 * @private
	 */
	function throwError(err) {
	  throw err;
	}

	/**
	 * Throws an error in the next tick.
	 *
	 * @param {Error} err The error to throw
	 * @private
	 */
	function throwErrorNextTick(err) {
	  process.nextTick(throwError, err);
	}
	return receiver;
}

requireReceiver();

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex" }] */

var sender;
var hasRequiredSender;

function requireSender () {
	if (hasRequiredSender) return sender;
	hasRequiredSender = 1;
	const { randomFillSync } = require$$1;

	const PerMessageDeflate = requirePermessageDeflate();
	const { EMPTY_BUFFER } = requireConstants();
	const { isValidStatusCode } = requireValidation();
	const { mask: applyMask, toBuffer } = requireBufferUtil();

	const kByteLength = Symbol('kByteLength');
	const maskBuffer = Buffer.alloc(4);

	/**
	 * HyBi Sender implementation.
	 */
	class Sender {
	  /**
	   * Creates a Sender instance.
	   *
	   * @param {Duplex} socket The connection socket
	   * @param {Object} [extensions] An object containing the negotiated extensions
	   * @param {Function} [generateMask] The function used to generate the masking
	   *     key
	   */
	  constructor(socket, extensions, generateMask) {
	    this._extensions = extensions || {};

	    if (generateMask) {
	      this._generateMask = generateMask;
	      this._maskBuffer = Buffer.alloc(4);
	    }

	    this._socket = socket;

	    this._firstFragment = true;
	    this._compress = false;

	    this._bufferedBytes = 0;
	    this._deflating = false;
	    this._queue = [];
	  }

	  /**
	   * Frames a piece of data according to the HyBi WebSocket protocol.
	   *
	   * @param {(Buffer|String)} data The data to frame
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
	   *     key
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @return {(Buffer|String)[]} The framed data
	   * @public
	   */
	  static frame(data, options) {
	    let mask;
	    let merge = false;
	    let offset = 2;
	    let skipMasking = false;

	    if (options.mask) {
	      mask = options.maskBuffer || maskBuffer;

	      if (options.generateMask) {
	        options.generateMask(mask);
	      } else {
	        randomFillSync(mask, 0, 4);
	      }

	      skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
	      offset = 6;
	    }

	    let dataLength;

	    if (typeof data === 'string') {
	      if (
	        (!options.mask || skipMasking) &&
	        options[kByteLength] !== undefined
	      ) {
	        dataLength = options[kByteLength];
	      } else {
	        data = Buffer.from(data);
	        dataLength = data.length;
	      }
	    } else {
	      dataLength = data.length;
	      merge = options.mask && options.readOnly && !skipMasking;
	    }

	    let payloadLength = dataLength;

	    if (dataLength >= 65536) {
	      offset += 8;
	      payloadLength = 127;
	    } else if (dataLength > 125) {
	      offset += 2;
	      payloadLength = 126;
	    }

	    const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);

	    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
	    if (options.rsv1) target[0] |= 0x40;

	    target[1] = payloadLength;

	    if (payloadLength === 126) {
	      target.writeUInt16BE(dataLength, 2);
	    } else if (payloadLength === 127) {
	      target[2] = target[3] = 0;
	      target.writeUIntBE(dataLength, 4, 6);
	    }

	    if (!options.mask) return [target, data];

	    target[1] |= 0x80;
	    target[offset - 4] = mask[0];
	    target[offset - 3] = mask[1];
	    target[offset - 2] = mask[2];
	    target[offset - 1] = mask[3];

	    if (skipMasking) return [target, data];

	    if (merge) {
	      applyMask(data, mask, target, offset, dataLength);
	      return [target];
	    }

	    applyMask(data, mask, data, 0, dataLength);
	    return [target, data];
	  }

	  /**
	   * Sends a close message to the other peer.
	   *
	   * @param {Number} [code] The status code component of the body
	   * @param {(String|Buffer)} [data] The message component of the body
	   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  close(code, data, mask, cb) {
	    let buf;

	    if (code === undefined) {
	      buf = EMPTY_BUFFER;
	    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
	      throw new TypeError('First argument must be a valid error code number');
	    } else if (data === undefined || !data.length) {
	      buf = Buffer.allocUnsafe(2);
	      buf.writeUInt16BE(code, 0);
	    } else {
	      const length = Buffer.byteLength(data);

	      if (length > 123) {
	        throw new RangeError('The message must not be greater than 123 bytes');
	      }

	      buf = Buffer.allocUnsafe(2 + length);
	      buf.writeUInt16BE(code, 0);

	      if (typeof data === 'string') {
	        buf.write(data, 2);
	      } else {
	        buf.set(data, 2);
	      }
	    }

	    const options = {
	      [kByteLength]: buf.length,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x08,
	      readOnly: false,
	      rsv1: false
	    };

	    if (this._deflating) {
	      this.enqueue([this.dispatch, buf, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(buf, options), cb);
	    }
	  }

	  /**
	   * Sends a ping message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  ping(data, mask, cb) {
	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (byteLength > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    const options = {
	      [kByteLength]: byteLength,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x09,
	      readOnly,
	      rsv1: false
	    };

	    if (this._deflating) {
	      this.enqueue([this.dispatch, data, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(data, options), cb);
	    }
	  }

	  /**
	   * Sends a pong message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  pong(data, mask, cb) {
	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (byteLength > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    const options = {
	      [kByteLength]: byteLength,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x0a,
	      readOnly,
	      rsv1: false
	    };

	    if (this._deflating) {
	      this.enqueue([this.dispatch, data, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(data, options), cb);
	    }
	  }

	  /**
	   * Sends a data message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Object} options Options object
	   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
	   *     or text
	   * @param {Boolean} [options.compress=false] Specifies whether or not to
	   *     compress `data`
	   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  send(data, options, cb) {
	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
	    let opcode = options.binary ? 2 : 1;
	    let rsv1 = options.compress;

	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (this._firstFragment) {
	      this._firstFragment = false;
	      if (
	        rsv1 &&
	        perMessageDeflate &&
	        perMessageDeflate.params[
	          perMessageDeflate._isServer
	            ? 'server_no_context_takeover'
	            : 'client_no_context_takeover'
	        ]
	      ) {
	        rsv1 = byteLength >= perMessageDeflate._threshold;
	      }
	      this._compress = rsv1;
	    } else {
	      rsv1 = false;
	      opcode = 0;
	    }

	    if (options.fin) this._firstFragment = true;

	    if (perMessageDeflate) {
	      const opts = {
	        [kByteLength]: byteLength,
	        fin: options.fin,
	        generateMask: this._generateMask,
	        mask: options.mask,
	        maskBuffer: this._maskBuffer,
	        opcode,
	        readOnly,
	        rsv1
	      };

	      if (this._deflating) {
	        this.enqueue([this.dispatch, data, this._compress, opts, cb]);
	      } else {
	        this.dispatch(data, this._compress, opts, cb);
	      }
	    } else {
	      this.sendFrame(
	        Sender.frame(data, {
	          [kByteLength]: byteLength,
	          fin: options.fin,
	          generateMask: this._generateMask,
	          mask: options.mask,
	          maskBuffer: this._maskBuffer,
	          opcode,
	          readOnly,
	          rsv1: false
	        }),
	        cb
	      );
	    }
	  }

	  /**
	   * Dispatches a message.
	   *
	   * @param {(Buffer|String)} data The message to send
	   * @param {Boolean} [compress=false] Specifies whether or not to compress
	   *     `data`
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
	   *     key
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  dispatch(data, compress, options, cb) {
	    if (!compress) {
	      this.sendFrame(Sender.frame(data, options), cb);
	      return;
	    }

	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

	    this._bufferedBytes += options[kByteLength];
	    this._deflating = true;
	    perMessageDeflate.compress(data, options.fin, (_, buf) => {
	      if (this._socket.destroyed) {
	        const err = new Error(
	          'The socket was closed while data was being compressed'
	        );

	        if (typeof cb === 'function') cb(err);

	        for (let i = 0; i < this._queue.length; i++) {
	          const params = this._queue[i];
	          const callback = params[params.length - 1];

	          if (typeof callback === 'function') callback(err);
	        }

	        return;
	      }

	      this._bufferedBytes -= options[kByteLength];
	      this._deflating = false;
	      options.readOnly = false;
	      this.sendFrame(Sender.frame(buf, options), cb);
	      this.dequeue();
	    });
	  }

	  /**
	   * Executes queued send operations.
	   *
	   * @private
	   */
	  dequeue() {
	    while (!this._deflating && this._queue.length) {
	      const params = this._queue.shift();

	      this._bufferedBytes -= params[3][kByteLength];
	      Reflect.apply(params[0], this, params.slice(1));
	    }
	  }

	  /**
	   * Enqueues a send operation.
	   *
	   * @param {Array} params Send operation parameters.
	   * @private
	   */
	  enqueue(params) {
	    this._bufferedBytes += params[3][kByteLength];
	    this._queue.push(params);
	  }

	  /**
	   * Sends a frame.
	   *
	   * @param {Buffer[]} list The frame to send
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  sendFrame(list, cb) {
	    if (list.length === 2) {
	      this._socket.cork();
	      this._socket.write(list[0]);
	      this._socket.write(list[1], cb);
	      this._socket.uncork();
	    } else {
	      this._socket.write(list[0], cb);
	    }
	  }
	}

	sender = Sender;
	return sender;
}

requireSender();

var eventTarget;
var hasRequiredEventTarget;

function requireEventTarget () {
	if (hasRequiredEventTarget) return eventTarget;
	hasRequiredEventTarget = 1;

	const { kForOnEventAttribute, kListener } = requireConstants();

	const kCode = Symbol('kCode');
	const kData = Symbol('kData');
	const kError = Symbol('kError');
	const kMessage = Symbol('kMessage');
	const kReason = Symbol('kReason');
	const kTarget = Symbol('kTarget');
	const kType = Symbol('kType');
	const kWasClean = Symbol('kWasClean');

	/**
	 * Class representing an event.
	 */
	class Event {
	  /**
	   * Create a new `Event`.
	   *
	   * @param {String} type The name of the event
	   * @throws {TypeError} If the `type` argument is not specified
	   */
	  constructor(type) {
	    this[kTarget] = null;
	    this[kType] = type;
	  }

	  /**
	   * @type {*}
	   */
	  get target() {
	    return this[kTarget];
	  }

	  /**
	   * @type {String}
	   */
	  get type() {
	    return this[kType];
	  }
	}

	Object.defineProperty(Event.prototype, 'target', { enumerable: true });
	Object.defineProperty(Event.prototype, 'type', { enumerable: true });

	/**
	 * Class representing a close event.
	 *
	 * @extends Event
	 */
	class CloseEvent extends Event {
	  /**
	   * Create a new `CloseEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {Number} [options.code=0] The status code explaining why the
	   *     connection was closed
	   * @param {String} [options.reason=''] A human-readable string explaining why
	   *     the connection was closed
	   * @param {Boolean} [options.wasClean=false] Indicates whether or not the
	   *     connection was cleanly closed
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kCode] = options.code === undefined ? 0 : options.code;
	    this[kReason] = options.reason === undefined ? '' : options.reason;
	    this[kWasClean] = options.wasClean === undefined ? false : options.wasClean;
	  }

	  /**
	   * @type {Number}
	   */
	  get code() {
	    return this[kCode];
	  }

	  /**
	   * @type {String}
	   */
	  get reason() {
	    return this[kReason];
	  }

	  /**
	   * @type {Boolean}
	   */
	  get wasClean() {
	    return this[kWasClean];
	  }
	}

	Object.defineProperty(CloseEvent.prototype, 'code', { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, 'reason', { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, 'wasClean', { enumerable: true });

	/**
	 * Class representing an error event.
	 *
	 * @extends Event
	 */
	class ErrorEvent extends Event {
	  /**
	   * Create a new `ErrorEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {*} [options.error=null] The error that generated this event
	   * @param {String} [options.message=''] The error message
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kError] = options.error === undefined ? null : options.error;
	    this[kMessage] = options.message === undefined ? '' : options.message;
	  }

	  /**
	   * @type {*}
	   */
	  get error() {
	    return this[kError];
	  }

	  /**
	   * @type {String}
	   */
	  get message() {
	    return this[kMessage];
	  }
	}

	Object.defineProperty(ErrorEvent.prototype, 'error', { enumerable: true });
	Object.defineProperty(ErrorEvent.prototype, 'message', { enumerable: true });

	/**
	 * Class representing a message event.
	 *
	 * @extends Event
	 */
	class MessageEvent extends Event {
	  /**
	   * Create a new `MessageEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {*} [options.data=null] The message content
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kData] = options.data === undefined ? null : options.data;
	  }

	  /**
	   * @type {*}
	   */
	  get data() {
	    return this[kData];
	  }
	}

	Object.defineProperty(MessageEvent.prototype, 'data', { enumerable: true });

	/**
	 * This provides methods for emulating the `EventTarget` interface. It's not
	 * meant to be used directly.
	 *
	 * @mixin
	 */
	const EventTarget = {
	  /**
	   * Register an event listener.
	   *
	   * @param {String} type A string representing the event type to listen for
	   * @param {(Function|Object)} handler The listener to add
	   * @param {Object} [options] An options object specifies characteristics about
	   *     the event listener
	   * @param {Boolean} [options.once=false] A `Boolean` indicating that the
	   *     listener should be invoked at most once after being added. If `true`,
	   *     the listener would be automatically removed when invoked.
	   * @public
	   */
	  addEventListener(type, handler, options = {}) {
	    for (const listener of this.listeners(type)) {
	      if (
	        !options[kForOnEventAttribute] &&
	        listener[kListener] === handler &&
	        !listener[kForOnEventAttribute]
	      ) {
	        return;
	      }
	    }

	    let wrapper;

	    if (type === 'message') {
	      wrapper = function onMessage(data, isBinary) {
	        const event = new MessageEvent('message', {
	          data: isBinary ? data : data.toString()
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'close') {
	      wrapper = function onClose(code, message) {
	        const event = new CloseEvent('close', {
	          code,
	          reason: message.toString(),
	          wasClean: this._closeFrameReceived && this._closeFrameSent
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'error') {
	      wrapper = function onError(error) {
	        const event = new ErrorEvent('error', {
	          error,
	          message: error.message
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'open') {
	      wrapper = function onOpen() {
	        const event = new Event('open');

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else {
	      return;
	    }

	    wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
	    wrapper[kListener] = handler;

	    if (options.once) {
	      this.once(type, wrapper);
	    } else {
	      this.on(type, wrapper);
	    }
	  },

	  /**
	   * Remove an event listener.
	   *
	   * @param {String} type A string representing the event type to remove
	   * @param {(Function|Object)} handler The listener to remove
	   * @public
	   */
	  removeEventListener(type, handler) {
	    for (const listener of this.listeners(type)) {
	      if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
	        this.removeListener(type, listener);
	        break;
	      }
	    }
	  }
	};

	eventTarget = {
	  CloseEvent,
	  ErrorEvent,
	  Event,
	  EventTarget,
	  MessageEvent
	};

	/**
	 * Call an event listener
	 *
	 * @param {(Function|Object)} listener The listener to call
	 * @param {*} thisArg The value to use as `this`` when calling the listener
	 * @param {Event} event The event to pass to the listener
	 * @private
	 */
	function callListener(listener, thisArg, event) {
	  if (typeof listener === 'object' && listener.handleEvent) {
	    listener.handleEvent.call(listener, event);
	  } else {
	    listener.call(thisArg, event);
	  }
	}
	return eventTarget;
}

var extension;
var hasRequiredExtension;

function requireExtension () {
	if (hasRequiredExtension) return extension;
	hasRequiredExtension = 1;

	const { tokenChars } = requireValidation();

	/**
	 * Adds an offer to the map of extension offers or a parameter to the map of
	 * parameters.
	 *
	 * @param {Object} dest The map of extension offers or parameters
	 * @param {String} name The extension or parameter name
	 * @param {(Object|Boolean|String)} elem The extension parameters or the
	 *     parameter value
	 * @private
	 */
	function push(dest, name, elem) {
	  if (dest[name] === undefined) dest[name] = [elem];
	  else dest[name].push(elem);
	}

	/**
	 * Parses the `Sec-WebSocket-Extensions` header into an object.
	 *
	 * @param {String} header The field value of the header
	 * @return {Object} The parsed object
	 * @public
	 */
	function parse(header) {
	  const offers = Object.create(null);
	  let params = Object.create(null);
	  let mustUnescape = false;
	  let isEscaping = false;
	  let inQuotes = false;
	  let extensionName;
	  let paramName;
	  let start = -1;
	  let code = -1;
	  let end = -1;
	  let i = 0;

	  for (; i < header.length; i++) {
	    code = header.charCodeAt(i);

	    if (extensionName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (
	        i !== 0 &&
	        (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
	      ) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        const name = header.slice(start, end);
	        if (code === 0x2c) {
	          push(offers, name, params);
	          params = Object.create(null);
	        } else {
	          extensionName = name;
	        }

	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else if (paramName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (code === 0x20 || code === 0x09) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        push(params, header.slice(start, end), true);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        start = end = -1;
	      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
	        paramName = header.slice(start, i);
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else {
	      //
	      // The value of a quoted-string after unescaping must conform to the
	      // token ABNF, so only token characters are valid.
	      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
	      //
	      if (isEscaping) {
	        if (tokenChars[code] !== 1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	        if (start === -1) start = i;
	        else if (!mustUnescape) mustUnescape = true;
	        isEscaping = false;
	      } else if (inQuotes) {
	        if (tokenChars[code] === 1) {
	          if (start === -1) start = i;
	        } else if (code === 0x22 /* '"' */ && start !== -1) {
	          inQuotes = false;
	          end = i;
	        } else if (code === 0x5c /* '\' */) {
	          isEscaping = true;
	        } else {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
	        inQuotes = true;
	      } else if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
	        if (end === -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        let value = header.slice(start, end);
	        if (mustUnescape) {
	          value = value.replace(/\\/g, '');
	          mustUnescape = false;
	        }
	        push(params, paramName, value);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        paramName = undefined;
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    }
	  }

	  if (start === -1 || inQuotes || code === 0x20 || code === 0x09) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  if (end === -1) end = i;
	  const token = header.slice(start, end);
	  if (extensionName === undefined) {
	    push(offers, token, params);
	  } else {
	    if (paramName === undefined) {
	      push(params, token, true);
	    } else if (mustUnescape) {
	      push(params, paramName, token.replace(/\\/g, ''));
	    } else {
	      push(params, paramName, token);
	    }
	    push(offers, extensionName, params);
	  }

	  return offers;
	}

	/**
	 * Builds the `Sec-WebSocket-Extensions` header field value.
	 *
	 * @param {Object} extensions The map of extensions and parameters to format
	 * @return {String} A string representing the given object
	 * @public
	 */
	function format(extensions) {
	  return Object.keys(extensions)
	    .map((extension) => {
	      let configurations = extensions[extension];
	      if (!Array.isArray(configurations)) configurations = [configurations];
	      return configurations
	        .map((params) => {
	          return [extension]
	            .concat(
	              Object.keys(params).map((k) => {
	                let values = params[k];
	                if (!Array.isArray(values)) values = [values];
	                return values
	                  .map((v) => (v === true ? k : `${k}=${v}`))
	                  .join('; ');
	              })
	            )
	            .join('; ');
	        })
	        .join(', ');
	    })
	    .join(', ');
	}

	extension = { format, parse };
	return extension;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex|Readable$" }] */

var websocket;
var hasRequiredWebsocket;

function requireWebsocket () {
	if (hasRequiredWebsocket) return websocket;
	hasRequiredWebsocket = 1;

	const EventEmitter = require$$0$3;
	const https = require$$1$1;
	const http = require$$2;
	const net = require$$3;
	const tls = require$$4;
	const { randomBytes, createHash } = require$$1;
	const { URL } = require$$7;

	const PerMessageDeflate = requirePermessageDeflate();
	const Receiver = requireReceiver();
	const Sender = requireSender();
	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  GUID,
	  kForOnEventAttribute,
	  kListener,
	  kStatusCode,
	  kWebSocket,
	  NOOP
	} = requireConstants();
	const {
	  EventTarget: { addEventListener, removeEventListener }
	} = requireEventTarget();
	const { format, parse } = requireExtension();
	const { toBuffer } = requireBufferUtil();

	const closeTimeout = 30 * 1000;
	const kAborted = Symbol('kAborted');
	const protocolVersions = [8, 13];
	const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
	const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;

	/**
	 * Class representing a WebSocket.
	 *
	 * @extends EventEmitter
	 */
	class WebSocket extends EventEmitter {
	  /**
	   * Create a new `WebSocket`.
	   *
	   * @param {(String|URL)} address The URL to which to connect
	   * @param {(String|String[])} [protocols] The subprotocols
	   * @param {Object} [options] Connection options
	   */
	  constructor(address, protocols, options) {
	    super();

	    this._binaryType = BINARY_TYPES[0];
	    this._closeCode = 1006;
	    this._closeFrameReceived = false;
	    this._closeFrameSent = false;
	    this._closeMessage = EMPTY_BUFFER;
	    this._closeTimer = null;
	    this._extensions = {};
	    this._paused = false;
	    this._protocol = '';
	    this._readyState = WebSocket.CONNECTING;
	    this._receiver = null;
	    this._sender = null;
	    this._socket = null;

	    if (address !== null) {
	      this._bufferedAmount = 0;
	      this._isServer = false;
	      this._redirects = 0;

	      if (protocols === undefined) {
	        protocols = [];
	      } else if (!Array.isArray(protocols)) {
	        if (typeof protocols === 'object' && protocols !== null) {
	          options = protocols;
	          protocols = [];
	        } else {
	          protocols = [protocols];
	        }
	      }

	      initAsClient(this, address, protocols, options);
	    } else {
	      this._isServer = true;
	    }
	  }

	  /**
	   * This deviates from the WHATWG interface since ws doesn't support the
	   * required default "blob" type (instead we define a custom "nodebuffer"
	   * type).
	   *
	   * @type {String}
	   */
	  get binaryType() {
	    return this._binaryType;
	  }

	  set binaryType(type) {
	    if (!BINARY_TYPES.includes(type)) return;

	    this._binaryType = type;

	    //
	    // Allow to change `binaryType` on the fly.
	    //
	    if (this._receiver) this._receiver._binaryType = type;
	  }

	  /**
	   * @type {Number}
	   */
	  get bufferedAmount() {
	    if (!this._socket) return this._bufferedAmount;

	    return this._socket._writableState.length + this._sender._bufferedBytes;
	  }

	  /**
	   * @type {String}
	   */
	  get extensions() {
	    return Object.keys(this._extensions).join();
	  }

	  /**
	   * @type {Boolean}
	   */
	  get isPaused() {
	    return this._paused;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onclose() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onerror() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onopen() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onmessage() {
	    return null;
	  }

	  /**
	   * @type {String}
	   */
	  get protocol() {
	    return this._protocol;
	  }

	  /**
	   * @type {Number}
	   */
	  get readyState() {
	    return this._readyState;
	  }

	  /**
	   * @type {String}
	   */
	  get url() {
	    return this._url;
	  }

	  /**
	   * Set up the socket and the internal resources.
	   *
	   * @param {Duplex} socket The network socket between the server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Object} options Options object
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Number} [options.maxPayload=0] The maximum allowed message size
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   * @private
	   */
	  setSocket(socket, head, options) {
	    const receiver = new Receiver({
	      binaryType: this.binaryType,
	      extensions: this._extensions,
	      isServer: this._isServer,
	      maxPayload: options.maxPayload,
	      skipUTF8Validation: options.skipUTF8Validation
	    });

	    this._sender = new Sender(socket, this._extensions, options.generateMask);
	    this._receiver = receiver;
	    this._socket = socket;

	    receiver[kWebSocket] = this;
	    socket[kWebSocket] = this;

	    receiver.on('conclude', receiverOnConclude);
	    receiver.on('drain', receiverOnDrain);
	    receiver.on('error', receiverOnError);
	    receiver.on('message', receiverOnMessage);
	    receiver.on('ping', receiverOnPing);
	    receiver.on('pong', receiverOnPong);

	    //
	    // These methods may not be available if `socket` is just a `Duplex`.
	    //
	    if (socket.setTimeout) socket.setTimeout(0);
	    if (socket.setNoDelay) socket.setNoDelay();

	    if (head.length > 0) socket.unshift(head);

	    socket.on('close', socketOnClose);
	    socket.on('data', socketOnData);
	    socket.on('end', socketOnEnd);
	    socket.on('error', socketOnError);

	    this._readyState = WebSocket.OPEN;
	    this.emit('open');
	  }

	  /**
	   * Emit the `'close'` event.
	   *
	   * @private
	   */
	  emitClose() {
	    if (!this._socket) {
	      this._readyState = WebSocket.CLOSED;
	      this.emit('close', this._closeCode, this._closeMessage);
	      return;
	    }

	    if (this._extensions[PerMessageDeflate.extensionName]) {
	      this._extensions[PerMessageDeflate.extensionName].cleanup();
	    }

	    this._receiver.removeAllListeners();
	    this._readyState = WebSocket.CLOSED;
	    this.emit('close', this._closeCode, this._closeMessage);
	  }

	  /**
	   * Start a closing handshake.
	   *
	   *          +----------+   +-----------+   +----------+
	   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
	   *    |     +----------+   +-----------+   +----------+     |
	   *          +----------+   +-----------+         |
	   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
	   *          +----------+   +-----------+   |
	   *    |           |                        |   +---+        |
	   *                +------------------------+-->|fin| - - - -
	   *    |         +---+                      |   +---+
	   *     - - - - -|fin|<---------------------+
	   *              +---+
	   *
	   * @param {Number} [code] Status code explaining why the connection is closing
	   * @param {(String|Buffer)} [data] The reason why the connection is
	   *     closing
	   * @public
	   */
	  close(code, data) {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      abortHandshake(this, this._req, msg);
	      return;
	    }

	    if (this.readyState === WebSocket.CLOSING) {
	      if (
	        this._closeFrameSent &&
	        (this._closeFrameReceived || this._receiver._writableState.errorEmitted)
	      ) {
	        this._socket.end();
	      }

	      return;
	    }

	    this._readyState = WebSocket.CLOSING;
	    this._sender.close(code, data, !this._isServer, (err) => {
	      //
	      // This error is handled by the `'error'` listener on the socket. We only
	      // want to know if the close frame has been sent here.
	      //
	      if (err) return;

	      this._closeFrameSent = true;

	      if (
	        this._closeFrameReceived ||
	        this._receiver._writableState.errorEmitted
	      ) {
	        this._socket.end();
	      }
	    });

	    //
	    // Specify a timeout for the closing handshake to complete.
	    //
	    this._closeTimer = setTimeout(
	      this._socket.destroy.bind(this._socket),
	      closeTimeout
	    );
	  }

	  /**
	   * Pause the socket.
	   *
	   * @public
	   */
	  pause() {
	    if (
	      this.readyState === WebSocket.CONNECTING ||
	      this.readyState === WebSocket.CLOSED
	    ) {
	      return;
	    }

	    this._paused = true;
	    this._socket.pause();
	  }

	  /**
	   * Send a ping.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the ping is sent
	   * @public
	   */
	  ping(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Send a pong.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the pong is sent
	   * @public
	   */
	  pong(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Resume the socket.
	   *
	   * @public
	   */
	  resume() {
	    if (
	      this.readyState === WebSocket.CONNECTING ||
	      this.readyState === WebSocket.CLOSED
	    ) {
	      return;
	    }

	    this._paused = false;
	    if (!this._receiver._writableState.needDrain) this._socket.resume();
	  }

	  /**
	   * Send a data message.
	   *
	   * @param {*} data The message to send
	   * @param {Object} [options] Options object
	   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
	   *     text
	   * @param {Boolean} [options.compress] Specifies whether or not to compress
	   *     `data`
	   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when data is written out
	   * @public
	   */
	  send(data, options, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof options === 'function') {
	      cb = options;
	      options = {};
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    const opts = {
	      binary: typeof data !== 'string',
	      mask: !this._isServer,
	      compress: true,
	      fin: true,
	      ...options
	    };

	    if (!this._extensions[PerMessageDeflate.extensionName]) {
	      opts.compress = false;
	    }

	    this._sender.send(data || EMPTY_BUFFER, opts, cb);
	  }

	  /**
	   * Forcibly close the connection.
	   *
	   * @public
	   */
	  terminate() {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      abortHandshake(this, this._req, msg);
	      return;
	    }

	    if (this._socket) {
	      this._readyState = WebSocket.CLOSING;
	      this._socket.destroy();
	    }
	  }
	}

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	[
	  'binaryType',
	  'bufferedAmount',
	  'extensions',
	  'isPaused',
	  'protocol',
	  'readyState',
	  'url'
	].forEach((property) => {
	  Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});

	//
	// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
	// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
	//
	['open', 'error', 'close', 'message'].forEach((method) => {
	  Object.defineProperty(WebSocket.prototype, `on${method}`, {
	    enumerable: true,
	    get() {
	      for (const listener of this.listeners(method)) {
	        if (listener[kForOnEventAttribute]) return listener[kListener];
	      }

	      return null;
	    },
	    set(handler) {
	      for (const listener of this.listeners(method)) {
	        if (listener[kForOnEventAttribute]) {
	          this.removeListener(method, listener);
	          break;
	        }
	      }

	      if (typeof handler !== 'function') return;

	      this.addEventListener(method, handler, {
	        [kForOnEventAttribute]: true
	      });
	    }
	  });
	});

	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;

	websocket = WebSocket;

	/**
	 * Initialize a WebSocket client.
	 *
	 * @param {WebSocket} websocket The client to initialize
	 * @param {(String|URL)} address The URL to which to connect
	 * @param {Array} protocols The subprotocols
	 * @param {Object} [options] Connection options
	 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
	 *     redirects
	 * @param {Function} [options.generateMask] The function used to generate the
	 *     masking key
	 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	 *     handshake request
	 * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	 *     size
	 * @param {Number} [options.maxRedirects=10] The maximum number of redirects
	 *     allowed
	 * @param {String} [options.origin] Value of the `Origin` or
	 *     `Sec-WebSocket-Origin` header
	 * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	 *     permessage-deflate
	 * @param {Number} [options.protocolVersion=13] Value of the
	 *     `Sec-WebSocket-Version` header
	 * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	 *     not to skip UTF-8 validation for text and close messages
	 * @private
	 */
	function initAsClient(websocket, address, protocols, options) {
	  const opts = {
	    protocolVersion: protocolVersions[1],
	    maxPayload: 100 * 1024 * 1024,
	    skipUTF8Validation: false,
	    perMessageDeflate: true,
	    followRedirects: false,
	    maxRedirects: 10,
	    ...options,
	    createConnection: undefined,
	    socketPath: undefined,
	    hostname: undefined,
	    protocol: undefined,
	    timeout: undefined,
	    method: 'GET',
	    host: undefined,
	    path: undefined,
	    port: undefined
	  };

	  if (!protocolVersions.includes(opts.protocolVersion)) {
	    throw new RangeError(
	      `Unsupported protocol version: ${opts.protocolVersion} ` +
	        `(supported versions: ${protocolVersions.join(', ')})`
	    );
	  }

	  let parsedUrl;

	  if (address instanceof URL) {
	    parsedUrl = address;
	  } else {
	    try {
	      parsedUrl = new URL(address);
	    } catch (e) {
	      throw new SyntaxError(`Invalid URL: ${address}`);
	    }
	  }

	  if (parsedUrl.protocol === 'http:') {
	    parsedUrl.protocol = 'ws:';
	  } else if (parsedUrl.protocol === 'https:') {
	    parsedUrl.protocol = 'wss:';
	  }

	  websocket._url = parsedUrl.href;

	  const isSecure = parsedUrl.protocol === 'wss:';
	  const isIpcUrl = parsedUrl.protocol === 'ws+unix:';
	  let invalidUrlMessage;

	  if (parsedUrl.protocol !== 'ws:' && !isSecure && !isIpcUrl) {
	    invalidUrlMessage =
	      'The URL\'s protocol must be one of "ws:", "wss:", ' +
	      '"http:", "https", or "ws+unix:"';
	  } else if (isIpcUrl && !parsedUrl.pathname) {
	    invalidUrlMessage = "The URL's pathname is empty";
	  } else if (parsedUrl.hash) {
	    invalidUrlMessage = 'The URL contains a fragment identifier';
	  }

	  if (invalidUrlMessage) {
	    const err = new SyntaxError(invalidUrlMessage);

	    if (websocket._redirects === 0) {
	      throw err;
	    } else {
	      emitErrorAndClose(websocket, err);
	      return;
	    }
	  }

	  const defaultPort = isSecure ? 443 : 80;
	  const key = randomBytes(16).toString('base64');
	  const request = isSecure ? https.request : http.request;
	  const protocolSet = new Set();
	  let perMessageDeflate;

	  opts.createConnection = isSecure ? tlsConnect : netConnect;
	  opts.defaultPort = opts.defaultPort || defaultPort;
	  opts.port = parsedUrl.port || defaultPort;
	  opts.host = parsedUrl.hostname.startsWith('[')
	    ? parsedUrl.hostname.slice(1, -1)
	    : parsedUrl.hostname;
	  opts.headers = {
	    ...opts.headers,
	    'Sec-WebSocket-Version': opts.protocolVersion,
	    'Sec-WebSocket-Key': key,
	    Connection: 'Upgrade',
	    Upgrade: 'websocket'
	  };
	  opts.path = parsedUrl.pathname + parsedUrl.search;
	  opts.timeout = opts.handshakeTimeout;

	  if (opts.perMessageDeflate) {
	    perMessageDeflate = new PerMessageDeflate(
	      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
	      false,
	      opts.maxPayload
	    );
	    opts.headers['Sec-WebSocket-Extensions'] = format({
	      [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
	    });
	  }
	  if (protocols.length) {
	    for (const protocol of protocols) {
	      if (
	        typeof protocol !== 'string' ||
	        !subprotocolRegex.test(protocol) ||
	        protocolSet.has(protocol)
	      ) {
	        throw new SyntaxError(
	          'An invalid or duplicated subprotocol was specified'
	        );
	      }

	      protocolSet.add(protocol);
	    }

	    opts.headers['Sec-WebSocket-Protocol'] = protocols.join(',');
	  }
	  if (opts.origin) {
	    if (opts.protocolVersion < 13) {
	      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
	    } else {
	      opts.headers.Origin = opts.origin;
	    }
	  }
	  if (parsedUrl.username || parsedUrl.password) {
	    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
	  }

	  if (isIpcUrl) {
	    const parts = opts.path.split(':');

	    opts.socketPath = parts[0];
	    opts.path = parts[1];
	  }

	  let req;

	  if (opts.followRedirects) {
	    if (websocket._redirects === 0) {
	      websocket._originalIpc = isIpcUrl;
	      websocket._originalSecure = isSecure;
	      websocket._originalHostOrSocketPath = isIpcUrl
	        ? opts.socketPath
	        : parsedUrl.host;

	      const headers = options && options.headers;

	      //
	      // Shallow copy the user provided options so that headers can be changed
	      // without mutating the original object.
	      //
	      options = { ...options, headers: {} };

	      if (headers) {
	        for (const [key, value] of Object.entries(headers)) {
	          options.headers[key.toLowerCase()] = value;
	        }
	      }
	    } else if (websocket.listenerCount('redirect') === 0) {
	      const isSameHost = isIpcUrl
	        ? websocket._originalIpc
	          ? opts.socketPath === websocket._originalHostOrSocketPath
	          : false
	        : websocket._originalIpc
	        ? false
	        : parsedUrl.host === websocket._originalHostOrSocketPath;

	      if (!isSameHost || (websocket._originalSecure && !isSecure)) {
	        //
	        // Match curl 7.77.0 behavior and drop the following headers. These
	        // headers are also dropped when following a redirect to a subdomain.
	        //
	        delete opts.headers.authorization;
	        delete opts.headers.cookie;

	        if (!isSameHost) delete opts.headers.host;

	        opts.auth = undefined;
	      }
	    }

	    //
	    // Match curl 7.77.0 behavior and make the first `Authorization` header win.
	    // If the `Authorization` header is set, then there is nothing to do as it
	    // will take precedence.
	    //
	    if (opts.auth && !options.headers.authorization) {
	      options.headers.authorization =
	        'Basic ' + Buffer.from(opts.auth).toString('base64');
	    }

	    req = websocket._req = request(opts);

	    if (websocket._redirects) {
	      //
	      // Unlike what is done for the `'upgrade'` event, no early exit is
	      // triggered here if the user calls `websocket.close()` or
	      // `websocket.terminate()` from a listener of the `'redirect'` event. This
	      // is because the user can also call `request.destroy()` with an error
	      // before calling `websocket.close()` or `websocket.terminate()` and this
	      // would result in an error being emitted on the `request` object with no
	      // `'error'` event listeners attached.
	      //
	      websocket.emit('redirect', websocket.url, req);
	    }
	  } else {
	    req = websocket._req = request(opts);
	  }

	  if (opts.timeout) {
	    req.on('timeout', () => {
	      abortHandshake(websocket, req, 'Opening handshake has timed out');
	    });
	  }

	  req.on('error', (err) => {
	    if (req === null || req[kAborted]) return;

	    req = websocket._req = null;
	    emitErrorAndClose(websocket, err);
	  });

	  req.on('response', (res) => {
	    const location = res.headers.location;
	    const statusCode = res.statusCode;

	    if (
	      location &&
	      opts.followRedirects &&
	      statusCode >= 300 &&
	      statusCode < 400
	    ) {
	      if (++websocket._redirects > opts.maxRedirects) {
	        abortHandshake(websocket, req, 'Maximum redirects exceeded');
	        return;
	      }

	      req.abort();

	      let addr;

	      try {
	        addr = new URL(location, address);
	      } catch (e) {
	        const err = new SyntaxError(`Invalid URL: ${location}`);
	        emitErrorAndClose(websocket, err);
	        return;
	      }

	      initAsClient(websocket, addr, protocols, options);
	    } else if (!websocket.emit('unexpected-response', req, res)) {
	      abortHandshake(
	        websocket,
	        req,
	        `Unexpected server response: ${res.statusCode}`
	      );
	    }
	  });

	  req.on('upgrade', (res, socket, head) => {
	    websocket.emit('upgrade', res);

	    //
	    // The user may have closed the connection from a listener of the
	    // `'upgrade'` event.
	    //
	    if (websocket.readyState !== WebSocket.CONNECTING) return;

	    req = websocket._req = null;

	    if (res.headers.upgrade.toLowerCase() !== 'websocket') {
	      abortHandshake(websocket, socket, 'Invalid Upgrade header');
	      return;
	    }

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    if (res.headers['sec-websocket-accept'] !== digest) {
	      abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
	      return;
	    }

	    const serverProt = res.headers['sec-websocket-protocol'];
	    let protError;

	    if (serverProt !== undefined) {
	      if (!protocolSet.size) {
	        protError = 'Server sent a subprotocol but none was requested';
	      } else if (!protocolSet.has(serverProt)) {
	        protError = 'Server sent an invalid subprotocol';
	      }
	    } else if (protocolSet.size) {
	      protError = 'Server sent no subprotocol';
	    }

	    if (protError) {
	      abortHandshake(websocket, socket, protError);
	      return;
	    }

	    if (serverProt) websocket._protocol = serverProt;

	    const secWebSocketExtensions = res.headers['sec-websocket-extensions'];

	    if (secWebSocketExtensions !== undefined) {
	      if (!perMessageDeflate) {
	        const message =
	          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
	          'was requested';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      let extensions;

	      try {
	        extensions = parse(secWebSocketExtensions);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      const extensionNames = Object.keys(extensions);

	      if (
	        extensionNames.length !== 1 ||
	        extensionNames[0] !== PerMessageDeflate.extensionName
	      ) {
	        const message = 'Server indicated an extension that was not requested';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      try {
	        perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      websocket._extensions[PerMessageDeflate.extensionName] =
	        perMessageDeflate;
	    }

	    websocket.setSocket(socket, head, {
	      generateMask: opts.generateMask,
	      maxPayload: opts.maxPayload,
	      skipUTF8Validation: opts.skipUTF8Validation
	    });
	  });

	  if (opts.finishRequest) {
	    opts.finishRequest(req, websocket);
	  } else {
	    req.end();
	  }
	}

	/**
	 * Emit the `'error'` and `'close'` events.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {Error} The error to emit
	 * @private
	 */
	function emitErrorAndClose(websocket, err) {
	  websocket._readyState = WebSocket.CLOSING;
	  websocket.emit('error', err);
	  websocket.emitClose();
	}

	/**
	 * Create a `net.Socket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {net.Socket} The newly created socket used to start the connection
	 * @private
	 */
	function netConnect(options) {
	  options.path = options.socketPath;
	  return net.connect(options);
	}

	/**
	 * Create a `tls.TLSSocket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {tls.TLSSocket} The newly created socket used to start the connection
	 * @private
	 */
	function tlsConnect(options) {
	  options.path = undefined;

	  if (!options.servername && options.servername !== '') {
	    options.servername = net.isIP(options.host) ? '' : options.host;
	  }

	  return tls.connect(options);
	}

	/**
	 * Abort the handshake and emit an error.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	 *     abort or the socket to destroy
	 * @param {String} message The error message
	 * @private
	 */
	function abortHandshake(websocket, stream, message) {
	  websocket._readyState = WebSocket.CLOSING;

	  const err = new Error(message);
	  Error.captureStackTrace(err, abortHandshake);

	  if (stream.setHeader) {
	    stream[kAborted] = true;
	    stream.abort();

	    if (stream.socket && !stream.socket.destroyed) {
	      //
	      // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
	      // called after the request completed. See
	      // https://github.com/websockets/ws/issues/1869.
	      //
	      stream.socket.destroy();
	    }

	    process.nextTick(emitErrorAndClose, websocket, err);
	  } else {
	    stream.destroy(err);
	    stream.once('error', websocket.emit.bind(websocket, 'error'));
	    stream.once('close', websocket.emitClose.bind(websocket));
	  }
	}

	/**
	 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {*} [data] The data to send
	 * @param {Function} [cb] Callback
	 * @private
	 */
	function sendAfterClose(websocket, data, cb) {
	  if (data) {
	    const length = toBuffer(data).length;

	    //
	    // The `_bufferedAmount` property is used only when the peer is a client and
	    // the opening handshake fails. Under these circumstances, in fact, the
	    // `setSocket()` method is not called, so the `_socket` and `_sender`
	    // properties are set to `null`.
	    //
	    if (websocket._socket) websocket._sender._bufferedBytes += length;
	    else websocket._bufferedAmount += length;
	  }

	  if (cb) {
	    const err = new Error(
	      `WebSocket is not open: readyState ${websocket.readyState} ` +
	        `(${readyStates[websocket.readyState]})`
	    );
	    process.nextTick(cb, err);
	  }
	}

	/**
	 * The listener of the `Receiver` `'conclude'` event.
	 *
	 * @param {Number} code The status code
	 * @param {Buffer} reason The reason for closing
	 * @private
	 */
	function receiverOnConclude(code, reason) {
	  const websocket = this[kWebSocket];

	  websocket._closeFrameReceived = true;
	  websocket._closeMessage = reason;
	  websocket._closeCode = code;

	  if (websocket._socket[kWebSocket] === undefined) return;

	  websocket._socket.removeListener('data', socketOnData);
	  process.nextTick(resume, websocket._socket);

	  if (code === 1005) websocket.close();
	  else websocket.close(code, reason);
	}

	/**
	 * The listener of the `Receiver` `'drain'` event.
	 *
	 * @private
	 */
	function receiverOnDrain() {
	  const websocket = this[kWebSocket];

	  if (!websocket.isPaused) websocket._socket.resume();
	}

	/**
	 * The listener of the `Receiver` `'error'` event.
	 *
	 * @param {(RangeError|Error)} err The emitted error
	 * @private
	 */
	function receiverOnError(err) {
	  const websocket = this[kWebSocket];

	  if (websocket._socket[kWebSocket] !== undefined) {
	    websocket._socket.removeListener('data', socketOnData);

	    //
	    // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
	    // https://github.com/websockets/ws/issues/1940.
	    //
	    process.nextTick(resume, websocket._socket);

	    websocket.close(err[kStatusCode]);
	  }

	  websocket.emit('error', err);
	}

	/**
	 * The listener of the `Receiver` `'finish'` event.
	 *
	 * @private
	 */
	function receiverOnFinish() {
	  this[kWebSocket].emitClose();
	}

	/**
	 * The listener of the `Receiver` `'message'` event.
	 *
	 * @param {Buffer|ArrayBuffer|Buffer[])} data The message
	 * @param {Boolean} isBinary Specifies whether the message is binary or not
	 * @private
	 */
	function receiverOnMessage(data, isBinary) {
	  this[kWebSocket].emit('message', data, isBinary);
	}

	/**
	 * The listener of the `Receiver` `'ping'` event.
	 *
	 * @param {Buffer} data The data included in the ping frame
	 * @private
	 */
	function receiverOnPing(data) {
	  const websocket = this[kWebSocket];

	  websocket.pong(data, !websocket._isServer, NOOP);
	  websocket.emit('ping', data);
	}

	/**
	 * The listener of the `Receiver` `'pong'` event.
	 *
	 * @param {Buffer} data The data included in the pong frame
	 * @private
	 */
	function receiverOnPong(data) {
	  this[kWebSocket].emit('pong', data);
	}

	/**
	 * Resume a readable stream
	 *
	 * @param {Readable} stream The readable stream
	 * @private
	 */
	function resume(stream) {
	  stream.resume();
	}

	/**
	 * The listener of the socket `'close'` event.
	 *
	 * @private
	 */
	function socketOnClose() {
	  const websocket = this[kWebSocket];

	  this.removeListener('close', socketOnClose);
	  this.removeListener('data', socketOnData);
	  this.removeListener('end', socketOnEnd);

	  websocket._readyState = WebSocket.CLOSING;

	  let chunk;

	  //
	  // The close frame might not have been received or the `'end'` event emitted,
	  // for example, if the socket was destroyed due to an error. Ensure that the
	  // `receiver` stream is closed after writing any remaining buffered data to
	  // it. If the readable side of the socket is in flowing mode then there is no
	  // buffered data as everything has been already written and `readable.read()`
	  // will return `null`. If instead, the socket is paused, any possible buffered
	  // data will be read as a single chunk.
	  //
	  if (
	    !this._readableState.endEmitted &&
	    !websocket._closeFrameReceived &&
	    !websocket._receiver._writableState.errorEmitted &&
	    (chunk = websocket._socket.read()) !== null
	  ) {
	    websocket._receiver.write(chunk);
	  }

	  websocket._receiver.end();

	  this[kWebSocket] = undefined;

	  clearTimeout(websocket._closeTimer);

	  if (
	    websocket._receiver._writableState.finished ||
	    websocket._receiver._writableState.errorEmitted
	  ) {
	    websocket.emitClose();
	  } else {
	    websocket._receiver.on('error', receiverOnFinish);
	    websocket._receiver.on('finish', receiverOnFinish);
	  }
	}

	/**
	 * The listener of the socket `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function socketOnData(chunk) {
	  if (!this[kWebSocket]._receiver.write(chunk)) {
	    this.pause();
	  }
	}

	/**
	 * The listener of the socket `'end'` event.
	 *
	 * @private
	 */
	function socketOnEnd() {
	  const websocket = this[kWebSocket];

	  websocket._readyState = WebSocket.CLOSING;
	  websocket._receiver.end();
	  this.end();
	}

	/**
	 * The listener of the socket `'error'` event.
	 *
	 * @private
	 */
	function socketOnError() {
	  const websocket = this[kWebSocket];

	  this.removeListener('error', socketOnError);
	  this.on('error', NOOP);

	  if (websocket) {
	    websocket._readyState = WebSocket.CLOSING;
	    this.destroy();
	  }
	}
	return websocket;
}

var websocketExports = requireWebsocket();
var WebSocket = /*@__PURE__*/getDefaultExportFromCjs(websocketExports);

var subprotocol;
var hasRequiredSubprotocol;

function requireSubprotocol () {
	if (hasRequiredSubprotocol) return subprotocol;
	hasRequiredSubprotocol = 1;

	const { tokenChars } = requireValidation();

	/**
	 * Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
	 *
	 * @param {String} header The field value of the header
	 * @return {Set} The subprotocol names
	 * @public
	 */
	function parse(header) {
	  const protocols = new Set();
	  let start = -1;
	  let end = -1;
	  let i = 0;

	  for (i; i < header.length; i++) {
	    const code = header.charCodeAt(i);

	    if (end === -1 && tokenChars[code] === 1) {
	      if (start === -1) start = i;
	    } else if (
	      i !== 0 &&
	      (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
	    ) {
	      if (end === -1 && start !== -1) end = i;
	    } else if (code === 0x2c /* ',' */) {
	      if (start === -1) {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }

	      if (end === -1) end = i;

	      const protocol = header.slice(start, end);

	      if (protocols.has(protocol)) {
	        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
	      }

	      protocols.add(protocol);
	      start = end = -1;
	    } else {
	      throw new SyntaxError(`Unexpected character at index ${i}`);
	    }
	  }

	  if (start === -1 || end !== -1) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  const protocol = header.slice(start, i);

	  if (protocols.has(protocol)) {
	    throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
	  }

	  protocols.add(protocol);
	  return protocols;
	}

	subprotocol = { parse };
	return subprotocol;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex$" }] */

var websocketServer;
var hasRequiredWebsocketServer;

function requireWebsocketServer () {
	if (hasRequiredWebsocketServer) return websocketServer;
	hasRequiredWebsocketServer = 1;

	const EventEmitter = require$$0$3;
	const http = require$$2;
	const { createHash } = require$$1;

	const extension = requireExtension();
	const PerMessageDeflate = requirePermessageDeflate();
	const subprotocol = requireSubprotocol();
	const WebSocket = requireWebsocket();
	const { GUID, kWebSocket } = requireConstants();

	const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

	const RUNNING = 0;
	const CLOSING = 1;
	const CLOSED = 2;

	/**
	 * Class representing a WebSocket server.
	 *
	 * @extends EventEmitter
	 */
	class WebSocketServer extends EventEmitter {
	  /**
	   * Create a `WebSocketServer` instance.
	   *
	   * @param {Object} options Configuration options
	   * @param {Number} [options.backlog=511] The maximum length of the queue of
	   *     pending connections
	   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
	   *     track clients
	   * @param {Function} [options.handleProtocols] A hook to handle protocols
	   * @param {String} [options.host] The hostname where to bind the server
	   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	   *     size
	   * @param {Boolean} [options.noServer=false] Enable no server mode
	   * @param {String} [options.path] Accept only connections matching this path
	   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
	   *     permessage-deflate
	   * @param {Number} [options.port] The port where to bind the server
	   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
	   *     server to use
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   * @param {Function} [options.verifyClient] A hook to reject connections
	   * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
	   *     class to use. It must be the `WebSocket` class or class that extends it
	   * @param {Function} [callback] A listener for the `listening` event
	   */
	  constructor(options, callback) {
	    super();

	    options = {
	      maxPayload: 100 * 1024 * 1024,
	      skipUTF8Validation: false,
	      perMessageDeflate: false,
	      handleProtocols: null,
	      clientTracking: true,
	      verifyClient: null,
	      noServer: false,
	      backlog: null, // use default (511 as implemented in net.js)
	      server: null,
	      host: null,
	      path: null,
	      port: null,
	      WebSocket,
	      ...options
	    };

	    if (
	      (options.port == null && !options.server && !options.noServer) ||
	      (options.port != null && (options.server || options.noServer)) ||
	      (options.server && options.noServer)
	    ) {
	      throw new TypeError(
	        'One and only one of the "port", "server", or "noServer" options ' +
	          'must be specified'
	      );
	    }

	    if (options.port != null) {
	      this._server = http.createServer((req, res) => {
	        const body = http.STATUS_CODES[426];

	        res.writeHead(426, {
	          'Content-Length': body.length,
	          'Content-Type': 'text/plain'
	        });
	        res.end(body);
	      });
	      this._server.listen(
	        options.port,
	        options.host,
	        options.backlog,
	        callback
	      );
	    } else if (options.server) {
	      this._server = options.server;
	    }

	    if (this._server) {
	      const emitConnection = this.emit.bind(this, 'connection');

	      this._removeListeners = addListeners(this._server, {
	        listening: this.emit.bind(this, 'listening'),
	        error: this.emit.bind(this, 'error'),
	        upgrade: (req, socket, head) => {
	          this.handleUpgrade(req, socket, head, emitConnection);
	        }
	      });
	    }

	    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
	    if (options.clientTracking) {
	      this.clients = new Set();
	      this._shouldEmitClose = false;
	    }

	    this.options = options;
	    this._state = RUNNING;
	  }

	  /**
	   * Returns the bound address, the address family name, and port of the server
	   * as reported by the operating system if listening on an IP socket.
	   * If the server is listening on a pipe or UNIX domain socket, the name is
	   * returned as a string.
	   *
	   * @return {(Object|String|null)} The address of the server
	   * @public
	   */
	  address() {
	    if (this.options.noServer) {
	      throw new Error('The server is operating in "noServer" mode');
	    }

	    if (!this._server) return null;
	    return this._server.address();
	  }

	  /**
	   * Stop the server from accepting new connections and emit the `'close'` event
	   * when all existing connections are closed.
	   *
	   * @param {Function} [cb] A one-time listener for the `'close'` event
	   * @public
	   */
	  close(cb) {
	    if (this._state === CLOSED) {
	      if (cb) {
	        this.once('close', () => {
	          cb(new Error('The server is not running'));
	        });
	      }

	      process.nextTick(emitClose, this);
	      return;
	    }

	    if (cb) this.once('close', cb);

	    if (this._state === CLOSING) return;
	    this._state = CLOSING;

	    if (this.options.noServer || this.options.server) {
	      if (this._server) {
	        this._removeListeners();
	        this._removeListeners = this._server = null;
	      }

	      if (this.clients) {
	        if (!this.clients.size) {
	          process.nextTick(emitClose, this);
	        } else {
	          this._shouldEmitClose = true;
	        }
	      } else {
	        process.nextTick(emitClose, this);
	      }
	    } else {
	      const server = this._server;

	      this._removeListeners();
	      this._removeListeners = this._server = null;

	      //
	      // The HTTP/S server was created internally. Close it, and rely on its
	      // `'close'` event.
	      //
	      server.close(() => {
	        emitClose(this);
	      });
	    }
	  }

	  /**
	   * See if a given request should be handled by this server instance.
	   *
	   * @param {http.IncomingMessage} req Request object to inspect
	   * @return {Boolean} `true` if the request is valid, else `false`
	   * @public
	   */
	  shouldHandle(req) {
	    if (this.options.path) {
	      const index = req.url.indexOf('?');
	      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

	      if (pathname !== this.options.path) return false;
	    }

	    return true;
	  }

	  /**
	   * Handle a HTTP Upgrade request.
	   *
	   * @param {http.IncomingMessage} req The request object
	   * @param {Duplex} socket The network socket between the server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @public
	   */
	  handleUpgrade(req, socket, head, cb) {
	    socket.on('error', socketOnError);

	    const key = req.headers['sec-websocket-key'];
	    const version = +req.headers['sec-websocket-version'];

	    if (req.method !== 'GET') {
	      const message = 'Invalid HTTP method';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
	      return;
	    }

	    if (req.headers.upgrade.toLowerCase() !== 'websocket') {
	      const message = 'Invalid Upgrade header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (!key || !keyRegex.test(key)) {
	      const message = 'Missing or invalid Sec-WebSocket-Key header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (version !== 8 && version !== 13) {
	      const message = 'Missing or invalid Sec-WebSocket-Version header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (!this.shouldHandle(req)) {
	      abortHandshake(socket, 400);
	      return;
	    }

	    const secWebSocketProtocol = req.headers['sec-websocket-protocol'];
	    let protocols = new Set();

	    if (secWebSocketProtocol !== undefined) {
	      try {
	        protocols = subprotocol.parse(secWebSocketProtocol);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Protocol header';
	        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	        return;
	      }
	    }

	    const secWebSocketExtensions = req.headers['sec-websocket-extensions'];
	    const extensions = {};

	    if (
	      this.options.perMessageDeflate &&
	      secWebSocketExtensions !== undefined
	    ) {
	      const perMessageDeflate = new PerMessageDeflate(
	        this.options.perMessageDeflate,
	        true,
	        this.options.maxPayload
	      );

	      try {
	        const offers = extension.parse(secWebSocketExtensions);

	        if (offers[PerMessageDeflate.extensionName]) {
	          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
	          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
	        }
	      } catch (err) {
	        const message =
	          'Invalid or unacceptable Sec-WebSocket-Extensions header';
	        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	        return;
	      }
	    }

	    //
	    // Optionally call external client verification handler.
	    //
	    if (this.options.verifyClient) {
	      const info = {
	        origin:
	          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
	        secure: !!(req.socket.authorized || req.socket.encrypted),
	        req
	      };

	      if (this.options.verifyClient.length === 2) {
	        this.options.verifyClient(info, (verified, code, message, headers) => {
	          if (!verified) {
	            return abortHandshake(socket, code || 401, message, headers);
	          }

	          this.completeUpgrade(
	            extensions,
	            key,
	            protocols,
	            req,
	            socket,
	            head,
	            cb
	          );
	        });
	        return;
	      }

	      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
	    }

	    this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
	  }

	  /**
	   * Upgrade the connection to WebSocket.
	   *
	   * @param {Object} extensions The accepted extensions
	   * @param {String} key The value of the `Sec-WebSocket-Key` header
	   * @param {Set} protocols The subprotocols
	   * @param {http.IncomingMessage} req The request object
	   * @param {Duplex} socket The network socket between the server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @throws {Error} If called more than once with the same socket
	   * @private
	   */
	  completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
	    //
	    // Destroy the socket if the client has already sent a FIN packet.
	    //
	    if (!socket.readable || !socket.writable) return socket.destroy();

	    if (socket[kWebSocket]) {
	      throw new Error(
	        'server.handleUpgrade() was called more than once with the same ' +
	          'socket, possibly due to a misconfiguration'
	      );
	    }

	    if (this._state > RUNNING) return abortHandshake(socket, 503);

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    const headers = [
	      'HTTP/1.1 101 Switching Protocols',
	      'Upgrade: websocket',
	      'Connection: Upgrade',
	      `Sec-WebSocket-Accept: ${digest}`
	    ];

	    const ws = new this.options.WebSocket(null);

	    if (protocols.size) {
	      //
	      // Optionally call external protocol selection handler.
	      //
	      const protocol = this.options.handleProtocols
	        ? this.options.handleProtocols(protocols, req)
	        : protocols.values().next().value;

	      if (protocol) {
	        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
	        ws._protocol = protocol;
	      }
	    }

	    if (extensions[PerMessageDeflate.extensionName]) {
	      const params = extensions[PerMessageDeflate.extensionName].params;
	      const value = extension.format({
	        [PerMessageDeflate.extensionName]: [params]
	      });
	      headers.push(`Sec-WebSocket-Extensions: ${value}`);
	      ws._extensions = extensions;
	    }

	    //
	    // Allow external modification/inspection of handshake headers.
	    //
	    this.emit('headers', headers, req);

	    socket.write(headers.concat('\r\n').join('\r\n'));
	    socket.removeListener('error', socketOnError);

	    ws.setSocket(socket, head, {
	      maxPayload: this.options.maxPayload,
	      skipUTF8Validation: this.options.skipUTF8Validation
	    });

	    if (this.clients) {
	      this.clients.add(ws);
	      ws.on('close', () => {
	        this.clients.delete(ws);

	        if (this._shouldEmitClose && !this.clients.size) {
	          process.nextTick(emitClose, this);
	        }
	      });
	    }

	    cb(ws, req);
	  }
	}

	websocketServer = WebSocketServer;

	/**
	 * Add event listeners on an `EventEmitter` using a map of <event, listener>
	 * pairs.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @param {Object.<String, Function>} map The listeners to add
	 * @return {Function} A function that will remove the added listeners when
	 *     called
	 * @private
	 */
	function addListeners(server, map) {
	  for (const event of Object.keys(map)) server.on(event, map[event]);

	  return function removeListeners() {
	    for (const event of Object.keys(map)) {
	      server.removeListener(event, map[event]);
	    }
	  };
	}

	/**
	 * Emit a `'close'` event on an `EventEmitter`.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @private
	 */
	function emitClose(server) {
	  server._state = CLOSED;
	  server.emit('close');
	}

	/**
	 * Handle socket errors.
	 *
	 * @private
	 */
	function socketOnError() {
	  this.destroy();
	}

	/**
	 * Close the connection when preconditions are not fulfilled.
	 *
	 * @param {Duplex} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} [message] The HTTP response body
	 * @param {Object} [headers] Additional HTTP response headers
	 * @private
	 */
	function abortHandshake(socket, code, message, headers) {
	  //
	  // The socket is writable unless the user destroyed or ended it before calling
	  // `server.handleUpgrade()` or in the `verifyClient` function, which is a user
	  // error. Handling this does not make much sense as the worst that can happen
	  // is that some of the data written by the user might be discarded due to the
	  // call to `socket.end()` below, which triggers an `'error'` event that in
	  // turn causes the socket to be destroyed.
	  //
	  message = message || http.STATUS_CODES[code];
	  headers = {
	    Connection: 'close',
	    'Content-Type': 'text/html',
	    'Content-Length': Buffer.byteLength(message),
	    ...headers
	  };

	  socket.once('finish', socket.destroy);

	  socket.end(
	    `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
	      Object.keys(headers)
	        .map((h) => `${h}: ${headers[h]}`)
	        .join('\r\n') +
	      '\r\n\r\n' +
	      message
	  );
	}

	/**
	 * Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
	 * one listener for it, otherwise call `abortHandshake()`.
	 *
	 * @param {WebSocketServer} server The WebSocket server
	 * @param {http.IncomingMessage} req The request object
	 * @param {Duplex} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} message The HTTP response body
	 * @private
	 */
	function abortHandshakeOrEmitwsClientError(server, req, socket, code, message) {
	  if (server.listenerCount('wsClientError')) {
	    const err = new Error(message);
	    Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);

	    server.emit('wsClientError', err, socket, req);
	  } else {
	    abortHandshake(socket, code, message);
	  }
	}
	return websocketServer;
}

requireWebsocketServer();

function createSocket(conf){
	return createSocket$1({
		...conf,
		impl: {
			WebSocket: ({ url }) => new WebSocket(url)
		}
	})
}

var e=new Map;function t(t){var o=e.get(t);o&&o.destroy();}function o(t){var o=e.get(t);o&&o.update();}var r=null;"undefined"==typeof window?((r=function(e){return e}).destroy=function(e){return e},r.update=function(e){return e}):((r=function(t,o){return t&&Array.prototype.forEach.call(t.length?t:[t],function(t){return function(t){if(t&&t.nodeName&&"TEXTAREA"===t.nodeName&&!e.has(t)){var o,r=null,n=window.getComputedStyle(t),i=(o=t.value,function(){a({testForHeightReduction:""===o||!t.value.startsWith(o),restoreTextAlign:null}),o=t.value;}),l=function(o){t.removeEventListener("autosize:destroy",l),t.removeEventListener("autosize:update",s),t.removeEventListener("input",i),window.removeEventListener("resize",s),Object.keys(o).forEach(function(e){return t.style[e]=o[e]}),e.delete(t);}.bind(t,{height:t.style.height,resize:t.style.resize,textAlign:t.style.textAlign,overflowY:t.style.overflowY,overflowX:t.style.overflowX,wordWrap:t.style.wordWrap});t.addEventListener("autosize:destroy",l),t.addEventListener("autosize:update",s),t.addEventListener("input",i),window.addEventListener("resize",s),t.style.overflowX="hidden",t.style.wordWrap="break-word",e.set(t,{destroy:l,update:s}),s();}function a(e){var o,i,l=e.restoreTextAlign,s=void 0===l?null:l,d=e.testForHeightReduction,u=void 0===d||d,c=n.overflowY;if(0!==t.scrollHeight&&("vertical"===n.resize?t.style.resize="none":"both"===n.resize&&(t.style.resize="horizontal"),u&&(o=function(e){for(var t=[];e&&e.parentNode&&e.parentNode instanceof Element;)e.parentNode.scrollTop&&t.push([e.parentNode,e.parentNode.scrollTop]),e=e.parentNode;return function(){return t.forEach(function(e){var t=e[0],o=e[1];t.style.scrollBehavior="auto",t.scrollTop=o,t.style.scrollBehavior=null;})}}(t),t.style.height=""),i="content-box"===n.boxSizing?t.scrollHeight-(parseFloat(n.paddingTop)+parseFloat(n.paddingBottom)):t.scrollHeight+parseFloat(n.borderTopWidth)+parseFloat(n.borderBottomWidth),"none"!==n.maxHeight&&i>parseFloat(n.maxHeight)?("hidden"===n.overflowY&&(t.style.overflow="scroll"),i=parseFloat(n.maxHeight)):"hidden"!==n.overflowY&&(t.style.overflow="hidden"),t.style.height=i+"px",s&&(t.style.textAlign=s),o&&o(),r!==i&&(t.dispatchEvent(new Event("autosize:resized",{bubbles:!0})),r=i),c!==n.overflow&&!s)){var v=n.textAlign;"hidden"===n.overflow&&(t.style.textAlign="start"===v?"end":"start"),a({restoreTextAlign:v,testForHeightReduction:!0});}}function s(){a({testForHeightReduction:!0,restoreTextAlign:null});}}(t)}),t}).destroy=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],t),e},r.update=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],o),e});var n=r;

n.update;
n.destroy;

const css$i = {
  code: ".spinner.svelte-dw16et.svelte-dw16et{display:inline-block;transform:translateZ(1px);position:relative;width:18px;height:18px;margin-right:15px}.spinner.svelte-dw16et>div.svelte-dw16et{display:inline-block;position:absolute;top:0;left:0;width:18px;height:18px;border-radius:50%;background:#34E5B0;animation:svelte-dw16et-lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite}@keyframes svelte-dw16et-lds-circle{0%,100%{animation-timing-function:cubic-bezier(0.5, 0, 1, 0.5)}0%{transform:rotateY(0deg)}50%{transform:rotateY(1800deg);animation-timing-function:cubic-bezier(0, 0.5, 0.5, 1)}100%{transform:rotateY(3600deg)}}",
  map: null
};
const Spinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$i);
  return `<div class="spinner svelte-dw16et" data-svelte-h="svelte-f0erjv"><div class="svelte-dw16et"></div> </div>`;
});
const Logo_small = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="52" height="49" viewBox="0 0 52 49" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35.8098" cy="32.3772" r="14.1887" stroke="#FEFEFE" stroke-width="4"></circle><circle cx="26.0012" cy="16.1887" r="14.1887" stroke="#FEFEFE" stroke-width="4"></circle><circle cx="16.1887" cy="32.3772" r="14.1887" stroke="#FEFEFE" stroke-width="4"></circle></svg>`;
});
const visibleModals = writable({
  taskInfo: false,
  taskInstructions: false,
  taskSolution: false,
  taskFinished: false
});
const unseenContent = writable({
  taskInfo: true,
  taskInstructions: true,
  taskSolution: true
});
const lastFinishedTask = writable(1);
const connectionState = writable();
const userMeta = writable();
const users = writable([]);
const chats = writable([]);
const currentChat = writable();
const currentTask = writable();
const answers = writable([]);
const solutionAcceptance = writable([]);
const hiddenChats = writable([]);
const seenChatMessages = writable([]);
let socket;
let allChats;
function connect({ url }) {
  socket = createSocket({ url });
  socket.on("connect", () => {
    console.log("connection to backend established");
    connectionState.set("connected");
  });
  socket.on("disconnect", () => {
    console.warn("connection to backend lost");
    connectionState.set("lost");
  });
  socket.on("task", ({ task }) => {
    if (!task) {
      goto("/thank-you");
      return;
    }
    currentTask.set(task);
  });
  socket.on("task-complete", () => {
    lastFinishedTask.set(get_store_value(currentTask).number);
    visibleModals.update(
      (visible) => ({
        ...visible,
        taskSolution: false,
        taskFinished: true
      })
    );
    unseenContent.set({
      taskInfo: true,
      taskInstructions: true,
      taskSolution: true
    });
  });
  socket.on("user", ({ user }) => {
    userMeta.set(user);
  });
  socket.on("users", ({ users: u }) => {
    users.set(u);
  });
  socket.on("chats", ({ chats: c }) => {
    allChats = c;
    c = c.filter((c2) => !shouldHideChat(c2));
    chats.set(c);
    currentChat.update(
      (current) => current ? current.id ? c.find((c2) => c2.id === get_store_value(currentChat).id) || c[0] : c[c.length - 1] : c[0]
    );
  });
  socket.on("chat", ({ chat }) => {
    allChats = allChats.map((c) => c.id === chat.id ? chat : c);
    if (shouldHideChat(chat))
      return;
    chats.update(
      (chats2) => allChats.filter(
        (c) => !shouldHideChat(c)
      )
    );
    if (get_store_value(currentChat)?.id === chat.id)
      currentChat.set(chat);
  });
  socket.on("answers", ({ answers: a }) => {
    answers.set(a);
  });
  socket.on("acceptance", ({ acceptance }) => {
    solutionAcceptance.set(acceptance);
  });
}
function getChatUnseenMessages(chat) {
  let seen = get_store_value(seenChatMessages).find(
    (seen2) => seen2.id === chat.id
  );
  if (!seen)
    seen = { count: 1 };
  return chat.messages.length - seen.count;
}
function markChatSeen(chat) {
  seenChatMessages.update(
    (seen) => [
      ...seen.filter(({ id }) => id !== chat.id),
      { id: chat.id, count: chat.messages.length }
    ]
  );
  flushLocalStorage();
}
function shouldHideChat(chat) {
  if (get_store_value(hiddenChats).includes(chat.id)) {
    if (getChatUnseenMessages(chat) <= 0)
      return true;
  }
  hiddenChats.update(
    (hidden) => hidden.filter(
      (id) => id !== chat.id
    )
  );
  return false;
}
function loadLocalStorage() {
  hiddenChats.set(readLocalStorage("hiddenChats") || []);
  seenChatMessages.set(readLocalStorage("seenChatMessages") || []);
}
function flushLocalStorage() {
  writeLocalStorage("hiddenChats", get_store_value(hiddenChats));
  writeLocalStorage("seenChatMessages", get_store_value(seenChatMessages));
}
function readLocalStorage(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch {
    return null;
  }
}
function writeLocalStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
loadLocalStorage();
const css$h = {
  code: '.background-container-header.svelte-1ib1j8y.svelte-1ib1j8y{display:flex}.container-header.svelte-1ib1j8y.svelte-1ib1j8y{display:flex;width:100%;height:auto;padding:15px}.header.svelte-1ib1j8y.svelte-1ib1j8y{display:flex;width:100%;height:auto;align-items:center}.task-header.svelte-1ib1j8y.svelte-1ib1j8y{display:flex;margin-left:25px;font-size:large;font-family:"Ubuntu Bold";color:#9ca4a9}.righthand.svelte-1ib1j8y.svelte-1ib1j8y{display:flex;align-items:center;gap:10px;margin-left:auto}.online.svelte-1ib1j8y.svelte-1ib1j8y{display:flex;gap:5px}.online.svelte-1ib1j8y .bubble.svelte-1ib1j8y{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:100px;background-color:#191E49;color:#4F87DB;font-size:12px;cursor:default}.participant-info.svelte-1ib1j8y.svelte-1ib1j8y{display:flex;flex-direction:column;gap:7px;min-height:65px}.participant-info-name.svelte-1ib1j8y.svelte-1ib1j8y{display:flex;color:#9ca4a9;gap:5px}.time-and-date.svelte-1ib1j8y.svelte-1ib1j8y{display:flex;align-self:flex-end}.assigned-group.svelte-1ib1j8y.svelte-1ib1j8y{display:flex;align-self:center;font-size:11px;background-color:#191E49;color:#4F87DB;border-radius:100px;padding:6px 10px;margin-bottom:-4px}',
  map: null
};
const Main_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentTask, $$unsubscribe_currentTask;
  let $users, $$unsubscribe_users;
  let $userMeta, $$unsubscribe_userMeta;
  $$unsubscribe_currentTask = subscribe(currentTask, (value) => $currentTask = value);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  $$unsubscribe_userMeta = subscribe(userMeta, (value) => $userMeta = value);
  let time;
  $$result.css.add(css$h);
  $$unsubscribe_currentTask();
  $$unsubscribe_users();
  $$unsubscribe_userMeta();
  return `<div class="background-container-header svelte-1ib1j8y"><div class="container-header svelte-1ib1j8y"><div class="header svelte-1ib1j8y"><div class="logo">${validate_component(Logo_small, "LogoSmall").$$render($$result, {}, {}, {})}</div> <div class="task-header svelte-1ib1j8y">${$currentTask?.number === 1 ? `Task 1: Product / Service innovation for elderly` : `${$currentTask?.number === 2 ? `Task 2: Business Model innovation regarding autonomous driving` : `Loading Task ...`}`}</div> <div class="righthand svelte-1ib1j8y"><div class="online svelte-1ib1j8y">${each($users, (user) => {
    return `<div class="bubble svelte-1ib1j8y"${add_attribute("title", `${user.firstName} ${user.lastName}`, 0)}>${escape(user.firstName.slice(0, 1).toUpperCase() + user.lastName.slice(0, 1).toUpperCase())} </div>`;
  })}</div> <div class="participant-info svelte-1ib1j8y"><div class="participant-info-name svelte-1ib1j8y">${$userMeta ? `<div class="name">${escape($userMeta.firstName)}</div> <div class="surname">${escape($userMeta.lastName)}</div> <div class="id">#${escape($userMeta.id)}</div>` : `<div class="name" data-svelte-h="svelte-123bo8j">name</div> <div class="surname" data-svelte-h="svelte-1cj05hl">surname</div> <div class="id" data-svelte-h="svelte-v3be68">#id</div>`}</div> <div class="time-and-date svelte-1ib1j8y">${escape(time)}</div> <div class="assigned-group svelte-1ib1j8y">${escape($userMeta?.team?.name)}</div></div></div></div></div> </div>`;
});
const Connection_lost = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.3281 20.6592C23.0703 20.6592 25.2324 18.6465 25.2324 16.1328C25.2324 14.2607 24.1689 12.5996 22.4199 11.8701C22.4287 7.89746 19.5635 5.03223 15.8809 5.03223C13.543 5.03223 11.7852 6.23633 10.6865 7.83594C8.4541 7.23828 6.10742 8.89941 6.01953 11.3779C4.00684 11.7383 2.76758 13.54 2.76758 15.7461C2.76758 18.418 5.10547 20.6504 8.18164 20.6504L20.3281 20.6592ZM20.3281 18.9014H8.19043C6.09863 18.9014 4.54297 17.4424 4.54297 15.7461C4.54297 13.9883 5.62402 12.6875 7.41699 12.6875C7.54883 12.6875 7.60156 12.6172 7.59277 12.4941C7.54004 9.88379 9.41211 8.9873 11.3018 9.58496C11.416 9.62012 11.4863 9.59375 11.5391 9.49707C12.4092 7.96777 13.6924 6.78125 15.8721 6.78125C18.6318 6.78125 20.6006 8.96973 20.7324 11.5273C20.7588 12.002 20.7236 12.5117 20.6885 12.9336C20.6709 13.0566 20.7236 13.127 20.8379 13.1445C22.4287 13.4521 23.457 14.5771 23.457 16.1328C23.457 17.6709 22.0947 18.9014 20.3281 18.9014ZM14.0088 14.4541C14.4658 14.4541 14.7207 14.1992 14.7471 13.707L14.8701 10.7539C14.8965 10.2441 14.5098 9.88379 14 9.88379C13.4814 9.88379 13.1123 10.2354 13.1387 10.7539L13.2529 13.7158C13.2793 14.1904 13.5342 14.4541 14.0088 14.4541ZM14 17.2402C14.5537 17.2402 14.9932 16.8447 14.9932 16.3174C14.9932 15.7725 14.5625 15.3857 14 15.3857C13.4375 15.3857 13.0068 15.7812 13.0068 16.3174C13.0068 16.8447 13.4463 17.2402 14 17.2402Z" fill="#FF7878"></path></svg>`;
});
const css$g = {
  code: ".warning-modal.svelte-90w2kp{display:block;position:absolute;z-index:1000;left:0;top:0;width:100%;height:100%;overflow:hidden;background:#12121280;border-bottom-left-radius:30px;border-bottom-right-radius:30px;justify-content:center;align-items:center}.connection-warning-container.svelte-90w2kp{display:flex;position:relative;top:7%;left:45%;width:fit-content;height:44px;background-color:#300F0F90;align-items:center;color:#FF7878;justify-content:center;border-radius:22px;align-self:center;padding:15px;box-sizing:border-box}.connection-warning.svelte-90w2kp{display:flex;align-items:center;gap:10px}",
  map: null
};
const Connection_warning = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let message = "connection lost";
  let currentIcon = Connection_lost;
  onDestroy(() => {
  });
  $$result.css.add(css$g);
  return `<div class="warning-modal svelte-90w2kp"><div class="connection-warning-container svelte-90w2kp"><div class="connection-warning svelte-90w2kp">${validate_component(currentIcon || missing_component, "svelte:component").$$render($$result, {}, {}, {})} <p>${escape(message)}</p></div></div> </div>`;
});
const Minimize_task_info24px = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="37" height="24" viewBox="0 0 37 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.0216 11H26.1986C27.0333 11 27.7163 11.45 27.7163 12C27.7163 12.55 27.0333 13 26.1986 13H11.0216C10.1869 13 9.50391 12.55 9.50391 12C9.50391 11.45 10.1869 11 11.0216 11Z" fill="#D3D3D3"></path></svg>`;
});
const css$f = {
  code: '.modal.svelte-j0t3ms.svelte-j0t3ms.svelte-j0t3ms{display:block;position:absolute;z-index:1000;left:0;top:0;width:100%;height:100%;overflow:hidden;background:rgba(18, 18, 18, 0.5019607843)}.modal.svelte-j0t3ms>.window.svelte-j0t3ms.svelte-j0t3ms{display:flex;flex-direction:column;position:relative;background-color:#505050;margin:5% auto;padding:20px;border-radius:10px;width:600px;color:#CCCCCC;word-break:normal;font-size:16px}.modal.svelte-j0t3ms>.window.svelte-j0t3ms>.title.svelte-j0t3ms{display:flex;font-size:24px;font-family:"Ubuntu Bold"}.modal.svelte-j0t3ms>.window.svelte-j0t3ms>.close-button.svelte-j0t3ms{display:flex;color:#CCCCCC;float:right;font-size:24px;font-weight:bold;margin-left:auto;cursor:pointer}.modal.svelte-j0t3ms>.window.svelte-j0t3ms>.close-button.svelte-j0t3ms:active{opacity:0.75}',
  map: null
};
const Modal_task_info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_visibleModals;
  let $currentTask, $$unsubscribe_currentTask;
  $$unsubscribe_visibleModals = subscribe(visibleModals, (value) => value);
  $$unsubscribe_currentTask = subscribe(currentTask, (value) => $currentTask = value);
  $$result.css.add(css$f);
  $$unsubscribe_visibleModals();
  $$unsubscribe_currentTask();
  return `<div class="modal svelte-j0t3ms"><div class="window svelte-j0t3ms"><div class="close-button svelte-j0t3ms">${validate_component(Minimize_task_info24px, "MinimizeTaskInfo").$$render($$result, {}, {}, {})}</div> <div class="title svelte-j0t3ms" data-svelte-h="svelte-130gcer">Information</div> ${$currentTask?.number === 1 ? `<div class="info1" data-svelte-h="svelte-1iaw9il"><p>There&#39;s been a significant increase in the global aging population. The world will see the numbers from people aged 60 or older grow from 761 million today to 1.6 billion in 2050. Likewise, the population aged 80 years and older will also grow exponentially. With it, there are serious health issues, such as chronic illnesses and mobility-related accidents, that need to be addressed. At the same time, there is a rising demand for innovative products and services to help seniors maintain quality of life, be more independent, and have a societal connection. The market for healthcare solutions targeting seniors is in its infancy, with ample room for growth and innovative breakthroughs. Your task is to tap into this potential.
				<br> <br>
				Now keep in mind that the older community faces a myriad of healthcare obstacles, including chronic diseases, mobility hurdles, and cognitive degeneration. The better the solutions we can create to address these, the more we can enhance seniors&#39; living standards. With technological advancements in wearable devices, telehealth services, and remote monitoring systems, healthcare for the elderly can be transformed and improved. These innovative possibilities push the boundaries of more accessible care, early health issue detection, and better monitoring.</p></div>` : `${$currentTask?.number === 2 ? `<div class="info2" data-svelte-h="svelte-pux3lw"><p>The transportation sector is on the brink of a major revolution with the introduction of autonomous vehicles. This shift goes beyond traditional car manufacturers and includes technology companies, startups, and service providers, all of whom have the potential to transform the industry with new business models centered around autonomous driving technologies.
				Cloud-based computational technologies are playing an increasingly significant role in this transformation, providing immense storage capacities and powerful processing capabilities to support autonomous systems. When combined with artificial intelligence, these technologies enable vehicles to learn, make real-time decisions, and adapt to their surroundings.
				<br> <br>
				The shift to autonomous driving creates opportunities for innovative business models, such as Mobility as a Service (MaaS) and shared ownership. Eliminating the need for parking opens up space for revenue generation. In-car entertainment and productivity services can enhance the travel experience. Autonomous delivery services and insurance models may also evolve. Infrastructure upgrades will be necessary for communication and data-sharing systems.</p></div>` : `Loading task info ...`}`}</div> </div>`;
});
const Minimize_task_24px = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="37" height="24" viewBox="0 0 37 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.0216 11H26.1986C27.0333 11 27.7163 11.45 27.7163 12C27.7163 12.55 27.0333 13 26.1986 13H11.0216C10.1869 13 9.50391 12.55 9.50391 12C9.50391 11.45 10.1869 11 11.0216 11Z" fill="#0085FF"></path></svg>`;
});
const css$e = {
  code: '.modal.svelte-kim6qc.svelte-kim6qc.svelte-kim6qc{display:block;position:absolute;z-index:1000;left:0;top:0;width:100%;height:100%;overflow:hidden;background:rgba(18, 18, 18, 0.5019607843)}.modal.svelte-kim6qc>.window.svelte-kim6qc.svelte-kim6qc{display:flex;flex-direction:column;position:relative;background-color:#00274A;color:#99CEFF;margin:5% auto;padding:20px;border-radius:10px;width:600px;font-size:16px}.modal.svelte-kim6qc>.window.svelte-kim6qc>.title.svelte-kim6qc{display:flex;font-size:24px;font-family:"Ubuntu Bold"}.modal.svelte-kim6qc>.window.svelte-kim6qc>.close-button.svelte-kim6qc{display:flex;color:#aaa;float:right;font-size:24px;font-weight:bold;margin-left:auto;cursor:pointer}.modal.svelte-kim6qc>.window.svelte-kim6qc>.close-button.svelte-kim6qc:active{opacity:0.75}',
  map: null
};
const Modal_task_instructions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_visibleModals;
  let $currentTask, $$unsubscribe_currentTask;
  $$unsubscribe_visibleModals = subscribe(visibleModals, (value) => value);
  $$unsubscribe_currentTask = subscribe(currentTask, (value) => $currentTask = value);
  $$result.css.add(css$e);
  $$unsubscribe_visibleModals();
  $$unsubscribe_currentTask();
  return `<div class="modal svelte-kim6qc"><div class="window svelte-kim6qc"><div class="close-button svelte-kim6qc">${validate_component(Minimize_task_24px, "MinimizeTask").$$render($$result, {}, {}, {})}</div> <div class="title svelte-kim6qc" data-svelte-h="svelte-1o08njg">Task</div> ${$currentTask?.number === 1 ? `<div class="task1" data-svelte-h="svelte-vzcy87"><p>You are tasked with either <span style="font-family: 'Ubuntu Bold';color: #C7E4FF;">developing an entirely new product or service or improving an existing one to meet elderly&#39;s healthcare needs.</span> Whether it makes healthcare more reachable, mitigates the risk of accidents, or enhances their overall life quality further, that&#39;s up to your innovation.<br> <br><br>1. <span style="font-family: 'Ubuntu Bold';color: #C7E4FF;">Identify the Problem or Need</span><br> What specific healthcare problem or need does the elderly population currently face? Your goal in this subtask is to identify the gaps in the current healthcare system targeting this demography. What are major areas of concern that have not been adequately addressed? Define them clearly and concisely.
				<br><br>2. <span style="font-family: 'Ubuntu Bold';color: #C7E4FF;">Define Your Solution Design</span><br>Based on the identified problem or need, what&#39;s your solution? Whether it&#39;s a novel product or service innovation or a significant improvement of an existing one, what will it look like? Describe your proposed solution, how it works, and why it will be useful. 
				<br><br>3. <span style="font-family: 'Ubuntu Bold';color: #C7E4FF;">Market Analysis and Target Audience</span><br> Who are your potential customers? You need to identify your target market. What is the size of this market, and who are the key competitors? Describe your target audience&#39;s demographics, needs, and problems, including any unique aspects.
				<br><br>4. <span style="font-family: 'Ubuntu Bold';color: #C7E4FF;">Unique Value Proposition and Competitive Advantage </span><br>  What is your product/service&#39;s unique advantage over the competition? What makes your solution uniquely suited to the problem or need you&#39;ve identified for this specific demographic? Explain how your solution creates value sustainably and how you will keep this edge over the future competitors that can emerge within the market.</p></div>` : `${$currentTask?.number === 2 ? `<div class="task2" data-svelte-h="svelte-29yr8x"><p>Your task is to <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">develop an innovative business model that takes advantage of the opportunity presented by the described shift in the automotive industry towards autonomous vehicles.</span> The business model should not only offer unique value, but also demonstrate how it would generate revenue, satisfy customer needs and give your company a sustainable competitive advantage so other players can not just copy your idea.<br> <br><br>1. <span style="font-family: 'Ubuntu Bold';color: #C7E4FF;">Value Proposition (Core Offering and Unique Differentiator)</span><br> What is the unique value proposition of your new business model that capitalizes on the shift towards autonomous vehicles? What would your business offer that is different from what&#39;s already in the market? Consider the customer&#39;s perspective—what problem does your offering solve or what customer needs does it fulfill?
				<br><br>2. <span style="font-family: 'Ubuntu Bold';color: #C7E4FF;">Customer Segments and Relationships (Target Audience and Engagement)</span><br> Who are your target customers for this new business model? How do you plan to attract, retain, and deepen the relationship with these customers? How does your business model cater specifically to these customer segments?
				<br><br>3. <span style="font-family: 'Ubuntu Bold';color: #C7E4FF;">Key Resources, Activities, and Partnerships (Execution Plan)</span><br> What key resources and activities are required to deliver your value proposition? What partners will you need to collaborate with to execute your business model effectively?
				<br><br>4. <span style="font-family: 'Ubuntu Bold';color: #C7E4FF;">Revenue Streams and possible costs (Monetization Strategy)</span><br> How will your business model generate revenue? What is your pricing strategy? Will it have a one-time transaction, subscription model, or a mix? Consider the value customers will receive and how much they will be willing to pay for it. Outline the most important costs that need to be taken into account in the business model.</p></div>` : `Loading task instructions ...`}`}</div> </div>`;
});
const Close_green_24px = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.2987 5.70874C18.1119 5.52148 17.8583 5.41625 17.5938 5.41625C17.3292 5.41625 17.0756 5.52148 16.8888 5.70874L11.9988 10.5887L7.10875 5.69874C6.92192 5.51148 6.66827 5.40625 6.40375 5.40625C6.13923 5.40625 5.88558 5.51148 5.69875 5.69874C5.30875 6.08874 5.30875 6.71874 5.69875 7.10874L10.5887 11.9987L5.69875 16.8887C5.30875 17.2787 5.30875 17.9087 5.69875 18.2987C6.08875 18.6887 6.71875 18.6887 7.10875 18.2987L11.9988 13.4087L16.8888 18.2987C17.2788 18.6887 17.9087 18.6887 18.2987 18.2987C18.6887 17.9087 18.6887 17.2787 18.2987 16.8887L13.4087 11.9987L18.2987 7.10874C18.6787 6.72874 18.6787 6.08874 18.2987 5.70874Z" fill="#34E6B0"></path></svg>`;
});
const Check_circle_outline_18px = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM9 15C5.6925 15 3 12.3075 3 9C3 5.6925 5.6925 3 9 3C12.3075 3 15 5.6925 15 9C15 12.3075 12.3075 15 9 15ZM7.5 10.6275L11.91 6.2175C12.2025 5.925 12.6825 5.925 12.975 6.2175C13.2675 6.51 13.2675 6.9825 12.975 7.275L8.0325 12.2175C7.74 12.51 7.2675 12.51 6.975 12.2175L5.0325 10.275C4.74 9.9825 4.74 9.51 5.0325 9.2175C5.17262 9.07706 5.36286 8.99814 5.56125 8.99814C5.75964 8.99814 5.94988 9.07706 6.09 9.2175L7.5 10.6275Z" fill="#34E5B0"></path></svg>`;
});
const css$d = {
  code: '.accord.svelte-17mniwf.svelte-17mniwf{display:flex;justify-content:space-between;flex-shrink:0;align-items:center;cursor:pointer}.accord.svelte-17mniwf .title.svelte-17mniwf{font-size:16px;font-family:"Ubuntu Bold"}.accord.svelte-17mniwf .right.svelte-17mniwf{display:flex;align-items:center;font-size:11px;gap:5px}.accord.svelte-17mniwf .right .unsufficient.svelte-17mniwf{color:#FF7878}.accord.svelte-17mniwf .right .editor.svelte-17mniwf{display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:100px;background-color:#191E49;color:#4F87DB;font-size:10px;cursor:default;animation:svelte-17mniwf-blink 1.5s infinite linear}@keyframes svelte-17mniwf-blink{0%{opacity:1}50%{opacity:0}100%{opacity:1}}.accord.svelte-17mniwf .toggle.svelte-17mniwf{font-size:21px;width:25px;text-align:center;position:relative;top:-2px}textarea.svelte-17mniwf.svelte-17mniwf{flex-shrink:0;width:100%;background-color:#033129;border-radius:10px;padding-top:5px;padding-left:5px;padding-right:5px;box-sizing:border-box;outline:none;border:none;resize:vertical;color:#34E5B0}textarea.svelte-17mniwf.svelte-17mniwf:disabled{cursor:not-allowed}.too-short.svelte-17mniwf.svelte-17mniwf{display:flex;margin-top:5px;color:#FF7878;align-items:center;gap:5px}',
  map: null
};
const Answer_accord = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let words;
  let $$unsubscribe_userMeta;
  let $answers, $$unsubscribe_answers;
  $$unsubscribe_userMeta = subscribe(userMeta, (value) => value);
  $$unsubscribe_answers = subscribe(answers, (value) => $answers = value);
  let { question } = $$props;
  let { index } = $$props;
  let { minWords } = $$props;
  let inputText = $answers[index]?.text || "";
  if ($$props.question === void 0 && $$bindings.question && question !== void 0)
    $$bindings.question(question);
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.minWords === void 0 && $$bindings.minWords && minWords !== void 0)
    $$bindings.minWords(minWords);
  $$result.css.add(css$d);
  words = inputText.length > 0 ? inputText.split(/\s+/g).length : 0;
  $$unsubscribe_userMeta();
  $$unsubscribe_answers();
  return `<div class="accord svelte-17mniwf"><span class="title svelte-17mniwf">Question ${escape(index + 1)}: ${escape(question.title)}</span> <div class="right svelte-17mniwf">${``} <span class="${escape(null_to_empty(words < minWords && "unsufficient"), true) + " svelte-17mniwf"}">${escape(words)} / ${escape(minWords)} words</span> <div class="toggle svelte-17mniwf">${escape("+")}</div></div></div> ${``}`;
});
const css$c = {
  code: '.modal.svelte-104t7b5.svelte-104t7b5.svelte-104t7b5.svelte-104t7b5{display:block;position:absolute;z-index:1800;left:0;top:0;width:100%;height:100%;overflow:hidden;background:rgba(18, 18, 18, 0.5843137255)}.modal.svelte-104t7b5>.window.svelte-104t7b5.svelte-104t7b5.svelte-104t7b5{display:flex;flex-direction:column;position:relative;background-color:#004A3D;color:#34E5B0;margin:5% auto;padding:20px;border-radius:10px;width:515px}.modal.svelte-104t7b5>.window.svelte-104t7b5>.close.svelte-104t7b5.svelte-104t7b5{display:flex;margin-left:auto;cursor:pointer}.modal.svelte-104t7b5>.window.svelte-104t7b5>.label.svelte-104t7b5.svelte-104t7b5{display:flex;font-size:24px;align-self:center;margin-bottom:5px;font-family:"Ubuntu Bold"}.modal.svelte-104t7b5>.window.svelte-104t7b5>.subtitle.svelte-104t7b5.svelte-104t7b5{display:flex;text-align:center}.modal.svelte-104t7b5>.window.svelte-104t7b5>.questions.svelte-104t7b5.svelte-104t7b5{display:flex;width:100%;max-height:calc(100vh - 500px);overflow-y:auto;flex-direction:column;margin-top:15px;margin-bottom:5px;margin-left:-8px;margin-right:-8px;padding:10px 8px}.modal.svelte-104t7b5>.window.svelte-104t7b5>.questions.svelte-104t7b5>.line.svelte-104t7b5{display:flex;height:2px;width:100%;background-color:#2E7E66;margin-top:10px;margin-bottom:10px}.modal.svelte-104t7b5>.window.svelte-104t7b5>.questions.svelte-104t7b5.svelte-104t7b5::-webkit-scrollbar-corner{background:none}.modal.svelte-104t7b5>.window.svelte-104t7b5>.questions.svelte-104t7b5.svelte-104t7b5::-webkit-scrollbar{width:10px}.modal.svelte-104t7b5>.window.svelte-104t7b5>.questions.svelte-104t7b5.svelte-104t7b5::-webkit-scrollbar-track{background:none}.modal.svelte-104t7b5>.window.svelte-104t7b5>.questions.svelte-104t7b5.svelte-104t7b5::-webkit-scrollbar-thumb{background:#888;border-radius:10px}.modal.svelte-104t7b5>.window.svelte-104t7b5>.questions.svelte-104t7b5.svelte-104t7b5::-webkit-scrollbar-thumb:hover{background:#9ca4a9}.modal.svelte-104t7b5>.window.svelte-104t7b5>.acceptance.svelte-104t7b5.svelte-104t7b5{display:flex;justify-content:center;gap:8px}.modal.svelte-104t7b5>.window>.acceptance .bubble.svelte-104t7b5.svelte-104t7b5.svelte-104t7b5{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:100px;background-color:#4FDB8F;color:#004A3D;font-size:12px;cursor:default}.modal.svelte-104t7b5>.window>.acceptance .placeholder.svelte-104t7b5.svelte-104t7b5.svelte-104t7b5{width:30px;height:30px;border-radius:100px;border:dashed 1px #2eaf89}.modal.svelte-104t7b5>.window.svelte-104t7b5>.submit.svelte-104t7b5.svelte-104t7b5{display:flex;width:100%;height:44px;padding:15px;box-sizing:border-box;background:#34E5B0;color:#033129;align-self:center;margin-top:25px;border-radius:5px;cursor:pointer;align-items:center;gap:5px;justify-content:center}.modal.svelte-104t7b5>.window.svelte-104t7b5>.submit.svelte-104t7b5.svelte-104t7b5:active{opacity:0.7}.modal.svelte-104t7b5>.window.svelte-104t7b5>.submit.disabled.svelte-104t7b5.svelte-104t7b5{pointer-events:none;opacity:0.5}.modal.svelte-104t7b5>.window.svelte-104t7b5>.submitted.svelte-104t7b5.svelte-104t7b5{display:flex;width:100%;height:44px;padding:15px;box-sizing:border-box;background:transparent;color:#34E5B0;border:solid 1px #34E5B0;align-self:center;margin-top:25px;border-radius:5px;align-items:center;gap:5px;justify-content:center}',
  map: null
};
const minWordsPerAnswer = 30;
const Modal_task_solution = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let task;
  let submittable;
  let $answers, $$unsubscribe_answers;
  let $currentTask, $$unsubscribe_currentTask;
  let $$unsubscribe_visibleModals;
  let $users, $$unsubscribe_users;
  let $solutionAcceptance, $$unsubscribe_solutionAcceptance;
  let $userMeta, $$unsubscribe_userMeta;
  $$unsubscribe_answers = subscribe(answers, (value) => $answers = value);
  $$unsubscribe_currentTask = subscribe(currentTask, (value) => $currentTask = value);
  $$unsubscribe_visibleModals = subscribe(visibleModals, (value) => value);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  $$unsubscribe_solutionAcceptance = subscribe(solutionAcceptance, (value) => $solutionAcceptance = value);
  $$unsubscribe_userMeta = subscribe(userMeta, (value) => $userMeta = value);
  const tasks = [
    {
      nr: 1,
      questions: [
        {
          title: "Identify the Problem or Need",
          text: "What specific healthcare problem or need does the elderly population currently face? Your goal in this subtask is to identify the gaps in the current healthcare system targeting this demography. What are major areas of concern that have not been adequately addressed? Define them clearly and concisely."
        },
        {
          title: "Your Solution Design",
          text: "Based on the identified problem or need, what is your solution? Whether it is a novel product or service innovation or a significant improvement of an existing one, what will it look like? Describe your proposed solution, how it works, and why it will be useful."
        },
        {
          title: "Market Analysis and Target Audience",
          text: "Who are your potential customers? You need to identify your target market. What is the size of this market, and who are the key competitors? Describe your target audience is demographics, needs, and problems, including any unique aspects."
        },
        {
          title: "Unique Value Proposition",
          text: "What is your product/services unique advantage over the competition? What makes your solution uniquely suited to the problem or need you have identified for this specific demographic? Explain how your solution creates value sustainably and how you will keep this edge over the future competitors that can emerge within the market."
        }
      ]
    },
    {
      nr: 2,
      questions: [
        {
          title: "Value Proposition",
          text: "What is the unique value proposition of your new business model that capitalizes on the shift towards autonomous vehicles? What would your business offer that is different from what is already in the market? Consider the customer is perspective—what problem does your offering solve or what customer needs does it fulfill?"
        },
        {
          title: "Customer Segments and Relationships",
          text: "Who are your target customers for this new business model? How do you plan to attract, retain, and deepen the relationship with these customers? How does your business model cater specifically to these customer segments?"
        },
        {
          title: "Key Resources, Activities, and Partnerships",
          text: "What key resources and activities are required to deliver your value proposition? What partners will you need to collaborate with to execute your business model effectively?"
        },
        {
          title: "Revenue Streams and possible costs",
          text: "How will your business model generate revenue? What is your pricing strategy? Will it have a one-time transaction, subscription model, or a mix? Consider the value customers will receive and how much they will be willing to pay for it. Outline the most important costs that need to be taken into account in the business model."
        }
      ]
    }
  ];
  $$result.css.add(css$c);
  task = tasks.find((task2) => task2.nr === $currentTask.number);
  submittable = $answers.length == 4 && $answers.every((answer) => answer && answer.text.split(/\s+/g).length >= minWordsPerAnswer);
  $$unsubscribe_answers();
  $$unsubscribe_currentTask();
  $$unsubscribe_visibleModals();
  $$unsubscribe_users();
  $$unsubscribe_solutionAcceptance();
  $$unsubscribe_userMeta();
  return `<div class="modal svelte-104t7b5"><div class="window svelte-104t7b5"><div class="close svelte-104t7b5">${validate_component(Close_green_24px, "CloseIcon").$$render($$result, {}, {}, {})}</div> <div class="label svelte-104t7b5" data-svelte-h="svelte-2hl7xp">Task Solution</div> <div class="subtitle svelte-104t7b5" data-svelte-h="svelte-1vkj9f">By clicking submit, your answers will be saved. After that you can no longer edit your answers and you will continue with the next task.</div> <div class="questions svelte-104t7b5">${each(task.questions, (question, index) => {
    return `${index > 0 ? `<div class="line svelte-104t7b5"></div>` : ``} ${validate_component(Answer_accord, "AnswerAccord").$$render(
      $$result,
      {
        question,
        index,
        minWords: minWordsPerAnswer
      },
      {},
      {}
    )}`;
  })}</div> <div class="acceptance svelte-104t7b5">${each($users, (user) => {
    return `${$solutionAcceptance.some((a) => a.id === user.id) ? `<div class="bubble svelte-104t7b5"${add_attribute("title", `${user.firstName} ${user.lastName}`, 0)}>${escape(user.firstName.slice(0, 1).toUpperCase() + user.lastName.slice(0, 1).toUpperCase())} </div>` : `<div class="placeholder svelte-104t7b5"${add_attribute("title", `${user.firstName} ${user.lastName}`, 0)}></div>`}`;
  })}</div> ${$solutionAcceptance.every((a) => a.id !== $userMeta.id) ? `<div class="${escape(null_to_empty(`submit ${!submittable && "disabled"}`), true) + " svelte-104t7b5"}">Looks good!</div>` : `<div class="submitted svelte-104t7b5">${validate_component(Check_circle_outline_18px, "CheckIcon").$$render($$result, {}, {}, {})}
				Waiting for all team members</div>`}</div> </div>`;
});
const Check_circle_outline_34px = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.9997 2.8335C9.17967 2.8335 2.83301 9.18016 2.83301 17.0002C2.83301 24.8202 9.17967 31.1668 16.9997 31.1668C24.8197 31.1668 31.1663 24.8202 31.1663 17.0002C31.1663 9.18016 24.8197 2.8335 16.9997 2.8335ZM16.9997 28.3335C10.7522 28.3335 5.66634 23.2477 5.66634 17.0002C5.66634 10.7527 10.7522 5.66683 16.9997 5.66683C23.2472 5.66683 28.333 10.7527 28.333 17.0002C28.333 23.2477 23.2472 28.3335 16.9997 28.3335ZM14.1663 20.0743L22.4963 11.7443C23.0488 11.1918 23.9555 11.1918 24.508 11.7443C25.0605 12.2968 25.0605 13.1893 24.508 13.7418L15.1722 23.0777C14.6197 23.6302 13.7272 23.6302 13.1747 23.0777L9.50551 19.4085C8.95301 18.856 8.95301 17.9635 9.50551 17.411C9.77019 17.1457 10.1295 16.9966 10.5043 16.9966C10.879 16.9966 11.2383 17.1457 11.503 17.411L14.1663 20.0743Z" fill="#34E5B0"></path></svg>`;
});
const css$b = {
  code: ".modal.svelte-17w8924.svelte-17w8924.svelte-17w8924.svelte-17w8924{display:block;position:absolute;z-index:1000;left:0;top:0;width:100%;height:100%;overflow:hidden;background:rgba(18, 18, 18, 0.5019607843)}.modal.svelte-17w8924>.window.svelte-17w8924.svelte-17w8924.svelte-17w8924{display:flex;flex-direction:column;align-items:center;position:relative;background-color:#004A3D;margin:15% auto;padding:20px;border-radius:10px;width:550px;color:#34E5B0;word-break:normal;font-size:16px;text-align:center}.modal.svelte-17w8924>.window.svelte-17w8924>.text.svelte-17w8924.svelte-17w8924{margin-top:5px;font-size:18px}.modal.svelte-17w8924>.window.svelte-17w8924>.label.svelte-17w8924.svelte-17w8924{display:flex;justify-content:center;align-items:center;font-size:32px;font-weight:bold;gap:10px;margin-top:15px}.modal.svelte-17w8924>.window.svelte-17w8924>.sub-text.svelte-17w8924.svelte-17w8924{margin-top:15px}.modal.svelte-17w8924>.window.svelte-17w8924>button.svelte-17w8924.svelte-17w8924{display:flex;justify-content:center;align-items:center;width:200px;height:40px;font-size:18px;margin-top:30px;background-color:#4FDB90;border:none;outline:none;border-radius:5px;color:#004A3D;gap:10px}.modal.svelte-17w8924>.window.svelte-17w8924>button.svelte-17w8924>.counter.svelte-17w8924{display:flex;justify-content:center;align-items:center;width:22px;height:22px;border-radius:100px;border:solid 2px #004A3D}",
  map: null
};
const Modal_task_finished = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $visibleModals, $$unsubscribe_visibleModals;
  let $lastFinishedTask, $$unsubscribe_lastFinishedTask;
  $$unsubscribe_visibleModals = subscribe(visibleModals, (value) => $visibleModals = value);
  $$unsubscribe_lastFinishedTask = subscribe(lastFinishedTask, (value) => $lastFinishedTask = value);
  let time = 6;
  let timer = setInterval(tick, 1e3);
  function tick() {
    time--;
    if (time === 0)
      close();
  }
  function close() {
    clearInterval(timer);
    if ($lastFinishedTask === 2) {
      goto("/thank-you");
    } else {
      set_store_value(visibleModals, $visibleModals.taskFinished = false, $visibleModals);
    }
  }
  $$result.css.add(css$b);
  $$unsubscribe_visibleModals();
  $$unsubscribe_lastFinishedTask();
  return `<div class="modal svelte-17w8924"><div class="window svelte-17w8924"><div class="text svelte-17w8924" data-svelte-h="svelte-1marc8c">🎉 Congratulations</div> <div class="label svelte-17w8924">${validate_component(Check_circle_outline_34px, "CheckCircle").$$render($$result, {}, {}, {})}
			Task ${escape($lastFinishedTask)} has been completed!</div> <div class="sub-text svelte-17w8924" data-svelte-h="svelte-y1qkxd">You and your team have reached consensus about the solution.</div> <button class="svelte-17w8924"><div class="counter svelte-17w8924">${escape(time)}</div> ${$lastFinishedTask === 1 ? `Next Task` : `Time for Beer`}</button></div> </div>`;
});
const Close_inactive_tab_18px = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7241 4.28253C13.5839 4.14209 13.3937 4.06316 13.1953 4.06316C12.9969 4.06316 12.8067 4.14209 12.6666 4.28253L8.99906 7.94253L5.33156 4.27503C5.19144 4.13459 5.0012 4.05566 4.80281 4.05566C4.60442 4.05566 4.41419 4.13459 4.27406 4.27503C3.98156 4.56753 3.98156 5.04003 4.27406 5.33253L7.94156 9.00003L4.27406 12.6675C3.98156 12.96 3.98156 13.4325 4.27406 13.725C4.56656 14.0175 5.03906 14.0175 5.33156 13.725L8.99906 10.0575L12.6666 13.725C12.9591 14.0175 13.4316 14.0175 13.7241 13.725C14.0166 13.4325 14.0166 12.96 13.7241 12.6675L10.0566 9.00003L13.7241 5.33253C14.0091 5.04753 14.0091 4.56753 13.7241 4.28253Z" fill="#9CA4A9"></path></svg>`;
});
const Close_tab_18px = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7241 4.28253C13.5839 4.14209 13.3937 4.06316 13.1953 4.06316C12.9969 4.06316 12.8067 4.14209 12.6666 4.28253L8.99906 7.94253L5.33156 4.27503C5.19144 4.13459 5.0012 4.05566 4.80281 4.05566C4.60442 4.05566 4.41419 4.13459 4.27406 4.27503C3.98156 4.56753 3.98156 5.04003 4.27406 5.33253L7.94156 9.00003L4.27406 12.6675C3.98156 12.96 3.98156 13.4325 4.27406 13.725C4.56656 14.0175 5.03906 14.0175 5.33156 13.725L8.99906 10.0575L12.6666 13.725C12.9591 14.0175 13.4316 14.0175 13.7241 13.725C14.0166 13.4325 14.0166 12.96 13.7241 12.6675L10.0566 9.00003L13.7241 5.33253C14.0091 5.04753 14.0091 4.56753 13.7241 4.28253Z" fill="#3EA2FF"></path></svg>`;
});
const Add_tab_18px = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 9.75H9.75V13.5C9.75 13.9125 9.4125 14.25 9 14.25C8.5875 14.25 8.25 13.9125 8.25 13.5V9.75H4.5C4.0875 9.75 3.75 9.4125 3.75 9C3.75 8.5875 4.0875 8.25 4.5 8.25H8.25V4.5C8.25 4.0875 8.5875 3.75 9 3.75C9.4125 3.75 9.75 4.0875 9.75 4.5V8.25H13.5C13.9125 8.25 14.25 8.5875 14.25 9C14.25 9.4125 13.9125 9.75 13.5 9.75Z" fill="#555555"></path></svg>`;
});
const css$a = {
  code: ".tabs.svelte-x389ng.svelte-x389ng{display:flex;background-color:#1d1d1d;width:auto;align-items:center;margin-left:17.2em;min-height:23px}.tab.svelte-x389ng.svelte-x389ng{display:flex;min-width:20px;height:20px;justify-content:center;padding-left:10px;color:#9CA4A9;cursor:pointer}.tab.svelte-x389ng .bubble.svelte-x389ng{display:flex;justify-content:center;align-items:center;width:15px;height:15px;border-radius:15px;margin-left:5px;color:white;font-size:10px;background-color:rgb(150, 2, 2)}.tab.active.svelte-x389ng.svelte-x389ng{border-bottom:solid 2px #3ea2ff;color:#3ea2ff}.close.svelte-x389ng.svelte-x389ng{display:flex;margin-left:10px;cursor:pointer}.add.svelte-x389ng.svelte-x389ng{display:flex;width:auto;margin-left:5px;height:20px;justify-content:center;cursor:pointer}",
  map: null
};
const Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $chats, $$unsubscribe_chats;
  let $currentChat, $$unsubscribe_currentChat;
  let $$unsubscribe_seenChatMessages;
  $$unsubscribe_chats = subscribe(chats, (value) => $chats = value);
  $$unsubscribe_currentChat = subscribe(currentChat, (value) => $currentChat = value);
  $$unsubscribe_seenChatMessages = subscribe(seenChatMessages, (value) => value);
  let hovering = {};
  $$result.css.add(css$a);
  $$unsubscribe_chats();
  $$unsubscribe_currentChat();
  $$unsubscribe_seenChatMessages();
  return `<div class="tabs svelte-x389ng">${each($chats, (chat, index) => {
    return `<div class="${escape(null_to_empty(chat.id === $currentChat?.id ? "tab active" : "tab"), true) + " svelte-x389ng"}"><div class="title">${escape(chat.title)}</div> ${getChatUnseenMessages(chat) > 0 ? `<div class="bubble svelte-x389ng">${escape(getChatUnseenMessages(chat))}</div>` : ``} ${$chats.length > 1 ? `<div class="close svelte-x389ng">${hovering[index] ? `${validate_component(Close_tab_18px, "CloseActiveTabIcon").$$render($$result, {}, {}, {})}` : `${validate_component(Close_inactive_tab_18px, "CloseTabIcon").$$render($$result, {}, {}, {})}`} </div>` : ``} </div>`;
  })} <div class="add svelte-x389ng">${validate_component(Add_tab_18px, "AddTabIcon").$$render($$result, {}, {}, {})}</div> </div>`;
});
const Ai_persona_in_chat = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<svg width="31" height="30" viewBox="0 0 31 30"${add_attribute("fill", color, 0)} xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.4998 5C12.6453 5 10.3332 7.2375 10.3332 10C10.3332 12.7625 12.6453 15 15.4998 15C18.3544 15 20.6665 12.7625 20.6665 10C20.6665 7.2375 18.3544 5 15.4998 5ZM18.2123 10C18.2123 8.55 16.9982 7.375 15.4998 7.375C14.0015 7.375 12.7873 8.55 12.7873 10C12.7873 11.45 14.0015 12.625 15.4998 12.625C16.9982 12.625 18.2123 11.45 18.2123 10ZM23.379 21.25C23.379 20.45 19.3361 18.625 15.4998 18.625C11.6636 18.625 7.62067 20.45 7.62067 21.25V22.625H23.379V21.25ZM5.1665 21.25C5.1665 17.925 12.0511 16.25 15.4998 16.25C18.9486 16.25 25.8332 17.925 25.8332 21.25V23.75C25.8332 24.4375 25.2519 25 24.5415 25H6.45817C5.74775 25 5.1665 24.4375 5.1665 23.75V21.25Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const expertColors = [
  {
    primary: "#DBA34F",
    text: "#CCCCCC",
    background: "#2D1A0B"
  },
  {
    primary: "#FF7878",
    text: "#CCCCCC",
    background: "#251010"
  },
  {
    primary: "#CE90E4",
    text: "#CCCCCC",
    background: "#2C263F"
  },
  {
    primary: "#4F76DB",
    text: "#CCCCCC",
    background: "#1A2950"
  }
];
const css$9 = {
  code: ".expert-bar.svelte-1bsngg7.svelte-1bsngg7.svelte-1bsngg7{display:flex;width:15em;min-width:15em;height:100%;flex-direction:column;gap:10px;margin-left:15px;margin-right:15px}.expert-bar.svelte-1bsngg7>.problem-summary.svelte-1bsngg7.svelte-1bsngg7{display:flex;width:100%;max-width:450px;min-height:90px;background-color:rgba(8, 58, 43, 0.4392156863);border-radius:15px;justify-content:center;align-items:center;color:#34e5b0;flex-direction:column;padding:15px;box-sizing:border-box}.expert-bar.svelte-1bsngg7>.problem-summary.svelte-1bsngg7>.label.svelte-1bsngg7{display:flex;margin-bottom:5px;font-size:12px;color:#1E8465}.expert-bar.svelte-1bsngg7>.problem-summary.inactive.svelte-1bsngg7.svelte-1bsngg7{background-color:#2f2f2f;color:#696969}.expert-bar.svelte-1bsngg7>.problem-summary.inactive.svelte-1bsngg7>.label.svelte-1bsngg7{color:#696969}.expert-bar.svelte-1bsngg7>.avatars.svelte-1bsngg7.svelte-1bsngg7{display:flex;flex-direction:column;gap:10px}.expert-bar.svelte-1bsngg7>.avatars.svelte-1bsngg7>.avatar.svelte-1bsngg7{display:flex;width:100%;height:90px;border:2px solid #565656;border-radius:15px;justify-content:center;align-items:center;gap:5px;flex-direction:column;color:#B9B9B9;background-color:#393939;padding:4px;box-sizing:border-box;text-align:center}.expert-bar.svelte-1bsngg7>.avatars.svelte-1bsngg7>.avatar.placeholder.svelte-1bsngg7{color:#b9b9b9;background-color:#212121;border-color:transparent}",
  map: null
};
const Expert_bar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentChat, $$unsubscribe_currentChat;
  $$unsubscribe_currentChat = subscribe(currentChat, (value) => $currentChat = value);
  $$result.css.add(css$9);
  $$unsubscribe_currentChat();
  return `<div class="expert-bar svelte-1bsngg7">${$currentChat?.problemSummary ? `<div class="problem-summary svelte-1bsngg7"><div class="label svelte-1bsngg7" data-svelte-h="svelte-zav9uu">Problem Summary</div> ${escape($currentChat.problemSummary)}</div>` : `<div class="problem-summary inactive svelte-1bsngg7" data-svelte-h="svelte-h8uub8"><div class="label svelte-1bsngg7">Problem Summary</div>
			---</div>`} ${$currentChat?.experts?.length > 0 ? `<div class="avatars svelte-1bsngg7">${each($currentChat.experts, (expert) => {
    return `<div class="avatar svelte-1bsngg7">${validate_component(Ai_persona_in_chat, "AIAvatar").$$render(
      $$result,
      {
        color: expertColors[expert.index].primary
      },
      {},
      {}
    )} ${escape(expert.name)} </div>`;
  })}</div>` : `<div class="avatars svelte-1bsngg7">${each(Array(4), (_) => {
    return `<div class="avatar placeholder svelte-1bsngg7">${validate_component(Ai_persona_in_chat, "AIAvatar").$$render($$result, { color: "#3f3f3f" }, {}, {})} </div>`;
  })}</div>`} </div>`;
});
const css$8 = {
  code: '.committee.svelte-wsv8b7.svelte-wsv8b7{display:flex;flex-direction:column;width:100%;height:auto;align-items:center;margin-top:30px}.committee.svelte-wsv8b7>.headline.svelte-wsv8b7{font-size:24px;font-weight:bold;color:#3EA2FF}.committee.svelte-wsv8b7>.busy.svelte-wsv8b7{font-size:18px;font-style:italic;color:#34E5B0}.experts.svelte-wsv8b7.svelte-wsv8b7{display:flex;justify-content:space-between;gap:10px;box-sizing:border-box;padding:15px;width:100%;max-width:1220px}.experts.svelte-wsv8b7>div.svelte-wsv8b7{display:flex;flex-direction:column;width:100%;height:auto;gap:20px;border:1px solid #565656;border-radius:15px;padding:20px;min-height:150px}.experts.svelte-wsv8b7>div .header.svelte-wsv8b7{display:flex;flex-direction:column;align-items:center;gap:10px}.experts.svelte-wsv8b7>div .name.svelte-wsv8b7{font-size:16px;font-weight:bold;text-align:center}.experts.svelte-wsv8b7>div .background.svelte-wsv8b7{display:flex;color:#9E9E9E}.experts.svelte-wsv8b7>.placeholder.svelte-wsv8b7{border-color:transparent;background-color:#1c1c1c;overflow:hidden;position:relative}.experts.svelte-wsv8b7>.placeholder.svelte-wsv8b7::after{position:absolute;top:0;right:0;bottom:0;left:0;transform:translateX(-100%);background-image:linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0));animation:svelte-wsv8b7-shimmer 1s infinite;content:""}@keyframes svelte-wsv8b7-shimmer{100%{transform:translateX(100%)}}',
  map: null
};
const Expert_committee = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let expertsWithColor;
  let numPlaceholders;
  let { experts } = $$props;
  let { tentative } = $$props;
  if ($$props.experts === void 0 && $$bindings.experts && experts !== void 0)
    $$bindings.experts(experts);
  if ($$props.tentative === void 0 && $$bindings.tentative && tentative !== void 0)
    $$bindings.tentative(tentative);
  $$result.css.add(css$8);
  expertsWithColor = experts.map((expert) => ({
    ...expert,
    color: expertColors[expert.index]
  }));
  numPlaceholders = 4 - experts.length;
  return `<div class="committee svelte-wsv8b7">${!tentative ? `<div class="headline svelte-wsv8b7" data-svelte-h="svelte-ofct3x">Your Expert Committee:</div>` : `<div class="busy svelte-wsv8b7">${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}
			Your Expert Committee is being generated</div>`} <div class="experts svelte-wsv8b7">${each(expertsWithColor, (expert) => {
    return `<div class="svelte-wsv8b7"><div class="header svelte-wsv8b7">${validate_component(Ai_persona_in_chat, "AIIcon").$$render($$result, { color: expert.color.primary }, {}, {})} <div class="name svelte-wsv8b7"${add_attribute("style", `color: ${expert.color.primary}`, 0)}>${escape(expert.name)} </div></div> <div class="background svelte-wsv8b7">${escape(expert.background)}</div> </div>`;
  })} ${each(Array(numPlaceholders), (_) => {
    return `<div class="placeholder svelte-wsv8b7"></div>`;
  })}</div> </div>`;
});
const Send_icon_active = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="#083A2B" fill-opacity="0.7"></circle><path d="M18.9524 24.7716C19.4421 24.7716 19.7811 24.3761 20.0134 23.7734L24.1568 12.9378C24.2635 12.6553 24.3263 12.4104 24.3263 12.197C24.3263 11.7513 24.0438 11.4688 23.5918 11.4688C23.3846 11.4688 23.1335 11.5253 22.8573 11.632L11.9714 15.8005C11.4315 16.0077 11.0234 16.3467 11.0234 16.8364C11.0234 17.439 11.4692 17.665 12.0844 17.8471L16.617 19.178L17.9354 23.6604C18.1237 24.3008 18.3497 24.7716 18.9524 24.7716ZM16.9812 18.0229L13.0826 16.8301C12.9884 16.805 12.9633 16.7736 12.9633 16.7359C12.9633 16.692 12.9884 16.6543 13.07 16.6292L20.5219 13.779C21.0555 13.5718 21.5766 13.3207 22.1479 13.0571C21.6959 13.4212 21.1434 13.8669 20.7667 14.2436L16.9812 18.0229ZM19.0654 22.838C19.0215 22.838 18.9901 22.8004 18.965 22.7125L17.7722 18.8139L21.5515 15.0283C21.9156 14.6579 22.3802 14.0866 22.7443 13.6283C22.4806 14.2059 22.2232 14.7333 22.016 15.2732L19.1659 22.725C19.1345 22.8066 19.1094 22.838 19.0654 22.838Z" fill="#34E5B0"></path></svg>`;
});
const Send_icon_inactive = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="#353535" fill-opacity="0.7"></circle><path d="M18.9524 24.7716C19.4421 24.7716 19.7811 24.3761 20.0134 23.7734L24.1568 12.9378C24.2635 12.6553 24.3263 12.4104 24.3263 12.197C24.3263 11.7513 24.0438 11.4688 23.5918 11.4688C23.3846 11.4688 23.1335 11.5253 22.8573 11.632L11.9714 15.8005C11.4315 16.0077 11.0234 16.3467 11.0234 16.8364C11.0234 17.439 11.4692 17.665 12.0844 17.8471L16.617 19.178L17.9354 23.6604C18.1237 24.3008 18.3497 24.7716 18.9524 24.7716ZM16.9812 18.0229L13.0826 16.8301C12.9884 16.805 12.9633 16.7736 12.9633 16.7359C12.9633 16.692 12.9884 16.6543 13.07 16.6292L20.5219 13.779C21.0555 13.5718 21.5766 13.3207 22.1479 13.0571C21.6959 13.4212 21.1434 13.8669 20.7667 14.2436L16.9812 18.0229ZM19.0654 22.838C19.0215 22.838 18.9901 22.8004 18.965 22.7125L17.7722 18.8139L21.5515 15.0283C21.9156 14.6579 22.3802 14.0866 22.7443 13.6283C22.4806 14.2059 22.2232 14.7333 22.016 15.2732L19.1659 22.725C19.1345 22.8066 19.1094 22.838 19.0654 22.838Z" fill="#555555"></path></svg>`;
});
const css$7 = {
  code: ".chat-input.svelte-15kjq05{display:flex;flex-shrink:0;background-color:#0A0A0A;min-height:58px;height:auto;border-radius:30px;align-items:center;padding:0 12px;box-sizing:border-box}textarea.svelte-15kjq05{display:flex;max-height:250px;width:100%;box-sizing:border-box;padding:10px 0 10px 30px;overflow-y:auto;background-color:transparent;color:#fefefe;outline:none;border:none;resize:none;font-family:inherit;font-size:16px}.send.svelte-15kjq05{display:flex}.send.svelte-15kjq05:not(.disabled){cursor:pointer}",
  map: null
};
const Chat_input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentChat, $$unsubscribe_currentChat;
  $$unsubscribe_currentChat = subscribe(currentChat, (value) => $currentChat = value);
  let inputDom;
  $$result.css.add(css$7);
  $$unsubscribe_currentChat();
  return `<div class="chat-input svelte-15kjq05"><textarea rows="1" maxlength="500"${add_attribute(
    "placeholder",
    $currentChat?.experts.length > 0 ? `Chat with the experts` : `Describe the problem in your own words`,
    0
  )} class="svelte-15kjq05"${add_attribute("this", inputDom, 0)}></textarea> ${$currentChat && !$currentChat?.locked ? `<div class="send svelte-15kjq05">${validate_component(Send_icon_active, "SendIconActive").$$render($$result, {}, {}, {})}</div>` : `<div class="send disabled svelte-15kjq05">${validate_component(Send_icon_inactive, "SendIconInactive").$$render($$result, {}, {}, {})}</div>`} </div>`;
});
const css$6 = {
  code: ".system-message.svelte-ce6s7z{display:flex;align-self:center;background-color:#0B2E24;margin-top:15px;padding:20px;border-radius:60px;align-items:center;font-size:16px;color:#34E5B0}",
  map: null
};
const System_message = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { text } = $$props;
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  $$result.css.add(css$6);
  return `<div class="system-message svelte-ce6s7z">${escape(text)} </div>`;
});
const css$5 = {
  code: ".user-message.svelte-pekj6r.svelte-pekj6r{display:flex;flex-direction:column;text-align:right;align-self:flex-end;margin-top:15px;max-width:60%}.user-message.svelte-pekj6r .name.svelte-pekj6r{color:#34E5B0;font-size:12px}.user-message.svelte-pekj6r .bubble.svelte-pekj6r{color:#34E5B0;background-color:#0B2E24}.user-message.tentative.svelte-pekj6r .name.svelte-pekj6r{font-style:italic}.user-message.tentative.svelte-pekj6r .bubble.svelte-pekj6r{font-style:italic;color:#2ba782;background-color:transparent;border:dashed 1px #0B2E24}",
  map: null
};
const User_message = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { user } = $$props;
  let { text } = $$props;
  let { tentative = false } = $$props;
  if ($$props.user === void 0 && $$bindings.user && user !== void 0)
    $$bindings.user(user);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.tentative === void 0 && $$bindings.tentative && tentative !== void 0)
    $$bindings.tentative(tentative);
  $$result.css.add(css$5);
  return `<div class="${escape(null_to_empty(`user-message ${tentative && "tentative"}`), true) + " svelte-pekj6r"}"><div class="name svelte-pekj6r">${escape(user.firstName)} ${escape(user.lastName)}</div> <div class="bubble user-bubble svelte-pekj6r">${escape(text)}</div> </div>`;
});
const Triangle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<svg width="11" height="14" viewBox="0 0 11 14"${add_attribute("fill", color, 0)} xmlns="http://www.w3.org/2000/svg"><path d="M1.0817 7.80296C0.543088 7.40314 0.543087 6.59686 1.0817 6.19704L8.90396 0.390524C9.5638 -0.0992834 10.5 0.371708 10.5 1.19348L10.5 12.8065C10.5 13.6283 9.56381 14.0993 8.90396 13.6095L1.0817 7.80296Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const css$4 = {
  code: ".expert-message.svelte-14d7bu.svelte-14d7bu{display:flex;width:auto;max-width:60%;margin-top:15px;margin-left:10px}.expert-message.svelte-14d7bu .name.svelte-14d7bu{display:flex;font-size:16px;font-weight:bold;margin-top:-4px;margin-bottom:4px}.expert-message.svelte-14d7bu>.icon.svelte-14d7bu{margin-top:7px}.expert-message.svelte-14d7bu>.triangle.svelte-14d7bu{position:relative;top:15px;left:1px}",
  map: null
};
const Expert_message = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let colors;
  let { expert } = $$props;
  let { text } = $$props;
  if ($$props.expert === void 0 && $$bindings.expert && expert !== void 0)
    $$bindings.expert(expert);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  $$result.css.add(css$4);
  colors = expertColors[expert.index];
  return `<div class="expert-message svelte-14d7bu"><div class="icon svelte-14d7bu">${validate_component(Ai_persona_in_chat, "AIIcon").$$render($$result, { color: colors.primary }, {}, {})}</div> <div class="triangle svelte-14d7bu">${validate_component(Triangle, "Triangle").$$render($$result, { color: colors.background }, {}, {})}</div> <div class="bubble"${add_attribute("style", `color: ${colors.text}; background-color: ${colors.background};`, 0)}><div class="name svelte-14d7bu"${add_attribute("style", `color: ${colors.primary}`, 0)}>${escape(expert.name)}</div> ${escape(text)}</div> </div>`;
});
const css$3 = {
  code: ".container.svelte-19km9v8.svelte-19km9v8{display:inline-flex;margin-left:50px;padding:0 12px;width:min-content;height:38px;gap:10px;box-sizing:border-box;border-radius:10px;background-color:rgba(3, 3, 3, 0.4392156863);align-items:center;justify-content:center;margin-top:10px;flex-shrink:0;white-space:nowrap}.dots.svelte-19km9v8.svelte-19km9v8{display:flex;gap:2px}.dots.svelte-19km9v8>span.svelte-19km9v8{display:block;width:5px;height:5px;border-radius:5px;animation:svelte-19km9v8-dot-flashing 1s infinite linear alternate}.dots.svelte-19km9v8>span.svelte-19km9v8:nth-child(2){animation-delay:0.5s}.dots.svelte-19km9v8>span.svelte-19km9v8:nth-child(3){animation-delay:1s}@keyframes svelte-19km9v8-dot-flashing{0%{opacity:1}50%,100%{opacity:0.2}}",
  map: null
};
const Generating_answer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let color;
  let { colorIndex } = $$props;
  let { text } = $$props;
  if ($$props.colorIndex === void 0 && $$bindings.colorIndex && colorIndex !== void 0)
    $$bindings.colorIndex(colorIndex);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  $$result.css.add(css$3);
  color = typeof colorIndex === "number" ? expertColors[colorIndex].primary : "#34E5B0";
  return `<div class="container svelte-19km9v8"><div class="dots svelte-19km9v8"><span${add_attribute("style", `background-color: ${color}`, 0)} class="svelte-19km9v8"></span> <span${add_attribute("style", `background-color: ${color}`, 0)} class="svelte-19km9v8"></span> <span${add_attribute("style", `background-color: ${color}`, 0)} class="svelte-19km9v8"></span></div> ${escape(text)} </div>`;
});
const css$2 = {
  code: ".chat-window.svelte-d4n7qn{display:flex;width:100%;height:75vh;background-color:#131313;border-bottom-left-radius:30px;border-bottom-right-radius:30px;flex-direction:column}.messages.svelte-d4n7qn{display:flex;width:100%;height:100%;min-width:500px;box-sizing:border-box;padding:10px;overflow-y:auto;flex-direction:column;padding-bottom:50px}.messages.svelte-d4n7qn::-webkit-scrollbar{width:10px}.messages.svelte-d4n7qn::-webkit-scrollbar-track{background:none}.messages.svelte-d4n7qn::-webkit-scrollbar-thumb{background:#888;border-radius:10px}.messages.svelte-d4n7qn::-webkit-scrollbar-thumb:hover{background:#9ca4a9}.messages.svelte-d4n7qn::-webkit-scrollbar-corner{background:none}.messages.svelte-d4n7qn .bubble{display:flex;flex-direction:column;margin-top:5px;padding:15px;box-sizing:border-box;border-radius:10px;align-self:flex-end;width:auto}",
  map: null
};
const Chat_window = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentChat, $$unsubscribe_currentChat;
  let $users, $$unsubscribe_users;
  $$unsubscribe_currentChat = subscribe(currentChat, (value) => $currentChat = value);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  let messagesContainerDom;
  let detached = false;
  $$result.css.add(css$2);
  $currentChat && !detached && markChatSeen($currentChat);
  $$unsubscribe_currentChat();
  $$unsubscribe_users();
  return `<div class="chat-window svelte-d4n7qn"><div class="chat-message-container"></div> <div class="messages svelte-d4n7qn"${add_attribute("this", messagesContainerDom, 0)}>${$currentChat ? `${each($currentChat.messages, (message, i) => {
    return `${message.user ? `${validate_component(User_message, "UserMessage").$$render($$result, { user: message.user, text: message.text }, {}, {})}` : `${message.expert ? `${validate_component(Expert_message, "ExpertMessage").$$render(
      $$result,
      {
        expert: message.expert,
        text: message.text
      },
      {},
      {}
    )}` : `${message.text === "(experts)" ? `${validate_component(Expert_committee, "ExpertCommittee").$$render(
      $$result,
      {
        experts: $currentChat.experts,
        tentative: $currentChat.messages.length - 1 === i
      },
      {},
      {}
    )}` : `${validate_component(System_message, "SystemMessage").$$render($$result, { text: message.text }, {}, {})}`}`}`}`;
  })} ${$currentChat.locked && $currentChat.busyStatus ? `${validate_component(Generating_answer, "GeneratingAnswer").$$render(
    $$result,
    {
      text: $currentChat.busyStatus.text,
      colorIndex: $currentChat.busyStatus.colorIndex
    },
    {},
    {}
  )}` : ``} ${each(Object.entries($currentChat.typingUsers), ([id, text]) => {
    return `${text ? `${validate_component(User_message, "UserMessage").$$render(
      $$result,
      {
        user: $users.find((user) => user.id == parseInt(id)),
        text,
        tentative: true
      },
      {},
      {}
    )}` : ``}`;
  })}` : ``}</div> ${validate_component(Chat_input, "ChatInput").$$render($$result, {}, {}, {})} </div>`;
});
const Taskinfo_notification = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="67" height="66" viewBox="0 0 67 66" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="8" width="61.1636" height="58" rx="10" fill="#505050"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M31 27C25.48 27 21 31.48 21 37C21 42.52 25.48 47 31 47C36.52 47 41 42.52 41 37C41 31.48 36.52 27 31 27ZM30 32V34H32V32H30ZM32 41C32 41.55 31.55 42 31 42C30.45 42 30 41.55 30 41V37C30 36.45 30.45 36 31 36C31.55 36 32 36.45 32 37V41ZM23 37C23 41.41 26.59 45 31 45C35.41 45 39 41.41 39 37C39 32.59 35.41 29 31 29C26.59 29 23 32.59 23 37Z" fill="#D3D3D3"></path><circle cx="58" cy="9" r="9" fill="#1D1D1D"></circle><circle cx="58" cy="9" r="6" fill="#960202"></circle></svg>`;
});
const Task_info_clicked = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="67" height="66" viewBox="0 0 67 66" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="58" cy="9" r="9" fill="#1D1D1D"></circle><circle cx="58" cy="9" r="6" fill="#1D1D1D"></circle><rect y="8" width="61.1636" height="58" rx="10" fill="#505050"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M31 27C25.48 27 21 31.48 21 37C21 42.52 25.48 47 31 47C36.52 47 41 42.52 41 37C41 31.48 36.52 27 31 27ZM30 32V34H32V32H30ZM32 41C32 41.55 31.55 42 31 42C30.45 42 30 41.55 30 41V37C30 36.45 30.45 36 31 36C31.55 36 32 36.45 32 37V41ZM23 37C23 41.41 26.59 45 31 45C35.41 45 39 41.41 39 37C39 32.59 35.41 29 31 29C26.59 29 23 32.59 23 37Z" fill="#D3D3D3"></path></svg>`;
});
const Task_notofication = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="67" height="65" viewBox="0 0 67 65" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="7" width="61.1636" height="58" rx="10" fill="#00274A"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M38 27H33.82C33.4 25.84 32.3 25 31 25C29.7 25 28.6 25.84 28.18 27H24C22.9 27 22 27.9 22 29V45C22 46.1 22.9 47 24 47H38C39.1 47 40 46.1 40 45V29C40 27.9 39.1 27 38 27ZM31 27C31.55 27 32 27.45 32 28C32 28.55 31.55 29 31 29C30.45 29 30 28.55 30 28C30 27.45 30.45 27 31 27ZM24 44C24 44.55 24.45 45 25 45H37C37.55 45 38 44.55 38 44V30C38 29.45 37.55 29 37 29H36V30C36 31.1 35.1 32 34 32H28C26.9 32 26 31.1 26 30V29H25C24.45 29 24 29.45 24 30V44Z" fill="#3EA2FF"></path><circle cx="58" cy="9" r="9" fill="#1D1D1D"></circle><circle cx="58" cy="9" r="6" fill="#960202"></circle></svg>`;
});
const Task_clicked = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="67" height="65" viewBox="0 0 67 65" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="58" cy="9" r="9" fill="#1D1D1D"></circle><circle cx="58" cy="9" r="6" fill="#1D1D1D"></circle><rect y="7" width="61.1636" height="58" rx="10" fill="#00274A"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M38 27H33.82C33.4 25.84 32.3 25 31 25C29.7 25 28.6 25.84 28.18 27H24C22.9 27 22 27.9 22 29V45C22 46.1 22.9 47 24 47H38C39.1 47 40 46.1 40 45V29C40 27.9 39.1 27 38 27ZM31 27C31.55 27 32 27.45 32 28C32 28.55 31.55 29 31 29C30.45 29 30 28.55 30 28C30 27.45 30.45 27 31 27ZM24 44C24 44.55 24.45 45 25 45H37C37.55 45 38 44.55 38 44V30C38 29.45 37.55 29 37 29H36V30C36 31.1 35.1 32 34 32H28C26.9 32 26 31.1 26 30V29H25C24.45 29 24 29.45 24 30V44Z" fill="#3EA2FF"></path></svg>`;
});
const Tasksolution_notification = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="67" height="65" viewBox="0 0 67 65" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="7" width="61.1636" height="58" rx="10" fill="#004A3D"></rect><circle cx="58" cy="9" r="9" fill="#1D1D1D"></circle><circle cx="58" cy="9" r="6" fill="#960202"></circle><path d="M27.748 41.0332H34.252C34.6035 41.0332 34.8408 40.7959 34.8408 40.4443V39.0996C34.8408 36.9727 37.9609 35.6367 37.9609 31.752C37.9609 27.6387 35.1572 24.8789 31 24.8789C26.834 24.8789 24.0391 27.6387 24.0391 31.752C24.0391 35.6367 27.1592 36.9727 27.1592 39.0996V40.4443C27.1592 40.7959 27.3965 41.0332 27.748 41.0332ZM28.6885 39.0732C28.6885 36.4014 25.5947 35.0654 25.5947 31.752C25.5947 28.5527 27.7568 26.4346 31 26.4346C34.2432 26.4346 36.4053 28.5527 36.4053 31.752C36.4053 35.0654 33.3027 36.4014 33.3027 39.0732V39.5039H28.6885V39.0732ZM28.0029 43.4766H33.9971C34.4717 43.4766 34.8584 43.0898 34.8584 42.6064C34.8584 42.1318 34.4717 41.7363 33.9971 41.7363H28.0029C27.5283 41.7363 27.1416 42.1318 27.1416 42.6064C27.1416 43.0898 27.5283 43.4766 28.0029 43.4766ZM31 45.6914C32.2832 45.6914 33.2061 45.0938 33.2939 44.1885H28.6973C28.7852 45.0938 29.6992 45.6914 31 45.6914Z" fill="#34E5B0"></path></svg>`;
});
const Task_solution_clicked = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="67" height="65" viewBox="0 0 67 65" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="58" cy="9" r="9" fill="#1D1D1D"></circle><circle cx="58" cy="9" r="6" fill="#1D1D1D"></circle><rect y="7" width="61.1636" height="58" rx="10" fill="#004A3D"></rect><path d="M27.748 41.0332H34.252C34.6035 41.0332 34.8408 40.7959 34.8408 40.4443V39.0996C34.8408 36.9727 37.9609 35.6367 37.9609 31.752C37.9609 27.6387 35.1572 24.8789 31 24.8789C26.834 24.8789 24.0391 27.6387 24.0391 31.752C24.0391 35.6367 27.1592 36.9727 27.1592 39.0996V40.4443C27.1592 40.7959 27.3965 41.0332 27.748 41.0332ZM28.6885 39.0732C28.6885 36.4014 25.5947 35.0654 25.5947 31.752C25.5947 28.5527 27.7568 26.4346 31 26.4346C34.2432 26.4346 36.4053 28.5527 36.4053 31.752C36.4053 35.0654 33.3027 36.4014 33.3027 39.0732V39.5039H28.6885V39.0732ZM28.0029 43.4766H33.9971C34.4717 43.4766 34.8584 43.0898 34.8584 42.6064C34.8584 42.1318 34.4717 41.7363 33.9971 41.7363H28.0029C27.5283 41.7363 27.1416 42.1318 27.1416 42.6064C27.1416 43.0898 27.5283 43.4766 28.0029 43.4766ZM31 45.6914C32.2832 45.6914 33.2061 45.0938 33.2939 44.1885H28.6973C28.7852 45.0938 29.6992 45.6914 31 45.6914Z" fill="#34E5B0"></path></svg>`;
});
const css$1 = {
  code: ".task-bar.svelte-khvekm.svelte-khvekm{display:flex;min-width:130px;height:100%;flex-direction:column;align-items:center}.task-bar.svelte-khvekm>.button.svelte-khvekm{display:flex;cursor:pointer}.task-bar.svelte-khvekm>.button.svelte-khvekm:active{opacity:0.75}",
  map: null
};
const Task_bar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $unseenContent, $$unsubscribe_unseenContent;
  let $$unsubscribe_visibleModals;
  $$unsubscribe_unseenContent = subscribe(unseenContent, (value) => $unseenContent = value);
  $$unsubscribe_visibleModals = subscribe(visibleModals, (value) => value);
  $$result.css.add(css$1);
  $$unsubscribe_unseenContent();
  $$unsubscribe_visibleModals();
  return `<div class="task-bar svelte-khvekm"><div class="button svelte-khvekm">${$unseenContent.taskInfo ? `${validate_component(Taskinfo_notification, "TaskInfoUnclicked").$$render($$result, {}, {}, {})}` : `${validate_component(Task_info_clicked, "TaskInfoClicked").$$render($$result, {}, {}, {})}`}</div> <div class="button svelte-khvekm">${$unseenContent.taskInstructions ? `${validate_component(Task_notofication, "TaskUnclicked").$$render($$result, {}, {}, {})}` : `${validate_component(Task_clicked, "TaskClicked").$$render($$result, {}, {}, {})}`}</div> <div class="button svelte-khvekm">${$unseenContent.taskSolution ? `${validate_component(Tasksolution_notification, "TaskSolutionUnclicked").$$render($$result, {}, {}, {})}` : `${validate_component(Task_solution_clicked, "TaskSolutionClicked").$$render($$result, {}, {}, {})}`}</div> </div>`;
});
const css = {
  code: ".app-container.svelte-d07van.svelte-d07van{display:flex;width:100%;height:100%;flex-direction:column}.app-container.svelte-d07van>.chat-container.svelte-d07van{display:flex;width:100%;height:100%}",
  map: null
};
const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $connectionState, $$unsubscribe_connectionState;
  let $visibleModals, $$unsubscribe_visibleModals;
  $$unsubscribe_connectionState = subscribe(connectionState, (value) => $connectionState = value);
  $$unsubscribe_visibleModals = subscribe(visibleModals, (value) => $visibleModals = value);
  let cookies = getCookies();
  if (!cookies.token)
    goto("/");
  else
    connect({
      url: `${"wss://study.pivoto.ai/api"}?token=${cookies.token}`
    });
  $$result.css.add(css);
  $$unsubscribe_connectionState();
  $$unsubscribe_visibleModals();
  return `<div class="app-container svelte-d07van">${$connectionState === "lost" ? `${validate_component(Connection_warning, "ConnectionWarning").$$render($$result, {}, {}, {})}` : ``} ${$visibleModals.taskInfo ? `${validate_component(Modal_task_info, "TaskInfoModal").$$render($$result, {}, {}, {})}` : ``} ${$visibleModals.taskInstructions ? `${validate_component(Modal_task_instructions, "TaskInstructionsModal").$$render($$result, {}, {}, {})}` : ``} ${$visibleModals.taskSolution ? `${validate_component(Modal_task_solution, "TaskSolutionModal").$$render($$result, {}, {}, {})}` : ``} ${$visibleModals.taskFinished ? `${validate_component(Modal_task_finished, "TaskFinishedModal").$$render($$result, {}, {}, {})}` : ``} ${validate_component(Tabs, "ChatTabs").$$render($$result, {}, {}, {})} <div class="chat-container svelte-d07van">${validate_component(Expert_bar, "ExpertBar").$$render($$result, {}, {}, {})} ${validate_component(Chat_window, "ChatWindow").$$render($$result, {}, {}, {})} ${validate_component(Task_bar, "TaskBar").$$render($$result, {}, {}, {})}</div> </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Main_header, "AppHeader1").$$render($$result, {}, {}, {})} ${validate_component(App, "App").$$render($$result, {}, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-b9ccbd71.js.map
