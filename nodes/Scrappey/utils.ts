import { IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';

export const Static_Country_Proxies: INodePropertyOptions[] = [
	{ name: 'Afghanistan', value: 'Afghanistan' },
	{ name: 'Albania', value: 'Albania' },
	{ name: 'Algeria', value: 'Algeria' },
	{ name: 'Argentina', value: 'Argentina' },
	{ name: 'Armenia', value: 'Armenia' },
	{ name: 'Aruba', value: 'Aruba' },
	{ name: 'Australia', value: 'Australia' },
	{ name: 'Austria', value: 'Austria' },
	{ name: 'Azerbaijan', value: 'Azerbaijan' },
	{ name: 'Bahamas', value: 'Bahamas' },
	{ name: 'Bahrain', value: 'Bahrain' },
	{ name: 'Bangladesh', value: 'Bangladesh' },
	{ name: 'Belarus', value: 'Belarus' },
	{ name: 'Belgium', value: 'Belgium' },
	{ name: 'Bosnia and Herzegovina', value: 'BosniaandHerzegovina' },
	{ name: 'Brazil', value: 'Brazil' },
	{ name: 'British Virgin Islands', value: 'BritishVirginIslands' },
	{ name: 'Brunei', value: 'Brunei' },
	{ name: 'Bulgaria', value: 'Bulgaria' },
	{ name: 'Cambodia', value: 'Cambodia' },
	{ name: 'Cameroon', value: 'Cameroon' },
	{ name: 'Canada', value: 'Canada' },
	{ name: 'Chile', value: 'Chile' },
	{ name: 'China', value: 'China' },
	{ name: 'Colombia', value: 'Colombia' },
	{ name: 'Costa Rica', value: 'CostaRica' },
	{ name: 'Croatia', value: 'Croatia' },
	{ name: 'Cuba', value: 'Cuba' },
	{ name: 'Cyprus', value: 'Cyprus' },
	{ name: 'Czechia', value: 'Czechia' },
	{ name: 'Denmark', value: 'Denmark' },
	{ name: 'Dominican Republic', value: 'DominicanRepublic' },
	{ name: 'Ecuador', value: 'Ecuador' },
	{ name: 'Egypt', value: 'Egypt' },
	{ name: 'El Salvador', value: 'ElSalvador' },
	{ name: 'Estonia', value: 'Estonia' },
	{ name: 'Ethiopia', value: 'Ethiopia' },
	{ name: 'Finland', value: 'Finland' },
	{ name: 'France', value: 'France' },
	{ name: 'Georgia', value: 'Georgia' },
	{ name: 'Germany', value: 'Germany' },
	{ name: 'Ghana', value: 'Ghana' },
	{ name: 'Greece', value: 'Greece' },
	{ name: 'Guatemala', value: 'Guatemala' },
	{ name: 'Guyana', value: 'Guyana' },
	{ name: 'Hashemite Kingdom of Jordan', value: 'HashemiteKingdomofJordan' },
	{ name: 'Hong Kong', value: 'HongKong' },
	{ name: 'Hungary', value: 'Hungary' },
	{ name: 'India', value: 'India' },
	{ name: 'Indonesia', value: 'Indonesia' },
	{ name: 'Iran', value: 'Iran' },
	{ name: 'Iraq', value: 'Iraq' },
	{ name: 'Ireland', value: 'Ireland' },
	{ name: 'Israel', value: 'Israel' },
	{ name: 'Italy', value: 'Italy' },
	{ name: 'Jamaica', value: 'Jamaica' },
	{ name: 'Japan', value: 'Japan' },
	{ name: 'Kazakhstan', value: 'Kazakhstan' },
	{ name: 'Kenya', value: 'Kenya' },
	{ name: 'Kosovo', value: 'Kosovo' },
	{ name: 'Kuwait', value: 'Kuwait' },
	{ name: 'Latvia', value: 'Latvia' },
	{ name: 'Liechtenstein', value: 'Liechtenstein' },
	{ name: 'Luxembourg', value: 'Luxembourg' },
	{ name: 'Macedonia', value: 'Macedonia' },
	{ name: 'Madagascar', value: 'Madagascar' },
	{ name: 'Malaysia', value: 'Malaysia' },
	{ name: 'Mauritius', value: 'Mauritius' },
	{ name: 'Mexico', value: 'Mexico' },
	{ name: 'Mongolia', value: 'Mongolia' },
	{ name: 'Montenegro', value: 'Montenegro' },
	{ name: 'Morocco', value: 'Morocco' },
	{ name: 'Mozambique', value: 'Mozambique' },
	{ name: 'Myanmar', value: 'Myanmar' },
	{ name: 'Nepal', value: 'Nepal' },
	{ name: 'Netherlands', value: 'Netherlands' },
	{ name: 'New Zealand', value: 'NewZealand' },
	{ name: 'Nigeria', value: 'Nigeria' },
	{ name: 'Norway', value: 'Norway' },
	{ name: 'Oman', value: 'Oman' },
	{ name: 'Pakistan', value: 'Pakistan' },
	{ name: 'Palestine', value: 'Palestine' },
	{ name: 'Panama', value: 'Panama' },
	{ name: 'Papua New Guinea', value: 'PapuaNewGuinea' },
	{ name: 'Paraguay', value: 'Paraguay' },
	{ name: 'Peru', value: 'Peru' },
	{ name: 'Philippines', value: 'Philippines' },
	{ name: 'Poland', value: 'Poland' },
	{ name: 'Portugal', value: 'Portugal' },
	{ name: 'Puerto Rico', value: 'PuertoRico' },
	{ name: 'Qatar', value: 'Qatar' },
	{ name: 'Republic of Lithuania', value: 'RepublicofLithuania' },
	{ name: 'Republic of Moldova', value: 'RepublicofMoldova' },
	{ name: 'Romania', value: 'Romania' },
	{ name: 'Russia', value: 'Russia' },
	{ name: 'Saudi Arabia', value: 'SaudiArabia' },
	{ name: 'Senegal', value: 'Senegal' },
	{ name: 'Serbia', value: 'Serbia' },
	{ name: 'Seychelles', value: 'Seychelles' },
	{ name: 'Singapore', value: 'Singapore' },
	{ name: 'Slovakia', value: 'Slovakia' },
	{ name: 'Slovenia', value: 'Slovenia' },
	{ name: 'Somalia', value: 'Somalia' },
	{ name: 'South Africa', value: 'SouthAfrica' },
	{ name: 'South Korea', value: 'SouthKorea' },
	{ name: 'Spain', value: 'Spain' },
	{ name: 'Sri Lanka', value: 'SriLanka' },
	{ name: 'Sudan', value: 'Sudan' },
	{ name: 'Suriname', value: 'Suriname' },
	{ name: 'Sweden', value: 'Sweden' },
	{ name: 'Switzerland', value: 'Switzerland' },
	{ name: 'Syria', value: 'Syria' },
	{ name: 'Taiwan', value: 'Taiwan' },
	{ name: 'Tajikistan', value: 'Tajikistan' },
	{ name: 'Thailand', value: 'Thailand' },
	{ name: 'Trinidad and Tobago', value: 'TrinidadandTobago' },
	{ name: 'Tunisia', value: 'Tunisia' },
	{ name: 'Turkey', value: 'Turkey' },
	{ name: 'Uganda', value: 'Uganda' },
	{ name: 'Ukraine', value: 'Ukraine' },
	{ name: 'United Arab Emirates', value: 'UnitedArabEmirates' },
	{ name: 'United Kingdom', value: 'UnitedKingdom' },
	{ name: 'United States', value: 'UnitedStates' },
	{ name: 'Uzbekistan', value: 'Uzbekistan' },
	{ name: 'Venezuela', value: 'Venezuela' },
	{ name: 'Vietnam', value: 'Vietnam' },
	{ name: 'Zambia', value: 'Zambia' },
];

export const isExpression = (value: unknown): boolean => {
	if (typeof value !== 'string') return false;
	return value.trim().startsWith('={{') && value.trim().endsWith('}}');
};
export const evaluateExpression = (
	eFn: IExecuteFunctions,
	value: unknown,
	itemIndex: number = 0,
): unknown => {
	if (!isExpression(value)) return value;

	const expressionString = (value as string).trim();
	// Remove the '=' from '={{' as it's just a marker in the workflow JSON
	if (expressionString.startsWith('=')) {
		try {
			// Pass the expression without the leading '='
			return eFn.evaluateExpression(expressionString.substring(1), itemIndex);
		} catch (error) {
			eFn.logger.warn(`Failed to evaluate expression: ${expressionString}`, error);
			return value; // Return original value if evaluation fails
		}
	}

	return value;
};
export function generateUUID(): string {
  // Create an array of 16 random bytes.
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);

  // Set the version number to 4.
  // The 7th byte (index 6) needs to have its most significant nibble set to 0100.
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;

  // Set the variant.
  // The 9th byte (index 8) needs to have its two most significant bits set to 10.
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

  // Convert the byte array to a hexadecimal string.
  const byteToHex = (byte: number): string => {
    return ('0' + byte.toString(16)).slice(-2);
  };

  const hexBytes = Array.from(randomBytes).map(byteToHex);

  // Format the hexadecimal string with hyphens.
  return [
    hexBytes.slice(0, 4).join(''),
    hexBytes.slice(4, 6).join(''),
    hexBytes.slice(6, 8).join(''),
    hexBytes.slice(8, 10).join(''),
    hexBytes.slice(10).join(''),
  ].join('-');
}
