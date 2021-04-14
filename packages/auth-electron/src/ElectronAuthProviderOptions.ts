import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

export interface BaseOptions {
	/**
	 * If `true`, if the user presses Esc, the window will close.  Default `true`.
	 */
	escapeToClose?: boolean;
}

export interface WindowStyleOptions {
	/**
	 * Options passed to the `BrowserWindow` constructor, primarily for styling.
	 */
	windowOptions?: BrowserWindowConstructorOptions;
}

export interface WindowOptions {
	/**
	 * A custom `BrowserWindow` in which the loading will occur.
	 *
	 * @default
	 * ```js
	 *    {
	 *		width: 800,
	 *		height: 600,
	 *		show: false,
	 *		modal: true,
	 *		webPreferences: {
	 *			nodeIntegration: false
	 *		}
	 *	}
	 *```
	 */
	window: BrowserWindow;

	/**
	 * Close the `BrowserWindow` after the user has logged in.  Default: `true`.
	 */
	closeOnLogin?: boolean;
}

export type ElectronAuthProviderOptions<
	T extends WindowOptions | WindowStyleOptions = WindowStyleOptions
> = BaseOptions & T;
