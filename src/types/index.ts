export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  location: string;
  story: string;
  imageUrl: string;
  tag: string;
}

export interface SurpriseGift {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string;
  iconName: string;
}

export interface LoveCoupon {
  id: string;
  title: string;
  promise: string;
  terms: string;
  isRedeemed: boolean;
  redeemedDate?: string;
  color: string;
}

export interface SurpriseData {
  recipientName: string;
  nickname: string;
  senderName: string;
  birthDate: string;
  specialMilestone: string; // e.g. "Happy 22nd Birthday, My Whole World"
  heroSubtitle: string;
  loveLetter: {
    greeting: string;
    body: string[];
    closing: string;
    signature: string;
    date: string;
  };
  memories: MemoryItem[];
  reasonsWhy: string[];
  gifts: SurpriseGift[];
  coupons: LoveCoupon[];
}
