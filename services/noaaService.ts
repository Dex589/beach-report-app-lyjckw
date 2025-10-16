
import { BeachConditions, TideInfo } from '@/types/beach';

// NOAA API endpoints
const NOAA_TIDES_API = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
const NOAA_WEATHER_API = 'https://api.weather.gov/points';

// Station IDs for each beach location - mapped to nearest NOAA tide stations
export const NOAA_STATIONS: Record<string, { 
  tideStation: string; 
  weatherLat: number; 
  weatherLon: number;
}> = {
  // Florida Beaches
  '1': { tideStation: '8720030', weatherLat: 30.6719, weatherLon: -81.4651 }, // Amelia Island - Fernandina Beach
  '2': { tideStation: '8726384', weatherLat: 27.5314, weatherLon: -82.7326 }, // Anna Maria Island
  '8': { tideStation: '8723214', weatherLat: 25.8915, weatherLon: -80.1248 }, // Bal Harbour
  '13': { tideStation: '8726724', weatherLat: 27.9192, weatherLon: -82.8376 }, // Belleair Beach
  '17': { tideStation: '8723970', weatherLat: 24.6696, weatherLon: -81.3534 }, // Big Pine Key
  '20': { tideStation: '8725110', weatherLat: 26.7273, weatherLon: -82.2626 }, // Boca Grande
  '22': { tideStation: '8725110', weatherLat: 26.3398, weatherLon: -81.8773 }, // Bonita Springs
  '28': { tideStation: '8726724', weatherLat: 28.0089, weatherLon: -82.8065 }, // Caladesi Island
  '34': { tideStation: '8725110', weatherLat: 26.5320, weatherLon: -82.1876 }, // Captiva Island
  '37': { tideStation: '8726384', weatherLat: 27.1253, weatherLon: -82.4959 }, // Casey Key
  '39': { tideStation: '8726724', weatherLat: 27.9659, weatherLon: -82.8001 }, // Clearwater Beach
  '40': { tideStation: '8721604', weatherLat: 28.3200, weatherLon: -80.6076 }, // Cocoa Beach
  '46': { tideStation: '8726724', weatherLat: 28.0856, weatherLon: -82.7873 }, // Crystal Beach
  '48': { tideStation: '8721120', weatherLat: 29.2108, weatherLon: -81.0228 }, // Daytona Beach
  '49': { tideStation: '8722670', weatherLat: 26.3184, weatherLon: -80.0998 }, // Deerfield Beach
  '58': { tideStation: '8725110', weatherLat: 26.9620, weatherLon: -82.3526 }, // Englewood Beach
  '61': { tideStation: '8720219', weatherLat: 29.4730, weatherLon: -81.1284 }, // Flagler Beach
  '64': { tideStation: '8722670', weatherLat: 26.1224, weatherLon: -80.1373 }, // Fort Lauderdale Beach
  '65': { tideStation: '8725110', weatherLat: 26.4518, weatherLon: -81.9484 }, // Fort Myers Beach
  '74': { tideStation: '8723214', weatherLat: 25.9812, weatherLon: -80.1248 }, // Hallandale Beach
  
  // New Jersey Beaches
  '3': { tideStation: '8531680', weatherLat: 40.2204, weatherLon: -74.0121 }, // Asbury Park
  '5': { tideStation: '8534720', weatherLat: 39.3643, weatherLon: -74.4229 }, // Atlantic City
  '6': { tideStation: '8536110', weatherLat: 39.1007, weatherLon: -74.7165 }, // Avalon Beach
  '11': { tideStation: '8533840', weatherLat: 39.7543, weatherLon: -74.1065 }, // Barnegat Light
  '12': { tideStation: '8533840', weatherLat: 39.5593, weatherLon: -74.2432 }, // Beach Haven
  '14': { tideStation: '8531680', weatherLat: 40.1785, weatherLon: -74.0218 }, // Belmar
  '23': { tideStation: '8531680', weatherLat: 40.2026, weatherLon: -74.0121 }, // Bradley Beach
  '24': { tideStation: '8533840', weatherLat: 39.6493, weatherLon: -74.1876 }, // Brant Beach
  '32': { tideStation: '8536110', weatherLat: 38.9351, weatherLon: -74.9060 }, // Cape May
  
  // Maryland Beaches
  '4': { tideStation: '8570283', weatherLat: 38.2211, weatherLon: -75.1535 }, // Assateague Island
  
  // North Carolina Beaches
  '7': { tideStation: '8654467', weatherLat: 35.3532, weatherLon: -75.5063 }, // Avon
  '27': { tideStation: '8654467', weatherLat: 35.2693, weatherLon: -75.5396 }, // Buxton
  '31': { tideStation: '8654467', weatherLat: 35.2226, weatherLon: -75.5297 }, // Cape Hatteras
  '42': { tideStation: '8651370', weatherLat: 36.3765, weatherLon: -75.8268 }, // Corolla
  '53': { tideStation: '8651370', weatherLat: 36.1593, weatherLon: -75.7460 }, // Duck
  '67': { tideStation: '8654467', weatherLat: 35.2382, weatherLon: -75.6235 }, // Frisco
  
  // Oregon Beaches
  '9': { tideStation: '9432780', weatherLat: 43.1190, weatherLon: -124.4084 }, // Bandon Beach
  '25': { tideStation: '9431647', weatherLat: 42.0526, weatherLon: -124.2840 }, // Brookings Beach
  '29': { tideStation: '9435380', weatherLat: 45.8918, weatherLon: -123.9615 }, // Cannon Beach
  '62': { tideStation: '9434098', weatherLat: 43.9829, weatherLon: -124.1012 }, // Florence Beach
  '69': { tideStation: '9431647', weatherLat: 42.4071, weatherLon: -124.4218 }, // Gold Beach
  
  // Maine Beaches
  '10': { tideStation: '8413320', weatherLat: 44.3876, weatherLon: -68.2039 }, // Bar Harbor
  
  // Mississippi Beaches
  '18': { tideStation: '8747437', weatherLat: 30.3960, weatherLon: -88.8853 }, // Biloxi Beach
  
  // Rhode Island Beaches
  '19': { tideStation: '8452660', weatherLat: 41.1726, weatherLon: -71.5773 }, // Block Island
  
  // Texas Beaches
  '21': { tideStation: '8771450', weatherLat: 29.4669, weatherLon: -94.6849 }, // Bolivar Peninsula
  '26': { tideStation: '8779770', weatherLat: 25.9970, weatherLon: -97.1594 }, // Brownsville Beach
  '44': { tideStation: '8775870', weatherLat: 27.6406, weatherLon: -97.2253 }, // Corpus Christi Beach
  '66': { tideStation: '8772447', weatherLat: 28.9536, weatherLon: -95.3596 }, // Freeport Beach
  '68': { tideStation: '8771450', weatherLat: 29.3013, weatherLon: -94.7977 }, // Galveston Beach
  
  // Massachusetts Beaches
  '30': { tideStation: '8447930', weatherLat: 41.9270, weatherLon: -70.0461 }, // Cape Cod National Seashore
  '38': { tideStation: '8447930', weatherLat: 41.6821, weatherLon: -69.9597 }, // Chatham
  '45': { tideStation: '8443970', weatherLat: 42.6959, weatherLon: -70.7698 }, // Crane Beach
  '54': { tideStation: '8447930', weatherLat: 41.8301, weatherLon: -69.9745 }, // Eastham
  '70': { tideStation: '8443970', weatherLat: 42.6259, weatherLon: -70.6698 }, // Good Harbor Beach
  
  // California Beaches
  '33': { tideStation: '9413450', weatherLat: 36.9752, weatherLon: -121.9532 }, // Capitola Beach
  '35': { tideStation: '9410230', weatherLat: 33.1581, weatherLon: -117.3506 }, // Carlsbad Beach
  '36': { tideStation: '9413450', weatherLat: 36.5553, weatherLon: -121.9233 }, // Carmel Beach
  '43': { tideStation: '9410170', weatherLat: 32.6859, weatherLon: -117.1831 }, // Coronado Beach
  '47': { tideStation: '9410660', weatherLat: 33.4673, weatherLon: -117.6981 }, // Dana Point
  '50': { tideStation: '9410230', weatherLat: 32.9595, weatherLon: -117.2653 }, // Del Mar Beach
  '52': { tideStation: '9410660', weatherLat: 33.9192, weatherLon: -118.4365 }, // Dockweiler Beach
  '55': { tideStation: '9410840', weatherLat: 34.0359, weatherLon: -118.8781 }, // El Matador Beach
  '56': { tideStation: '9410660', weatherLat: 33.9192, weatherLon: -118.4165 }, // El Segundo Beach
  '57': { tideStation: '9410230', weatherLat: 33.0370, weatherLon: -117.2920 }, // Encinitas
  '73': { tideStation: '9414290', weatherLat: 37.4636, weatherLon: -122.4286 }, // Half Moon Bay
  
  // Delaware Beaches
  '15': { tideStation: '8557380', weatherLat: 38.5393, weatherLon: -75.0552 }, // Bethany Beach
  '51': { tideStation: '8557380', weatherLat: 38.6929, weatherLon: -75.0732 }, // Dewey Beach
  '59': { tideStation: '8557380', weatherLat: 38.4601, weatherLon: -75.0535 }, // Fenwick Island
  
  // New York Beaches
  '41': { tideStation: '8518750', weatherLat: 40.5755, weatherLon: -73.9707 }, // Coney Island
  '60': { tideStation: '8516945', weatherLat: 40.6451, weatherLon: -73.1568 }, // Fire Island
  
  // South Carolina Beaches
  '63': { tideStation: '8665530', weatherLat: 32.6552, weatherLon: -79.9403 }, // Folly Beach
  
  // Louisiana Beaches
  '71': { tideStation: '8761724', weatherLat: 29.2633, weatherLon: -89.9570 }, // Grand Isle
  
  // Alabama Beaches
  '72': { tideStation: '8735180', weatherLat: 30.2460, weatherLon: -87.7008 }, // Gulf Shores
  
  // New Hampshire Beaches
  '75': { tideStation: '8423898', weatherLat: 42.9001, weatherLon: -70.8109 }, // Hampton Beach
  
  // Hawaii Beaches
  '76': { tideStation: '1612340', weatherLat: 21.2691, weatherLon: -157.6942 }, // Hanauma Bay - Honolulu
  '98': { tideStation: '1612480', weatherLat: 21.3931, weatherLon: -157.7179 }, // Lanikai Beach - Kailua
  
  // New Jersey Beaches (continued)
  '77': { tideStation: '8533840', weatherLat: 39.6959, weatherLon: -74.1376 }, // Harvey Cedars
  '81': { tideStation: '8533840', weatherLat: 39.6326, weatherLon: -74.2043 }, // Holgate - Long Beach Township
  '103': { tideStation: '8533840', weatherLat: 39.6626, weatherLon: -74.1876 }, // Long Beach Island
  '106': { tideStation: '8531680', weatherLat: 40.3043, weatherLon: -73.9923 }, // Long Branch
  '107': { tideStation: '8533840', weatherLat: 39.7043, weatherLon: -74.1626 }, // Loveladies - Long Beach Township
  '110': { tideStation: '8531680', weatherLat: 40.1165, weatherLon: -74.0376 }, // Manasquan
  '134': { tideStation: '8534720', weatherLat: 39.2776, weatherLon: -74.5746 }, // Ocean City Boardwalk
  '150': { tideStation: '8531680', weatherLat: 40.0826, weatherLon: -74.0476 }, // Point Pleasant
  
  // North Carolina Beaches (continued)
  '78': { tideStation: '8654467', weatherLat: 35.2118, weatherLon: -75.6874 }, // Hatteras
  '94': { tideStation: '8651370', weatherLat: 36.0321, weatherLon: -75.6768 }, // Kill Devil Hills
  '95': { tideStation: '8651370', weatherLat: 36.0626, weatherLon: -75.7060 }, // Kitty Hawk
  '124': { tideStation: '8652587', weatherLat: 35.9571, weatherLon: -75.6240 }, // Nags Head
  '141': { tideStation: '8654467', weatherLat: 35.5585, weatherLon: -75.4665 }, // Outer Banks
  
  // California Beaches (continued)
  '79': { tideStation: '9410660', weatherLat: 33.8622, weatherLon: -118.3998 }, // Hermosa Beach
  '84': { tideStation: '9410580', weatherLat: 33.6595, weatherLon: -118.0000 }, // Huntington Beach
  '85': { tideStation: '9410170', weatherLat: 32.5839, weatherLon: -117.1131 }, // Imperial Beach
  '96': { tideStation: '9410660', weatherLat: 33.5427, weatherLon: -117.7854 }, // Laguna Beach
  '97': { tideStation: '9410230', weatherLat: 32.8509, weatherLon: -117.2713 }, // La Jolla Cove
  '100': { tideStation: '9410840', weatherLat: 34.0459, weatherLon: -118.9381 }, // Leo Carrillo Beach - Malibu
  '109': { tideStation: '9410840', weatherLat: 34.0259, weatherLon: -118.7798 }, // Malibu Beach
  '111': { tideStation: '9410660', weatherLat: 33.8847, weatherLon: -118.4109 }, // Manhattan Beach
  '112': { tideStation: '9410660', weatherLat: 33.8847, weatherLon: -118.4109 }, // Manhattan State Beach
  '118': { tideStation: '9416841', weatherLat: 39.3077, weatherLon: -123.7994 }, // Mendocino
  '119': { tideStation: '9410170', weatherLat: 32.7701, weatherLon: -117.2528 }, // Mission Beach - San Diego
  '121': { tideStation: '9413450', weatherLat: 36.6002, weatherLon: -121.8947 }, // Monterey Bay
  '129': { tideStation: '9410580', weatherLat: 33.6189, weatherLon: -117.9289 }, // Newport Beach CA
  '132': { tideStation: '9410170', weatherLat: 32.7533, weatherLon: -117.2494 }, // Ocean Beach - San Diego
  '142': { tideStation: '9410170', weatherLat: 32.7964, weatherLon: -117.2296 }, // Pacific Beach - San Diego
  '147': { tideStation: '9412110', weatherLat: 35.1428, weatherLon: -120.6413 }, // Pismo Beach
  '149': { tideStation: '9410840', weatherLat: 34.0059, weatherLon: -118.8081 }, // Point Dume - Malibu
  
  // South Carolina Beaches (continued)
  '80': { tideStation: '8670870', weatherLat: 32.2163, weatherLon: -80.7526 }, // Hilton Head
  '93': { tideStation: '8665530', weatherLat: 32.6085, weatherLon: -80.0842 }, // Kiawah Island
  '123': { tideStation: '8661070', weatherLat: 33.6891, weatherLon: -78.8867 }, // Myrtle Beach
  
  // Florida Beaches (continued)
  '82': { tideStation: '8723214', weatherLat: 26.0112, weatherLon: -80.1248 }, // Hollywood Beach
  '83': { tideStation: '8726724', weatherLat: 28.0656, weatherLon: -82.8276 }, // Honeymoon Island - Dunedin
  '86': { tideStation: '8726724', weatherLat: 27.8964, weatherLon: -82.8426 }, // Indian Rocks Beach
  '87': { tideStation: '8726724', weatherLat: 27.8564, weatherLon: -82.8476 }, // Indian Shores
  '88': { tideStation: '8723970', weatherLat: 24.9243, weatherLon: -80.6278 }, // Islamorada
  '91': { tideStation: '8723214', weatherLat: 25.6926, weatherLon: -80.1631 }, // Key Biscayne
  '92': { tideStation: '8724580', weatherLat: 24.5551, weatherLon: -81.7800 }, // Key West Beach
  '101': { tideStation: '8726384', weatherLat: 27.3164, weatherLon: -82.5831 }, // Lido Key - Sarasota
  '105': { tideStation: '8726384', weatherLat: 27.4103, weatherLon: -82.6540 }, // Longboat Key
  '108': { tideStation: '8726724', weatherLat: 27.7970, weatherLon: -82.7976 }, // Madeira Beach
  '114': { tideStation: '8723970', weatherLat: 24.7137, weatherLon: -81.0865 }, // Marathon
  '115': { tideStation: '8725110', weatherLat: 25.9412, weatherLon: -81.7187 }, // Marco Island
  '126': { tideStation: '8725110', weatherLat: 26.1420, weatherLon: -81.7948 }, // Naples Beach
  '128': { tideStation: '8721120', weatherLat: 29.0258, weatherLon: -80.9270 }, // New Smyrna Beach
  '140': { tideStation: '8721120', weatherLat: 29.2858, weatherLon: -81.0559 }, // Ormond Beach
  '145': { tideStation: '8729108', weatherLat: 30.1766, weatherLon: -85.8055 }, // Panama City Beach
  '146': { tideStation: '8726520', weatherLat: 27.6953, weatherLon: -82.7426 }, // Pass-a-Grille Beach - St. Pete Beach
  
  // New York Beaches (continued)
  '89': { tideStation: '8516945', weatherLat: 40.5926, weatherLon: -73.5087 }, // Jones Beach - Wantagh
  '120': { tideStation: '8510560', weatherLat: 41.0357, weatherLon: -71.9579 }, // Montauk
  
  // Maine Beaches (continued)
  '90': { tideStation: '8419317', weatherLat: 43.3615, weatherLon: -70.4767 }, // Kennebunk Beach
  '136': { tideStation: '8419317', weatherLat: 43.2493, weatherLon: -70.5989 }, // Ogunquit Beach
  '137': { tideStation: '8418150', weatherLat: 43.5170, weatherLon: -70.3770 }, // Old Orchard Beach
  
  // Massachusetts Beaches (continued)
  '116': { tideStation: '8447930', weatherLat: 41.3888, weatherLon: -70.6189 }, // Martha's Vineyard
  '125': { tideStation: '8449130', weatherLat: 41.2835, weatherLon: -70.0995 }, // Nantucket
  '139': { tideStation: '8447930', weatherLat: 41.7899, weatherLon: -69.9897 }, // Orleans
  '148': { tideStation: '8443970', weatherLat: 42.8159, weatherLon: -70.8159 }, // Plum Island - Newburyport
  
  // Oregon Beaches (continued)
  '102': { tideStation: '9435380', weatherLat: 44.9579, weatherLon: -124.0179 }, // Lincoln City
  '113': { tideStation: '9435380', weatherLat: 45.7179, weatherLon: -123.9365 }, // Manzanita Beach
  '130': { tideStation: '9435380', weatherLat: 44.6368, weatherLon: -124.0529 }, // Newport Beach OR
  '143': { tideStation: '9435380', weatherLat: 45.1979, weatherLon: -123.9615 }, // Pacific City
  
  // Washington Beaches
  '99': { tideStation: '9442396', weatherLat: 47.9037, weatherLon: -124.6368 }, // La Push Beach
  '104': { tideStation: '9440910', weatherLat: 46.3523, weatherLon: -124.0543 }, // Long Beach Peninsula
  '135': { tideStation: '9441102', weatherLat: 46.9737, weatherLon: -124.1568 }, // Ocean Shores
  
  // Texas Beaches (continued)
  '117': { tideStation: '8772447', weatherLat: 28.6903, weatherLon: -95.9688 }, // Matagorda Beach
  '122': { tideStation: '8775870', weatherLat: 27.8339, weatherLon: -97.0614 }, // Mustang Island - Port Aransas
  '144': { tideStation: '8775870', weatherLat: 27.5808, weatherLon: -97.2108 }, // Padre Island
  
  // Rhode Island Beaches (continued)
  '127': { tideStation: '8452660', weatherLat: 41.4326, weatherLon: -71.4537 }, // Narragansett Beach
  '131': { tideStation: '8452660', weatherLat: 41.4901, weatherLon: -71.3128 }, // Newport Beach RI
  
  // Maryland Beaches (continued)
  '133': { tideStation: '8570283', weatherLat: 38.3365, weatherLon: -75.0849 }, // Ocean City MD
  
  // Alabama Beaches (continued)
  '138': { tideStation: '8735180', weatherLat: 30.2943, weatherLon: -87.5711 }, // Orange Beach
  
  // Beaches 151-200
  '151': { tideStation: '8722670', weatherLat: 26.2379, weatherLon: -80.1248 }, // Pompano Beach - FL
  '152': { tideStation: '8770822', weatherLat: 29.8849, weatherLon: -93.9399 }, // Port Arthur Beach - TX
  '153': { tideStation: '8773259', weatherLat: 28.6150, weatherLon: -96.6260 }, // Port Lavaca Beach - TX
  '154': { tideStation: '8446121', weatherLat: 42.0526, weatherLon: -70.1826 }, // Provincetown - MA
  '155': { tideStation: '8726724', weatherLat: 27.8164, weatherLon: -82.8176 }, // Redington Beach - FL
  '156': { tideStation: '8726724', weatherLat: 27.8264, weatherLon: -82.8276 }, // Redington Shores - FL
  '157': { tideStation: '9410660', weatherLat: 33.8492, weatherLon: -118.3884 }, // Redondo Beach - CA
  '158': { tideStation: '8557380', weatherLat: 38.7209, weatherLon: -75.0760 }, // Rehoboth Beach - DE
  '159': { tideStation: '9442396', weatherLat: 47.9204, weatherLon: -124.6368 }, // Rialto Beach - WA
  '160': { tideStation: '8774770', weatherLat: 28.0217, weatherLon: -97.0544 }, // Rockport Beach - TX
  '161': { tideStation: '8654467', weatherLat: 35.5932, weatherLon: -75.4668 }, // Rodanthe - NC
  '162': { tideStation: '8423898', weatherLat: 43.0093, weatherLon: -70.7698 }, // Rye Beach - NH
  '163': { tideStation: '8443970', weatherLat: 42.8426, weatherLon: -70.8109 }, // Salisbury Beach - MA
  '164': { tideStation: '8654467', weatherLat: 35.5418, weatherLon: -75.4729 }, // Salvo - NC
  '165': { tideStation: '9410660', weatherLat: 33.4270, weatherLon: -117.6120 }, // San Clemente - CA
  '166': { tideStation: '8725110', weatherLat: 26.4487, weatherLon: -82.1248 }, // Sanibel Island - FL
  '167': { tideStation: '9410840', weatherLat: 34.0095, weatherLon: -118.4965 }, // Santa Monica Beach - CA
  '168': { tideStation: '8536110', weatherLat: 39.1526, weatherLon: -74.6932 }, // Sea Isle City - NJ
  '169': { tideStation: '9435380', weatherLat: 45.9932, weatherLon: -123.9226 }, // Seaside Beach - OR
  '170': { tideStation: '8531680', weatherLat: 39.9443, weatherLon: -74.0726 }, // Seaside Heights - NJ
  '171': { tideStation: '8533840', weatherLat: 39.6426, weatherLon: -74.1793 }, // Ship Bottom - NJ
  '172': { tideStation: '8726384', weatherLat: 27.2639, weatherLon: -82.5454 }, // Siesta Key Beach - FL
  '173': { tideStation: '9410230', weatherLat: 32.9911, weatherLon: -117.2714 }, // Solana Beach - CA
  '174': { tideStation: '8723214', weatherLat: 25.7907, weatherLon: -80.1300 }, // South Beach - Miami Beach, FL
  '175': { tideStation: '8651370', weatherLat: 36.1293, weatherLon: -75.7460 }, // Southern Shores - NC
  '176': { tideStation: '8779770', weatherLat: 26.1118, weatherLon: -97.1681 }, // South Padre Island - TX
  '177': { tideStation: '8531680', weatherLat: 40.1532, weatherLon: -74.0282 }, // Spring Lake - NJ
  '178': { tideStation: '8720218', weatherLat: 29.8572, weatherLon: -81.2664 }, // St. Augustine Beach - FL
  '179': { tideStation: '9414863', weatherLat: 37.9021, weatherLon: -122.6447 }, // Stinson Beach - CA
  '180': { tideStation: '8536110', weatherLat: 39.0493, weatherLon: -74.7615 }, // Stone Harbor - NJ
  '181': { tideStation: '8726520', weatherLat: 27.7253, weatherLon: -82.7412 }, // St. Pete Beach - FL
  '182': { tideStation: '8723214', weatherLat: 25.9426, weatherLon: -80.1231 }, // Sunny Isles Beach - FL
  '183': { tideStation: '8533840', weatherLat: 39.6626, weatherLon: -74.1643 }, // Surf City - NJ
  '184': { tideStation: '8772447', weatherLat: 28.9447, weatherLon: -95.2860 }, // Surfside Beach - TX
  '185': { tideStation: '8726724', weatherLat: 28.1461, weatherLon: -82.7568 }, // Tarpon Springs Beach - FL
  '186': { tideStation: '8510560', weatherLat: 40.9632, weatherLon: -72.1848 }, // The Hamptons - East Hampton, NY
  '187': { tideStation: '9410230', weatherLat: 32.9326, weatherLon: -117.2526 }, // Torrey Pines - La Jolla, CA
  '188': { tideStation: '8726724', weatherLat: 27.7689, weatherLon: -82.7687 }, // Treasure Island - FL
  '189': { tideStation: '8447930', weatherLat: 41.9993, weatherLon: -70.0626 }, // Truro - MA
  '190': { tideStation: '8670870', weatherLat: 32.0002, weatherLon: -80.8454 }, // Tybee Island - GA
  '191': { tideStation: '8725110', weatherLat: 27.0998, weatherLon: -82.4543 }, // Venice Beach FL - Venice, FL
  '192': { tideStation: '9410840', weatherLat: 33.9850, weatherLon: -118.4695 }, // Venice Beach - Venice, CA
  '193': { tideStation: '8638863', weatherLat: 36.8529, weatherLon: -75.9780 }, // Virginia Beach - VA
  '194': { tideStation: '1612340', weatherLat: 21.2793, weatherLon: -157.8293 }, // Waikiki Beach - Honolulu, HI
  '195': { tideStation: '8654467', weatherLat: 35.5518, weatherLon: -75.4696 }, // Waves - NC
  '196': { tideStation: '8447930', weatherLat: 41.9376, weatherLon: -70.0326 }, // Wellfleet - MA
  '197': { tideStation: '8419317', weatherLat: 43.3220, weatherLon: -70.5798 }, // Wells Beach - ME
  '198': { tideStation: '8536110', weatherLat: 38.9918, weatherLon: -74.8149 }, // Wildwood - NJ
  '199': { tideStation: '8419317', weatherLat: 43.1726, weatherLon: -70.6098 }, // York Beach - ME
  '200': { tideStation: '9410840', weatherLat: 34.0159, weatherLon: -118.8231 }, // Zuma Beach - Malibu, CA
};

