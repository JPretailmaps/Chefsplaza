export interface IPerformer {
  _id: string;
  performerId: string;
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  phoneCode: string;
  avatarPath: string;
  avatar: any;
  coverPath: string;
  cover: any;
  gender: string;
  country: string;
  city: string;
  state: string;
  zipcode: string;
  address: string;
  languages: string[];
  categoryIds: string[];
  height: string;
  weight: string;
  bio: string;
  eyes: string;
  sexualOrientation: string;
  isFreeSubscription: boolean;
  durationFreeSubscriptionDays: number;
  monthlyPrice: number;
  yearlyPrice: number;
  stats: {
    likes: number;
    subscribers: number;
    views: number;
    totalVideos: number;
    totalPhotos: number;
    totalGalleries: number;
    totalProducts: number;
    totalFeeds: number;
    followers: number;
  };
  score: number;
  bankingInformation: IBanking;
  stripeAccount: any;
  paypalSetting: any;
  blockCountries: IBlockCountries;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isOnline: number;
  verifiedAccount: boolean;
  verifiedEmail: boolean;
  verifiedDocument: boolean;
  twitterConnected: boolean;
  googleConnected: boolean;
  welcomeVideoId: string;
  welcomeVideoPath: string;
  welcomeVideoName: string;
  activateWelcomeVideo: boolean;
  isBookMarked: boolean;
  isSubscribed: boolean;
  live: number;
  streamingStatus: string;
  ethnicity: string;
  butt: string;
  hair: string;
  pubicHair: string;
  idVerification: any;
  documentVerification: any;
  bodyType: string;
  dateOfBirth: Date;
  publicChatPrice: number;
  balance: number;
  isPerformer: boolean;
  isFollowed: boolean;
  isFeatured: boolean;
  usedFreeSubscription: boolean;
}

export interface IBanking {
  firstName: string;
  lastName: string;
  SSN: string;
  bankName: string;
  bankAccount: string;
  bankRouting: string;
  bankSwiftCode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  performerId: string;
}

export interface IPerformerStats {
  totalGrossPrice: number;
  totalSiteCommission: number;
  totalNetPrice: number;
}

export interface IBlockCountries {
  countryCodes: string[];
}

export interface IBlockedByPerformer {
  userId: string;
  description: string;
}
