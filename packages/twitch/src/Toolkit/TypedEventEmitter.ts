/******************************************************************************
 * The MIT License (MIT)                                                      *
 *                                                                            *
 * Copyright (c) 2016 Simon "Tenry" Burchert                                  *
 *                                                                            *
 * Permission is hereby granted, free of charge, to any person obtaining a    *
 * copy of this software and associated documentation files (the "Software"), *
 * to deal in the Software without restriction, including without limitation  *
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,   *
 * and/or sell copies of the Software, and to permit persons to whom the      *
 * Software is furnished to do so, subject to the following conditions:       *
 *                                                                            *
 * The above copyright notice and this permission notice shall be included in *
 * all copies or substantial portions of the Software.                        *
 *                                                                            *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,   *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL    *
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING    *
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER        *
 * EALINGS IN THE SOFTWARE.                                                   *
 ******************************************************************************/

// This file was taken from https://github.com/tenry92/typed-event-emitter/blob/master/index.ts (+ added more type information)
// We can't use the published npm package because it doesn't compile down to es5, which causes errors with the super() call we need to use

/* eslint-disable max-classes-per-file */

export class Listener {
	constructor(
		public owner: EventEmitter,
		public event: Function,
		public listener: Function
	) {
	}

	unbind() {
		this.owner.removeListener(this);
	}
}

export class EventEmitter {
	private readonly _eventListeners: Map<Function, Function[]>;

	constructor() {
		this._eventListeners = new Map();
	}

	on(event: Function, listener: Function) {
		if (this._eventListeners.has(event)) {
			this._eventListeners.get(event)!.push(listener);
		} else {
			this._eventListeners.set(event, [listener]);
		}

		return new Listener(this, event, listener);
	}

	addListener(event: Function, listener: Function) {
		return this.on(event, listener);
	}

	removeListener(): void;
	removeListener(id: Listener): void;
	removeListener(event: Function, listener?: Function): void;

	removeListener(idOrEvent?: Listener | Function, listener?: Function) {
		if (arguments.length === 0) {
			this._eventListeners.clear();
		} else if (arguments.length === 1 && typeof idOrEvent === 'object') {
			const id: Listener = idOrEvent;
			this.removeListener(id.event, id.listener);
		} else if (idOrEvent) {
			const event = idOrEvent as Function;

			if (this._eventListeners.has(event)) {
				const listeners = this._eventListeners.get(event)!;
				let idx = 0;
				while (!listener || (idx = listeners.indexOf(listener)) !== -1) {
					listeners.splice(idx, 1);
				}
			}
		}
	}

	registerEvent<T extends Function>() {
		const eventBinder = (handler: T) => this.addListener(eventBinder, handler);

		return eventBinder;
	}

	/**
	 * Emit event. Calls all bound listeners with args.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected emit(event: Function, ...args: any[]) {
		if (this._eventListeners.has(event)) {
			for (const listener of this._eventListeners.get(event)!) {
				listener(...args);
			}
		}
	}
}