interface NOAAWaterLevelData {
  t: string; // time
  v: string; // value
}

interface NOAATideData {
  t: string; // time
  v: string; // value
  type: string; // H or L
}

interface NOAAWeatherData {
  properties: {
    temperature?: {
      value: number;
    };
    relativeHumidity?: {
      value: number;
    };
    windSpeed?: {
      value: number;
    };
    windDirection?: {
      value: number;
    };
  };
}

/**
 * Fetch water level (tide) data from NOAA
 */
export const fetchWaterLevel = async (stationId: string): Promise<number | null> => {
  try {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    
    const url = `${NOAA_TIDES_API}?date=latest&station=${stationId}&product=water_level&datum=MLLW&time_zone=lst_ldt&units=english&format=json`;
    
    console.log('Fetching water level from NOAA:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const latestReading = data.data[0] as NOAAWaterLevelData;
      return parseFloat(latestReading.v);
    }
    
    console.log('No water level data available');
    return null;
  } catch (error) {
    console.error('Error fetching water level:', error);
    return null;
  }
};

/**
 * Fetch tide predictions from NOAA
 */
export const fetchTidePredictions = async (stationId: string): Promise<TideInfo[]> => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const beginDate = now.toISOString().split('T')[0].replace(/-/g, '');
    const endDate = tomorrow.toISOString().split('T')[0].replace(/-/g, '');
    
    const url = `${NOAA_TIDES_API}?begin_date=${beginDate}&end_date=${endDate}&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&interval=hilo&format=json`;
    
    console.log('Fetching tide predictions from NOAA:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.predictions && data.predictions.length > 0) {
      return data.predictions.slice(0, 4).map((pred: NOAATideData) => {
        const time = new Date(pred.t);
        const formattedTime = time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        
        return {
          time: formattedTime,
          type: pred.type === 'H' ? 'High Tide' : 'Low Tide',
          height: parseFloat(pred.v),
        } as TideInfo;
      });
    }
    
    console.log('No tide prediction data available');
    return [];
  } catch (error) {
    console.error('Error fetching tide predictions:', error);
    return [];
  }
};

