export interface Donation {
  id?: number;
  donationType?: string;
  quantity?: number;
  donationDate?: string;
  donationStatus?: string;
  userCin?: string;
}

export interface DonationAdd {
  type: string;
  quantity: number;
  userCin: string;
}
