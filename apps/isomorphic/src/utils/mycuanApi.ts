const MYCUAN_API_URL = process.env.NEXT_PUBLIC_MYCUAN_API_URL;
const REF = process.env.NEXT_PUBLIC_MYCUAN_REF || 'IPG';

export class MyCuanError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(data?.message || `HTTP error! ${status}`);
    this.status = status;
    this.data = data;
  }
}

const postMyCuan = async (
  path: string,
  body: Record<string, any>
): Promise<any> => {
  const res = await fetch(`${MYCUAN_API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new MyCuanError(res.status, data);

  return data;
};

const getMyCuan = async (path: string): Promise<any> => {
  const res = await fetch(`${MYCUAN_API_URL}${path}`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new MyCuanError(res.status, data);

  return data;
};

export const checkMyCuanUser = (no_hp: string) =>
  getMyCuan(`/_users?no_hp=${encodeURIComponent(no_hp)}&ref=${REF}`);

export const requestOtpMyCuan = ({
  no_hp,
  type,
}: {
  no_hp: string;
  type: string;
}) => postMyCuan('/_auth/request-otp', { no_hp, ref: REF, type });

export const registerMyCuan = ({
  no_hp,
  full_name,
  referral,
  otp,
}: {
  no_hp: string;
  full_name: string;
  referral?: string;
  otp: string;
}) => postMyCuan('/_auth/register', { no_hp, ref: REF, full_name, referral, otp });

export const loginMyCuan = ({
  no_hp,
  otp,
  device = 'web',
}: {
  no_hp: string;
  otp?: string;
  device?: string;
}) =>
  postMyCuan('/_auth/login', {
    no_hp,
    ref: REF,
    device,
    ...(otp ? { otp } : {}),
  });

export const getMyCuanSsoUrl = (token: string) =>
  `${MYCUAN_API_URL}/_auth/sso?token=${token}&ref=${REF}`;

export const getMyCuanErrorMessage = (err: any, fallback: string) => {
  const message = err?.data?.message;
  const fieldErrors = err?.data?.data;

  const details =
    fieldErrors && typeof fieldErrors === 'object'
      ? Object.values(fieldErrors).filter(Boolean).join(', ')
      : '';

  if (message && details) return `${message}: ${details}`;

  return message || details || fallback;
};
