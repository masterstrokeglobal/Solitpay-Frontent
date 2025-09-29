import Wallet from "./wallet";
import WithdrawDetailsRecord from "./withdrawl-details";
import { Transaction } from "./transaction";
import { MerchantApiKey } from "./merchant-api";

export enum APIS {
  MERCHANT_QR = "merchant_qr",
  MERCHANT_PAYIN = "merchant_payin",
  MERCHANT_PAYOUT = "merchant_payout",
  USER_WITHDRAW = "user_withdraw",
  USER_WITHDRAW_BULK = "user_withdraw_bulk",
  DEVELOPER_API = "developer_api",
}

export enum Role {
  ADMIN = "admin",
  MERCHANT = "merchant"
}

class Merchant {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  isVerified?: boolean;
  role?: Role;
  companyName?: string;
  companyAddress?: string;
  companyGSTNumber?: string;
  companyPanNumber?: string;
  companyCINNumber?: string;
  companyGSTImage?: string;
  companyPANImage?: string;
  companyCINImage?: string;
  additionalVerificationInfo?: string[];
  platformFeePercentage?: number;
  wallet?: Wallet;
  withdrawDetails?: WithdrawDetailsRecord[];
  transactions?: Transaction[];
  apiKeys?: MerchantApiKey[];
  restrictedApi?: APIS[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;


  constructor(params: Partial<Merchant> = {}) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.password = params.password;
    this.isVerified = params.isVerified;
    this.role = params.role;
    this.companyName = params.companyName;
    this.companyAddress = params.companyAddress;
    this.companyGSTNumber = params.companyGSTNumber;
    this.companyPanNumber = params.companyPanNumber;
    this.companyCINNumber = params.companyCINNumber;
    this.companyGSTImage = params.companyGSTImage;
    this.companyPANImage = params.companyPANImage;
    this.companyCINImage = params.companyCINImage;
    this.additionalVerificationInfo = params.additionalVerificationInfo;
    this.platformFeePercentage = params.platformFeePercentage;
    this.wallet = params.wallet ? new Wallet(params.wallet) : undefined;
    this.withdrawDetails = params.withdrawDetails ? params.withdrawDetails.map((item) => new WithdrawDetailsRecord(item)) : [];
    this.transactions = params.transactions;
    this.apiKeys = params.apiKeys;
    this.restrictedApi = params.restrictedApi;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
  }

  get isAdmin() {
    return this.role === Role.ADMIN;
  }

  get isMerchant() {
    return this.role === Role.MERCHANT;
  }

  hasAccessTo(api: APIS) {
    return !this.restrictedApi?.includes(api);
  }

  isRestricted(api: APIS) {
    return this.restrictedApi?.includes(api);
  }
}

export default Merchant;