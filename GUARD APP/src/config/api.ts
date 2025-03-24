// export const API_URL = 'http://192.168.29.173:3000/api';
export const API_URL = 'http://46.202.162.203:3002/api';
//  export const API_URL = 'https://1d32-2405-201-5012-38a5-dd15-1b1-4413-5846.ngrok-free.app/api';

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  SOCIETIES: '/societies',
  // SOCIETY_RESIDENTS: (code: string) => `/societies/${code}/residents`,
  SOCIETY_RESIDENTS: (code: string) => `/societies/residents/${code}`,
  APPROVE_USER: (code: string, userId: string) => `/societies/${code}/users/${userId}/approve`,
  DISAPPROVE_USER: (id: string) => `/auth/delete/${id}`,
  CASHIER: (code: string) => `/societies/${code}/residents`,
  SOCIETY_COMMITTEE_RESIDENTS: (code: string) => `/societies/${code}/members`,
  FETCH_SOCIETY_POSTS: '/',
  SOCIETY_POSTS: '/create',
  LIKE: (postId: string) => `/${postId}/toggleLikeDislike`,
  COMMENT: (postId: string) => `/${postId}/comment`,
  FETCH_NOTICE_BOARD_POSTS: '/notice/admin',
  CREATE_NOTICE_POST: '/notice/create-notice',
  GET_EXPENSES: '/expense',
  ADD_EXPENSE: '/cashier/add-expense',
  GET_FUNDS: '/funds',
  ADD_FUND: '/cashier/add-fund',
  GET_BALANCE: '/balance',
  GUEST_ENTRY_FROM_USER: '/guest-entries/gatepass',
  GUEST_HISTORY: '/guest-entries/myguests',
  ADD_MANUAL_ENTRY: '/guard-entries/manualEntries',
  GET_GUARD_DETAILS: '/guard-entries/guardDetails',
  VERIFY_CODE: '/guest-entries/verifyCode',
  ALLOW_GUEST: '/guest-entries/allowGuest/:entryId',
  DISALLOW_GUEST: '/guest-entries/disallowGuest/:entryId',
  ALL_GUEST_ENTRIES: '/guest-entries/allGuestEntries',
};

