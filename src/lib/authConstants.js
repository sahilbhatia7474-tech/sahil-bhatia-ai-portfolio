export const AUTHORIZED_FOUNDER_EMAILS = [
  'sahilbhatia7474@gmail.com',
  'sahilbhatia1471@gmail.com',
];

export const FOUNDER_EMAIL = AUTHORIZED_FOUNDER_EMAILS[0];

export const isAuthorizedFounderEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.toLowerCase().trim();
  return AUTHORIZED_FOUNDER_EMAILS.some((founder) => founder.toLowerCase().trim() === normalized);
};