/**
 * Fetch water temperature from NOAA
 */
export const fetchWaterTemperature = async (stationId: string): Promise<number | null> => {
  try {
    const url = `${NOAA_TIDES_API}?date=latest&station=${stationId}&product=water_temperature&time_zone=lst_ldt&units=english&format=json`;
    
    console.log('Fetching water temperature from NOAA:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const latestReading = data.data[0] as NOAAWaterLevelData;
      return parseFloat(latestReading.v);
    }
    
    console.log('No water temperature data available');
    return null;
  } catch (error) {
    console.error('Error fetching water temperature:', error);
    return null;
  }
};

/**
 * Fetch air temperature from NOAA
 */
export const fetchAirTemperature = async (stationId: string): Promise<number | null> => {
  try {
    const url = `${NOAA_TIDES_API}?date=latest&station=${stationId}&product=air_temperature&time_zone=lst_ldt&units=english&format=json`;
    
    console.log('Fetching air temperature from NOAA:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const latestReading = data.data[0] as NOAAWaterLevelData;
      return parseFloat(latestReading.v);
    }
    
    console.log('No air temperature data available');
    return null;
  } catch (error) {
    console.error('Error fetching air temperature:', error);
    return null;
  }
};

/**
 * Fetch wind data from NOAA
 */
