import getConfig from 'next/config';

const { publicRuntimeConfig: config } = getConfig();

export const REGIONS = [
  { name: 'Africa', code: 'AF' },
  { name: 'North America', code: 'NA' },
  { name: 'Oceania', code: 'OC' },
  { name: 'Antarctica', code: 'AN' },
  { name: 'Asia', code: 'AS' },
  { name: 'Europe', code: 'EU' },
  { name: 'South America', code: 'SA' }
];

export const COUNTRIES = [
  {
    name: 'Afghanistan',
    code: 'AF',
    capital: 'Kabul',
    region: 'AS',
    currency: { code: 'AFN', name: 'Afghan afghani', symbol: '؋' },
    language: { code: 'ps', name: 'Pashto' },
    flag: new URL('flags/af.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Åland Islands',
    code: 'AX',
    capital: 'Mariehamn',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'sv', name: 'Swedish' },
    flag: new URL('flags/ax.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Albania',
    code: 'AL',
    capital: 'Tirana',
    region: 'EU',
    currency: { code: 'ALL', name: 'Albanian lek', symbol: 'L' },
    language: { code: 'sq', name: 'Albanian' },
    flag: new URL('flags/al.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Algeria',
    code: 'DZ',
    capital: 'Algiers',
    region: 'AF',
    currency: { code: 'DZD', name: 'Algerian dinar', symbol: 'د.ج' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/dz.svg', config.API_ENDPOINT).href
  },
  {
    name: 'American Samoa',
    code: 'AS',
    capital: 'Pago Pago',
    region: 'OC',
    currency: { code: 'USD', name: 'United State Dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/as.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Andorra',
    code: 'AD',
    capital: 'Andorra la Vella',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'ca', name: 'Catalan' },
    flag: new URL('flags/ad.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Angola',
    code: 'AO',
    capital: 'Luanda',
    region: 'AF',
    currency: { code: 'AOA', name: 'Angolan kwanza', symbol: 'Kz' },
    language: { code: 'pt', name: 'Portuguese' },
    flag: new URL('flags/ao.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Anguilla',
    code: 'AI',
    capital: 'The Valley',
    region: 'NA',
    currency: { code: 'XCD', name: 'East Caribbean dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ai.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Antigua and Barbuda',
    code: 'AG',
    capital: "Saint John's",
    region: 'NA',
    currency: { code: 'XCD', name: 'East Caribbean dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ag.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Argentina',
    code: 'AR',
    capital: 'Buenos Aires',
    region: 'SA',
    currency: { code: 'ARS', name: 'Argentine peso', symbol: '$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/ar.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Armenia',
    code: 'AM',
    capital: 'Yerevan',
    region: 'AS',
    currency: { code: 'AMD', name: 'Armenian dram', symbol: null },
    language: { code: 'hy', name: 'Armenian' },
    flag: new URL('flags/am.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Aruba',
    code: 'AW',
    capital: 'Oranjestad',
    region: 'SA',
    currency: { code: 'AWG', name: 'Aruban florin', symbol: 'ƒ' },
    language: { code: 'nl', name: 'Dutch' },
    flag: new URL('flags/aw.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Australia',
    code: 'AU',
    capital: 'Canberra',
    region: 'OC',
    currency: { code: 'AUD', name: 'Australian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/au.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Austria',
    code: 'AT',
    capital: 'Vienna',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'de', name: 'German' },
    flag: new URL('flags/at.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Azerbaijan',
    code: 'AZ',
    capital: 'Baku',
    region: 'AS',
    currency: { code: 'AZN', name: 'Azerbaijani manat', symbol: null },
    language: { code: 'az', name: 'Azerbaijani' },
    flag: new URL('flags/az.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Bahamas',
    code: 'BS',
    capital: 'Nassau',
    region: 'NA',
    currency: { code: 'BSD', name: 'Bahamian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/bs.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Bahrain',
    code: 'BH',
    capital: 'Manama',
    region: 'AS',
    currency: { code: 'BHD', name: 'Bahraini dinar', symbol: '.د.ب' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/bh.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    capital: 'Dhaka',
    region: 'AS',
    currency: { code: 'BDT', name: 'Bangladeshi taka', symbol: '৳' },
    language: { code: 'bn', name: 'Bengali' },
    flag: new URL('flags/bd.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Barbados',
    code: 'BB',
    capital: 'Bridgetown',
    region: 'NA',
    currency: { code: 'BBD', name: 'Barbadian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/bb.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Belarus',
    code: 'BY',
    capital: 'Minsk',
    region: 'EU',
    currency: { code: 'BYN', name: 'New Belarusian ruble', symbol: 'Br' },
    language: { code: 'be', name: 'Belarusian' },
    flag: new URL('flags/by.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Belgium',
    code: 'BE',
    capital: 'Brussels',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'nl', name: 'Dutch' },
    flag: new URL('flags/be.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Belize',
    code: 'BZ',
    capital: 'Belmopan',
    region: 'NA',
    currency: { code: 'BZD', name: 'Belize dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/bz.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Benin',
    code: 'BJ',
    capital: 'Porto-Novo',
    region: 'AF',
    currency: { code: 'XOF', name: 'West African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/bj.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Bermuda',
    code: 'BM',
    capital: 'Hamilton',
    region: 'NA',
    currency: { code: 'BMD', name: 'Bermudian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/bm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Bhutan',
    code: 'BT',
    capital: 'Thimphu',
    region: 'AS',
    currency: { code: 'BTN', name: 'Bhutanese ngultrum', symbol: 'Nu.' },
    language: { code: 'dz', name: 'Dzongkha' },
    flag: new URL('flags/bt.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Bolivia (Plurinational State of)',
    code: 'BO',
    capital: 'Sucre',
    region: 'SA',
    currency: { code: 'BOB', name: 'Bolivian boliviano', symbol: 'Bs.' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/bo.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Bonaire, Sint Eustatius and Saba',
    code: 'BQ',
    capital: 'Kralendijk',
    region: 'SA',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'nl', name: 'Dutch' },
    flag: new URL('flags/bq.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Bosnia and Herzegovina',
    code: 'BA',
    capital: 'Sarajevo',
    region: 'EU',
    currency: {
      code: 'BAM',
      name: 'Bosnia and Herzegovina convertible mark',
      symbol: null
    },
    language: { code: 'bs', name: 'Bosnian' },
    flag: new URL('flags/ba.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Botswana',
    code: 'BW',
    capital: 'Gaborone',
    region: 'AF',
    currency: { code: 'BWP', name: 'Botswana pula', symbol: 'P' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/bw.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Bouvet Island',
    code: 'BV',
    capital: '',
    region: 'AN',
    currency: { code: 'NOK', name: 'Norwegian krone', symbol: 'kr' },
    language: { code: 'no', name: 'Norwegian' },
    flag: new URL('flags/bv.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Brazil',
    code: 'BR',
    capital: 'Brasília',
    region: 'SA',
    currency: { code: 'BRL', name: 'Brazilian real', symbol: 'R$' },
    language: { code: 'pt', name: 'Portuguese' },
    flag: new URL('flags/br.svg', config.API_ENDPOINT).href
  },
  {
    name: 'British Indian Ocean Territory',
    code: 'IO',
    capital: 'Diego Garcia',
    region: 'AF',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/io.svg', config.API_ENDPOINT).href
  },
  {
    name: 'United States Minor Outlying Islands',
    code: 'UM',
    capital: '',
    region: 'NA',
    currency: { code: 'USD', name: 'United States Dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/um.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Virgin Islands (British)',
    code: 'VG',
    capital: 'Road Town',
    region: 'NA',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/vg.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Virgin Islands (U.S.)',
    code: 'VI',
    capital: 'Charlotte Amalie',
    region: 'NA',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/vi.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Brunei Darussalam',
    code: 'BN',
    capital: 'Bandar Seri Begawan',
    region: 'AS',
    currency: { code: 'BND', name: 'Brunei dollar', symbol: '$' },
    language: { code: 'ms', name: 'Malay' },
    flag: new URL('flags/bn.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Bulgaria',
    code: 'BG',
    capital: 'Sofia',
    region: 'EU',
    currency: { code: 'BGN', name: 'Bulgarian lev', symbol: 'лв' },
    language: { code: 'bg', name: 'Bulgarian' },
    flag: new URL('flags/bg.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Burkina Faso',
    code: 'BF',
    capital: 'Ouagadougou',
    region: 'AF',
    currency: { code: 'XOF', name: 'West African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/bf.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Burundi',
    code: 'BI',
    capital: 'Bujumbura',
    region: 'AF',
    currency: { code: 'BIF', name: 'Burundian franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/bi.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Cambodia',
    code: 'KH',
    capital: 'Phnom Penh',
    region: 'AS',
    currency: { code: 'KHR', name: 'Cambodian riel', symbol: '៛' },
    language: { code: 'km', name: 'Khmer' },
    flag: new URL('flags/kh.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Cameroon',
    code: 'CM',
    capital: 'Yaoundé',
    region: 'AF',
    currency: { code: 'XAF', name: 'Central African CFA franc', symbol: 'Fr' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/cm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Canada',
    code: 'CA',
    capital: 'Ottawa',
    region: 'NA',
    currency: { code: 'CAD', name: 'Canadian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ca.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Cabo Verde',
    code: 'CV',
    capital: 'Praia',
    region: 'AF',
    currency: { code: 'CVE', name: 'Cape Verdean escudo', symbol: 'Esc' },
    language: {
      code: 'pt',
      iso639_2: 'por',
      name: 'Portuguese',
      nativeName: 'Português'
    },
    flag: new URL('flags/cv.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Cayman Islands',
    code: 'KY',
    capital: 'George Town',
    region: 'NA',
    demonym: 'Caymanian',
    currency: { code: 'KYD', name: 'Cayman Islands dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ky.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Central African Republic',
    code: 'CF',
    capital: 'Bangui',
    region: 'AF',
    currency: { code: 'XAF', name: 'Central African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/cf.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Chad',
    code: 'TD',
    capital: "N'Djamena",
    region: 'AF',
    currency: { code: 'XAF', name: 'Central African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/td.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Chile',
    code: 'CL',
    capital: 'Santiago',
    region: 'SA',
    currency: { code: 'CLP', name: 'Chilean peso', symbol: '$' },
    language: {
      code: 'es',
      iso639_2: 'spa',
      name: 'Spanish',
      nativeName: 'Español'
    },
    flag: new URL('flags/cl.svg', config.API_ENDPOINT).href
  },
  {
    name: 'China',
    code: 'CN',
    capital: 'Beijing',
    region: 'AS',
    currency: { code: 'CNY', name: 'Chinese yuan', symbol: '¥' },
    language: { code: 'zh', name: 'Chinese' },
    flag: new URL('flags/cn.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Christmas Island',
    code: 'CX',
    capital: 'Flying Fish Cove',
    region: 'OC',
    currency: { code: 'AUD', name: 'Australian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/cx.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Cocos (Keeling) Islands',
    code: 'CC',
    capital: 'West Island',
    region: 'OC',
    currency: { code: 'AUD', name: 'Australian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/cc.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Colombia',
    code: 'CO',
    capital: 'Bogotá',
    region: 'SA',
    currency: { code: 'COP', name: 'Colombian peso', symbol: '$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/co.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Comoros',
    code: 'KM',
    capital: 'Moroni',
    region: 'AF',
    currency: { code: 'KMF', name: 'Comorian franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/km.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Congo',
    code: 'CG',
    capital: 'Brazzaville',
    region: 'AF',
    currency: { code: 'XAF', name: 'Central African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/cg.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Congo (Democratic Republic of the)',
    code: 'CD',
    capital: 'Kinshasa',
    region: 'AF',
    currency: { code: 'CDF', name: 'Congolese franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/cd.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Cook Islands',
    code: 'CK',
    capital: 'Avarua',
    region: 'OC',
    currency: { code: 'NZD', name: 'New Zealand dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ck.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Costa Rica',
    code: 'CR',
    capital: 'San José',
    region: 'NA',
    currency: { code: 'CRC', name: 'Costa Rican colón', symbol: '₡' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/cr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Croatia',
    code: 'HR',
    capital: 'Zagreb',
    region: 'EU',
    currency: { code: 'HRK', name: 'Croatian kuna', symbol: 'kn' },
    language: { code: 'hr', name: 'Croatian' },
    flag: new URL('flags/hr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Cuba',
    code: 'CU',
    capital: 'Havana',
    region: 'NA',
    currency: { code: 'CUC', name: 'Cuban convertible peso', symbol: '$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/cu.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Curaçao',
    code: 'CW',
    capital: 'Willemstad',
    region: 'SA',
    currency: {
      code: 'ANG',
      name: 'Netherlands Antillean guilder',
      symbol: 'ƒ'
    },
    language: { code: 'nl', name: 'Dutch' },
    flag: new URL('flags/cw.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Cyprus',
    code: 'CY',
    capital: 'Nicosia',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'tr', name: 'Turkish' },
    flag: new URL('flags/cy.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Czech Republic',
    code: 'CZ',
    capital: 'Prague',
    region: 'EU',
    currency: { code: 'CZK', name: 'Czech koruna', symbol: 'Kč' },
    language: { code: 'cs', name: 'Czech' },
    flag: new URL('flags/cz.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Denmark',
    code: 'DK',
    capital: 'Copenhagen',
    region: 'EU',
    currency: { code: 'DKK', name: 'Danish krone', symbol: 'kr' },
    language: { code: 'da', name: 'Danish' },
    flag: new URL('flags/dk.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Djibouti',
    code: 'DJ',
    capital: 'Djibouti',
    region: 'AF',
    currency: { code: 'DJF', name: 'Djiboutian franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/dj.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Dominica',
    code: 'DM',
    capital: 'Roseau',
    region: 'NA',
    currency: { code: 'XCD', name: 'East Caribbean dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/dm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Dominican Republic',
    code: 'DO',
    capital: 'Santo Domingo',
    region: 'NA',
    currency: { code: 'DOP', name: 'Dominican peso', symbol: '$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/do.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Ecuador',
    code: 'EC',
    capital: 'Quito',
    region: 'SA',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/ec.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Egypt',
    code: 'EG',
    capital: 'Cairo',
    region: 'AF',
    currency: { code: 'EGP', name: 'Egyptian pound', symbol: '£' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/eg.svg', config.API_ENDPOINT).href
  },
  {
    name: 'El Salvador',
    code: 'SV',
    capital: 'San Salvador',
    region: 'NA',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/sv.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Equatorial Guinea',
    code: 'GQ',
    capital: 'Malabo',
    region: 'AF',
    currency: { code: 'XAF', name: 'Central African CFA franc', symbol: 'Fr' },
    language: {
      code: 'es',
      iso639_2: 'spa',
      name: 'Spanish',
      nativeName: 'Español'
    },
    flag: new URL('flags/gq.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Eritrea',
    code: 'ER',
    capital: 'Asmara',
    region: 'AF',
    currency: { code: 'ERN', name: 'Eritrean nakfa', symbol: 'Nfk' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/er.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Estonia',
    code: 'EE',
    capital: 'Tallinn',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'et', name: 'Estonian' },
    flag: new URL('flags/ee.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    capital: 'Addis Ababa',
    region: 'AF',
    currency: { code: 'ETB', name: 'Ethiopian birr', symbol: 'Br' },
    language: { code: 'am', name: 'Amharic' },
    flag: new URL('flags/et.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Falkland Islands (Malvinas)',
    code: 'FK',
    capital: 'Stanley',
    region: 'SA',
    currency: { code: 'FKP', name: 'Falkland Islands pound', symbol: '£' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/fk.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Faroe Islands',
    code: 'FO',
    capital: 'Tórshavn',
    region: 'EU',
    currency: { code: 'DKK', name: 'Danish krone', symbol: 'kr' },
    language: { code: 'fo', name: 'Faroese' },
    flag: new URL('flags/fo.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Fiji',
    code: 'FJ',
    capital: 'Suva',
    region: 'OC',
    currency: { code: 'FJD', name: 'Fijian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/fj.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Finland',
    code: 'FI',
    capital: 'Helsinki',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: {
      code: 'fi',
      iso639_2: 'fin',
      name: 'Finnish',
      nativeName: 'suomi'
    },
    flag: new URL('flags/fi.svg', config.API_ENDPOINT).href
  },
  {
    name: 'France',
    code: 'FR',
    capital: 'Paris',
    region: 'EU',
    demonym: 'French',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/fr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'French Guiana',
    code: 'GF',
    capital: 'Cayenne',
    region: 'SA',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/gf.svg', config.API_ENDPOINT).href
  },
  {
    name: 'French Polynesia',
    code: 'PF',
    capital: 'Papeetē',
    region: 'OC',
    currency: { code: 'XPF', name: 'CFP franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/pf.svg', config.API_ENDPOINT).href
  },
  {
    name: 'French Southern Territories',
    code: 'TF',
    capital: 'Port-aux-Français',
    region: 'AF',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/tf.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Gabon',
    code: 'GA',
    capital: 'Libreville',
    region: 'AF',
    currency: { code: 'XAF', name: 'Central African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/ga.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Gambia',
    code: 'GM',
    capital: 'Banjul',
    region: 'AF',
    currency: { code: 'GMD', name: 'Gambian dalasi', symbol: 'D' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/gm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Georgia',
    code: 'GE',
    capital: 'Tbilisi',
    region: 'AS',
    currency: { code: 'GEL', name: 'Georgian Lari', symbol: 'ლ' },
    language: { code: 'ka', name: 'Georgian' },
    flag: new URL('flags/ge.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Germany',
    code: 'DE',
    capital: 'Berlin',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'de', name: 'German' },
    flag: new URL('flags/de.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Ghana',
    code: 'GH',
    capital: 'Accra',
    region: 'AF',
    currency: { code: 'GHS', name: 'Ghanaian cedi', symbol: '₵' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/gh.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Gibraltar',
    code: 'GI',
    capital: 'Gibraltar',
    region: 'EU',
    currency: { code: 'GIP', name: 'Gibraltar pound', symbol: '£' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/gi.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Greece',
    code: 'GR',
    capital: 'Athens',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'el', name: 'Greek (modern)' },
    flag: new URL('flags/gr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Greenland',
    code: 'GL',
    capital: 'Nuuk',
    region: 'NA',
    currency: { code: 'DKK', name: 'Danish krone', symbol: 'kr' },
    language: { code: 'kl', name: 'Kalaallisut' },
    flag: new URL('flags/gl.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Grenada',
    code: 'GD',
    capital: "St. George's",
    region: 'NA',
    currency: { code: 'XCD', name: 'East Caribbean dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/gd.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Guadeloupe',
    code: 'GP',
    capital: 'Basse-Terre',
    region: 'NA',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/gp.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Guam',
    code: 'GU',
    capital: 'Hagåtña',
    region: 'OC',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/gu.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Guatemala',
    code: 'GT',
    capital: 'Guatemala City',
    region: 'NA',
    currency: { code: 'GTQ', name: 'Guatemalan quetzal', symbol: 'Q' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/gt.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Guernsey',
    code: 'GG',
    capital: 'St. Peter Port',
    region: 'EU',
    currency: { code: 'GBP', name: 'British pound', symbol: '£' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/gg.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Guinea',
    code: 'GN',
    capital: 'Conakry',
    region: 'AF',
    currency: { code: 'GNF', name: 'Guinean franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/gn.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Guinea-Bissau',
    code: 'GW',
    capital: 'Bissau',
    region: 'AF',
    currency: { code: 'XOF', name: 'West African CFA franc', symbol: 'Fr' },
    language: { code: 'pt', name: 'Portuguese' },
    flag: new URL('flags/gw.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Guyana',
    code: 'GY',
    capital: 'Georgetown',
    region: 'SA',
    currency: { code: 'GYD', name: 'Guyanese dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/gy.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Haiti',
    code: 'HT',
    capital: 'Port-au-Prince',
    region: 'Americas',
    currency: { code: 'HTG', name: 'Haitian gourde', symbol: 'G' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/ht.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Heard Island and McDonald Islands',
    code: 'HM',
    capital: '',
    region: '',
    currency: { code: 'AUD', name: 'Australian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/hm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Holy See',
    code: 'VA',
    capital: 'Rome',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/va.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Honduras',
    code: 'HN',
    capital: 'Tegucigalpa',
    region: 'NA',
    currency: { code: 'HNL', name: 'Honduran lempira', symbol: 'L' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/hn.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Hong Kong',
    code: 'HK',
    capital: 'City of Victoria',
    region: 'AS',
    currency: { code: 'HKD', name: 'Hong Kong dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/hk.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Hungary',
    code: 'HU',
    capital: 'Budapest',
    region: 'EU',
    currency: { code: 'HUF', name: 'Hungarian forint', symbol: 'Ft' },
    language: { code: 'hu', name: 'Hungarian' },
    flag: new URL('flags/hu.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Iceland',
    code: 'IS',
    capital: 'Reykjavík',
    region: 'EU',
    currency: { code: 'ISK', name: 'Icelandic króna', symbol: 'kr' },
    language: { code: 'is', name: 'Icelandic' },
    flag: new URL('flags/is.svg', config.API_ENDPOINT).href
  },
  {
    name: 'India',
    code: 'IN',
    capital: 'New Delhi',
    region: 'AS',
    currency: { code: 'INR', name: 'Indian rupee', symbol: '₹' },
    language: { code: 'hi', name: 'Hindi' },
    flag: new URL('flags/in.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Indonesia',
    code: 'ID',
    capital: 'Jakarta',
    region: 'AS',
    currency: { code: 'IDR', name: 'Indonesian rupiah', symbol: 'Rp' },
    language: { code: 'id', name: 'Indonesian' },
    flag: new URL('flags/id.svg', config.API_ENDPOINT).href
  },
  {
    name: "Côte d'Ivoire",
    code: 'CI',
    capital: 'Yamoussoukro',
    region: 'AF',
    currency: { code: 'XOF', name: 'West African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/ci.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Iran (Islamic Republic of)',
    code: 'IR',
    capital: 'Tehran',
    region: 'AS',
    currency: { code: 'IRR', name: 'Iranian rial', symbol: '﷼' },
    language: { code: 'fa', name: 'Persian (Farsi)' },
    flag: new URL('flags/ir.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Iraq',
    code: 'IQ',
    capital: 'Baghdad',
    region: 'AS',
    currency: { code: 'IQD', name: 'Iraqi dinar', symbol: 'ع.د' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/iq.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Ireland',
    code: 'IE',
    capital: 'Dublin',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'ga', name: 'Irish' },
    flag: new URL('flags/ie.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Isle of Man',
    code: 'IM',
    capital: 'Douglas',
    region: 'EU',
    currency: { code: 'GBP', name: 'British pound', symbol: '£' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/im.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Israel',
    code: 'IL',
    capital: 'Jerusalem',
    region: 'AS',
    currency: { code: 'ILS', name: 'Israeli new shekel', symbol: '₪' },
    language: { code: 'he', name: 'Hebrew (modern)' },
    flag: new URL('flags/il.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Italy',
    code: 'IT',
    capital: 'Rome',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'it', name: 'Italian' },
    flag: new URL('flags/it.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Jamaica',
    code: 'JM',
    capital: 'Kingston',
    region: 'NA',
    currency: { code: 'JMD', name: 'Jamaican dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/jm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Japan',
    code: 'JP',
    capital: 'Tokyo',
    region: 'AS',
    currency: { code: 'JPY', name: 'Japanese yen', symbol: '¥' },
    language: { code: 'ja', name: 'Japanese' },
    flag: new URL('flags/jp.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Jersey',
    code: 'JE',
    capital: 'Saint Helier',
    region: 'EU',
    currency: { code: 'GBP', name: 'British pound', symbol: '£' },
    language: {
      code: 'en',
      iso639_2: 'eng',
      name: 'English',
      nativeName: 'English'
    },
    flag: new URL('flags/je.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Jordan',
    code: 'JO',
    capital: 'Amman',
    region: 'AS',
    currency: { code: 'JOD', name: 'Jordanian dinar', symbol: 'د.ا' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/jo.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Kazakhstan',
    code: 'KZ',
    capital: 'Astana',
    region: 'AS',
    currency: { code: 'KZT', name: 'Kazakhstani tenge', symbol: null },
    language: { code: 'kk', name: 'Kazakh' },
    flag: new URL('flags/kz.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Kenya',
    code: 'KE',
    capital: 'Nairobi',
    region: 'AF',
    currency: { code: 'KES', name: 'Kenyan shilling', symbol: 'Sh' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ke.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Kiribati',
    code: 'KI',
    capital: 'South Tarawa',
    region: 'OC',
    currency: { code: 'AUD', name: 'Australian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ki.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Kuwait',
    code: 'KW',
    capital: 'Kuwait City',
    region: 'AS',
    currency: { code: 'KWD', name: 'Kuwaiti dinar', symbol: 'د.ك' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/kw.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Kyrgyzstan',
    code: 'KG',
    capital: 'Bishkek',
    region: 'AS',
    currency: { code: 'KGS', name: 'Kyrgyzstani som', symbol: 'с' },
    language: { code: 'ky', name: 'Kyrgyz' },
    flag: new URL('flags/kg.svg', config.API_ENDPOINT).href
  },
  {
    name: "Lao People's Democratic Republic",
    code: 'LA',
    capital: 'Vientiane',
    region: 'AS',
    currency: { code: 'LAK', name: 'Lao kip', symbol: '₭' },
    language: { code: 'lo', name: 'Lao' },
    flag: new URL('flags/la.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Latvia',
    code: 'LV',
    capital: 'Riga',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'lv', name: 'Latvian' },
    flag: new URL('flags/lv.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Lebanon',
    code: 'LB',
    capital: 'Beirut',
    region: 'AS',
    currency: { code: 'LBP', name: 'Lebanese pound', symbol: 'ل.ل' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/lb.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Lesotho',
    code: 'LS',
    capital: 'Maseru',
    region: 'AF',
    currency: { code: 'LSL', name: 'Lesotho loti', symbol: 'L' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ls.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Liberia',
    code: 'LR',
    capital: 'Monrovia',
    region: 'AF',
    currency: { code: 'LRD', name: 'Liberian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/lr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Libya',
    code: 'LY',
    capital: 'Tripoli',
    region: 'AF',
    currency: { code: 'LYD', name: 'Libyan dinar', symbol: 'ل.د' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/ly.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Liechtenstein',
    code: 'LI',
    capital: 'Vaduz',
    region: 'EU',
    currency: { code: 'CHF', name: 'Swiss franc', symbol: 'Fr' },
    language: { code: 'de', name: 'German' },
    flag: new URL('flags/li.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Lithuania',
    code: 'LT',
    capital: 'Vilnius',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'lt', name: 'Lithuanian' },
    flag: new URL('flags/lt.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Luxembourg',
    code: 'LU',
    capital: 'Luxembourg',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/lu.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Macao',
    code: 'MO',
    capital: '',
    region: 'AS',
    currency: { code: 'MOP', name: 'Macanese pataca', symbol: 'P' },
    language: { code: 'zh', name: 'Chinese' },
    flag: new URL('flags/mo.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Macedonia (the former Yugoslav Republic of)',
    code: 'MK',
    capital: 'Skopje',
    region: 'EU',
    currency: { code: 'MKD', name: 'Macedonian denar', symbol: 'ден' },
    language: { code: 'mk', name: 'Macedonian' },
    flag: new URL('flags/mk.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Madagascar',
    code: 'MG',
    capital: 'Antananarivo',
    region: 'AF',
    currency: { code: 'MGA', name: 'Malagasy ariary', symbol: 'Ar' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/mg.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Malawi',
    code: 'MW',
    capital: 'Lilongwe',
    region: 'AF',
    currency: { code: 'MWK', name: 'Malawian kwacha', symbol: 'MK' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/mw.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Malaysia',
    code: 'MY',
    capital: 'Kuala Lumpur',
    region: 'AS',
    currency: { code: 'MYR', name: 'Malaysian ringgit', symbol: 'RM' },
    language: { code: null, name: 'Malaysian' },
    flag: new URL('flags/my.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Maldives',
    code: 'MV',
    capital: 'Malé',
    region: 'AS',
    currency: { code: 'MVR', name: 'Maldivian rufiyaa', symbol: '.ރ' },
    language: { code: 'dv', name: 'Divehi' },
    flag: new URL('flags/mv.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Mali',
    code: 'ML',
    capital: 'Bamako',
    region: 'AF',
    currency: { code: 'XOF', name: 'West African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/ml.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Malta',
    code: 'MT',
    capital: 'Valletta',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'mt', name: 'Maltese' },
    flag: new URL('flags/mt.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Marshall Islands',
    code: 'MH',
    capital: 'Majuro',
    region: 'OC',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/mh.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Martinique',
    code: 'MQ',
    capital: 'Fort-de-France',
    region: 'Americas',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/mq.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Mauritania',
    code: 'MR',
    capital: 'Nouakchott',
    region: 'AF',
    currency: { code: 'MRO', name: 'Mauritanian ouguiya', symbol: 'UM' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/mr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Mauritius',
    code: 'MU',
    capital: 'Port Louis',
    region: 'AF',
    currency: { code: 'MUR', name: 'Mauritian rupee', symbol: '₨' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/mu.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Mayotte',
    code: 'YT',
    capital: 'Mamoudzou',
    region: 'AF',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/yt.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Mexico',
    code: 'MX',
    capital: 'Mexico City',
    region: 'NA',
    currency: { code: 'MXN', name: 'Mexican peso', symbol: '$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/mx.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Micronesia (Federated States of)',
    code: 'FM',
    capital: 'Palikir',
    region: 'OC',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/fm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Moldova (Republic of)',
    code: 'MD',
    capital: 'Chișinău',
    region: 'EU',
    currency: { code: 'MDL', name: 'Moldovan leu', symbol: 'L' },
    language: { code: 'ro', name: 'Romanian' },
    flag: new URL('flags/md.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Monaco',
    code: 'MC',
    capital: 'Monaco',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/mc.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Mongolia',
    code: 'MN',
    capital: 'Ulan Bator',
    region: 'AS',
    currency: { code: 'MNT', name: 'Mongolian tögrög', symbol: '₮' },
    language: { code: 'mn', name: 'Mongolian' },
    flag: new URL('flags/mn.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Montenegro',
    code: 'ME',
    capital: 'Podgorica',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'sr', name: 'Serbian' },
    flag: new URL('flags/me.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Montserrat',
    code: 'MS',
    capital: 'Plymouth',
    region: 'NA',
    currency: { code: 'XCD', name: 'East Caribbean dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ms.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Morocco',
    code: 'MA',
    capital: 'Rabat',
    region: 'AF',
    currency: { code: 'MAD', name: 'Moroccan dirham', symbol: 'د.م.' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/ma.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Mozambique',
    code: 'MZ',
    capital: 'Maputo',
    region: 'AF',
    currency: { code: 'MZN', name: 'Mozambican metical', symbol: 'MT' },
    language: { code: 'pt', name: 'Portuguese' },
    flag: new URL('flags/mz.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Myanmar',
    code: 'MM',
    capital: 'Naypyidaw',
    region: 'AS',
    currency: { code: 'MMK', name: 'Burmese kyat', symbol: 'Ks' },
    language: { code: 'my', name: 'Burmese' },
    flag: new URL('flags/mm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Namibia',
    code: 'NA',
    capital: 'Windhoek',
    region: 'AF',
    currency: { code: 'NAD', name: 'Namibian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/na.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Nauru',
    code: 'NR',
    capital: 'Yaren',
    region: 'OC',
    currency: { code: 'AUD', name: 'Australian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/nr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Nepal',
    code: 'NP',
    capital: 'Kathmandu',
    region: 'AS',
    currency: { code: 'NPR', name: 'Nepalese rupee', symbol: '₨' },
    language: { code: 'ne', name: 'Nepali' },
    flag: new URL('flags/np.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Netherlands',
    code: 'NL',
    capital: 'Amsterdam',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'nl', name: 'Dutch' },
    flag: new URL('flags/nl.svg', config.API_ENDPOINT).href
  },
  {
    name: 'New Caledonia',
    code: 'NC',
    capital: 'Nouméa',
    region: 'OC',
    currency: { code: 'XPF', name: 'CFP franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/nc.svg', config.API_ENDPOINT).href
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    capital: 'Wellington',
    region: 'OC',
    currency: { code: 'NZD', name: 'New Zealand dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/nz.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Nicaragua',
    code: 'NI',
    capital: 'Managua',
    region: 'NA',
    currency: { code: 'NIO', name: 'Nicaraguan córdoba', symbol: 'C$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/ni.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Niger',
    code: 'NE',
    capital: 'Niamey',
    region: 'AF',
    currency: { code: 'XOF', name: 'West African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/ne.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Nigeria',
    code: 'NG',
    capital: 'Abuja',
    region: 'AF',
    currency: { code: 'NGN', name: 'Nigerian naira', symbol: '₦' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ng.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Niue',
    code: 'NU',
    capital: 'Alofi',
    region: 'OC',
    currency: { code: 'NZD', name: 'New Zealand dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/nu.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Norfolk Island',
    code: 'NF',
    capital: 'Kingston',
    region: 'OC',
    currency: { code: 'AUD', name: 'Australian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/nf.svg', config.API_ENDPOINT).href
  },
  {
    name: "Korea (Democratic People's Republic of)",
    code: 'KP',
    capital: 'Pyongyang',
    region: 'AS',
    currency: { code: 'KPW', name: 'North Korean won', symbol: '₩' },
    language: { code: 'ko', name: 'Korean' },
    flag: new URL('flags/kp.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Northern Mariana Islands',
    code: 'MP',
    capital: 'Saipan',
    region: 'OC',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/mp.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Norway',
    code: 'NO',
    capital: 'Oslo',
    region: 'EU',
    currency: { code: 'NOK', name: 'Norwegian krone', symbol: 'kr' },
    language: { code: 'no', name: 'Norwegian' },
    flag: new URL('flags/no.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Oman',
    code: 'OM',
    capital: 'Muscat',
    region: 'AS',
    currency: { code: 'OMR', name: 'Omani rial', symbol: 'ر.ع.' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/om.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Pakistan',
    code: 'PK',
    capital: 'Islamabad',
    region: 'AS',
    currency: { code: 'PKR', name: 'Pakistani rupee', symbol: '₨' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/pk.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Palau',
    code: 'PW',
    capital: 'Ngerulmud',
    region: 'OC',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/pw.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Palestine, State of',
    code: 'PS',
    capital: 'Ramallah',
    region: 'AS',
    currency: { code: 'ILS', name: 'Israeli new sheqel', symbol: '₪' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/ps.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Panama',
    code: 'PA',
    capital: 'Panama City',
    region: 'NA',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/pa.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Papua New Guinea',
    code: 'PG',
    capital: 'Port Moresby',
    region: 'OC',
    currency: { code: 'PGK', name: 'Papua New Guinean kina', symbol: 'K' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/pg.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Paraguay',
    code: 'PY',
    capital: 'Asunción',
    region: 'SA',
    currency: { code: 'PYG', name: 'Paraguayan guaraní', symbol: '₲' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/py.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Peru',
    code: 'PE',
    capital: 'Lima',
    region: 'SA',
    currency: { code: 'PEN', name: 'Peruvian sol', symbol: 'S/.' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/pe.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Philippines',
    code: 'PH',
    capital: 'Manila',
    region: 'AS',
    currency: { code: 'PHP', name: 'Philippine peso', symbol: '₱' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ph.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Pitcairn',
    code: 'PN',
    capital: 'Adamstown',
    region: 'OC',
    currency: { code: 'NZD', name: 'New Zealand dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/pn.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Poland',
    code: 'PL',
    capital: 'Warsaw',
    region: 'EU',
    currency: { code: 'PLN', name: 'Polish złoty', symbol: 'zł' },
    language: { code: 'pl', name: 'Polish' },
    flag: new URL('flags/pl.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Portugal',
    code: 'PT',
    capital: 'Lisbon',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'pt', name: 'Portuguese' },
    flag: new URL('flags/pt.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Puerto Rico',
    code: 'PR',
    capital: 'San Juan',
    region: 'NA',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/pr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Qatar',
    code: 'QA',
    capital: 'Doha',
    region: 'AS',
    currency: { code: 'QAR', name: 'Qatari riyal', symbol: 'ر.ق' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/qa.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Republic of Kosovo',
    code: 'XK',
    capital: 'Pristina',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'sq', name: 'Albanian' },
    flag: new URL('flags/xk.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Réunion',
    code: 'RE',
    capital: 'Saint-Denis',
    region: 'AF',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/re.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Romania',
    code: 'RO',
    capital: 'Bucharest',
    region: 'EU',
    currency: { code: 'RON', name: 'Romanian leu', symbol: 'lei' },
    language: { code: 'ro', name: 'Romanian' },
    flag: new URL('flags/ro.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Russian Federation',
    code: 'RU',
    capital: 'Moscow',
    region: 'EU',
    currency: { code: 'RUB', name: 'Russian ruble', symbol: '₽' },
    language: { code: 'ru', name: 'Russian' },
    flag: new URL('flags/ru.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Rwanda',
    code: 'RW',
    capital: 'Kigali',
    region: 'AF',
    currency: { code: 'RWF', name: 'Rwandan franc', symbol: 'Fr' },
    language: { code: 'rw', name: 'Kinyarwanda' },
    flag: new URL('flags/rw.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Saint Barthélemy',
    code: 'BL',
    capital: 'Gustavia',
    region: 'NA',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/bl.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Saint Helena, Ascension and Tristan da Cunha',
    code: 'SH',
    capital: 'Jamestown',
    region: 'AF',
    currency: { code: 'SHP', name: 'Saint Helena pound', symbol: '£' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/sh.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Saint Kitts and Nevis',
    code: 'KN',
    capital: 'Basseterre',
    region: 'NA',
    currency: { code: 'XCD', name: 'East Caribbean dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/kn.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Saint Lucia',
    code: 'LC',
    capital: 'Castries',
    region: 'NA',
    currency: { code: 'XCD', name: 'East Caribbean dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/lc.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Saint Martin (French part)',
    code: 'MF',
    capital: 'Marigot',
    region: 'NA',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/mf.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Saint Pierre and Miquelon',
    code: 'PM',
    capital: 'Saint-Pierre',
    region: 'NA',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/pm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Saint Vincent and the Grenadines',
    code: 'VC',
    capital: 'Kingstown',
    region: 'NA',
    currency: { code: 'XCD', name: 'East Caribbean dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/vc.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Samoa',
    code: 'WS',
    capital: 'Apia',
    region: 'OC',
    currency: { code: 'WST', name: 'Samoan tālā', symbol: 'T' },
    language: { code: 'sm', name: 'Samoan' },
    flag: new URL('flags/ws.svg', config.API_ENDPOINT).href
  },
  {
    name: 'San Marino',
    code: 'SM',
    capital: 'City of San Marino',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'it', name: 'Italian' },
    flag: new URL('flags/sm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Sao Tome and Principe',
    code: 'ST',
    capital: 'São Tomé',
    region: 'AF',
    currency: {
      code: 'STD',
      name: 'São Tomé and Príncipe dobra',
      symbol: 'Db'
    },
    language: { code: 'pt', name: 'Portuguese' },
    flag: new URL('flags/st.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    capital: 'Riyadh',
    region: 'AS',
    currency: { code: 'SAR', name: 'Saudi riyal', symbol: 'ر.س' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/sa.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Senegal',
    code: 'SN',
    capital: 'Dakar',
    region: 'AF',
    currency: { code: 'XOF', name: 'West African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/sn.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Serbia',
    code: 'RS',
    capital: 'Belgrade',
    region: 'EU',
    currency: { code: 'RSD', name: 'Serbian dinar', symbol: 'дин.' },
    language: { code: 'sr', name: 'Serbian' },
    flag: new URL('flags/rs.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Seychelles',
    code: 'SC',
    capital: 'Victoria',
    region: 'AF',
    currency: { code: 'SCR', name: 'Seychellois rupee', symbol: '₨' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/sc.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Sierra Leone',
    code: 'SL',
    capital: 'Freetown',
    region: 'AF',
    currency: { code: 'SLL', name: 'Sierra Leonean leone', symbol: 'Le' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/sl.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Singapore',
    code: 'SG',
    capital: 'Singapore',
    region: 'AS',
    currency: { code: 'SGD', name: 'Singapore dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/sg.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Sint Maarten (Dutch part)',
    code: 'SX',
    capital: 'Philipsburg',
    region: 'Americas',
    currency: {
      code: 'ANG',
      name: 'Netherlands Antillean guilder',
      symbol: 'ƒ'
    },
    language: { code: 'nl', name: 'Dutch' },
    flag: new URL('flags/sx.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Slovakia',
    code: 'SK',
    capital: 'Bratislava',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'sk', name: 'Slovak' },
    flag: new URL('flags/sk.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Slovenia',
    code: 'SI',
    capital: 'Ljubljana',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'sl', name: 'Slovene' },
    flag: new URL('flags/si.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Solomon Islands',
    code: 'SB',
    capital: 'Honiara',
    region: 'OC',
    currency: { code: 'SBD', name: 'Solomon Islands dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/sb.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Somalia',
    code: 'SO',
    capital: 'Mogadishu',
    region: 'AF',
    currency: { code: 'SOS', name: 'Somali shilling', symbol: 'Sh' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/so.svg', config.API_ENDPOINT).href
  },
  {
    name: 'South Africa',
    code: 'ZA',
    capital: 'Pretoria',
    region: 'AF',
    currency: { code: 'ZAR', name: 'South African rand', symbol: 'R' },
    language: {
      code: 'en',
      iso639_2: 'eng',
      name: 'English',
      nativeName: 'English'
    },
    flag: new URL('flags/za.svg', config.API_ENDPOINT).href
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    code: 'GS',
    capital: 'King Edward Point',
    region: 'NA',
    currency: { code: 'GBP', name: 'British pound', symbol: '£' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/gs.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Korea (Republic of)',
    code: 'KR',
    capital: 'Seoul',
    region: 'AS',
    currency: { code: 'KRW', name: 'South Korean won', symbol: '₩' },
    language: { code: 'ko', name: 'Korean' },
    flag: new URL('flags/kr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'South Sudan',
    code: 'SS',
    capital: 'Juba',
    region: 'AF',
    currency: { code: 'SSP', name: 'South Sudanese pound', symbol: '£' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ss.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Spain',
    code: 'ES',
    capital: 'Madrid',
    region: 'EU',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/es.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Sri Lanka',
    code: 'LK',
    capital: 'Colombo',
    region: 'AS',
    currency: { code: 'LKR', name: 'Sri Lankan rupee', symbol: 'Rs' },
    language: {
      code: 'si',
      iso639_2: 'sin',
      name: 'Sinhalese',
      nativeName: 'සිංහල'
    },
    flag: new URL('flags/lk.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Sudan',
    code: 'SD',
    capital: 'Khartoum',
    region: 'AF',
    currency: { code: 'SDG', name: 'Sudanese pound', symbol: 'ج.س.' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/sd.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Suriname',
    code: 'SR',
    capital: 'Paramaribo',
    region: 'SA',
    currency: { code: 'SRD', name: 'Surinamese dollar', symbol: '$' },
    language: { code: 'nl', name: 'Dutch' },
    flag: new URL('flags/sr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Svalbard and Jan Mayen',
    code: 'SJ',
    capital: 'Longyearbyen',
    region: 'EU',
    currency: { code: 'NOK', name: 'Norwegian krone', symbol: 'kr' },
    language: { code: 'no', name: 'Norwegian' },
    flag: new URL('flags/sj.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Swaziland',
    code: 'SZ',
    capital: 'Lobamba',
    region: 'AF',
    currency: { code: 'SZL', name: 'Swazi lilangeni', symbol: 'L' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/sz.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Sweden',
    code: 'SE',
    capital: 'Stockholm',
    region: 'EU',
    currency: { code: 'SEK', name: 'Swedish krona', symbol: 'kr' },
    language: { code: 'sv', name: 'Swedish' },
    flag: new URL('flags/se.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Switzerland',
    code: 'CH',
    capital: 'Bern',
    region: 'EU',
    currency: { code: 'CHF', name: 'Swiss franc', symbol: 'Fr' },
    language: { code: 'de', name: 'German' },
    flag: new URL('flags/ch.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Syrian Arab Republic',
    code: 'SY',
    capital: 'Damascus',
    region: 'AS',
    currency: { code: 'SYP', name: 'Syrian pound', symbol: '£' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/sy.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Taiwan',
    code: 'TW',
    capital: 'Taipei',
    region: 'AS',
    currency: { code: 'TWD', name: 'New Taiwan dollar', symbol: '$' },
    language: { code: 'zh', name: 'Chinese' },
    flag: new URL('flags/tw.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Tajikistan',
    code: 'TJ',
    capital: 'Dushanbe',
    region: 'AS',
    currency: { code: 'TJS', name: 'Tajikistani somoni', symbol: 'ЅМ' },
    language: { code: 'tg', name: 'Tajik' },
    flag: new URL('flags/tj.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Tanzania, United Republic of',
    code: 'TZ',
    capital: 'Dodoma',
    region: 'AF',
    currency: { code: 'TZS', name: 'Tanzanian shilling', symbol: 'Sh' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/tz.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Thailand',
    code: 'TH',
    capital: 'Bangkok',
    region: 'AS',
    currency: { code: 'THB', name: 'Thai baht', symbol: '฿' },
    language: { code: 'th', name: 'Thai' },
    flag: new URL('flags/th.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Timor-Leste',
    code: 'TL',
    capital: 'Dili',
    region: 'AS',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'pt', name: 'Portuguese' },
    flag: new URL('flags/tl.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Togo',
    code: 'TG',
    capital: 'Lomé',
    region: 'AF',
    currency: { code: 'XOF', name: 'West African CFA franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/tg.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Tokelau',
    code: 'TK',
    capital: 'Fakaofo',
    region: 'OC',
    currency: { code: 'NZD', name: 'New Zealand dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/tk.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Tonga',
    code: 'TO',
    capital: "Nuku'alofa",
    region: 'OC',
    currency: { code: 'TOP', name: 'Tongan paʻanga', symbol: 'T$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/to.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Trinidad and Tobago',
    code: 'TT',
    capital: 'Port of Spain',
    region: 'SA',
    currency: { code: 'TTD', name: 'Trinidad and Tobago dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/tt.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Tunisia',
    code: 'TN',
    capital: 'Tunis',
    region: 'AF',
    currency: { code: 'TND', name: 'Tunisian dinar', symbol: 'د.ت' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/tn.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Turkey',
    code: 'TR',
    capital: 'Ankara',
    region: 'AS',
    currency: { code: 'TRY', name: 'Turkish lira', symbol: null },
    language: { code: 'tr', name: 'Turkish' },
    flag: new URL('flags/tr.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Turkmenistan',
    code: 'TM',
    capital: 'Ashgabat',
    region: 'AS',
    currency: { code: 'TMT', name: 'Turkmenistan manat', symbol: 'm' },
    language: { code: 'tk', name: 'Turkmen' },
    flag: new URL('flags/tm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Turks and Caicos Islands',
    code: 'TC',
    capital: 'Cockburn Town',
    region: 'NA',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/tc.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Tuvalu',
    code: 'TV',
    capital: 'Funafuti',
    region: 'OC',
    currency: { code: 'AUD', name: 'Australian dollar', symbol: '$' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/tv.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Uganda',
    code: 'UG',
    capital: 'Kampala',
    region: 'AF',
    currency: { code: 'UGX', name: 'Ugandan shilling', symbol: 'Sh' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/ug.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Ukraine',
    code: 'UA',
    capital: 'Kiev',
    region: 'EU',
    currency: { code: 'UAH', name: 'Ukrainian hryvnia', symbol: '₴' },
    language: { code: 'uk', name: 'Ukrainian' },
    flag: new URL('flags/ua.svg', config.API_ENDPOINT).href
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    capital: 'Abu Dhabi',
    region: 'AS',
    currency: {
      code: 'AED',
      name: 'United Arab Emirates dirham',
      symbol: 'د.إ'
    },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/ae.svg', config.API_ENDPOINT).href
  },
  {
    name: 'United Kingdom of Great Britain and Northern Ireland',
    code: 'GB',
    capital: 'London',
    region: 'EU',
    currency: { code: 'GBP', name: 'British pound', symbol: '£' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/gb.svg', config.API_ENDPOINT).href
  },
  {
    name: 'United States of America',
    code: 'US',
    capital: 'Washington, D.C.',
    region: 'NA',
    currency: { code: 'USD', name: 'United States dollar', symbol: '$' },
    language: {
      code: 'en',
      iso639_2: 'eng',
      name: 'English',
      nativeName: 'English'
    },
    flag: new URL('flags/us.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Uruguay',
    code: 'UY',
    capital: 'Montevideo',
    region: 'SA',
    currency: { code: 'UYU', name: 'Uruguayan peso', symbol: '$' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/uy.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Uzbekistan',
    code: 'UZ',
    capital: 'Tashkent',
    region: 'AS',
    currency: { code: 'UZS', name: "Uzbekistani so'm", symbol: null },
    language: { code: 'uz', name: 'Uzbek' },
    flag: new URL('flags/uz.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Vanuatu',
    code: 'VU',
    capital: 'Port Vila',
    region: 'OC',
    currency: { code: 'VUV', name: 'Vanuatu vatu', symbol: 'Vt' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/vu.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Venezuela (Bolivarian Republic of)',
    code: 'VE',
    capital: 'Caracas',
    region: 'SA',
    currency: { code: 'VEF', name: 'Venezuelan bolívar', symbol: 'Bs F' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/ve.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Viet Nam',
    code: 'VN',
    capital: 'Hanoi',
    region: 'AS',
    currency: { code: 'VND', name: 'Vietnamese đồng', symbol: '₫' },
    language: { code: 'vi', name: 'Vietnamese' },
    flag: new URL('flags/vn.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Wallis and Futuna',
    code: 'WF',
    capital: 'Mata-Utu',
    region: 'OC',
    currency: { code: 'XPF', name: 'CFP franc', symbol: 'Fr' },
    language: { code: 'fr', name: 'French' },
    flag: new URL('flags/wf.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Western Sahara',
    code: 'EH',
    capital: 'El Aaiún',
    region: 'AF',
    currency: { code: 'MAD', name: 'Moroccan dirham', symbol: 'د.م.' },
    language: { code: 'es', name: 'Spanish' },
    flag: new URL('flags/eh.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Yemen',
    code: 'YE',
    capital: "Sana'a",
    region: 'AS',
    currency: { code: 'YER', name: 'Yemeni rial', symbol: '﷼' },
    language: { code: 'ar', name: 'Arabic' },
    flag: new URL('flags/ye.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Zambia',
    code: 'ZM',
    capital: 'Lusaka',
    region: 'AF',
    currency: { code: 'ZMW', name: 'Zambian kwacha', symbol: 'ZK' },
    language: { code: 'en', name: 'English' },
    flag: new URL('flags/zm.svg', config.API_ENDPOINT).href
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
    capital: 'Harare',
    region: 'AF',
    currency: { code: 'BWP', name: 'Botswana pula', symbol: 'P' },
    language: {
      code: 'en',
      iso639_2: 'eng',
      name: 'English',
      nativeName: 'English'
    },
    flag: new URL('flags/zw.svg', config.API_ENDPOINT).href
  }
];
