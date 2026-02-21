import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class IntelligentData implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Intelligent Data',
		name: 'intelligentData',
		icon: 'file:intelligentdata.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Validate addresses, tax IDs, bank accounts, and screen against global sanctions lists via the apexanalytix Intelligent Data API',
		defaults: {
			name: 'Intelligent Data',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'intelligentDataApi',
				required: true,
			},
		],
		properties: [
			// ── Operation selector ──────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Address Validation', value: 'addressValidation', description: 'Validate and standardize a postal address', action: 'Validate an address' },
					{ name: 'Tax Validation', value: 'taxValidation', description: 'Validate a tax ID (VAT, TIN, GST, etc.)', action: 'Validate a tax ID' },
					{ name: 'Bank Validation', value: 'bankValidation', description: 'Validate a bank account, routing number, or IBAN', action: 'Validate a bank account' },
					{ name: 'Business Lookup', value: 'businessLookup', description: 'Look up business registration details', action: 'Look up a business' },
					{ name: 'Sanctions Screening', value: 'sanctionsScreening', description: 'Screen against 90+ global prohibited/watch lists (OFAC, FBI, Interpol)', action: 'Screen for sanctions' },
					{ name: 'Director Check', value: 'directorCheck', description: 'Check if a person is a disqualified director', action: 'Check a director' },
				],
				default: 'addressValidation',
			},

			// ── Address Validation fields ───────────────────────────
			{
				displayName: 'Address Line 1',
				name: 'addressLine1',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['addressValidation'] } },
				description: 'Street address line 1',
			},
			{
				displayName: 'Address Line 2',
				name: 'addressLine2',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['addressValidation'] } },
				description: 'Street address line 2 (optional)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['addressValidation'] } },
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['addressValidation'] } },
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['addressValidation'] } },
			},
			{
				displayName: 'Country',
				name: 'addressCountry',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['addressValidation'] } },
				description: 'Country code (ISO2, ISO3, or full name)',
			},
			{
				displayName: 'Company Name',
				name: 'addressCompanyName',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['addressValidation'] } },
			},

			// ── Tax Validation fields ───────────────────────────────
			{
				displayName: 'Entity Name',
				name: 'taxEntityName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['taxValidation'] } },
				description: 'Company or individual name',
			},
			{
				displayName: 'Tax ID Number',
				name: 'identityNumber',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['taxValidation'] } },
				description: 'Tax identification number (e.g., VAT number, EIN, TIN)',
			},
			{
				displayName: 'Tax ID Type',
				name: 'identityNumberType',
				type: 'options',
				options: [
					{ name: 'VAT', value: 'VAT' },
					{ name: 'TIN', value: 'TIN' },
					{ name: 'GST', value: 'GST' },
					{ name: 'EIN', value: 'EIN' },
					{ name: 'Other', value: 'Other' },
				],
				default: 'VAT',
				required: true,
				displayOptions: { show: { operation: ['taxValidation'] } },
			},
			{
				displayName: 'Country',
				name: 'taxCountry',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['taxValidation'] } },
				description: 'Country code (ISO2, e.g., DE, US, GB)',
			},

			// ── Bank Validation fields ──────────────────────────────
			{
				displayName: 'Bank Number Type',
				name: 'bankNumberType',
				type: 'options',
				options: [
					{ name: 'Routing Number', value: 'Routing' },
					{ name: 'IBAN', value: 'IBAN' },
					{ name: 'SWIFT/BIC', value: 'SWIFT' },
					{ name: 'CLABE', value: 'CLABE' },
					{ name: 'Bank Giro', value: 'GIRO' },
				],
				default: 'Routing',
				required: true,
				displayOptions: { show: { operation: ['bankValidation'] } },
			},
			{
				displayName: 'Bank Code / Routing Number',
				name: 'bankCode',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['bankValidation'] } },
				description: 'Routing number, sort code, or bank code',
			},
			{
				displayName: 'Account Number',
				name: 'accountNumber',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['bankValidation'] } },
			},
			{
				displayName: 'IBAN',
				name: 'iban',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['bankValidation'] } },
			},
			{
				displayName: 'SWIFT/BIC',
				name: 'swift',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['bankValidation'] } },
			},
			{
				displayName: 'Account Holder Name',
				name: 'bankAccountHolder',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['bankValidation'] } },
			},
			{
				displayName: 'Country',
				name: 'bankCountry',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['bankValidation'] } },
				description: 'Country code (ISO2)',
			},

			// ── Business Lookup fields ──────────────────────────────
			{
				displayName: 'Entity Name',
				name: 'businessEntityName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['businessLookup'] } },
				description: 'Company or business name to look up',
			},
			{
				displayName: 'Country',
				name: 'businessCountry',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['businessLookup'] } },
				description: 'Country code (ISO2)',
			},
			{
				displayName: 'State',
				name: 'businessState',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['businessLookup'] } },
			},
			{
				displayName: 'City',
				name: 'businessCity',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['businessLookup'] } },
			},

			// ── Sanctions Screening fields ──────────────────────────
			{
				displayName: 'Company Name',
				name: 'sanctionsCompanyName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['sanctionsScreening'] } },
				description: 'Company or entity name to screen',
			},
			{
				displayName: 'First Name',
				name: 'sanctionsFirstName',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['sanctionsScreening'] } },
				description: 'Individual first name (for person screening)',
			},
			{
				displayName: 'Last Name',
				name: 'sanctionsLastName',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['sanctionsScreening'] } },
				description: 'Individual last name (for person screening)',
			},
			{
				displayName: 'Match Threshold',
				name: 'threshold',
				type: 'number',
				default: 0.8,
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				displayOptions: { show: { operation: ['sanctionsScreening'] } },
				description: 'Fuzzy match threshold (0.0 = loose, 1.0 = exact)',
			},
			{
				displayName: 'Request Type',
				name: 'sanctionsRequestType',
				type: 'options',
				options: [
					{ name: 'Initial', value: 'Initial' },
					{ name: 'Re-check', value: 'Re-check' },
				],
				default: 'Initial',
				displayOptions: { show: { operation: ['sanctionsScreening'] } },
			},

			// ── Director Check fields ───────────────────────────────
			{
				displayName: 'Name',
				name: 'directorName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['directorCheck'] } },
				description: 'Full name of the person to check',
			},
			{
				displayName: 'Country',
				name: 'directorCountry',
				type: 'options',
				options: [
					{ name: 'United Kingdom', value: 'GB' },
					{ name: 'Australia', value: 'AU' },
					{ name: 'New Zealand', value: 'NZ' },
				],
				default: 'GB',
				required: true,
				displayOptions: { show: { operation: ['directorCheck'] } },
				description: 'Country to check (currently UK, AU, NZ supported)',
			},

			// ── Common fields ───────────────────────────────────────
			{
				displayName: 'Reference ID',
				name: 'sourceUniqueId',
				type: 'string',
				default: '',
				description: 'Your internal reference ID for this request (optional, returned in response for correlation)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('intelligentDataApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			const sourceUniqueId = this.getNodeParameter('sourceUniqueId', i, '') as string;
			const clientName = 'n8n';

			let endpoint: string;
			let body: Record<string, unknown>;

			switch (operation) {
				case 'addressValidation':
					endpoint = '/api/address/validate';
					body = {
						addressLine1: this.getNodeParameter('addressLine1', i, '') as string,
						addressLine2: this.getNodeParameter('addressLine2', i, '') as string,
						city: this.getNodeParameter('city', i, '') as string,
						state: this.getNodeParameter('state', i, '') as string,
						postalCode: this.getNodeParameter('postalCode', i, '') as string,
						country: this.getNodeParameter('addressCountry', i) as string,
						companyName: this.getNodeParameter('addressCompanyName', i, '') as string,
						requestedByClient: clientName,
						sourceUniqueId,
					};
					break;

				case 'taxValidation':
					endpoint = '/api/tax/validate';
					body = {
						entityName: this.getNodeParameter('taxEntityName', i) as string,
						identityNumber: this.getNodeParameter('identityNumber', i) as string,
						identityNumberType: this.getNodeParameter('identityNumberType', i) as string,
						country: this.getNodeParameter('taxCountry', i) as string,
						requestedByClient: clientName,
						sourceUniqueId,
					};
					break;

				case 'bankValidation':
					endpoint = '/api/bank/validate';
					body = {
						bankNumberType: this.getNodeParameter('bankNumberType', i) as string,
						bankCode: this.getNodeParameter('bankCode', i, '') as string,
						accountNumber: this.getNodeParameter('accountNumber', i, '') as string,
						iBAN: this.getNodeParameter('iban', i, '') as string,
						swift: this.getNodeParameter('swift', i, '') as string,
						bankAccountHolder: this.getNodeParameter('bankAccountHolder', i, '') as string,
						country: this.getNodeParameter('bankCountry', i, '') as string,
						requestedByClient: clientName,
						sourceUniqueId,
					};
					break;

				case 'businessLookup':
					endpoint = '/api/businessregistration/lookup';
					body = {
						entityName: this.getNodeParameter('businessEntityName', i) as string,
						country: this.getNodeParameter('businessCountry', i) as string,
						state: this.getNodeParameter('businessState', i, '') as string,
						city: this.getNodeParameter('businessCity', i, '') as string,
						requestedByClient: clientName,
						sourceUniqueId,
					};
					break;

				case 'sanctionsScreening':
					endpoint = '/api/prohibited/lookup';
					body = {
						companyName: this.getNodeParameter('sanctionsCompanyName', i) as string,
						firstName: this.getNodeParameter('sanctionsFirstName', i, '') as string,
						lastName: this.getNodeParameter('sanctionsLastName', i, '') as string,
						threshold: this.getNodeParameter('threshold', i, 0.8) as number,
						requestType: this.getNodeParameter('sanctionsRequestType', i, 'Initial') as string,
						requestedByClient: clientName,
						sourceUniqueId,
					};
					break;

				case 'directorCheck':
					endpoint = '/api/disqualifieddirectors/validate';
					body = {
						name: this.getNodeParameter('directorName', i) as string,
						country: this.getNodeParameter('directorCountry', i) as string,
						requestedByClient: clientName,
						sourceUniqueId,
					};
					break;

				default:
					throw new Error(`Unknown operation: ${operation}`);
			}

			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'intelligentDataApi',
				{
					method: 'POST',
					url: `${baseUrl}${endpoint}`,
					body,
					json: true,
				},
			);

			returnData.push({ json: response as IDataObject });
		}

		return [returnData];
	}
}
