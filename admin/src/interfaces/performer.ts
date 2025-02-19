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
    totalStreamTime: number;
  };
  score: number;
  isPerformer: boolean;
  bankingInformation: IBankingSetting;
  blockCountries: IBlockCountries;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isOnline: boolean;
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
  live: boolean;
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
  groupChatPrice: number;
  privateChatPrice: number;
  balance: number;
  commissionPercentage: boolean;
  ccbillSetting: any;
  paypalSetting: any;
  isFeatured: boolean;
}

export interface IBankingSetting {
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
  totalCommission: number;
  totalNetPrice: number;
}

export interface IBlockCountries {
  performerId: string;
  countries: string[];
}

export interface IBlockedByPerformer {
  userId: string;
  description: string;
}

export interface ITrendingPerformer {
  _id: string;

  name: string;

  firstName: string;

  lastName: string;

  username: string;

  dateOfBirth: Date;

  avatarId: string;

  avatarPath: string;

  avatar: string;

  coverId: string;

  coverPath: string;

  cover: string;

  welcomeVideoId: string;

  welcomeVideoPath: string;

  activateWelcomeVideo: boolean;

  verifiedAccount: boolean;

  gender: string;

  country: string;

  bio: string;

  createdAt: Date;

  updatedAt: Date;

  totalSubscribersInDay: number;

  performerId: string;

  listType: string;

  isProtected: boolean;

  ordering: number;
}
