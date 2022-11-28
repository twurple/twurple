import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface EventSubChannelCharityAmountData {
	value: number;
	decimal_places: number;
	currency: string;
}

/**
 * An object representing monetary amount and currency information for charity donations/goals.
 *
 * @beta
 */
@rtfm('eventsub-base', 'EventSubChannelCharityAmount')
export class EventSubChannelCharityAmount extends DataObject<EventSubChannelCharityAmountData> {
	/**
	 * The monetary amount. The amount is specified in the currency’s minor unit.
	 * For example, the minor units for USD is cents, so if the amount is $5.50 USD, `value` is set to 550.
	 */
	get value(): number {
		return this[rawDataSymbol].value;
	}

	/**
	 * The number of decimal places used by the currency. For example, USD uses two decimal places.
	 * Use this number to translate `value` from minor units to major units by using the formula:
	 *
	 * `value / 10^decimalPlaces`
	 */
	get decimalPlaces(): number {
		return this[rawDataSymbol].decimal_places;
	}

	/**
	 * The localized monetary amount based on the value and the decimal places of the currency.
	 * For example, the minor units for USD is cents which uses two decimal places, so if `value` is 550, `localizedValue` is set to 5.50.
	 */
	get localizedValue(): number {
		return this.value / 10 ** this.decimalPlaces;
	}

	/**
	 * The ISO-4217 three-letter currency code that identifies the type of currency in `value`.
	 */
	get currency(): string {
		return this[rawDataSymbol].currency;
	}
}