export const fetchWindData = async (stationId: string): Promise<{ speed: number; direction: string } | null> => {
  try {
    const url = `${NOAA_TIDES_API}?date=latest&station=${stationId}&product=wind&time_zone=lst_ldt&units=english&format=json`;
    
    console.log('Fetching wind data from NOAA:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const latestReading = data.data[0];
      const speed = parseFloat(latestReading.s); // wind speed
      const directionDegrees = parseFloat(latestReading.d); // wind direction in degrees
      
      // Convert degrees to cardinal direction
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(directionDegrees / 22.5) % 16;
      const direction = directions[index];
      
      return { speed, direction };
    }
    
    console.log('No wind data available');
    return null;
  } catch (error) {
    console.error('Error fetching wind data:', error);
    return null;
  }
};

/**
 * Fetch weather data from NWS API
 */
export const fetchWeatherData = async (lat: number, lon: number): Promise<any> => {
  try {
    // First, get the grid point
    const pointUrl = `${NOAA_WEATHER_API}/${lat.toFixed(4)},${lon.toFixed(4)}`;
    console.log('Fetching weather grid point:', pointUrl);
    
    const pointResponse = await fetch(pointUrl, {
      headers: {
        'User-Agent': 'BeachReportApp/1.0',
      },
    });
    
    if (!pointResponse.ok) {
      console.log('Weather API point request failed:', pointResponse.status);
      return null;
    }
    
    const pointData = await pointResponse.json();
    const forecastUrl = pointData.properties.forecast;
    
    // Get the forecast
    console.log('Fetching weather forecast:', forecastUrl);
    const forecastResponse = await fetch(forecastUrl, {
      headers: {
        'User-Agent': 'BeachReportApp/1.0',
      },
    });
    
    if (!forecastResponse.ok) {
      console.log('Weather API forecast request failed:', forecastResponse.status);
      return null;
    }
    
    const forecastData = await forecastResponse.json();
    
    if (forecastData.properties && forecastData.properties.periods && forecastData.properties.periods.length > 0) {
      return forecastData.properties.periods[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

/**
 * Calculate UV index based on time of day and location
 * This is a simplified calculation - in production, use a dedicated UV API
 */
const calculateUVIndex = (lat: number): number => {
  const now = new Date();
  const hour = now.getHours();
  
  // UV is highest between 10am and 4pm
  if (hour < 6 || hour > 18) return 0;
  if (hour < 10 || hour > 16) return 3;
  
  // Higher UV closer to equator
  const latFactor = 1 + (Math.abs(lat) / 90);
  const baseUV = 8;
  
  return Math.min(11, Math.round(baseUV * latFactor));
};

/**
 * Get UV guide text based on UV index
 */
const getUVGuide = (uvIndex: number): string => {
  if (uvIndex <= 2) return 'Low - Minimal protection needed';
  if (uvIndex <= 5) return 'Moderate - Wear sunscreen';
  if (uvIndex <= 7) return 'High - Wear sunscreen and hat';
  if (uvIndex <= 10) return 'Very High - Extra protection needed';
  return 'Extreme - Avoid sun exposure';
};

/**
 * Calculate sunrise and sunset times
 * This is a simplified calculation - in production, use a dedicated sun times API
 */
const calculateSunTimes = (lat: number, lon: number): { sunrise: string; sunset: string } => {
  // This is a very simplified calculation
  // In production, use a library like suncalc or an API
  const now = new Date();
  const sunrise = new Date(now);
  sunrise.setHours(7, 18, 0);
  
  const sunset = new Date(now);
  sunset.setHours(18, 53, 0);
  
  return {
    sunrise: sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    sunset: sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
};

/**
 * Determine tide status based on current and predicted tides
 */
const determineTideStatus = (currentTide: number, predictions: TideInfo[]): 'Rising' | 'Falling' | 'High' | 'Low' => {
  if (predictions.length < 2) return 'Rising';
  
  const nextTide = predictions[0];
  
  if (nextTide.type === 'High Tide') {
    return currentTide > nextTide.height * 0.9 ? 'High' : 'Rising';
  } else {
    return currentTide < nextTide.height * 1.1 ? 'Low' : 'Falling';
  }
};

/**
 * Determine flag warning based on conditions
 */
const determineFlagWarning = (
  surfHeight: number,
  windSpeed: number,
  uvIndex: number
): { flag: 'green' | 'yellow' | 'red' | 'purple'; text: string } => {
  // Red flag conditions
  if (surfHeight > 4 || windSpeed > 25) {
    return {
      flag: 'red',
      text: 'Dangerous conditions - High surf or strong winds',
    };
  }
  
  // Yellow flag conditions
  if (surfHeight > 2.5 || windSpeed > 15 || uvIndex > 8) {
    return {
      flag: 'yellow',
      text: 'Caution - Moderate surf or wind',
    };
  }
  
  // Green flag - safe conditions
  return {
    flag: 'green',
    text: 'Safe conditions - No hazards',
  };
};

/**
 * Fetch complete beach conditions from NOAA APIs
 */
export const fetchBeachConditions = async (beachId: string): Promise<BeachConditions | null> => {
  try {
    const stationInfo = NOAA_STATIONS[beachId];
    
    if (!stationInfo) {
      console.error('No NOAA station info for beach:', beachId);
      return null;
    }
    
    console.log(`Fetching conditions for beach ${beachId} from station ${stationInfo.tideStation}`);
    
    // Fetch all data in parallel
    const [
      waterLevel,
      tidePredictions,
      waterTemp,
      airTemp,
      windData,
      weatherData,
    ] = await Promise.all([
      fetchWaterLevel(stationInfo.tideStation),
      fetchTidePredictions(stationInfo.tideStation),
      fetchWaterTemperature(stationInfo.tideStation),
      fetchAirTemperature(stationInfo.tideStation),
      fetchWindData(stationInfo.tideStation),
      fetchWeatherData(stationInfo.weatherLat, stationInfo.weatherLon),
    ]);
    
    // Calculate derived values
    const uvIndex = calculateUVIndex(stationInfo.weatherLat);
    const uvGuide = getUVGuide(uvIndex);
    const sunTimes = calculateSunTimes(stationInfo.weatherLat, stationInfo.weatherLon);
    
    // Use weather data if available
    let finalAirTemp = airTemp || 75;
    let finalWindSpeed = windData?.speed || 10;
    let finalWindDirection = windData?.direction || 'E';
    let humidity = 60;
    
    if (weatherData) {
      if (weatherData.temperature) {
        // Convert Celsius to Fahrenheit if needed
        finalAirTemp = weatherData.temperature;
      }
      if (weatherData.windSpeed) {
        // Parse wind speed (e.g., "10 mph" or "10 to 15 mph")
        const windMatch = weatherData.windSpeed.match(/(\d+)/);
        if (windMatch) {
          finalWindSpeed = parseInt(windMatch[1]);
        }
      }
      if (weatherData.windDirection) {
        finalWindDirection = weatherData.windDirection;
      }
      if (weatherData.relativeHumidity && weatherData.relativeHumidity.value) {
        humidity = weatherData.relativeHumidity.value;
      }
    }
    
    // Estimate surf height (simplified - in production, use a surf forecast API)
    const surfHeight = 1 + Math.random() * 2;
    
    // Determine tide status
    const currentTide = waterLevel || 1.5;
    const tideStatus = determineTideStatus(currentTide, tidePredictions);
    
    // Determine flag warning
    const flagWarning = determineFlagWarning(surfHeight, finalWindSpeed, uvIndex);
    
    const conditions: BeachConditions = {
      beachId,
      waterTemp: waterTemp || 72,
      surfHeight,
      currentTide,
      tideStatus,
      airTemp: finalAirTemp,
      windSpeed: finalWindSpeed,
      windDirection: finalWindDirection,
      humidity,
      uvIndex,
      uvGuide,
      sunrise: sunTimes.sunrise,
      sunset: sunTimes.sunset,
      currentConditions: weatherData?.shortForecast || 'Good conditions',
      flagWarning: flagWarning.flag,
      flagWarningText: flagWarning.text,
      lastUpdated: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    };
    
    console.log('Successfully fetched beach conditions:', conditions);
    return conditions;
    
  } catch (error) {
    console.error('Error fetching beach conditions:', error);
    return null;
  }
};

/**
 * Fetch tide schedule for a beach
 */
export const fetchTideSchedule = async (beachId: string): Promise<TideInfo[]> => {
  try {
    const stationInfo = NOAA_STATIONS[beachId];
    
    if (!stationInfo) {
      console.error('No NOAA station info for beach:', beachId);
      return [];
    }
    
    return await fetchTidePredictions(stationInfo.tideStation);
  } catch (error) {
    console.error('Error fetching tide schedule:', error);
    return [];
  }
};
